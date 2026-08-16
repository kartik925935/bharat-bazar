'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export interface SellerProductInsert {
  sellerTextId: string;  // e.g. "SEL-IND-000004"
  name: string;
  slug: string;
  description: string;
  mrp: number;
  sellingPrice: number;
  sku: string;
  stockQuantity: number;
  weight: number;
  lowStockThreshold: number;
  imageUrls: string[];
}

export async function insertSellerProduct(input: SellerProductInsert) {
  try {
    const supabase = createAdminClient()

    // 1. Resolve seller UUID from text seller_id
    const { data: sellerRow, error: sellerErr } = await supabase
      .from('sellers')
      .select('id')
      .eq('seller_id', input.sellerTextId)
      .maybeSingle()

    if (sellerErr || !sellerRow?.id) {
      return { error: `Seller not found: ${input.sellerTextId}` }
    }

    const sellerUuid = sellerRow.id

    // 2. Resolve shop_id for this seller
    const { data: shopRow } = await supabase
      .from('shops')
      .select('id')
      .eq('seller_id', sellerUuid)
      .maybeSingle()

    let shopId = shopRow?.id

    if (!shopId) {
      const { data: newShop, error: shopErr } = await supabase
        .from('shops')
        .insert([{
          seller_id: sellerUuid,
          shop_name: `Shop ${input.sellerTextId}`,
          shop_slug: `shop-${Date.now()}`
        }])
        .select('id')
        .single()

      if (shopErr || !newShop?.id) {
        return { error: `Could not create shop: ${shopErr?.message || 'Unknown error'}` }
      }
      shopId = newShop.id
    }

    // 3. Insert into public.products
    // Products start in 'draft' status - must be published by admin to be visible to customers
    const { data: product, error: prodErr } = await supabase
      .from('products')
      .insert([{
        seller_id: sellerUuid,
        shop_id: shopId,
        name: input.name,
        slug: input.slug,
        description: input.description,
        mrp: input.mrp,
        selling_price: input.sellingPrice,
        sku: input.sku,
        stock_quantity: input.stockQuantity,
        status: 'pending_review',
        weight: input.weight,
      }])
      .select()
      .single()

    if (prodErr) {
      return { error: `Product insert failed: ${prodErr.message}` }
    }

    // 4. Insert into public.inventory
    if (product) {
      await supabase.from('inventory').insert([{
        product_id: product.id,
        quantity_available: input.stockQuantity,
        low_stock_threshold: input.lowStockThreshold,
      }])

      // 5. Insert image CDN URLs into public.product_images
      if (input.imageUrls.length > 0) {
        const imgRecords = input.imageUrls.map((url, idx) => ({
          product_id: product.id,
          image_url: url,
          is_primary: idx === 0,
        }))
        await supabase.from('product_images').insert(imgRecords)
      }
    }

    // Revalidate seller product pages and admin approval pages
    revalidatePath('/seller-products')
    revalidatePath('/super-admin/products')
    // Also revalidate storefront in case seller publishes later
    revalidatePath('/products')
    revalidatePath('/')
    return { success: true, productId: product?.id }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unexpected server error'
    return { error: errorMessage }
  }
}
