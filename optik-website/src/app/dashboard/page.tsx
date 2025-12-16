'use client';

import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Activity, Globe, DollarSign, Clock, Layers } from 'lucide-react';

export default function DashboardPage() {
    // Mock Data for "Bloomberg" style density
    const marketData = [
        { symbol: 'OPTIK', price: '0.0421', change: '+12.5%', volume: '1.2M', cap: '42M', status: 'Active' },
        { symbol: 'SOL', price: '142.50', change: '-2.1%', volume: '840M', cap: '64B', status: 'Active' },
        { symbol: 'BTC', price: '64,200', change: '+0.8%', volume: '32B', cap: '1.2T', status: 'Active' },
        { symbol: 'ETH', price: '3,450', change: '+1.2%', volume: '14B', cap: '400B', status: 'Active' },
        { symbol: 'BONK', price: '0.00002', change: '-5.4%', volume: '40M', cap: '1.2B', status: 'Warning' },
    ];

    return (
        <div className="container py-8">
            {/* Header Section */}
            <header className="mb-8 flex items-end justify-between border-b border-[var(--border-subtle)] pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Market Overview</h1>
                    <p className="text-sm text-[var(--slate-600)] font-mono uppercase tracking-wider">Global System Status: Operational • v2.4.0</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn-secondary text-xs">Export CSV</button>
                    <button className="btn-primary text-xs">New Order</button>
                </div>
            </header>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <MetricCard label="Total Volume (24h)" value="$24,892,102" change="+4.2%" trend="up" />
                <MetricCard label="Active Wallets" value="14,203" change="+12.5%" trend="up" />
                <MetricCard label="Liquidity Pools" value="842" change="-0.8%" trend="down" />
                <MetricCard label="Network Gas" value="12 Gwei" change="Normal" trend="neutral" />
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Main Market Table (Left 8 cols) */}
                <div className="col-span-12 lg:col-span-8">
                    <div className="panel h-full">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Activity className="w-4 h-4 text-[var(--blue-500)]" />
                                Live Markets
                            </h3>
                            <div className="flex gap-2">
                                <input type="text" placeholder="Filter ticker..." className="input-field !w-48 !h-8 text-xs" />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Asset</th>
                                        <th className="text-right">Price</th>
                                        <th className="text-right">24h Change</th>
                                        <th className="text-right">Volume</th>
                                        <th className="text-right">Mkt Cap</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {marketData.map((asset) => (
                                        <tr key={asset.symbol}>
                                            <td className="font-semibold text-white">{asset.symbol}</td>
                                            <td className="text-right font-mono text-[var(--cyan-400)]">${asset.price}</td>
                                            <td className={`text-right font-mono ${asset.change.startsWith('+') ? 'text-[var(--success-green)]' : 'text-[var(--danger-red)]'}`}>
                                                {asset.change}
                                            </td>
                                            <td className="text-right font-mono text-slate-400">{asset.volume}</td>
                                            <td className="text-right font-mono text-slate-400">{asset.cap}</td>
                                            <td>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-medium tracking-wide ${asset.status === 'Active'
                                                        ? 'bg-[rgba(16,185,129,0.1)] text-[var(--success-green)] border border-[rgba(16,185,129,0.2)]'
                                                        : 'bg-[rgba(245,158,11,0.1)] text-[var(--warning-amber)] border border-[rgba(245,158,11,0.2)]'
                                                    }`}>
                                                    {asset.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar / Action Panel (Right 4 cols) */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    {/* Trade Panel */}
                    <div className="panel">
                        <h3 className="text-lg font-semibold mb-6 border-b border-[var(--border-subtle)] pb-4">Quick Trade</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-[var(--slate-600)] mb-1.5 font-semibold">Pay</label>
                                <div className="flex gap-2">
                                    <input type="text" className="input-field font-mono text-right" defaultValue="0.00" />
                                    <button className="btn-secondary !px-4">SOL</button>
                                </div>
                            </div>

                            <div className="flex justify-center -my-2 relative z-10">
                                <div className="bg-[var(--bg-tertiary)] p-1.5 rounded-full border border-[var(--border-subtle)]">
                                    <ArrowDownRight className="w-4 h-4 text-slate-400" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider text-[var(--slate-600)] mb-1.5 font-semibold">Receive</label>
                                <div className="flex gap-2">
                                    <input type="text" className="input-field font-mono text-right" defaultValue="0.00" />
                                    <button className="btn-secondary !px-4">OPTIK</button>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button className="btn-primary w-full h-12 text-sm uppercase tracking-wide">Execute Trade</button>
                            </div>
                        </div>
                    </div>

                    {/* System Status */}
                    <div className="panel bg-[var(--bg-tertiary)] !border-none">
                        <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-[var(--blue-500)]" />
                            Node Status
                        </h4>
                        <div className="space-y-3">
                            <StatusRow label="Mainnet Beta" status="Synced" color="text-[var(--success-green)]" />
                            <StatusRow label="Indexer API" status="Operational" color="text-[var(--success-green)]" />
                            <StatusRow label="Orderbook" status="Degraded" color="text-[var(--warning-amber)]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, change, trend }: { label: string, value: string, change: string, trend: 'up' | 'down' | 'neutral' }) {
    const isUp = trend === 'up';
    const isDown = trend === 'down';
    const colorClass = isUp ? 'text-[var(--success-green)]' : isDown ? 'text-[var(--danger-red)]' : 'text-slate-400';

    return (
        <div className="panel flex flex-col justify-between h-32">
            <span className="text-xs uppercase tracking-wider text-[var(--slate-600)] font-semibold">{label}</span>
            <div>
                <div className="text-2xl font-mono text-white mb-1">{value}</div>
                <div className={`text-sm font-mono flex items-center gap-1 ${colorClass}`}>
                    {isUp && <ArrowUpRight className="w-3 h-3" />}
                    {isDown && <ArrowDownRight className="w-3 h-3" />}
                    {change}
                </div>
            </div>
        </div>
    );
}

function StatusRow({ label, status, color }: { label: string, status: string, color: string }) {
    return (
        <div className="flex justify-between items-center text-sm">
            <span className="text-[var(--slate-400)]">{label}</span>
            <span className={`font-mono ${color}`}>{status}</span>
        </div>
    );
}
