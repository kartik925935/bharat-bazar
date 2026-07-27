'use client';

import { Users, ShoppingBag, Package, CreditCard, AlertCircle, ShieldCheck } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const gmvData = [
  { month: 'Jun', gmv: 8500000, commission: 850000 },
  { month: 'Jul', gmv: 9800000, commission: 980000 },
  { month: 'Aug', gmv: 8900000, commission: 890000 },
  { month: 'Sep', gmv: 11200000, commission: 1120000 },
  { month: 'Oct', gmv: 13400000, commission: 1340000 },
  { month: 'Nov', gmv: 15800000, commission: 1580000 },
];

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1C1B14] mb-2">Platform Governance & Governance Control</h1>
        <p className="text-xs text-[#8C8B80] mb-8">Bharat Bazaar Marketplace Administration Console</p>

        {/* Platform Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Platform GMV (Nov)', val: '₹1.58 Cr', icon: CreditCard, color: 'text-amber-600 bg-amber-50' },
            { label: 'Active Sellers', val: '50,234', icon: ShoppingBag, color: 'text-green-600 bg-green-50' },
            { label: 'Pending KYC Approvals', val: '12', icon: ShieldCheck, color: 'text-orange-600 bg-orange-50' },
            { label: 'Open Complaints', val: '7', icon: AlertCircle, color: 'text-red-600 bg-red-50' },
          ].map((s) => (
            <div key={s.label} className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                <s.icon size={20} />
              </div>
              <div className="text-2xl font-bold text-[#1C1B14]">{s.val}</div>
              <div className="text-xs text-[#8C8B80] mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Area Chart - GMV */}
        <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm mb-8">
          <h3 className="font-bold text-base text-[#1C1B14] mb-4">Platform GMV Growth vs Commission Revenue</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={gmvData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="month" style={{ fontSize: 12 }} />
                <YAxis style={{ fontSize: 12 }} />
                <Tooltip formatter={(value: any) => [`₹${(value / 100000).toFixed(1)} Lakhs`, 'Amount']} />
                <Area type="monotone" dataKey="gmv" stroke="#FF7A00" fill="#FFF8F0" strokeWidth={2} />
                <Area type="monotone" dataKey="commission" stroke="#1A9E4E" fill="#E8F8EE" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
