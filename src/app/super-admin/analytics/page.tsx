'use client';

import Link from 'next/link';
import { BarChart2, DollarSign, Users, Store, Package } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { MOCK_MONTHLY_REVENUE } from '@/lib/mock/super-admin';
import { formatCurrency } from '@/lib/utils/format-currency';

export default function AnalyticsDashboardPage() {
  const currentMonth = MOCK_MONTHLY_REVENUE?.[MOCK_MONTHLY_REVENUE.length - 1] || { gmv: 0, commission: 0 };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F0F0F8]" style={{ fontFamily: "'Playfair Display', serif" }}>
            📈 Platform Analytics Center
          </h1>
          <p className="text-xs text-[#9898B0] mt-0.5">Comprehensive macro-level reporting and business intelligence</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Revenue & GMV', icon: DollarSign, color: 'text-[#22C55E]', href: '/super-admin/analytics/revenue' },
          { label: 'Seller Growth', icon: Store, color: 'text-[#FF7A00]', href: '/super-admin/analytics/sellers' },
          { label: 'User Retention', icon: Users, color: 'text-[#3B82F6]', href: '/super-admin/analytics/customers' },
          { label: 'Product Trends', icon: Package, color: 'text-[#A855F7]', href: '/super-admin/analytics/products' },
        ].map(module => (
          <Link key={module.label} href={module.href} className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl p-5 hover:border-[#FF7A00]/50 transition-colors group">
            <div className={`w-10 h-10 rounded-xl bg-[#111118] border border-[#1E1E2E] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${module.color}`}>
              <module.icon size={20} />
            </div>
            <h3 className="text-sm font-bold text-[#F0F0F8]">{module.label}</h3>
            <p className="text-[10px] text-[#5C5C78] mt-1">View detailed reports →</p>
          </Link>
        ))}
      </div>

      <div className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="flex justify-between items-center border-b border-[#1E1E2E] pb-4">
          <div>
            <h2 className="text-base font-black text-[#F0F0F8]">Platform GMV Overview (6 Months)</h2>
            <p className="text-xs text-[#9898B0]">Current Month: <span className="font-bold text-[#FF7A00]">{formatCurrency(currentMonth?.gmv || 0)}</span></p>
          </div>
        </div>
        
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_MONTHLY_REVENUE || []}>
              <defs>
                <linearGradient id="gmv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF7A00" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FF7A00" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" />
              <XAxis dataKey="month" stroke="#5C5C78" fontSize={11} />
              <YAxis stroke="#5C5C78" fontSize={11} tickFormatter={(v) => `₹${(v/100000).toFixed(1)}L`} />
              <Tooltip contentStyle={{ backgroundColor: '#111118', borderColor: '#1E1E2E', borderRadius: '12px' }} formatter={(v: any) => formatCurrency(v)} />
              <Area type="monotone" dataKey="gmv" stroke="#FF7A00" strokeWidth={3} fillOpacity={1} fill="url(#gmv)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
