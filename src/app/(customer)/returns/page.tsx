'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Truck, RefreshCw, X, ChevronRight, ChevronDown, Package, Check, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/format-currency';
import { toast } from 'sonner';

// ─── Schema ─────────────────────────────────────────────────────────────────
const returnSchema = z.object({
  returnReason: z.string().min(1, 'Please select a return reason'),
  additionalInfo: z
    .string()
    .min(1, 'Please describe the issue')
    .min(30, 'Please provide at least 30 characters describing the issue')
    .max(500, 'Description cannot exceed 500 characters'),
  refundMethod: z.string().min(1, 'Please select preferred refund method'),
  returnPolicyAgreed: z
    .boolean()
    .refine((v) => v === true, 'Please agree to the return policy to proceed'),
});
type ReturnFormData = z.infer<typeof returnSchema>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1.5 text-sm text-red-600 mt-1.5"
      role="alert"
    >
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
      {message}
    </motion.p>
  );
}


const STATUS_BADGES: Record<string, { label: string; bg: string; text: string }> = {
  under_review:     { label: 'Under Review',     bg: '#FEFCE8', text: '#CA8A04' },
  approved:         { label: 'Approved',          bg: '#EFF6FF', text: '#2563EB' },
  pickup_scheduled: { label: 'Pickup Scheduled',  bg: '#FFF3E8', text: '#FF7A00' },
  received:         { label: 'Item Received',     bg: '#F0F9FF', text: '#0369A1' },
  refunded:         { label: 'Refund Completed',  bg: '#F0FDF4', text: '#16A34A' },
};

const RETURN_REASONS = [
  'Wrong item delivered',
  'Item damaged / defective',
  'Color different from photo',
  'Size doesn\'t fit',
  'Quality not as expected',
  'Changed my mind',
  'Duplicate order placed',
  'Other reason',
];

const REFUND_METHODS = [
  'Original Payment Method',
  'UPI (GPay)',
  'Bank Account',
  'Wallet Credits',
];

import { MOCK_RETURNS, DELIVERED_ORDERS, type MockReturn } from '@/lib/mock/customer';

export default function ReturnsPage() {
  const [returns, setReturns] = useState<MockReturn[]>(MOCK_RETURNS);
  const [tab, setTab] = useState<'all' | 'active' | 'completed'>('all');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(DELIVERED_ORDERS[0] || null);

  const form = useForm<ReturnFormData>({
    resolver: zodResolver(returnSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      returnReason: RETURN_REASONS[0],
      additionalInfo: '',
      refundMethod: REFUND_METHODS[0],
      returnPolicyAgreed: false,
    },
  });

  const { register, handleSubmit, watch, reset,
    formState: { errors, touchedFields, isSubmitting, isValid } } = form;

  const watchedInfo = watch('additionalInfo', '');
  const watchedAgreed = watch('returnPolicyAgreed', false);

  const onSubmitReturn = async (data: ReturnFormData) => {
    if (!selectedOrder) { toast.error('Please select an order to return.'); return; }
    await new Promise((r) => setTimeout(r, 1200));
    const newReturn: MockReturn = {
      id: `ret-${Date.now()}`,
      returnNumber: `RET-2025-${Math.floor(Math.random() * 900 + 100)}`,
      orderNumber: selectedOrder.orderNumber,
      productName: selectedOrder.productName,
      productImage: selectedOrder.productImage,
      reason: data.returnReason,
      refundAmount: selectedOrder.price,
      status: 'under_review',
      date: new Date().toISOString().split('T')[0],
      expectedRefundMethod: data.refundMethod,
    };
    setReturns((prev) => [newReturn, ...prev]);
    setShowRequestModal(false);
    reset();
    toast.success("Return request submitted! We'll review it within 24 hours. 📦");
  };


  const filtered = returns.filter((r) => {
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
        <button
          onClick={() => setShowRequestModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-xs font-bold shadow-[0_4px_12px_rgba(255,122,0,0.25)] hover:opacity-95 cursor-pointer w-fit"
        >
          <RotateCcw size={14} /> Request New Return
        </button>
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
            {t} ({returns.filter((r) => t === 'all' ? true : t === 'active' ? r.status !== 'refunded' : r.status === 'refunded').length})
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8E4DE] p-12 text-center">
          <RotateCcw size={40} className="text-[#E8E4DE] mx-auto mb-3" />
          <p className="text-sm font-bold text-[#4A3728]">No returns found</p>
          <p className="text-xs text-[#8C7B6E] mt-1 mb-4">We hope you love everything you order!</p>
          <Link href="/orders" className="text-xs font-bold text-[#FF7A00] hover:underline">View Delivered Orders →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((ret, idx) => {
            const badge = STATUS_BADGES[ret.status];
            const progressWidth = ret.status === 'under_review' ? '25%' : ret.status === 'approved' || ret.status === 'pickup_scheduled' ? '50%' : ret.status === 'received' ? '75%' : '100%';
            return (
              <motion.div
                key={ret.id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}
                className="bg-white rounded-2xl border border-[#E8E4DE] p-4 sm:p-5 hover:shadow-[0_4px_20px_rgba(255,122,0,0.06)] transition-all space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#F5F4F0]">
                  <div>
                    <span className="text-xs font-bold text-[#1A0A00]">#{ret.returnNumber}</span>
                    <span className="text-xs text-[#8C7B6E] ml-2">Order #{ret.orderNumber}</span>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: badge.bg, color: badge.text }}>
                    {badge.label}
                  </span>
                </div>

                <div className="flex gap-4">
                  <img src={ret.productImage} alt={ret.productName} className="w-16 h-16 rounded-xl object-cover bg-[#F5F4F0] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#1A0A00] truncate">{ret.productName}</p>
                    <p className="text-xs text-[#8C7B6E] mt-0.5">Reason: {ret.reason}</p>
                    <p className="text-xs font-black text-[#FF7A00] mt-1">Refund Amount: {formatCurrency(ret.refundAmount)}</p>
                  </div>
                </div>

                <div className="bg-[#FAFAF8] rounded-xl p-3">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[#8C7B6E] mb-2">
                    <span>Requested</span><span>Pickup</span><span>Received</span><span>Refunded</span>
                  </div>
                  <div className="h-1.5 bg-[#E8E4DE] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#FF7A00] to-[#FF4500] rounded-full transition-all duration-500" style={{ width: progressWidth }} />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#8C7B6E]">
                  <span>Refund to: <strong className="text-[#4A3728]">{ret.expectedRefundMethod}</strong></span>
                  <Link href={`/orders/${ret.orderNumber}`} className="font-bold text-[#FF7A00] hover:underline flex items-center gap-1">
                    View Order <ChevronRight size={12} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* How Returns Work */}
      <div className="bg-white rounded-2xl border border-[#E8E4DE] p-6 space-y-4">
        <h3 className="text-sm font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>How Bharat Bazaar Returns Work</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          {[
            { icon: <RotateCcw size={18} />, bg: 'bg-[#FFF3E8] text-[#FF7A00]', title: '1. Request Return', sub: 'Within 7 days of delivery' },
            { icon: <Truck size={18} />, bg: 'bg-[#EFF6FF] text-[#2563EB]', title: '2. Free Doorstep Pickup', sub: 'Courier arrives within 48h' },
            { icon: <RefreshCw size={18} />, bg: 'bg-[#F0FDF4] text-[#16A34A]', title: '3. Instant Refund', sub: 'Credited to original source' },
          ].map((item, i) => (
            <div key={i} className="p-3 bg-[#FAFAF8] rounded-xl">
              <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center mx-auto mb-2`}>{item.icon}</div>
              <p className="text-xs font-bold text-[#1A0A00]">{item.title}</p>
              <p className="text-[11px] text-[#8C7B6E] mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Request Return Modal ───────────────────────────────────────────── */}
      <AnimatePresence>
        {showRequestModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => !submitting && setShowRequestModal(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>Request a Return</h3>
                <button onClick={() => setShowRequestModal(false)} className="text-[#8C7B6E] hover:text-[#1A0A00] cursor-pointer"><X size={20} /></button>
              </div>

              <form onSubmit={handleSubmit(onSubmitReturn)} className="space-y-4 text-xs" noValidate>
                {/* Select Order */}
                <div>
                  <label className="font-bold text-[#8C7B6E] uppercase tracking-wider block mb-2">Select Delivered Order <span className="text-red-500">*</span></label>
                  <div className="space-y-2">
                    {DELIVERED_ORDERS.length === 0 ? (
                      <div className="text-center p-4 border border-dashed border-[#E8E4DE] rounded-xl text-sm text-[#8C7B6E]">
                        You have no delivered orders to return.
                      </div>
                    ) : (
                      DELIVERED_ORDERS.map((order: any) => (
                        <button key={order.orderNumber} type="button" onClick={() => setSelectedOrder(order)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                            selectedOrder?.orderNumber === order.orderNumber ? 'border-[#FF7A00] bg-[#FFFBF7]' : 'border-[#E8E4DE] hover:border-[#FF7A00]/30'
                          }`}>
                          <img src={order.productImage} alt={order.productName} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-[#1A0A00] truncate">{order.productName}</p>
                            <p className="text-[#8C7B6E]">Order #{order.orderNumber} · {order.date}</p>
                            <p className="font-black text-[#FF7A00]">{formatCurrency(order.price)}</p>
                          </div>
                          {selectedOrder?.orderNumber === order.orderNumber && <Check size={16} className="text-[#FF7A00] shrink-0" />}
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label htmlFor="returnReason" className="font-bold text-[#8C7B6E] uppercase tracking-wider block mb-1">Return Reason <span className="text-red-500">*</span></label>
                  <select id="returnReason" {...register('returnReason')}
                    className={`w-full h-12 px-3 rounded-xl border-2 text-base font-semibold text-[#1A0A00] bg-white outline-none transition-all duration-200 focus:ring-4 ${
                      errors.returnReason ? 'border-red-500 focus:ring-red-500/20' : 'border-[#E8E4DE] focus:border-[#FF7A00] focus:ring-[#FF7A00]/20'
                    }`}>
                    {RETURN_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                {/* Additional Info */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="additionalInfo" className="font-bold text-[#8C7B6E] uppercase tracking-wider">Describe the Issue <span className="text-red-500">*</span></label>
                    <span className={`text-[11px] font-semibold ${watchedInfo.length > 450 ? 'text-red-500' : 'text-[#8C7B6E]'}`}>
                      {watchedInfo.length}/500
                    </span>
                  </div>
                  <textarea id="additionalInfo" rows={3} maxLength={500}
                    placeholder="Describe the issue in detail (minimum 30 characters)…"
                    {...register('additionalInfo')}
                    className={`w-full p-3 rounded-xl border-2 text-base outline-none transition-all duration-200 focus:ring-4 resize-none ${
                      errors.additionalInfo
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : touchedFields.additionalInfo && !errors.additionalInfo
                        ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
                        : 'border-[#E8E4DE] focus:border-[#FF7A00] focus:ring-[#FF7A00]/20'
                    }`} />
                  <AnimatePresence mode="wait">
                    {errors.additionalInfo ? <FieldError key="e" message={errors.additionalInfo.message} /> : touchedFields.additionalInfo && !errors.additionalInfo ? (
                      <motion.p key="s" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1.5 text-sm text-green-600 mt-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Looks good!
                      </motion.p>
                    ) : null}
                  </AnimatePresence>
                </div>

                {/* Refund Method */}
                <div>
                  <label htmlFor="refundMethod" className="font-bold text-[#8C7B6E] uppercase tracking-wider block mb-1">Preferred Refund Method <span className="text-red-500">*</span></label>
                  <select id="refundMethod" {...register('refundMethod')}
                    className="w-full h-12 px-3 rounded-xl border-2 border-[#E8E4DE] text-base font-semibold text-[#1A0A00] bg-white outline-none focus:border-[#FF7A00] focus:ring-4 focus:ring-[#FF7A00]/20 transition-all duration-200">
                    {REFUND_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                <div className="bg-[#FFF3E8] rounded-xl p-3 text-[11px] text-[#8C7B6E]">
                  💡 Refund of <strong className="text-[#FF7A00]">{formatCurrency(selectedOrder?.price || 0)}</strong> will be processed within 5–7 business days after item is received.
                </div>

                {/* Return Policy Agreement */}
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input type="checkbox" {...register('returnPolicyAgreed')}
                    className="mt-0.5 w-4 h-4 rounded border-2 border-[#E8E4DE] text-[#FF7A00] focus:ring-[#FF7A00] cursor-pointer shrink-0" />
                  <span className="text-xs font-semibold text-[#4A3728] leading-relaxed">
                    I have read and agree to the <span className="text-[#FF7A00] underline cursor-pointer">Bharat Bazaar Return Policy</span>. I confirm the item is in its original condition with all tags and packaging intact.
                  </span>
                </label>
                <AnimatePresence mode="wait">
                  {errors.returnPolicyAgreed ? <FieldError key="e" message={errors.returnPolicyAgreed.message} /> : null}
                </AnimatePresence>

                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => { setShowRequestModal(false); reset(); }}
                    className="flex-1 h-12 rounded-xl border-2 border-[#E8E4DE] text-sm font-semibold text-[#4A3728] cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" disabled={!isValid || isSubmitting || !selectedOrder}
                    className={`flex-1 h-12 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 active:scale-[0.98] transition-all ${
                      (!isValid || isSubmitting || !selectedOrder) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-95'
                    }`}>
                    {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : 'Submit Return Request'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
