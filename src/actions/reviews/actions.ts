'use server'

import { createClient } from '@/lib/supabase/server'
import { requireRole } from '../auth/session'
import { reviewSchema, ReviewInput } from './validations'
import { revalidatePath } from 'next/cache'

export async function createReview(data: ReviewInput) {
  const { authorized, user } = await requireRole(['super admin', 'admin', 'user'])
  if (!authorized || !user) return { error: 'Unauthorized' }

  const result = reviewSchema.safeParse(data)
  if (!result.success) return { error: 'Invalid input', details: result.error.flatten().fieldErrors }

  const supabase = await createClient()

  // Ensure user actually bought the product before they can review it (REV-001)
  const { data: orderItems, error: fetchErr } = await supabase
    .from('order_items')
    .select('id, orders!inner(user_id)')
    .eq('product_id', result.data.productId)
    .eq('item_status', 'delivered')
    .eq('orders.user_id', user.id)

  if (fetchErr || !orderItems || orderItems.length === 0) {
    return { error: 'You can only review products that you have purchased and received.' }
  }

  // Check which ones are already reviewed
  const { data: existingReviews } = await supabase
    .from('reviews')
    .select('order_item_id')
    .eq('product_id', result.data.productId)
    .eq('user_id', user.id)

  const reviewedItemIds = new Set(existingReviews?.map(r => r.order_item_id) || [])
  const eligibleItem = orderItems.find(item => !reviewedItemIds.has(item.id))

  if (!eligibleItem) {
    return { error: 'You have already reviewed all your purchases for this product.' }
  }

  const { data: review, error } = await supabase
    .from('reviews')
    .insert([{
      order_item_id: eligibleItem.id,
      product_id: result.data.productId,
      user_id: user.id,
      rating: result.data.rating,
      comment: result.data.comment,
      is_approved: false // REV-003
    }])
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath(`/products/${result.data.productId}`)
  return { success: true, data: review }
}

export async function getProductReviews(productId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('reviews')
    .select('*, profiles(first_name, last_name)')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })

  if (error) return { error: error.message }

  return { success: true, data }
}
