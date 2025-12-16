import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const type = searchParams.get('type') || 'pnl'; // pnl, volume, winrate

        // Fetch leaderboard data
        const { data, error } = await supabase
            .from('user_stats')
            .select('*')
            .order(type === 'pnl' ? 'total_pnl' : type === 'volume' ? 'total_volume' : 'win_rate', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Supabase error:', error);
            // Return mock data if database fails
            return NextResponse.json(getMockLeaderboard());
        }

        // Transform data
        const leaderboard = data.map((user, index) => ({
            rank: index + 1,
            user: user.username || `Trader${user.wallet_address.slice(0, 6)}`,
            walletAddress: user.wallet_address,
            pnl: user.total_pnl || 0,
            volume: user.total_volume || 0,
            winRate: user.win_rate || 0,
            totalTrades: user.total_trades || 0,
            avatar: getRandomAvatar(),
        }));

        return NextResponse.json({ leaderboard });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return NextResponse.json(getMockLeaderboard());
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { walletAddress, pnl, volume, trades } = body;

        if (!walletAddress) {
            return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
        }

        // Update or insert user stats
        const { data, error } = await supabase
            .from('user_stats')
            .upsert({
                wallet_address: walletAddress,
                total_pnl: pnl,
                total_volume: volume,
                total_trades: trades,
                updated_at: new Date().toISOString(),
            })
            .select();

        if (error) {
            console.error('Error updating stats:', error);
            return NextResponse.json({ error: 'Failed to update stats' }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Error in POST /api/leaderboard:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

function getMockLeaderboard() {
    return {
        leaderboard: [
            { rank: 1, user: 'TradeKing', pnl: 45230.50, volume: 5200000, winRate: 72.5, totalTrades: 342, avatar: '👑' },
            { rank: 2, user: 'MoonShot', pnl: 38920.25, volume: 4100000, winRate: 68.3, totalTrades: 298, avatar: '🚀' },
            { rank: 3, user: 'DeFiPro', pnl: 32450.75, volume: 3800000, winRate: 65.1, totalTrades: 267, avatar: '💎' },
            { rank: 4, user: 'LeverageKing', pnl: 28100.00, volume: 3200000, winRate: 63.8, totalTrades: 245, avatar: '⚡' },
            { rank: 5, user: 'OptionMaster', pnl: 25340.50, volume: 2900000, winRate: 61.2, totalTrades: 223, avatar: '🎯' },
        ],
    };
}

function getRandomAvatar() {
    const avatars = ['👑', '🚀', '💎', '⚡', '🎯', '🔥', '💪', '🌟', '🏆', '⭐'];
    return avatars[Math.floor(Math.random() * avatars.length)];
}
