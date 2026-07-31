'use client';

import { useState } from 'react';
import { Search, Download, CheckCircle2, Clock } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format-currency';
import { MOCK_SETTLEMENTS } from '@/lib/mock/super-admin';
import { toast } from 'sonner';

export default function SettlementsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = MOCK_SETTLEMENTS.filter(s => {
    const matchSearch = s.seller.toLowerCase().includes(search.toLowerCase()) || 
      s.shop.toLowerCase().includes(search.toLowerCase()) || 
      s.settlementId.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleProcess = (id: string, shop: string) => {
    toast.success(`Processing settlement for ${shop}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F0F0F8]" style={{ fontFamily: "'Playfair Display', serif" }}>
            💸 Seller Settlements
          </h1>
          <p className="text-xs text-[#9898B0] mt-0.5">Automated batch payout management to vendor bank accounts</p>
        </div>
        <button onClick={() => toast.success('Exported settlements CSV')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF7A00] text-white text-xs font-bold hover:opacity-90 cursor-pointer">
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {(['all', 'completed', 'pending', 'processing', 'failed'] as const).map((tab) => {
          const count = tab === 'all' ? MOCK_SETTLEMENTS.length : MOCK_SETTLEMENTS.filter((s) => s.status === tab).length;
          return (
            <button key={tab} onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer border ${statusFilter === tab ? 'bg-[#FF7A00] text-white border-[#FF7A00]' : 'text-[#9898B0] border-[#1E1E2E] hover:border-[#FF7A00]/40'}`}>
              {tab} ({count})
            </button>
          );
        })}
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5C5C78]" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Seller, Shop, or Settlement ID..."
          className="w-full h-11 pl-10 pr-4 bg-[#111118] border border-[#1E1E2E] rounded-xl text-sm text-[#F0F0F8] outline-none focus:border-[#FF7A00]/50 placeholder-[#5C5C78]" />
      </div>

      <div className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-[#9898B0]">
            <thead className="bg-[#111118] text-[#5C5C78] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Settlement ID</th>
                <th className="px-4 py-3">Seller / Shop</th>
                <th className="px-4 py-3 text-right">Orders</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-right">Comm.</th>
                <th className="px-4 py-3 text-right">Net Payout</th>
                <th className="px-4 py-3">Due / Paid</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E1E2E]">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-[#1C1C28]">
                  <td className="px-4 py-3 font-mono font-bold text-[#F0F0F8]">{s.settlementId}</td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-[#F0F0F8]">{s.seller}</p>
                    <p className="text-[10px] text-[#5C5C78]">{s.shop} ({s.bankAccount})</p>
                  </td>
                  <td className="px-4 py-3 text-right font-mono">{s.orders}</td>
                  <td className="px-4 py-3 text-right font-mono">{formatCurrency(s.amount)}</td>
                  <td className="px-4 py-3 text-right font-mono text-[#22C55E]">{formatCurrency(s.commission)}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-[#FF7A00]">{formatCurrency(s.netPayout)}</td>
                  <td className="px-4 py-3">
                    <p className="text-[#F0F0F8]">{s.paidDate || s.dueDate}</p>
                    <p className="text-[10px] text-[#5C5C78]">{s.paidDate ? 'Paid On' : 'Due By'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      s.status === 'completed' ? 'text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20' : 
                      s.status === 'pending' ? 'text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/20' : 
                      s.status === 'failed' ? 'text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20' : 
                      'text-[#3B82F6] bg-[#3B82F6]/10 border border-[#3B82F6]/20'
                    }`}>{s.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {s.status === 'pending' || s.status === 'failed' ? (
                      <button onClick={() => handleProcess(s.id, s.shop)} className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-[10px] font-bold cursor-pointer hover:opacity-90">
                        Process Now
                      </button>
                    ) : (
                      <span className="text-[10px] text-[#5C5C78]">Done</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-12 text-[#5C5C78] text-sm">No settlements found.</div>}
        </div>
      </div>
    </div>
  );
}
