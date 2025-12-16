/**
 * OPTIK Memecoin Factory - Tiered Pricing Strategy
 * Designed to maximize revenue while capturing all market segments
 */

export const MEMECOIN_TIERS = {
  // BASIC: Quick launch, minimal features
  BASIC: {
    name: 'Basic Launch',
    priceUSD: 100,
    priceSOL: 0.5, // ~$100 at $200/SOL
    features: [
      'Token creation & deployment',
      'Basic liquidity pool (0.5 SOL)',
      'Standard metadata',
      'Community marketing toolkit',
      '7-day featured listing',
    ],
    limits: {
      maxSupply: '1B tokens',
      initialLiquidity: '0.5 SOL',
      lockPeriod: '7 days',
    },
  },

  // STANDARD: Most popular, balanced features
  STANDARD: {
    name: 'Standard Launch',
    priceUSD: 500, // YOUR SWEET SPOT
    priceSOL: 2.5,
    features: [
      'Everything in Basic',
      'Enhanced liquidity pool (2 SOL)',
      'Custom token artwork (AI-generated)',
      'Automated social media posts',
      '30-day featured listing',
      'Anti-bot protection',
      'Airdrop campaign tools',
      'Revenue dashboard',
    ],
    limits: {
      maxSupply: '10B tokens',
      initialLiquidity: '2 SOL',
      lockPeriod: '30 days',
    },
    popular: true, // Highlight as "Most Popular"
  },

  // PREMIUM: Full service, maximum exposure
  PREMIUM: {
    name: 'Premium Launch',
    priceUSD: 2500,
    priceSOL: 12.5,
    features: [
      'Everything in Standard',
      'Deep liquidity pool (10 SOL)',
      'Professional token branding package',
      'Influencer outreach campaign',
      '90-day homepage featured spot',
      'Priority customer support',
      'Custom smart contract features',
      'Staking integration',
      'NFT collection integration',
      'Multi-chain bridge ready',
    ],
    limits: {
      maxSupply: 'Unlimited',
      initialLiquidity: '10 SOL',
      lockPeriod: '90 days',
    },
  },

  // ENTERPRISE: For serious projects
  ENTERPRISE: {
    name: 'Enterprise Launch',
    priceUSD: 10000,
    priceSOL: 50,
    features: [
      'Everything in Premium',
      'Dedicated account manager',
      'Full audit & security review',
      'Custom tokenomics design',
      'VC/investor introductions',
      'Legal compliance consultation',
      'Exchange listing assistance',
      'Perpetual featured placement',
      'White-label branding options',
    ],
    limits: {
      maxSupply: 'Custom',
      initialLiquidity: 'Custom (min 50 SOL)',
      lockPeriod: 'Custom',
    },
  },
};

/**
 * Type for tier names
 */
export type TierName = keyof typeof MEMECOIN_TIERS;

/**
 * Revenue projections based on conversion rates
 */
export const REVENUE_PROJECTIONS = {
  // Conservative estimate: 1000 launches/month total
  monthly: {
    basic: { count: 500, revenue: 50000 },      // 50% at $100
    standard: { count: 300, revenue: 150000 },  // 30% at $500 (MAJORITY)
    premium: { count: 150, revenue: 375000 },   // 15% at $2500
    enterprise: { count: 50, revenue: 500000 }, // 5% at $10k
    total: 1000,
    totalRevenue: 1075000, // $1.075M/month
  },

  // Optimistic: 5000 launches/month
  optimistic: {
    basic: { count: 2500, revenue: 250000 },
    standard: { count: 1500, revenue: 750000 },
    premium: { count: 750, revenue: 1875000 },
    enterprise: { count: 250, revenue: 2500000 },
    total: 5000,
    totalRevenue: 5375000, // $5.375M/month
  },
};

/**
 * Additional revenue streams (20-30% of primary revenue)
 */
export const SECONDARY_REVENUE = {
  tradingFees: {
    feePercent: 0.5, // 0.5% per trade
    estimatedMonthlyVolume: 10000000, // $10M
    monthlyRevenue: 50000, // $50k
  },

  stakingFees: {
    feePercent: 5, // 5% of staking rewards
    estimatedStaked: 1000000, // $1M
    monthlyRevenue: 4167, // ~$4k
  },

  premiumListings: {
    pricePerDay: 500,
    averageListings: 20,
    monthlyRevenue: 300000, // $300k
  },

  analytics: {
    pricePerMonth: 100,
    subscribers: 500,
    monthlyRevenue: 50000, // $50k
  },
};

/**
 * Competitive positioning
 */
export const COMPETITIVE_ANALYSIS = {
  pumpFun: {
    creationFee: 5,
    tradingFee: 1.0,
    positioning: 'High volume, low quality',
  },
  raydium: {
    creationFee: 80,
    tradingFee: 0.25,
    positioning: 'Established, technical',
  },
  optik: {
    creationFee: 500, // Your standard tier
    tradingFee: 0.5,
    positioning: 'Premium quality, full service',
  },
};

export default MEMECOIN_TIERS;
