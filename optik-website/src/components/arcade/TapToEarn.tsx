'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Zap, Target, BarChart3, Activity } from 'lucide-react';

interface TapToEarnProps {
    onGameOver: (score: number, duration: number) => void;
}

export default function TapToEarn({ onGameOver }: TapToEarnProps) {
    const [balance, setBalance] = useState(0);
    const [energy, setEnergy] = useState(1000);
    const [maxEnergy, setMaxEnergy] = useState(1000);
    const [tapPower, setTapPower] = useState(1);
    const [multiplier, setMultiplier] = useState(1);
    const [combo, setCombo] = useState(0);
    const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([]);
    const [startTime, setStartTime] = useState(0);
    const [autoEarnRate, setAutoEarnRate] = useState(0);
    const [stats, setStats] = useState({
        totalTaps: 0,
        peakCombo: 0,
        efficiency: 100
    });

    // Upgrades
    const [upgrades, setUpgrades] = useState({
        tapPower: 1,
        energyMax: 1,
        recharge: 1,
        autoEarn: 0
    });

    const upgradeCosts = {
        tapPower: Math.floor(50 * Math.pow(1.5, upgrades.tapPower)),
        energyMax: Math.floor(100 * Math.pow(1.6, upgrades.energyMax)),
        recharge: Math.floor(75 * Math.pow(1.4, upgrades.recharge)),
        autoEarn: Math.floor(200 * Math.pow(2, upgrades.autoEarn))
    };

    // Initialize start time on client
    useEffect(() => {
        setStartTime(Date.now());
    }, []);

    // Energy regeneration
    useEffect(() => {
        const rechargeRate = 1 + (upgrades.recharge * 0.5);
        const interval = setInterval(() => {
            setEnergy(prev => Math.min(prev + rechargeRate, maxEnergy));
        }, 100);
        return () => clearInterval(interval);
    }, [maxEnergy, upgrades.recharge]);

    // Auto-earn
    useEffect(() => {
        if (autoEarnRate > 0) {
            const interval = setInterval(() => {
                setBalance(prev => prev + autoEarnRate);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [autoEarnRate]);

    // Combo decay
    useEffect(() => {
        if (combo > 0) {
            const timeout = setTimeout(() => {
                setCombo(0);
                setMultiplier(1);
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [combo]);

    const handleTap = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (energy < tapPower) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate earnings
        const baseEarn = tapPower;
        const comboBonus = Math.floor(combo / 10);
        const totalEarn = (baseEarn + comboBonus) * multiplier;

        setBalance(prev => prev + totalEarn);
        setEnergy(prev => prev - tapPower);
        setCombo(prev => prev + 1);
        setStats(prev => ({
            ...prev,
            totalTaps: prev.totalTaps + 1,
            peakCombo: Math.max(prev.peakCombo, combo + 1)
        }));

        // Update multiplier based on combo
        if (combo > 50) setMultiplier(3);
        else if (combo > 25) setMultiplier(2);
        else if (combo > 10) setMultiplier(1.5);

        // Visual feedback
        const clickId = performance.now();
        setClicks(prev => [...prev, { id: clickId, x, y }]);
        setTimeout(() => {
            setClicks(prev => prev.filter(c => c.id !== clickId));
        }, 1000);
    }, [energy, tapPower, combo, multiplier]);

    const purchaseUpgrade = (type: keyof typeof upgrades) => {
        const cost = upgradeCosts[type];
        if (balance < cost) return;

        setBalance(prev => prev - cost);
        setUpgrades(prev => ({ ...prev, [type]: prev[type] + 1 }));

        // Apply upgrade effects
        switch (type) {
            case 'tapPower':
                setTapPower(prev => prev + 1);
                break;
            case 'energyMax':
                setMaxEnergy(prev => prev + 100);
                setEnergy(prev => prev + 100);
                break;
            case 'autoEarn':
                setAutoEarnRate(prev => prev + 1);
                break;
        }
    };

    const endSession = () => {
        const duration = Math.floor((Date.now() - startTime) / 1000);
        onGameOver(balance, duration);
    };

    const energyPercent = (energy / maxEnergy) * 100;
    const efficiency = stats.totalTaps > 0 ? Math.min(100, (balance / stats.totalTaps) * 10) : 100;

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Professional Stats Header */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-emerald-400 mb-1">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Balance</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{balance.toLocaleString()}</div>
                    <div className="text-xs text-slate-400 mt-1">OPTIK</div>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-xl border border-slate-700/50">
                    <div className="flex items-center gap-2 text-blue-400 mb-1">
                        <Zap className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Energy</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{Math.floor(energy)}</div>
                    <div className="w-full h-1.5 bg-slate-700 rounded-full mt-2 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-200"
                            style={{ width: `${energyPercent}%` }}
                        />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-xl border border-slate-700/50">
                    <div className="flex items-center gap-2 text-orange-400 mb-1">
                        <Target className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Combo</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{combo}x</div>
                    <div className="text-xs text-slate-400 mt-1">Multiplier: {multiplier.toFixed(1)}x</div>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-xl border border-slate-700/50">
                    <div className="flex items-center gap-2 text-purple-400 mb-1">
                        <BarChart3 className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Efficiency</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{efficiency.toFixed(1)}%</div>
                    <div className="text-xs text-slate-400 mt-1">{stats.totalTaps} taps</div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Tap Zone */}
                <div className="col-span-2 space-y-4">
                    <div
                        onClick={handleTap}
                        className="relative aspect-square bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border-2 border-slate-700/50 cursor-pointer overflow-hidden group hover:border-emerald-500/50 transition-all"
                        style={{
                            boxShadow: '0 0 40px rgba(16, 185, 129, 0.1), inset 0 0 60px rgba(0, 0, 0, 0.5)'
                        }}
                    >
                        {/* Grid Pattern */}
                        <div className="absolute inset-0 opacity-10" style={{
                            backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                            backgroundSize: '50px 50px'
                        }} />

                        {/* Center Orb */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative">
                                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 blur-2xl animate-pulse" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 group-hover:scale-110 transition-transform shadow-2xl flex items-center justify-center">
                                        <Activity className="w-16 h-16 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tap Animations */}
                        {clicks.map(click => (
                            <div
                                key={click.id}
                                className="absolute text-2xl font-bold text-emerald-400 pointer-events-none animate-float-up"
                                style={{ left: click.x, top: click.y }}
                            >
                                +{(tapPower * multiplier).toFixed(0)}
                            </div>
                        ))}

                        {/* Energy Warning */}
                        {energy < tapPower && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                                <div className="text-center">
                                    <Zap className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                                    <div className="text-white font-bold">Energy Depleted</div>
                                    <div className="text-sm text-slate-400">Recharging...</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={endSession}
                            className="flex-1 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg"
                        >
                            End Session & Claim
                        </button>
                        <div className="bg-slate-900 px-6 py-3 rounded-xl border border-slate-700/50 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm text-slate-400">Auto:</span>
                            <span className="font-bold text-white">+{autoEarnRate}/s</span>
                        </div>
                    </div>
                </div>

                {/* Upgrades Panel */}
                <div className="space-y-3">
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-700/50">
                        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Upgrades</h3>

                        {[
                            { key: 'tapPower', label: 'Tap Power', icon: '⚡', desc: `+1 per tap`, current: tapPower },
                            { key: 'energyMax', label: 'Max Energy', icon: '🔋', desc: `+100 capacity`, current: maxEnergy },
                            { key: 'recharge', label: 'Recharge Rate', icon: '♻️', desc: `+50% faster`, current: `${(1 + upgrades.recharge * 0.5).toFixed(1)}/s` },
                            { key: 'autoEarn', label: 'Auto Mining', icon: '🤖', desc: `+1 OPTIK/sec`, current: `${autoEarnRate}/s` }
                        ].map(upgrade => {
                            const cost = upgradeCosts[upgrade.key as keyof typeof upgradeCosts];
                            const canAfford = balance >= cost;
                            const level = upgrades[upgrade.key as keyof typeof upgrades];

                            return (
                                <button
                                    key={upgrade.key}
                                    onClick={() => purchaseUpgrade(upgrade.key as keyof typeof upgrades)}
                                    disabled={!canAfford}
                                    className={`w-full p-3 rounded-lg mb-2 transition-all text-left ${canAfford
                                        ? 'bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 border border-emerald-500/30 hover:border-emerald-500/60 cursor-pointer'
                                        : 'bg-slate-800/30 border border-slate-700/30 opacity-50 cursor-not-allowed'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">{upgrade.icon}</span>
                                            <div>
                                                <div className="text-sm font-bold text-white">{upgrade.label}</div>
                                                <div className="text-xs text-slate-400">{upgrade.desc}</div>
                                            </div>
                                        </div>
                                        <div className="text-xs bg-slate-700/50 px-2 py-1 rounded text-slate-300">
                                            Lv.{level}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700/30">
                                        <span className="text-xs text-slate-400">Current: {upgrade.current}</span>
                                        <span className={`text-sm font-bold ${canAfford ? 'text-emerald-400' : 'text-slate-500'}`}>
                                            {cost.toLocaleString()} OPTIK
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Live Stats */}
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-700/50">
                        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Session Stats</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Peak Combo:</span>
                                <span className="font-bold text-white">{stats.peakCombo}x</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Total Taps:</span>
                                <span className="font-bold text-white">{stats.totalTaps}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Avg/Tap:</span>
                                <span className="font-bold text-emerald-400">
                                    {stats.totalTaps > 0 ? (balance / stats.totalTaps).toFixed(2) : '0.00'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes float-up {
                    0% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(-100px);
                    }
                }
                .animate-float-up {
                    animation: float-up 1s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
