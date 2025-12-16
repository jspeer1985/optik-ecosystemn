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

        // Get all achievements
        const { data: allAchievements, error: achievementsError } = await supabase
            .from('achievements')
            .select('*')
            .eq('is_active', true);

        if (achievementsError) {
            throw achievementsError;
        }

        // Get user's unlocked achievements
        const { data: userAchievements, error: userError } = await supabase
            .from('user_achievements')
            .select('achievement_id, unlocked_at, claimed')
            .eq('wallet_address', walletAddress);

        if (userError) {
            throw userError;
        }

        // Map unlocked status to all achievements
        const achievements = allAchievements.map(achievement => {
            const userAchievement = userAchievements?.find(
                ua => ua.achievement_id === achievement.id
            );

            return {
                id: achievement.id,
                name: achievement.name,
                description: achievement.description,
                icon: achievement.icon,
                requirementType: achievement.requirement_type,
                requirementValue: achievement.requirement_value,
                rewardOptik: parseFloat(achievement.reward_optik),
                unlocked: !!userAchievement,
                unlockedAt: userAchievement?.unlocked_at,
                claimed: userAchievement?.claimed || false,
            };
        });

        return NextResponse.json({ achievements });
    } catch (error) {
        console.error('Error fetching achievements:', error);
        return NextResponse.json({ achievements: [] });
    }
}
