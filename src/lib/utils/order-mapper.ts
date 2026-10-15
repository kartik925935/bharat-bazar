import { OrderStatus, MockOrder } from '@/lib/mock/orders'

export interface DbAddressRecord {
  full_name?: string | null
  fullName?: string | null
  phone?: string | null
  address_line1?: string | null
  addressLine1?: string | null
  address_line2?: string | null
  addressLine2?: string | null
  city?: string | null
  state?: string | null
  pincode?: string | null
}

export interface DbProductImageRecord {
  id?: string
  image_url?: string | null
  is_primary?: boolean | null
}

export interface DbSellerRecord {
  display_name?: string | null
}

export interface DbProductRecord {
  id?: string
  name?: string | null
  mrp?: number | string | null
  product_images?: DbProductImageRecord[] | null
  sellers?: DbSellerRecord | null
}

export interface DbOrderItemRecord {
  id?: string
  product_id?: string | null
  product_name?: string | null
  seller_name?: string | null
  unit_price?: number | string | null
  quantity?: number | string | null
  image_url?: string | null
  products?: DbProductRecord | null
}

export interface DbPaymentRecord {
  id?: string
  gateway?: string | null
  status?: string | null
  amount?: number | string | null
}

export interface DbOrderRecord {
  id: string
  order_number?: string | null
  status?: OrderStatus | null
  created_at?: string | null
  subtotal?: number | string | null
  discount_amount?: number | string | null
  delivery_charge?: number | string | null
  total_amount?: number | string | null
  shipping_address?: DbAddressRecord | null
  order_items?: DbOrderItemRecord[] | null
  payments?: DbPaymentRecord | DbPaymentRecord[] | null
}

export function mapDbOrderToUi(dbOrder: DbOrderRecord): MockOrder {
  const addr = dbOrder.shipping_address || {}
  const status: OrderStatus = dbOrder.status || 'confirmed'
  const createdAt = dbOrder.created_at || new Date().toISOString()
  const expectedDate = new Date(new Date(createdAt).getTime() + 4 * 24 * 60 * 60 * 1000).toISOString()

  const items = (dbOrder.order_items || []).map((item) => {
    const product = item.products || {}
    const primaryImg = product.product_images?.find((img) => img.is_primary)?.image_url
      || product.product_images?.[0]?.image_url
      || item.image_url
      || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600'

    const sellerName = item.seller_name
      || product.sellers?.display_name
      || 'Bharat Artisan'

    return {
      productId: item.product_id || item.id || '',
      name: item.product_name || product.name || 'Artisan Handcrafted Product',
      image: primaryImg,
      sellerName,
      sellerTier: 'Bronze Member',
      price: Number(item.unit_price) || 0,
      mrp: Number(product.mrp) || Number(item.unit_price) || 0,
      quantity: Number(item.quantity) || 1,
      reviewed: false,
    }
  })

  const isConfirmed = ['confirmed', 'processing', 'packed', 'shipped', 'in_transit', 'out_for_delivery', 'delivered'].includes(status)
  const isShipped = ['shipped', 'in_transit', 'out_for_delivery', 'delivered'].includes(status)
  const isOutForDelivery = ['out_for_delivery', 'delivered'].includes(status)
  const isDelivered = status === 'delivered'

  const timeline = [
    { status: 'confirmed' as const, label: 'Order Confirmed', timestamp: createdAt, description: 'Order confirmed by artisan', done: isConfirmed },
    { status: 'processing' as const, label: 'Packing & Preparing', timestamp: isConfirmed ? createdAt : null, description: 'Artisan is carefully packing your item', done: isConfirmed },
    { status: 'shipped' as const, label: 'Shipped', timestamp: isShipped ? createdAt : null, description: 'Package picked up by courier partner', done: isShipped },
    { status: 'out_for_delivery' as const, label: 'Out for Delivery', timestamp: isOutForDelivery ? createdAt : null, description: 'Driver is on the way to your address', done: isOutForDelivery },
    { status: 'delivered' as const, label: 'Delivered', timestamp: isDelivered ? createdAt : null, description: 'Delivered to your doorstep', done: isDelivered },
  ]

  const payment = Array.isArray(dbOrder.payments) ? dbOrder.payments[0] : dbOrder.payments

  return {
    id: dbOrder.id,
    orderNumber: dbOrder.order_number || `BB-ORD-${dbOrder.id.slice(0, 8).toUpperCase()}`,
    status,
    placedAt: createdAt,
    items,
    address: {
      name: addr.full_name || addr.fullName || 'Customer',
      phone: addr.phone || '',
      line1: addr.address_line1 || addr.addressLine1 || '',
      line2: addr.address_line2 || addr.addressLine2 || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || '',
    },
    subtotal: Number(dbOrder.subtotal) || Number(dbOrder.total_amount) || 0,
    discount: Number(dbOrder.discount_amount) || 0,
    shipping: Number(dbOrder.delivery_charge) || 0,
    total: Number(dbOrder.total_amount) || 0,
    paymentMethod: payment?.gateway ? (payment.gateway.toUpperCase() === 'COD' ? 'Cash on Delivery (COD)' : payment.gateway.toUpperCase()) : 'Cash on Delivery (COD)',
    paymentId: payment?.id || `PAY-${dbOrder.id.slice(0, 8).toUpperCase()}`,
    expectedDelivery: expectedDate,
    timeline,
    deliveryPartner: {
      name: 'Ramesh Kumar',
      vehicle: 'Hero Electric (KA-01-EE-2024)',
      rating: 4.8
    }
  }
}
