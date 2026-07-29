'use client';

import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { mockGmvData, mockAdminStats } from '@/lib/mock/admin';

const iconMap: Record<string, React.ComponentType<any>> = {
  CreditCard: Icons.CreditCard,
  ShoppingBag: Icons.ShoppingBag,
  ShieldCheck: Icons.ShieldCheck,
  AlertCircle: Icons.AlertCircle,
};

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 750);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF8] p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Platform Governance & Governance Control</h1>
        <p className="text-xs text-[#8C8B80] mb-8">Bharat Bazaar Marketplace Administration Console</p>

        {loading ? (
          <>
            {/* Stat Cards Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm">
                  <Skeleton className="w-10 h-10 rounded-xl mb-4" />
                  <Skeleton className="h-8 w-28 mb-2" />
                  <Skeleton className="h-4 w-40" />
                </div>
              ))}
            </div>

            {/* Chart Skeleton */}
            <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm mb-8">
              <Skeleton className="h-6 w-80 mb-6" />
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
          </>
        ) : (
          <>
            {/* Platform Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {mockAdminStats.map((s) => {
                const Icon = iconMap[s.icon] || Icons.HelpCircle;
                return (
                  <div key={s.label} className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                      <Icon size={20} />
                    </div>
                    <div className="text-2xl font-bold text-[#1C1B14]">{s.val}</div>
                    <div className="text-xs text-[#8C8B80] mt-1">{s.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Area Chart - GMV */}
            <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm mb-8">
              <h3 className="font-bold text-base text-[#1C1B14] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Platform GMV Growth vs Commission Revenue</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockGmvData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F0EA" />
                    <XAxis dataKey="month" style={{ fontSize: 12, fill: "#8C8B80" }} />
                    <YAxis style={{ fontSize: 12, fill: "#8C8B80" }} />
                    <Tooltip formatter={(value: any) => [`₹${(value / 100000).toFixed(1)} Lakhs`, 'Amount']} />
                    <Area type="monotone" dataKey="gmv" stroke="#FF7A00" fill="#FFF8F0" strokeWidth={2} />
                    <Area type="monotone" dataKey="commission" stroke="#1A9E4E" fill="#E8F8EE" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
