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

        const { data, error } = await supabase
            .from('arcade_leaderboard')
            .select('*')
            .order('rank', { ascending: true })
            .limit(limit);

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ leaderboard: [] });
        }

        const leaderboard = data.map(entry => ({
            rank: entry.rank,
            walletAddress: entry.wallet_address,
            username: entry.username || `Player${entry.wallet_address.slice(0, 6)}`,
            totalScore: entry.total_score,
            totalOptikEarned: parseFloat(entry.total_optik_earned),
            gamesPlayed: entry.games_played,
            achievementsUnlocked: entry.achievements_unlocked,
            highestScore: entry.highest_score,
        }));

        return NextResponse.json({ leaderboard });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return NextResponse.json({ leaderboard: [] });
    }
}
