'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, Package, Check, ChevronDown,
  FileText, RotateCcw, Star, ArrowRight, MoreHorizontal,
} from 'lucide-react';
import { STATUS_CONFIG, type OrderStatus, type MockOrder } from '@/lib/mock/orders';
import { formatCurrency } from '@/lib/utils/format-currency';
import { useOrderStore } from '@/lib/store/order-store';

type FilterTab = 'all' | 'active' | 'delivered' | 'cancelled' | 'returned';

const ACTIVE_STATUSES: OrderStatus[] = ['confirmed','processing','packed','shipped','in_transit','out_for_delivery'];

function OrdersListSkeleton() {
  return (
    <div className="p-4 sm:p-6 space-y-4 animate-pulse">
      <div className="h-8 w-32 rounded skeleton" />
      <div className="h-12 w-full rounded-xl skeleton" />
      <div className="flex gap-2">
        {[0,1,2,3,4].map(i=><div key={i} className="h-9 w-28 rounded-full skeleton"/>)}
      </div>
      {[0,1,2,3].map(i=>(
        <div key={i} className="bg-white rounded-2xl border border-[#E8E4DE] p-4 space-y-3">
          <div className="flex justify-between"><div className="h-5 w-48 rounded skeleton"/><div className="h-6 w-24 rounded-full skeleton"/></div>
          <div className="flex gap-3"><div className="h-16 w-16 rounded-xl skeleton"/><div className="flex-1 space-y-2"><div className="h-4 w-full rounded skeleton"/><div className="h-4 w-2/3 rounded skeleton"/></div></div>
          <div className="flex gap-2"><div className="h-9 w-28 rounded-xl skeleton"/><div className="h-9 w-28 rounded-xl skeleton"/></div>
        </div>
      ))}
    </div>
  );
}

function MiniTimeline({ timeline }: { timeline: { done: boolean; label: string; timestamp: string | null }[] }) {
  return (
    <div className="flex items-center gap-0.5 my-3">
      {timeline.slice(0, 5).map((step, i, arr) => (
        <div key={i} className="flex items-center flex-1">
          <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${step.done ? 'bg-[#FF7A00]' : 'border-2 border-[#E8E4DE]'}`}>
            {step.done && <Check size={8} strokeWidth={3} className="text-white" />}
          </div>
          {i < arr.length - 1 && <div className={`flex-1 h-0.5 ${step.done && arr[i+1].done ? 'bg-[#FF7A00]' : 'bg-[#E8E4DE]'}`} />}
        </div>
      ))}
    </div>
  );
}

function OrderCard({ order, idx }: { order: MockOrder; idx: number }) {
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.confirmed;
  const showItems = expanded ? order.items : order.items.slice(0, 1);
  const extraCount = Math.max(0, order.items.length - 1);

  const isActive = ACTIVE_STATUSES.includes(order.status);
  const isDelivered = order.status === 'delivered';
  const isCancelled = order.status === 'cancelled';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.07 }}
      className="bg-white rounded-2xl border border-[#E8E4DE] overflow-hidden hover:shadow-[0_4px_20px_rgba(255,122,0,0.07)] transition-all"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-[#F5F4F0]">
        <div>
          <p className="text-sm font-bold text-[#1A0A00]">#{order.orderNumber}</p>
          <p className="text-[11px] text-[#8C7B6E]">
            {new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ color: statusCfg.color, background: statusCfg.bg }}>
          {statusCfg.label}
        </span>
      </div>

      {/* Items */}
      <div className="px-4 py-3 space-y-3">
        {showItems.map((item) => (
          <div key={item.productId} className="flex gap-3">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F5F4F0] shrink-0 relative">
              <Image
                src={item.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600'}
                alt={item.name}
                fill
                sizes="64px"
                unoptimized
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#1A0A00] line-clamp-2 leading-snug">{item.name}</p>
              <p className="text-[11px] text-[#8C7B6E] mt-0.5">{item.sellerName}</p>
              <p className="text-xs font-bold text-[#FF7A00] mt-1">{formatCurrency(item.price)} × {item.quantity}</p>
            </div>
          </div>
        ))}

        {extraCount > 0 && !expanded && (
          <button onClick={() => setExpanded(true)} className="text-xs font-semibold text-[#FF7A00] hover:underline cursor-pointer">
            + {extraCount} more item{extraCount > 1 ? 's' : ''}
          </button>
        )}
      </div>

      {/* Timeline (active orders) */}
      {isActive && (
        <div className="px-4">
          <MiniTimeline timeline={order.timeline} />
          <p className="text-[11px] text-[#8C7B6E] pb-2">
            📅 Expected: {new Date(order.expectedDelivery).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#FAFAF8] border-t border-[#F0EDE8]">
        <span className="text-sm font-black text-[#1A0A00]">Total: {formatCurrency(order.total)}</span>
        <div className="flex gap-2">
          {isActive && (
            <Link href={`/orders/${order.id}`} className="h-9 px-3 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-sm active:shadow-none">
              <Package size={13} /> Track
            </Link>
          )}
          {isDelivered && !order.items[0]?.reviewed && (
            <Link href={`/my-reviews`} className="h-9 px-3 rounded-xl bg-[#FEFCE8] text-[#CA8A04] border border-[#FDE68A] text-xs font-bold flex items-center gap-1 cursor-pointer">
              <Star size={13} /> Review
            </Link>
          )}
          <Link href={`/orders/${order.id}`} className="h-9 px-3 rounded-xl bg-white border border-[#E8E4DE] text-[#4A3728] text-xs font-semibold flex items-center gap-1 cursor-pointer hover:border-[#FF7A00]/30 shadow-sm active:shadow-none">
            <FileText size={13} /> Details
          </Link>

          {/* Three-dot menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="h-9 w-9 rounded-xl border border-[#E8E4DE] flex items-center justify-center text-[#8C7B6E] hover:border-[#FF7A00]/30 cursor-pointer shadow-sm active:shadow-none"
              aria-label="Order options"
            >
              <MoreHorizontal size={15} />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 bottom-full mb-1 w-44 bg-white rounded-xl shadow-xl border border-[#E8E4DE] py-1 z-50"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  {[
                    { label: 'View Details',    icon: FileText,   link: `/orders/${order.id}` },
                    ...(isDelivered ? [
                      { label: 'Write Review', icon: Star,       link: '/my-reviews' },
                      { label: 'Return Items', icon: RotateCcw,  link: '/returns' },
                    ] : []),
                    ...(isCancelled ? [
                      { label: 'Reorder',      icon: Package,    link: '/products' },
                    ] : []),
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link key={item.label} href={item.link} className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#4A3728] hover:bg-[#FFF3E8] hover:text-[#FF7A00] transition-colors">
                        <Icon size={13} /> {item.label}
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function OrdersPage() {
  const [filter, setFilter] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');
  const { orders, loading, fetchOrders } = useOrderStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const tabs = [
    { key: 'all',       label: 'All Orders',   count: orders.length },
    { key: 'active',    label: 'Active',        count: orders.filter(o => ACTIVE_STATUSES.includes(o.status)).length },
    { key: 'delivered', label: 'Delivered',     count: orders.filter(o => o.status === 'delivered').length },
    { key: 'cancelled', label: 'Cancelled',     count: orders.filter(o => o.status === 'cancelled').length },
    { key: 'returned',  label: 'Returned',      count: orders.filter(o => ['returned','refunded'].includes(o.status)).length },
  ] as const;

  const filtered = useMemo(() => {
    let list = orders;
    if (filter === 'active')    list = list.filter(o => ACTIVE_STATUSES.includes(o.status));
    if (filter === 'delivered') list = list.filter(o => o.status === 'delivered');
    if (filter === 'cancelled') list = list.filter(o => o.status === 'cancelled');
    if (filter === 'returned')  list = list.filter(o => ['returned','refunded'].includes(o.status));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(o =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.items.some(i => i.name.toLowerCase().includes(q))
      );
    }
    return list;
  }, [orders, filter, search]);

  const totalDelivered = orders.filter(o=>o.status==='delivered').length;
  const totalActive    = orders.filter(o=>ACTIVE_STATUSES.includes(o.status)).length;
  const totalReturns   = orders.filter(o=>['returned','refunded'].includes(o.status)).length;

  if (loading) {
    return <OrdersListSkeleton />;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>My Orders</h1>
        <p className="text-sm text-[#8C7B6E] mt-0.5">Track, manage and review your purchases</p>
        <div className="flex flex-wrap gap-3 mt-3 text-xs font-semibold text-[#4A3728]">
          <span className="flex items-center gap-1.5 bg-white border border-[#E8E4DE] rounded-full px-3 py-1.5">
            <Package size={12} className="text-[#FF7A00]" /> {orders.length} Total
          </span>
          <span className="flex items-center gap-1.5 bg-white border border-[#E8E4DE] rounded-full px-3 py-1.5">
            <Check size={12} className="text-[#16A34A]" /> {totalDelivered} Delivered
          </span>
          <span className="flex items-center gap-1.5 bg-white border border-[#E8E4DE] rounded-full px-3 py-1.5">
            <Package size={12} className="text-[#FF7A00]" /> {totalActive} Active
          </span>
          {totalReturns > 0 && (
            <span className="flex items-center gap-1.5 bg-white border border-[#E8E4DE] rounded-full px-3 py-1.5">
              <RotateCcw size={12} className="text-[#D97706]" /> {totalReturns} Returns
            </span>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B5A99A]" />
        <input
          type="text"
          placeholder="Search by product name or order ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 pl-9 pr-10 rounded-xl border border-[#E8E4DE] text-sm text-[#1A0A00] placeholder-[#B5A99A] outline-none focus:border-[#FF7A00] bg-white transition-colors"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B5A99A] hover:text-[#4A3728] cursor-pointer" aria-label="Clear search">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as FilterTab)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all shrink-0 ${
              filter === tab.key
                ? 'bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white shadow-[0_4px_12px_rgba(255,122,0,0.3)]'
                : 'bg-white border border-[#E8E4DE] text-[#4A3728] hover:border-[#FF7A00]/40 hover:text-[#FF7A00]'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs text-[#8C7B6E]">Showing {filtered.length} order{filtered.length !== 1 ? 's' : ''}</p>

      {/* Orders */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8E4DE] p-12 text-center">
          <Package size={48} className="text-[#E8E4DE] mx-auto mb-4" />
          <p className="text-sm font-bold text-[#4A3728] mb-1">
            {search ? `No orders found for "${search}"` : `No ${filter} orders`}
          </p>
          <p className="text-xs text-[#8C7B6E] mb-4">
            {search ? 'Try a different search term' : 'Orders will appear here once placed'}
          </p>
          {search
            ? <button onClick={() => setSearch('')} className="text-xs font-bold text-[#FF7A00] hover:underline cursor-pointer">Clear Search</button>
            : <Link href="/products" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-sm font-bold shadow-sm active:shadow-none">
                Start Shopping <ArrowRight size={14} />
              </Link>
          }
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order, idx) => (
            <OrderCard key={order.id} order={order} idx={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
