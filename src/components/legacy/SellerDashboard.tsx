'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Package, ShoppingBag, RotateCcw, Star, Tag, TrendingUp, DollarSign, Bell, Settings, LogOut, ChevronRight, AlertTriangle, Plus, ArrowUp, ArrowDown, Search, Edit2, Eye, Trash2, CheckCircle, Truck, Clock, Copy, XCircle, Shield, CreditCard, User, Globe
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { SellerLayout } from "./SellerSubPages";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/lib/store/auth-store";

import {
  MOCK_SELLER_PRODUCTS as initialProducts,
  MOCK_SELLER_EARNINGS as monthlyData,
  MOCK_SELLER_ORDERS_LIST as initialOrders,
  MOCK_SELLER_COUPONS_LIST as initialCoupons,
  MOCK_SELLER_RETURNS_LIST as initialReturns,
  MOCK_SELLER_REVIEWS_LIST as initialReviews
} from "@/lib/mock/sellers";

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/seller-dashboard" },
  { icon: ShoppingBag, label: "My Shop", href: "/seller-shop" },
  { icon: Package, label: "Products", href: "/seller-products" },
  { icon: Package, label: "Orders", href: "/seller-orders", badge: 3 },
  { icon: Package, label: "Inventory", href: "/seller-inventory" },
  { icon: RotateCcw, label: "Returns", href: "/seller-returns", badge: 1 },
  { icon: Star, label: "Reviews", href: "/seller-reviews" },
  { icon: Tag, label: "Coupons & Offers", href: "/seller-coupons" },
  { icon: TrendingUp, label: "Performance", href: "/seller-performance" },
  { icon: DollarSign, label: "Earnings", href: "/seller-earnings" },
  { icon: Bell, label: "Notifications", href: "/seller-notifications" },
  { icon: Settings, label: "Settings", href: "/seller-settings" },
];

const revenueData = [
  { day: "Nov 1", revenue: 12400 },
  { day: "Nov 5", revenue: 18900 },
  { day: "Nov 10", revenue: 15200 },
  { day: "Nov 15", revenue: 22400 },
  { day: "Nov 20", revenue: 19800 },
  { day: "Nov 25", revenue: 28900 },
  { day: "Nov 30", revenue: 24891 },
];

export function SellerDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    ordersCount: 0,
    productsCount: 0,
    shopRating: 5.0,
    reviewsCount: 0
  });
  const [productsList, setProductsList] = useState<any[]>([]);
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [searchProd, setSearchProd] = useState("");
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProd, setNewProd] = useState({ name: "", sku: "", price: "", stock: "", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&auto=format&fit=crop" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return;
      try {
        const supabase = createClient();
        const sellerId = user.seller?.id;
        if (!sellerId) {
          setLoading(false);
          return;
        }

        // 1. Fetch products count and list
        const { data: prods } = await supabase
          .from('products')
          .select('*')
          .eq('seller_id', sellerId);

        const prodList = prods || [];
        setProductsList(prodList);

        // 2. Fetch order items for this seller to calculate revenue and count
        const { data: items } = await supabase
          .from('order_items')
          .select('*, orders(*)')
          .eq('seller_id', sellerId);

        const itemList = items || [];
        
        // Compute unique orders and revenue
        const uniqueOrderIds = new Set(itemList.map(it => it.order_id));
        const totalRev = itemList.reduce((sum, item) => sum + Number(item.subtotal || 0), 0);

        // Format orders for the table
        const formattedOrders = Array.from(uniqueOrderIds).slice(0, 5).map(orderId => {
          const item = itemList.find(it => it.order_id === orderId);
          const order = item?.orders;
          return {
            id: order?.order_number || `ORD-${orderId.toString().substring(0, 6).toUpperCase()}`,
            customer: order?.shipping_address?.full_name || 'Customer',
            product: item?.product_name || 'Handicraft Item',
            amount: itemList.filter(it => it.order_id === orderId).reduce((s, it) => s + Number(it.subtotal || 0), 0),
            status: order?.status || 'PROCESSING',
            date: new Date(order?.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
          };
        });
        setOrdersList(formattedOrders);

        // 3. Fetch seller performance rating
        const { data: perf } = await supabase
          .from('seller_performance')
          .select('*')
          .eq('seller_id', sellerId)
          .maybeSingle();

        setStats({
          totalRevenue: totalRev,
          ordersCount: uniqueOrderIds.size,
          productsCount: prodList.length,
          shopRating: perf ? Number(perf.avg_rating) : 5.0,
          reviewsCount: perf ? 12 : 0
        });

      } catch (err) {
        console.error('Error loading seller dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [user]);

  const [coupons, setCoupons] = useState(initialCoupons);
  const [returnsList, setReturnsList] = useState(initialReturns);
  const [reviewsList, setReviewsList] = useState(initialReviews);


  return (
    <SellerLayout title="Dashboard">
      {loading ? (
        <>
          {/* Overview Stats Skeletons */}
          <div className="mb-8">
            <Skeleton className="h-8 w-60 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="w-8 h-8 rounded-xl" />
                </div>
                <Skeleton className="h-8 w-28 mb-2" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>

          {/* Chart Skeleton */}
          <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm mb-8">
            <Skeleton className="h-6 w-48 mb-6" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>

          {/* Recent Orders Skeleton */}
          <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
            <Skeleton className="h-6 w-36 mb-6" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-black/5 bg-[#FAFAF8]">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <div className="text-right space-y-2">
                    <Skeleton className="h-4 w-16 ml-auto" />
                    <Skeleton className="h-5 w-20 rounded-full ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Overview Stats */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Seller Dashboard 🏪</h1>
            <p className="text-xs text-[#8C8B80]">Welcome back, {user?.name || 'Seller'}! Here is your shop performance summary.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Revenue", val: `₹${stats.totalRevenue.toLocaleString()}`, change: "+0%", icon: DollarSign, color: "#FF7A00" },
              { label: "Orders Fulfilled", val: `${stats.ordersCount}`, change: "+0%", icon: Package, color: "#1A9E4E" },
              { label: "Active Products", val: `${stats.productsCount}`, change: "+0 new", icon: ShoppingBag, color: "#2563EB" },
              { label: "Shop Rating", val: `${stats.shopRating.toFixed(1)} ★`, change: `${stats.reviewsCount} reviews`, icon: Star, color: "#D97706" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-[#8C8B80] font-medium">{stat.label}</span>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}15`, color: stat.color }}>
                    <stat.icon size={16} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#1C1B14] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{stat.val}</div>
                <div className="text-xs text-[#1A9E4E] font-semibold">{stat.change}</div>
              </div>
            ))}
          </div>

          {/* Sales Chart */}
          <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm mb-8">
            <h3 className="font-bold text-[#1C1B14] text-base mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Revenue Performance</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0EA" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#8C8B80" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#8C8B80" }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#FF7A00" strokeWidth={3} dot={{ r: 4, fill: "#FF7A00" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-[#1C1B14] text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Recent Orders</h3>
              <Link href="/seller-orders" className="text-xs font-semibold text-[#FF7A00] hover:underline flex items-center gap-1">
                View All Orders <ChevronRight size={14} />
              </Link>
            </div>

            <div className="space-y-3">
              {ordersList.map((ord) => (
                <div key={ord.id} className="flex items-center justify-between p-4 rounded-2xl border border-black/5 bg-[#FAFAF8]">
                  <div>
                    <div className="font-mono text-xs text-[#8C8B80]">{ord.id}</div>
                    <div className="text-sm font-semibold text-[#1C1B14] mt-0.5">{ord.customer} · {ord.product}</div>
                    <div className="text-xs text-[#B0AFA5] mt-0.5">{ord.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm text-[#1C1B14]">₹{ord.amount.toLocaleString()}</div>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 uppercase">
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </SellerLayout>
  );
}
