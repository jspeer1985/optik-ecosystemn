'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import dynamic from 'next/dynamic';



function MemecoinFactoryContent() {
  const { connected } = useWallet();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    liquiditySOL: 1,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="text-2xl text-white">Loading...</div></div>;

  if (!connected) {
    return (
      <div className="min-h-screen bg-quantum-darker flex items-center justify-center p-4">
        <div className="holo-card text-center p-12">
          <h1 className="text-4xl font-bold mb-4 text-gradient">Launch Your Memecoin</h1>
          <WalletMultiButton />
        </div>
      </div>
    );
  }

  const totalCost = 0.5 + formData.liquiditySOL + 0.0125;

  return (
    <div className="min-h-screen bg-quantum-darker p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-6 text-center text-gradient">Launch With Vault</h1>

        <div className="holo-card">
          <h2 className="text-2xl font-bold mb-4">Create Token</h2>
          <div className="space-y-4">
            <input
              type="text"
              className="input-quantum"
              placeholder="Token Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="text"
              className="input-quantum"
              placeholder="Symbol"
              value={formData.symbol}
              onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
            />
            <input
              type="number"
              className="input-quantum"
              placeholder="Liquidity SOL"
              value={formData.liquiditySOL}
              onChange={(e) => setFormData({ ...formData, liquiditySOL: parseFloat(e.target.value) })}
            />

            <div className="glass-quantum p-4 border-2 border-green-500/50">
              <h3 className="font-bold mb-2">Cost Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Launch Fee:</span>
                  <span>0.5 SOL</span>
                </div>
                <div className="flex justify-between">
                  <span>Liquidity (locked 90 days):</span>
                  <span>{formData.liquiditySOL} SOL</span>
                </div>
                <div className="flex justify-between text-yellow-400">
                  <span>Platform Fee (2.5%):</span>
                  <span>0.0125 SOL</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-gradient">{totalCost.toFixed(4)} SOL</span>
                </div>
              </div>
            </div>

            <button className="btn-quantum w-full text-xl py-4">
              Launch Token
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(MemecoinFactoryContent), { ssr: false });
