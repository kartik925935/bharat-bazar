'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Package, Star, RotateCcw, Coins,
  ArrowRight, PackagePlus, ClipboardList, Tag, BarChart3,
  ShoppingCart, AlertTriangle, CheckCircle2, Clock, Truck, XCircle
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import { useSellerStore } from '@/lib/store/seller-store';
import { formatCurrency } from '@/lib/utils/format-currency';

type Period = 'today' | '7d' | '30d' | '90d';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function SkeletonCard() {
  return <div className="bg-white rounded-2xl border border-[#F0EDE8] p-5 animate-pulse h-28" />;
}

const ORDER_STATUS_STYLES: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
  confirmed: { label: 'Confirmed', cls: 'bg-blue-50 text-blue-700', icon: <CheckCircle2 size={12} /> },
  processing: { label: 'Processing', cls: 'bg-purple-50 text-purple-700', icon: <Clock size={12} /> },
  in_transit: { label: 'In Transit', cls: 'bg-cyan-50 text-cyan-700', icon: <Truck size={12} /> },
  delivered: { label: 'Delivered', cls: 'bg-emerald-50 text-emerald-700', icon: <CheckCircle2 size={12} /> },
  cancelled: { label: 'Cancelled', cls: 'bg-red-50 text-red-700', icon: <XCircle size={12} /> },
  return_requested: { label: 'Return', cls: 'bg-amber-50 text-amber-700', icon: <RotateCcw size={12} /> },
  paid: { label: 'New', cls: 'bg-orange-50 text-orange-700', icon: <ShoppingCart size={12} /> },
  out_for_delivery: { label: 'Out for Del.', cls: 'bg-teal-50 text-teal-700', icon: <Truck size={12} /> },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const TIER_COLORS: Record<string, string> = {
  bronze: 'from-amber-400 to-amber-600',
  silver: 'from-slate-400 to-slate-500',
  gold: 'from-yellow-400 to-amber-500',
  platinum: 'from-purple-400 to-purple-600',
};

export default function SellerDashboard() {
  const { seller, products, orders, reviews, revenueData, loadSellerData } = useSellerStore();
  const [period, setPeriod] = useState<Period>('30d');
  const [chartMetric, setChartMetric] = useState<'revenue' | 'orders' | 'units'>('revenue');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (seller) {
      loadSellerData(seller.id);
      setTimeout(() => setIsLoading(false), 400);
    }
  }, [seller]);

  const periodDays = { today: 0, '7d': 7, '30d': 30, '90d': 90 };
  const days = periodDays[period];
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - (days || 1));

  const periodOrders = period === 'today'
    ? orders.filter(o => new Date(o.placedAt).toDateString() === new Date().toDateString())
    : orders.filter(o => new Date(o.placedAt) >= cutoff);

  const periodRevenue = periodOrders.reduce((s, o) => s + o.total, 0);
  const deliveredOrders = periodOrders.filter(o => o.status === 'delivered').length;
  const activeOrders = periodOrders.filter(o => !['delivered', 'cancelled', 'returned'].includes(o.status)).length;
  const cancelledOrders = periodOrders.filter(o => o.status === 'cancelled').length;

  const chartData = period === 'today'
    ? revenueData.slice(-1)
    : period === '7d'
    ? revenueData.slice(-7)
    : period === '90d'
    ? revenueData
    : revenueData.slice(-30);

  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold);
  const outOfStockProducts = products.filter(p => p.stock === 0);
  const recentOrders = [...orders].sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime()).slice(0, 5);
  const topProducts = [...products].filter(p => p.totalSold > 0).sort((a, b) => (b.sellingPrice * b.totalSold) - (a.sellingPrice * a.totalSold)).slice(0, 5);
  const unansweredReviews = reviews.filter(r => !r.sellerResponse && r.status === 'approved');

  if (!seller) return null;

  const tier = seller.tier;
  const score = seller.tierScore;
  const nextTierScore = tier === 'bronze' ? 50 : tier === 'silver' ? 70 : tier === 'gold' ? 90 : 100;
  const nextTierName = tier === 'bronze' ? 'Silver' : tier === 'silver' ? 'Gold' : tier === 'gold' ? 'Platinum' : 'Max';

  const PERIODS: { key: Period; label: string }[] = [
    { key: 'today', label: 'Today' },
    { key: '7d', label: '7 Days' },
    { key: '30d', label: '30 Days' },
    { key: '90d', label: '90 Days' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Greeting banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#1A0A00] to-[#3D1800] rounded-2xl p-6 text-white overflow-hidden relative"
      >
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #FF7A00 0%, transparent 60%)' }} />
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {getGreeting()}, {seller.displayName}! 🙏
            </h1>
            <p className="text-sm text-white/70">Here's your shop overview</p>
            {seller.vacationMode && (
              <span className="inline-flex items-center gap-1 mt-2 text-xs bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30">
                🏖️ Vacation Mode is ON
              </span>
            )}
          </div>
          <div className="flex gap-1.5 bg-white/10 rounded-xl p-1 flex-shrink-0">
            {PERIODS.map(p => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${period === p.key ? 'bg-[#FF7A00] text-white shadow-lg' : 'text-white/70 hover:text-white'}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-6 mt-4 text-sm">
          <div><p className="text-white/50 text-xs">Revenue</p><p className="font-black text-[#FF7A00] text-lg">{formatCurrency(periodRevenue)}</p></div>
          <div><p className="text-white/50 text-xs">Orders</p><p className="font-black text-white text-lg">{periodOrders.length}</p></div>
          <div><p className="text-white/50 text-xs">Rating</p><p className="font-black text-white text-lg">⭐ {seller.rating.toFixed(1)}</p></div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? [1,2,3,4].map(i => <SkeletonCard key={i} />) : [
          {
            icon: <Coins size={20} />,
            label: 'Revenue',
            value: formatCurrency(periodRevenue),
            sub: `vs last period`,
            trend: 23,
            href: '/seller-earnings',
            color: 'text-orange-500 bg-orange-50',
          },
          {
            icon: <Package size={20} />,
            label: 'Orders',
            value: String(periodOrders.length),
            sub: `${deliveredOrders} delivered · ${activeOrders} active`,
            trend: 8,
            href: '/seller-orders',
            color: 'text-blue-500 bg-blue-50',
          },
          {
            icon: <Star size={20} />,
            label: 'Rating',
            value: seller.rating.toFixed(1),
            sub: `${seller.totalReviews} reviews · ${seller.responseRate}% response`,
            trend: 0,
            href: '/seller-reviews',
            color: 'text-yellow-500 bg-yellow-50',
          },
          {
            icon: <RotateCcw size={20} />,
            label: 'Return Rate',
            value: `${seller.returnRate}%`,
            sub: `Platform avg: 4.1% · You: great!`,
            trend: -1,
            href: '/seller-returns',
            color: 'text-emerald-500 bg-emerald-50',
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl border border-[#F0EDE8] p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.color}`}>
                {card.icon}
              </div>
              {card.trend !== 0 && (
                <span className={`flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${card.trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {card.trend > 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {Math.abs(card.trend)}%
                </span>
              )}
            </div>
            <p className="text-2xl font-black text-[#1A1A1A] mb-0.5">{card.value}</p>
            <p className="text-xs text-[#9B8F84] mb-3">{card.label}</p>
            <p className="text-[10px] text-[#C4B8AF] leading-tight mb-3">{card.sub}</p>
            <Link href={card.href} className="flex items-center gap-1 text-xs font-bold text-[#FF7A00] hover:gap-2 transition-all">
              View details <ArrowRight size={12} />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Alerts */}
      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0 || unansweredReviews.length > 0) && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {outOfStockProducts.length > 0 && (
            <Link href="/seller-inventory" className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-3 hover:bg-red-100 transition-colors">
              <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
              <div><p className="text-sm font-bold text-red-700">{outOfStockProducts.length} Out of Stock</p><p className="text-xs text-red-500">Update inventory now</p></div>
            </Link>
          )}
          {lowStockProducts.length > 0 && (
            <Link href="/seller-inventory" className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3 hover:bg-amber-100 transition-colors">
              <AlertTriangle size={18} className="text-amber-500 flex-shrink-0" />
              <div><p className="text-sm font-bold text-amber-700">{lowStockProducts.length} Low Stock</p><p className="text-xs text-amber-500">Running out soon</p></div>
            </Link>
          )}
          {unansweredReviews.length > 0 && (
            <Link href="/seller-reviews" className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl p-3 hover:bg-blue-100 transition-colors">
              <Star size={18} className="text-blue-500 flex-shrink-0" />
              <div><p className="text-sm font-bold text-blue-700">{unansweredReviews.length} Reviews to Answer</p><p className="text-xs text-blue-500">Boost your response rate</p></div>
            </Link>
          )}
        </div>
      )}

      {/* Revenue chart */}
      <div className="bg-white rounded-2xl border border-[#F0EDE8] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-black text-[#1A1A1A]">Revenue Trend</h2>
            <p className="text-xs text-[#9B8F84]">{period === 'today' ? 'Today' : `Last ${period === '7d' ? '7' : period === '30d' ? '30' : '90'} days`}</p>
          </div>
          <div className="flex gap-1.5 bg-[#FAFAF8] rounded-xl p-1 border border-[#F0EDE8]">
            {(['revenue', 'orders', 'units'] as const).map(m => (
              <button
                key={m}
                onClick={() => setChartMetric(m)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all capitalize ${chartMetric === m ? 'bg-[#FF7A00] text-white' : 'text-[#9B8F84] hover:text-[#FF7A00]'}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF7A00" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#FF7A00" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F5F0EB" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#C4B8AF' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#C4B8AF' }} axisLine={false} tickLine={false}
              tickFormatter={v => chartMetric === 'revenue' ? `₹${(v/1000).toFixed(0)}k` : String(v)} />
            <Tooltip
              contentStyle={{ background: '#1A1A1A', border: 'none', borderRadius: 12, fontSize: 12, color: '#fff' }}
              formatter={(v: any) => [chartMetric === 'revenue' ? formatCurrency(v as number) : v, chartMetric]}
            />
            <Area type="monotone" dataKey={chartMetric} stroke="#FF7A00" strokeWidth={2} fill="url(#orangeGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Two column */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="bg-white rounded-2xl border border-[#F0EDE8] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-[#1A1A1A]">Recent Orders</h2>
            <Link href="/seller-orders" className="text-xs font-bold text-[#FF7A00] flex items-center gap-1 hover:gap-2 transition-all">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-[#9B8F84] text-center py-6">No orders yet</p>
            ) : recentOrders.map(order => {
              const stl = ORDER_STATUS_STYLES[order.status] || { label: order.status, cls: 'bg-gray-100 text-gray-600', icon: null };
              return (
                <Link key={order.id} href="/seller-orders" className="flex items-center gap-3 hover:bg-[#FAFAF8] rounded-xl p-2 -mx-2 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF7A00]/20 to-[#FF4500]/10 flex items-center justify-center text-[#FF7A00] flex-shrink-0">
                    <ShoppingCart size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#1A1A1A] truncate">{order.orderNumber}</p>
                    <p className="text-xs text-[#9B8F84] truncate">{order.customerName}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-[#1A1A1A]">{formatCurrency(order.total)}</p>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${stl.cls}`}>
                      {stl.icon}{stl.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#C4B8AF] flex-shrink-0 w-12 text-right">{timeAgo(order.placedAt)}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Top products */}
        <div className="bg-white rounded-2xl border border-[#F0EDE8] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-[#1A1A1A]">Top Products</h2>
            <Link href="/seller-products" className="text-xs font-bold text-[#FF7A00] flex items-center gap-1 hover:gap-2 transition-all">
              All products <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-[#9B8F84] mb-3">No sales data yet</p>
                <Link href="/seller-products/add" className="text-sm font-bold text-[#FF7A00] hover:underline">Add your first product →</Link>
              </div>
            ) : topProducts.map((prod, i) => (
              <div key={prod.id} className="flex items-center gap-3">
                <span className="text-[11px] font-black text-[#C4B8AF] w-4 flex-shrink-0">{i + 1}</span>
                <img src={prod.images[0]?.url || 'https://via.placeholder.com/40'} alt={prod.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border border-[#F0EDE8]" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1A1A1A] truncate">{prod.name}</p>
                  <p className="text-xs text-[#9B8F84]">{prod.totalSold} sold</p>
                </div>
                <p className="text-sm font-black text-[#1A1A1A] flex-shrink-0">{formatCurrency(prod.sellingPrice * prod.totalSold)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance score */}
      <div className="bg-white rounded-2xl border border-[#F0EDE8] p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-black text-[#1A1A1A]">Performance Score</h2>
            <p className="text-xs text-[#9B8F84]">{nextTierName !== 'Max' ? `${nextTierScore - score} points to ${nextTierName} tier` : 'Maximum tier achieved!'}</p>
          </div>
          <div className={`text-2xl font-black bg-gradient-to-r ${TIER_COLORS[tier]} bg-clip-text text-transparent`}>{score}/100</div>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Order Completion', value: 100 - seller.cancellationRate, max: 100, weight: 30, format: '%' },
            { label: 'Customer Rating', value: seller.rating, max: 5, weight: 25, format: '/5' },
            { label: 'On-time Dispatch', value: seller.onTimeDispatchRate, max: 100, weight: 20, format: '%' },
            { label: 'Return Rate', value: 100 - seller.returnRate, max: 100, weight: 15, format: '%' },
            { label: 'Response Rate', value: seller.responseRate, max: 100, weight: 10, format: '%' },
          ].map((m, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-[#4A4540]">{m.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[#9B8F84] text-[10px]">weight: {m.weight}%</span>
                  <span className="font-bold text-[#1A1A1A]">{m.format === '/5' ? seller.rating.toFixed(1) : Math.round(m.value)}{m.format}</span>
                </div>
              </div>
              <div className="h-2 bg-[#F5F0EB] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#FF7A00] to-[#FF4500]"
                  initial={{ width: 0 }}
                  animate={{ width: `${(m.value / m.max) * 100}%` }}
                  transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: PackagePlus, label: 'Add Product', sub: 'List a new item', href: '/seller-products/add', color: 'from-[#FF7A00] to-[#FF4500]' },
          { icon: ClipboardList, label: 'Manage Inventory', sub: 'Update stock levels', href: '/seller-inventory', color: 'from-blue-500 to-blue-600' },
          { icon: Tag, label: 'Create Coupon', sub: 'Boost your sales', href: '/seller-coupons', color: 'from-purple-500 to-purple-600' },
          { icon: BarChart3, label: 'View Earnings', sub: 'Check settlements', href: '/seller-earnings', color: 'from-emerald-500 to-emerald-600' },
        ].map((a, i) => (
          <Link
            key={i}
            href={a.href}
            className="bg-white rounded-2xl border border-[#F0EDE8] p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center text-white mb-3 shadow-sm group-hover:scale-110 transition-transform`}>
              <a.icon size={18} />
            </div>
            <p className="text-sm font-bold text-[#1A1A1A]">{a.label}</p>
            <p className="text-xs text-[#9B8F84] mt-0.5">{a.sub}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
