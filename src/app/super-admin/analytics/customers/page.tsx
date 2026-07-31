'use client';

import { Users, Download } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { MOCK_CUSTOMER_GROWTH } from '@/lib/mock/super-admin';
import { toast } from 'sonner';

export default function CustomerAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F0F0F8]" style={{ fontFamily: "'Playfair Display', serif" }}>
            👥 Customer Analytics
          </h1>
          <p className="text-xs text-[#9898B0] mt-0.5">User acquisition and retention metrics</p>
        </div>
        <button onClick={() => toast.success('Report downloaded')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111118] border border-[#1E1E2E] text-[#F0F0F8] text-xs font-bold hover:bg-[#1C1C28] cursor-pointer">
          <Download size={14} /> Export Report
        </button>
      </div>

      <div className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl p-6 shadow-xl">
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_CUSTOMER_GROWTH}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
              <XAxis dataKey="month" stroke="#5C5C78" fontSize={11} />
              <YAxis stroke="#5C5C78" fontSize={11} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ backgroundColor: '#111118', borderColor: '#1E1E2E', borderRadius: '12px' }} />
              <Legend />
              <Area type="monotone" dataKey="returning" name="Returning Customers" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="new" name="New Customers" stackId="1" stroke="#FF7A00" fill="#FF7A00" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
