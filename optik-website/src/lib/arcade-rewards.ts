import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { WalletContextState } from '@solana/wallet-adapter-react';

export interface GameSession {
    id: string;
    gameId: number;
    gameName: string;
    score: number;
    durationSeconds: number;
    optikEarned: number;
    createdAt: string;
}

export interface Achievement {
    id: number;
    name: string;
    description: string;
    icon: string;
    requirementType: string;
    requirementValue: number;
    rewardOptik: number;
    unlocked: boolean;
    unlockedAt?: string;
    claimed: boolean;
}

export interface LeaderboardEntry {
    rank: number;
    walletAddress: string;
    username?: string;
    totalScore: number;
    totalOptikEarned: number;
    gamesPlayed: number;
    achievementsUnlocked: number;
    highestScore: number;
}

export interface PendingReward {
    id: string;
    amount: number;
    source: string;
    createdAt: string;
    expiresAt: string;
}

export class ArcadeRewardsClient {
    private connection: Connection;
    private wallet: WalletContextState;
    private optikMint: PublicKey;

    constructor(
        connection: Connection,
        wallet: WalletContextState,
        optikMintAddress: string
    ) {
        this.connection = connection;
        this.wallet = wallet;
        this.optikMint = new PublicKey(optikMintAddress);
    }

    /**
     * Submit a game score and earn OPTIK rewards
     */
    async submitScore(
        gameId: number,
        score: number,
        durationSeconds: number
    ): Promise<{ sessionId: string; optikEarned: number }> {
        if (!this.wallet.publicKey) {
            throw new Error('Wallet not connected');
        }

        try {
            // Call API to record session
            const response = await fetch('/api/arcade/submit-score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    walletAddress: this.wallet.publicKey.toBase58(),
                    gameId,
                    score,
                    durationSeconds,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit score');
            }

            const data = await response.json();
            return {
                sessionId: data.sessionId,
                optikEarned: data.optikEarned,
            };
        } catch (error) {
            console.error('Error submitting score:', error);
            throw error;
        }
    }

    /**
     * Get user's game history
     */
    async getGameHistory(limit: number = 10): Promise<GameSession[]> {
        if (!this.wallet.publicKey) {
            throw new Error('Wallet not connected');
        }

        try {
            const response = await fetch(
                `/api/arcade/history?wallet=${this.wallet.publicKey.toBase58()}&limit=${limit}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch history');
            }

            const data = await response.json();
            return data.sessions || [];
        } catch (error) {
            console.error('Error fetching history:', error);
            return [];
        }
    }

    /**
     * Get user's achievements
     */
    async getAchievements(): Promise<Achievement[]> {
        if (!this.wallet.publicKey) {
            throw new Error('Wallet not connected');
        }

        try {
            const response = await fetch(
                `/api/arcade/achievements?wallet=${this.wallet.publicKey.toBase58()}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch achievements');
            }

            const data = await response.json();
            return data.achievements || [];
        } catch (error) {
            console.error('Error fetching achievements:', error);
            return [];
        }
    }

    /**
     * Get arcade leaderboard
     */
    async getLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
        try {
            const response = await fetch(`/api/arcade/leaderboard?limit=${limit}`);

            if (!response.ok) {
                throw new Error('Failed to fetch leaderboard');
            }

            const data = await response.json();
            return data.leaderboard || [];
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            return [];
        }
    }

    /**
     * Get pending rewards
     */
    async getPendingRewards(): Promise<PendingReward[]> {
        if (!this.wallet.publicKey) {
            throw new Error('Wallet not connected');
        }

        try {
            const response = await fetch(
                `/api/arcade/pending-rewards?wallet=${this.wallet.publicKey.toBase58()}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch pending rewards');
            }

            const data = await response.json();
            return data.rewards || [];
        } catch (error) {
            console.error('Error fetching pending rewards:', error);
            return [];
        }
    }

    /**
     * Claim all pending rewards
     */
    async claimRewards(): Promise<string> {
        if (!this.wallet.publicKey || !this.wallet.signTransaction) {
            throw new Error('Wallet not connected');
        }

        try {
            // Get pending rewards
            const pendingRewards = await this.getPendingRewards();
            const totalAmount = pendingRewards.reduce((sum, r) => sum + r.amount, 0);

            if (totalAmount <= 0) {
                throw new Error('No rewards to claim');
            }

            // In production, this would create a transaction to transfer OPTIK tokens
            // For now, we'll just mark them as claimed in the database
            const response = await fetch('/api/arcade/claim-rewards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    walletAddress: this.wallet.publicKey.toBase58(),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to claim rewards');
            }

            const data = await response.json();
            return data.transactionSignature || 'claimed';
        } catch (error) {
            console.error('Error claiming rewards:', error);
            throw error;
        }
    }

    /**
     * Get user's daily stats
     */
    async getDailyStats(gameId?: number): Promise<any> {
        if (!this.wallet.publicKey) {
            throw new Error('Wallet not connected');
        }

        try {
            const url = gameId
                ? `/api/arcade/daily-stats?wallet=${this.wallet.publicKey.toBase58()}&gameId=${gameId}`
                : `/api/arcade/daily-stats?wallet=${this.wallet.publicKey.toBase58()}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to fetch daily stats');
            }

            const data = await response.json();
            return data.stats || {};
        } catch (error) {
            console.error('Error fetching daily stats:', error);
            return {};
        }
    }

    /**
     * Get available games
     */
    async getGames(): Promise<any[]> {
        try {
            const response = await fetch('/api/arcade/games');

            if (!response.ok) {
                throw new Error('Failed to fetch games');
            }

            const data = await response.json();
            return data.games || [];
        } catch (error) {
            console.error('Error fetching games:', error);
            return [];
        }
    }

    /**
     * Calculate potential OPTIK earnings for a score
     */
    calculatePotentialEarnings(
        score: number,
        rewardPerScore: number,
        dailyEarned: number,
        maxDaily: number
    ): number {
        const potential = score * rewardPerScore;
        const remaining = Math.max(0, maxDaily - dailyEarned);
        return Math.min(potential, remaining);
    }
}

// Helper function to format OPTIK amount
export function formatOptik(amount: number): string {
    if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(2)}M`;
    } else if (amount >= 1000) {
        return `${(amount / 1000).toFixed(2)}K`;
    }
    return amount.toFixed(2);
}

// Helper function to get achievement progress
export function getAchievementProgress(
    currentValue: number,
    requirementValue: number
): number {
    return Math.min(100, (currentValue / requirementValue) * 100);
}
