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

  // Ensure user actually bought the product before they can review it (Business Logic)
  // This can be checked via a query to orders and order_items or RLS.

  const { data: review, error } = await supabase
    .from('reviews')
    .insert([{
      product_id: result.data.productId,
      user_id: user.id,
      rating: result.data.rating,
      comment: result.data.comment
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
