'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireRole } from '../auth/session'
import { createOrderSchema, CreateOrderInput, updateOrderStatusSchema, UpdateOrderStatusInput } from './validations'
import { revalidatePath } from 'next/cache'

export interface CreatedOrderData {
  id: string
  order_number: string
  total_amount: number
  subtotal?: number
  discount_amount?: number
  delivery_charge?: number
  status: string
  created_at?: string
  shipping_address?: any
}

export async function createOrder(data: CreateOrderInput): Promise<{
  success?: boolean
  error?: string
  details?: any
  data?: CreatedOrderData
}> {
  const { authorized, user } = await requireRole(['super admin', 'admin', 'user'])
  if (!authorized || !user) return { error: 'Unauthorized' }

  const result = createOrderSchema.safeParse(data)
  if (!result.success) return { error: 'Invalid input', details: result.error.flatten().fieldErrors }

  const adminSupabase = createAdminClient()

  // Execute create_order_from_cart RPC which validates inventory, calculates discounts,
  // creates orders and order_items rows, and decrements inventory
  const { data: orderId, error } = await adminSupabase.rpc('create_order_from_cart', {
    p_user_id: user.id,
    p_shipping_address_id: result.data.shippingAddressId
  })

  if (error) return { error: error.message }

  // Retrieve full newly created order information
  const { data: orderDetails, error: fetchError } = await adminSupabase
    .from('orders')
    .select('id, order_number, total_amount, subtotal, discount_amount, delivery_charge, status, created_at, shipping_address')
    .eq('id', orderId)
    .single()

  if (fetchError || !orderDetails) {
    return {
      success: true,
      data: {
        id: orderId as string,
        order_number: `ORD-${(orderId as string).slice(0, 8).toUpperCase()}`,
        total_amount: 0,
        status: 'confirmed'
      }
    }
  }

  revalidatePath('/orders')
  revalidatePath('/cart')
  return { success: true, data: orderDetails as CreatedOrderData }
}

export async function getOrders() {
  const { authorized, user } = await requireRole(['super admin', 'admin', 'user', 'seller'])
  if (!authorized || !user) return { error: 'Unauthorized' }

  const adminSupabase = createAdminClient()

  const isCustomer = user.role === 'user' || user.role === 'customer'
  const isSeller = user.role === 'seller'

  if (isCustomer) {
    const { data, error } = await adminSupabase
      .from('orders')
      .select('*, order_items(*, products(*, product_images(*), sellers(display_name)))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) return { error: error.message }
    return { success: true, data: data || [] }
  }

  if (isSeller) {
    // 1. Find seller record for current user
    const { data: seller, error: sellerError } = await adminSupabase
      .from('sellers')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (sellerError || !seller) {
      return { success: true, data: [] }
    }

    // 2. Find order items associated with this seller
    const { data: sellerItems, error: itemsError } = await adminSupabase
      .from('order_items')
      .select('order_id')
      .eq('seller_id', seller.id)

    if (itemsError || !sellerItems || sellerItems.length === 0) {
      return { success: true, data: [] }
    }

    const uniqueOrderIds = Array.from(new Set(sellerItems.map(item => item.order_id)))

    // 3. Query orders containing this seller's products
    const { data: orders, error: ordersError } = await adminSupabase
      .from('orders')
      .select('*, order_items(*, products(*, product_images(*), sellers(display_name)))')
      .in('id', uniqueOrderIds)
      .order('created_at', { ascending: false })

    if (ordersError) return { error: ordersError.message }

    // Filter order items to only include products belonging to this seller
    const filteredOrders = (orders || []).map(order => ({
      ...order,
      order_items: (order.order_items || []).filter((item: { seller_id?: string | null }) => item.seller_id === seller.id)
    }))

    return { success: true, data: filteredOrders }
  }

  // Admins and Super Admins see all orders
  const { data, error } = await adminSupabase
    .from('orders')
    .select('*, order_items(*, products(*, product_images(*), sellers(display_name)))')
    .order('created_at', { ascending: false })

  if (error) return { error: error.message }

  return { success: true, data: data || [] }
}

export async function getOrderById(orderId: string) {
  const { authorized, user } = await requireRole(['super admin', 'admin', 'user', 'seller'])
  if (!authorized || !user) return { error: 'Unauthorized' }

  const adminSupabase = createAdminClient()

  let query = adminSupabase
    .from('orders')
    .select('*, order_items(*, products(*, product_images(*), sellers(display_name))), payments(*)')

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId)
  if (isUuid) {
    query = query.eq('id', orderId)
  } else {
    query = query.eq('order_number', orderId)
  }

  const { data: order, error } = await query.maybeSingle()

  if (error || !order) return { error: 'Order not found' }

  const isAdmin = user.role === 'admin' || user.role === 'super admin' || user.role === 'super_admin'
  const isOwner = order.user_id === user.id

  if (!isAdmin && !isOwner) {
    if (user.role === 'seller') {
      const { data: seller } = await adminSupabase
        .from('sellers')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      const hasItem = (order.order_items || []).some((item: { seller_id?: string | null }) => item.seller_id === seller?.id)
      if (!hasItem) return { error: 'Unauthorized' }
    } else {
      return { error: 'Unauthorized' }
    }
  }

  return { success: true, data: order }
}

export async function updateOrderStatus(data: UpdateOrderStatusInput) {
  const { authorized, user } = await requireRole(['super admin', 'admin', 'seller'])
  if (!authorized || !user) return { error: 'Unauthorized' }

  const result = updateOrderStatusSchema.safeParse(data)
  if (!result.success) return { error: 'Invalid input', details: result.error.flatten().fieldErrors }

  const adminSupabase = createAdminClient()

  // Seller ownership check: seller can only update orders that contain their products
  const isAdmin = user.role === 'admin' || user.role === 'super admin' || user.role === 'super_admin'

  if (!isAdmin) {
    const { data: seller } = await adminSupabase
      .from('sellers')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!seller) {
      return { error: 'Unauthorized: Seller profile not found' }
    }

    // Check if seller has items in this order
    const { data: items, error: itemsError } = await adminSupabase
      .from('order_items')
      .select('id')
      .eq('order_id', result.data.orderId)
      .eq('seller_id', seller.id)

    if (itemsError || !items || items.length === 0) {
      return { error: 'Unauthorized: You do not have products in this order' }
    }

    // Update item status for seller's items in this order
    await adminSupabase
      .from('order_items')
      .update({ item_status: result.data.status })
      .eq('order_id', result.data.orderId)
      .eq('seller_id', seller.id)
  }

  // Update order status
  const { error } = await adminSupabase
    .from('orders')
    .update({ status: result.data.status, updated_at: new Date().toISOString() })
    .eq('id', result.data.orderId)

  if (error) return { error: error.message }

  revalidatePath('/orders')
  return { success: true }
}
