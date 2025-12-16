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
        const gameId = searchParams.get('gameId');

        if (!walletAddress) {
            return NextResponse.json(
                { error: 'Wallet address required' },
                { status: 400 }
            );
        }

        let query = supabase
            .from('daily_rewards')
            .select('*')
            .eq('wallet_address', walletAddress)
            .eq('date', new Date().toISOString().split('T')[0]);

        if (gameId) {
            query = query.eq('game_id', gameId);
        }

        const { data, error } = await query;

        if (error && error.code !== 'PGRST116') {
            console.error('Supabase error:', error);
            return NextResponse.json({ stats: {} });
        }

        // If fetching for specific game
        if (gameId && data) {
            const stats = data[0] || {
                total_optik_earned: 0,
                games_played: 0,
                best_score: 0,
            };
            return NextResponse.json({
                stats: {
                    totalOptikEarned: parseFloat(stats.total_optik_earned),
                    gamesPlayed: stats.games_played,
                    bestScore: stats.best_score,
                }
            });
        }

        // If fetching all daily stats
        const totalDailyEarned = (data || []).reduce(
            (sum, entry) => sum + parseFloat(entry.total_optik_earned),
            0
        );

        return NextResponse.json({
            stats: {
                totalDailyEarned,
                gamesPlayed: (data || []).length, // Distinct games played today
            }
        });

    } catch (error) {
        console.error('Error fetching daily stats:', error);
        return NextResponse.json({ stats: {} });
    }
}
