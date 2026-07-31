'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CreditCard, DollarSign, RefreshCw, CheckCircle2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format-currency';
import { toast } from 'sonner';

export default function PaymentsPage() {
  const handleRefresh = () => {
    toast.success('Gateway statuses updated');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F0F0F8]" style={{ fontFamily: "'Playfair Display', serif" }}>
            💳 Payment Operations Center
          </h1>
          <p className="text-xs text-[#9898B0] mt-0.5">Gateway status, escrow reserves, payout authorization and transaction reconciliation</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleRefresh} className="px-4 py-2.5 rounded-xl bg-[#111118] border border-[#1E1E2E] text-[#9898B0] hover:text-[#F0F0F8] text-xs font-bold cursor-pointer">
            <RefreshCw size={14} className="inline mr-2" /> Refresh
          </button>
          <Link
            href="/super-admin/payments/transactions"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-xs font-bold shadow-lg"
          >
            View Full Transaction Ledger →
          </Link>
        </div>
      </div>

      {/* Gateway Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#16161F] border border-[#1E1E2E] p-5 rounded-2xl">
          <p className="text-[10px] font-bold uppercase text-[#9898B0]">Razorpay Primary Gateway</p>
          <p className="text-2xl font-black font-mono text-[#22C55E] mt-1">98.4%</p>
          <p className="text-[10px] text-[#22C55E] mt-0.5 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse"></span> Operational (124ms)</p>
        </div>
        <div className="bg-[#16161F] border border-[#1E1E2E] p-5 rounded-2xl">
          <p className="text-[10px] font-bold uppercase text-[#9898B0]">UPI (NPCI) Network</p>
          <p className="text-2xl font-black font-mono text-[#22C55E] mt-1">99.1%</p>
          <p className="text-[10px] text-[#22C55E] mt-0.5 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse"></span> Standby Healthy</p>
        </div>
        <div className="bg-[#16161F] border border-[#1E1E2E] p-5 rounded-2xl">
          <p className="text-[10px] font-bold uppercase text-[#9898B0]">Escrow Reserves</p>
          <p className="text-2xl font-black font-mono text-[#FF7A00] mt-1">{formatCurrency(4580000)}</p>
          <p className="text-[10px] text-[#9898B0] mt-0.5">Safe holding until delivery</p>
        </div>
      </div>

      <div className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 py-12">
         <CreditCard size={48} className="text-[#5C5C78]" />
         <div>
            <h3 className="text-lg font-black text-[#F0F0F8]">Payment Infrastructure Healthy</h3>
            <p className="text-xs text-[#9898B0] mt-1 max-w-md">All payment gateways are routing traffic properly. For individual transaction troubleshooting or refunds, please consult the transaction ledger.</p>
         </div>
         <Link href="/super-admin/payments/transactions">
          <button className="mt-2 px-6 py-2 rounded-xl bg-[#111118] border border-[#1E1E2E] text-xs font-bold text-[#F0F0F8] hover:border-[#FF7A00]/50 transition-colors">Open Ledger</button>
         </Link>
      </div>
    </div>
  );
}
