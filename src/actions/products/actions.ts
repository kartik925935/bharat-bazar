'use server'

import { createClient } from '@/lib/supabase/server'
import { requireRole } from '../auth/session'
import { productSchema, ProductInput } from './validations'
import { revalidatePath } from 'next/cache'

export async function createProduct(data: ProductInput) {
  const { authorized, user } = await requireRole(['super admin', 'admin', 'seller'])
  if (!authorized || !user) return { error: 'Unauthorized' }

  const result = productSchema.safeParse(data)
  if (!result.success) return { error: 'Invalid input', details: result.error.flatten().fieldErrors }

  const supabase = await createClient()

  const { data: product, error } = await supabase
    .from('products')
    .insert([{ 
      shop_id: result.data.shopId,
      name: result.data.name,
      description: result.data.description,
      price: result.data.price,
      category: result.data.category,
      images: result.data.images || []
    }])
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/products')
  return { success: true, data: product }
}

export async function getProducts(shopId?: string) {
  const supabase = await createClient()

  let query = supabase.from('products').select('*')
  if (shopId) {
    query = query.eq('shop_id', shopId)
  }

  const { data, error } = await query

  if (error) return { error: error.message }

  return { success: true, data }
}
