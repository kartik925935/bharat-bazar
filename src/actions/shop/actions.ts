'use server'

import { createClient } from '@/lib/supabase/server'
import { requireRole } from '../auth/session'
import { shopSchema, ShopInput } from './validations'
import { revalidatePath } from 'next/cache'

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
