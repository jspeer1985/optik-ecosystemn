'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import dynamic from 'next/dynamic';

function GamesContent() {
  const { connected } = useWallet();
  const [mounted, setMounted] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(10);
  const [activeGame, setActiveGame] = useState('crash');
  
  const [crashMultiplier, setCrashMultiplier] = useState(1.00);
  const [isPlaying, setIsPlaying] = useState(false);
  const [crashed, setCrashed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-2xl text-white animate-pulse">Loading Arcade...</div>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="min-h-screen bg-quantum-darker flex items-center justify-center p-4">
        <div className="holo-card text-center p-12 max-w-2xl">
          <div className="text-6xl mb-6">🎮</div>
          <h1 className="text-5xl font-bold mb-4 text-gradient">OPTIK ARCADE</h1>
          <p className="text-xl text-white/70 mb-8">Play • Win • Earn OPTIK</p>
          <WalletMultiButton className="!bg-gradient-to-r !from-quantum-primary !to-quantum-accent !text-xl !px-12 !py-6" />
        </div>
      </div>
    );
  }

  const playCrash = () => {
    if (isPlaying || betAmount > balance) return;
    
    setBalance(balance - betAmount);
    setIsPlaying(true);
    setCrashed(false);
    setCrashMultiplier(1.00);
    
    const crashPoint = 1 + Math.random() * 9;
    
    const interval = setInterval(() => {
      setCrashMultiplier(prev => {
        const next = prev + 0.01;
        if (next >= crashPoint) {
          clearInterval(interval);
          setCrashed(true);
          setIsPlaying(false);
          return parseFloat(next.toFixed(2));
        }
        return parseFloat(next.toFixed(2));
      });
    }, 50);
  };

  const cashOut = () => {
    if (!isPlaying) return;
    setIsPlaying(false);
    const winAmount = betAmount * crashMultiplier;
    setBalance(balance + winAmount);
  };

  return (
    <div className="min-h-screen bg-quantum-darker p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-6xl font-bold mb-2 text-gradient">🎮 OPTIK ARCADE</h1>
          <p className="text-xl text-white/70">Play • Win • Earn</p>
        </div>

        <div className="holo-card mb-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-white/60">Your Balance</div>
              <div className="text-4xl font-bold text-gradient">{balance.toFixed(2)} OPTIK</div>
            </div>
            <div>
              <div className="text-sm text-white/60 mb-2">Bet Amount</div>
              <input
                type="number"
                className="input-quantum w-32 text-center"
                value={betAmount}
                onChange={(e) => setBetAmount(Math.max(1, parseFloat(e.target.value) || 0))}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
          {[
            { id: 'crash', icon: '🚀', name: 'Crash' },
            { id: 'flip', icon: '🪙', name: 'Flip' },
            { id: 'plinko', icon: '🎰', name: 'Plinko' },
            { id: 'dice', icon: '🎲', name: 'Dice' },
            { id: 'mines', icon: '💣', name: 'Mines' },
            { id: 'wheel', icon: '🎡', name: 'Wheel' },
          ].map(game => (
            <button
              key={game.id}
              onClick={() => setActiveGame(game.id)}
              className={`holo-card p-4 text-center transition-all hover:scale-105 ${
                activeGame === game.id ? 'ring-2 ring-quantum-primary scale-105' : ''
              }`}
            >
              <div className="text-3xl mb-1">{game.icon}</div>
              <div className="text-sm font-bold">{game.name}</div>
            </button>
          ))}
        </div>

        <div className="holo-card min-h-[500px]">
          {activeGame === 'crash' && (
            <div className="text-center py-12">
              <h2 className="text-4xl font-bold mb-8">🚀 CRASH</h2>
              
              <div className="mb-12">
                <div className={`text-9xl font-bold mb-4 ${crashed ? 'text-red-500' : 'text-gradient'}`}>
                  {crashMultiplier.toFixed(2)}x
                </div>
                
                {crashed && (
                  <div className="text-3xl text-red-500 font-bold animate-pulse">
                    💥 CRASHED!
                  </div>
                )}
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={playCrash}
                  disabled={isPlaying}
                  className="btn-quantum text-2xl px-16 py-6 disabled:opacity-50"
                >
                  {isPlaying ? '🚀 Flying...' : `Bet ${betAmount} OPTIK`}
                </button>
                
                {isPlaying && (
                  <button
                    onClick={cashOut}
                    className="bg-green-500 hover:bg-green-600 text-white text-2xl px-16 py-6 rounded-xl font-bold"
                  >
                    💰 Cash Out
                  </button>
                )}
              </div>
            </div>
          )}

          {activeGame !== 'crash' && (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">🚧</div>
              <div className="text-2xl font-bold text-white/70">Coming Soon</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(GamesContent), { ssr: false });
