'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, Search, Filter, AlertOctagon, CheckCircle2, Eye, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format-currency';
import { toast } from 'sonner';
import { MOCK_ADMIN_PRODUCTS } from '@/lib/mock/super-admin';

export default function ProductsPage() {
  const [products, setProducts] = useState(MOCK_ADMIN_PRODUCTS);
  const [tab, setTab]           = useState<'all' | 'flagged' | 'pending' | 'approved' | 'rejected'>('all');
  const [search, setSearch]     = useState('');

  const filtered = products.filter((p) => {
    const matchesTab = tab === 'all' || p.status === tab;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.seller.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleToggleFlag = (id: string, name: string) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status: p.status === 'flagged' ? 'approved' : 'flagged' } : p)));
    toast.info(`Updated product moderation state for ${name}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F0F0F8]" style={{ fontFamily: "'Playfair Display', serif" }}>
            📦 All Products Oversight
          </h1>
          <p className="text-xs text-[#9898B0] mt-0.5">Platform catalog quality review, copyright checks, and content moderation</p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex gap-2 flex-wrap bg-[#111118] border border-[#1E1E2E] p-1 rounded-xl">
          {(['all', 'flagged', 'pending', 'approved', 'rejected'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                tab === t ? 'bg-[#FF7A00] text-white' : 'text-[#9898B0] hover:text-[#F0F0F8]'
              }`}
            >
              {t} ({products.filter((p) => (t === 'all' ? true : p.status === t)).length})
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C5C78]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products or seller…"
            className="w-full h-9 pl-9 pr-3 bg-[#111118] border border-[#1E1E2E] rounded-xl text-xs text-[#F0F0F8] outline-none focus:border-[#FF7A00]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-[#9898B0]">
            <thead className="bg-[#111118] text-[#5C5C78] uppercase text-[10px] tracking-wider border-b border-[#1E1E2E]">
              <tr>
                <th className="px-5 py-3.5">Product</th>
                <th className="px-5 py-3.5">Seller</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Price</th>
                <th className="px-5 py-3.5">Stock</th>
                <th className="px-5 py-3.5">Sales</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E1E2E]">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-[#1C1C28] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div>
                        <Link href={`/super-admin/products/${p.id}`} className="font-bold text-[#F0F0F8] hover:text-[#FF7A00]">
                          {p.name}
                        </Link>
                        <p className="text-[10px] text-[#5C5C78]">{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-[#F0F0F8]">{p.seller}</td>
                  <td className="px-5 py-3.5">{p.category}</td>
                  <td className="px-5 py-3.5 font-mono font-bold text-[#FF7A00]">{formatCurrency(p.price)}</td>
                  <td className="px-5 py-3.5 font-mono">{p.stock}</td>
                  <td className="px-5 py-3.5 font-mono font-bold text-[#F0F0F8]">{p.sales}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        p.status === 'approved'
                          ? 'bg-[#22C55E]/10 text-[#22C55E]'
                          : p.status === 'flagged'
                          ? 'bg-[#EF4444]/10 text-[#EF4444] animate-pulse'
                          : p.status === 'rejected'
                          ? 'bg-[#9898B0]/10 text-[#9898B0]'
                          : 'bg-[#F59E0B]/10 text-[#F59E0B]'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/super-admin/products/${p.id}`}
                        className="px-2.5 py-1 rounded-lg bg-[#111118] border border-[#1E1E2E] text-xs font-semibold text-[#9898B0] hover:text-[#F0F0F8]"
                      >
                        Review →
                      </Link>
                      <button
                        onClick={() => handleToggleFlag(p.id, p.name)}
                        className="px-2.5 py-1 rounded-lg bg-[#111118] border border-[#1E1E2E] text-xs font-semibold text-[#EF4444] hover:bg-[#EF4444]/10 cursor-pointer"
                      >
                        {p.status === 'flagged' ? 'Unflag' : 'Flag'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-12 text-[#5C5C78] text-sm">No products found.</div>}
        </div>
      </div>
    </div>
  );
}
