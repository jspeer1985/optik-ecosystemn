import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('arcade_games')
            .select('*')
            .eq('is_active', true)
            .order('name');

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ games: [] });
        }

        const games = data.map(game => ({
            id: game.id,
            name: game.name,
            description: game.description,
            rewardPerScore: game.reward_per_score,
            maxDailyReward: game.max_daily_reward,
            difficulty: game.difficulty,
        }));

        return NextResponse.json({ games });
    } catch (error) {
        console.error('Error fetching games:', error);
        return NextResponse.json({ games: [] });
    }
}
