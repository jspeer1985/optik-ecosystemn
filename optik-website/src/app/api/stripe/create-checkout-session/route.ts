import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

// TODO: Replace this with your actual OPTIK Token Logo URL
const OPTIK_IMAGE_URL = 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png';

interface Package {
    name: string;
    description: string;
    amount: number;
    optik: number;
    images: string[];
    interval?: 'month' | 'year';
}

const PACKAGES: Record<string, Package> = {
    'small': {
        name: 'Starter Pack',
        description: '500 OPTIK Tokens',
        amount: 2500, // $25.00
        optik: 500,
        images: [OPTIK_IMAGE_URL],
    },
    'medium': {
        name: 'Pro Pack',
        description: '1,000 OPTIK + 100 Bonus!',
        amount: 5000, // $50.00
        optik: 1100,
        images: [OPTIK_IMAGE_URL],
    },
    'large': {
        name: 'Whale Pack',
        description: '2,000 OPTIK + 500 Bonus!',
        amount: 10000, // $100.00
        optik: 2500,
        images: [OPTIK_IMAGE_URL],
    },
};

export async function POST(req: Request) {
    try {
        const { walletAddress, packageId } = await req.json();

        if (!walletAddress) {
            return new NextResponse('Wallet address is required', { status: 400 });
        }

        const pkg = PACKAGES[packageId as keyof typeof PACKAGES];
        if (!pkg) {
            return new NextResponse('Invalid package ID', { status: 400 });
        }

        // Determine if this is a one-time payment or a subscription
        const isSubscription = !!pkg.interval;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: pkg.name,
                            description: pkg.description,
                            images: pkg.images,
                        },
                        unit_amount: pkg.amount,
                        // Add recurring parameters if this is a subscription
                        ...(isSubscription && {
                            recurring: {
                                interval: pkg.interval as 'month' | 'year',
                            },
                        }),
                    },
                    quantity: 1,
                },
            ],
            mode: isSubscription ? 'subscription' : 'payment',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/arcade?purchase=success`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/arcade?purchase=canceled`,
            metadata: {
                walletAddress,
                optikAmount: pkg.optik.toString(),
                packageId,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error('[STRIPE_ERROR]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
