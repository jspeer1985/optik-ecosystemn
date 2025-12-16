import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata!;

    // Log payment received
    await supabase.from('transactions').insert({
      user_wallet: metadata.creatorWallet,
      transaction_type: 'token_creation',
      amount: (session.amount_total! / 100), // Convert cents to dollars
      signature: session.id,
      platform_fee: parseFloat(metadata.platformFee) / 100,
      status: 'confirmed',
    });

    // Log revenue
    await supabase.from('revenue').insert({
      source: 'token_creation',
      amount: (session.amount_total! / 100),
      currency: 'USD',
    });

    console.log('Payment confirmed:', {
      sessionId: session.id,
      wallet: metadata.creatorWallet,
      tier: metadata.tier,
      amount: session.amount_total! / 100,
    });
  }

  return NextResponse.json({ received: true });
}
