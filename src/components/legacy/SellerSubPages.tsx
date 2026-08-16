'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, ShoppingBag, RotateCcw, Star, Tag,
  TrendingUp, DollarSign, Bell, Settings, LogOut, Menu, X,
  Search, Filter, Plus, Edit2, Eye, Check, AlertTriangle,
  ChevronDown, Upload, Truck, CheckCircle, Clock, XCircle,
  Store, ImageIcon, Globe, Phone, Mail, MapPin, Shield
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAuthStore } from '@/lib/store/auth-store';
import { useSellerStore } from '@/lib/store/seller-store';
import { useNotificationStore } from '@/lib/store/notification-store';
import { getSellerTier } from '@/lib/utils/seller-tier';

const SELLER_NAV = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/seller-dashboard" },
  { icon: Store, label: "My Shop", href: "/seller-shop" },
  { icon: Package, label: "Products", href: "/seller-products" },
  { icon: ShoppingBag, label: "Orders", href: "/seller-orders" },
  { icon: Package, label: "Inventory", href: "/seller-inventory" },
  { icon: RotateCcw, label: "Returns", href: "/seller-returns" },
  { icon: Star, label: "Reviews", href: "/seller-reviews" },
  { icon: Tag, label: "Coupons", href: "/seller-coupons" },
  { icon: TrendingUp, label: "Performance", href: "/seller-performance" },
  { icon: DollarSign, label: "Earnings", href: "/seller-earnings" },
  { icon: Bell, label: "Notifications", href: "/seller-notifications" },
  { icon: Settings, label: "Settings", href: "/seller-settings" },
];

function SidebarLinks({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();
  const { orders = [], returns = [] } = useSellerStore();
  const { notifications = [] } = useNotificationStore();

  const pendingOrders = orders.filter((o: any) => o.status === 'pending' || o.status === 'processing').length;
  const pendingReturns = returns.filter((r: any) => r.status === 'requested').length;
  const unreadNotifs = notifications.filter((n: any) => !n.read).length;

  const getBadgeCount = (href: string) => {
    if (href === '/seller-orders') return pendingOrders;
    if (href === '/seller-returns') return pendingReturns;
    if (href === '/seller-notifications') return unreadNotifs;
    return 0;
  };

  return (
    <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
      {SELLER_NAV.map(item => {
        const isActive = pathname === item.href;
        const count = getBadgeCount(item.href);
        return (
          <Link key={item.label} href={item.href} onClick={onLinkClick}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${isActive ? "font-medium" : "text-white/60 hover:text-white hover:bg-white/5"}`}
            style={isActive ? { background: "rgba(255,122,0,0.15)", color: "#FF7A00" } : {}}>
            <item.icon size={16} />
            <span className="flex-1">{item.label}</span>
            {count > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#FF7A00] text-white text-[10px] font-bold flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function SellerLayout({ children, title }: { children: React.ReactNode; title?: string }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();

  const shopName = user?.seller?.shops?.name || user?.seller?.shops?.[0]?.name || user?.seller?.shop_name || user?.name || "Seller";
  const initials = shopName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "SL";
  const salesCount = user?.seller?.total_sales ?? user?.seller?.totalSales ?? user?.seller?.sales_count ?? 0;
  const tierInfo = getSellerTier(salesCount, user?.seller?.tier);

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20 pb-20 lg:pb-0 flex">
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* Mobile Drawer */}
      <div className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#1C1B14] transition-transform duration-300 lg:hidden ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-5 pt-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-xs" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>BB</div>
            <span className="text-white text-sm font-bold">Seller Panel</span>
          </div>
          <button onClick={() => setMobileSidebarOpen(false)} className="text-white/60 hover:text-white p-1"><X size={18} /></button>
        </div>
        <SidebarLinks onLinkClick={() => setMobileSidebarOpen(false)} />
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10">
          <button onClick={() => router.push("/")} className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-white/60 hover:text-white hover:bg-white/5 transition-all text-sm">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-[#1C1B14] h-[calc(100vh-5rem)] sticky top-20 shrink-0">
        <div className="px-4 py-5 border-b border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>BB</div>
            <div>
              <div className="text-white text-xs font-bold">Bharat Bazaar</div>
              <div className="text-white/40 text-[10px]">Seller Panel</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/5 rounded-xl p-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm shrink-0">{initials}</div>
            <div className="min-w-0">
              <div className="text-white text-xs font-semibold truncate">{shopName}</div>
              <div className="text-amber-400 text-[10px] font-medium">{tierInfo.icon} {tierInfo.label}</div>
            </div>
          </div>
        </div>
        <SidebarLinks />
        <div className="mt-auto p-3 border-t border-white/10">
          <button onClick={() => router.push("/")} className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-white/50 hover:text-white hover:bg-white/5 transition-all text-sm">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-black/5 sticky top-20 z-30">
          <button onClick={() => setMobileSidebarOpen(true)} className="p-2 rounded-xl bg-[#FAFAF8] border border-black/5">
            <Menu size={18} className="text-[#555449]" />
          </button>
          {title && <span className="font-bold text-[#1C1B14] text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</span>}
        </div>
        <div className="flex-1 p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── My Shop (Public Store Editor) ────────────────────────
export function SellerShopPage() {
  const { user } = useAuthStore();
  const [saved, setSaved] = useState(false);
  const [shop, setShop] = useState({
    name: "Seller Shop",
    tagline: "Authentic Handicrafts & Heritage Collection",
    description: "Every piece we list carries tradition and love.",
    phone: "",
    email: "",
    location: "India",
    website: "",
    returnPolicy: "10 days",
    processingTime: "2-3 days",
  });

  useEffect(() => {
    if (user) {
      setShop({
        name: user.seller?.shops?.name || user.seller?.shops?.[0]?.name || user.seller?.shop_name || user.name || "Seller Shop",
        tagline: user.seller?.shops?.tagline || user.seller?.shops?.[0]?.tagline || "Authentic Handicrafts & Heritage Collection",
        description: user.seller?.shops?.description || user.seller?.shops?.[0]?.description || "Every piece we list carries tradition and love.",
        phone: user.phone || user.seller?.phone || "",
        email: user.email || "",
        location: user.seller?.shops?.city ? `${user.seller.shops.city}, ${user.seller.shops.state || ''}` : "India",
        website: user.seller?.shops?.website || "",
        returnPolicy: "10 days",
        processingTime: "2-3 days",
      });
    }
  }, [user]);

  const set = (k: string, v: string) => setShop(p => ({ ...p, [k]: v }));

  return (
    <SellerLayout title="My Shop">
      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[#1C1B14] font-bold text-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>My Shop Profile</h1>
            <p className="text-sm text-[#8C8B80]">This is what customers see on your public storefront</p>
          </div>
          <Link href={`/seller/${user?.seller?.id || "meena-handicrafts"}`} target="_blank" className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#D4D3CB] text-sm text-[#555449] hover:border-[#FF7A00] transition-all">
            <Eye size={14} /> Preview Shop
          </Link>
        </div>

        {/* Banner + Avatar */}
        <div className="bg-white rounded-2xl border border-black/5 p-6 mb-4">
          <h3 className="font-semibold text-[#1C1B14] text-sm mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Shop Branding</h3>
          <div className="relative h-32 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] mb-4 overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-all">
              <div className="flex items-center gap-2 text-white text-sm font-medium"><Upload size={16} /> Change Banner</div>
            </div>
          </div>
          <div className="flex items-end gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-[#FFF8F0] flex items-center justify-center text-3xl border-4 border-white -mt-10 shadow-md">🧵</div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#FF7A00] flex items-center justify-center">
                <ImageIcon size={10} className="text-white" />
              </button>
            </div>
            <div>
              <div className="font-bold text-[#1C1B14]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{shop.name}</div>
              {(() => {
                const sales = user?.seller?.total_sales ?? user?.seller?.totalSales ?? user?.seller?.sales_count ?? 0;
                const ratingVal = user?.seller?.rating ?? 0;
                const reviewsVal = user?.seller?.total_reviews ?? user?.seller?.totalReviews ?? user?.seller?.reviews_count ?? 0;
                const tInfo = getSellerTier(sales, user?.seller?.tier);
                return (
                  <div className="text-xs text-amber-600 font-medium">
                    {tInfo.icon} {tInfo.label} · {reviewsVal > 0 ? `${ratingVal.toFixed(1)}★ (${reviewsVal.toLocaleString()} reviews)` : '0 Sales · No reviews yet'}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Shop Details */}
        <div className="bg-white rounded-2xl border border-black/5 p-6 mb-4 space-y-4">
          <h3 className="font-semibold text-[#1C1B14] text-sm mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Shop Details</h3>
          {[
            { key: "name", label: "Shop Name", icon: Store },
            { key: "tagline", label: "Tagline", icon: Store },
          ].map(({ key, label, icon: Icon }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-[#1C1B14] mb-1.5 flex items-center gap-1.5"><Icon size={13} className="text-[#FF7A00]" />{label}</label>
              <input value={shop[key as keyof typeof shop]} onChange={e => set(key, e.target.value)} className="w-full h-10 px-3 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-[#1C1B14] mb-1.5">Shop Description</label>
            <textarea rows={4} value={shop.description} onChange={e => set("description", e.target.value)} className="w-full px-3 py-2.5 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm resize-none" />
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl border border-black/5 p-6 mb-4 space-y-4">
          <h3 className="font-semibold text-[#1C1B14] text-sm mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Contact & Location</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: "phone", label: "Phone", icon: Phone },
              { key: "email", label: "Email", icon: Mail },
              { key: "location", label: "Location", icon: MapPin },
              { key: "website", label: "Website (optional)", icon: Globe },
            ].map(({ key, label, icon: Icon }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-[#1C1B14] mb-1.5 flex items-center gap-1.5"><Icon size={12} className="text-[#FF7A00]" />{label}</label>
                <input value={shop[key as keyof typeof shop]} onChange={e => set(key, e.target.value)} className="w-full h-10 px-3 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Policies */}
        <div className="bg-white rounded-2xl border border-black/5 p-6 mb-6 space-y-4">
          <h3 className="font-semibold text-[#1C1B14] text-sm mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Shop Policies</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: "returnPolicy", label: "Return Window" },
              { key: "processingTime", label: "Processing Time" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-[#1C1B14] mb-1.5">{label}</label>
                <input value={shop[key as keyof typeof shop]} onChange={e => set(key, e.target.value)} className="w-full h-10 px-3 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" />
              </div>
            ))}
          </div>
        </div>

        <motion.button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
          className="px-8 py-3 rounded-2xl text-white font-semibold text-sm" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }} whileTap={{ scale: 0.97 }}>
          {saved ? "✓ Saved!" : "Save Changes"}
        </motion.button>
      </div>
    </SellerLayout>
  );
}

import { SELLER_ORDERS, INVENTORY } from "@/lib/mock/sellers";


const ORDER_STATUS: Record<string, { bg: string; text: string; label: string; icon: React.ElementType }> = {
  NEW: { bg: "#EFF6FF", text: "#2563EB", label: "New", icon: Clock },
  PROCESSING: { bg: "#FFF8F0", text: "#FF7A00", label: "Processing", icon: Package },
  SHIPPED: { bg: "#F5F3FF", text: "#7C3AED", label: "Shipped", icon: Truck },
  DELIVERED: { bg: "#F0FDF4", text: "#1A9E4E", label: "Delivered", icon: CheckCircle },
  CANCELLED: { bg: "#FEF2F2", text: "#DC2626", label: "Cancelled", icon: XCircle },
};

export function SellerOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const filtered = SELLER_ORDERS.filter(o =>
    (statusFilter === "ALL" || o.status === statusFilter) &&
    (!search || o.id.includes(search) || o.customer.toLowerCase().includes(search.toLowerCase()) || o.product.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <SellerLayout title="Orders">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-bold text-xl text-[#1C1B14]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Orders</h1>
          <p className="text-sm text-[#8C8B80]">{0 /* SELLER_ORDERS.length */} total orders</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0AFA5]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." className="w-full h-10 pl-9 pr-3 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" />
        </div>
        <div className="flex gap-1 bg-[#F5F4F0] p-1 rounded-xl">
          {["ALL", "NEW", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === s ? "bg-white shadow-sm text-[#1C1B14]" : "text-[#8C8B80]"}`}>{s === "ALL" ? "All" : ORDER_STATUS[s]?.label}</button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[#F5F4F0] text-xs text-[#8C8B80] font-semibold">
              <th className="p-4 text-left">Order</th>
              <th className="p-4 text-left">Product</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-right">Amount</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Date</th>
              <th className="p-4 text-center">Action</th>
            </tr></thead>
            <tbody>
              {filtered.map((order, i) => {
                const st = ORDER_STATUS[order.status];
                const Icon = st.icon;
                return (
                  <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-[#F5F4F0] hover:bg-[#FAFAF8] transition-colors">
                    <td className="p-4 font-mono text-xs text-[#8C8B80]">{order.id}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <img src={order.img} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                        <span className="text-sm font-medium text-[#1C1B14] line-clamp-1">{order.product}</span>
                      </div>
                    </td>
                    <td className="p-4 text-[#555449]">{order.customer}</td>
                    <td className="p-4 text-right font-semibold text-[#1C1B14]">₹{order.amount.toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: st.bg, color: st.text }}>
                        <Icon size={11} /> {st.label}
                      </span>
                    </td>
                    <td className="p-4 text-right text-xs text-[#8C8B80]">{order.date}</td>
                    <td className="p-4 text-center">
                      {order.status === "NEW" && (
                        <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: "#FF7A00" }}>Accept</button>
                      )}
                      {order.status === "PROCESSING" && (
                        <button className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#7C3AED] text-[#7C3AED]">Mark Shipped</button>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="py-12 text-center text-[#8C8B80] text-sm">No orders found</div>}
      </div>
    </SellerLayout>
  );
}


