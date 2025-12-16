import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, amount, signature } = body;

    const validTypes = ['launch_fees', 'platform_fees', 'trading_fees'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    await supabase.from('transactions').insert({
      user_wallet: process.env.NEXT_PUBLIC_TREASURY_WALLET,
      transaction_type: 'withdrawal',
      amount,
      signature,
      status: 'confirmed',
    });

    return NextResponse.json({ success: true, withdrawn: amount });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
