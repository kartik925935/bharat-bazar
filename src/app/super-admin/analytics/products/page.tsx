'use client';

import { Package, Download } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { MOCK_CATEGORY_BREAKDOWN } from '@/lib/mock/super-admin';
import { formatCurrency } from '@/lib/utils/format-currency';
import { toast } from 'sonner';

export default function ProductAnalyticsPage() {
  const COLORS = ['#FF7A00', '#3B82F6', '#22C55E', '#A855F7', '#F59E0B', '#EF4444', '#9898B0'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F0F0F8]" style={{ fontFamily: "'Playfair Display', serif" }}>
            📦 Product Analytics
          </h1>
          <p className="text-xs text-[#9898B0] mt-0.5">Category performance and revenue distribution</p>
        </div>
        <button onClick={() => toast.success('Report downloaded')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111118] border border-[#1E1E2E] text-[#F0F0F8] text-xs font-bold hover:bg-[#1C1C28] cursor-pointer">
          <Download size={14} /> Export Report
        </button>
      </div>

      <div className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl p-6 shadow-xl">
        <div className="h-96 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={MOCK_CATEGORY_BREAKDOWN} 
                dataKey="revenue" 
                nameKey="category" 
                cx="50%" 
                cy="50%" 
                outerRadius={130} 
                label={(entry: any) => entry.category}
              >
                {MOCK_CATEGORY_BREAKDOWN.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#111118', borderColor: '#1E1E2E', borderRadius: '12px' }} 
                formatter={(v: any) => formatCurrency(v)} 
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
