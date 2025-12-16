import { Connection, PublicKey } from '@solana/web3.js';
import { PythHttpClient, getPythProgramKeyForCluster } from '@pythnetwork/client';

// Pyth Price Feed IDs (Mainnet)
export const PRICE_FEEDS = {
    'SOL-PERP': new PublicKey('H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG'), // SOL/USD
    'BTC-PERP': new PublicKey('GVXRSBjFk6e6J3NbVPXohDJetcTjaeeuykUpbQF8UoMU'), // BTC/USD
    'ETH-PERP': new PublicKey('JBu1AL4obBcCMqKBBxhpWCNUt136ijcuMZLFvTP7iWdB'), // ETH/USD
    'OPTIK-PERP': new PublicKey('H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG'), // Using SOL as placeholder
};

export type MarketPair = 'SOL-PERP' | 'BTC-PERP' | 'ETH-PERP' | 'OPTIK-PERP';

export interface PriceData {
    price: number;
    confidence: number;
    timestamp: number;
}

export class PriceOracle {
    private connection: Connection;
    private pythClient: PythHttpClient | null = null;
    private priceCache: Map<MarketPair, PriceData> = new Map();
    private updateInterval: NodeJS.Timeout | null = null;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    async initialize() {
        try {
            // Initialize Pyth client
            const pythPublicKey = getPythProgramKeyForCluster('mainnet-beta');
            this.pythClient = new PythHttpClient(this.connection, pythPublicKey);

            // Start price updates
            await this.updatePrices();

            // Update prices every 2 seconds
            this.updateInterval = setInterval(() => {
                this.updatePrices().catch(console.error);
            }, 2000);

            console.log('✅ Price Oracle initialized');
        } catch (error) {
            console.error('Failed to initialize Price Oracle:', error);
            // Fallback to mock prices if Pyth fails
            this.useMockPrices();
        }
    }

    async updatePrices() {
        try {
            if (!this.pythClient) {
                this.useMockPrices();
                return;
            }

            const pairs = Object.keys(PRICE_FEEDS) as MarketPair[];

            for (const pair of pairs) {
                try {
                    const feedAddress = PRICE_FEEDS[pair];
                    const priceData = await this.pythClient.getAssetPriceFromWebsocket(feedAddress.toBase58());

                    if (priceData && priceData.price) {
                        this.priceCache.set(pair, {
                            price: priceData.price,
                            confidence: priceData.confidence || 0,
                            timestamp: Date.now(),
                        });
                    }
                } catch (error) {
                    console.warn(`Failed to fetch price for ${pair}:`, error);
                    // Keep using cached price or mock
                    if (!this.priceCache.has(pair)) {
                        this.setMockPrice(pair);
                    }
                }
            }
        } catch (error) {
            console.error('Error updating prices:', error);
            this.useMockPrices();
        }
    }

    private useMockPrices() {
        // Fallback mock prices for development/testing
        const mockPrices: Record<MarketPair, number> = {
            'SOL-PERP': 98.42,
            'BTC-PERP': 43250.50,
            'ETH-PERP': 2245.80,
            'OPTIK-PERP': 0.85,
        };

        Object.entries(mockPrices).forEach(([pair, price]) => {
            this.priceCache.set(pair as MarketPair, {
                price,
                confidence: 0.01,
                timestamp: Date.now(),
            });
        });
    }

    private setMockPrice(pair: MarketPair) {
        const mockPrices: Record<MarketPair, number> = {
            'SOL-PERP': 98.42,
            'BTC-PERP': 43250.50,
            'ETH-PERP': 2245.80,
            'OPTIK-PERP': 0.85,
        };

        this.priceCache.set(pair, {
            price: mockPrices[pair],
            confidence: 0.01,
            timestamp: Date.now(),
        });
    }

    getPrice(pair: MarketPair): PriceData | null {
        const cached = this.priceCache.get(pair);

        // If price is older than 10 seconds, consider it stale
        if (cached && Date.now() - cached.timestamp < 10000) {
            return cached;
        }

        // Return stale price with warning
        if (cached) {
            console.warn(`Price for ${pair} is stale`);
            return cached;
        }

        return null;
    }

    getAllPrices(): Record<MarketPair, PriceData | null> {
        const pairs = Object.keys(PRICE_FEEDS) as MarketPair[];
        const prices: Record<string, PriceData | null> = {};

        pairs.forEach(pair => {
            prices[pair] = this.getPrice(pair);
        });

        return prices as Record<MarketPair, PriceData | null>;
    }

    // Simulate price movement for development
    simulatePriceMovement() {
        const pairs = Object.keys(PRICE_FEEDS) as MarketPair[];

        pairs.forEach(pair => {
            const current = this.priceCache.get(pair);
            if (current) {
                // Random price movement between -0.5% and +0.5%
                const change = (Math.random() - 0.5) * 0.01;
                const newPrice = current.price * (1 + change);

                this.priceCache.set(pair, {
                    price: newPrice,
                    confidence: current.confidence,
                    timestamp: Date.now(),
                });
            }
        });
    }

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
}

// Singleton instance
let oracleInstance: PriceOracle | null = null;

export function getPriceOracle(connection: Connection): PriceOracle {
    if (!oracleInstance) {
        oracleInstance = new PriceOracle(connection);
    }
    return oracleInstance;
}
