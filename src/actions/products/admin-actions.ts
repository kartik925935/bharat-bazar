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
  | 'suspended'

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

    // Revalidate storefront paths when product status changes (e.g. published, rejected, unarchived)
    revalidatePath('/products', 'layout')
    revalidatePath('/', 'page')
    revalidatePath('/super-admin/products', 'page')
    revalidatePath('/seller', 'layout')

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

/**
 * Fetch all products for admin oversight, including seller info and inventory
 */
export async function getAdminProducts(): Promise<{ data: any[]; error?: string }> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        description,
        specifications,
        selling_price,
        status,
        created_at,
        inventory ( quantity_available ),
        categories ( name ),
        sellers ( seller_id, display_name ),
        product_images ( image_url )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      return { data: [], error: error.message }
    }

    const mapped = data.map((p: any) => {
      const seller = Array.isArray(p.sellers) ? p.sellers[0] : p.sellers
      const category = Array.isArray(p.categories) ? p.categories[0] : p.categories
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        sellerName: seller ? seller.display_name : 'Unknown',
        sellerId: seller?.seller_id || '',
        category: category?.name || 'Uncategorized',
        price: p.selling_price || 0,
        mrp: p.selling_price || 0,
        stock: p.stock_quantity || (p.inventory ? p.inventory.quantity_available : 0) || 0,
        images: p.product_images?.map((img: any) => img.image_url) || [],
        sales: 0,
        totalSales: 0,
        status: p.status,
        createdAt: p.created_at,
        updatedAt: p.created_at, // Use created_at as fallback since updated_at might not be selected
        sku: p.slug || p.id,
        completenessScore: 85, // Mocked for now
        priceAnomalyFlag: false, // Mocked for now
        rating: 0,
        totalReviews: 0,
        qualityFlags: [],
        description: p.description || '',
        specifications: p.specifications || {},
        discount: 0
      }
    })

    return { data: mapped }
  } catch (err) {
    return { data: [], error: err instanceof Error ? err.message : 'Error fetching products' }
  }
}

/**
 * Fetch a single product's detailed info for admin review
 */
export async function getAdminProductById(id: string): Promise<{ data: any | null; error?: string }> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        description,
        specifications,
        selling_price,
        status,
        created_at,
        rejection_notes,
        inventory ( quantity_available ),
        categories ( name ),
        sellers ( seller_id, display_name ),
        product_images ( image_url )
      `)
      .eq('id', id)
      .maybeSingle()

    if (error) {
      return { data: null, error: error.message }
    }

    if (!data) return { data: null }

    const p: any = data
    const seller = Array.isArray(p.sellers) ? p.sellers[0] : p.sellers
    const category = Array.isArray(p.categories) ? p.categories[0] : p.categories

    const mapped = {
      id: p.id,
      name: p.name,
      slug: p.slug,
      sellerName: seller ? seller.display_name : 'Unknown',
      sellerId: seller?.seller_id || '',
      category: category?.name || 'Uncategorized',
      price: p.selling_price || 0,
      mrp: p.selling_price || 0,
      stock: p.stock_quantity || (p.inventory ? p.inventory.quantity_available : 0) || 0,
      images: p.product_images?.map((img: any) => img.image_url) || [],
      sales: 0,
      totalSales: 0,
      status: p.status,
      flagReason: p.rejection_notes,
      createdAt: p.created_at,
      updatedAt: p.created_at, // Use created_at as fallback
      sku: p.slug || p.id,
      completenessScore: 85, // Mocked for now
      priceAnomalyFlag: false, // Mocked for now
      rating: 0,
      totalReviews: 0,
      qualityFlags: [],
      description: p.description || '',
      specifications: p.specifications || {},
      discount: 0
    }

    return { data: mapped }
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Error fetching product details' }
  }
}
