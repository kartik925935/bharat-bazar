'use server'

import { createClient } from '@/lib/supabase/server'
import { requireRole } from '../auth/session'
import { shopSchema, ShopInput, updateShopSchema, UpdateShopInput } from './validations'
import { revalidatePath } from 'next/cache'

export async function updateShopDetails(sellerId: string, data: UpdateShopInput) {
  const { authorized, user } = await requireRole(['super admin', 'admin', 'seller'])
  if (!authorized || !user) return { error: 'Unauthorized' }

  // A seller can only update their own shop
  if (user.role === 'seller') {
    // Assuming user metadata or seller record matches sellerId, but for now we enforce via RLS
  }

  const result = updateShopSchema.safeParse(data)
  if (!result.success) return { error: 'Invalid input', details: result.error.flatten().fieldErrors }

  const supabase = await createClient()

  // First, check if the shop exists
  const { data: existingShop } = await supabase
    .from('shops')
    .select('id')
    .eq('seller_id', sellerId)
    .maybeSingle()

  let shop;
  let error;

  if (existingShop) {
    // Update existing
    const res = await supabase
      .from('shops')
      .update({ 
        shop_name: result.data.shopName,
        shop_story: result.data.shopStory || null,
        updated_at: new Date().toISOString()
      })
      .eq('seller_id', sellerId)
      .select()
      .single()
    shop = res.data;
    error = res.error;
  } else {
    // Insert new
    const shopSlug = `shop-${sellerId.slice(0, 8)}-${Math.floor(Math.random() * 1000)}`;
    const res = await supabase
      .from('shops')
      .insert({
        seller_id: sellerId,
        shop_name: result.data.shopName,
        shop_story: result.data.shopStory || null,
        shop_slug: shopSlug,
      })
      .select()
      .single()
    shop = res.data;
    error = res.error;
  }

  if (error) return { error: error.message }

  revalidatePath('/seller-settings')
  revalidatePath('/seller-shop')
  return { success: true, data: shop }
}

export async function createShop(data: ShopInput) {
  const { authorized, user } = await requireRole(['super admin', 'admin', 'seller'])
  if (!authorized || !user) return { error: 'Unauthorized' }

  const result = shopSchema.safeParse(data)
  if (!result.success) return { error: 'Invalid input', details: result.error.flatten().fieldErrors }

  const supabase = await createClient()

  // Ensure the seller owns this shop (or handle it in RLS)
  const { data: shop, error } = await supabase
    .from('shops')
    .insert([{ 
      name: result.data.name,
      description: result.data.description,
      logo_url: result.data.logoUrl,
      banner_url: result.data.bannerUrl,
      seller_id: result.data.sellerId 
    }])
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/shop')
  return { success: true, data: shop }
}

export async function getShopBySellerId(sellerId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('seller_id', sellerId)
    .single()

  if (error) return { error: error.message }

  return { success: true, data }
}
