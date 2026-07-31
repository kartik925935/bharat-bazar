'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Tag, Calendar, Users, Power } from 'lucide-react';
import { MOCK_ADMIN_COUPONS } from '@/lib/mock/super-admin';
import { formatCurrency } from '@/lib/utils/format-currency';
import { toast } from 'sonner';

export default function CouponDetailPage({ params }: { params: Promise<{ code: string }> }) {
  const resolvedParams = use(params);
  const coupon = MOCK_ADMIN_COUPONS.find(c => c.code === resolvedParams.code) || MOCK_ADMIN_COUPONS[0];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/super-admin/coupons" className="p-2 rounded-xl bg-[#111118] border border-[#1E1E2E] text-[#9898B0] hover:text-[#F0F0F8]">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-[#F0F0F8] font-mono tracking-widest">{coupon.code}</h1>
          <p className="text-xs text-[#9898B0]">Coupon Code Details & Analytics</p>
        </div>
        <span className={`ml-auto px-3 py-1 rounded-full text-[10px] font-black border uppercase ${
          coupon.status === 'active' ? 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/30' : 
          'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30'
        }`}>
          {coupon.status}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#16161F] border border-[#1E1E2E] p-5 rounded-2xl text-center">
          <p className="text-[10px] text-[#5C5C78] uppercase font-bold">Discount Value</p>
          <p className="text-lg font-black font-mono text-[#F0F0F8] mt-1">{coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}</p>
        </div>
        <div className="bg-[#16161F] border border-[#1E1E2E] p-5 rounded-2xl text-center">
          <p className="text-[10px] text-[#5C5C78] uppercase font-bold">Total Times Used</p>
          <p className="text-lg font-black font-mono text-[#F0F0F8] mt-1">{coupon.usedCount}</p>
        </div>
        <div className="bg-[#16161F] border border-[#1E1E2E] p-5 rounded-2xl text-center">
          <p className="text-[10px] text-[#5C5C78] uppercase font-bold">Max Uses Allowed</p>
          <p className="text-lg font-black font-mono text-[#F0F0F8] mt-1">{coupon.maxUses}</p>
        </div>
        <div className="bg-[#16161F] border border-[#1E1E2E] p-5 rounded-2xl text-center">
          <p className="text-[10px] text-[#5C5C78] uppercase font-bold">Platform Spend</p>
          <p className="text-lg font-black font-mono text-[#EF4444] mt-1">-{formatCurrency(coupon.totalDiscount)}</p>
        </div>
      </div>
      
      <div className="bg-[#16161F] border border-[#1E1E2E] p-6 rounded-2xl space-y-4">
         <h2 className="text-sm font-bold text-[#F0F0F8] border-b border-[#1E1E2E] pb-2">Configuration rules</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="flex justify-between border-b border-[#1E1E2E] pb-2">
                <span className="text-[#9898B0]">Scope</span>
                <span className="text-[#A855F7] font-bold uppercase">{coupon.scope}</span>
            </div>
            <div className="flex justify-between border-b border-[#1E1E2E] pb-2">
                <span className="text-[#9898B0]">Min Order Value</span>
                <span className="text-[#F0F0F8] font-bold">₹{coupon.minOrder}</span>
            </div>
            <div className="flex justify-between border-b border-[#1E1E2E] pb-2">
                <span className="text-[#9898B0]">Valid From</span>
                <span className="text-[#F0F0F8] font-bold">{coupon.validFrom}</span>
            </div>
            <div className="flex justify-between border-b border-[#1E1E2E] pb-2">
                <span className="text-[#9898B0]">Valid To</span>
                <span className="text-[#F0F0F8] font-bold">{coupon.validTo}</span>
            </div>
         </div>
      </div>

      <div className="flex gap-3">
        {coupon.status === 'active' ? (
            <button onClick={() => toast.error('Coupon Deactivated')} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-xs font-bold cursor-pointer hover:bg-[#EF4444]/20">
                <Power size={14} /> Deactivate Coupon
            </button>
        ) : (
            <button onClick={() => toast.success('Coupon Activated')} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-xs font-bold cursor-pointer hover:bg-[#22C55E]/20">
                <Power size={14} /> Reactivate Coupon
            </button>
        )}
      </div>
    </div>
  );
}
