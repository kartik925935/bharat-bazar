'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, AlertCircle, CheckCircle2, Package, XCircle, Search } from 'lucide-react';
import { useSellerStore, SellerReturn } from '@/lib/store/seller-store';
import { formatCurrency } from '@/lib/utils/format-currency';
import { toast } from 'sonner';

const RETURN_STATUS_STYLES: Record<string, { label: string; cls: string }> = {
  requested: { label: 'Requested', cls: 'bg-orange-50 text-orange-700' },
  under_review: { label: 'Under Review', cls: 'bg-amber-50 text-amber-700' },
  approved: { label: 'Approved', cls: 'bg-blue-50 text-blue-700' },
  rejected: { label: 'Rejected', cls: 'bg-red-50 text-red-700' },
  pickup_scheduled: { label: 'Pickup Scheduled', cls: 'bg-purple-50 text-purple-700' },
  picked_up: { label: 'Picked Up', cls: 'bg-indigo-50 text-indigo-700' },
  received: { label: 'Received', cls: 'bg-teal-50 text-teal-700' },
  refunded: { label: 'Refunded', cls: 'bg-emerald-50 text-emerald-700' },
};

export default function SellerReturnsPage() {
  const { returns, updateReturnStatus } = useSellerStore();
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('active');

  const activeReturns = returns.filter(r => !['refunded', 'rejected'].includes(r.status));
  const resolvedReturns = returns.filter(r => ['refunded', 'rejected'].includes(r.status));

  const displayList = filter === 'all' ? returns : filter === 'active' ? activeReturns : resolvedReturns;

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-black text-[#1A1A1A]">Return Requests</h1>
        <p className="text-sm text-[#9B8F84]">{activeReturns.length} active returns requiring action</p>
      </div>

      <div className="flex gap-1.5">
        {(['all', 'active', 'resolved'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
              filter === f ? 'bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white shadow-md' : 'bg-white border border-[#F0EDE8] text-[#4A4540] hover:text-[#FF7A00]'
            }`}
          >
            {f} {f === 'active' && `(${activeReturns.length})`}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {displayList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#F0EDE8] p-12 text-center">
            <RotateCcw size={40} className="text-[#D4C9BF] mx-auto mb-3" />
            <p className="text-base font-bold text-[#1A1A1A]">No returns found</p>
          </div>
        ) : displayList.map(ret => {
          const stl = RETURN_STATUS_STYLES[ret.status];
          return (
            <div key={ret.id} className="bg-white rounded-2xl border border-[#F0EDE8] p-5">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#F0EDE8]">
                <div>
                  <h3 className="text-base font-black text-[#1A1A1A]">{ret.returnNumber}</h3>
                  <p className="text-xs text-[#9B8F84]">Order: {ret.orderId} · {new Date(ret.requestedAt).toLocaleDateString('en-IN')}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-[#1A1A1A]">{formatCurrency(ret.refundAmount)}</p>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${stl.cls}`}>{stl.label}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-[10px] font-black text-[#9B8F84] uppercase tracking-wider mb-2">Customer Issue</p>
                  <div className="bg-[#FFF7ED] border border-orange-100 rounded-xl p-3">
                    <p className="text-sm font-bold text-[#1A1A1A] mb-1">{ret.reason}</p>
                    <p className="text-sm text-[#4A4540]">{ret.description}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#9B8F84] uppercase tracking-wider mb-2">Items to Return</p>
                  <div className="space-y-2">
                    {ret.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between bg-[#FAFAF8] rounded-xl p-2.5">
                        <span className="text-sm font-medium text-[#1A1A1A]">{item.productName}</span>
                        <span className="text-xs font-bold text-[#9B8F84]">Qty: {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {ret.status === 'under_review' && (
                <div className="flex gap-2 justify-end">
                  <button onClick={() => { updateReturnStatus(ret.id, 'rejected'); toast.error('Return rejected'); }} className="px-4 py-2 border border-red-200 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50">Reject</button>
                  <button onClick={() => { updateReturnStatus(ret.id, 'approved'); toast.success('Return approved'); }} className="px-4 py-2 bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white rounded-xl text-sm font-bold">Approve Return</button>
                </div>
              )}
              {ret.status === 'approved' && (
                <div className="flex justify-end">
                  <button onClick={() => { updateReturnStatus(ret.id, 'pickup_scheduled'); toast.success('Pickup scheduled'); }} className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-bold">Schedule Pickup</button>
                </div>
              )}
              {ret.status === 'received' && (
                <div className="flex justify-end">
                  <button onClick={() => { updateReturnStatus(ret.id, 'refunded'); toast.success('Refund initiated'); }} className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-bold">Issue Refund</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
