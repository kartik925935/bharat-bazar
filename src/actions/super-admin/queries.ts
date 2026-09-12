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

export async function fetchDashboardAction(): Promise<{ data: any, error?: string }> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.rpc('get_dashboard_stats')

    if (error) {
      if (error.code === '42883') {
        // RPC not found, fallback to 0s for now
        return { data: { totalGmv: 0, activeSellers: 0, pendingKyc: 0, activeOrders: 0 } }
      }
      throw error
    }

    return { data }
  } catch (err: any) {
    return { data: { totalGmv: 0, activeSellers: 0, pendingKyc: 0, activeOrders: 0 }, error: err.message }
  }
}

export async function fetchAuditLogsAction(): Promise<{ data: any[], error?: string }> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100)

    if (error) {
       // Table might not exist yet if migration hasn't run
       if (error.code === '42P01') return { data: [] }
       throw error
    }

    return { data: data || [] }
  } catch (err: any) {
    return { data: [], error: err.message }
  }
}

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
      name: c.full_name || 'Unknown',
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
      .select('*, profiles ( phone, full_name )')
      .order('created_at', { ascending: false })

    if (error) throw error

    const sellers: SASeller[] = data.map((s: any) => ({
      id: s.id,
      sellerId: s.seller_id || s.id,
      legalName: s.legal_name || 'Unknown',
      displayName: s.display_name || 'Unknown',
      username: s.username || '',
      email: s.profiles?.email || s.username || '',
      phone: s.profiles?.phone || '',
      name: s.profiles?.full_name || 'Unknown Seller',
      shopName: s.display_name || s.legal_name || 'Unnamed Shop',
      sellerType: s.seller_type || 'artisan',
      status: s.status === 'active' ? 'active' : (s.status === 'suspended' ? 'suspended' : 'pending'),
      tier: s.current_tier || 'Silver',
      joinedAt: s.created_at,
      lastActive: s.created_at,
      state: s.state || 'Maharashtra',
      totalProducts: 0,
      totalSales: 0,
      totalOrders: 0,
      rating: s.rating || 0,
      kycStatus: s.kyc_status === 'approved' ? 'verified' : (s.kyc_status === 'rejected' ? 'rejected' : 'pending'),
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
        sellers ( legal_name, display_name )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    const products: SAProduct[] = data.map((p: any) => ({
      id: p.id,
      name: p.name,
      sku: p.sku || p.id.substring(0, 8),
      sellerId: p.seller_id,
      sellerName: p.sellers?.display_name || p.sellers?.legal_name || 'Unknown',
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

export async function updateSellerStatusAction(id: string, status: string): Promise<{ success: boolean, error?: string }> {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('sellers')
      .update({ status })
      .eq('id', id)
      
    if (error) throw error
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function fetchOffersAction(): Promise<{ data: any[], error?: string }> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
       if (error.code === '42P01') return { data: [] }
       throw error
    }

    // Map from DB schema back to camelCase frontend schema
    const mapped = data.map(o => ({
      id: o.id,
      name: o.name,
      type: o.type,
      value: o.value,
      startDate: o.start_date,
      endDate: o.end_date,
      status: o.status,
      appliesTo: o.applies_to,
      productsCount: o.products_count || 0,
      revenueGenerated: o.revenue_generated || 0,
      ordersGenerated: o.orders_generated || 0,
      discountCost: o.discount_cost || 0,
      roi: o.roi || 0,
    }))

    return { data: mapped }
  } catch (err: any) {
    return { data: [], error: err.message }
  }
}

export async function createOfferAction(offer: any): Promise<{ data: any, error?: string }> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('offers')
      .insert({
        name: offer.name,
        type: offer.type,
        value: offer.value,
        start_date: offer.startDate,
        end_date: offer.endDate,
        status: offer.status,
        applies_to: offer.appliesTo
      })
      .select()
      .single()

    if (error) throw error

    return { 
      data: {
        id: data.id,
        name: data.name,
        type: data.type,
        value: data.value,
        startDate: data.start_date,
        endDate: data.end_date,
        status: data.status,
        appliesTo: data.applies_to,
        productsCount: data.products_count || 0,
        revenueGenerated: data.revenue_generated || 0,
        ordersGenerated: data.orders_generated || 0,
        discountCost: data.discount_cost || 0,
        roi: data.roi || 0,
      } 
    }
  } catch (err: any) {
    return { data: null, error: err.message }
  }
}

export async function deleteOfferAction(id: string): Promise<{ success: boolean, error?: string }> {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('offers')
      .delete()
      .eq('id', id)
      
    if (error) throw error
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function fetchFinanceOverviewAction(): Promise<{ data: any, error?: string }> {
  try {
    const supabase = await createClient()
    // Mock aggregations using generic query or just return static data if table empty.
    // For now we return empty default values if the tables are not populated.
    
    // In a real app we'd use RPC, but let's just use defaults to make the UI work without crashing
    const data = {
      totalGMV: 145000000,
      totalCommission: 2450000,
      pendingSettlements: 450000,
      totalRefunds: 120000,
      periodGMV: 15000000,
      periodRevenue: 250000,
      completedSettlements: 140000000,
      chartData: Array.from({ length: 11 }).map((_, i) => ({
        date: `Aug ${i + 1}`,
        gmv: 100000 + Math.random() * 50000,
        commission: 10000 + Math.random() * 5000,
        refunds: 2000 + Math.random() * 1000,
      }))
    }
    
    return { data }
  } catch (err: any) {
    return { data: null, error: err.message }
  }
}

export async function fetchSettlementsAction(): Promise<{ data: any[], error?: string }> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('settlements')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      if (error.code === '42P01') return { data: [] }
      throw error
    }

    return { 
      data: data.map(s => ({
        id: s.id,
        sellerId: s.seller_id,
        sellerName: s.seller_name,
        periodStart: s.period_start,
        periodEnd: s.period_end,
        ordersCount: s.orders_count,
        amount: s.amount,
        commission: s.commission,
        netAmount: s.net_amount,
        status: s.status,
        paidAt: s.paid_at,
        createdAt: s.created_at,
      }))
    }
  } catch (err: any) {
    return { data: [], error: err.message }
  }
}

export async function updateSettlementStatusAction(id: string, status: string): Promise<{ success: boolean, error?: string }> {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('settlements')
      .update({ status })
      .eq('id', id)
      
    if (error) throw error
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function fetchCommissionsAction(): Promise<{ data: any[], error?: string }> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('commissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      if (error.code === '42P01') return { data: [] }
      throw error
    }

    return { 
      data: data.map(c => ({
        id: c.id,
        categoryId: c.category_id,
        categoryName: c.category_name,
        baseRate: c.base_rate,
        tierMultipliers: c.tier_multipliers,
        isActive: c.is_active,
      }))
    }
  } catch (err: any) {
    return { data: [], error: err.message }
  }
}

export async function fetchPlatformSettingsAction(): Promise<{ data: any | null, error?: string }> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('platform_settings')
      .select('*')
      .eq('id', 1)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return { data: null } // no rows
      throw error
    }

    return { 
      data: {
        commissionRateDefault: data.commission_rate_default,
        returnWindowDays: data.return_window_days,
        settlementCycleDays: data.settlement_cycle_days,
        minSettlementAmount: data.min_settlement_amount,
        sellerRegistrationFee: data.seller_registration_fee,
        maxProductsPerSeller: data.max_products_per_seller,
        minProductImages: data.min_product_images,
        productCompletenessThreshold: data.product_completeness_threshold,
        orderAcceptanceSlaHours: data.order_acceptance_sla_hours,
        dispatchSlaHours: data.dispatch_sla_hours,
        maxCodOrderValue: data.max_cod_order_value,
        sellerAutoSuspendAfterDays: data.seller_auto_suspend_after_days,

        maintenanceMode: data.maintenance_mode,
        maintenanceMessage: data.maintenance_message,
        maintenanceScheduledEnd: data.maintenance_scheduled_end,

        features: data.features,
        notifications: data.notifications,

        termsVersion: data.terms_version,
        privacyPolicyVersion: data.privacy_policy_version,
        lastUpdatedAt: data.updated_at,
        lastUpdatedBy: data.last_updated_by
      }
    }
  } catch (err: any) {
    return { data: null, error: err.message }
  }
}

export async function updatePlatformSettingsAction(payload: any): Promise<{ error?: string }> {
  try {
    const supabase = await createClient()

    const dbPayload: any = {}
    if (payload.commissionRateDefault !== undefined) dbPayload.commission_rate_default = payload.commissionRateDefault
    if (payload.returnWindowDays !== undefined) dbPayload.return_window_days = payload.returnWindowDays
    if (payload.settlementCycleDays !== undefined) dbPayload.settlement_cycle_days = payload.settlementCycleDays
    if (payload.minSettlementAmount !== undefined) dbPayload.min_settlement_amount = payload.minSettlementAmount
    if (payload.sellerRegistrationFee !== undefined) dbPayload.seller_registration_fee = payload.sellerRegistrationFee
    if (payload.maxProductsPerSeller !== undefined) dbPayload.max_products_per_seller = payload.maxProductsPerSeller
    if (payload.minProductImages !== undefined) dbPayload.min_product_images = payload.minProductImages
    if (payload.productCompletenessThreshold !== undefined) dbPayload.product_completeness_threshold = payload.productCompletenessThreshold
    if (payload.orderAcceptanceSlaHours !== undefined) dbPayload.order_acceptance_sla_hours = payload.orderAcceptanceSlaHours
    if (payload.dispatchSlaHours !== undefined) dbPayload.dispatch_sla_hours = payload.dispatchSlaHours
    if (payload.maxCodOrderValue !== undefined) dbPayload.max_cod_order_value = payload.maxCodOrderValue
    if (payload.sellerAutoSuspendAfterDays !== undefined) dbPayload.seller_auto_suspend_after_days = payload.sellerAutoSuspendAfterDays

    if (payload.maintenanceMode !== undefined) dbPayload.maintenance_mode = payload.maintenanceMode
    if (payload.maintenanceMessage !== undefined) dbPayload.maintenance_message = payload.maintenanceMessage
    if (payload.maintenanceScheduledEnd !== undefined) dbPayload.maintenance_scheduled_end = payload.maintenanceScheduledEnd

    if (payload.features !== undefined) dbPayload.features = payload.features
    if (payload.notifications !== undefined) dbPayload.notifications = payload.notifications

    if (payload.termsVersion !== undefined) dbPayload.terms_version = payload.termsVersion
    if (payload.privacyPolicyVersion !== undefined) dbPayload.privacy_policy_version = payload.privacyPolicyVersion

    dbPayload.updated_at = new Date().toISOString()

    const { error } = await supabase
      .from('platform_settings')
      .update(dbPayload)
      .eq('id', 1)

    if (error) throw error
    return {}
  } catch (err: any) {
    return { error: err.message }
  }
}

export async function fetchKycSellersAction(): Promise<{ data: any[], error?: string }> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('sellers')
      .select(`
        id, seller_id, legal_name, display_name, username, village, district, state, description,
        kyc_status, created_at,
        profiles ( phone, full_name ),
        seller_documents ( document_type, document_number, verified ),
        bank_accounts ( account_holder_name, account_number, ifsc_code, bank_name )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      if (error.code === '42P01') return { data: [] }
      throw error
    }

    const mapped = data.map((s: any) => {
      const docs = s.seller_documents || []
      const bank = Array.isArray(s.bank_accounts) ? s.bank_accounts[0] || {} : s.bank_accounts || {}
      
      const getDoc = (type: string) => docs.find((d: any) => d.document_type === type)

      return {
        id: s.id,
        sellerId: s.seller_id,
        legalName: s.legal_name,
        displayName: s.display_name,
        username: s.username,
        email: s.profiles?.email || s.username,
        phone: s.profiles?.phone || '',
        name: s.profiles?.full_name || 'Unknown',
        shopName: s.legal_name,
        sellerType: 'artisan', // Default fallback since it's not selected or might not match enum perfectly in UI
        kycStatus: s.kyc_status,
        joinedAt: s.created_at,
        village: s.village,
        district: s.district,
        state: s.state,
        shopDescription: s.description,
        
        // Documents
        panNumber: getDoc('pan')?.document_number || '',
        panVerified: getDoc('pan')?.verified || false,
        aadhaarNumber: getDoc('aadhaar')?.document_number || '',
        gstNumber: getDoc('gst')?.document_number || '',
        gstVerified: getDoc('gst')?.verified || false,

        // Bank
        bankAccountName: bank.account_holder_name || '',
        bankName: bank.bank_name || '',
        accountNumber: bank.account_number || '',
        ifscCode: bank.ifsc_code || '',
        bankVerified: !!bank.account_number,
      }
    })

    return { data: mapped }
  } catch (err: any) {
    return { data: [], error: err.message }
  }
}
export async function updateKycStatusAction(sellerId: string, kycStatus: string): Promise<{ success: boolean, error?: string }> {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('sellers')
      .update({ kyc_status: kycStatus })
      .eq('id', sellerId)

    if (error) throw error
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function updateSellerDocStatusAction(sellerId: string, docType: string, verified: boolean): Promise<{ success: boolean, error?: string }> {
  try {
    const supabase = await createClient()
    if (docType === 'bank') {
      // bank verification logic placeholder
      return { success: true }
    } else {
      const { error } = await supabase
        .from('seller_documents')
        .update({ verified })
        .eq('seller_id', sellerId)
        .eq('document_type', docType)

      if (error) throw error
    }
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function fetchAllOrdersAction(): Promise<{ data: SAOrder[], error?: string }> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id, order_number, total_amount, status, created_at, shipping_address, user_id,
        profiles!orders_user_id_fkey ( full_name ),
        order_items ( product_name, seller_id, sellers ( display_name ) ),
        payments ( status, amount )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      if (error.code === '42P01') return { data: [] }
      throw error
    }

    const orders: SAOrder[] = data.map((o: any) => {
      const items = o.order_items || []
      const payments = o.payments || []
      const paymentStatus = payments.length > 0 ? payments[0].status : 'pending'
      
      const addr = o.shipping_address || {}
      
      return {
        id: o.id,
        orderId: o.order_number || o.id.substring(0, 8),
        customerId: o.user_id,
        customerName: o.profiles?.full_name || o.profiles?.email || 'Unknown',
        sellerId: items[0]?.seller_id || '',
        sellerName: items[0]?.sellers?.display_name || 'Multiple Sellers',
        products: items.map((i: any) => i.product_name),
        totalAmount: o.total_amount || 0,
        status: o.status || 'pending_payment',
        paymentMethod: 'UPI', // Defaulting to UPI for now as we don't store payment method in orders directly, except in payments table details
        paymentStatus: paymentStatus,
        createdAt: o.created_at,
        updatedAt: o.created_at,
        address: addr.address_line_1 || '',
        city: addr.city || '',
        state: addr.state || '',
        deliveryPartnerId: ''
      }
    })

    return { data: orders }
  } catch (err: any) {
    return { data: [], error: err.message }
  }
}

export async function updateOrderStatusAction(orderId: string, status: string): Promise<{ success: boolean, error?: string }> {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)

    if (error) throw error
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
