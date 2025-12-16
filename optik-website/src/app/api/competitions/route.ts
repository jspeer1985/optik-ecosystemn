import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const active = searchParams.get('active') === 'true';

        // Fetch competitions
        const query = supabase
            .from('competitions')
            .select('*')
            .order('end_time', { ascending: true });

        if (active) {
            query.gt('end_time', new Date().toISOString());
        }

        const { data, error } = await query;

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(getMockCompetitions());
        }

        // Transform data
        const competitions = data.map(comp => ({
            id: comp.id,
            name: comp.name,
            prize: `${comp.prize_pool.toLocaleString()} OPTIK`,
            prizePool: comp.prize_pool,
            participants: comp.participant_count || 0,
            timeLeft: calculateTimeLeft(comp.end_time),
            type: comp.competition_type,
            icon: getCompetitionIcon(comp.competition_type),
            startTime: comp.start_time,
            endTime: comp.end_time,
        }));

        return NextResponse.json({ competitions });
    } catch (error) {
        console.error('Error fetching competitions:', error);
        return NextResponse.json(getMockCompetitions());
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { walletAddress, competitionId } = body;

        if (!walletAddress || !competitionId) {
            return NextResponse.json(
                { error: 'Wallet address and competition ID required' },
                { status: 400 }
            );
        }

        // Check if already joined
        const { data: existing } = await supabase
            .from('competition_entries')
            .select('*')
            .eq('wallet_address', walletAddress)
            .eq('competition_id', competitionId)
            .single();

        if (existing) {
            return NextResponse.json(
                { error: 'Already joined this competition' },
                { status: 400 }
            );
        }

        // Join competition
        const { data, error } = await supabase
            .from('competition_entries')
            .insert({
                wallet_address: walletAddress,
                competition_id: competitionId,
                joined_at: new Date().toISOString(),
            })
            .select();

        if (error) {
            console.error('Error joining competition:', error);
            return NextResponse.json(
                { error: 'Failed to join competition' },
                { status: 500 }
            );
        }

        // Increment participant count
        await supabase.rpc('increment_competition_participants', {
            comp_id: competitionId,
        });

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Error in POST /api/competitions:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

function getMockCompetitions() {
    return {
        competitions: [
            {
                id: 1,
                name: 'Weekly Thunder',
                prize: '50,000 OPTIK',
                prizePool: 50000,
                participants: 1247,
                timeLeft: '2d 14h',
                type: 'volume',
                icon: '⚡',
            },
            {
                id: 2,
                name: 'PnL Masters',
                prize: '100,000 OPTIK',
                prizePool: 100000,
                participants: 892,
                timeLeft: '5d 8h',
                type: 'profit',
                icon: '🏆',
            },
            {
                id: 3,
                name: 'Streak Challenge',
                prize: '25,000 OPTIK',
                prizePool: 25000,
                participants: 2134,
                timeLeft: '12h 45m',
                type: 'streak',
                icon: '🔥',
            },
        ],
    };
}

function calculateTimeLeft(endTime: string): string {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}

function getCompetitionIcon(type: string): string {
    const icons: Record<string, string> = {
        volume: '⚡',
        profit: '🏆',
        streak: '🔥',
        pnl: '💰',
    };
    return icons[type] || '🎯';
}
