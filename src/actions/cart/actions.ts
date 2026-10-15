'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireRole } from '../auth/session'
import { cartItemSchema, CartItemInput } from './validations'
import { revalidatePath } from 'next/cache'

async function getOrCreateCart(adminSupabase: any, userId: string) {
  let { data: cart } = await adminSupabase
    .from('carts')
    .select('id, applied_coupon_id')
    .eq('user_id', userId)
    .maybeSingle()

  if (!cart) {
    const { data: newCart, error: createError } = await adminSupabase
      .from('carts')
      .insert({ user_id: userId })
      .select('id, applied_coupon_id')
      .single()

    if (createError) throw new Error(createError.message)
    cart = newCart
  }

  return cart
}

export async function addToCart(data: CartItemInput) {
  const { authorized, user } = await requireRole(['super admin', 'admin', 'user', 'seller'])
  if (!authorized || !user) return { error: 'Unauthorized' }

  const result = cartItemSchema.safeParse(data)
  if (!result.success) return { error: 'Invalid input', details: result.error.flatten().fieldErrors }

  const adminSupabase = createAdminClient()

  try {
    const cart = await getOrCreateCart(adminSupabase, user.id)

    // Check if item already exists in this cart
    const { data: existingItem } = await adminSupabase
      .from('cart_items')
      .select('id, quantity')
      .eq('cart_id', cart.id)
      .eq('product_id', result.data.productId)
      .maybeSingle()

    let cartItem
    if (existingItem) {
      const newQuantity = existingItem.quantity + result.data.quantity
      const { data: updated, error: updateError } = await adminSupabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', existingItem.id)
        .select()
        .single()

      if (updateError) return { error: updateError.message }
      cartItem = updated
    } else {
      const { data: inserted, error: insertError } = await adminSupabase
        .from('cart_items')
        .insert({
          cart_id: cart.id,
          product_id: result.data.productId,
          quantity: result.data.quantity
        })
        .select()
        .single()

      if (insertError) return { error: insertError.message }
      cartItem = inserted
    }

    revalidatePath('/cart')
    return { success: true, data: cartItem }
  } catch (err: any) {
    return { error: err.message || 'Failed to add item to cart' }
  }
}

export async function getCart() {
  const { authorized, user } = await requireRole(['super admin', 'admin', 'user', 'seller'])
  if (!authorized || !user) return { error: 'Unauthorized' }

  const adminSupabase = createAdminClient()

  const { data: cart } = await adminSupabase
    .from('carts')
    .select('id, applied_coupon_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!cart) {
    return { success: true, data: [] }
  }

  const { data: items, error } = await adminSupabase
    .from('cart_items')
    .select('*, products(*)')
    .eq('cart_id', cart.id)
    .eq('saved_for_later', false)

  if (error) return { error: error.message }

  return { success: true, data: items || [] }
}

export async function removeFromCart(productId: string) {
  const { authorized, user } = await requireRole(['super admin', 'admin', 'user', 'seller'])
  if (!authorized || !user) return { error: 'Unauthorized' }

  const adminSupabase = createAdminClient()

  const { data: cart } = await adminSupabase
    .from('carts')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!cart) return { success: true }

  const { error } = await adminSupabase
    .from('cart_items')
    .delete()
    .eq('cart_id', cart.id)
    .eq('product_id', productId)

  if (error) return { error: error.message }

  revalidatePath('/cart')
  return { success: true }
}

/**
 * Synchronizes client-side cart items into the user's database cart before order placement.
 */
export async function syncCartItems(items: Array<{ productId: string; quantity: number }>) {
  const { authorized, user } = await requireRole(['super admin', 'admin', 'user', 'seller'])
  if (!authorized || !user) return { error: 'Unauthorized' }

  if (!items || items.length === 0) {
    return { success: true }
  }

  const adminSupabase = createAdminClient()

  try {
    const cart = await getOrCreateCart(adminSupabase, user.id)

    // Clear existing cart items to reflect checkout state exactly
    await adminSupabase.from('cart_items').delete().eq('cart_id', cart.id)

    // Batch insert items
    const rows = items.map(item => ({
      cart_id: cart.id,
      product_id: item.productId,
      quantity: Math.max(1, item.quantity),
      saved_for_later: false
    }))

    const { error: insertError } = await adminSupabase
      .from('cart_items')
      .insert(rows)

    if (insertError) return { error: insertError.message }

    revalidatePath('/cart')
    return { success: true, cartId: cart.id }
  } catch (err: any) {
    return { error: err.message || 'Failed to sync cart items' }
  }
}
