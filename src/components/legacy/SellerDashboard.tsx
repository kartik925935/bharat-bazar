'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Package, ShoppingBag, RotateCcw, Star, Tag, TrendingUp, DollarSign, Bell, Settings, LogOut, ChevronRight, AlertTriangle, Plus, ArrowUp, ArrowDown, Search, Edit2, Eye, Trash2, CheckCircle, Truck, Clock, Copy, XCircle, Shield, CreditCard, User, Globe
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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

const initialProducts = [
  { id: 'p1', name: 'Bandhani Silk Dupatta', sku: 'BND-001', price: 1499, stock: 24, status: 'active', sales: 142, img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&auto=format&fit=crop' },
  { id: 'p2', name: 'Blue Pottery Vase', sku: 'BPV-003', price: 2199, stock: 8, status: 'active', sales: 67, img: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=200&auto=format&fit=crop' },
  { id: 'p3', name: 'Pashmina Shawl (Natural)', sku: 'PSH-007', price: 4999, stock: 3, status: 'low_stock', sales: 38, img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=200&auto=format&fit=crop' },
  { id: 'p4', name: 'Madhubani Painting A3', sku: 'MDH-012', price: 3499, stock: 0, status: 'out_of_stock', sales: 89, img: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=200&auto=format&fit=crop' },
  { id: 'p5', name: 'Khadi Cotton Kurta Set', sku: 'KKS-019', price: 1899, stock: 31, status: 'active', sales: 201, img: 'https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=200&auto=format&fit=crop' },
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

const monthlyData = [
  { month: "Jun", revenue: 89000 },
  { month: "Jul", revenue: 102000 },
  { month: "Aug", revenue: 95000 },
  { month: "Sep", revenue: 118000 },
  { month: "Oct", revenue: 134000 },
  { month: "Nov", revenue: 158000 },
];

const initialOrders = [
  { id: "ORD-1023", customer: "Priya Sharma", product: "Bandhani Dupatta", amount: 1499, status: "PROCESSING", date: "26 Jul 2026" },
  { id: "ORD-1019", customer: "Rahul Verma", product: "Blue Pottery Vase", amount: 2199, status: "IN_TRANSIT", date: "25 Jul 2026" },
  { id: "ORD-1014", customer: "Anjali Mehta", product: "Pashmina Shawl", amount: 4999, status: "DELIVERED", date: "24 Jul 2026" },
  { id: "ORD-1008", customer: "Suresh Kumar", product: "Khadi Kurta Set", amount: 1899, status: "DELIVERED", date: "23 Jul 2026" },
  { id: "ORD-1002", customer: "Deepa Nair", product: "Madhubani Painting", amount: 3499, status: "CANCELLED", date: "22 Jul 2026" },
];

function SellerSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-60 shrink-0">
      <div className="bg-[#1C1B14] rounded-2xl overflow-hidden sticky top-24">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
              MH
            </div>
            <div>
              <div className="font-semibold text-white text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Meena Handicrafts</div>
              <div className="flex items-center gap-1.5 text-xs text-white/50">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Online
              </div>
            </div>
          </div>
          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: "linear-gradient(135deg, #BF953F, #FCF6BA)", color: "#5A3E0A" }}>
            💎 Platinum Seller
          </span>
        </div>

        <nav className="p-3">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || (link.href === "/seller-dashboard" && pathname.startsWith("/seller-dashboard"));
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 transition-all ${
                  isActive ? "text-[#FF7A00] bg-white/10" : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <link.icon size={16} />
                <span className="text-sm font-medium flex-1">{link.label}</span>
                {link.badge && (
                  <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center bg-[#FF7A00] text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <Link href="/login" className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-white/40 hover:text-red-400 hover:bg-white/5 transition-all">
            <LogOut size={16} />
            <span className="text-sm font-medium">Logout</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}

export function SellerDashboard() {
  const pathname = usePathname();
  const path = pathname;

  const [productsList, setProductsList] = useState(initialProducts);
  const [ordersList, setOrdersList] = useState(initialOrders);
  const [searchProd, setSearchProd] = useState("");
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProd, setNewProd] = useState({ name: "", sku: "", price: "", stock: "", img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&auto=format&fit=crop" });

  const [coupons, setCoupons] = useState([
    { code: 'CRAFT20', type: 'percent', value: 20, minOrder: 500, uses: 47, maxUses: 100, active: true, expiry: '31 Aug 2026' },
    { code: 'FIRST150', type: 'flat', value: 150, minOrder: 1000, uses: 23, maxUses: 50, active: true, expiry: '15 Aug 2026' },
  ]);

  const [returnsList, setReturnsList] = useState([
    { id: 'RTN-041', orderId: 'ORD-1008', product: 'Khadi Kurta Set', customer: 'Suresh Kumar', reason: 'Size mismatch', amount: 1899, status: 'pending' },
    { id: 'RTN-039', orderId: 'ORD-998', product: 'Bandhani Dupatta', customer: 'Meera Singh', reason: 'Color variation', amount: 1499, status: 'approved' },
  ]);

  const [reviewsList, setReviewsList] = useState([
    { id: 'rv1', customer: 'Priya S.', product: 'Bandhani Dupatta', rating: 5, comment: 'Vibrant colors and authentic tie-dye!', replied: false },
    { id: 'rv2', customer: 'Anjali M.', product: 'Pashmina Shawl', rating: 4, comment: 'Soft and warm product.', replied: true },
  ]);

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="hidden lg:block">
            <SellerSidebar />
          </div>

          <div className="flex-1 min-w-0">
            {/* Overview Stats */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Seller Dashboard 🏪</h1>
              <p className="text-xs text-[#8C8B80]">Welcome back, Meena! Here is your shop performance summary.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Revenue", val: "₹1,42,890", change: "+18.4%", icon: DollarSign, color: "#FF7A00" },
                { label: "Orders Fulfilled", val: "538", change: "+12.1%", icon: Package, color: "#1A9E4E" },
                { label: "Active Products", val: "42", change: "+4 new", icon: ShoppingBag, color: "#2563EB" },
                { label: "Shop Rating", val: "4.9 ★", change: "1,280 reviews", icon: Star, color: "#D97706" },
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
          </div>
        </div>
      </div>
    </div>
  );
}
