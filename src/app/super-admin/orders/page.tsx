'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Download, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils/format-currency';
import { useSuperAdminStore } from '@/lib/store/super-admin-store';
import { exportToCsv } from '@/lib/utils/export-csv';

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30',
  processing: 'text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/30',
  shipped: 'text-[#A855F7] bg-[#A855F7]/10 border-[#A855F7]/30',
  delivered: 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/30',
  cancelled: 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30',
  refunded: 'text-[#9898B0] bg-[#9898B0]/10 border-[#9898B0]/30',
};

const PAYMENT_COLORS: Record<string, string> = {
  paid: 'text-[#22C55E]',
  pending: 'text-[#F59E0B]',
  failed: 'text-[#EF4444]',
  refunded: 'text-[#9898B0]',
};

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { orders } = useSuperAdminStore();
  
  const filtered = orders.filter((o) => {
    const matchSearch = o.orderNo.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.seller.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F0F0F8]">Orders Control</h1>
          <p className="text-xs text-[#9898B0] mt-1">{orders.length} orders across all sellers</p>
        </div>
        <button onClick={() => exportToCsv('orders', orders)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF7A00] text-white text-xs font-bold hover:opacity-90 cursor-pointer">
          <Download size={14} /> Export
        </button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {(['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map((tab) => {
          const count = tab === 'all' ? orders.length : orders.filter((o) => o.status === tab).length;
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
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by order no, customer, or seller…"
          className="w-full h-11 pl-10 pr-4 bg-[#111118] border border-[#1E1E2E] rounded-xl text-sm text-[#F0F0F8] outline-none focus:border-[#FF7A00]/50 placeholder-[#5C5C78]" />
      </div>

      <div className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#111118] text-[#5C5C78] uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-4 py-3">Order No</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Seller</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Commission</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E1E2E]">
            {filtered.map((o) => (
              <tr key={o.id} className="hover:bg-[#1C1C28] transition-colors">
                <td className="px-4 py-3 font-mono text-[#FF7A00] font-bold">{o.orderNo}</td>
                <td className="px-4 py-3 text-[#F0F0F8] font-bold">{o.customer}</td>
                <td className="px-4 py-3 text-[#9898B0]">{o.seller}</td>
                <td className="px-4 py-3 text-[#9898B0]">{o.category}</td>
                <td className="px-4 py-3 font-mono font-bold text-[#F0F0F8]">{formatCurrency(o.amount)}</td>
                <td className="px-4 py-3 font-mono text-[#22C55E]">{formatCurrency(o.commission)}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${STATUS_COLORS[o.status]}`}>{o.status}</span></td>
                <td className="px-4 py-3"><span className={`capitalize font-bold ${PAYMENT_COLORS[o.paymentStatus]}`}>{o.paymentStatus}</span></td>
                <td className="px-4 py-3 text-[#9898B0]">{o.date}</td>
                <td className="px-4 py-3">
                  <Link href={`/super-admin/orders/${o.id}`}>
                    <button className="p-1.5 rounded-lg bg-[#1E1E2E] hover:bg-[#FF7A00]/20 text-[#9898B0] hover:text-[#FF7A00] cursor-pointer"><Eye size={13} /></button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-12 text-[#5C5C78] text-sm">No orders found.</div>}
      </div>
    </div>
  );
}
