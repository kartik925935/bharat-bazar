'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Users, Search, Download, Eye, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils/format-currency';
import { useSuperAdminStore } from '@/lib/store/super-admin-store';
import { exportToCsv } from '@/lib/utils/export-csv';

const STATUS_COLORS: Record<string, string> = {
  active: 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/30',
  suspended: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30',
  blocked: 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30',
};

const TIER_COLORS: Record<string, string> = {
  Gold: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  Silver: 'text-[#9898B0] bg-[#9898B0]/10 border-[#9898B0]/30',
  Bronze: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
  New: 'text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/30',
};

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { customers, updatePlatformSettings } = useSuperAdminStore();
  // Using local state for UI mutations since we aren't editing customers heavily here,
  // but let's just use local for status updates for now.
  const [localCustomers, setLocalCustomers] = useState(customers);

  const filtered = localCustomers.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleStatusChange = (id: string, newStatus: 'active' | 'suspended' | 'blocked') => {
    setLocalCustomers((prev) => prev.map((c) => c.id === id ? { ...c, status: newStatus } : c));
    toast.success(`Customer status updated to ${newStatus}.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F0F0F8]">Customer Directory</h1>
          <p className="text-xs text-[#9898B0] mt-1">{customers.length} total customers registered on the platform</p>
        </div>
        <button onClick={() => exportToCsv('customers', localCustomers)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF7A00] text-white text-xs font-bold hover:opacity-90 cursor-pointer">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {(['all', 'active', 'suspended', 'blocked'] as const).map((tab) => {
          const count = tab === 'all' ? localCustomers.length : localCustomers.filter((c) => c.status === tab).length;
          return (
            <button key={tab} onClick={() => setStatusFilter(tab)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer border ${statusFilter === tab ? 'bg-[#FF7A00] text-white border-[#FF7A00]' : 'text-[#9898B0] border-[#1E1E2E] hover:border-[#FF7A00]/40 hover:text-[#F0F0F8]'}`}>
              {tab} ({count})
            </button>
          );
        })}
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5C5C78]" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers…"
          className="w-full h-11 pl-10 pr-4 bg-[#111118] border border-[#1E1E2E] rounded-xl text-sm text-[#F0F0F8] outline-none focus:border-[#FF7A00]/50 placeholder-[#5C5C78]" />
      </div>

      <div className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#111118] text-[#5C5C78] uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Tier</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Total Spent</th>
              <th className="px-4 py-3">Last Active</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E1E2E]">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-[#1C1C28] transition-colors">
                <td className="px-4 py-3">
                  <p className="font-bold text-[#F0F0F8]">{c.name}</p>
                  <p className="text-[10px] text-[#5C5C78]">{c.email}</p>
                  <p className="text-[10px] text-[#5C5C78]">{c.phone}</p>
                </td>
                <td className="px-4 py-3 text-[#9898B0]">{c.location}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${TIER_COLORS[c.tier]}`}>{c.tier}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${STATUS_COLORS[c.status]}`}>{c.status}</span>
                </td>
                <td className="px-4 py-3 font-mono font-bold text-[#F0F0F8]">{c.totalOrders}</td>
                <td className="px-4 py-3 font-mono font-bold text-[#FF7A00]">{formatCurrency(c.totalSpent)}</td>
                <td className="px-4 py-3 text-[#9898B0]">{c.lastActive}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Link href={`/super-admin/customers/${c.id}`}>
                      <button className="p-1.5 rounded-lg bg-[#1E1E2E] hover:bg-[#FF7A00]/20 text-[#9898B0] hover:text-[#FF7A00] cursor-pointer" title="View"><Eye size={13} /></button>
                    </Link>
                    {c.status === 'active' && (
                      <button onClick={() => handleStatusChange(c.id, 'suspended')} className="p-1.5 rounded-lg bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 text-[#F59E0B] cursor-pointer" title="Suspend"><ShieldAlert size={13} /></button>
                    )}
                    {c.status !== 'active' && (
                      <button onClick={() => handleStatusChange(c.id, 'active')} className="p-1.5 rounded-lg bg-[#22C55E]/10 hover:bg-[#22C55E]/20 text-[#22C55E] cursor-pointer" title="Restore"><CheckCircle2 size={13} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-12 text-[#5C5C78] text-sm">No customers found.</div>}
      </div>
    </div>
  );
}
