'use server'

import { createClient } from '@/lib/supabase/server'
import type { SAReview } from '@/types/super-admin.types'

export async function fetchReviewsAction(): Promise<{ data: SAReview[], error?: string }> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        id, product_id, user_id, rating, title, body, images, is_approved, created_at, updated_at,
        products ( name, images, seller_id, sellers ( display_name, legal_name ) ),
        profiles ( full_name )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      if (error.code === '42P01') return { data: [] }
      throw error
    }

    const reviews: SAReview[] = data.map((r: any) => {
      const prod = r.products || {}
      const seller = prod.sellers || {}
      const cust = r.profiles || {}

      let sentimentLabel: 'very_positive' | 'positive' | 'neutral' | 'negative' | 'very_negative' = 'neutral'
      if (r.rating === 5) sentimentLabel = 'very_positive'
      else if (r.rating === 4) sentimentLabel = 'positive'
      else if (r.rating === 3) sentimentLabel = 'neutral'
      else if (r.rating === 2) sentimentLabel = 'negative'
      else if (r.rating === 1) sentimentLabel = 'very_negative'

      return {
        id: r.id,
        productId: r.product_id,
        productName: prod.name || 'Unknown Product',
        productImage: (prod.images && prod.images.length > 0) ? prod.images[0] : 'https://placehold.co/100',
        sellerId: prod.seller_id,
        sellerName: seller.display_name || seller.legal_name || 'Unknown Seller',
        customerId: r.user_id,
        customerName: cust.full_name || cust.email || 'Unknown',
        customerTier: 'bronze', // Mock for now until loyalty system exists
        rating: r.rating,
        title: r.title || '',
        body: r.body || '',
        images: r.images || [],
        sentimentScore: (r.rating / 5) * 100,
        sentimentLabel: sentimentLabel,
        status: r.is_approved ? 'approved' : 'pending_approval',
        createdAt: r.created_at,
        updatedAt: r.updated_at,
        verifiedPurchase: true,
        flaggedBy: null,
        helpfulVotes: 0,
        reviewVelocityFlag: false,
        sameDeviceFlag: false,
        purchaseToReviewDays: 5
      }
    })

    return { data: reviews }
  } catch (err: any) {
    return { data: [], error: err.message }
  }
}

export async function approveReviewAction(id: string): Promise<{ success: boolean, error?: string }> {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('reviews')
      .update({ is_approved: true })
      .eq('id', id)
      
    if (error) throw error
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function rejectReviewAction(id: string): Promise<{ success: boolean, error?: string }> {
  try {
    const supabase = await createClient()
    // For rejection, we either delete it or have a rejected status column.
    // Since we only have is_approved boolean, let's delete it so it doesn't show up in pending.
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id)
      
    if (error) throw error
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
