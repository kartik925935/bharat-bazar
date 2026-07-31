'use client';

import { Store, Download } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { MOCK_SELLER_GROWTH } from '@/lib/mock/super-admin';
import { toast } from 'sonner';

export default function SellerAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F0F0F8]" style={{ fontFamily: "'Playfair Display', serif" }}>
            🏪 Seller Growth Analytics
          </h1>
          <p className="text-xs text-[#9898B0] mt-0.5">Active seller base, acquisition, and churn rates</p>
        </div>
        <button onClick={() => toast.success('Report downloaded')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111118] border border-[#1E1E2E] text-[#F0F0F8] text-xs font-bold hover:bg-[#1C1C28] cursor-pointer">
          <Download size={14} /> Export Report
        </button>
      </div>

      <div className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl p-6 shadow-xl">
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MOCK_SELLER_GROWTH}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
              <XAxis dataKey="month" stroke="#5C5C78" fontSize={11} />
              <YAxis stroke="#5C5C78" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#111118', borderColor: '#1E1E2E', borderRadius: '12px' }} />
              <Legend />
              <Line type="monotone" dataKey="active" name="Total Active Sellers" stroke="#FF7A00" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="new" name="New Sellers Onboarded" stroke="#22C55E" strokeWidth={2} />
              <Line type="monotone" dataKey="churned" name="Sellers Churned" stroke="#EF4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
