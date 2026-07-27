'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Package, ShoppingBag, RotateCcw, Star, Tag,
  TrendingUp, DollarSign, Bell, Settings, LogOut, Menu, X,
  Search, Filter, Plus, Edit2, Eye, Check, AlertTriangle,
  ChevronDown, Upload, Truck, CheckCircle, Clock, XCircle,
  Store, ImageIcon, Globe, Phone, Mail, MapPin, Shield
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { SellerLayout } from './SellerSubPages';

const PERF_DATA = [
  { month: "Jul", views: 420, clicks: 134, conversions: 12 },
  { month: "Aug", views: 580, clicks: 198, conversions: 18 },
  { month: "Sep", views: 510, clicks: 162, conversions: 15 },
  { month: "Oct", views: 720, clicks: 243, conversions: 24 },
  { month: "Nov", views: 950, clicks: 342, conversions: 38 },
  { month: "Dec", views: 1100, clicks: 410, conversions: 45 },
];

export function SellerPerformancePage() {
  return (
    <SellerLayout title="Performance">
      <div className="mb-6">
        <h1 className="font-bold text-xl text-[#1C1B14]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Performance Analytics</h1>
        <p className="text-sm text-[#8C8B80]">Track how your shop is growing</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Page Views", value: "1,100", change: "+16%", up: true },
          { label: "Product Clicks", value: "410", change: "+20%", up: true },
          { label: "Conversion Rate", value: "4.1%", change: "+0.5%", up: true },
          { label: "Avg Response Time", value: "1.8h", change: "-0.3h", up: true },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white rounded-2xl border border-black/5 p-5">
            <div className="text-xs text-[#8C8B80] mb-1">{kpi.label}</div>
            <div className="font-black text-xl mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{kpi.value}</div>
            <div className={`text-xs font-medium ${kpi.up ? "text-[#1A9E4E]" : "text-red-500"}`}>{kpi.change} vs last month</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-black/5 p-6 mb-6">
        <h3 className="font-bold text-[#1C1B14] mb-4 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Traffic & Conversions</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={PERF_DATA}>
            <defs>
              <linearGradient id="vg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#FF7A00" stopOpacity={0.15} /><stop offset="95%" stopColor="#FF7A00" stopOpacity={0} /></linearGradient>
              <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1A9E4E" stopOpacity={0.15} /><stop offset="95%" stopColor="#1A9E4E" stopOpacity={0} /></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F5F4F0" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#8C8B80" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#8C8B80" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #F5F4F0", fontSize: 12 }} />
            <Area key="pp-area-views" type="monotone" dataKey="views" stroke="#FF7A00" strokeWidth={2} fill="url(#vg)" name="Views" />
            <Area key="pp-area-clicks" type="monotone" dataKey="clicks" stroke="#1A9E4E" strokeWidth={2} fill="url(#cg)" name="Clicks" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { title: "Top Products by Views", items: [["Bandhani Silk Saree", "342 views"], ["Block Print Dupatta", "198 views"], ["Natural Dye Kurta", "156 views"]] },
          { title: "Customer Demographics", items: [["Women 25-34", "42%"], ["Women 35-44", "28%"], ["Men 25-44", "18%"], ["Others", "12%"]] },
        ].map(section => (
          <div key={section.title} className="bg-white rounded-2xl border border-black/5 p-5">
            <h4 className="font-bold text-[#1C1B14] mb-3 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{section.title}</h4>
            <div className="space-y-2">
              {section.items.map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-[#555449]">{label}</span>
                  <span className="font-semibold text-[#1C1B14]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SellerLayout>
  );
}

// ─── Seller Notifications Page ─────────────────────────────
const SELLER_NOTIFS = [
  { id: "1", icon: "🛒", title: "New Order Received!", body: "ORD-2024-001240 · Bandhani Silk Saree · ₹2,499", time: "5 min ago", unread: true },
  { id: "2", icon: "⭐", title: "New 5-Star Review", body: "Priya S. left you a review on Bandhani Saree", time: "2 hours ago", unread: true },
  { id: "3", icon: "💰", title: "Payout Credited", body: "₹42,380 credited to your bank account · UTR123456", time: "Nov 30, 2024", unread: false },
  { id: "4", icon: "⚠️", title: "Low Stock Alert", body: "Indigo Block Print Saree has only 3 units left", time: "Nov 29, 2024", unread: false },
  { id: "5", icon: "↩️", title: "Return Request", body: "RET-001 · Bandhani Silk Saree · ₹2,499 · Action needed", time: "Nov 29, 2024", unread: false },
];

export function SellerNotificationsPage() {
  const [notifs, setNotifs] = useState(SELLER_NOTIFS);
  const markRead = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));

  return (
    <SellerLayout title="Notifications">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-bold text-xl text-[#1C1B14]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Notifications</h1>
        <button onClick={() => setNotifs(prev => prev.map(n => ({ ...n, unread: false })))} className="text-sm font-medium" style={{ color: "#FF7A00" }}>Mark all read</button>
      </div>
      <div className="space-y-2 max-w-2xl">
        {notifs.map(n => (
          <motion.div key={n.id} onClick={() => markRead(n.id)} className={`flex gap-4 p-4 rounded-2xl cursor-pointer transition-all hover:shadow-sm ${n.unread ? "bg-[#FFF8F0] border border-[#FFD4A8]" : "bg-white border border-black/5"}`}>
            <div className="w-10 h-10 rounded-xl bg-[#FFF8F0] flex items-center justify-center text-xl shrink-0">{n.icon}</div>
            <div className="flex-1">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <div className="text-sm font-semibold text-[#1C1B14] mb-0.5">{n.title}</div>
                  <div className="text-xs text-[#8C8B80]">{n.body}</div>
                </div>
                {n.unread && <div className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: "#FF7A00" }} />}
              </div>
              <div className="text-xs text-[#B0AFA5] mt-1.5">{n.time}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </SellerLayout>
  );
}

// ─── Seller Settings Page ──────────────────────────────────
export function SellerSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({ payoutFrequency: "monthly", upi: "meena@upi", autoAccept: true, lowStockAlert: true, orderNotifs: true, reviewNotifs: true });

  const set = (k: string, v: string | boolean) => setSettings(p => ({ ...p, [k]: v }));

  return (
    <SellerLayout title="Settings">
      <div className="max-w-2xl">
        <h1 className="font-bold text-xl text-[#1C1B14] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Seller Settings</h1>

        <div className="space-y-4">
          {/* Payment */}
          <div className="bg-white rounded-2xl border border-black/5 p-6">
            <h3 className="font-bold text-[#1C1B14] text-sm mb-4 flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <DollarSign size={16} style={{ color: "#FF7A00" }} /> Payment Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1C1B14] mb-1.5">UPI ID for Payouts</label>
                <input value={settings.upi} onChange={e => set("upi", e.target.value)} className="w-full h-10 px-3 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1C1B14] mb-1.5">Payout Frequency</label>
                <select value={settings.payoutFrequency} onChange={e => set("payoutFrequency", e.target.value)} className="w-full h-10 px-3 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm bg-white">
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
          </div>

          {/* Automation */}
          <div className="bg-white rounded-2xl border border-black/5 p-6">
            <h3 className="font-bold text-[#1C1B14] text-sm mb-4 flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <Settings size={16} style={{ color: "#FF7A00" }} /> Automation
            </h3>
            {[
              { key: "autoAccept", label: "Auto-accept new orders", desc: "Automatically accept orders without manual review" },
              { key: "lowStockAlert", label: "Low stock alerts", desc: "Get notified when product stock drops below threshold" },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between gap-4 mb-4 last:mb-0">
                <div><div className="text-sm font-medium text-[#1C1B14]">{label}</div><div className="text-xs text-[#8C8B80]">{desc}</div></div>
                <button onClick={() => set(key, !settings[key as keyof typeof settings])}
                  className={`relative w-11 h-6 rounded-full shrink-0 transition-colors ${settings[key as keyof typeof settings] ? "bg-[#1A9E4E]" : "bg-[#D4D3CB]"}`}>
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${settings[key as keyof typeof settings] ? "left-5" : "left-0.5"}`} />
                </button>
              </div>
            ))}
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl border border-black/5 p-6">
            <h3 className="font-bold text-[#1C1B14] text-sm mb-4 flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <Bell size={16} style={{ color: "#FF7A00" }} /> Notifications
            </h3>
            {[
              { key: "orderNotifs", label: "Order notifications" },
              { key: "reviewNotifs", label: "Review notifications" },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between gap-4 mb-3 last:mb-0">
                <span className="text-sm text-[#555449]">{label}</span>
                <button onClick={() => set(key, !settings[key as keyof typeof settings])}
                  className={`relative w-11 h-6 rounded-full shrink-0 transition-colors ${settings[key as keyof typeof settings] ? "bg-[#1A9E4E]" : "bg-[#D4D3CB]"}`}>
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${settings[key as keyof typeof settings] ? "left-5" : "left-0.5"}`} />
                </button>
              </div>
            ))}
          </div>

          <motion.button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
            className="px-8 py-3 rounded-2xl text-white font-semibold text-sm" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }} whileTap={{ scale: 0.97 }}>
            {saved ? "✓ Saved!" : "Save Settings"}
          </motion.button>
        </div>
      </div>
    </SellerLayout>
  );
}

