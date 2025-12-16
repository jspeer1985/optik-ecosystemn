// Revenue streams: launch_fees, platform_fees, trading_fees
export const REVENUE_CONFIG = {
  LAUNCH_FEES: {
    BASIC: 100,
    STANDARD: 500,
    PREMIUM: 2500,
  },
  PLATFORM_FEE_PERCENT: 2.5,
  TRADING_FEE_PERCENT: 0.5,
  OPTIK_SHARE_TRADING: 50, // 50% of trading fees
  CREATOR_SHARE_TRADING: 50, // 50% to creator
  OPTIK_GPT_COST: 1, // 1 OPTIK per query
};

export function calculateLaunchRevenue(tier: 'BASIC' | 'STANDARD' | 'PREMIUM'): {
  launchFee: number;
  platformFee: number;
  total: number;
} {
  const launchFee = REVENUE_CONFIG.LAUNCH_FEES[tier];
  const platformFee = (launchFee * REVENUE_CONFIG.PLATFORM_FEE_PERCENT) / 100;
  const total = launchFee + platformFee;

  return { launchFee, platformFee, total };
}

export function calculateTradingFeeShare(tradingVolume: number): {
  totalFee: number;
  creatorShare: number;
  optikShare: number;
} {
  const totalFee = (tradingVolume * REVENUE_CONFIG.TRADING_FEE_PERCENT) / 100;
  const creatorShare = totalFee * (REVENUE_CONFIG.CREATOR_SHARE_TRADING / 100);
  const optikShare = totalFee * (REVENUE_CONFIG.OPTIK_SHARE_TRADING / 100);

  return { totalFee, creatorShare, optikShare };
}

export function projectRevenue(tokensPerDay: number, avgVolumePerToken: number) {
  const dailyLaunchRevenue = tokensPerDay * REVENUE_CONFIG.LAUNCH_FEES.STANDARD;
  const dailyPlatformFees = dailyLaunchRevenue * (REVENUE_CONFIG.PLATFORM_FEE_PERCENT / 100);

  const totalDailyVolume = tokensPerDay * avgVolumePerToken;
  const { optikShare: dailyTradingRevenue } = calculateTradingFeeShare(totalDailyVolume);

  const dailyTotal = dailyLaunchRevenue + dailyPlatformFees + dailyTradingRevenue;

  return {
    daily: {
      launches: dailyLaunchRevenue,
      platformFees: dailyPlatformFees,
      trading: dailyTradingRevenue,
      total: dailyTotal,
    },
    weekly: dailyTotal * 7,
    monthly: dailyTotal * 30,
    quarterly: dailyTotal * 90,
    yearly: dailyTotal * 365,
  };
}
