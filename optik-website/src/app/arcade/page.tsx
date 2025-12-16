'use client';

import { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Gamepad2, Trophy, Flame, Coins, Award, Star, History, ArrowRight, CreditCard, Zap, Target, Grid3x3 } from 'lucide-react';
import SnakeGame from '@/components/arcade/SnakeGame';
import TapToEarn from '@/components/arcade/TapToEarn';
import FlappyGame from '@/components/arcade/FlappyGame';
import Game2048 from '@/components/arcade/Game2048';
import PurchaseCredits from '@/components/arcade/PurchaseCredits';
import { ArcadeRewardsClient, Achievement, LeaderboardEntry } from '@/lib/arcade-rewards';
import { Toaster, toast } from 'react-hot-toast';

export default function ArcadePage() {
    const walletContext = useWallet();
    const { connected, publicKey, wallet } = walletContext;
    const { connection } = useConnection();

    const [activeTab, setActiveTab] = useState<'games' | 'leaderboard' | 'achievements' | 'shop'>('games');
    const [selectedGame, setSelectedGame] = useState<any>(null);
    const [userStats, setUserStats] = useState({
        totalEarned: 0,
        dailyEarned: 0,
        gamesPlayed: 0,
        level: 1,
        nextLevelProgress: 0
    });

    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [pendingRewards, setPendingRewards] = useState<number>(0);
    const [rewardsClient, setRewardsClient] = useState<ArcadeRewardsClient | null>(null);
    const [claiming, setClaiming] = useState(false);

    // Initialize Client
    useEffect(() => {
        if (connected && publicKey && wallet) {
            const client = new ArcadeRewardsClient(
                connection,
                walletContext,
                process.env.NEXT_PUBLIC_OPTIKCOIN_MINT || 'optik_mint_address'
            );
            setRewardsClient(client);
            loadUserData(client);
        }
    }, [connected, publicKey, connection, wallet, walletContext]); // eslint-disable-line react-hooks/exhaustive-deps

    const loadUserData = async (client: ArcadeRewardsClient) => {
        try {
            const [stats, userAchievements, tops, pending] = await Promise.all([
                client.getDailyStats(),
                client.getAchievements(),
                client.getLeaderboard(10),
                client.getPendingRewards()
            ]);

            setUserStats({
                totalEarned: stats.totalOptikEarned || 0,
                dailyEarned: stats.totalDailyEarned || 0,
                gamesPlayed: stats.gamesPlayed || 0,
                level: calculateLevel(stats.totalOptikEarned || 0),
                nextLevelProgress: calculateLevelProgress(stats.totalOptikEarned || 0)
            });

            setAchievements(userAchievements);
            setLeaderboard(tops);
            setPendingRewards(pending.reduce((sum, r) => sum + r.amount, 0));
        } catch (err) {
            console.error('Failed to load arcade data:', err);
            toast.error('Failed to load arcade data');
        }
    };

    const handleClaim = async () => {
        if (!rewardsClient || pendingRewards <= 0) return;

        setClaiming(true);
        const toastId = toast.loading('Claiming rewards...');

        try {
            await rewardsClient.claimRewards();
            toast.success('Rewards claimed successfully!', { id: toastId });
            await loadUserData(rewardsClient);
        } catch (error) {
            console.error('Claim failed:', error);
            toast.error('Failed to claim rewards', { id: toastId });
        } finally {
            setClaiming(false);
        }
    };

    const calculateLevel = (xp: number) => Math.floor(Math.sqrt(xp / 100)) + 1;
    const calculateLevelProgress = (xp: number) => {
        const level = calculateLevel(xp);
        const nextLevelXp = Math.pow(level, 2) * 100;
        const currentLevelXp = Math.pow(level - 1, 2) * 100;
        return ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
    };

    const handleGameOver = async (score: number, duration: number) => {
        if (!rewardsClient || !publicKey) return;

        const toastId = toast.loading('Submitting score...');
        try {
            // 1 is ID for Snake Game in our schema
            const result = await rewardsClient.submitScore(1, score, duration);

            toast.success(
                <div className="flex flex-col gap-1">
                    <span className="font-bold">Score Submitted!</span>
                    <span className="text-sm">You earned {result.optikEarned} OPTIK</span>
                </div>,
                { id: toastId }
            );

            // Reload stats
            loadUserData(rewardsClient);
        } catch (err) {
            console.error('Submit error:', err);
            toast.error('Failed to submit score', { id: toastId });
        }
    };

    if (!connected) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-rose-600/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />

                <div className="relative z-10 text-center space-y-8 p-12 bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-rose-500/30 shadow-2xl">
                    <div className="w-24 h-24 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform">
                        <Gamepad2 className="w-12 h-12 text-white" />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-rose-400 via-pink-400 to-rose-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                            OptiK Arcade
                        </h1>
                        <p className="text-gray-400 text-lg max-w-md mx-auto">
                            Play classic games, compete on leaderboards, and earn real OPTIK tokens for every point you score!
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <WalletMultiButton className="!bg-gradient-to-r !from-rose-600 !to-pink-600 !px-8 !py-4 !rounded-xl !text-lg !font-bold hover:!scale-105 transition-all !shadow-lg !shadow-rose-500/25" />
                    </div>

                    <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-700/50">
                        <div className="text-center">
                            <div className="font-bold text-2xl text-white">4</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider">Games</div>
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-2xl text-white">1M+</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider">OPTIK Distributed</div>
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-2xl text-white">10K+</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider">Players</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white pb-20">
            <Toaster position="bottom-right" />

            {/* Header */}
            <div className="bg-slate-900/50 border-b border-slate-800 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-rose-500 to-pink-500 p-2 rounded-lg">
                            <Gamepad2 className="w-6 h-6" />
                        </div>
                        <h1 className="text-xl font-bold">OptiK Arcade</h1>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* User Level */}
                        <div className="flex items-center gap-3 bg-slate-800/50 rounded-full pl-2 pr-4 py-1 border border-slate-700/50">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center font-bold text-black text-sm">
                                {userStats.level}
                            </div>
                            <div className="flex flex-col">
                                <div className="text-xs text-gray-400">Level Progress</div>
                                <div className="w-24 h-1.5 bg-slate-700 rounded-full mt-0.5 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                                        style={{ width: `${userStats.nextLevelProgress}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        <WalletMultiButton className="!bg-slate-800 !h-10 !px-4 !rounded-lg !text-sm" />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Sidebar */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Stats Card */}
                        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
                            <h3 className="text-gray-400 uppercase text-xs font-bold tracking-wider mb-4">Your Performance</h3>
                            <div className="space-y-4">
                                {pendingRewards > 0 && (
                                    <div className="bg-green-500/10 p-4 rounded-xl border border-green-500/30 animate-pulse">
                                        <div className="flex items-center gap-2 text-green-400 mb-2">
                                            <Award className="w-4 h-4" />
                                            <span className="text-xs font-medium uppercase">Pending Rewards</span>
                                        </div>
                                        <div className="text-2xl font-bold text-white mb-2">{pendingRewards.toLocaleString()} <span className="text-sm font-normal text-gray-400">OPTIK</span></div>
                                        <button
                                            onClick={handleClaim}
                                            disabled={claiming}
                                            className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-2 rounded-lg text-sm transition-all shadow-lg shadow-green-500/20 disabled:opacity-50"
                                        >
                                            {claiming ? 'Claiming...' : 'Claim Now'}
                                        </button>
                                    </div>
                                )}
                                <div className="bg-slate-800/50 p-4 rounded-xl">
                                    <div className="flex items-center gap-2 text-rose-400 mb-1">
                                        <Coins className="w-4 h-4" />
                                        <span className="text-xs font-medium uppercase">Total Earned</span>
                                    </div>
                                    <div className="text-2xl font-bold">{userStats.totalEarned.toLocaleString()} <span className="text-sm font-normal text-gray-500">OPTIK</span></div>
                                </div>

                                <div className="bg-slate-800/50 p-4 rounded-xl">
                                    <div className="flex items-center gap-2 text-pink-400 mb-1">
                                        <Flame className="w-4 h-4" />
                                        <span className="text-xs font-medium uppercase">Daily Earnings</span>
                                    </div>
                                    <div className="text-2xl font-bold">{userStats.dailyEarned.toLocaleString()} <span className="text-sm font-normal text-gray-500">OPTIK</span></div>
                                </div>

                                <div className="bg-slate-800/50 p-4 rounded-xl">
                                    <div className="flex items-center gap-2 text-blue-400 mb-1">
                                        <History className="w-4 h-4" />
                                        <span className="text-xs font-medium uppercase">Games Played</span>
                                    </div>
                                    <div className="text-2xl font-bold">{userStats.gamesPlayed}</div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="space-y-2">
                            {[
                                { id: 'games', icon: Gamepad2, label: 'Games' },
                                { id: 'leaderboard', icon: Trophy, label: 'Leaderboard' },
                                { id: 'achievements', icon: Award, label: 'Achievements' },
                                { id: 'shop', icon: CreditCard, label: 'Shop' },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => { setActiveTab(item.id as any); setSelectedGame(null); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === item.id && !selectedGame
                                        ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20'
                                        : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-9">
                        {selectedGame ? (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <button
                                    onClick={() => setSelectedGame(null)}
                                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    <ArrowRight className="w-4 h-4 rotate-180" />
                                    Back to Games
                                </button>

                                <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
                                    <div className="text-center mb-8">
                                        <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent mb-2">
                                            {selectedGame.title}
                                        </h2>
                                        <p className="text-gray-400">{selectedGame.description}</p>
                                    </div>

                                    {selectedGame.id === 'snake' && (
                                        <SnakeGame onGameOver={handleGameOver} maxScore={userStats.dailyEarned} />
                                    )}
                                    {selectedGame.id === 'tap' && (
                                        <TapToEarn onGameOver={handleGameOver} />
                                    )}
                                    {selectedGame.id === 'flappy' && (
                                        <FlappyGame onGameOver={handleGameOver} />
                                    )}
                                    {selectedGame.id === '2048' && (
                                        <Game2048 onGameOver={handleGameOver} />
                                    )}
                                </div>
                            </div>
                        ) : (
                            <>
                                {activeTab === 'games' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
                                        {/* Snake Card */}
                                        <div
                                            onClick={() => setSelectedGame({ id: 'snake', title: 'Cosmic Snake', description: 'Navigate the cosmos, collect shards, and earn OPTIK!' })}
                                            className="group relative bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden cursor-pointer hover:border-rose-500/50 transition-all hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]"
                                        >
                                            <div className="aspect-video bg-gradient-to-br from-indigo-900 to-rose-900 relative">
                                                <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                                    <Gamepad2 className="w-20 h-20 text-white/20" />
                                                </div>
                                                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-green-400 border border-green-500/30">
                                                    +1 OPTIK / point
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <h3 className="text-xl font-bold mb-2 group-hover:text-rose-400 transition-colors">Cosmic Snake</h3>
                                                <p className="text-sm text-gray-400 mb-4">Classic Snake with a Web3 twist. Eat food to earn crypto!</p>
                                                <div className="flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                    <span className="flex items-center gap-1"><Trophy className="w-3 h-3" />Easy Difficulty</span>
                                                    <span className="flex items-center gap-1"><Flame className="w-3 h-3" />Popular</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tap to Earn Card */}
                                        <div
                                            onClick={() => setSelectedGame({ id: 'tap', title: 'OptiK Miner', description: 'Tap to mine OPTIK! Upgrade your mining power and earn passive income.' })}
                                            className="group relative bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden cursor-pointer hover:border-emerald-500/50 transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]"
                                        >
                                            <div className="aspect-video bg-gradient-to-br from-slate-900 via-emerald-900/30 to-slate-900 relative">
                                                <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                                    <Zap className="w-20 h-20 text-emerald-400/30" />
                                                </div>
                                                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-emerald-400 border border-emerald-500/30">
                                                    Upgradeable
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-400 transition-colors">OptiK Miner</h3>
                                                <p className="text-sm text-gray-400 mb-4">Tap to mine OPTIK tokens. Upgrade your power and earn passive rewards!</p>
                                                <div className="flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                    <span className="flex items-center gap-1"><Target className="w-3 h-3" />Addictive</span>
                                                    <span className="flex items-center gap-1"><Flame className="w-3 h-3" />Trending</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Flappy Game Card */}
                                        <div
                                            onClick={() => setSelectedGame({ id: 'flappy', title: 'Flappy OptiK', description: 'Navigate through pipes and earn OPTIK for every obstacle you pass!' })}
                                            className="group relative bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden cursor-pointer hover:border-blue-500/50 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]"
                                        >
                                            <div className="aspect-video bg-gradient-to-br from-slate-900 via-blue-900/30 to-slate-900 relative">
                                                <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                                    <Trophy className="w-20 h-20 text-blue-400/30" />
                                                </div>
                                                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-blue-400 border border-blue-500/30">
                                                    +2 OPTIK / point
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">Flappy OptiK</h3>
                                                <p className="text-sm text-gray-400 mb-4">One-tap gameplay! Navigate pipes and rack up points for OPTIK rewards.</p>
                                                <div className="flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                    <span className="flex items-center gap-1"><Trophy className="w-3 h-3" />Challenging</span>
                                                    <span className="flex items-center gap-1"><Flame className="w-3 h-3" />Classic</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 2048 Game Card */}
                                        <div
                                            onClick={() => setSelectedGame({ id: '2048', title: '2048 Crypto', description: 'Merge tiles to reach 2048 and beyond. Higher scores = more OPTIK!' })}
                                            className="group relative bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden cursor-pointer hover:border-yellow-500/50 transition-all hover:shadow-[0_0_30px_rgba(234,179,8,0.15)]"
                                        >
                                            <div className="aspect-video bg-gradient-to-br from-slate-900 via-yellow-900/30 to-slate-900 relative">
                                                <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                                    <Grid3x3 className="w-20 h-20 text-yellow-400/30" />
                                                </div>
                                                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-yellow-400 border border-yellow-500/30">
                                                    Strategy
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-400 transition-colors">2048 Crypto</h3>
                                                <p className="text-sm text-gray-400 mb-4">Merge tiles strategically to reach 2048. Score-based OPTIK rewards!</p>
                                                <div className="flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                    <span className="flex items-center gap-1"><Trophy className="w-3 h-3" />Brain Game</span>
                                                    <span className="flex items-center gap-1"><Star className="w-3 h-3" />Relaxing</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'leaderboard' && (
                                    <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden animate-in fade-in duration-500">
                                        <div className="p-6 border-b border-slate-800">
                                            <h2 className="text-xl font-bold flex items-center gap-2">
                                                <Trophy className="w-5 h-5 text-yellow-500" />
                                                Global Leaderboard
                                            </h2>
                                        </div>
                                        <div className="divide-y divide-slate-800/50">
                                            {leaderboard.length > 0 ? (
                                                leaderboard.map((entry, idx) => (
                                                    <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-8 h-8 flex items-center justify-center font-bold rounded-lg ${idx === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                                                                idx === 1 ? 'bg-gray-400/20 text-gray-400' :
                                                                    idx === 2 ? 'bg-orange-600/20 text-orange-600' :
                                                                        'text-gray-500'
                                                                }`}>
                                                                #{entry.rank}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold">{entry.username}</div>
                                                                <div className="text-xs text-gray-400">{entry.walletAddress.slice(0, 4)}...{entry.walletAddress.slice(-4)}</div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-bold text-rose-400">{entry.totalOptikEarned.toLocaleString()} OPTIK</div>
                                                            <div className="text-xs text-gray-400">{entry.totalScore.toLocaleString()} pts</div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-8 text-center text-gray-500">
                                                    Leaderboard loading or empty...
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'achievements' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-500">
                                        {achievements.length > 0 ? (
                                            achievements.map((achievement) => (
                                                <div
                                                    key={achievement.id}
                                                    className={`p-6 rounded-2xl border transition-all ${achievement.unlocked
                                                        ? 'bg-gradient-to-br from-slate-900 via-rose-900/20 to-slate-900 border-rose-500/50 shadow-[0_0_20px_rgba(168,85,247,0.1)]'
                                                        : 'bg-slate-900/50 border-slate-800 opacity-75'
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="text-3xl">{achievement.icon}</div>
                                                        {achievement.unlocked && (
                                                            <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30">
                                                                Unlocked
                                                            </div>
                                                        )}
                                                    </div>
                                                    <h3 className="font-bold text-lg mb-1">{achievement.name}</h3>
                                                    <p className="text-sm text-gray-400 mb-4">{achievement.description}</p>
                                                    <div className="flex items-center gap-2 text-xs font-bold text-rose-400 bg-rose-500/10 px-3 py-2 rounded-lg w-fit">
                                                        <Award className="w-4 h-4" />
                                                        Reward: {achievement.rewardOptik} OPTIK
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-2 p-12 text-center text-gray-500 bg-slate-900/50 rounded-2xl border border-slate-800">
                                                <Star className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                                <p>No achievements found</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'shop' && (
                                    <PurchaseCredits />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
