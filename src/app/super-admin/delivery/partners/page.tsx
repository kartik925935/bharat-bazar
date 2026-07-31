'use client';

import Link from 'next/link';
import { ArrowLeft, Truck } from 'lucide-react';

export default function DeliveryPartnersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/super-admin/delivery" className="p-2 rounded-xl bg-[#111118] border border-[#1E1E2E] text-[#9898B0] hover:text-[#F0F0F8]">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-[#F0F0F8]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Delivery Partners Directory
          </h1>
          <p className="text-xs text-[#9898B0]">Integrated 3PL logistics provider SLAs</p>
        </div>
      </div>

      <div className="space-y-3">
        {[
          { name: 'BlueDart Express', coverage: '28,000 Pincodes', sla: '98.6%' },
          { name: 'Delhivery Surface & Air', coverage: '19,500 Pincodes', sla: '97.9%' },
          { name: 'India Post SpeedPost', coverage: '1,50,000 Pincodes (Rural Artisan Hubs)', sla: '96.4%' },
        ].map((p) => (
          <div key={p.name} className="p-4 bg-[#16161F] border border-[#1E1E2E] rounded-2xl flex items-center justify-between">
            <div>
              <p className="font-bold text-[#F0F0F8] text-sm">{p.name}</p>
              <p className="text-xs text-[#9898B0]">{p.coverage}</p>
            </div>
            <span className="text-xs font-bold text-[#22C55E] font-mono">SLA: {p.sla}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
