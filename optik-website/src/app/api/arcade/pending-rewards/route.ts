import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const walletAddress = searchParams.get('wallet');

        if (!walletAddress) {
            return NextResponse.json(
                { error: 'Wallet address required' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('pending_rewards')
            .select('*')
            .eq('wallet_address', walletAddress)
            .eq('claimed', false)
            .gte('expires_at', new Date().toISOString());

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ rewards: [] });
        }

        const rewards = data.map(reward => ({
            id: reward.id,
            amount: parseFloat(reward.amount),
            source: reward.source,
            createdAt: reward.created_at,
            expiresAt: reward.expires_at,
        }));

        return NextResponse.json({ rewards });
    } catch (error) {
        console.error('Error fetching pending rewards:', error);
        return NextResponse.json({ rewards: [] });
    }
}
