import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { walletAddress, gameId, score, durationSeconds } = body;

        if (!walletAddress || !gameId || score === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Call the database function to record session and calculate rewards
        const { data, error } = await supabase.rpc('record_game_session', {
            p_wallet_address: walletAddress,
            p_game_id: gameId,
            p_score: score,
            p_duration_seconds: durationSeconds || 0,
        });

        if (error) {
            console.error('Error recording game session:', error);
            return NextResponse.json(
                { error: 'Failed to record session' },
                { status: 500 }
            );
        }

        const result = data[0];

        return NextResponse.json({
            success: true,
            sessionId: result.session_id,
            optikEarned: parseFloat(result.optik_earned),
        });
    } catch (error) {
        console.error('Error in POST /api/arcade/submit-score:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
