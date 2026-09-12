'use server'

import { createClient } from '@/lib/supabase/server'
import type { SACustomerExtended, CustomerTier } from '@/types/super-admin.types'

export async function fetchCustomersAction() {
  try {
    const supabase = await createClient()

    // We join profiles with user_roles to get only customers
    const { data: customersData, error: customersError } = await supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        avatar_url,
        phone,
        is_blocked,
        created_at,
        user_roles!inner(
          roles!inner(name)
        )
      `)
      .eq('user_roles.roles.name', 'customer')

    if (customersError) throw customersError

    // Also fetch orders for calculation
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('user_id, total_amount')

    if (ordersError) throw ordersError

    // Mocking risk score for now, but dynamically calculating tiers
    const formattedCustomers: SACustomerExtended[] = customersData.map((c: any) => {
      const custOrders = ordersData.filter((o: any) => o.user_id === c.id)
      const totalOrders = custOrders.length
      const totalSpent = custOrders.reduce((sum:any, o:any) => sum + Number(o.total_amount), 0)

      let tier: CustomerTier = 'bronze'
      if (totalSpent > 10000) tier = 'platinum'
      else if (totalSpent > 5000) tier = 'gold'
      else if (totalSpent > 1000) tier = 'silver'

      return {
        id: c.id,
        name: c.full_name || 'Unknown',
        email: 'customer@example.com', // Fetching email requires admin auth, mocking for demo
        phone: c.phone || undefined,
        avatar: c.avatar_url || undefined,
        status: c.is_blocked ? 'blocked' : 'active',
        tier,
        isVerified: true,
        joinedAt: c.created_at,
        totalOrders,
        totalSpent,
        riskScore: Math.floor(Math.random() * 100),
        returnRate: 0,
        fraudFlags: [],
        avgOrderValue: totalOrders > 0 ? totalSpent / totalOrders : 0,
        loginHistory: [],
        deviceIds: [],
        ipAddresses: [],
        paymentMethods: [],
        wishlistCount: 0,
        cartAbandonCount: 0,
        lastActive: new Date().toISOString()
      }
    })

    return { data: formattedCustomers, error: null }
  } catch (error: any) {
    return { data: null, error: error.message }
  }
}

export async function updateCustomerStatusAction(id: string, isBlocked: boolean) {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('profiles')
      .update({ is_blocked: isBlocked })
      .eq('id', id)

    if (error) throw error
    return { success: true, error: null }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
