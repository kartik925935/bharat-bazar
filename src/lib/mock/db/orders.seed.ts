import { randomInt, randomFloat, pick, randomDateWithin, INDIAN_CITIES } from './seed'
import type { SAOrder, OrderStatus } from '@/types/super-admin.types'
import type { SASeller } from '@/types/super-admin.types'
import type { SACustomer } from '@/types/super-admin.types'
import type { SADeliveryPartner } from '@/types/super-admin.types'
import { PRODUCT_CATEGORIES } from './seed'

const ORDER_STATUSES: OrderStatus[] = [
  'delivered', 'delivered', 'delivered', 'delivered', 'delivered',
  'in_transit', 'in_transit', 'out_for_delivery',
  'processing', 'confirmed',
  'cancelled', 'return_requested', 'refunded',
  'pending_payment',
]
const PAYMENT_METHODS = ['upi', 'credit_card', 'debit_card', 'net_banking', 'cod', 'wallet']
const PAYMENT_STATUSES = ['paid', 'paid', 'paid', 'paid', 'pending', 'failed', 'refunded'] as const
const ADDRESSES = ['12 MG Road', '45 Nehru Nagar', '7 Gandhi Chowk', '88 Subhash Colony', '3 Patel Nagar', '22 Rajiv Marg', '101 Ambedkar Bhavan']

export interface SAOrderWithCommission extends SAOrder {
  commissionAmount: number
  commissionRate: number
  grossAmount: number
  items: Array<{ productId: string; name: string; price: number; quantity: number; category: string }>
}

export function generateOrders(
  sellers: SASeller[],
  customers: SACustomer[],
  deliveryPartners: SADeliveryPartner[],
  productIds: Array<{ id: string; name: string; price: number; category: string }>,
  count = 70
): SAOrderWithCommission[] {
  return Array.from({ length: count }, (_, i) => {
    const seller = pick(sellers.filter(s => s.status === 'active'))
    const customer = pick(customers.filter(c => c.status === 'active'))
    const dp = pick(deliveryPartners)
    const status: OrderStatus = pick(ORDER_STATUSES)
    const paymentStatus = status === 'cancelled' ? 'refunded' : status === 'refunded' ? 'refunded' : pick(['paid', 'paid', 'paid', 'pending'] as const)
    const createdDaysAgo = randomInt(0, 90)
    const createdAt = randomDateWithin(createdDaysAgo, createdDaysAgo)
    const location = pick(INDIAN_CITIES)

    // Generate 1-4 items
    const itemCount = randomInt(1, 4)
    const orderProducts = pick(productIds)
    const items = Array.from({ length: itemCount }, (_, j) => {
      const p = productIds[(i + j) % productIds.length]
      return {
        productId: p.id,
        name: p.name,
        price: p.price,
        quantity: randomInt(1, 3),
        category: p.category,
      }
    })

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const commissionRate = seller.commissionRate ?? 8
    const commissionAmount = Math.round(totalAmount * commissionRate / 100)

    return {
      id: `ord-${String(i + 1).padStart(4, '0')}`,
      orderId: `BB${String(20000 + i).padStart(6, '0')}`,
      customerId: customer.id,
      customerName: customer.name,
      sellerId: seller.id,
      sellerName: seller.shopName,
      products: items.map(it => it.name),
      items,
      totalAmount,
      status,
      paymentMethod: pick(PAYMENT_METHODS),
      paymentStatus,
      deliveryPartnerId: ['in_transit', 'out_for_delivery', 'delivered'].includes(status) ? dp.id : undefined,
      deliveryPartnerName: ['in_transit', 'out_for_delivery', 'delivered'].includes(status) ? dp.name : undefined,
      createdAt,
      updatedAt: randomDateWithin(0, createdDaysAgo),
      deliveredAt: status === 'delivered' ? randomDateWithin(0, createdDaysAgo - 1) : undefined,
      address: pick(ADDRESSES),
      city: location.city,
      state: location.state,
      // Derived finance fields
      commissionAmount,
      commissionRate,
      grossAmount: totalAmount,
    }
  })
}
