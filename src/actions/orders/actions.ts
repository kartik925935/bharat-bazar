'use server'

import { createClient } from '@/lib/supabase/server'
import { requireRole } from '../auth/session'
import { createOrderSchema, CreateOrderInput, updateOrderStatusSchema, UpdateOrderStatusInput } from './validations'
import { revalidatePath } from 'next/cache'

export async function createOrder(data: CreateOrderInput) {
  const { authorized, user } = await requireRole(['super admin', 'admin', 'user'])
  if (!authorized || !user) return { error: 'Unauthorized' }

  const result = createOrderSchema.safeParse(data)
  if (!result.success) return { error: 'Invalid input', details: result.error.flatten().fieldErrors }

  const supabase = await createClient()

  // In a real application, you would calculate total from cart_items and create order and order_items in a transaction
  // using a Supabase RPC (stored procedure). Here is a placeholder for the RPC call.
  const { data: order, error } = await supabase.rpc('create_order_from_cart', {
    p_user_id: user.id,
    p_shipping_address_id: result.data.shippingAddressId
  })

  if (error) return { error: error.message }

  revalidatePath('/orders')
  revalidatePath('/cart')
  return { success: true, data: order }
}

export async function getOrders() {
  const { authorized, user } = await requireRole(['super admin', 'admin', 'user', 'seller'])
  if (!authorized || !user) return { error: 'Unauthorized' }

  const supabase = await createClient()
  
  let query = supabase.from('orders').select('*, order_items(*, products(*))')
  
  if (user.role === 'user') {
    query = query.eq('user_id', user.id)
  } else if (user.role === 'seller') {
    // Seller should only see orders containing their products, often handled via a view or RPC
    // Fallback: This requires specific RLS or complex query
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) return { error: error.message }

  return { success: true, data }
}

export async function updateOrderStatus(data: UpdateOrderStatusInput) {
  const { authorized, user } = await requireRole(['super admin', 'admin', 'seller'])
  if (!authorized || !user) return { error: 'Unauthorized' }

  const result = updateOrderStatusSchema.safeParse(data)
  if (!result.success) return { error: 'Invalid input', details: result.error.flatten().fieldErrors }

  const supabase = await createClient()

  const { error } = await supabase
    .from('orders')
    .update({ status: result.data.status })
    .eq('id', result.data.orderId)

  if (error) return { error: error.message }

  revalidatePath('/orders')
  return { success: true }
}
