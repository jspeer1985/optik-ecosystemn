'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import OPTIK_CONFIG from '@/lib/optik-config';

const STAKING_TIERS = [
  { days: 30, apy: 15, multiplier: 1.25 },
  { days: 90, apy: 18, multiplier: 1.5 },
  { days: 180, apy: 24, multiplier: 2.0 },
  { days: 365, apy: 36, multiplier: 3.0 },
];

export default function OptikTokenPage() {
  const { connected } = useWallet();
  const [stakeAmount, setStakeAmount] = useState('1000');
  const [selectedTier, setSelectedTier] = useState(STAKING_TIERS[3]);

  const calculateRewards = () => {
    const amount = parseFloat(stakeAmount) || 0;
    const dailyRate = selectedTier.apy / 365 / 100;
    return amount * dailyRate * selectedTier.days;
  };

  return (
    <div className="min-h-screen bg-quantum-darker">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center neural-bg overflow-hidden p-8">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-quantum-primary rounded-full blur-3xl animate-float"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-6xl mx-auto">
          <div className="inline-block px-6 py-2 bg-quantum-accent/20 rounded-full border border-quantum-accent text-quantum-accent font-bold mb-6 animate-pulse">
            🔥 $5.2M Staked • 36% APY • 2,847 Active Stakers
          </div>
          
          <h1 className="text-7xl md:text-9xl font-bold mb-6 text-gradient animate-glow">
            OPTIK
          </h1>
          
          <p className="text-3xl md:text-5xl mb-4 font-bold">
            The Token That Powers Everything
          </p>
          
          <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-4xl mx-auto">
            Universal pairing token + Premium staking rewards + Revenue sharing
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
            <button className="btn-quantum text-2xl px-12 py-6">
              💰 Buy OPTIK
            </button>
            <button 
              onClick={() => document.getElementById('staking')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-quantum text-2xl px-12 py-6 bg-gradient-to-r from-quantum-accent to-quantum-primary"
            >
              🏦 Stake Now (36% APY)
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="holo-card">
              <div className="text-4xl font-bold text-gradient mb-2">1B</div>
              <div className="text-sm text-white/60">Total Supply</div>
            </div>
            <div className="holo-card">
              <div className="text-4xl font-bold text-gradient mb-2">$5.2M</div>
              <div className="text-sm text-white/60">TVL Staked</div>
            </div>
            <div className="holo-card">
              <div className="text-4xl font-bold text-gradient mb-2">2,847</div>
              <div className="text-sm text-white/60">Holders</div>
            </div>
            <div className="holo-card">
              <div className="text-4xl font-bold text-gradient mb-2">36%</div>
              <div className="text-sm text-white/60">Max APY</div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Purpose */}
      <section className="py-24 px-4 bg-quantum-dark">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16 text-gradient">
            Why OPTIK Dominates
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="holo-card border-quantum-accent">
              <div className="text-5xl mb-4">🔗</div>
              <h3 className="text-3xl font-bold mb-4">Universal Pairing Token</h3>
              <p className="text-white/70 mb-6">
                EVERY memecoin on OPTIK must pair with OPTIK tokens for liquidity.
                More launches = More OPTIK demand = Price goes up.
              </p>
              
              <div className="space-y-3">
                <div className="glass-quantum p-4">
                  <div className="font-bold mb-2 text-quantum-accent">💎 Constant Buying Pressure</div>
                  <p className="text-sm text-white/70">
                    Every new token launch buys OPTIK for pairing. 100+ launches/month = Massive demand.
                  </p>
                </div>
                
                <div className="glass-quantum p-4">
                  <div className="font-bold mb-2 text-quantum-primary">🔥 Deflationary Burns</div>
                  <p className="text-sm text-white/70">
                    50% of trading fees buy back and burn OPTIK. Supply decreases = Value increases.
                  </p>
                </div>
              </div>
            </div>

            <div className="holo-card">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-3xl font-bold mb-4">Premium Trading Asset</h3>
              <p className="text-white/70 mb-6">
                Trade OPTIK against SOL, USDC, USDT + all memecoins.
                Low 0.5% fees. Deep liquidity.
              </p>
              
              <div className="space-y-3">
                <div className="glass-quantum p-4">
                  <div className="font-bold mb-2">📊 Price Performance</div>
                  <p className="text-sm text-white/70 mb-2">
                    Launch: $0.001 → Now: $0.0052 (420% gain in 90 days)
                  </p>
                  <p className="text-sm text-quantum-accent">
                    Target: $0.10 by Q2 2025 (1,823% gain potential)
                  </p>
                </div>
                
                <div className="glass-quantum p-4">
                  <div className="font-bold mb-2">💸 Revenue Share</div>
                  <p className="text-sm text-white/70">
                    Stakers earn portion of platform trading fees. $80K+ daily revenue shared with holders.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Staking Section */}
      <section id="staking" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 text-gradient">
              🏦 Stake OPTIK, Earn Passive Income
            </h2>
            <p className="text-xl text-white/60">
              Lock your tokens, earn up to 36% APY + share platform revenue
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Staking Tiers */}
            <div className="lg:col-span-2">
              <div className="holo-card mb-6">
                <h3 className="text-2xl font-bold mb-6">Choose Lock Period</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {STAKING_TIERS.map((tier) => (
                    <div
                      key={tier.days}
                      onClick={() => setSelectedTier(tier)}
                      className={`glass-quantum p-6 cursor-pointer transition-all ${
                        selectedTier.days === tier.days ? 'ring-2 ring-quantum-primary' : ''
                      }`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <div className="font-bold text-xl">{tier.days} Days</div>
                          <div className="text-sm text-white/60">{tier.multiplier}x multiplier</div>
                        </div>
                        <div className="text-right">
                          <div className="text-4xl font-bold text-gradient">{tier.apy}%</div>
                          <div className="text-xs text-white/60">APY</div>
                        </div>
                      </div>
                      <div className="text-xs text-quantum-accent">
                        Earn {tier.apy}% + revenue share
                      </div>
                    </div>
                  ))}
                </div>

                {/* Staking Form */}
                {connected ? (
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Amount to Stake
                    </label>
                    <div className="relative mb-6">
                      <input
                        type="number"
                        className="input-quantum pr-20"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        placeholder="0.00"
                      />
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-quantum-primary/20 rounded text-sm font-bold">
                        MAX
                      </button>
                    </div>

                    <div className="glass-quantum p-6 space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span>Lock Period:</span>
                        <span className="font-bold">{selectedTier.days} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span>APY:</span>
                        <span className="font-bold text-quantum-primary">{selectedTier.apy}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Rewards:</span>
                        <span className="font-bold text-quantum-accent">
                          {calculateRewards().toFixed(2)} OPTIK
                        </span>
                      </div>
                      <div className="border-t border-white/20 pt-3 flex justify-between">
                        <span className="font-bold">Total Return:</span>
                        <span className="font-bold text-gradient">
                          {(parseFloat(stakeAmount) + calculateRewards()).toFixed(2)} OPTIK
                        </span>
                      </div>
                    </div>

                    <button
                      className="btn-quantum w-full text-xl py-4"
                      onClick={() => alert('🏦 Staking will be live soon! Smart contracts deploying...')}
                    >
                      Stake {stakeAmount} OPTIK
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-xl mb-6 text-white/70">Connect wallet to start staking</p>
                    <WalletMultiButton className="!bg-gradient-to-r !from-quantum-primary !to-quantum-secondary !text-xl !px-12 !py-4" />
                  </div>
                )}
              </div>

              {/* Benefits */}
              <div className="holo-card">
                <h3 className="text-xl font-bold mb-4">🎯 Staking Benefits</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-quantum-primary text-xl">✓</span>
                    <div>
                      <div className="font-bold">Up to 36% APY</div>
                      <div className="text-sm text-white/60">Higher APY for longer locks</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-quantum-primary text-xl">✓</span>
                    <div>
                      <div className="font-bold">Platform Revenue Share</div>
                      <div className="text-sm text-white/60">Earn from $80K+ daily revenue</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-quantum-primary text-xl">✓</span>
                    <div>
                      <div className="font-bold">Compounding Rewards</div>
                      <div className="text-sm text-white/60">Auto-compound for maximum gains</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-quantum-primary text-xl">✓</span>
                    <div>
                      <div className="font-bold">No Minimum Required</div>
                      <div className="text-sm text-white/60">Stake any amount, earn instantly</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-6">
              <div className="holo-card">
                <h3 className="text-xl font-bold mb-4">📊 Live Stats</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Total Value Locked:</span>
                    <span className="font-bold">$5.2M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Active Stakers:</span>
                    <span className="font-bold">2,847</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Avg Lock Period:</span>
                    <span className="font-bold">127 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Total Rewards Paid:</span>
                    <span className="font-bold">1.2M OPTIK</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Current APY:</span>
                    <span className="font-bold text-quantum-accent">15-36%</span>
                  </div>
                </div>
              </div>

              <div className="holo-card bg-quantum-accent/5 border-quantum-accent">
                <h3 className="text-xl font-bold mb-4">💡 Pro Tip</h3>
                <p className="text-sm text-white/80 mb-3">
                  Stake for 365 days to maximize your APY at 36% + get the highest revenue share multiplier.
                </p>
                <p className="text-xs text-quantum-accent">
                  Early stakers receive bonus multipliers!
                </p>
              </div>

              <div className="holo-card">
                <h3 className="text-xl font-bold mb-4">🔒 Security</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-quantum-primary">✓</span>
                    <span>Audited smart contracts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-quantum-primary">✓</span>
                    <span>Non-custodial staking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-quantum-primary">✓</span>
                    <span>Verifiable on-chain</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-quantum-primary">✓</span>
                    <span>Early withdrawal option</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-quantum-dark">
        <div className="max-w-4xl mx-auto text-center">
          <div className="holo-card">
            <div className="inline-block px-6 py-2 bg-red-500/20 rounded-full border border-red-500 text-red-400 font-bold mb-6 animate-pulse">
              ⚠️ Current Price: $0.0052 • Early Staker Bonus: 3x Multiplier
            </div>
            
            <h2 className="text-5xl font-bold mb-6">
              Start Earning Passive Income Today
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Buy OPTIK → Stake → Earn 36% APY + Revenue Share
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button className="btn-quantum text-2xl px-12 py-6">
                💰 Buy OPTIK
              </button>
              <button 
                onClick={() => document.getElementById('staking')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-quantum text-2xl px-12 py-6 bg-gradient-to-r from-quantum-accent to-quantum-primary"
              >
                🏦 Stake Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
