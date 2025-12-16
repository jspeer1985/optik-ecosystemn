'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Loader2, Coins, CreditCard, Zap, Crown, CheckCircle2, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CREDIT_PACKS = [
    {
        id: 'small',
        name: 'Starter Pack',
        amount: 25,
        optik: 500,
        icon: Coins,
        color: 'from-blue-500 to-cyan-500',
        features: ['500 OPTIK', 'Instant Delivery', 'Support the Devs']
    },
    {
        id: 'medium',
        name: 'Pro Pack',
        amount: 50,
        optik: 1100,
        icon: Zap,
        color: 'from-rose-500 to-pink-500',
        popular: true,
        features: ['1,000 OPTIK', 'Bonus 100 OPTIK', 'Priority Support']
    },
    {
        id: 'large',
        name: 'Whale Pack',
        amount: 100,
        optik: 2500,
        icon: Crown,
        color: 'from-amber-400 to-orange-500',
        features: ['2,000 OPTIK', 'Bonus 500 OPTIK', 'Exclusive Badge']
    }
];

export default function PurchaseCredits() {
    const { publicKey, connected } = useWallet();
    const [loading, setLoading] = useState<string | null>(null);

    const handlePurchase = async (packageId: string) => {
        if (!connected || !publicKey) {
            toast.error('Please connect your wallet first');
            return;
        }

        setLoading(packageId);

        // Special integration for valid Payment Links
        if (packageId === 'small') {
            // Use the user-provided Payment Link
            // We append client_reference_id so the webhook knows who paid
            const baseUrl = 'https://buy.stripe.com/3cI28ke204V208A36n0ZW00';
            const url = `${baseUrl}?client_reference_id=${publicKey.toBase58()}`;
            window.location.href = url;
            return;
        }

        try {
            const response = await fetch('/api/stripe/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    walletAddress: publicKey.toBase58(),
                    packageId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create checkout session');
            }

            const { url } = await response.json();
            window.location.href = url;
        } catch (error) {
            console.error('Purchase error:', error);
            toast.error('Failed to initiate purchase');
            setLoading(null);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-rose-400 bg-clip-text text-transparent">
                    OptiK Store
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Purchase OPTIK tokens directly to play games and unlock rewards.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {CREDIT_PACKS.map((pkg) => (
                    <div
                        key={pkg.id}
                        className={`relative bg-slate-900/50 rounded-2xl border ${pkg.popular ? 'border-rose-500 shadow-[0_0_30px_rgba(168,85,247,0.15)]' : 'border-slate-800'} overflow-hidden hover:border-slate-600 transition-all group flex flex-col`}
                    >
                        {pkg.popular && (
                            <div className="absolute top-0 right-0 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl z-20">
                                MOST POPULAR
                            </div>
                        )}

                        <div className={`p-6 bg-gradient-to-br ${pkg.color} bg-opacity-10 relative overflow-hidden`}>
                            <div className="absolute inset-0 bg-slate-950/80" />
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${pkg.color} flex items-center justify-center mb-4 shadow-lg`}>
                                    <pkg.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1">{pkg.name}</h3>
                                <div className="text-3xl font-bold text-white flex items-center justify-center gap-1">
                                    ${pkg.amount}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-6 flex-1 flex flex-col">
                            <ul className="space-y-3 flex-1">
                                {pkg.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handlePurchase(pkg.id)}
                                disabled={loading !== null || !connected}
                                className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${pkg.popular
                                    ? 'bg-gradient-to-r from-rose-600 to-pink-600 hover:scale-105 shadow-lg shadow-rose-500/25'
                                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {loading === pkg.id ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5" />
                                        Purchase Now
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-slate-900/30 p-6 rounded-xl border border-slate-800/50 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Secure Payment via Stripe
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Cancel Anytime
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Instant Activation
                </div>
            </div>
        </div>
    );
}
