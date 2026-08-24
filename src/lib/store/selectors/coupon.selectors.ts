import type { SACoupon } from '@/types/super-admin.types'

export interface CouponState {
  coupons: SACoupon[]
}

export const getCouponStats = (state: CouponState) => {
  const now = new Date()
  const active = state.coupons.filter(c => c.status === 'active').length
  const inactive = state.coupons.filter(c => c.status === 'inactive').length
  const expired = state.coupons.filter(c => c.status === 'expired').length
  const totalUses = state.coupons.reduce((sum, c) => sum + (c.usageCount ?? 0), 0)

  return { active, inactive, expired, total: state.coupons.length, totalUses }
}
