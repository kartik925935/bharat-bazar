'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireRole } from '../auth/session'
import { revalidatePath } from 'next/cache'

export async function applyCoupon(code: string) {
  const { authorized, user } = await requireRole(['super admin', 'admin', 'user', 'seller'])
  if (!authorized || !user) return { error: 'Unauthorized' }

  if (!code || code.trim() === '') return { error: 'Coupon code is required' }

  const adminSupabase = createAdminClient()

  // 1. Get the cart
  const { data: cart, error: cartError } = await adminSupabase
    .from('carts')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (cartError || !cart) return { error: 'Cart not found' }

  // 2. Get the coupon (case-insensitive CP-001)
  const { data: coupon, error: couponError } = await adminSupabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .gte('valid_until', new Date().toISOString())
    .single()

  if (couponError || !coupon) return { error: 'Invalid or expired coupon' }

  // 3. Get cart items to calculate eligible subtotal
  const { data: cartItems, error: itemsError } = await adminSupabase
    .from('cart_items')
    .select('quantity, product_id, products(selling_price, seller_id)')
    .eq('cart_id', cart.id)

  if (itemsError || !cartItems || cartItems.length === 0) return { error: 'Cart is empty' }

  // 4. Calculate eligible subtotal
  let eligibleSubtotal = 0
  for (const item of cartItems) {
    const p = item.products as any
    if (coupon.coupon_type === 'admin') {
      eligibleSubtotal += (item.quantity * p.selling_price)
    } else if (coupon.coupon_type === 'seller' && coupon.seller_id === p.seller_id) {
      eligibleSubtotal += (item.quantity * p.selling_price)
    }
  }

  if (eligibleSubtotal < coupon.min_order_value) {
    return { error: `This coupon requires a minimum eligible order value of ₹${coupon.min_order_value}` }
  }

  // 5. Apply the coupon to the cart
  const { error: updateError } = await adminSupabase
    .from('carts')
    .update({ applied_coupon_id: coupon.id })
    .eq('id', cart.id)

  if (updateError) return { error: 'Failed to apply coupon' }

  revalidatePath('/cart')
  revalidatePath('/checkout')
  return { success: true }
}

export async function removeCoupon() {
  const { authorized, user } = await requireRole(['super admin', 'admin', 'user', 'seller'])
  if (!authorized || !user) return { error: 'Unauthorized' }

  const adminSupabase = createAdminClient()

  const { error } = await adminSupabase
    .from('carts')
    .update({ applied_coupon_id: null })
    .eq('user_id', user.id)

  if (error) return { error: 'Failed to remove coupon' }

  revalidatePath('/cart')
  revalidatePath('/checkout')
  return { success: true }
}
