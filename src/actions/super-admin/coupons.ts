'use server'

import { createClient } from '@/lib/supabase/server'
import type { SACoupon } from '@/types/super-admin.types'
import { isFuture, isPast } from 'date-fns'

export async function fetchCouponsAction(): Promise<{ data: SACoupon[], error?: string }> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      if (error.code === '42P01') return { data: [] }
      throw error
    }

    const coupons: SACoupon[] = data.map((c: any) => {
      let status = 'active'
      if (!c.is_active) {
        status = 'inactive'
      } else if (isPast(new Date(c.valid_until))) {
        status = 'expired'
      } else if (c.valid_from && isFuture(new Date(c.valid_from))) {
        status = 'scheduled'
      }

      return {
        id: c.id,
        code: c.code,
        type: c.discount_type,
        value: c.discount_value,
        minOrder: c.min_order_value || 0,
        maxDiscount: undefined, // Add if added to schema
        usageLimit: c.usage_limit || 1000,
        usageCount: 0, // In real app, calculate from coupon_usages
        userLimit: 1, // Default
        status,
        startDate: c.valid_from || c.created_at,
        endDate: c.valid_until,
        createdBy: 'Admin',
        createdAt: c.created_at,
        appliesTo: c.coupon_type === 'seller' ? 'seller' : 'all',
      }
    })

    // Optionally calculate usage count from coupon_usages
    const { data: usages } = await supabase
      .from('coupon_usages')
      .select('coupon_id')

    if (usages) {
      const usageMap = usages.reduce((acc: Record<string, number>, u: any) => {
        acc[u.coupon_id] = (acc[u.coupon_id] || 0) + 1
        return acc
      }, {})
      
      for (const coupon of coupons) {
        coupon.usageCount = usageMap[coupon.id] || 0
      }
    }

    return { data: coupons }
  } catch (err: any) {
    return { data: [], error: err.message }
  }
}

export async function createCouponAction(payload: any): Promise<{ success: boolean, error?: string }> {
  try {
    const supabase = await createClient()
    
    // Determine coupon type based on appliesTo
    const coupon_type = payload.appliesTo === 'seller' ? 'seller' : 'admin'

    const { error } = await supabase
      .from('coupons')
      .insert({
        code: payload.code,
        coupon_type: coupon_type,
        discount_type: payload.type,
        discount_value: payload.value,
        min_order_value: payload.minOrder,
        usage_limit: payload.usageLimit,
        is_active: payload.status !== 'inactive',
        valid_from: payload.startDate,
        valid_until: payload.endDate,
      })
      
    if (error) throw error
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function deleteCouponAction(id: string): Promise<{ success: boolean, error?: string }> {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('id', id)
      
    if (error) throw error
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
