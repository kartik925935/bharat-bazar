import { randomInt, randomFloat, pick, randomDateWithin, INDIAN_CITIES, PRODUCT_CATEGORIES } from './seed'
import type { SASeller, SellerType, SellerTier } from '@/types/super-admin.types'

const FIRST_NAMES = ['Ravi', 'Suresh', 'Priya', 'Anita', 'Rajesh', 'Meena', 'Arjun', 'Kavita', 'Mohan', 'Sunita', 'Deepak', 'Lalita', 'Ramesh', 'Geeta', 'Vijay', 'Sarla', 'Ashok', 'Rekha', 'Mahesh', 'Usha', 'Narayan', 'Padma', 'Dilip', 'Jyoti', 'Gopal', 'Kamla', 'Hemant', 'Shanta', 'Kiran', 'Pushpa']
const LAST_NAMES = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Verma', 'Gupta', 'Mehta', 'Joshi', 'Rao', 'Nair', 'Reddy', 'Iyer', 'Agarwal', 'Chopra', 'Bose', 'Das', 'Mishra', 'Pandey', 'Tiwari', 'Chaudhary']
const SHOP_SUFFIXES = ['Crafts', 'Handlooms', 'Arts', 'Kala', 'Shilp', 'Creations', 'Emporium', 'Bazaar', 'Heritage', 'Studio']
const SELLER_TYPES: SellerType[] = ['ngo', 'village_producer', 'artisan', 'shop_owner', 'shg_group', 'professional']
const TIERS: SellerTier[] = ['bronze', 'silver', 'gold', 'platinum']
const KYC_STATUSES = ['pending', 'verified', 'rejected'] as const
const SELLER_STATUSES = ['active', 'pending', 'suspended', 'rejected', 'under_review'] as const

export function generateSellers(count = 35): SASeller[] {
  return Array.from({ length: count }, (_, i) => {
    const first = pick(FIRST_NAMES)
    const last = pick(LAST_NAMES)
    const location = pick(INDIAN_CITIES)
    const category = pick(PRODUCT_CATEGORIES)
    const tier = i < 5 ? 'platinum' : i < 12 ? 'gold' : i < 22 ? 'silver' : 'bronze'
    const kycStatus = i < 25 ? 'verified' : i < 30 ? 'pending' : 'rejected'
    const status = kycStatus === 'verified' ? 'active' : kycStatus === 'rejected' ? 'rejected' : 'pending'
    const joinedDaysAgo = randomInt(30, 730)
    const totalSales = tier === 'platinum' ? randomInt(500000, 2000000) : tier === 'gold' ? randomInt(100000, 500000) : tier === 'silver' ? randomInt(20000, 100000) : randomInt(1000, 20000)

    return {
      id: `seller-${String(i + 1).padStart(3, '0')}`,
      sellerId: `seller-${String(i + 1).padStart(3, '0')}`,
      legalName: `${first} ${last}`,
      displayName: `${first} ${last}`,
      username: `${first.toLowerCase()}.${last.toLowerCase()}${i + 1}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${i + 1}@artisan.in`,
      phone: `${pick(['9', '8', '7', '6'])}${String(randomInt(100000000, 999999999))}`,
      shopName: `${first}'s ${pick(SHOP_SUFFIXES)}`,
      sellerType: pick(SELLER_TYPES),
      status,
      tier,
      totalProducts: randomInt(5, 80),
      totalSales,
      totalOrders: randomInt(10, 800),
      rating: randomFloat(3.2, 5.0),
      joinedAt: randomDateWithin(joinedDaysAgo, joinedDaysAgo + 5),
      lastActive: randomDateWithin(0, 10),
      state: location.state,
      city: location.city,
      kycStatus,
      panVerified: kycStatus === 'verified',
      gstVerified: kycStatus === 'verified' && i % 3 !== 0,
      bankVerified: kycStatus === 'verified',
      commissionRate: pick([5, 7, 8, 10, 12]),
      shopCategory: category,
      village: pick(['Gujjar Colony', 'Weavers Lane', 'Potter Street', undefined as any]),
      district: location.city,
    } satisfies SASeller
  })
}
