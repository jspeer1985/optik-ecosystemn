/**
 * OPTIK Token Configuration
 * OPTIK serves as both a trading token AND pairing token for all memecoins
 */

export const OPTIK_CONFIG = {
  // Token basics
  name: 'OPTIK',
  symbol: 'OPTIK',
  decimals: 9,
  totalSupply: 1_000_000_000, // 1 billion
  
  // Program IDs
  programId: process.env.NEXT_PUBLIC_OPTIK_TOKEN_PROGRAM!,
  mint: '', // Will be set after deployment
  
  // Pairing configuration
  isPairingToken: true,
  pairingPools: {
    // All memecoins must pair with OPTIK
    required: true,
    minLiquidity: 0.5, // SOL equivalent in OPTIK
    tradingFee: 0.5, // 0.5% fee
  },
  
  // Trading configuration
  isTradingToken: true,
  tradingPairs: ['SOL', 'USDC', 'USDT'],
  
  // Revenue model
  fees: {
    memecoinCreation: {
      basic: 0.5, // SOL
      standard: 2.5,
      premium: 12.5,
    },
    trading: 0.005, // 0.5%
    stakingReward: 0.05, // 5% of staking pool
  },
  
  // Vault configuration
  vault: {
    enabled: true,
    programId: process.env.NEXT_PUBLIC_VAULT_PROGRAM!,
    stakingApy: 12, // 12% base APY
    lockPeriods: [7, 30, 90, 180, 365], // days
  },
};

export default OPTIK_CONFIG;
