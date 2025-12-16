import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { AnchorProvider, Program, BN, Idl } from '@coral-xyz/anchor';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { getPriceOracle, MarketPair } from './price-oracle';

export interface PerpsConfig {
    connection: Connection;
    wallet: WalletContextState;
    programId: PublicKey;
    marketPda: PublicKey;
    insuranceVault: PublicKey;
}

export interface Position {
    pair: MarketPair;
    side: 'long' | 'short';
    size: number;
    entry: number;
    current: number;
    pnl: number;
    leverage: number;
    liquidationPrice: number;
    timestamp: number;
}

export interface UserStats {
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

export interface Competition {
    id: number;
    name: string;
    prize: string;
    participants: number;
    timeLeft: string;
    type: 'volume' | 'profit' | 'streak';
    startTime: Date;
    endTime: Date;
    prizePool: number;
}

export class PerpetualsClient {
    private connection: Connection;
    private wallet: WalletContextState;
    private programId: PublicKey;
    private marketPda: PublicKey;
    private insuranceVault: PublicKey;
    private priceOracle: any;
    private positions: Map<string, Position> = new Map();

    constructor(config: PerpsConfig) {
        this.connection = config.connection;
        this.wallet = config.wallet;
        this.programId = config.programId;
        this.marketPda = config.marketPda;
        this.insuranceVault = config.insuranceVault;
        this.priceOracle = getPriceOracle(config.connection);
    }

    async initialize() {
        await this.priceOracle.initialize();
        await this.loadUserPositions();
    }

    /**
     * Open a new perpetual position
     */
    async openPosition(
        pair: MarketPair,
        size: number,
        isLong: boolean,
        leverage: number,
        slippage: number = 0.01
    ): Promise<string> {
        if (!this.wallet.publicKey || !this.wallet.signTransaction) {
            throw new Error('Wallet not connected');
        }

        try {
            // Get current price
            const priceData = this.priceOracle.getPrice(pair);
            if (!priceData) {
                throw new Error('Price data not available');
            }

            const entryPrice = priceData.price;
            const positionSize = size * leverage;

            // Calculate liquidation price
            const liquidationPrice = this.calculateLiquidationPrice(
                entryPrice,
                leverage,
                isLong
            );

            // Create position account
            const positionKey = `${pair}-${Date.now()}`;

            // In a real implementation, this would interact with your Anchor program
            // For now, we'll simulate the transaction
            const transaction = new Transaction();

            // Add instruction to open position (placeholder)
            // transaction.add(
            //   await this.program.methods
            //     .openPosition(new BN(positionSize), isLong, leverage)
            //     .accounts({
            //       user: this.wallet.publicKey,
            //       market: this.marketPda,
            //       insuranceVault: this.insuranceVault,
            //     })
            //     .instruction()
            // );

            // For development, simulate the position
            const position: Position = {
                pair,
                side: isLong ? 'long' : 'short',
                size,
                entry: entryPrice,
                current: entryPrice,
                pnl: 0,
                leverage,
                liquidationPrice,
                timestamp: Date.now(),
            };

            this.positions.set(positionKey, position);

            // Store in localStorage for persistence
            this.savePositionsToStorage();

            console.log(`✅ Position opened: ${isLong ? 'LONG' : 'SHORT'} ${pair} at ${entryPrice}`);

            return positionKey;
        } catch (error) {
            console.error('Failed to open position:', error);
            throw error;
        }
    }

    /**
     * Close an existing position
     */
    async closePosition(positionKey: string): Promise<number> {
        if (!this.wallet.publicKey || !this.wallet.signTransaction) {
            throw new Error('Wallet not connected');
        }

        const position = this.positions.get(positionKey);
        if (!position) {
            throw new Error('Position not found');
        }

        try {
            // Get current price
            const priceData = this.priceOracle.getPrice(position.pair);
            if (!priceData) {
                throw new Error('Price data not available');
            }

            const exitPrice = priceData.price;
            const pnl = this.calculatePnL(position, exitPrice);

            // In a real implementation, interact with Anchor program
            // const transaction = new Transaction();
            // transaction.add(
            //   await this.program.methods
            //     .closePosition()
            //     .accounts({
            //       user: this.wallet.publicKey,
            //       position: positionPda,
            //       market: this.marketPda,
            //     })
            //     .instruction()
            // );

            // Remove position
            this.positions.delete(positionKey);
            this.savePositionsToStorage();

            console.log(`✅ Position closed with PnL: ${pnl > 0 ? '+' : ''}${pnl.toFixed(2)} USD`);

            return pnl;
        } catch (error) {
            console.error('Failed to close position:', error);
            throw error;
        }
    }

    /**
     * Get all open positions for the user
     */
    async getUserPositions(): Promise<Position[]> {
        // Update current prices and PnL
        const positions = Array.from(this.positions.values());

        positions.forEach(position => {
            const priceData = this.priceOracle.getPrice(position.pair);
            if (priceData) {
                position.current = priceData.price;
                position.pnl = this.calculatePnL(position, priceData.price);
            }
        });

        return positions;
    }

    /**
     * Get user trading statistics
     */
    async getUserStats(): Promise<UserStats> {
        if (!this.wallet.publicKey) {
            throw new Error('Wallet not connected');
        }

        // In production, fetch from blockchain/database
        // For now, calculate from local positions
        const positions = await this.getUserPositions();
        const totalPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0);
        const totalTrades = positions.length;
        const winningTrades = positions.filter(pos => pos.pnl > 0).length;
        const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

        // Mock data for other stats
        return {
            totalPnL,
            winRate,
            totalTrades,
            avgWin: winningTrades > 0 ? totalPnL / winningTrades : 0,
            rank: 42,
            volume: totalTrades * 1000,
            multiplier: 1.0 + (winRate / 100),
            streak: 0,
            revenueShare: totalPnL * 0.1,
            optikBalance: 50000,
            stakedOptik: 25000,
        };
    }

    /**
     * Join a trading competition
     */
    async joinCompetition(competitionId: number): Promise<string> {
        if (!this.wallet.publicKey || !this.wallet.signTransaction) {
            throw new Error('Wallet not connected');
        }

        try {
            // In production, interact with smart contract
            console.log(`Joining competition ${competitionId}`);

            return 'competition-entry-signature';
        } catch (error) {
            console.error('Failed to join competition:', error);
            throw error;
        }
    }

    /**
     * Claim revenue share rewards
     */
    async claimRewards(): Promise<string> {
        if (!this.wallet.publicKey || !this.wallet.signTransaction) {
            throw new Error('Wallet not connected');
        }

        try {
            const stats = await this.getUserStats();

            if (stats.revenueShare <= 0) {
                throw new Error('No rewards to claim');
            }

            // In production, interact with smart contract
            console.log(`Claiming ${stats.revenueShare} USD in rewards`);

            return 'claim-signature';
        } catch (error) {
            console.error('Failed to claim rewards:', error);
            throw error;
        }
    }

    /**
     * Calculate PnL for a position
     */
    private calculatePnL(position: Position, currentPrice: number): number {
        const priceDiff = currentPrice - position.entry;
        const multiplier = position.side === 'long' ? 1 : -1;
        return (priceDiff / position.entry) * position.size * position.leverage * multiplier;
    }

    /**
     * Calculate liquidation price
     */
    private calculateLiquidationPrice(
        entryPrice: number,
        leverage: number,
        isLong: boolean
    ): number {
        const liquidationThreshold = 0.9; // 90% of margin
        const priceMove = (1 / leverage) * liquidationThreshold;

        if (isLong) {
            return entryPrice * (1 - priceMove);
        } else {
            return entryPrice * (1 + priceMove);
        }
    }

    /**
     * Load positions from localStorage
     */
    private async loadUserPositions() {
        if (!this.wallet.publicKey) return;

        try {
            const stored = localStorage.getItem(`positions-${this.wallet.publicKey.toBase58()}`);
            if (stored) {
                const positions = JSON.parse(stored);
                this.positions = new Map(Object.entries(positions));
            }
        } catch (error) {
            console.error('Failed to load positions:', error);
        }
    }

    /**
     * Save positions to localStorage
     */
    private savePositionsToStorage() {
        if (!this.wallet.publicKey) return;

        try {
            const positionsObj = Object.fromEntries(this.positions);
            localStorage.setItem(
                `positions-${this.wallet.publicKey.toBase58()}`,
                JSON.stringify(positionsObj)
            );
        } catch (error) {
            console.error('Failed to save positions:', error);
        }
    }

    /**
     * Get current market prices
     */
    getCurrentPrices() {
        return this.priceOracle.getAllPrices();
    }

    /**
     * Cleanup
     */
    destroy() {
        this.priceOracle.destroy();
    }
}
