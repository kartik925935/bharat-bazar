'use client';

import { useState } from 'react';
import { Search, Plus, Tag, Calendar, Users, Power, Copy } from 'lucide-react';
import { MOCK_ADMIN_COUPONS } from '@/lib/mock/super-admin';
import { formatCurrency } from '@/lib/utils/format-currency';
import { toast } from 'sonner';

export default function CouponsPage() {
  const [search, setSearch] = useState('');

  const filtered = MOCK_ADMIN_COUPONS.filter(c => 
    c.code.toLowerCase().includes(search.toLowerCase()) || 
    c.scope.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F0F0F8]" style={{ fontFamily: "'Playfair Display', serif" }}>
            🎟️ Marketing Coupons
          </h1>
          <p className="text-xs text-[#9898B0] mt-0.5">Platform-wide promotions and discount management</p>
        </div>
        <button onClick={() => toast.success('Create coupon modal opened')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-xs font-bold hover:opacity-90 cursor-pointer shadow-lg">
          <Plus size={14} /> Create Coupon
        </button>
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5C5C78]" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by coupon code..."
          className="w-full h-11 pl-10 pr-4 bg-[#111118] border border-[#1E1E2E] rounded-xl text-sm text-[#F0F0F8] outline-none focus:border-[#FF7A00]/50 placeholder-[#5C5C78]" />
      </div>

      <div className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-[#9898B0]">
            <thead className="bg-[#111118] text-[#5C5C78] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-4">Coupon Code</th>
                <th className="px-5 py-4">Discount</th>
                <th className="px-5 py-4">Scope</th>
                <th className="px-5 py-4">Validity</th>
                <th className="px-5 py-4 text-right">Usage</th>
                <th className="px-5 py-4 text-right">Total Discount Given</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E1E2E]">
              {filtered.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-[#1C1C28]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Tag size={12} className="text-[#FF7A00]" />
                      <span className="font-mono font-bold text-[#F0F0F8] text-sm tracking-widest">{coupon.code}</span>
                      <button onClick={() => { navigator.clipboard.writeText(coupon.code); toast.success('Copied to clipboard'); }} className="text-[#5C5C78] hover:text-[#F0F0F8] cursor-pointer"><Copy size={12}/></button>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-[#F0F0F8] bg-[#111118] border border-[#1E1E2E] px-2 py-1 rounded">
                      {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                    </span>
                    <p className="text-[10px] text-[#5C5C78] mt-1">Min Order: ₹{coupon.minOrder}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="uppercase text-[10px] font-bold text-[#A855F7]">{coupon.scope}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-[#9898B0]"><Calendar size={12}/> {coupon.validFrom}</div>
                    <div className="flex items-center gap-1.5 text-[#5C5C78] mt-1"><Calendar size={12}/> {coupon.validTo}</div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 font-mono text-[#F0F0F8]">
                      {coupon.usedCount} <span className="text-[#5C5C78]">/ {coupon.maxUses}</span>
                    </div>
                    <div className="w-full bg-[#111118] h-1.5 rounded-full mt-1.5 overflow-hidden border border-[#1E1E2E]">
                      <div className="bg-[#FF7A00] h-full rounded-full" style={{ width: `${(coupon.usedCount / coupon.maxUses) * 100}%` }}></div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right font-mono font-bold text-[#EF4444]">
                    -{formatCurrency(coupon.totalDiscount)}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      coupon.status === 'active' ? 'text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20' : 
                      coupon.status === 'expired' ? 'text-[#9898B0] bg-[#1E1E2E] border border-[#5C5C78]' : 
                      'text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20'
                    }`}>
                      {coupon.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {coupon.status === 'active' ? (
                      <button onClick={() => toast.error('Coupon disabled')} className="p-1.5 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] hover:bg-[#EF4444]/20 cursor-pointer" title="Disable">
                        <Power size={14} />
                      </button>
                    ) : (
                      <span className="text-[10px] text-[#5C5C78]">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-12 text-[#5C5C78] text-sm">No coupons found.</div>}
        </div>
      </div>
    </div>
  );
}
