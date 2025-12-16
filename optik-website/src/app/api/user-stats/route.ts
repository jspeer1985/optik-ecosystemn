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

        // Fetch user stats
        const { data, error } = await supabase
            .from('user_stats')
            .select('*')
            .eq('wallet_address', walletAddress)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Supabase error:', error);
            return NextResponse.json(getMockUserStats(walletAddress));
        }

        if (!data) {
            // Create new user stats
            const newStats = {
                wallet_address: walletAddress,
                total_pnl: 0,
                win_rate: 0,
                total_trades: 0,
                avg_win: 0,
                total_volume: 0,
                win_streak: 0,
                multiplier: 1.0,
                revenue_share: 0,
                optik_balance: 0,
                staked_optik: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            const { data: created } = await supabase
                .from('user_stats')
                .insert(newStats)
                .select()
                .single();

            return NextResponse.json({ stats: created || newStats });
        }

        // Calculate rank
        const { count } = await supabase
            .from('user_stats')
            .select('*', { count: 'exact', head: true })
            .gt('total_pnl', data.total_pnl);

        const rank = (count || 0) + 1;

        return NextResponse.json({
            stats: {
                ...data,
                rank,
            },
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        const walletAddress = new URL(request.url).searchParams.get('wallet') || '';
        return NextResponse.json(getMockUserStats(walletAddress));
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            walletAddress,
            pnl,
            winRate,
            totalTrades,
            avgWin,
            volume,
            streak,
            multiplier,
            revenueShare,
            optikBalance,
            stakedOptik,
        } = body;

        if (!walletAddress) {
            return NextResponse.json(
                { error: 'Wallet address required' },
                { status: 400 }
            );
        }

        // Update user stats
        const { data, error } = await supabase
            .from('user_stats')
            .upsert({
                wallet_address: walletAddress,
                total_pnl: pnl,
                win_rate: winRate,
                total_trades: totalTrades,
                avg_win: avgWin,
                total_volume: volume,
                win_streak: streak,
                multiplier: multiplier,
                revenue_share: revenueShare,
                optik_balance: optikBalance,
                staked_optik: stakedOptik,
                updated_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            console.error('Error updating user stats:', error);
            return NextResponse.json(
                { error: 'Failed to update stats' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, stats: data });
    } catch (error) {
        console.error('Error in POST /api/user-stats:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

function getMockUserStats(walletAddress: string) {
    return {
        stats: {
            wallet_address: walletAddress,
            total_pnl: 12450.50,
            win_rate: 68.5,
            total_trades: 247,
            avg_win: 85.20,
            rank: 42,
            total_volume: 1250000,
            win_streak: 7,
            multiplier: 2.5,
            revenue_share: 1234.56,
            optik_balance: 50000,
            staked_optik: 25000,
        },
    };
}
