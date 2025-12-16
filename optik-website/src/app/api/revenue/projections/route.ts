import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const tokensPerDay = 20;
  const dailyTotal = 7025;

  return NextResponse.json({
    projections: {
      daily: dailyTotal,
      weekly: dailyTotal * 7,
      monthly: dailyTotal * 30,
    },
  });
}
