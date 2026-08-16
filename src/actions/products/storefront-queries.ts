'use server'

import { createClient } from '@/lib/supabase/server'
import { Product, ProductSeller } from '@/types'

/**
 * Database row shape returned from Supabase queries
 */
interface ProductRow {
  id: string
  name: string
  slug: string
  description: string
  mrp: string | number
  selling_price: string | number
  sku: string
  weight?: number
  status: string
  category_id: string | null
  seller_id: string
  specifications?: Record<string, string>
  sellers?: {
    id: string
    seller_id: string
    first_name: string
    last_name: string
    tier: string
    type: string
    location: string
    avatar_url: string
    rating: number
  }
  product_images?: Array<{
    id: string
    image_url: string
    is_primary: boolean
  }>
  inventory?: Array<{
    id: string
    quantity_available: number
  }>
  categories?: {
    name: string
    slug: string
  } | null
}

/**
 * Maps Supabase product row to UI Product type
 * Applies defensive defaults for optional/mock fields
 */
function mapProductRow(row: ProductRow): Product {
  const seller: ProductSeller = {
    id: row.sellers?.id || row.seller_id,
    name: row.sellers ? `${row.sellers.first_name} ${row.sellers.last_name}`.trim() : 'Unknown Seller',
    username: row.sellers?.seller_id || 'seller',
    tier: (row.sellers?.tier as any) || 'bronze',
    type: (row.sellers?.type as any) || 'shop_owner',
    location: row.sellers?.location || 'India',
    avatar: row.sellers?.avatar_url || 'https://via.placeholder.com/48',
    rating: row.sellers?.rating || 4.0,
  }

  const images = row.product_images
    ? row.product_images
        .sort((a, b) => (a.is_primary ? -1 : 1))
        .map((img) => img.image_url)
    : ['https://via.placeholder.com/400']

  const inventoryQty = row.inventory?.[0]?.quantity_available || 0
  const inStock = inventoryQty > 0

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || '',
    price: Number(row.selling_price),
    mrp: Number(row.mrp),
    discount: Math.round(((Number(row.mrp) - Number(row.selling_price)) / Number(row.mrp)) * 100),
    rating: row.sellers?.rating || 4.5, // Use seller rating as fallback for now
    reviewCount: 0,
    images,
    category: row.categories?.slug || 'handcrafted',
    subcategory: undefined,
    seller,
    isNew: false,
    inStock,
    freeDelivery: true,
    tags: [],
    specifications: row.specifications || {},
  }
}

/**
 * Fetch published products for customer storefront listing
 * Supports filtering by category, search, price range
 */
export async function getStorefrontProducts(filters?: {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  sellerTier?: string
  location?: string
  rating?: number
  sort?: 'featured' | 'price-low' | 'price-high' | 'rating' | 'new'
  limit?: number
  offset?: number
}): Promise<{ data: Product[]; error?: string }> {
  try {
    const supabase = await createClient()

    // Build query - only fetch published products visible to customers
    let query = supabase
      .from('products')
      .select(
        `
        id,
        name,
        slug,
        description,
        mrp,
        selling_price,
        sku,
        weight,
        status,
        category_id,
        seller_id,
        specifications,
        sellers (
          id,
          seller_id,
          first_name,
          last_name,
          tier,
          type,
          location,
          avatar_url,
          rating
        ),
        product_images (
          id,
          image_url,
          is_primary
        ),
        inventory (
          id,
          quantity_available
        ),
        categories (
          name,
          slug
        )
      `,
        { count: 'exact' }
      )
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (filters?.category) {
      query = query.eq('categories.slug', filters.category)
    }

    if (filters?.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
      )
    }

    if (filters?.minPrice) {
      query = query.gte('selling_price', filters.minPrice)
    }

    if (filters?.maxPrice) {
      query = query.lte('selling_price', filters.maxPrice)
    }

    if (filters?.rating) {
      query = query.gte('sellers.rating', filters.rating)
    }

    if (filters?.sellerTier) {
      query = query.eq('sellers.tier', filters.sellerTier)
    }

    if (filters?.location) {
      query = query.ilike('sellers.location', `%${filters.location}%`)
    }

    // Apply pagination
    const offset = filters?.offset || 0
    const limit = Math.min(filters?.limit || 20, 100) // cap at 100
    query = query.range(offset, offset + limit - 1)

    const { data, error } = await query

    if (error) {
      return { data: [], error: error.message }
    }

    // Map rows to Product UI type
    const products = (data as unknown as ProductRow[]).map(mapProductRow)

    // Apply client-side sorts that require computed fields
    if (filters?.sort === 'price-low') {
      products.sort((a, b) => a.price - b.price)
    } else if (filters?.sort === 'price-high') {
      products.sort((a, b) => b.price - a.price)
    } else if (filters?.sort === 'rating') {
      products.sort((a, b) => b.rating - a.rating)
    } else if (filters?.sort === 'new') {
      products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
    }

    return { data: products }
  } catch (err: any) {
    return { data: [], error: err.message || 'Failed to fetch products' }
  }
}

/**
 * Fetch a single product by slug for customer detail page
 * Returns null if product doesn't exist or isn't published
 */
export async function getStorefrontProductBySlug(
  slug: string
): Promise<{ data: Product | null; error?: string }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('products')
      .select(
        `
        id,
        name,
        slug,
        description,
        mrp,
        selling_price,
        sku,
        weight,
        status,
        category_id,
        seller_id,
        specifications,
        sellers (
          id,
          seller_id,
          first_name,
          last_name,
          tier,
          type,
          location,
          avatar_url,
          rating
        ),
        product_images (
          id,
          image_url,
          is_primary
        ),
        inventory (
          id,
          quantity_available
        ),
        categories (
          name,
          slug
        )
      `
      )
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle()

    if (error) {
      return { data: null, error: (error as Error).message }
    }

    if (!data) {
      return { data: null }
    }

    const product = mapProductRow(data as unknown as ProductRow)
    return { data: product }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product'
    return { data: null, error: errorMessage }
  }
}

/**
 * Fetch products by seller ID for seller public storefront page
 * Only shows published products
 */
export async function getStorefrontProductsBySeller(
  sellerId: string,
  filters?: {
    search?: string
    minPrice?: number
    maxPrice?: number
    sort?: 'featured' | 'price-low' | 'price-high' | 'rating' | 'new'
    limit?: number
    offset?: number
  }
): Promise<{ data: Product[]; error?: string }> {
  try {
    const supabase = await createClient()

    let query = supabase
      .from('products')
      .select(
        `
        id,
        name,
        slug,
        description,
        mrp,
        selling_price,
        sku,
        weight,
        status,
        category_id,
        seller_id,
        specifications,
        sellers (
          id,
          seller_id,
          first_name,
          last_name,
          tier,
          type,
          location,
          avatar_url,
          rating
        ),
        product_images (
          id,
          image_url,
          is_primary
        ),
        inventory (
          id,
          quantity_available
        ),
        categories (
          name,
          slug
        )
      `
      )
      .eq('seller_id', sellerId)
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (filters?.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
      )
    }

    if (filters?.minPrice) {
      query = query.gte('selling_price', filters.minPrice)
    }

    if (filters?.maxPrice) {
      query = query.lte('selling_price', filters.maxPrice)
    }

    const offset = filters?.offset || 0
    const limit = Math.min(filters?.limit || 20, 100)
    query = query.range(offset, offset + limit - 1)

    const { data, error } = await query

    if (error) {
      return { data: [], error: (error as Error).message }
    }

    const products = (data as unknown as ProductRow[]).map(mapProductRow)

    if (filters?.sort === 'price-low') {
      products.sort((a, b) => a.price - b.price)
    } else if (filters?.sort === 'price-high') {
      products.sort((a, b) => b.price - a.price)
    } else if (filters?.sort === 'rating') {
      products.sort((a, b) => b.rating - a.rating)
    } else if (filters?.sort === 'new') {
      products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
    }

    return { data: products }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products'
    return { data: [], error: errorMessage }
  }
}

/**
 * Fetch featured/top products for home page carousel
 * Returns newest/highest-rated published products
 */
export async function getFeaturedProducts(limit: number = 12): Promise<{
  data: Product[]
  error?: string
}> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('products')
      .select(
        `
        id,
        name,
        slug,
        description,
        mrp,
        selling_price,
        sku,
        weight,
        status,
        category_id,
        seller_id,
        specifications,
        sellers (
          id,
          seller_id,
          first_name,
          last_name,
          tier,
          type,
          location,
          avatar_url,
          rating
        ),
        product_images (
          id,
          image_url,
          is_primary
        ),
        inventory (
          id,
          quantity_available
        ),
        categories (
          name,
          slug
        )
      `
      )
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      return { data: [], error: (error as Error).message }
    }

    const products = (data as unknown as ProductRow[]).map(mapProductRow)
    return { data: products }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch featured products'
    return { data: [], error: errorMessage }
  }
}

/**
 * Fetch products by a search query for the search modal
 */
export async function searchProducts(queryText: string, limit: number = 5): Promise<{
  data: Product[]
  error?: string
}> {
  try {
    const supabase = await createClient()

    if (!queryText || queryText.trim() === '') {
      return { data: [] }
    }

    const { data, error } = await supabase
      .from('products')
      .select(
        `
        id,
        name,
        slug,
        description,
        mrp,
        selling_price,
        sku,
        weight,
        status,
        category_id,
        seller_id,
        specifications,
        sellers (
          id,
          seller_id,
          first_name,
          last_name,
          tier,
          type,
          location,
          avatar_url,
          rating
        ),
        product_images (
          id,
          image_url,
          is_primary
        ),
        inventory (
          id,
          quantity_available
        ),
        categories (
          name,
          slug
        )
      `
      )
      .eq('status', 'published')
      .or(`name.ilike.%${queryText}%,description.ilike.%${queryText}%`)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      return { data: [], error: (error as Error).message }
    }

    const products = (data as unknown as ProductRow[]).map(mapProductRow)
    return { data: products }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to search products'
    return { data: [], error: errorMessage }
  }
}
