'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Download, Search } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format-currency';
import { MOCK_SUPER_ADMIN_TRANSACTIONS } from '@/lib/mock/super-admin';
import { toast } from 'sonner';

export default function TransactionLedgerPage() {
  const [search, setSearch] = useState('');
  
  const filtered = MOCK_SUPER_ADMIN_TRANSACTIONS.filter(t => 
    t.transactionId.toLowerCase().includes(search.toLowerCase()) || 
    t.orderId.toLowerCase().includes(search.toLowerCase()) || 
    t.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/super-admin/payments" className="p-2 rounded-xl bg-[#111118] border border-[#1E1E2E] text-[#9898B0] hover:text-[#F0F0F8]">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-[#F0F0F8]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Platform Transaction Ledger
            </h1>
            <p className="text-xs text-[#9898B0]">Complete audit history of all payment flow entries</p>
          </div>
        </div>
        <button onClick={() => toast.success('Exporting ledger CSV')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF7A00] text-white text-xs font-bold hover:opacity-90 cursor-pointer">
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5C5C78]" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Txn ID, Order ID, or Customer..."
          className="w-full h-11 pl-10 pr-4 bg-[#111118] border border-[#1E1E2E] rounded-xl text-sm text-[#F0F0F8] outline-none focus:border-[#FF7A00]/50 placeholder-[#5C5C78]" />
      </div>

      <div className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl space-y-4 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-[#9898B0]">
            <thead className="bg-[#111118] text-[#5C5C78] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Txn ID / Gateway</th>
                <th className="px-4 py-3">Order ID / Customer</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-right">Comm.</th>
                <th className="px-4 py-3 text-right">Seller Payout</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E1E2E]">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-[#1C1C28]">
                  <td className="px-4 py-3">
                    <p className="font-mono font-bold text-[#F0F0F8]">{t.transactionId}</p>
                    <p className="text-[10px] text-[#5C5C78]">{t.gateway}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[#FF7A00] font-bold font-mono hover:underline cursor-pointer">{t.orderId}</p>
                    <p className="text-[10px] text-[#F0F0F8]">{t.customer}</p>
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-[#F0F0F8]">{formatCurrency(t.amount)}</td>
                  <td className="px-4 py-3 text-right font-mono text-[#22C55E]">{formatCurrency(t.commission)}</td>
                  <td className="px-4 py-3 text-right font-mono text-[#9898B0]">{formatCurrency(t.sellerPayout)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      t.status === 'success' ? 'text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20' : 
                      t.status === 'pending' ? 'text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/20' : 
                      t.status === 'failed' ? 'text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20' : 
                      'text-[#9898B0] bg-[#9898B0]/10 border border-[#9898B0]/20'
                    }`}>{t.status}</span>
                  </td>
                  <td className="px-4 py-3 text-[#5C5C78]">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-12 text-[#5C5C78] text-sm">No transactions found.</div>}
        </div>
      </div>
    </div>
  );
}
