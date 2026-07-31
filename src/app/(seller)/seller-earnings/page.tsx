'use client';

import { BarChart3, Landmark, ArrowRight, ArrowDownRight, Clock, CheckCircle2 } from 'lucide-react';
import { useSellerStore } from '@/lib/store/seller-store';
import { formatCurrency } from '@/lib/utils/format-currency';

export default function SellerEarningsPage() {
  const { earnings, settlements } = useSellerStore();

  const totalEarned = settlements.filter(s => s.status === 'paid').reduce((acc, s) => acc + s.amount, 0);
  const pendingAmount = earnings.filter(e => e.status === 'eligible').reduce((acc, e) => acc + e.netEarning, 0);
  const upcomingAmount = earnings.filter(e => e.status === 'pending').reduce((acc, e) => acc + e.netEarning, 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#1A1A1A]">Earnings & Settlements</h1>
        <p className="text-sm text-[#9B8F84]">Manage your finances and payouts</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#1A0A00] to-[#3D1800] rounded-2xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2 text-white/70"><Landmark size={18} /> Total Settled</div>
          <p className="text-3xl font-black mb-1">{formatCurrency(totalEarned)}</p>
          <p className="text-xs text-white/50">Amount transferred to bank</p>
        </div>
        <div className="bg-white border border-[#F0EDE8] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2 text-[#9B8F84]"><CheckCircle2 size={18} className="text-emerald-500" /> Available for Next Payout</div>
          <p className="text-3xl font-black text-[#1A1A1A] mb-1">{formatCurrency(pendingAmount)}</p>
          <p className="text-xs text-[#9B8F84]">Eligible for next settlement cycle</p>
        </div>
        <div className="bg-white border border-[#F0EDE8] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2 text-[#9B8F84]"><Clock size={18} className="text-amber-500" /> Pending Clearance</div>
          <p className="text-3xl font-black text-[#1A1A1A] mb-1">{formatCurrency(upcomingAmount)}</p>
          <p className="text-xs text-[#9B8F84]">Awaiting return window completion</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Earnings */}
        <div className="bg-white border border-[#F0EDE8] rounded-2xl p-5">
          <h2 className="text-base font-black text-[#1A1A1A] mb-4">Recent Sales Earnings</h2>
          <div className="space-y-3">
            {earnings.slice(0, 5).map(e => (
              <div key={e.id} className="flex justify-between items-center p-3 rounded-xl hover:bg-[#FAFAF8] transition-colors -mx-3">
                <div>
                  <p className="text-sm font-bold text-[#1A1A1A]">{e.orderNumber}</p>
                  <p className="text-xs text-[#9B8F84] truncate w-48">{e.productName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-emerald-600">+{formatCurrency(e.netEarning)}</p>
                  <span className={`text-[10px] font-bold ${e.status === 'paid' ? 'text-emerald-500' : e.status === 'eligible' ? 'text-blue-500' : 'text-amber-500'}`}>
                    {e.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Settlements */}
        <div className="bg-white border border-[#F0EDE8] rounded-2xl p-5">
          <h2 className="text-base font-black text-[#1A1A1A] mb-4">Bank Settlements</h2>
          <div className="space-y-4">
            {settlements.map(s => (
              <div key={s.id} className="border border-[#F0EDE8] rounded-xl p-4 bg-[#FAFAF8]">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 mb-1">{s.status.toUpperCase()}</span>
                    <p className="text-sm font-bold text-[#1A1A1A]">{s.settlementNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-[#1A1A1A]">{formatCurrency(s.amount)}</p>
                    <p className="text-[10px] text-[#9B8F84]">For {s.ordersCount} orders</p>
                  </div>
                </div>
                <div className="flex justify-between items-end border-t border-[#F0EDE8] pt-2 text-xs">
                  <div>
                    <p className="text-[#9B8F84]">Period: {new Date(s.periodFrom).toLocaleDateString('en-IN')} - {new Date(s.periodTo).toLocaleDateString('en-IN')}</p>
                    {s.utrNumber && <p className="text-[#4A4540] font-mono mt-0.5">UTR: {s.utrNumber}</p>}
                  </div>
                  <p className="font-bold text-[#4A4540]">Paid to: {s.bankAccount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
