import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin Client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    const body = await req.text();
    const headerList = await headers();
    const signature = headerList.get('Stripe-Signature') as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        console.error(`Webhook signature verification failed: ${error.message}`);
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any;
        // Support both Metadata (API) and Client Reference ID (Payment Links)
        const walletAddress = session.metadata?.walletAddress || session.client_reference_id;
        // For Payment Links, optikAmount might not be in metadata. 
        // We default to a calculation or a fixed amount if missing, or trust the amount_total.
        // For this specific link, we'll calculate based on amount paid (e.g. 1 cent = 1 OPTIK for simplicity, or use metadata if added to link)
        // improved logic:
        const optikAmount = session.metadata?.optikAmount || (session.amount_total / 100 * 20).toString(); // Fallback: $1 = 20 OPTIK approx logic, or 500 for $25.

        console.log(`Processing purchase for ${walletAddress}: ${optikAmount} OPTIK`);

        if (!walletAddress) {
            console.error('Missing wallet address in Stripe session');
            return new NextResponse('Missing user identifier', { status: 400 });
        }

        try {
            // 1. Record in 'payments' table (if it exists, ensuring audit trail)
            // We'll try-catch this separately in case the table doesn't exist yet
            try {
                await supabase.from('payments').insert({
                    stripe_session_id: session.id,
                    stripe_payment_intent: session.payment_intent,
                    amount: session.amount_total,
                    currency: session.currency,
                    status: 'completed',
                    metadata: session.metadata,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });
            } catch (e) {
                console.warn('Could not record to payments table (might not exist yet)', e);
            }

            // 2. Add to pending_rewards for the user to claim
            // Check for duplicates first (idempotency)
            const { data: existingReward } = await supabase
                .from('pending_rewards')
                .select('id')
                .eq('source_id', session.id)
                .single();

            if (existingReward) {
                console.log(`Reward for session ${session.id} already processed.`);
                return new NextResponse('Already processed', { status: 200 });
            }

            const { error } = await supabase.from('pending_rewards').insert({
                wallet_address: walletAddress,
                amount: parseFloat(optikAmount),
                source: 'purchase', // Matches arcade schema
                source_id: session.id, // Ensure unique claim per purchase
                expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year expiry
            });

            if (error) {
                console.error('Error inserting pending reward:', error);
                return new NextResponse('Database Error', { status: 500 });
            }

        } catch (error) {
            console.error('Error processing webhook:', error);
            return new NextResponse('Internal Error', { status: 500 });
        }
    }

    return new NextResponse('OK', { status: 200 });
}
