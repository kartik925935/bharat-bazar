'use client';
import Link from 'next/link';
import { useState } from "react";
import { motion } from "framer-motion";
import { Star, ShoppingBag, Clock, Shield, Smartphone, LogOut, MapPin, ChevronRight, TrendingUp, Eye } from "lucide-react";
import { CustomerAccountLayout } from "./CustomerDashboard";

import { RECENT_PRODUCTS, PURCHASE_HISTORY, FAV_SELLERS, SESSIONS, LOGIN_HISTORY } from "@/lib/mock/customer";


export function RecentlyViewedPage() {
  return (
    <CustomerAccountLayout title="Recently Viewed">
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-xl text-[#1C1B14]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Recently Viewed</h2>
          <div className="text-sm text-[#8C8B80]">{RECENT_PRODUCTS.length} products</div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {RECENT_PRODUCTS.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/products/${p.id}`} className="block bg-white rounded-2xl border border-black/5 overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5">
                <img src={p.img} alt={p.name} className="w-full h-36 object-cover" />
                <div className="p-3">
                  <div className="text-xs text-[#8C8B80] mb-0.5">{p.seller}</div>
                  <div className="text-sm font-medium text-[#1C1B14] line-clamp-2 mb-1">{p.name}</div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#1C1B14]">₹{p.price.toLocaleString()}</span>
                    <span className="text-xs text-[#8C8B80] flex items-center gap-0.5"><Star size={10} className="fill-amber-400 text-amber-400" /> {p.rating}</span>
                  </div>
                  <div className="text-xs text-[#B0AFA5] mt-1 flex items-center gap-1"><Clock size={10} /> {p.time}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </CustomerAccountLayout>
  );
}



export function PurchaseHistoryPage() {
  return (
    <CustomerAccountLayout title="Purchase History">
      <div className="max-w-2xl">
        <h2 className="font-bold text-xl text-[#1C1B14] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Purchase History</h2>

        <div className="space-y-6">
          {PURCHASE_HISTORY.map((group: any) => (
            <div key={group.month}>
              <div className="text-xs font-bold text-[#8C8B80] uppercase tracking-wider mb-3">{group.month}</div>
              <div className="space-y-2">
                {group.orders.map((order: any) => (
                  <Link key={order.id} href={`/orders/${order.id}`}
                    className="flex items-center justify-between p-4 bg-white rounded-xl border border-black/5 hover:border-[#FFD4A8] transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FFF8F0] flex items-center justify-center shrink-0">
                        <ShoppingBag size={14} style={{ color: "#FF7A00" }} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#1C1B14]">{order.item}</div>
                        <div className="text-xs text-[#8C8B80]">{order.date} · #{order.id}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#1C1B14]">₹{order.amount}</span>
                      <ChevronRight size={14} className="text-[#B0AFA5]" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </CustomerAccountLayout>
  );
}

// ─── Spending Summary ────────────────────────────────────────
export function SpendingSummaryPage() {
  const categories = [
    { name: "Textiles", amount: 3897, pct: 62, color: "#FF7A00" },
    { name: "Home Décor", amount: 1149, pct: 18, color: "#1A9E4E" },
    { name: "Jewellery", amount: 629, pct: 10, color: "#7C3AED" },
    { name: "Food & Spices", amount: 299, pct: 5, color: "#2563EB" },
    { name: "Others", amount: 316, pct: 5, color: "#B0AFA5" },
  ];
  const total = categories.reduce((s, c) => s + c.amount, 0);

  return (
    <CustomerAccountLayout title="Spending Summary">
      <div className="max-w-2xl">
        <h2 className="font-bold text-xl text-[#1C1B14] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Spending Summary</h2>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[{ label: "Total Spent", value: `₹${total.toLocaleString()}`, icon: "💰" }, { label: "Orders Placed", value: "12", icon: "📦" }, { label: "Avg Order Value", value: `₹${Math.round(total / 12).toLocaleString()}`, icon: "📊" }].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-black/5 p-4 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="font-black text-lg text-[#1C1B14]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.value}</div>
              <div className="text-xs text-[#8C8B80]">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-black/5 p-5 mb-4">
          <div className="font-semibold text-sm text-[#1C1B14] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Spending by Category</div>
          <div className="space-y-3">
            {categories.map(c => (
              <div key={c.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#555449]">{c.name}</span>
                  <span className="font-semibold text-[#1C1B14]">₹{c.amount} <span className="text-xs text-[#8C8B80] font-normal">({c.pct}%)</span></span>
                </div>
                <div className="h-2 bg-[#F5F4F0] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${c.pct}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full" style={{ background: c.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#FFF8F0] border border-[#FFD4A8] rounded-2xl p-4 flex items-start gap-3">
          <TrendingUp size={18} style={{ color: "#FF7A00" }} className="shrink-0 mt-0.5" />
          <div className="text-sm text-[#555449]">
            You've spent <strong>23% more</strong> this month compared to last month. Textiles remain your top category! 🎉
          </div>
        </div>
      </div>
    </CustomerAccountLayout>
  );
}



export function FavouriteSellersPage() {
  return (
    <CustomerAccountLayout title="Favourite Sellers">
      <div className="max-w-2xl">
        <h2 className="font-bold text-xl text-[#1C1B14] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Favourite Sellers</h2>
        <div className="space-y-3">
          {FAV_SELLERS.map((seller, i) => (
            <motion.div key={seller.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl border border-black/5 p-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#FFF8F0] flex items-center justify-center text-3xl shrink-0">{seller.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[#1C1B14] text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{seller.name}</div>
                  <div className="text-xs text-[#8C8B80] flex items-center gap-1"><MapPin size={10} /> {seller.location}</div>
                  <div className="flex items-center gap-3 mt-1 text-xs">
                    <span className="text-[#8C8B80] flex items-center gap-1"><Star size={10} className="fill-amber-400 text-amber-400" /> {seller.rating}</span>
                    <span className="text-[#8C8B80]">{seller.productsCount} products</span>
                  </div>
                </div>
                <Link href={`/seller/${seller.id}`} className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold border-2 border-[#FF7A00] transition-all" style={{ color: "#FF7A00" }}>
                  Visit
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </CustomerAccountLayout>
  );
}

// ─── Account Security ────────────────────────────────────────
export function AccountSecurityPage() {
  const checks = [
    { label: "Password", status: "strong", icon: "🔐", desc: "Last changed 45 days ago" },
    { label: "Email Verified", status: "ok", icon: "✅", desc: "priya.sharma@gmail.com" },
    { label: "Phone Verified", status: "ok", icon: "✅", desc: "+91 98765 43210" },
    { label: "Two-Factor Auth", status: "off", icon: "⚠️", desc: "Not enabled — we recommend turning this on" },
    { label: "Active Sessions", status: "ok", icon: "📱", desc: "2 devices active" },
  ];

  return (
    <CustomerAccountLayout title="Account Security">
      <div className="max-w-lg">
        <h2 className="font-bold text-xl text-[#1C1B14] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Account Security</h2>

        <div className="bg-[#F0FBF4] border border-green-200 rounded-2xl p-4 mb-5 flex items-start gap-3">
          <Shield size={18} className="text-[#1A9E4E] shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-sm text-[#1A9E4E]">Your account is secure</div>
            <div className="text-xs text-[#555449]">4 out of 5 security checks passed</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 overflow-hidden mb-4">
          {checks.map((c, i) => (
            <div key={c.label} className={`flex items-center justify-between p-4 ${i < checks.length - 1 ? "border-b border-[#F5F4F0]" : ""}`}>
              <div className="flex items-center gap-3">
                <span className="text-lg">{c.icon}</span>
                <div>
                  <div className="text-sm font-medium text-[#1C1B14]">{c.label}</div>
                  <div className="text-xs text-[#8C8B80]">{c.desc}</div>
                </div>
              </div>
              {c.status === "off" && (
                <Link href="/preferences" className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: "#FFF8F0", color: "#FF7A00" }}>Enable</Link>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Link href="/change-password" className="flex items-center justify-between p-4 bg-white rounded-2xl border border-black/5 hover:border-[#FFD4A8] transition-all">
            <span className="text-sm font-medium text-[#1C1B14]">Change Password</span>
            <ChevronRight size={16} className="text-[#B0AFA5]" />
          </Link>
          <Link href="/sessions" className="flex items-center justify-between p-4 bg-white rounded-2xl border border-black/5 hover:border-[#FFD4A8] transition-all">
            <span className="text-sm font-medium text-[#1C1B14]">Manage Active Sessions</span>
            <ChevronRight size={16} className="text-[#B0AFA5]" />
          </Link>
          <Link href="/login-history" className="flex items-center justify-between p-4 bg-white rounded-2xl border border-black/5 hover:border-[#FFD4A8] transition-all">
            <span className="text-sm font-medium text-[#1C1B14]">Login Activity</span>
            <ChevronRight size={16} className="text-[#B0AFA5]" />
          </Link>
        </div>
      </div>
    </CustomerAccountLayout>
  );
}



export function ActiveSessionsPage() {
  const [sessions, setSessions] = useState(SESSIONS);
  const revoke = (id: string) => setSessions(prev => prev.filter(s => s.id === id ? s.isCurrent : true));

  return (
    <CustomerAccountLayout title="Active Sessions">
      <div className="max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-xl text-[#1C1B14]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Active Sessions</h2>
          <button onClick={() => setSessions(prev => prev.filter(s => s.isCurrent))} className="text-sm font-semibold text-red-500 hover:text-red-700">
            Logout All Others
          </button>
        </div>

        <div className="space-y-3">
          {sessions.map((s, i) => (
            <motion.div key={s.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`bg-white rounded-2xl border p-4 ${s.isCurrent ? "border-[#1A9E4E]" : "border-black/5"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F5F4F0] flex items-center justify-center shrink-0 text-xl">
                    {s.device.includes("iPhone") ? "📱" : s.device.includes("Mac") ? "💻" : "🖥️"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-[#1C1B14]">{s.device}</span>
                      {s.isCurrent && <span className="text-xs px-2 py-0.5 rounded-full bg-[#F0FDF4] text-[#1A9E4E] font-medium">Current</span>}
                    </div>
                    <div className="text-xs text-[#8C8B80] flex items-center gap-1 mt-0.5"><MapPin size={10} /> {s.location}</div>
                    <div className="text-xs text-[#B0AFA5] flex items-center gap-1 mt-0.5"><Clock size={10} /> {s.lastActive}</div>
                  </div>
                </div>
                {!s.isCurrent && (
                  <button onClick={() => revoke(s.id)} className="text-xs text-red-500 font-semibold hover:text-red-700 shrink-0 flex items-center gap-1">
                    <LogOut size={12} /> Revoke
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </CustomerAccountLayout>
  );
}



export function LoginHistoryPage() {
  return (
    <CustomerAccountLayout title="Login History">
      <div className="max-w-lg">
        <h2 className="font-bold text-xl text-[#1C1B14] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Login Activity</h2>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 text-sm text-amber-700 flex items-start gap-2">
          <span className="text-lg">⚠️</span>
          <div>There was a <strong>failed login attempt</strong> from Hyderabad on Nov 28. If this wasn't you, <Link href="/change-password" className="underline font-semibold">change your password</Link> immediately.
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
          {LOGIN_HISTORY.map((log: any, i) => (
            <div key={log.id} className={`flex items-center justify-between p-4 ${i < LOGIN_HISTORY.length - 1 ? "border-b border-[#F5F4F0]" : ""}`}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${log.status === "Success" ? "bg-[#F0FDF4]" : "bg-red-50"}`}>
                  {log.status === "Success" ? <Shield size={14} className="text-[#1A9E4E]" /> : <Shield size={14} className="text-red-500" />}
                </div>
                <div>
                  <div className="text-sm font-medium text-[#1C1B14]">{log.device}</div>
                  <div className="text-xs text-[#8C8B80] flex items-center gap-1"><MapPin size={10} /> {log.location}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-[#8C8B80]">{log.date}</div>
                <span className={`text-xs font-semibold ${log.status === "Success" ? "text-[#1A9E4E]" : "text-red-500"}`}>
                  {log.status === "Success" ? "Success" : "Failed"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CustomerAccountLayout>
  );
}
