'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils/format-currency';
import { MOCK_COMPLAINTS } from '@/lib/mock/super-admin';

export default function ComplaintsPage() {
  const [complaints] = useState(MOCK_COMPLAINTS);
  const [search, setSearch] = useState('');

  const filtered = complaints.filter(c => 
    c.ticketNo.toLowerCase().includes(search.toLowerCase()) || 
    c.customer.toLowerCase().includes(search.toLowerCase()) || 
    c.seller.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F0F0F8]" style={{ fontFamily: "'Playfair Display', serif" }}>
            ⚠️ Platform Complaints & Disputes
          </h1>
          <p className="text-xs text-[#9898B0] mt-0.5">Dispute arbitration center for buyer-seller conflict resolution</p>
        </div>
      </div>

      <div className="relative w-full sm:w-96">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C5C78]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search ticket no, customer, or seller..."
          className="w-full h-10 pl-9 pr-3 bg-[#111118] border border-[#1E1E2E] rounded-xl text-sm text-[#F0F0F8] outline-none focus:border-[#FF7A00]"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((c) => (
          <div key={c.id} className="p-5 bg-[#16161F] border border-[#1E1E2E] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:border-[#3B82F6]/30">
            <div>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                c.priority === 'urgent' ? 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20' :
                c.priority === 'high' ? 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20' :
                'text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/20'
              }`}>
                {c.priority} Priority • {c.ticketNo}
              </span>
              <h3 className="text-sm font-bold text-[#F0F0F8] mt-2">{c.subject}</h3>
              <p className="text-xs text-[#9898B0] mt-1">{c.customer} vs {c.seller} • {c.createdDate}</p>
            </div>
            <div className="flex flex-col sm:items-end gap-2 shrink-0">
              <span className={`text-xs font-bold capitalize ${c.status === 'resolved' ? 'text-[#22C55E]' : c.status === 'open' ? 'text-[#EF4444]' : 'text-[#F59E0B]'}`}>
                {c.status.replace('_', ' ')}
              </span>
              <Link
                href={`/super-admin/complaints/${c.id}`}
                className="px-4 py-2 rounded-xl bg-[#111118] border border-[#1E1E2E] text-xs font-bold text-[#FF7A00] hover:bg-[#1C1C28]"
              >
                Resolve Ticket →
              </Link>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center py-12 text-[#5C5C78] text-sm">No complaints found.</div>}
      </div>
    </div>
  );
}
