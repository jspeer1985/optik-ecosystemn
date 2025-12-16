'use client';

import { useState, useEffect } from 'react';

interface RevenueStats {
  totalRevenue: number;
  revenueBySource: {
    token_creation?: number;
    platform_fees?: number;
    trading_fees?: number;
  };
  totalTokens: number;
  totalTransactions: number;
}

export default function RevenueTransparency() {
  const [stats, setStats] = useState<RevenueStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/revenue/stats');
        const data = await res.json();
        setStats(data);
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <div className="animate-pulse">Loading revenue data...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <p className="text-gray-400">Revenue data unavailable</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <h3 className="text-2xl font-bold text-white mb-6">Platform Revenue (Live)</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-black/30 rounded-lg p-4">
          <div className="text-xs text-gray-400 mb-1">Total Revenue</div>
          <div className="text-2xl font-bold text-green-400">
            ${stats.totalRevenue.toLocaleString()}
          </div>
        </div>

        <div className="bg-black/30 rounded-lg p-4">
          <div className="text-xs text-gray-400 mb-1">Launch Fees</div>
          <div className="text-2xl font-bold text-blue-400">
            ${(stats.revenueBySource.token_creation || 0).toLocaleString()}
          </div>
        </div>

        <div className="bg-black/30 rounded-lg p-4">
          <div className="text-xs text-gray-400 mb-1">Platform Fees</div>
          <div className="text-2xl font-bold text-purple-400">
            ${(stats.revenueBySource.platform_fees || 0).toLocaleString()}
          </div>
        </div>

        <div className="bg-black/30 rounded-lg p-4">
          <div className="text-xs text-gray-400 mb-1">Trading Fees</div>
          <div className="text-2xl font-bold text-yellow-400">
            ${(stats.revenueBySource.trading_fees || 0).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black/30 rounded-lg p-4">
          <div className="text-xs text-gray-400 mb-1">Tokens Launched</div>
          <div className="text-xl font-bold text-white">
            {stats.totalTokens.toLocaleString()}
          </div>
        </div>

        <div className="bg-black/30 rounded-lg p-4">
          <div className="text-xs text-gray-400 mb-1">Transactions</div>
          <div className="text-xl font-bold text-white">
            {stats.totalTransactions.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded text-xs text-blue-300">
        <strong>100% Transparent:</strong> All revenue is tracked on-chain and in our public database.
        User liquidity is NEVER counted as Optik revenue.
      </div>
    </div>
  );
}
