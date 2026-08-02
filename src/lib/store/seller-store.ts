'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@supabase/supabase-js';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface SellerProfile {
  id: string;
  sellerId: string;
  legalName: string;
  displayName: string;
  email: string;
  phone: string;
  avatar: string | null;
  sellerType: 'artisan' | 'ngo' | 'shg' | 'village_producer' | 'shop_owner' | 'family_craft' | 'professional';
  shopName: string;
  shopDescription: string;
  shopLogo: string | null;
  shopBanner: string | null;
  shopCategory: string;
  subCategories: string[];
  village: string;
  district: string;
  state: string;
  pincode: string;
  fullAddress: string;
  panNumber: string;
  aadhaarNumber: string;
  gstNumber: string | null;
  bankAccountName: string;
  bankName: string;
  bankAccountNumber: string;
  ifscCode: string;
  accountType: 'savings' | 'current';
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'suspended' | 'changes_required';
  kycStatus: 'pending' | 'verified' | 'failed' | 'changes_required';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  tierScore: number;
  rating: number;
  totalReviews: number;
  totalSales: number;
  totalOrders: number;
  totalRevenue: number;
  returnRate: number;
  cancellationRate: number;
  onTimeDispatchRate: number;
  responseRate: number;
  vacationMode: boolean;
  vacationMessage: string | null;
  shippingAreas: string[];
  processingDays: number;
  joinedAt: string;
  approvedAt: string | null;
  lastActiveAt: string;
  profileCompleteness: number;
  password: string;
}

export interface SellerProduct {
  id: string;
  sellerId: string;
  name: string;
  slug: string;
  description: string;
  story: string | null;
  categoryId: string;
  subcategoryId: string | null;
  tags: string[];
  mrp: number;
  sellingPrice: number;
  discount: number;
  stock: number;
  sku: string;
  lowStockThreshold: number;
  weight: number;
  images: { id: string; url: string; isPrimary: boolean; altText: string }[];
  specifications: { key: string; value: string }[];
  hasVariants: boolean;
  variants: { id: string; name: string; price: number; stock: number; sku: string }[];
  freeShipping: boolean;
  shippingCharge: number;
  handmade: boolean;
  giTagged: boolean;
  status: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'archived' | 'out_of_stock';
  rejectionReason: string | null;
  featuredByAdmin: boolean;
  views: number;
  wishlistCount: number;
  cartAddCount: number;
  totalSold: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface SellerOrder {
  id: string;
  orderNumber: string;
  sellerId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: {
    id: string;
    productId: string;
    productName: string;
    productImage: string;
    variantName: string | null;
    quantity: number;
    price: number;
    total: number;
  }[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  deliveryAddress: {
    name: string;
    phone: string;
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    pincode: string;
  };
  deliveryType: 'standard' | 'express' | 'next_day';
  expectedDelivery: string;
  actualDelivery: string | null;
  status: 'pending_payment' | 'paid' | 'confirmed' | 'processing' | 'ready_for_pickup' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'return_requested' | 'returned';
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  trackingId: string | null;
  statusHistory: { status: string; timestamp: string; note: string | null; updatedBy: string }[];
  customerNote: string | null;
  sellerNote: string | null;
  placedAt: string;
  updatedAt: string;
}

export interface SellerReview {
  id: string;
  productId: string;
  productName: string;
  orderId: string;
  customerId: string;
  customerName: string;
  customerAvatar: string | null;
  rating: number;
  title: string;
  body: string;
  images: string[];
  qualityRating: number;
  packagingRating: number;
  valueRating: number;
  sellerResponse: string | null;
  sellerResponseAt: string | null;
  status: 'pending' | 'approved' | 'rejected';
  helpful: number;
  createdAt: string;
}

export interface SellerReturn {
  id: string;
  returnNumber: string;
  orderId: string;
  sellerId: string;
  customerId: string;
  customerName: string;
  items: { productName: string; quantity: number; price: number }[];
  reason: string;
  reasonCategory: string;
  description: string;
  images: string[];
  status: 'requested' | 'under_review' | 'approved' | 'rejected' | 'pickup_scheduled' | 'picked_up' | 'received' | 'refunded';
  refundAmount: number;
  requestedAt: string;
  resolvedAt: string | null;
}

export interface SellerCoupon {
  id: string;
  sellerId: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  maxDiscountAmount: number | null;
  minOrderAmount: number;
  maxUsage: number;
  usageCount: number;
  userLimit: number;
  startDate: string;
  endDate: string;
  applicableProducts: string[];
  status: 'active' | 'inactive' | 'expired' | 'scheduled';
  createdAt: string;
}

export interface SellerEarning {
  id: string;
  sellerId: string;
  orderId: string;
  orderNumber: string;
  productName: string;
  orderAmount: number;
  commission: number;
  commissionRate: number;
  deliveryCharge: number;
  netEarning: number;
  status: 'pending' | 'eligible' | 'processing' | 'paid';
  settlementId: string | null;
  eligibleAt: string;
  paidAt: string | null;
  createdAt: string;
}

export interface SellerSettlement {
  id: string;
  sellerId: string;
  settlementNumber: string;
  amount: number;
  ordersCount: number;
  commissionDeducted: number;
  periodFrom: string;
  periodTo: string;
  status: 'processing' | 'paid' | 'failed' | 'on_hold';
  bankAccount: string;
  utrNumber: string | null;
  paidAt: string | null;
  createdAt: string;
}

export interface SellerNotif {
  id: string;
  sellerId: string;
  type: 'new_order' | 'order_cancelled' | 'review_received' | 'return_requested' | 'settlement_processed' | 'product_approved' | 'product_rejected' | 'kyc_update' | 'low_stock' | 'tier_change' | 'system';
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: string;
}

export interface RevenuePoint { date: string; revenue: number; orders: number; units: number; }



// ─── Store ─────────────────────────────────────────────────────────────────

interface SellerState {
  seller: SellerProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  products: SellerProduct[];
  orders: SellerOrder[];
  reviews: SellerReview[];
  returns: SellerReturn[];
  coupons: SellerCoupon[];
  earnings: SellerEarning[];
  settlements: SellerSettlement[];
  notifications: SellerNotif[];
  revenueData: RevenuePoint[];

  // Auth
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (data: Omit<SellerProfile, 'id' | 'sellerId' | 'tierScore' | 'rating' | 'totalReviews' | 'totalSales' | 'totalOrders' | 'totalRevenue' | 'returnRate' | 'cancellationRate' | 'onTimeDispatchRate' | 'responseRate' | 'joinedAt' | 'approvedAt' | 'lastActiveAt' | 'profileCompleteness' | 'kycStatus' | 'tier'>) => Promise<{ success: boolean; sellerId?: string; error?: string }>;

  // Data loaders
  loadSellerData: (sellerId: string) => void;

  // Products
  createProduct: (data: Omit<SellerProduct, 'id' | 'views' | 'wishlistCount' | 'cartAddCount' | 'totalSold' | 'rating' | 'reviewCount' | 'createdAt' | 'updatedAt' | 'publishedAt'>) => SellerProduct;
  updateProduct: (id: string, data: Partial<SellerProduct>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, stock: number) => void;

  // Orders
  updateOrderStatus: (id: string, status: SellerOrder['status'], note?: string) => void;
  setSellerNote: (orderId: string, note: string) => void;

  // Reviews
  respondToReview: (id: string, response: string) => void;

  // Returns
  updateReturnStatus: (id: string, status: SellerReturn['status']) => void;

  // Coupons
  createCoupon: (data: Omit<SellerCoupon, 'id' | 'usageCount' | 'createdAt'>) => SellerCoupon;
  updateCoupon: (id: string, data: Partial<SellerCoupon>) => void;
  deleteCoupon: (id: string) => void;

  // Notifications
  markNotifRead: (id: string) => void;
  markAllNotifRead: () => void;

  // Profile
  updateProfile: (data: Partial<SellerProfile>) => void;
  toggleVacationMode: () => void;

  // Computed
  unreadNotifCount: () => number;
  pendingOrdersCount: () => number;
  pendingProductsCount: () => number;
}

export const useSellerStore = create<SellerState>()(
  persist(
    (set, get) => ({
      seller: null,
      isAuthenticated: false,
      isLoading: false,
      products: [],
      orders: [],
      reviews: [],
      returns: [],
      coupons: [],
      earnings: [],
      settlements: [],
      notifications: [],
      revenueData: [],

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          if (typeof window === 'undefined') return { success: false, error: 'Not in browser' };
          
          const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
          
          const { data, error } = await supabase
            .from('sellers')
            .select('*')
            .eq('email', email)
            .single();
            
          if (error || !data) {
            return { success: false, error: error?.message ?? 'Seller not found' };
          }
          
          const sellerData = data as any;
          const bcrypt = await import('bcryptjs');
          
          const isMatch = await bcrypt.compare(password, sellerData.password);
          if (!isMatch) {
            return { success: false, error: 'Incorrect password' };
          }
          
          const { password: _, ...seller } = sellerData;
          set({ seller: seller as any, isAuthenticated: true });
          
          get().loadSellerData(seller.id);
          return { success: true };
        } catch (err: any) {
          return { success: false, error: err.message || 'Login failed' };
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        set({ seller: null, isAuthenticated: false, products: [], orders: [], reviews: [], returns: [], coupons: [], earnings: [], settlements: [], notifications: [], revenueData: [] });
      },

      register: async (data) => {
        try {
          if (typeof window === 'undefined') return { success: false, error: 'Not in browser' };
          
          const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/register_seller`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({ seller: data })
          });
          
          const result = await response.json();
          if (!response.ok) {
            return { success: false, error: result.error || 'Registration failed' };
          }
          
          return { success: true, sellerId: result.sellerId };
        } catch (err: any) {
          return { success: false, error: err.message || 'Registration failed' };
        }
      },

      loadSellerData: async (sellerId) => {
        try {
          const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
          
          // Use parallel queries to load everything
          const [
            productsRes, ordersRes, reviewsRes, returnsRes, couponsRes, 
            earningsRes, settlementsRes, notificationsRes, revenueRes
          ] = await Promise.all([
            supabase.from('products').select('*').eq('sellerId', sellerId),
            supabase.from('orders').select('*').eq('sellerId', sellerId),
            supabase.from('reviews').select('*').eq('sellerId', sellerId),
            supabase.from('returns').select('*').eq('sellerId', sellerId),
            supabase.from('coupons').select('*').eq('sellerId', sellerId),
            supabase.from('earnings').select('*').eq('sellerId', sellerId),
            supabase.from('settlements').select('*').eq('sellerId', sellerId),
            supabase.from('notifications').select('*').eq('sellerId', sellerId),
            supabase.from('revenue_data').select('*').eq('sellerId', sellerId)
          ]);
          
          set({
            products: productsRes.data || [],
            orders: ordersRes.data || [],
            reviews: reviewsRes.data || [],
            returns: returnsRes.data || [],
            coupons: couponsRes.data || [],
            earnings: earningsRes.data || [],
            settlements: settlementsRes.data || [],
            notifications: notificationsRes.data || [],
            revenueData: revenueRes.data || [],
          });
        } catch (err) {
          console.error("Failed to load seller data", err);
          if (typeof window !== 'undefined') {
            import('sonner').then(mod => mod.toast.error("Unable to load data. Please try again."));
          }
        }
      },

      createProduct: (data) => {
        // Return a dummy for synchronous compatibility, but fire the async insert
        const tempProduct = { ...data, id: Math.random().toString(), views: 0, wishlistCount: 0, cartAddCount: 0, totalSold: 0, rating: 0, reviewCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), publishedAt: null } as SellerProduct;
        
        const insertProduct = async () => {
          try {
            const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
            const { data: inserted, error } = await supabase.from('products').insert([data]).select().single();
            if (error) throw error;
            set(s => ({ products: s.products.map(p => p.id === tempProduct.id ? inserted : p) }));
          } catch (err) {
            console.error(err);
            if (typeof window !== 'undefined') {
              import('sonner').then(mod => mod.toast.error("Failed to create product"));
            }
          }
        };
        insertProduct();
        set(s => ({ products: [...s.products, tempProduct] }));
        return tempProduct;
      },

      updateProduct: async (id, data) => {
        try {
          const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
          const { error } = await supabase.from('products').update({ ...data, updatedAt: new Date().toISOString() }).eq('id', id);
          if (error) throw error;
          set(s => ({ products: s.products.map(p => p.id === id ? { ...p, ...data } : p) }));
        } catch (err) {
          console.error(err);
        }
      },

      deleteProduct: async (id) => {
        try {
          const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
          const { error } = await supabase.from('products').delete().eq('id', id);
          if (error) throw error;
          set(s => ({ products: s.products.filter(p => p.id !== id) }));
        } catch (err) {
          console.error(err);
        }
      },

      updateStock: (id, stock) => {
        get().updateProduct(id, { stock, status: stock === 0 ? 'out_of_stock' : 'approved' });
      },

      updateOrderStatus: async (id, status, note) => {
        try {
          const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
          const order = get().orders.find(o => o.id === id);
          if (!order) return;
          const statusHistory = [...order.statusHistory, { status, timestamp: new Date().toISOString(), note: note || null, updatedBy: 'seller' }];
          const { error } = await supabase.from('orders').update({ status, statusHistory, updatedAt: new Date().toISOString() }).eq('id', id);
          if (error) throw error;
          set(s => ({ orders: s.orders.map(o => o.id === id ? { ...o, status, statusHistory } : o) }));
        } catch (err) {
          console.error(err);
        }
      },

      setSellerNote: async (orderId, note) => {
        try {
          const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
          const { error } = await supabase.from('orders').update({ sellerNote: note }).eq('id', orderId);
          if (error) throw error;
          set(s => ({ orders: s.orders.map(o => o.id === orderId ? { ...o, sellerNote: note } : o) }));
        } catch (err) {
          console.error(err);
        }
      },

      respondToReview: async (id, response) => {
        try {
          const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
          const { error } = await supabase.from('reviews').update({ sellerResponse: response, sellerResponseAt: new Date().toISOString() }).eq('id', id);
          if (error) throw error;
          set(s => ({ reviews: s.reviews.map(r => r.id === id ? { ...r, sellerResponse: response, sellerResponseAt: new Date().toISOString() } : r) }));
        } catch (err) {
          console.error(err);
        }
      },

      updateReturnStatus: async (id, status) => {
        try {
          const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
          const updateData: any = { status };
          if (status === 'refunded') updateData.resolvedAt = new Date().toISOString();
          const { error } = await supabase.from('returns').update(updateData).eq('id', id);
          if (error) throw error;
          set(s => ({ returns: s.returns.map(r => r.id === id ? { ...r, ...updateData } : r) }));
        } catch (err) {
          console.error(err);
        }
      },

      createCoupon: (data) => {
        const tempCoupon = { ...data, id: Math.random().toString(), usageCount: 0, createdAt: new Date().toISOString() } as SellerCoupon;
        const insertCoupon = async () => {
          try {
            const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
            const { data: inserted, error } = await supabase.from('coupons').insert([data]).select().single();
            if (error) throw error;
            set(s => ({ coupons: s.coupons.map(c => c.id === tempCoupon.id ? inserted : c) }));
          } catch (err) {
            console.error(err);
          }
        };
        insertCoupon();
        set(s => ({ coupons: [...s.coupons, tempCoupon] }));
        return tempCoupon;
      },

      updateCoupon: async (id, data) => {
        try {
          const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
          const { error } = await supabase.from('coupons').update(data).eq('id', id);
          if (error) throw error;
          set(s => ({ coupons: s.coupons.map(c => c.id === id ? { ...c, ...data } : c) }));
        } catch (err) {
          console.error(err);
        }
      },

      deleteCoupon: async (id) => {
        try {
          const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
          const { error } = await supabase.from('coupons').delete().eq('id', id);
          if (error) throw error;
          set(s => ({ coupons: s.coupons.filter(c => c.id !== id) }));
        } catch (err) {
          console.error(err);
        }
      },

      markNotifRead: async (id) => {
        try {
          const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
          const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id);
          if (error) throw error;
          set(s => ({ notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n) }));
        } catch (err) {
          console.error(err);
        }
      },

      markAllNotifRead: async () => {
        try {
          const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
          const sellerId = get().seller?.sellerId;
          if (!sellerId) return;
          const { error } = await supabase.from('notifications').update({ read: true }).eq('sellerId', sellerId);
          if (error) throw error;
          set(s => ({ notifications: s.notifications.map(n => ({ ...n, read: true })) }));
        } catch (err) {
          console.error(err);
        }
      },

      updateProfile: async (data) => {
        try {
          const sellerId = get().seller?.sellerId;
          if (!sellerId) return;
          const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
          const { error } = await supabase.from('sellers').update(data).eq('sellerId', sellerId);
          if (error) throw error;
          set(s => ({ seller: s.seller ? { ...s.seller, ...data } : null }));
        } catch (err) {
          console.error(err);
        }
      },

      toggleVacationMode: () => {
        const cur = get().seller;
        if (!cur) return;
        get().updateProfile({ vacationMode: !cur.vacationMode });
      },

      unreadNotifCount: () => get().notifications.filter(n => !n.read).length,
      pendingOrdersCount: () => get().orders.filter(o => o.status === 'paid' || o.status === 'confirmed').length,
      pendingProductsCount: () => get().products.filter(p => p.status === 'pending_review').length,
    }),
    {
      name: 'bb-seller-portal-v2',
      partialize: (state) => ({
        seller: state.seller,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

