'use client';

import { DollarSign, Download } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { MOCK_MONTHLY_REVENUE } from '@/lib/mock/super-admin';
import { formatCurrency } from '@/lib/utils/format-currency';
import { toast } from 'sonner';

export default function RevenueAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F0F0F8]" style={{ fontFamily: "'Playfair Display', serif" }}>
            💰 Revenue Analytics
          </h1>
          <p className="text-xs text-[#9898B0] mt-0.5">Gross Merchandise Value vs Platform Commission</p>
        </div>
        <button onClick={() => toast.success('Report downloaded')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111118] border border-[#1E1E2E] text-[#F0F0F8] text-xs font-bold hover:bg-[#1C1C28] cursor-pointer">
          <Download size={14} /> Export Report
        </button>
      </div>

      <div className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl p-6 shadow-xl">
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_MONTHLY_REVENUE || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
              <XAxis dataKey="month" stroke="#5C5C78" fontSize={11} />
              <YAxis stroke="#5C5C78" fontSize={11} tickFormatter={(v) => `₹${(v/100000).toFixed(0)}L`} />
              <Tooltip contentStyle={{ backgroundColor: '#111118', borderColor: '#1E1E2E', borderRadius: '12px' }} formatter={(v: any) => formatCurrency(v)} />
              <Legend />
              <Bar dataKey="gmv" name="Total GMV" fill="#FF7A00" radius={[4, 4, 0, 0]} />
              <Bar dataKey="commission" name="Commission Revenue" fill="#22C55E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
