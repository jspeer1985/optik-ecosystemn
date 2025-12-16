// lib/hooks/usePerpetualsIntegration.ts
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useCallback, useEffect, useState } from 'react';
import * as anchor from '@coral-xyz/anchor';
import { OptiKPerpetualsIntegration, RevenueDistributor } from '../perps-integration';

interface UsePerpetualsReturn {
  perps: OptiKPerpetualsIntegration | null;
  revenue: RevenueDistributor | null;
  marketPda: PublicKey | null;
  userStats: UserStats | null;
  openPosition: (size: number, isLong: boolean, leverage: number) => Promise<string>;
  closePosition: (positionPda: PublicKey, exitPrice: number) => Promise<string>;
  joinCompetition: (competitionPda: PublicKey) => Promise<string>;
  getLeaderboard: (competitionPda: PublicKey) => Promise<any[]>;
  claimRevenue: () => Promise<void>;
  loading: boolean;
  error: string | null;
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
}

export function usePerpetualsIntegration(): UsePerpetualsReturn {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [perps, setPerps] = useState<OptiKPerpetualsIntegration | null>(null);
  const [revenue, setRevenue] = useState<RevenueDistributor | null>(null);
  const [marketPda, setMarketPda] = useState<PublicKey | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize perpetuals integration
  useEffect(() => {
    if (!wallet.publicKey || !wallet.signTransaction) return;

    try {
      const optikMint = new PublicKey(process.env.NEXT_PUBLIC_OPTIKCOIN_MINT || '');
      const programId = new PublicKey(process.env.NEXT_PUBLIC_DEX_PROGRAM || '');

      const anchorWallet = {
        publicKey: wallet.publicKey,
        signTransaction: wallet.signTransaction,
        signAllTransactions: wallet.signAllTransactions,
      } as anchor.Wallet;

      const perpsInstance = new OptiKPerpetualsIntegration({
        connection,
        wallet: anchorWallet,
        optikMint,
        programId,
      });

      const revenueInstance = new RevenueDistributor(connection, optikMint);

      setPerps(perpsInstance);
      setRevenue(revenueInstance);

      // Get market PDA
      const [marketPdaAddress] = PublicKey.findProgramAddressSync(
        [Buffer.from('market'), optikMint.toBuffer()],
        programId
      );
      setMarketPda(marketPdaAddress);

    } catch (err) {
      console.error('Failed to initialize perps:', err);
      setError('Failed to initialize perpetuals integration');
    }
  }, [wallet.publicKey, wallet.signTransaction, wallet.signAllTransactions, connection]);

  // Load user stats
  useEffect(() => {
    if (!perps || !marketPda || !wallet.publicKey) return;

    const loadStats = async () => {
      try {
        setLoading(true);
        
        // Fetch market data
        const marketData = await perps.getMarketData(marketPda);
        
        // Fetch user position
        const position = await perps.getUserPosition(marketPda, wallet.publicKey);
        
        // Calculate user revenue share
        const totalFees = marketData.totalFeesCollected;
        const userRevenue = revenue 
          ? await revenue.calculateUserRevenue(wallet.publicKey, totalFees)
          : 0;

        // TODO: Fetch these from blockchain
        // For now, using mock data
        const stats: UserStats = {
          totalPnL: position ? 0 : 0, // Calculate from position history
          winRate: 0,
          totalTrades: 0,
          avgWin: 0,
          rank: 0,
          volume: 0,
          multiplier: revenue?.calculateMultiplier(0, 0) || 1.0,
          streak: 0,
          revenueShare: userRevenue,
        };

        setUserStats(stats);
      } catch (err) {
        console.error('Failed to load user stats:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();

    // Set up polling for real-time updates
    const interval = setInterval(loadStats, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, [perps, marketPda, wallet.publicKey, revenue]);

  // Open a position
  const openPosition = useCallback(async (
    size: number,
    isLong: boolean,
    leverage: number
  ): Promise<string> => {
    if (!perps || !marketPda) {
      throw new Error('Perpetuals not initialized');
    }

    setLoading(true);
    setError(null);

    try {
      // Get current market price (in production, use oracle)
      const marketData = await perps.getMarketData(marketPda);
      
      // For now, using mock price - replace with real oracle price
      const entryPrice = 98.42; // TODO: Get from Pyth or Chainlink

      const tx = await perps.openPosition(
        marketPda,
        size,
        isLong,
        leverage,
        entryPrice
      );

      return tx;
    } catch (err: any) {
      console.error('Failed to open position:', err);
      setError(err.message || 'Failed to open position');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [perps, marketPda]);

  // Close a position
  const closePosition = useCallback(async (
    positionPda: PublicKey,
    exitPrice: number
  ): Promise<string> => {
    if (!perps || !marketPda) {
      throw new Error('Perpetuals not initialized');
    }

    setLoading(true);
    setError(null);

    try {
      const tx = await perps.closePosition(marketPda, exitPrice);
      return tx;
    } catch (err: any) {
      console.error('Failed to close position:', err);
      setError(err.message || 'Failed to close position');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [perps, marketPda]);

  // Join a competition
  const joinCompetition = useCallback(async (
    competitionPda: PublicKey
  ): Promise<string> => {
    if (!perps) {
      throw new Error('Perpetuals not initialized');
    }

    setLoading(true);
    setError(null);

    try {
      const tx = await perps.joinCompetition(competitionPda);
      return tx;
    } catch (err: any) {
      console.error('Failed to join competition:', err);
      setError(err.message || 'Failed to join competition');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [perps]);

  // Get leaderboard
  const getLeaderboard = useCallback(async (
    competitionPda: PublicKey
  ): Promise<any[]> => {
    if (!perps) {
      throw new Error('Perpetuals not initialized');
    }

    try {
      return await perps.getCompetitionLeaderboard(competitionPda);
    } catch (err) {
      console.error('Failed to get leaderboard:', err);
      return [];
    }
  }, [perps]);

  // Claim revenue
  const claimRevenue = useCallback(async () => {
    if (!revenue || !wallet.publicKey) {
      throw new Error('Revenue system not initialized');
    }

    setLoading(true);
    setError(null);

    try {
      // TODO: Implement claim revenue transaction
      console.log('Claiming revenue...');
      
      // Mock transaction for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Revenue claimed successfully!');
    } catch (err: any) {
      console.error('Failed to claim revenue:', err);
      setError(err.message || 'Failed to claim revenue');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [revenue, wallet.publicKey]);

  return {
    perps,
    revenue,
    marketPda,
    userStats,
    openPosition,
    closePosition,
    joinCompetition,
    getLeaderboard,
    claimRevenue,
    loading,
    error,
  };
}

// Hook for real-time market data
export function useMarketData(marketPda: PublicKey | null) {
  const { connection } = useConnection();
  const [marketData, setMarketData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!marketPda) return;

    const fetchMarketData = async () => {
      try {
        // TODO: Fetch real market data from blockchain
        // For now using mock data
        setMarketData({
          'SOL-PERP': { price: 98.42, change24h: 5.23, volume: '2.4B', funding: 0.01 },
          'BTC-PERP': { price: 43250.50, change24h: -2.15, volume: '8.1B', funding: -0.005 },
          'ETH-PERP': { price: 2245.80, change24h: 3.45, volume: '4.2B', funding: 0.008 },
          'OPTIK-PERP': { price: 0.85, change24h: 12.34, volume: '125M', funding: 0.015 }
        });
      } catch (err) {
        console.error('Failed to fetch market data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();

    // Subscribe to real-time updates
    const interval = setInterval(fetchMarketData, 3000);
    return () => clearInterval(interval);
  }, [marketPda, connection]);

  return { marketData, loading };
}

// Hook for user positions
export function useUserPositions(marketPda: PublicKey | null) {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!marketPda || !wallet.publicKey) return;

    const fetchPositions = async () => {
      try {
        // TODO: Fetch real positions from blockchain
        // For now using mock data
        setPositions([]);
      } catch (err) {
        console.error('Failed to fetch positions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();

    // Subscribe to real-time updates
    const interval = setInterval(fetchPositions, 5000);
    return () => clearInterval(interval);
  }, [marketPda, wallet.publicKey, connection]);

  return { positions, loading };
}

// Hook for competitions
export function useCompetitions(marketPda: PublicKey | null) {
  const { connection } = useConnection();
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!marketPda) return;

    const fetchCompetitions = async () => {
      try {
        // TODO: Fetch real competitions from blockchain
        setCompetitions([
          { id: 1, name: 'Weekly Thunder', prize: '50,000 OPTIK', participants: 1247, timeLeft: '2d 14h', type: 'volume', icon: '⚡' },
          { id: 2, name: 'PnL Masters', prize: '100,000 OPTIK', participants: 892, timeLeft: '5d 8h', type: 'profit', icon: '🏆' },
          { id: 3, name: 'Streak Challenge', prize: '25,000 OPTIK', participants: 2134, timeLeft: '12h 45m', type: 'streak', icon: '🔥' }
        ]);
      } catch (err) {
        console.error('Failed to fetch competitions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();

    // Refresh every minute
    const interval = setInterval(fetchCompetitions, 60000);
    return () => clearInterval(interval);
  }, [marketPda, connection]);

  return { competitions, loading };
}