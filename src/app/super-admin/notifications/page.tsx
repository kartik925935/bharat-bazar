'use client';

import { useState } from 'react';
import { Send, Search, BellRing, Type } from 'lucide-react';
import { MOCK_NOTIFICATION_TEMPLATES } from '@/lib/mock/super-admin';
import { toast } from 'sonner';

export default function NotificationsPage() {
  const [search, setSearch] = useState('');

  const filtered = MOCK_NOTIFICATION_TEMPLATES.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) || 
    t.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F0F0F8]" style={{ fontFamily: "'Playfair Display', serif" }}>
            🔔 Notification Center
          </h1>
          <p className="text-xs text-[#9898B0] mt-0.5">Manage push notifications, emails, and SMS templates</p>
        </div>
        <button onClick={() => toast.success('Send blast modal opened')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-xs font-bold hover:opacity-90 cursor-pointer shadow-lg">
          <Send size={14} /> Send Custom Blast
        </button>
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5C5C78]" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search templates..."
          className="w-full h-11 pl-10 pr-4 bg-[#111118] border border-[#1E1E2E] rounded-xl text-sm text-[#F0F0F8] outline-none focus:border-[#FF7A00]/50 placeholder-[#5C5C78]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((tpl) => (
          <div key={tpl.id} className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl p-5 space-y-3 shadow-xl">
            <div className="flex items-start justify-between border-b border-[#1E1E2E] pb-3">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg border ${
                  tpl.type === 'promotional' ? 'bg-[#A855F7]/10 border-[#A855F7]/30 text-[#A855F7]' :
                  tpl.type === 'transactional' ? 'bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]' :
                  tpl.type === 'seller' ? 'bg-[#FF7A00]/10 border-[#FF7A00]/30 text-[#FF7A00]' :
                  'bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]'
                }`}>
                  <BellRing size={14} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F0F0F8]">{tpl.title}</h3>
                  <p className="text-[10px] text-[#5C5C78] uppercase font-bold">{tpl.type}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#111118] border border-[#1E1E2E] p-3 rounded-xl text-xs text-[#9898B0] leading-relaxed">
              <Type size={12} className="inline mr-2 text-[#5C5C78]"/>
              {tpl.body}
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={() => toast.info('Edit template')} className="flex-1 py-1.5 bg-[#111118] border border-[#1E1E2E] rounded-lg text-xs font-bold text-[#9898B0] hover:text-[#FF7A00] transition-colors cursor-pointer">
                Edit Template
              </button>
              <button onClick={() => toast.success(`Test sent for ${tpl.title}`)} className="flex-1 py-1.5 bg-[#111118] border border-[#1E1E2E] rounded-lg text-xs font-bold text-[#9898B0] hover:text-[#3B82F6] transition-colors cursor-pointer">
                Send Test
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
