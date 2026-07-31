'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  DollarSign, Package, Users, UserPlus, Landmark, AlertTriangle,
  RefreshCw, TrendingUp, Server
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format-currency';
import { toast } from 'sonner';
import {
  MOCK_GMV_TREND,
  MOCK_ORDER_DISTRIBUTION,
  MOCK_CATEGORY_BREAKDOWN,
  MOCK_TOP_SELLERS_DASHBOARD,
  MOCK_PENDING_QUEUE,
  MOCK_RECENT_ACTIVITY,
  MOCK_SYSTEM_HEALTH,
  MOCK_KPI_CARDS,
  MOCK_LIVE_TICKER,
  MOCK_CHART_QUICK_STATS,
} from '@/lib/mock/super-admin';

export default function SuperAdminDashboard() {
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [range, setRange]           = useState<'today' | '7d' | '30d' | '90d' | '1y'>('today');
  const [chartType, setChartType]   = useState<'area' | 'bar'>('area');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast.success('Platform metrics updated in real-time');
    }, 600);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 sa-skeleton rounded-xl" />
        <div className="h-12 w-full sa-skeleton rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-36 sa-skeleton rounded-2xl" />
          ))}
        </div>
        <div className="h-96 w-full sa-skeleton rounded-2xl" />
      </div>
    );
  }

  const totalOrders = MOCK_ORDER_DISTRIBUTION.reduce((s, i) => s + i.value, 0);

  return (
    <div className="space-y-6">
      {/* ─── HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-[#F0F0F8]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Platform Dashboard
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF7A00] bg-[#FF7A00]/10 border border-[#FF7A00]/30 px-2.5 py-0.5 rounded-full">
              Command Center
            </span>
          </div>
          <p className="text-xs text-[#9898B0] mt-1 flex items-center gap-2">
            <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>•</span>
            <span>Last updated: just now</span>
            <button
              onClick={handleRefresh}
              className={`text-[#FF7A00] hover:rotate-180 transition-transform duration-500 cursor-pointer ${refreshing ? 'animate-spin' : ''}`}
            >
              <RefreshCw size={13} />
            </button>
          </p>
        </div>

        {/* Date Range Picker */}
        <div className="flex items-center gap-1 bg-[#111118] border border-[#1E1E2E] p-1 rounded-xl">
          {(['today', '7d', '30d', '90d', '1y'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                range === r ? 'bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white shadow-md' : 'text-[#9898B0] hover:text-[#F0F0F8]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* ─── LIVE METRICS TICKER ─── */}
      <div className="overflow-hidden bg-[#111118] border border-[#1E1E2E] rounded-2xl py-3 px-4 flex items-center gap-6 text-xs whitespace-nowrap">
        <div className="flex items-center gap-2 text-[#22C55E] font-bold shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-sa-pulse" />
          <span>🟢 LIVE PLATFORM FEED</span>
        </div>
        <div className="h-4 w-[1px] bg-[#1E1E2E]" />
        <div className="flex items-center gap-6 animate-marquee text-[#9898B0]">
          <span>Orders/hr: <strong className="text-[#F0F0F8] font-mono">{MOCK_LIVE_TICKER.ordersPerHour}</strong></span>
          <span>•</span>
          <span>GMV Today: <strong className="text-[#FF7A00] font-mono">{formatCurrency(MOCK_LIVE_TICKER.gmvToday)}</strong></span>
          <span>•</span>
          <span>Active Sessions: <strong className="text-[#F0F0F8] font-mono">{MOCK_LIVE_TICKER.activeSessions.toLocaleString()}</strong></span>
          <span>•</span>
          <span>Conversion Rate: <strong className="text-[#22C55E] font-mono">{MOCK_LIVE_TICKER.conversionRate}%</strong></span>
          <span>•</span>
          <span>Avg Order Value: <strong className="text-[#F0F0F8] font-mono">{formatCurrency(MOCK_LIVE_TICKER.avgOrderValue)}</strong></span>
          <span>•</span>
          <span>New Sellers Today: <strong className="text-[#F0F0F8] font-mono">{MOCK_LIVE_TICKER.newSellersToday}</strong></span>
          <span>•</span>
          <span>Pending Approvals: <strong className="text-[#F59E0B] font-mono">{MOCK_LIVE_TICKER.pendingApprovals}</strong></span>
        </div>
      </div>

      {/* ─── KPI CARDS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* GMV */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[#16161F] border border-[#1E1E2E] border-t-4 border-t-[#FF7A00] rounded-2xl p-5 hover:border-[#FF7A00]/40 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF7A00]/10 border border-[#FF7A00]/20 flex items-center justify-center text-[#FF7A00]">
              <DollarSign size={20} />
            </div>
            <span className="text-xs font-bold text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-2 py-0.5 rounded-full flex items-center gap-1">
              <TrendingUp size={12} /> +{MOCK_KPI_CARDS.gmv.growth}%
            </span>
          </div>
          <p className="text-xs font-bold text-[#9898B0] uppercase tracking-wider">Gross Merchandise Value</p>
          <h2 className="text-2xl font-black font-mono text-[#F0F0F8] mt-1">{formatCurrency(MOCK_KPI_CARDS.gmv.value)}</h2>
          <div className="mt-3 pt-3 border-t border-[#1E1E2E]">
            <div className="flex justify-between text-[11px] text-[#9898B0] mb-1">
              <span>Target ({MOCK_KPI_CARDS.gmv.targetLabel})</span>
              <span className="font-bold text-[#FF7A00]">{Math.round((MOCK_KPI_CARDS.gmv.value / MOCK_KPI_CARDS.gmv.target) * 100)}%</span>
            </div>
            <div className="h-1.5 bg-[#111118] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#FF7A00] to-[#FF4500] rounded-full"
                style={{ width: `${Math.min((MOCK_KPI_CARDS.gmv.value / MOCK_KPI_CARDS.gmv.target) * 100, 100)}%` }} />
            </div>
          </div>
        </motion.div>

        {/* Orders */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-[#16161F] border border-[#1E1E2E] border-t-4 border-t-[#3B82F6] rounded-2xl p-5 hover:border-[#3B82F6]/40 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center text-[#3B82F6]">
              <Package size={20} />
            </div>
            <span className="text-xs font-bold text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-2 py-0.5 rounded-full flex items-center gap-1">
              <TrendingUp size={12} /> +{MOCK_KPI_CARDS.orders.growth}%
            </span>
          </div>
          <p className="text-xs font-bold text-[#9898B0] uppercase tracking-wider">Platform Orders Today</p>
          <h2 className="text-2xl font-black font-mono text-[#F0F0F8] mt-1">{MOCK_KPI_CARDS.orders.total}</h2>
          <p className="text-[11px] text-[#9898B0] mt-3 pt-3 border-t border-[#1E1E2E]">
            Active: <strong className="text-[#3B82F6]">{MOCK_KPI_CARDS.orders.active}</strong> • Completed: <strong className="text-[#22C55E]">{MOCK_KPI_CARDS.orders.completed}</strong> • Cancelled: <strong className="text-[#EF4444]">{MOCK_KPI_CARDS.orders.cancelled} ({((MOCK_KPI_CARDS.orders.cancelled / MOCK_KPI_CARDS.orders.total) * 100).toFixed(1)}%)</strong>
          </p>
        </motion.div>

        {/* Active Users */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-[#16161F] border border-[#1E1E2E] border-t-4 border-t-[#22C55E] rounded-2xl p-5 hover:border-[#22C55E]/40 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center text-[#22C55E]">
              <Users size={20} />
            </div>
            <span className="text-xs font-bold text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
              🔴 LIVE
            </span>
          </div>
          <p className="text-xs font-bold text-[#9898B0] uppercase tracking-wider">Active Users Right Now</p>
          <h2 className="text-2xl font-black font-mono text-[#F0F0F8] mt-1">{MOCK_KPI_CARDS.activeUsers.total.toLocaleString()}</h2>
          <p className="text-[11px] text-[#9898B0] mt-3 pt-3 border-t border-[#1E1E2E]">
            Customers: <strong className="text-[#F0F0F8]">{MOCK_KPI_CARDS.activeUsers.customers.toLocaleString()}</strong> • Sellers: <strong className="text-[#F0F0F8]">{MOCK_KPI_CARDS.activeUsers.sellers}</strong> • Peak: {MOCK_KPI_CARDS.activeUsers.peak.toLocaleString()}
          </p>
        </motion.div>

        {/* New Registrations */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-[#16161F] border border-[#1E1E2E] border-t-4 border-t-[#A855F7] rounded-2xl p-5 hover:border-[#A855F7]/40 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#A855F7]/10 border border-[#A855F7]/20 flex items-center justify-center text-[#A855F7]">
              <UserPlus size={20} />
            </div>
            <span className="text-xs font-bold text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-2 py-0.5 rounded-full flex items-center gap-1">
              <TrendingUp size={12} /> +{MOCK_KPI_CARDS.newRegistrations.growth}%
            </span>
          </div>
          <p className="text-xs font-bold text-[#9898B0] uppercase tracking-wider">New Registrations</p>
          <h2 className="text-2xl font-black font-mono text-[#F0F0F8] mt-1">{MOCK_KPI_CARDS.newRegistrations.total}</h2>
          <p className="text-[11px] text-[#9898B0] mt-3 pt-3 border-t border-[#1E1E2E]">
            Customers: <strong className="text-[#F0F0F8]">{MOCK_KPI_CARDS.newRegistrations.customers}</strong> • Sellers: <strong className="text-[#A855F7]">{MOCK_KPI_CARDS.newRegistrations.sellers}</strong>
          </p>
        </motion.div>

        {/* Commission */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-[#16161F] border border-[#1E1E2E] border-t-4 border-t-[#F59E0B] rounded-2xl p-5 hover:border-[#F59E0B]/40 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center text-[#F59E0B]">
              <Landmark size={20} />
            </div>
            <span className="text-xs font-bold text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-2 py-0.5 rounded-full flex items-center gap-1">
              <TrendingUp size={12} /> +{MOCK_KPI_CARDS.commissionRevenue.growth}%
            </span>
          </div>
          <p className="text-xs font-bold text-[#9898B0] uppercase tracking-wider">Commission Revenue</p>
          <h2 className="text-2xl font-black font-mono text-[#F0F0F8] mt-1">{formatCurrency(MOCK_KPI_CARDS.commissionRevenue.value)}</h2>
          <p className="text-[11px] text-[#9898B0] mt-3 pt-3 border-t border-[#1E1E2E]">
            Avg Fee: <strong className="text-[#F59E0B]">{MOCK_KPI_CARDS.commissionRevenue.avgFeePercent}%</strong> • Month Total: {formatCurrency(MOCK_KPI_CARDS.commissionRevenue.monthTotal)}
          </p>
        </motion.div>

        {/* Pending Actions */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-[#16161F] border border-[#1E1E2E] border-t-4 border-t-[#EF4444] rounded-2xl p-5 hover:border-[#EF4444]/40 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center text-[#EF4444]">
              <AlertTriangle size={20} />
            </div>
            <span className="text-xs font-bold text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 px-2 py-0.5 rounded-full animate-pulse">
              URGENT
            </span>
          </div>
          <p className="text-xs font-bold text-[#9898B0] uppercase tracking-wider">Pending Action Items</p>
          <h2 className="text-2xl font-black font-mono text-[#EF4444] mt-1">{MOCK_KPI_CARDS.pendingActions.total}</h2>
          <p className="text-[11px] text-[#9898B0] mt-3 pt-3 border-t border-[#1E1E2E]">
            KYC: <strong className="text-[#F59E0B]">{MOCK_KPI_CARDS.pendingActions.kyc}</strong> • Products: <strong className="text-[#F59E0B]">{MOCK_KPI_CARDS.pendingActions.products}</strong> • Complaints: <strong className="text-[#EF4444]">{MOCK_KPI_CARDS.pendingActions.complaints}</strong>
          </p>
        </motion.div>
      </div>

      {/* ─── MAIN ANALYTICS ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#16161F] border border-[#1E1E2E] rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#1E1E2E]">
            <div>
              <h3 className="text-base font-black text-[#F0F0F8]" style={{ fontFamily: "'Playfair Display', serif" }}>Revenue Intelligence Timeline</h3>
              <p className="text-xs text-[#9898B0]">Comparing Today vs Yesterday GMV progression</p>
            </div>
            <button
              onClick={() => setChartType(chartType === 'area' ? 'bar' : 'area')}
              className="px-3 py-1.5 rounded-xl bg-[#111118] border border-[#1E1E2E] text-xs font-bold text-[#9898B0] hover:text-[#F0F0F8] transition-colors cursor-pointer"
            >
              Type: {chartType.toUpperCase()}
            </button>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'area' ? (
                <AreaChart data={MOCK_GMV_TREND}>
                  <defs>
                    <linearGradient id="gmvGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF7A00" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#FF7A00" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
                  <XAxis dataKey="time" stroke="#5C5C78" fontSize={11} />
                  <YAxis stroke="#5C5C78" fontSize={11} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ backgroundColor: '#111118', borderColor: '#1E1E2E', borderRadius: '12px', color: '#F0F0F8' }} formatter={(v: any) => [formatCurrency(Number(v)), 'GMV']} />
                  <Area type="monotone" dataKey="current" stroke="#FF7A00" strokeWidth={3} fillOpacity={1} fill="url(#gmvGrad)" />
                  <Area type="monotone" dataKey="previous" stroke="#5C5C78" strokeWidth={2} strokeDasharray="4 4" fill="none" />
                </AreaChart>
              ) : (
                <BarChart data={MOCK_GMV_TREND}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
                  <XAxis dataKey="time" stroke="#5C5C78" fontSize={11} />
                  <YAxis stroke="#5C5C78" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#111118', borderColor: '#1E1E2E', borderRadius: '12px' }} />
                  <Bar dataKey="current" fill="#FF7A00" radius={[6, 6, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center text-xs">
            {[
              { label: 'Total Volume', value: MOCK_CHART_QUICK_STATS.totalVolume, color: 'text-[#FF7A00]' },
              { label: 'Total Orders', value: MOCK_CHART_QUICK_STATS.totalOrders, color: 'text-[#F0F0F8]' },
              { label: 'Avg Order Value', value: MOCK_CHART_QUICK_STATS.avgOrderValue, color: 'text-[#F0F0F8]' },
              { label: 'Peak Hour Rate', value: MOCK_CHART_QUICK_STATS.peakHourRate, color: 'text-[#22C55E]' },
            ].map((s) => (
              <div key={s.label} className="bg-[#111118] p-2.5 rounded-xl border border-[#1E1E2E]">
                <p className="text-[#5C5C78]">{s.label}</p>
                <p className={`font-bold mt-0.5 ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Distribution Donut */}
        <div className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-black text-[#F0F0F8]" style={{ fontFamily: "'Playfair Display', serif" }}>Order Distribution</h3>
            <p className="text-xs text-[#9898B0]">Status breakdown for {totalOrders} orders today</p>
          </div>
          <div className="h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={MOCK_ORDER_DISTRIBUTION} innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value">
                  {MOCK_ORDER_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#111118', borderColor: '#1E1E2E', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <p className="text-2xl font-black text-[#F0F0F8]">{totalOrders}</p>
              <p className="text-[10px] uppercase font-bold text-[#5C5C78]">Total Orders</p>
            </div>
          </div>
          <div className="space-y-2 pt-2 border-t border-[#1E1E2E]">
            {MOCK_ORDER_DISTRIBUTION.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[#9898B0]">{item.name}</span>
                </div>
                <span className="font-bold text-[#F0F0F8]">{item.value} ({((item.value / totalOrders) * 100).toFixed(0)}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── OPERATIONS MONITORING ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Queue */}
        <div className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E1E2E]">
            <h3 className="text-sm font-black text-[#F0F0F8]" style={{ fontFamily: "'Playfair Display', serif" }}>⏳ Pending Approval Queue</h3>
            <Link href="/super-admin/sellers" className="text-[11px] font-bold text-[#FF7A00] hover:underline">View All →</Link>
          </div>
          <div className="space-y-3">
            {MOCK_PENDING_QUEUE.map((item) => (
              <div key={item.id} className="bg-[#111118] p-3 rounded-xl border border-[#1E1E2E] flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-[#F0F0F8]">{item.name}</p>
                  <p className="text-[10px] text-[#9898B0]">{item.type} • {item.location}</p>
                  <p className={`text-[9px] font-bold mt-1 ${item.status === 'urgent' ? 'text-[#EF4444]' : 'text-[#F59E0B]'}`}>
                    Waiting: {item.waitDays} days {item.status === 'urgent' && '🔴 URGENT'}
                  </p>
                </div>
                <button
                  onClick={() => toast.success(`Approved ${item.name}!`)}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-[11px] font-bold cursor-pointer hover:opacity-90 shrink-0"
                >
                  Approve
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Category Revenue */}
        <div className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-black text-[#F0F0F8]" style={{ fontFamily: "'Playfair Display', serif" }}>🎨 Revenue Breakdown by Category</h3>
          <div className="space-y-3">
            {MOCK_CATEGORY_BREAKDOWN.map((cat) => (
              <div key={cat.category} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#9898B0]">{cat.category}</span>
                  <span className="font-bold text-[#F0F0F8]">{formatCurrency(cat.revenue)} ({cat.pct}%)</span>
                </div>
                <div className="h-2 bg-[#111118] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FF7A00] to-[#FF4500] rounded-full" style={{ width: `${cat.pct * 3}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Activity */}
        <div className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E1E2E]">
            <h3 className="text-sm font-black text-[#F0F0F8]" style={{ fontFamily: "'Playfair Display', serif" }}>⚡ Live Platform Activity</h3>
            <span className="text-[10px] text-[#22C55E] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" /> Real-time
            </span>
          </div>
          <div className="space-y-3">
            {MOCK_RECENT_ACTIVITY.map((act) => (
              <div key={act.id} className="text-xs flex items-start gap-2.5 pb-2 border-b border-[#1E1E2E] last:border-0">
                <span className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ backgroundColor: act.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[#F0F0F8] font-medium truncate">
                    <strong style={{ color: act.color }}>{act.action}</strong> {act.target}
                  </p>
                  <p className="text-[10px] text-[#5C5C78] mt-0.5">{act.actor} • {act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── TOP SELLERS LEADERBOARD ─── */}
      <div className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E1E2E]">
          <h3 className="text-base font-black text-[#F0F0F8]" style={{ fontFamily: "'Playfair Display', serif" }}>🏆 Top Performing Sellers This Month</h3>
          <Link href="/super-admin/sellers" className="text-xs font-bold text-[#FF7A00] hover:underline">View All Sellers →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-[#9898B0]">
            <thead className="bg-[#111118] text-[#5C5C78] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Rank</th>
                <th className="px-4 py-3">Seller Name</th>
                <th className="px-4 py-3">Tier</th>
                <th className="px-4 py-3">Orders</th>
                <th className="px-4 py-3">Monthly GMV</th>
                <th className="px-4 py-3 rounded-r-xl">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E1E2E]">
              {MOCK_TOP_SELLERS_DASHBOARD.map((s) => (
                <tr key={s.rank} className="hover:bg-[#1C1C28] transition-colors">
                  <td className="px-4 py-3 font-bold text-sm">{s.badge}</td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-[#F0F0F8]">{s.name}</p>
                    <p className="text-[10px] text-[#5C5C78]">{s.shop}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4A017]/10 text-amber-400 border border-[#D4A017]/30">💎 {s.tier}</span>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-[#F0F0F8]">{s.orders}</td>
                  <td className="px-4 py-3 font-mono font-bold text-[#FF7A00]">{formatCurrency(s.revenue)}</td>
                  <td className="px-4 py-3 font-bold text-amber-400">★ {s.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── SYSTEM HEALTH ─── */}
      <div className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E1E2E]">
          <div className="flex items-center gap-2">
            <Server size={18} className="text-[#22C55E]" />
            <h3 className="text-base font-black text-[#F0F0F8]" style={{ fontFamily: "'Playfair Display', serif" }}>System Health Monitor</h3>
          </div>
          <span className="text-xs font-bold text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-3 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" /> All Systems Operational
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {MOCK_SYSTEM_HEALTH.map((sys) => (
            <div key={sys.name} className="bg-[#111118] p-3 rounded-xl border border-[#1E1E2E] text-center space-y-1">
              <span className={`inline-block w-2 h-2 rounded-full mb-1 ${sys.ok ? 'bg-[#22C55E]' : 'bg-[#EF4444]'}`} />
              <p className="text-[11px] font-bold text-[#F0F0F8] truncate">{sys.name}</p>
              <p className="text-xs font-mono font-bold text-[#FF7A00]">{sys.metric}</p>
              <p className="text-[9px] text-[#5C5C78]">{sys.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
