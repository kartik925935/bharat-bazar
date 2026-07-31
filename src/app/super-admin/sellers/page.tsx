'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Store, Search, Download, CheckCircle2, XCircle, Clock, ShieldAlert, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils/format-currency';
import { MOCK_SELLERS } from '@/lib/mock/super-admin';

const STATUS_COLORS: Record<string, string> = {
  active: 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/30',
  pending: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30',
  suspended: 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30',
  rejected: 'text-[#9898B0] bg-[#1E1E2E] border-[#1E1E2E]',
};

const TIER_COLORS: Record<string, string> = {
  Platinum: 'text-[#A8D8F0] bg-[#A8D8F0]/10 border-[#A8D8F0]/30',
  Gold: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  Silver: 'text-[#9898B0] bg-[#9898B0]/10 border-[#9898B0]/30',
  Bronze: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
};

export default function SellersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sellers, setSellers] = useState(MOCK_SELLERS);

  const filtered = sellers.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.shop.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAction = (id: string, action: 'approve' | 'suspend' | 'reject') => {
    setSellers((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: action === 'approve' ? 'active' : action === 'suspend' ? 'suspended' : 'rejected' }
          : s
      )
    );
    toast.success(`Seller ${action}d successfully.`);
  };

  const counts = {
    all: sellers.length,
    active: sellers.filter((s) => s.status === 'active').length,
    pending: sellers.filter((s) => s.status === 'pending').length,
    suspended: sellers.filter((s) => s.status === 'suspended').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F0F0F8]">Seller Oversight</h1>
          <p className="text-xs text-[#9898B0] mt-1">{sellers.length} registered sellers · {counts.pending} pending approval</p>
        </div>
        <button onClick={() => toast.success('Seller report exported')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF7A00] text-white text-xs font-bold hover:opacity-90 cursor-pointer">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {(['all', 'active', 'pending', 'suspended'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer border ${
              statusFilter === tab
                ? 'bg-[#FF7A00] text-white border-[#FF7A00]'
                : 'text-[#9898B0] border-[#1E1E2E] hover:border-[#FF7A00]/40 hover:text-[#F0F0F8]'
            }`}
          >
            {tab} ({counts[tab as keyof typeof counts] ?? sellers.length})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5C5C78]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, shop, or email…"
          className="w-full h-11 pl-10 pr-4 bg-[#111118] border border-[#1E1E2E] rounded-xl text-sm text-[#F0F0F8] outline-none focus:border-[#FF7A00]/50 placeholder-[#5C5C78]"
        />
      </div>

      {/* Table */}
      <div className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#111118] text-[#5C5C78] uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-4 py-3">Seller</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Tier</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">KYC</th>
              <th className="px-4 py-3">Products</th>
              <th className="px-4 py-3">GMV</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E1E2E]">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-[#1C1C28] transition-colors">
                <td className="px-4 py-3">
                  <p className="font-bold text-[#F0F0F8]">{s.name}</p>
                  <p className="text-[10px] text-[#5C5C78]">{s.shop}</p>
                  <p className="text-[10px] text-[#5C5C78]">{s.location}</p>
                </td>
                <td className="px-4 py-3 text-[#9898B0]">{s.category}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${TIER_COLORS[s.tier]}`}>{s.tier}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${STATUS_COLORS[s.status]}`}>{s.status}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${s.kycStatus === 'verified' ? 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/30' : s.kycStatus === 'pending' ? 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30' : 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30'}`}>{s.kycStatus}</span>
                </td>
                <td className="px-4 py-3 text-[#F0F0F8] font-mono">{s.products}</td>
                <td className="px-4 py-3 text-[#FF7A00] font-mono font-bold">{s.gmv > 0 ? formatCurrency(s.gmv) : '—'}</td>
                <td className="px-4 py-3 text-amber-400 font-bold">{s.rating > 0 ? `★ ${s.rating}` : '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Link href={`/super-admin/sellers/${s.id}`}>
                      <button className="p-1.5 rounded-lg bg-[#1E1E2E] hover:bg-[#FF7A00]/20 text-[#9898B0] hover:text-[#FF7A00] transition-colors cursor-pointer" title="View"><Eye size={13} /></button>
                    </Link>
                    {s.status === 'pending' && (
                      <button onClick={() => handleAction(s.id, 'approve')} className="p-1.5 rounded-lg bg-[#22C55E]/10 hover:bg-[#22C55E]/20 text-[#22C55E] transition-colors cursor-pointer" title="Approve"><CheckCircle2 size={13} /></button>
                    )}
                    {s.status === 'active' && (
                      <button onClick={() => handleAction(s.id, 'suspend')} className="p-1.5 rounded-lg bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] transition-colors cursor-pointer" title="Suspend"><ShieldAlert size={13} /></button>
                    )}
                    {s.status === 'suspended' && (
                      <button onClick={() => handleAction(s.id, 'approve')} className="p-1.5 rounded-lg bg-[#22C55E]/10 hover:bg-[#22C55E]/20 text-[#22C55E] transition-colors cursor-pointer" title="Re-Activate"><CheckCircle2 size={13} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#5C5C78] text-sm">No sellers match your filters.</div>
        )}
      </div>
    </div>
  );
}
