'use client';

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TrendingUp, Trophy, Target, Users, DollarSign, Activity, BarChart3, Flame, Award, Sparkles, ArrowUpRight, ArrowDownRight, ChevronRight, Rocket, Wallet } from 'lucide-react';

// Import the perpetuals integration (you'll need to create this file)
// import { OptiKPerpetualsIntegration, RevenueDistributor } from '@/lib/perps-integration';

// Define market pair types
type MarketPair = 'SOL-PERP' | 'BTC-PERP' | 'ETH-PERP' | 'OPTIK-PERP';

interface MarketData {
  price: number;
  change24h: number;
  volume: string;
  funding: number;
}

interface UserStats {
  totalPnL: number;
  winRate: number;
  totalTrades: number;
  avgWin: number;
  rank: number;
  volume: number;
  multiplier: number;
  streak: number;
  revenueShare: number;
  optikBalance: number;
  stakedOptik: number;
}

interface Position {
  pair: MarketPair;
  side: 'long' | 'short';
  size: number;
  entry: number;
  current: number;
  pnl: number;
  leverage: number;
}

interface Competition {
  id: number;
  name: string;
  prize: string;
  participants: number;
  timeLeft: string;
  type: string;
  icon: string;
}

export default function IntegratedDashboard() {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number>(0);
  const [activeView, setActiveView] = useState<'overview' | 'perps'>('overview');
  const [activeTab, setActiveTab] = useState('trade');
  const [selectedPair, setSelectedPair] = useState<MarketPair>('SOL-PERP');
  const [leverage, setLeverage] = useState(10);
  const [position, setPosition] = useState<'long' | 'short'>('long');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  // User statistics
  const [userStats, setUserStats] = useState<UserStats>({
    totalPnL: 0,
    winRate: 0,
    totalTrades: 0,
    avgWin: 0,
    rank: 0,
    volume: 0,
    multiplier: 1.0,
    streak: 0,
    revenueShare: 0,
    optikBalance: 0,
    stakedOptik: 0
  });

  // Mock market data (would come from real price feeds)
  const [marketData, setMarketData] = useState<Record<MarketPair, MarketData>>({
    'SOL-PERP': { price: 98.42, change24h: 5.23, volume: '2.4B', funding: 0.01 },
    'BTC-PERP': { price: 43250.50, change24h: -2.15, volume: '8.1B', funding: -0.005 },
    'ETH-PERP': { price: 2245.80, change24h: 3.45, volume: '4.2B', funding: 0.008 },
    'OPTIK-PERP': { price: 0.85, change24h: 12.34, volume: '125M', funding: 0.015 }
  });

  const [openPositions, setOpenPositions] = useState<Position[]>([]);

  const [competitions] = useState<Competition[]>([
    { id: 1, name: 'Weekly Thunder', prize: '50,000 OPTIK', participants: 1247, timeLeft: '2d 14h', type: 'volume', icon: '⚡' },
    { id: 2, name: 'PnL Masters', prize: '100,000 OPTIK', participants: 892, timeLeft: '5d 8h', type: 'profit', icon: '🏆' },
    { id: 3, name: 'Streak Challenge', prize: '25,000 OPTIK', participants: 2134, timeLeft: '12h 45m', type: 'streak', icon: '🔥' }
  ]);

  const [leaderboard] = useState([
    { rank: 1, user: 'TradeKing', pnl: 45230.50, volume: 5200000, avatar: '👑' },
    { rank: 2, user: 'MoonShot', pnl: 38920.25, volume: 4100000, avatar: '🚀' },
    { rank: 3, user: 'DeFiPro', pnl: 32450.75, volume: 3800000, avatar: '💎' },
    { rank: 4, user: 'LeverageKing', pnl: 28100.00, volume: 3200000, avatar: '⚡' },
    { rank: 5, user: 'OptionMaster', pnl: 25340.50, volume: 2900000, avatar: '🎯' }
  ]);

  // Fetch user balance
  useEffect(() => {
    if (connected && publicKey) {
      connection.getBalance(publicKey).then((bal) => {
        setBalance(bal / LAMPORTS_PER_SOL);
      });

      // TODO: Fetch real user stats from blockchain
      loadUserStats();
      loadUserPositions();
    }
  }, [connected, publicKey, connection]);

  // Simulate price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev => {
        const updated = { ...prev };
        (Object.keys(updated) as MarketPair[]).forEach(pair => {
          const change = (Math.random() - 0.5) * 0.5;
          updated[pair].price = Math.max(0, updated[pair].price * (1 + change / 100));
        });
        return updated;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadUserStats = async () => {
    // TODO: Replace with actual blockchain calls
    // const perps = new OptiKPerpetualsIntegration({ connection, wallet, optikMint, programId });
    // const stats = await perps.getUserStats(publicKey);

    // Mock data for now
    setUserStats({
      totalPnL: 12450.50,
      winRate: 68.5,
      totalTrades: 247,
      avgWin: 85.20,
      rank: 42,
      volume: 1250000,
      multiplier: 2.5,
      streak: 7,
      revenueShare: 1234.56,
      optikBalance: 50000,
      stakedOptik: 25000
    });
  };

  const loadUserPositions = async () => {
    // TODO: Fetch real positions from blockchain
    setOpenPositions([
      { pair: 'SOL-PERP', side: 'long', size: 100, entry: 95.20, current: 98.42, pnl: 338.00, leverage: 10 },
      { pair: 'ETH-PERP', side: 'short', size: 50, entry: 2280.50, current: 2245.80, pnl: 1735.00, leverage: 15 }
    ]);
  };

  const calculatePnL = (pos: Position) => {
    const current = marketData[pos.pair]?.price || pos.current;
    if (pos.side === 'long') {
      return ((current - pos.entry) / pos.entry) * pos.size * pos.leverage;
    } else {
      return ((pos.entry - current) / pos.entry) * pos.size * pos.leverage;
    }
  };

  const handleTrade = async () => {
    if (!amount || !connected || !publicKey) return;

    setLoading(true);
    try {
      // TODO: Integrate with actual smart contract
      // const perps = new OptiKPerpetualsIntegration({ connection, wallet, optikMint, programId });
      // await perps.openPosition(marketPda, parseFloat(amount), position === 'long', leverage, marketData[selectedPair].price);

      const newPosition: Position = {
        pair: selectedPair,
        side: position,
        size: parseFloat(amount),
        entry: marketData[selectedPair].price,
        current: marketData[selectedPair].price,
        pnl: 0,
        leverage: leverage
      };

      setOpenPositions([...openPositions, newPosition]);
      setAmount('');
      alert(`✅ ${position.toUpperCase()} position opened for ${selectedPair}!`);
    } catch (error) {
      console.error('Trade failed:', error);
      alert('❌ Trade failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClosePosition = async (pos: Position) => {
    setLoading(true);
    try {
      // TODO: Integrate with actual smart contract
      // await perps.closePosition(marketPda, marketData[pos.pair].price);

      setOpenPositions(openPositions.filter(p => p !== pos));

      // Update user stats
      const pnl = calculatePnL(pos);
      setUserStats(prev => ({
        ...prev,
        totalPnL: prev.totalPnL + pnl,
        totalTrades: prev.totalTrades + 1,
        winRate: pnl > 0 ? prev.winRate + 0.5 : prev.winRate - 0.5,
        streak: pnl > 0 ? prev.streak + 1 : 0
      }));

      alert(`✅ Position closed with PnL: ${pnl > 0 ? '+' : ''}${pnl.toFixed(2)} USD`);
    } catch (error) {
      console.error('Close failed:', error);
      alert('❌ Failed to close position.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCompetition = async () => {
    if (!connected || !publicKey) {
      alert('Please connect your wallet first!');
      return;
    }

    setLoading(true);
    try {
      // TODO: Integrate with actual smart contract
      // await perps.joinCompetition(competitionPda);
      alert(`✅ Successfully joined competition!`);
    } catch (error) {
      console.error('Failed to join:', error);
      alert('❌ Failed to join competition.');
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-8">
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-12 max-w-md text-center border border-purple-500/30">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Connect Your Wallet
          </h1>
          <p className="text-gray-400 mb-8">
            Connect your Solana wallet to access perpetuals trading, competitions, and revenue sharing
          </p>
          <WalletMultiButton className="!bg-gradient-to-r !from-purple-500 !to-pink-500 !text-white !text-xl !px-8 !py-4 !rounded-xl !font-bold" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* DEX Header with View Switcher */}
      <div className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                OptiK DEX
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveView('overview')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${activeView === 'overview'
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500'
                    : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveView('perps')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${activeView === 'perps'
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500'
                    : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                >
                  Perpetuals
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-slate-800/50 px-4 py-2 rounded-lg">
                <div className="text-xs text-gray-400">Balance</div>
                <div className="font-bold">{balance.toFixed(4)} SOL</div>
              </div>
              <WalletMultiButton className="!bg-gradient-to-r !from-purple-500 !to-pink-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {activeView === 'overview' ? (
          // Overview Dashboard
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-purple-400" />
                  <span className="text-sm text-gray-400">Total PnL</span>
                </div>
                <div className="text-3xl font-bold text-green-400">+${userStats.totalPnL.toFixed(2)}</div>
                <div className="text-xs text-gray-400 mt-1">All-time profit</div>
              </div>

              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-gray-400">Win Rate</span>
                </div>
                <div className="text-3xl font-bold text-blue-400">{userStats.winRate}%</div>
                <div className="text-xs text-gray-400 mt-1">{userStats.totalTrades} trades</div>
              </div>

              <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-2xl p-6 border border-orange-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <span className="text-sm text-gray-400">Win Streak</span>
                </div>
                <div className="text-3xl font-bold text-orange-400">{userStats.streak}</div>
                <div className="text-xs text-gray-400 mt-1">{userStats.multiplier}x multiplier</div>
              </div>

              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-gray-400">Global Rank</span>
                </div>
                <div className="text-3xl font-bold text-green-400">#{userStats.rank}</div>
                <div className="text-xs text-gray-400 mt-1">Top 1% traders</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-purple-400" />
                  Quick Trade
                </h2>
                <button
                  onClick={() => setActiveView('perps')}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
                >
                  Open Perpetuals Trading
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  Revenue Share
                </h2>
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-3">
                  <div className="text-sm text-gray-400 mb-1">Claimable</div>
                  <div className="text-2xl font-bold text-green-400">${userStats.revenueShare.toFixed(2)}</div>
                </div>
                <button className="w-full bg-green-500/20 hover:bg-green-500/30 border border-green-500 text-green-400 py-2 rounded-lg font-medium transition-all">
                  Claim Rewards
                </button>
              </div>
            </div>

            {/* Open Positions Overview */}
            {openPositions.length > 0 && (
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  Your Open Positions
                </h2>
                <div className="space-y-3">
                  {openPositions.map((pos, idx) => {
                    const currentPnL = calculatePnL(pos);
                    const pnlPercent = (currentPnL / (pos.size * pos.leverage)) * 100;
                    return (
                      <div key={idx} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`px-3 py-1 rounded-lg font-bold text-sm ${pos.side === 'long' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                              }`}>
                              {pos.side.toUpperCase()}
                            </div>
                            <span className="font-bold">{pos.pair}</span>
                            <span className="text-sm text-gray-400">{pos.leverage}x</span>
                          </div>
                          <div className="text-right">
                            <div className={`text-lg font-bold ${currentPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {currentPnL >= 0 ? '+' : ''}{currentPnL.toFixed(2)} USD
                            </div>
                            <div className="text-sm text-gray-400">
                              ({pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%)
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={() => setActiveView('perps')}
                  className="w-full mt-4 bg-slate-800 hover:bg-slate-700 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                >
                  View All Positions
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Active Competitions */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Active Competitions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {competitions.map(comp => (
                  <div key={comp.id} className="bg-gradient-to-r from-slate-800/50 to-purple-900/20 rounded-xl p-4 border border-purple-500/30">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-2xl mb-1">{comp.icon}</div>
                        <h3 className="font-bold">{comp.name}</h3>
                        <p className="text-xs text-gray-400">{comp.participants.toLocaleString()} participants</p>
                      </div>
                      <div className="text-right">
                        <div className="text-yellow-400 font-bold text-sm">{comp.prize}</div>
                        <div className="text-xs text-gray-400">{comp.timeLeft}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleJoinCompetition()}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-2 rounded-lg font-medium text-sm disabled:opacity-50 transition-all"
                    >
                      Join Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Perpetuals Trading View
          <div>
            {/* Perpetuals Navigation */}
            <div className="mb-6">
              <div className="flex gap-2 bg-slate-900/50 backdrop-blur-xl p-1 rounded-xl border border-slate-700/50">
                {['trade', 'positions', 'competitions', 'leaderboard', 'stats'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${activeTab === tab
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
                      }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Trading Area */}
              <div className="lg:col-span-2 space-y-6">
                {activeTab === 'trade' && (
                  <>
                    {/* Market Overview */}
                    <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-purple-400" />
                        Market Overview
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {(Object.entries(marketData) as [MarketPair, MarketData][]).map(([pair, data]) => (
                          <button
                            key={pair}
                            onClick={() => setSelectedPair(pair)}
                            className={`p-4 rounded-xl border transition-all ${selectedPair === pair
                              ? 'bg-purple-500/20 border-purple-500'
                              : 'bg-slate-800/50 border-slate-700/50 hover:border-purple-500/50'
                              }`}
                          >
                            <div className="font-bold text-sm mb-1">{pair}</div>
                            <div className="text-2xl font-bold mb-1">${data.price.toFixed(2)}</div>
                            <div className={`flex items-center gap-1 text-sm ${data.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {data.change24h >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                              {Math.abs(data.change24h).toFixed(2)}%
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Trading Interface */}
                    <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                          <Target className="w-5 h-5 text-purple-400" />
                          Place Order - {selectedPair}
                        </h2>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setPosition('long')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${position === 'long'
                              ? 'bg-green-500 text-white'
                              : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                              }`}
                          >
                            Long
                          </button>
                          <button
                            onClick={() => setPosition('short')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${position === 'short'
                              ? 'bg-red-500 text-white'
                              : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                              }`}
                          >
                            Short
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">Leverage: {leverage}x</label>
                          <input
                            type="range"
                            min="1"
                            max="100"
                            value={leverage}
                            onChange={(e) => setLeverage(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, rgb(168, 85, 247) 0%, rgb(168, 85, 247) ${leverage}%, rgb(51, 65, 85) ${leverage}%, rgb(51, 65, 85) 100%)`
                            }}
                          />
                          <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>1x</span>
                            <span>50x</span>
                            <span>100x</span>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">Amount (USD)</label>
                          <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-gray-500"
                          />
                        </div>

                        <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Entry Price:</span>
                            <span className="font-medium">${marketData[selectedPair]?.price.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Position Size:</span>
                            <span className="font-medium">${(parseFloat(amount || '0') * leverage).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Est. Liq. Price:</span>
                            <span className="font-medium text-red-400">
                              ${(marketData[selectedPair]?.price * (position === 'long' ? 0.9 : 1.1)).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={handleTrade}
                          disabled={!amount || loading}
                          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${position === 'long'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                            : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
                            } disabled:opacity-50 disabled:cursor-not-allowed shadow-lg`}
                        >
                          {loading ? 'Processing...' : `Open ${position === 'long' ? 'Long' : 'Short'} Position`}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'positions' && (
                  <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-purple-400" />
                      Open Positions
                    </h2>
                    <div className="space-y-3">
                      {openPositions.map((pos, idx) => {
                        const currentPnL = calculatePnL(pos);
                        const pnlPercent = (currentPnL / (pos.size * pos.leverage)) * 100;
                        return (
                          <div key={idx} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className={`px-3 py-1 rounded-lg font-bold text-sm ${pos.side === 'long' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                  }`}>
                                  {pos.side.toUpperCase()}
                                </div>
                                <span className="font-bold">{pos.pair}</span>
                                <span className="text-sm text-gray-400">{pos.leverage}x</span>
                              </div>
                              <div className={`text-lg font-bold ${currentPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {currentPnL >= 0 ? '+' : ''}{currentPnL.toFixed(2)} USD
                                <span className="text-sm ml-2">({pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%)</span>
                              </div>
                            </div>
                            <div className="grid grid-cols-4 gap-4 text-sm">
                              <div>
                                <div className="text-gray-400">Size</div>
                                <div className="font-medium">${pos.size}</div>
                              </div>
                              <div>
                                <div className="text-gray-400">Entry</div>
                                <div className="font-medium">${pos.entry.toFixed(2)}</div>
                              </div>
                              <div>
                                <div className="text-gray-400">Current</div>
                                <div className="font-medium">${marketData[pos.pair]?.price.toFixed(2)}</div>
                              </div>
                              <div>
                                <button
                                  onClick={() => handleClosePosition(pos)}
                                  disabled={loading}
                                  className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 rounded-lg font-medium disabled:opacity-50"
                                >
                                  {loading ? '...' : 'Close'}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {openPositions.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                          <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>No open positions</p>
                          <button
                            onClick={() => setActiveTab('trade')}
                            className="mt-4 px-6 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg font-medium"
                          >
                            Start Trading
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'competitions' && (
                  <div className="space-y-4">
                    <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        Active Competitions
                      </h2>
                      <div className="space-y-4">
                        {competitions.map(comp => (
                          <div key={comp.id} className="bg-gradient-to-r from-slate-800/50 to-purple-900/20 rounded-xl p-4 border border-purple-500/30">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="text-3xl">{comp.icon}</div>
                                <div>
                                  <h3 className="font-bold text-lg">{comp.name}</h3>
                                  <p className="text-sm text-gray-400">{comp.participants.toLocaleString()} participants</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-yellow-400 font-bold text-lg">{comp.prize}</div>
                                <div className="text-xs text-gray-400">{comp.timeLeft} left</div>
                              </div>
                            </div>
                            <button
                              onClick={() => handleJoinCompetition()}
                              disabled={loading}
                              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-2 rounded-lg font-medium disabled:opacity-50"
                            >
                              {loading ? 'Joining...' : 'Join Competition'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'leaderboard' && (
                  <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      Global Leaderboard
                    </h2>
                    <div className="space-y-2">
                      {leaderboard.map((trader, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-4 rounded-xl ${trader.rank <= 3
                            ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
                            : 'bg-slate-800/50 border border-slate-700/50'
                            }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${trader.rank === 1 ? 'bg-yellow-500 text-black' :
                              trader.rank === 2 ? 'bg-gray-400 text-black' :
                                trader.rank === 3 ? 'bg-orange-600 text-white' :
                                  'bg-slate-700 text-gray-300'
                              }`}>
                              #{trader.rank}
                            </div>
                            <div className="text-3xl">{trader.avatar}</div>
                            <div>
                              <div className="font-bold">{trader.user}</div>
                              <div className="text-sm text-gray-400">Volume: ${(trader.volume / 1000000).toFixed(1)}M</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-green-400 font-bold text-lg">+${trader.pnl.toLocaleString()}</div>
                            <div className="text-xs text-gray-400">Total PnL</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'stats' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-purple-400" />
                          <span className="text-sm text-gray-400">Win Rate</span>
                        </div>
                        <div className="text-4xl font-bold text-purple-400">{userStats.winRate}%</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-5 h-5 text-green-400" />
                          <span className="text-sm text-gray-400">Avg Win</span>
                        </div>
                        <div className="text-4xl font-bold text-green-400">${userStats.avgWin}</div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-5 h-5 text-blue-400" />
                          <span className="text-sm text-gray-400">Total Trades</span>
                        </div>
                        <div className="text-4xl font-bold text-blue-400">{userStats.totalTrades}</div>
                      </div>
                      <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-2xl p-6 border border-orange-500/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Flame className="w-5 h-5 text-orange-400" />
                          <span className="text-sm text-gray-400">Win Streak</span>
                        </div>
                        <div className="text-4xl font-bold text-orange-400">{userStats.streak}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* User Performance Card */}
                <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/30 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">Your Performance</h3>
                    <div className="bg-purple-500/20 px-3 py-1 rounded-full">
                      <span className="text-purple-400 font-bold text-sm">{userStats.multiplier}x</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Total Volume</span>
                        <span className="font-bold">${(userStats.volume / 1000000).toFixed(2)}M</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: '65%' }} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">Win Streak</div>
                        <div className="flex items-center gap-1">
                          <Flame className="w-4 h-4 text-orange-400" />
                          <span className="font-bold text-lg">{userStats.streak}</span>
                        </div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">Multiplier</div>
                        <div className="flex items-center gap-1">
                          <Sparkles className="w-4 h-4 text-purple-400" />
                          <span className="font-bold text-lg">{userStats.multiplier}x</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => alert('Claim rewards feature coming soon!')}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-3 rounded-lg font-bold transition-all"
                    >
                      Claim Rewards
                    </button>
                  </div>
                </div>

                {/* Revenue Sharing */}
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    Revenue Sharing
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                      <div className="text-xs text-gray-400 mb-1">Your Share</div>
                      <div className="text-2xl font-bold text-green-400">${userStats.revenueShare.toFixed(2)}</div>
                      <div className="text-xs text-gray-400 mt-1">From platform fees</div>
                    </div>

                    <div className="text-sm text-gray-400">
                      <p className="mb-2">OPTIK holders earn:</p>
                      <ul className="space-y-1">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                          30% of trading fees
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                          20% of liquidation fees
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                          Bonus from competitions
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                  <h3 className="font-bold mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full bg-slate-800 hover:bg-slate-700 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2">
                      <Users className="w-4 h-4" />
                      Refer Friends
                    </button>
                    <button className="w-full bg-slate-800 hover:bg-slate-700 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2">
                      <Award className="w-4 h-4" />
                      View Achievements
                    </button>
                    <button className="w-full bg-slate-800 hover:bg-slate-700 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2">
                      <Target className="w-4 h-4" />
                      Set Price Alerts
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}