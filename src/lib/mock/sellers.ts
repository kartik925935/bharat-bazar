import { Seller, SellerTier } from '@/types';

export const TIER_COLORS: Record<SellerTier, string> = {
  bronze: 'text-amber-700 bg-amber-100 border-amber-300',
  silver: 'text-slate-600 bg-slate-100 border-slate-300',
  gold: 'text-yellow-700 bg-yellow-100 border-yellow-300',
  platinum: 'text-amber-800 bg-amber-50 border-amber-400',
};

export const TIER_ICONS: Record<SellerTier, string> = {
  bronze: '🥉',
  silver: '🥈',
  gold: '🥇',
  platinum: '💎',
};

export const TIER_BADGE: Record<string, { bg: string; text: string; icon: string }> = {
  Platinum: { bg: '#F3E8FF', text: '#5B21B6', icon: '💎' },
  Gold: { bg: '#FEF3C7', text: '#92400E', icon: '🥇' },
  Silver: { bg: '#F1F5F9', text: '#475569', icon: '🥈' },
  Bronze: { bg: '#FEF0E6', text: '#9A3412', icon: '🥉' },
};

export const tierColors: Record<string, string> = {
  Platinum: '#BF953F',
  Gold: '#FFB800',
  Silver: '#9E9E9E',
  Bronze: '#CD7F32',
};

export const tierIcons: Record<string, string> = {
  Platinum: '💎',
  Gold: '🥇',
  Silver: '🥈',
  Bronze: '🥉',
};

export const mockSellers: Seller[] = ([] as any[]);

export const sellers = ([] as any[]);

export const SELLERS = ([] as any[]);

export const ALL_SELLERS = ([] as any[]);

export const MOCK_SELLER_PRODUCTS = ([] as any[]);

export const MOCK_SELLER_EARNINGS = ([] as any[]);

export const MOCK_SELLER_ORDERS_LIST = ([] as any[]);

export const MOCK_SELLER_COUPONS_LIST = ([] as any[]);

export const MOCK_SELLER_RETURNS_LIST = ([] as any[]);

export const MOCK_SELLER_REVIEWS_LIST = ([] as any[]);

export const INVENTORY = ([] as any[]);

export const SELLER_ORDERS = ([] as any[]);

export const SELLER_NOTIFS = ([] as any[]);

