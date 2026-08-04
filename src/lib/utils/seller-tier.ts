export type SellerTierType = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface TierInfo {
  tier: SellerTierType;
  label: string;
  icon: string;
  badgeColor: string;
  textColor: string;
  nextTier?: {
    name: SellerTierType;
    salesNeeded: number;
    threshold: number;
  };
}

/**
 * Tier thresholds based on total completed sales / orders:
 * 0 - 49 sales: Bronze (Default for new sellers)
 * 50 - 199 sales: Silver
 * 200 - 999 sales: Gold
 * 1000+ sales: Platinum
 */
export const TIER_THRESHOLDS = {
  Bronze: 0,
  Silver: 50,
  Gold: 200,
  Platinum: 1000,
};

export function getSellerTier(totalSales: number = 0, explicitTier?: string): TierInfo {
  const sales = Math.max(0, Number(totalSales) || 0);

  let tierName: SellerTierType = 'Bronze';

  if (explicitTier && ['Bronze', 'Silver', 'Gold', 'Platinum'].includes(explicitTier)) {
    tierName = explicitTier as SellerTierType;
  } else if (explicitTier && ['bronze', 'silver', 'gold', 'platinum'].includes(explicitTier.toLowerCase())) {
    const capitalized = explicitTier.charAt(0).toUpperCase() + explicitTier.slice(1).toLowerCase();
    tierName = capitalized as SellerTierType;
  } else {
    // Dynamic calculation based on total sales
    if (sales >= TIER_THRESHOLDS.Platinum) {
      tierName = 'Platinum';
    } else if (sales >= TIER_THRESHOLDS.Gold) {
      tierName = 'Gold';
    } else if (sales >= TIER_THRESHOLDS.Silver) {
      tierName = 'Silver';
    } else {
      tierName = 'Bronze';
    }
  }

  let nextTierInfo;
  if (tierName === 'Bronze') {
    nextTierInfo = { name: 'Silver' as SellerTierType, salesNeeded: Math.max(0, TIER_THRESHOLDS.Silver - sales), threshold: TIER_THRESHOLDS.Silver };
  } else if (tierName === 'Silver') {
    nextTierInfo = { name: 'Gold' as SellerTierType, salesNeeded: Math.max(0, TIER_THRESHOLDS.Gold - sales), threshold: TIER_THRESHOLDS.Gold };
  } else if (tierName === 'Gold') {
    nextTierInfo = { name: 'Platinum' as SellerTierType, salesNeeded: Math.max(0, TIER_THRESHOLDS.Platinum - sales), threshold: TIER_THRESHOLDS.Platinum };
  }

  const configs: Record<SellerTierType, Omit<TierInfo, 'tier' | 'nextTier'>> = {
    Bronze: {
      label: 'Bronze Seller',
      icon: '🥉',
      badgeColor: 'bg-amber-100 border-amber-300',
      textColor: 'text-amber-800',
    },
    Silver: {
      label: 'Silver Seller',
      icon: '🥈',
      badgeColor: 'bg-slate-100 border-slate-300',
      textColor: 'text-slate-700',
    },
    Gold: {
      label: 'Gold Seller',
      icon: '🥇',
      badgeColor: 'bg-amber-100 border-amber-400',
      textColor: 'text-amber-600',
    },
    Platinum: {
      label: 'Platinum Seller',
      icon: '💎',
      badgeColor: 'bg-purple-100 border-purple-300',
      textColor: 'text-purple-700',
    },
  };

  return {
    tier: tierName,
    nextTier: nextTierInfo,
    ...configs[tierName],
  };
}
