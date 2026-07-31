'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils/format-currency';
import { MOCK_CUSTOMERS } from '@/lib/mock/super-admin';

export default function CustomerDetailPage({ params }: { params: Promise<{ customerId: string }> }) {
  const { customerId } = use(params);
  const customer = MOCK_CUSTOMERS.find((c) => c.id === customerId) ?? MOCK_CUSTOMERS[0];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/super-admin/customers">
          <button className="p-2 rounded-xl bg-[#111118] border border-[#1E1E2E] text-[#9898B0] hover:text-[#F0F0F8] cursor-pointer"><ArrowLeft size={16} /></button>
        </Link>
        <div>
          <h1 className="text-xl font-black text-[#F0F0F8]">{customer.name}</h1>
          <p className="text-xs text-[#9898B0]">{customer.email} · {customer.id}</p>
        </div>
        <span className={`ml-auto px-3 py-1 rounded-full text-[10px] font-black border capitalize ${customer.status === 'active' ? 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/30' : customer.status === 'suspended' ? 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30' : 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30'}`}>{customer.status}</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: customer.totalOrders, color: 'text-[#F0F0F8]' },
          { label: 'Total Spent', value: formatCurrency(customer.totalSpent), color: 'text-[#FF7A00]' },
          { label: 'Loyalty Tier', value: customer.tier, color: 'text-amber-400' },
          { label: 'Member Since', value: customer.joinedDate, color: 'text-[#9898B0]' },
        ].map((s) => (
          <div key={s.label} className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl p-4 text-center">
            <p className="text-[10px] text-[#5C5C78] uppercase font-bold">{s.label}</p>
            <p className={`text-lg font-black font-mono mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-black text-[#F0F0F8] border-b border-[#1E1E2E] pb-2">Contact Details</h3>
        <div className="space-y-2 text-xs text-[#9898B0]">
          <p className="flex items-center gap-2"><Mail size={13} />{customer.email}</p>
          <p className="flex items-center gap-2"><Phone size={13} />{customer.phone}</p>
          <p className="flex items-center gap-2"><MapPin size={13} />{customer.location}</p>
          <p className="flex items-center gap-2"><ShoppingBag size={13} />Last Active: <span className="text-[#F0F0F8] font-bold">{customer.lastActive}</span></p>
        </div>
      </div>

      <div className="flex gap-3">
        {customer.status === 'active' && (
          <button onClick={() => toast.error(`${customer.name} suspended.`)} className="px-5 py-2.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-xs font-bold cursor-pointer hover:bg-[#EF4444]/20">Suspend Account</button>
        )}
        {customer.status !== 'active' && (
          <button onClick={() => toast.success(`${customer.name} restored.`)} className="px-5 py-2.5 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-xs font-bold cursor-pointer hover:bg-[#22C55E]/20">Restore Account</button>
        )}
        <button onClick={() => toast.info('View orders feature coming soon')} className="px-5 py-2.5 rounded-xl bg-[#111118] border border-[#1E1E2E] text-[#9898B0] hover:text-[#F0F0F8] text-xs font-bold cursor-pointer">View Orders</button>
      </div>
    </div>
  );
}
