'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireRole } from '../auth/session'
import { processPaymentSchema, ProcessPaymentInput } from './validations'
import { revalidatePath } from 'next/cache'

export async function processPayment(data: ProcessPaymentInput) {
  const { authorized, user } = await requireRole(['super admin', 'admin', 'user'])
  if (!authorized || !user) return { error: 'Unauthorized' }

  const result = processPaymentSchema.safeParse(data)
  if (!result.success) return { error: 'Invalid input', details: result.error.flatten().fieldErrors }

  const adminSupabase = createAdminClient()

  // 1. Verify order exists and belongs to the authenticated user (or admin)
  const { data: order, error: orderError } = await adminSupabase
    .from('orders')
    .select('id, user_id, total_amount, status')
    .eq('id', result.data.orderId)
    .single()

  if (orderError || !order) {
    return { error: 'Order not found' }
  }

  // Security check: Customer can only pay for their own order
  const isAdmin = user.role === 'admin' || user.role === 'super admin' || user.role === 'super_admin'
  if (!isAdmin && order.user_id !== user.id) {
    return { error: 'Unauthorized: Cannot pay for another customer\'s order' }
  }

  // Prevent amount tampering (S3 / D7 fix): use server-verified order total
  const serverAmount = order.total_amount
  if (result.data.amount && Math.abs(result.data.amount - serverAmount) > 0.05) {
    return { error: `Payment amount ₹${result.data.amount} does not match order total ₹${serverAmount}` }
  }

  const isCod = result.data.paymentMethodId.toLowerCase() === 'cod'
  const paymentStatus = isCod ? 'pending' : 'completed'

  // Insert payment record matching database schema (amount, currency, gateway, order_id, status)
  const { data: payment, error: paymentError } = await adminSupabase
    .from('payments')
    .insert([{
      order_id: order.id,
      amount: serverAmount,
      currency: 'INR',
      gateway: result.data.paymentMethodId,
      status: paymentStatus
    }])
    .select()
    .single()

  if (paymentError) return { error: paymentError.message }

  // Update order status: COD orders stay 'confirmed', paid orders become 'processing'
  const nextOrderStatus = isCod ? 'confirmed' : 'processing'
  await adminSupabase
    .from('orders')
    .update({ status: nextOrderStatus })
    .eq('id', order.id)

  revalidatePath('/orders')
  return { success: true, data: payment }
}

export async function getPaymentStatus(orderId: string) {
  const { authorized, user } = await requireRole(['super admin', 'admin', 'user'])
  if (!authorized || !user) return { error: 'Unauthorized' }

  const supabase = await createClient()

  // Verify ownership before exposing payment status
  const { data: order } = await supabase
    .from('orders')
    .select('user_id')
    .eq('id', orderId)
    .single()

  const isAdmin = user.role === 'admin' || user.role === 'super admin' || user.role === 'super_admin'
  if (!isAdmin && order?.user_id !== user.id) {
    return { error: 'Unauthorized' }
  }

  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('order_id', orderId)
    .maybeSingle()

  if (error) return { error: error.message }

  return { success: true, data }
}
