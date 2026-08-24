'use server'

import { createClient } from '@/lib/supabase/server'
import type { 
  SAAdmin, 
  SACustomer, 
  SASeller, 
  SAProduct, 
  SAOrder, 
  SADeliveryPartner 
} from '@/types/super-admin.types'
import { MOCK_ADMINS } from '@/lib/mock/sa-admins.mock'

/**
 * Super Admin Server Actions
 * These queries fetch data for the Super Admin dashboard using the authenticated client.
 * Currently falls back to generic mappings if full data isn't in DB yet.
 */

export async function fetchAdminsAction(): Promise<{ data: SAAdmin[], error?: string }> {
  try {
    // Returns the full mock admin list — replace with Supabase query when ready
    return { data: MOCK_ADMINS }
  } catch (err: unknown) {
    return { data: [], error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export async function fetchCustomersAction(): Promise<{ data: SACustomer[], error?: string }> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    const customers: SACustomer[] = data.map((c: any) => ({
      id: c.id,
      name: `${c.first_name || ''} ${c.last_name || ''}`.trim() || 'Unknown',
      email: c.email || '',
      phone: c.phone || '',
      status: 'active',
      tier: 'bronze',
      totalOrders: 0,
      totalSpent: 0,
      joinedAt: c.created_at,
      lastActive: c.created_at,
      isVerified: true
    }))

    return { data: customers }
  } catch (err: any) {
    return { data: [], error: err.message }
  }
}

export async function fetchSellersAction(): Promise<{ data: SASeller[], error?: string }> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('sellers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    const sellers: SASeller[] = data.map((s: any) => ({
      id: s.id,
      sellerId: s.id,
      legalName: s.business_name || 'Unknown',
      displayName: s.business_name || 'Unknown',
      username: s.email || '',
      email: s.email || '',
      phone: s.phone || '',
      name: `${s.first_name || ''} ${s.last_name || ''}`.trim() || 'Unknown Seller',
      shopName: s.business_name || 'Unnamed Shop',
      sellerType: 'artisan',
      status: s.status === 'active' ? 'active' : (s.status === 'suspended' ? 'suspended' : 'pending'),
      tier: s.tier || 'Silver',
      joinedAt: s.created_at,
      lastActive: s.created_at,
      state: 'Maharashtra',
      totalProducts: 0,
      totalSales: 0,
      totalOrders: 0,
      rating: s.rating || 0,
      kycStatus: s.kyc_status === 'verified' ? 'verified' : (s.kyc_status === 'rejected' ? 'rejected' : 'pending'),
      panVerified: false,
      gstVerified: false,
      bankVerified: false,
      commissionRate: 5,
    }))

    return { data: sellers }
  } catch (err: any) {
    return { data: [], error: err.message }
  }
}

export async function fetchProductsAction(): Promise<{ data: SAProduct[], error?: string }> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        sellers ( business_name, first_name, last_name )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    const products: SAProduct[] = data.map((p: any) => ({
      id: p.id,
      name: p.name,
      sku: p.sku || p.id.substring(0, 8),
      sellerId: p.seller_id,
      sellerName: p.sellers?.business_name || `${p.sellers?.first_name || ''} ${p.sellers?.last_name || ''}`.trim() || 'Unknown',
      category: p.category_id || 'Uncategorized',
      price: p.selling_price || 0,
      mrp: p.selling_price || 0,
      stock: 0,
      images: [],
      status: p.status === 'published' ? 'published' : (p.status === 'draft' ? 'draft' : 'pending_review'),
      rating: 0,
      totalReviews: 0,
      totalSales: 0,
      createdAt: p.created_at,
      updatedAt: p.created_at
    }))

    return { data: products }
  } catch (err: any) {
    return { data: [], error: err.message }
  }
}

export async function fetchOrdersAction(): Promise<{ data: SAOrder[], error?: string }> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      // If table doesn't exist yet, return empty
      if (error.code === '42P01') return { data: [] }
      throw error
    }

    const orders: SAOrder[] = data.map((o: any) => ({
      id: o.id,
      orderId: o.order_number || o.id.substring(0, 8),
      customerId: o.customer_id,
      customerName: 'Unknown', // Need join to profiles
      sellerId: '',
      sellerName: '',
      products: [],
      totalAmount: o.total_amount || 0,
      status: o.status || 'pending_payment',
      paymentMethod: 'upi',
      paymentStatus: o.payment_status || 'pending',
      createdAt: o.created_at,
      updatedAt: o.created_at,
      address: '',
      city: '',
      state: '',
      deliveryPartnerId: o.delivery_partner_id
    }))

    return { data: orders }
  } catch (err: any) {
    return { data: [], error: err.message }
  }
}

export async function fetchDeliveryPartnersAction(): Promise<{ data: SADeliveryPartner[], error?: string }> {
  // Mock fallback until delivery table is ready
  return { data: [] }
}
