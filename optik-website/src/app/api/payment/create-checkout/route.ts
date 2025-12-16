import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const TIER_PRICING = {
  BASIC: 10000,    // $100 in cents
  STANDARD: 50000,  // $500 in cents
  PREMIUM: 250000,  // $2500 in cents
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tier, creatorWallet, tokenName, tokenSymbol, liquiditySOL } = body;

    if (!TIER_PRICING[tier as keyof typeof TIER_PRICING]) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
    }

    const basePrice = TIER_PRICING[tier as keyof typeof TIER_PRICING];
    const platformFee = Math.floor(basePrice * 0.025); // 2.5%
    const totalAmount = basePrice + platformFee;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${tier} Token Launch`,
              description: `Launch ${tokenSymbol} with ${liquiditySOL} SOL liquidity`,
              images: ['https://optik.finance/logo.png'],
            },
            unit_amount: totalAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/memecoin-factory`,
      metadata: {
        tier,
        creatorWallet,
        tokenName,
        tokenSymbol,
        liquiditySOL: liquiditySOL.toString(),
        platformFee: platformFee.toString(),
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment failed' },
      { status: 500 }
    );
  }
}
