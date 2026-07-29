'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RotateCcw, Package, Clock, CheckCircle2, ChevronRight, ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format-currency';

interface ReturnRequest {
  id: string;
  returnNumber: string;
  orderNumber: string;
  productName: string;
  productImage: string;
  reason: string;
  refundAmount: number;
  status: 'under_review' | 'approved' | 'pickup_scheduled' | 'received' | 'refunded';
  date: string;
  expectedRefundMethod: string;
}

const MOCK_RETURNS: ReturnRequest[] = [
  {
    id: 'ret-1',
    returnNumber: 'RET-2025-001',
    orderNumber: 'BB-2025-71234',
    productName: 'Sambhalpuri Ikat Silk Saree',
    productImage: 'https://images.unsplash.com/photo-1620619767323-b95a89183081?w=300&auto=format&fit=crop',
    reason: 'Color slightly different from photo',
    refundAmount: 3200,
    status: 'under_review',
    date: '2025-01-18',
    expectedRefundMethod: 'UPI (GPay)',
  },
  {
    id: 'ret-2',
    returnNumber: 'RET-2024-089',
    orderNumber: 'BB-2024-65891',
    productName: 'Blue Pottery Decorative Plate',
    productImage: 'https://images.unsplash.com/photo-1536266305399-b367feb671f9?w=300&auto=format&fit=crop',
    reason: 'Damaged during transit',
    refundAmount: 750,
    status: 'refunded',
    date: '2024-12-29',
    expectedRefundMethod: 'Original Payment Method',
  },
];

const STATUS_BADGES = {
  under_review:     { label: 'Under Review', bg: '#FEFCE8', text: '#CA8A04' },
  approved:         { label: 'Approved', bg: '#EFF6FF', text: '#2563EB' },
  pickup_scheduled: { label: 'Pickup Scheduled', bg: '#FFF3E8', text: '#FF7A00' },
  received:         { label: 'Item Received', bg: '#F0F9FF', text: '#0369A1' },
  refunded:         { label: 'Refund Completed', bg: '#F0FDF4', text: '#16A34A' },
};

export default function ReturnsPage() {
  const [tab, setTab] = useState<'all' | 'active' | 'completed'>('all');

  const filtered = MOCK_RETURNS.filter((r) => {
    if (tab === 'active') return ['under_review', 'approved', 'pickup_scheduled', 'received'].includes(r.status);
    if (tab === 'completed') return r.status === 'refunded';
    return true;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>
            ↩️ Returns & Refunds
          </h1>
          <p className="text-sm text-[#8C7B6E] mt-0.5">Manage your return requests and track refund status</p>
        </div>
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-xs font-bold shadow-[0_4px_12px_rgba(255,122,0,0.25)] hover:opacity-95 cursor-pointer w-fit"
        >
          <RotateCcw size={14} /> Request New Return
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#E8E4DE] pb-2">
        {(['all', 'active', 'completed'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
              tab === t ? 'bg-[#FFF3E8] text-[#FF7A00]' : 'text-[#8C7B6E] hover:text-[#1A0A00]'
            }`}
          >
            {t} ({MOCK_RETURNS.filter((r) => (t === 'all' ? true : t === 'active' ? r.status !== 'refunded' : r.status === 'refunded')).length})
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8E4DE] p-12 text-center">
          <RotateCcw size={40} className="text-[#E8E4DE] mx-auto mb-3" />
          <p className="text-sm font-bold text-[#4A3728]">No returns found</p>
          <p className="text-xs text-[#8C7B6E] mt-1 mb-4">We hope you love everything you order!</p>
          <Link href="/orders" className="text-xs font-bold text-[#FF7A00] hover:underline">
            View Delivered Orders →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((ret, idx) => {
            const badge = STATUS_BADGES[ret.status];
            return (
              <motion.div
                key={ret.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="bg-white rounded-2xl border border-[#E8E4DE] p-4 sm:p-5 hover:shadow-[0_4px_20px_rgba(255,122,0,0.06)] transition-all space-y-4"
              >
                {/* Top info */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#F5F4F0]">
                  <div>
                    <span className="text-xs font-bold text-[#1A0A00]">#{ret.returnNumber}</span>
                    <span className="text-xs text-[#8C7B6E] ml-2">Order #{ret.orderNumber}</span>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: badge.bg, color: badge.text }}>
                    {badge.label}
                  </span>
                </div>

                {/* Product */}
                <div className="flex gap-4">
                  <img src={ret.productImage} alt={ret.productName} className="w-16 h-16 rounded-xl object-cover bg-[#F5F4F0] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#1A0A00] truncate">{ret.productName}</p>
                    <p className="text-xs text-[#8C7B6E] mt-0.5">Reason: {ret.reason}</p>
                    <p className="text-xs font-black text-[#FF7A00] mt-1">Refund Amount: {formatCurrency(ret.refundAmount)}</p>
                  </div>
                </div>

                {/* Timeline Progress */}
                <div className="bg-[#FAFAF8] rounded-xl p-3">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[#8C7B6E] mb-2">
                    <span>Requested</span>
                    <span>Pickup</span>
                    <span>Received</span>
                    <span>Refunded</span>
                  </div>
                  <div className="h-1.5 bg-[#E8E4DE] rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-gradient-to-r from-[#FF7A00] to-[#FF4500] rounded-full transition-all duration-500"
                      style={{
                        width:
                          ret.status === 'under_review'
                            ? '25%'
                            : ret.status === 'approved' || ret.status === 'pickup_scheduled'
                            ? '50%'
                            : ret.status === 'received'
                            ? '75%'
                            : '100%',
                      }}
                    />
                  </div>
                </div>

                {/* Bottom info */}
                <div className="flex items-center justify-between text-xs text-[#8C7B6E]">
                  <span>Refund to: <strong className="text-[#4A3728]">{ret.expectedRefundMethod}</strong></span>
                  <Link href={`/orders/${ret.orderNumber}`} className="font-bold text-[#FF7A00] hover:underline flex items-center gap-1">
                    View Order Details <ChevronRight size={12} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* How Returns Work Info Banner */}
      <div className="bg-white rounded-2xl border border-[#E8E4DE] p-6 space-y-4">
        <h3 className="text-sm font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>
          How Bharat Bazaar Returns Work
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-[#FAFAF8] rounded-xl">
            <div className="w-10 h-10 rounded-full bg-[#FFF3E8] text-[#FF7A00] flex items-center justify-center mx-auto mb-2">
              <RotateCcw size={18} />
            </div>
            <p className="text-xs font-bold text-[#1A0A00]">1. Request Return</p>
            <p className="text-[11px] text-[#8C7B6E] mt-0.5">Within 7 days of delivery</p>
          </div>
          <div className="p-3 bg-[#FAFAF8] rounded-xl">
            <div className="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto mb-2">
              <Truck size={18} />
            </div>
            <p className="text-xs font-bold text-[#1A0A00]">2. Free Doorstep Pickup</p>
            <p className="text-[11px] text-[#8C7B6E] mt-0.5">Courier arrives within 48h</p>
          </div>
          <div className="p-3 bg-[#FAFAF8] rounded-xl">
            <div className="w-10 h-10 rounded-full bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center mx-auto mb-2">
              <RefreshCw size={18} />
            </div>
            <p className="text-xs font-bold text-[#1A0A00]">3. Instant Refund</p>
            <p className="text-[11px] text-[#8C7B6E] mt-0.5">Credited to original source</p>
          </div>
        </div>
      </div>
    </div>
  );
}
