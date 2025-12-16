import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data: revenueData } = await supabase.from('revenue').select('*');
    const { count: totalTokens } = await supabase.from('tokens').select('*', { count: 'exact', head: true });
    const { count: totalTransactions } = await supabase.from('transactions').select('*', { count: 'exact', head: true });

    const totalRevenue = revenueData?.reduce((sum, item) => sum + item.amount, 0) || 0;

    return NextResponse.json({
      totalRevenue,
      revenueBySource: {},
      totalTokens: totalTokens || 0,
      totalTransactions: totalTransactions || 0,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

