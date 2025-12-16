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
        const status = searchParams.get('status') || 'open'; // open, closed, all

        if (!walletAddress) {
            return NextResponse.json(
                { error: 'Wallet address required' },
                { status: 400 }
            );
        }

        // Fetch positions
        const query = supabase
            .from('positions')
            .select('*')
            .eq('wallet_address', walletAddress)
            .order('created_at', { ascending: false });

        if (status !== 'all') {
            query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ positions: [] });
        }

        return NextResponse.json({ positions: data || [] });
    } catch (error) {
        console.error('Error fetching positions:', error);
        return NextResponse.json({ positions: [] });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            walletAddress,
            pair,
            side,
            size,
            entryPrice,
            leverage,
            liquidationPrice,
        } = body;

        if (!walletAddress || !pair || !side || !size || !entryPrice) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Create position
        const { data, error } = await supabase
            .from('positions')
            .insert({
                wallet_address: walletAddress,
                pair,
                side,
                size,
                entry_price: entryPrice,
                current_price: entryPrice,
                leverage,
                liquidation_price: liquidationPrice,
                pnl: 0,
                status: 'open',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating position:', error);
            return NextResponse.json(
                { error: 'Failed to create position' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, position: data });
    } catch (error) {
        console.error('Error in POST /api/positions:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { positionId, currentPrice, pnl, status } = body;

        if (!positionId) {
            return NextResponse.json(
                { error: 'Position ID required' },
                { status: 400 }
            );
        }

        // Update position
        const updateData: any = {
            updated_at: new Date().toISOString(),
        };

        if (currentPrice !== undefined) updateData.current_price = currentPrice;
        if (pnl !== undefined) updateData.pnl = pnl;
        if (status) {
            updateData.status = status;
            if (status === 'closed') {
                updateData.closed_at = new Date().toISOString();
                updateData.exit_price = currentPrice;
            }
        }

        const { data, error } = await supabase
            .from('positions')
            .update(updateData)
            .eq('id', positionId)
            .select()
            .single();

        if (error) {
            console.error('Error updating position:', error);
            return NextResponse.json(
                { error: 'Failed to update position' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, position: data });
    } catch (error) {
        console.error('Error in PUT /api/positions:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
