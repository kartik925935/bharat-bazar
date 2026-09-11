'use server'

import { createClient } from '@/lib/supabase/server'
import { requireRole } from '../auth/session'
import { returnSchema, ReturnInput } from './validations'
import { revalidatePath } from 'next/cache'

export async function createReturnRequest(data: ReturnInput) {
  const { authorized, user } = await requireRole(['super admin', 'admin', 'user'])
  if (!authorized || !user) return { error: 'Unauthorized' }

  const result = returnSchema.safeParse(data)
  if (!result.success) return { error: 'Invalid input', details: result.error.flatten().fieldErrors }

  const supabase = await createClient()

  // Check order item delivery status and window (RR-001)
  const { data: orderItem, error: itemError } = await supabase
    .from('order_items')
    .select('delivered_at, item_status')
    .eq('id', result.data.orderItemId)
    .single()

  if (itemError || !orderItem) return { error: 'Order item not found' }
  if (orderItem.item_status !== 'delivered') return { error: 'Item has not been delivered yet' }
  
  if (orderItem.delivered_at) {
    const daysSinceDelivery = (Date.now() - new Date(orderItem.delivered_at).getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceDelivery > 7) return { error: 'Return window of 7 days has expired' }
  } else {
    return { error: 'Delivery date not found, cannot calculate return window' }
  }

  const { data: returnRequest, error } = await supabase
    .from('returns')
    .insert([{
      order_item_id: result.data.orderItemId,
      user_id: user.id,
      reason: result.data.reason,
      evidence_photo_url: result.data.evidencePhotoUrl,
      status: 'requested'
    }])
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/returns')
  revalidatePath('/orders')
  return { success: true, data: returnRequest }
}

export async function getReturnRequests() {
  const { authorized, user } = await requireRole(['super admin', 'admin', 'seller'])
  if (!authorized || !user) return { error: 'Unauthorized' }

  const supabase = await createClient()

  const query = supabase.from('returns').select('*, order_items(*)')
  
  if (user.role === 'seller') {
    // Requires RLS or joining to see if order_item belongs to seller's products
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) return { error: error.message }

  return { success: true, data }
}

export async function initiateRefund(returnId: string) {
  const { authorized } = await requireRole(['super admin', 'admin'])
  if (!authorized) return { error: 'Unauthorized' }

  const supabase = await createClient()

  // 1. Check if return status is quality_checked (RR-003)
  const { data: returnReq, error: fetchErr } = await supabase
    .from('returns')
    .select('status, order_item_id')
    .eq('id', returnId)
    .single()

  if (fetchErr || !returnReq) return { error: 'Return request not found' }
  if (returnReq.status !== 'quality_checked') {
    return { error: 'Refund can only be initiated after physical item is quality checked.' }
  }

  // 2. Update status to refund_initiated
  const { error: updateErr } = await supabase
    .from('returns')
    .update({ status: 'refund_initiated' })
    .eq('id', returnId)

  if (updateErr) return { error: updateErr.message }

  revalidatePath('/returns')
  return { success: true }
}
