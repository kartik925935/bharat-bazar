import { randomInt, pick } from './seed'
import type { SACoupon } from '@/types/super-admin.types'

const COUPON_TYPES = ['percentage', 'flat', 'free_shipping', 'bogo'] as const
const COUPON_TARGETS = ['all', 'seller', 'category', 'product'] as const

export function generateCoupons(count = 12): SACoupon[] {
  const now = Date.now()
  const CODES = [
    'BHARAT10', 'ARTISAN20', 'CRAFTFEST', 'WELCOME15', 'FESTIVE25',
    'DIWALI30', 'HOLI20', 'SUMMER15', 'MONSOON10', 'NEWUSER50',
    'HANDLOOM20', 'POTTERY15'
  ]
  const DESCRIPTIONS = [
    '10% off on all products', '20% off for artisan purchases', 'Festival special discount',
    'Welcome offer for new users', '25% off festive collection', '30% off Diwali sale',
    '20% off Holi special', 'Summer sale 15% off', 'Monsoon clearance', 'New user flat 50% off',
    '20% off handloom products', '15% off pottery items'
  ]

  return Array.from({ length: count }, (_, i) => {
    const isActive = i < 7
    const discountType = pick(COUPON_TYPES)
    const discountValue = discountType === 'percentage' ? randomInt(5, 40) : discountType === 'flat' ? randomInt(50, 500) : 0
    const totalUses = randomInt(50, 2000)
    const abuseFlagCount = i < 3 ? randomInt(3, 15) : 0

    return {
      id: `coupon-${String(i + 1).padStart(3, '0')}`,
      code: CODES[i] ?? `PROMO${randomInt(100, 999)}`,
      type: pick(['percentage', 'fixed', 'buy_x_get_y']),
      value: randomInt(10, 500),
      minOrder: randomInt(200, 1000),
      maxDiscount: randomInt(100, 1000),
      usageLimit: randomInt(100, 5000),
      usageCount: totalUses,
      userLimit: 1,
      status: isActive ? 'active' : (i % 2 === 0 ? 'inactive' : 'expired'),
      appliesTo: pick(['all', 'category', 'seller', 'product']),
      startDate: new Date(now - randomInt(1, 60) * 86400000).toISOString(),
      endDate: isActive
        ? new Date(now + randomInt(5, 60) * 86400000).toISOString()
        : new Date(now - randomInt(1, 30) * 86400000).toISOString(),
      createdBy: 'sa-001',
      createdAt: new Date(now - randomInt(30, 180) * 86400000).toISOString(),
      // Abuse analytics (custom properties added for UI)
      abuseFlagCount,
      uniqueUsers: Math.round(totalUses * randomInt(60, 95) / 100),
      avgOrderValue: randomInt(800, 4500),
      description: DESCRIPTIONS[i] ?? 'Special discount',
    } as SACoupon & { abuseFlagCount: number; uniqueUsers: number; avgOrderValue: number; description: string }
  })
}
