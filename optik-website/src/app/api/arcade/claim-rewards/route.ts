import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { walletAddress } = body;

        if (!walletAddress) {
            return NextResponse.json(
                { error: 'Wallet address required' },
                { status: 400 }
            );
        }

        // 1. Get all pending unclaimed rewards
        const { data: pending, error: fetchError } = await supabase
            .from('pending_rewards')
            .select('id, amount')
            .eq('wallet_address', walletAddress)
            .eq('claimed', false)
            .gte('expires_at', new Date().toISOString());

        if (fetchError || !pending || pending.length === 0) {
            return NextResponse.json(
                { error: 'No rewards to claim' },
                { status: 400 }
            );
        }

        const totalAmount = pending.reduce((sum, r) => sum + parseFloat(r.amount), 0);
        const rewardIds = pending.map(r => r.id);

        // 2. Mark rewards as claimed
        const { error: updateError } = await supabase
            .from('pending_rewards')
            .update({
                claimed: true,
                claimed_at: new Date().toISOString()
            })
            .in('id', rewardIds);

        if (updateError) {
            console.error('Error updating rewards:', updateError);
            return NextResponse.json(
                { error: 'Failed to update rewards status' },
                { status: 500 }
            );
        }

        // 3. Record claim history
        // In production, initiate Solana transaction here
        const transactionSignature = `mock_tx_${Date.now()}`;

        await supabase.from('reward_claims').insert({
            wallet_address: walletAddress,
            amount: totalAmount,
            transaction_signature: transactionSignature,
            status: 'completed',
            completed_at: new Date().toISOString()
        });

        // 4. Update user achievements claim status if necessary
        // (This logic could be more complex depending on specific achievement logic)

        return NextResponse.json({
            success: true,
            amount: totalAmount,
            transactionSignature,
            rewardsClaimed: rewardIds.length
        });

    } catch (error) {
        console.error('Error claiming rewards:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
