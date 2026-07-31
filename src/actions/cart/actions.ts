'use server'

import { createClient } from '@/lib/supabase/server'
import { requireRole } from '../auth/session'
import { cartItemSchema, CartItemInput } from './validations'
import { revalidatePath } from 'next/cache'

export async function addToCart(data: CartItemInput) {
  const { authorized, user } = await requireRole(['super admin', 'admin', 'user', 'seller'])
  if (!authorized || !user) return { error: 'Unauthorized' }

  const result = cartItemSchema.safeParse(data)
  if (!result.success) return { error: 'Invalid input', details: result.error.flatten().fieldErrors }

  const supabase = await createClient()

  // Typically cart is upserted by user_id and product_id
  const { data: cartItem, error } = await supabase
    .from('cart_items')
    .upsert({ 
      user_id: user.id,
      product_id: result.data.productId,
      quantity: result.data.quantity
    }, { onConflict: 'user_id, product_id' })
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/cart')
  return { success: true, data: cartItem }
}

export async function getCart() {
  const { authorized, user } = await requireRole(['super admin', 'admin', 'user', 'seller'])
  if (!authorized || !user) return { error: 'Unauthorized' }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('cart_items')
    .select('*, products(*)')
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  return { success: true, data }
}

export async function removeFromCart(productId: string) {
  const { authorized, user } = await requireRole(['super admin', 'admin', 'user', 'seller'])
  if (!authorized || !user) return { error: 'Unauthorized' }

  const supabase = await createClient()

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', user.id)
    .eq('product_id', productId)

  if (error) return { error: error.message }

  revalidatePath('/cart')
  return { success: true }
}
