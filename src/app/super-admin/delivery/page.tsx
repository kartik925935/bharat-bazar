'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Truck, Search, Plus, MapPin, Activity } from 'lucide-react';
import { MOCK_DELIVERY_PARTNERS } from '@/lib/mock/super-admin';
import { toast } from 'sonner';

export default function DeliveryPartnersPage() {
  const [search, setSearch] = useState('');

  const filtered = MOCK_DELIVERY_PARTNERS.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F0F0F8]" style={{ fontFamily: "'Playfair Display', serif" }}>
            🚚 Logistics & Delivery Partners
          </h1>
          <p className="text-xs text-[#9898B0] mt-0.5">Manage integrated courier services and tracking APIs</p>
        </div>
        <button onClick={() => toast.info('Integration wizard coming soon')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-xs font-bold hover:opacity-90 cursor-pointer shadow-lg">
          <Plus size={14} /> Add New Partner API
        </button>
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5C5C78]" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search delivery partners..."
          className="w-full h-11 pl-10 pr-4 bg-[#111118] border border-[#1E1E2E] rounded-xl text-sm text-[#F0F0F8] outline-none focus:border-[#FF7A00]/50 placeholder-[#5C5C78]" />
      </div>

      <div className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-[#9898B0]">
            <thead className="bg-[#111118] text-[#5C5C78] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-4">Partner Name</th>
                <th className="px-5 py-4">Coverage</th>
                <th className="px-5 py-4">API Status</th>
                <th className="px-5 py-4 text-right">Active Shipments</th>
                <th className="px-5 py-4 text-right">Success Rate</th>
                <th className="px-5 py-4 text-right">Avg SLA</th>
                <th className="px-5 py-4">COD</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E1E2E]">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-[#1C1C28]">
                  <td className="px-5 py-4">
                    <p className="font-bold text-[#F0F0F8] text-sm">{p.name}</p>
                    <p className="text-[10px] text-[#5C5C78] uppercase">{p.type}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1.5"><MapPin size={12} className="text-[#FF7A00]"/> {p.coverage}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      p.apiStatus === 'connected' ? 'text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20' : 
                      p.apiStatus === 'degraded' ? 'text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/20' : 
                      'text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20'
                    }`}>
                      {p.apiStatus === 'connected' ? '🟢 Online' : p.apiStatus === 'degraded' ? '🟡 Degraded' : '🔴 Offline'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right font-mono text-[#F0F0F8]">{p.activeShipments.toLocaleString()}</td>
                  <td className="px-5 py-4 text-right font-mono text-[#22C55E]">{p.successRate}%</td>
                  <td className="px-5 py-4 text-right font-mono text-[#F0F0F8]">{p.avgDeliveryDays} Days</td>
                  <td className="px-5 py-4">
                    {p.codAvailable ? <span className="text-[#22C55E] font-bold">Yes</span> : <span className="text-[#5C5C78]">No</span>}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => toast.info('Checking API health')} className="p-1.5 rounded-lg bg-[#111118] border border-[#1E1E2E] text-[#9898B0] hover:text-[#FF7A00] cursor-pointer" title="Test Connection">
                      <Activity size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
