'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export type ProductStatus =
  | 'draft'
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'published'
  | 'archived'
  | 'changes_required'

/**
 * Admin/Super-admin action to update product status
 * Used for publishing products to customer catalog, rejecting, archiving, etc.
 */
export async function updateProductStatus(
  productId: string,
  newStatus: ProductStatus,
  rejectionNotes?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient()

    const updateData: Record<string, string> = { status: newStatus }
    if (rejectionNotes) {
      updateData.rejection_notes = rejectionNotes
    }

    const { error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', productId)

    if (error) {
      return { success: false, error: error.message }
    }

    // Revalidate storefront paths when product becomes published
    if (newStatus === 'published') {
      revalidatePath('/products')
      revalidatePath('/')
      revalidatePath('/super-admin/products')
      revalidatePath('/seller/**')
    }

    // Also revalidate admin pages for any status change
    revalidatePath('/super-admin/products')

    return { success: true }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to update product status'
    return { success: false, error: errorMessage }
  }
}

/**
 * Admin action to bulk publish multiple products
 */
export async function bulkPublishProducts(
  productIds: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient()

    const { error } = await supabase
      .from('products')
      .update({ status: 'published' })
      .in('id', productIds)

    if (error) {
      return { success: false, error: error.message }
    }

    // Revalidate storefront and admin paths
    revalidatePath('/products')
    revalidatePath('/')
    revalidatePath('/super-admin/products')

    return { success: true }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to bulk publish products'
    return { success: false, error: errorMessage }
  }
}
