'use client';

import { useState } from 'react';
import { DollarSign, Landmark, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format-currency';
import { MOCK_COMMISSION_STATS } from '@/lib/mock/super-admin';
import { useSuperAdminStore } from '@/lib/store/super-admin-store';
import { toast } from 'sonner';

export default function CommissionsPage() {
  const { commissionRates, updateCommissionRates } = useSuperAdminStore();
  const [rates, setRates] = useState(commissionRates);

  const handleSave = () => {
    updateCommissionRates(rates);
    toast.success('Commission structure saved successfully');
  };

  const handleChange = (index: number, field: string, value: string) => {
    const newRates = [...rates];
    newRates[index] = { ...newRates[index], [field]: Number(value) };
    setRates(newRates);
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F0F0F8]" style={{ fontFamily: "'Playfair Display', serif" }}>
            🏦 Commission Architecture
          </h1>
          <p className="text-xs text-[#9898B0] mt-0.5">Platform revenue models and category-specific take rates</p>
        </div>
        <button onClick={handleSave} className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-xs font-bold shadow-lg hover:opacity-90 cursor-pointer">
          Save Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#16161F] border border-[#1E1E2E] p-5 rounded-2xl">
          <p className="text-[10px] font-bold uppercase text-[#9898B0]">Total Commission (MTD)</p>
          <p className="text-2xl font-black font-mono text-[#F0F0F8] mt-1">{formatCurrency(MOCK_COMMISSION_STATS.totalCollected)}</p>
          <p className="text-[10px] text-[#22C55E] mt-0.5 font-bold flex items-center gap-1"><TrendingUp size={12} /> +{MOCK_COMMISSION_STATS.mtdGrowth}%</p>
        </div>
        <div className="bg-[#16161F] border border-[#1E1E2E] p-5 rounded-2xl">
          <p className="text-[10px] font-bold uppercase text-[#9898B0]">Average Take Rate</p>
          <p className="text-2xl font-black font-mono text-[#F0F0F8] mt-1">{MOCK_COMMISSION_STATS.avgRate}%</p>
          <p className="text-[10px] text-[#5C5C78] mt-0.5 font-bold">Across all categories</p>
        </div>
        <div className="bg-[#16161F] border border-[#1E1E2E] p-5 rounded-2xl">
          <p className="text-[10px] font-bold uppercase text-[#9898B0]">Top Revenue Category</p>
          <p className="text-lg font-black text-[#FF7A00] mt-2 leading-tight">{MOCK_COMMISSION_STATS.topCategory}</p>
        </div>
        <div className="bg-[#16161F] border border-[#1E1E2E] p-5 rounded-2xl">
          <p className="text-[10px] font-bold uppercase text-[#9898B0]">Pending Platform Cut</p>
          <p className="text-2xl font-black font-mono text-[#F0F0F8] mt-1">{formatCurrency(MOCK_COMMISSION_STATS.pendingPayouts)}</p>
          <p className="text-[10px] text-[#F59E0B] mt-0.5 font-bold">Waiting clearance</p>
        </div>
      </div>

      <div className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-[#1E1E2E] flex justify-between items-center">
          <h2 className="text-sm font-black text-[#F0F0F8]">Category Commission Configuration</h2>
          <span className="text-[10px] text-[#9898B0] bg-[#111118] px-2 py-1 rounded border border-[#1E1E2E]">All rates are tax exclusive</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-[#9898B0]">
            <thead className="bg-[#111118] text-[#5C5C78] uppercase text-[10px] tracking-wider border-b border-[#1E1E2E]">
              <tr>
                <th className="px-5 py-3.5">Category Class</th>
                <th className="px-5 py-3.5 text-center">Take Rate (%)</th>
                <th className="px-5 py-3.5 text-right">Min Fee Cap (₹)</th>
                <th className="px-5 py-3.5 text-right">Max Fee Cap (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E1E2E]">
              {rates.map((rate, i) => (
                <tr key={rate.category} className="hover:bg-[#1C1C28] transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-[#F0F0F8]">{rate.category}</p>
                    <p className="text-[10px] text-[#5C5C78] max-w-xs truncate">{rate.category}</p>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <div className="inline-flex items-center">
                      <input type="number" value={rate.rate} onChange={(e) => handleChange(i, 'rate', e.target.value)} className="w-16 h-8 bg-[#111118] border border-[#1E1E2E] rounded-l-lg text-center font-bold text-[#FF7A00] outline-none focus:border-[#FF7A00]" />
                      <span className="h-8 px-2 bg-[#1E1E2E] border-y border-r border-[#1E1E2E] rounded-r-lg flex items-center text-[#9898B0]">%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="inline-flex items-center justify-end w-full">
                      <span className="h-8 px-2 bg-[#1E1E2E] border-y border-l border-[#1E1E2E] rounded-l-lg flex items-center text-[#9898B0]">₹</span>
                      <input type="number" value={rate.minAmount} onChange={(e) => handleChange(i, 'minAmount', e.target.value)} className="w-20 h-8 bg-[#111118] border border-[#1E1E2E] rounded-r-lg text-right pr-2 font-mono text-[#F0F0F8] outline-none focus:border-[#FF7A00]" />
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="inline-flex items-center justify-end w-full">
                      <span className="h-8 px-2 bg-[#1E1E2E] border-y border-l border-[#1E1E2E] rounded-l-lg flex items-center text-[#9898B0]">₹</span>
                      <input type="number" value={rate.maxAmount || ''} onChange={(e) => handleChange(i, 'maxAmount', e.target.value)} className="w-24 h-8 bg-[#111118] border border-[#1E1E2E] rounded-r-lg text-right pr-2 font-mono text-[#F0F0F8] outline-none focus:border-[#FF7A00]" />
                    </div>
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
