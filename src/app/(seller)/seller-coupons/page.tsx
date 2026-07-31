'use client';

import { useState } from 'react';
import { Tag, Plus, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useSellerStore, SellerCoupon } from '@/lib/store/seller-store';
import { formatCurrency } from '@/lib/utils/format-currency';
import { toast } from 'sonner';

export default function SellerCouponsPage() {
  const { coupons, updateCoupon, deleteCoupon } = useSellerStore();
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#1A1A1A]">Coupons & Offers</h1>
          <p className="text-sm text-[#9B8F84]">Manage promotional codes</p>
        </div>
        <button
          onClick={() => { toast.info('Coupon creation modal coming soon!'); setIsCreating(true); }}
          className="flex items-center gap-2 h-10 px-4 bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-sm font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 transition-all"
        >
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl border border-[#F0EDE8] p-12 text-center">
            <Tag size={40} className="text-[#D4C9BF] mx-auto mb-3" />
            <p className="text-base font-bold text-[#1A1A1A]">No coupons yet</p>
          </div>
        ) : coupons.map(c => {
          const stl = c.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      c.status === 'scheduled' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-gray-100 text-gray-600 border-gray-200';
          return (
            <div key={c.id} className="bg-white rounded-2xl border border-[#F0EDE8] overflow-hidden flex flex-col">
              <div className="p-5 border-b border-[#F0EDE8] border-dashed relative">
                <div className="absolute -left-3 -bottom-3 w-6 h-6 rounded-full bg-[#FAFAF8]" />
                <div className="absolute -right-3 -bottom-3 w-6 h-6 rounded-full bg-[#FAFAF8]" />
                
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-lg font-black tracking-wider text-[#FF7A00] bg-[#FFF7ED] px-3 py-1 rounded-lg border border-orange-100">{c.code}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${stl}`}>{c.status}</span>
                </div>
                <h3 className="text-xl font-black text-[#1A1A1A]">
                  {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : formatCurrency(c.discountValue)}
                </h3>
                <p className="text-sm text-[#4A4540] mt-1">{c.description}</p>
              </div>

              <div className="p-5 bg-[#FAFAF8] flex-1 flex flex-col">
                <div className="space-y-2 text-xs text-[#9B8F84] mb-4">
                  <div className="flex justify-between"><span>Min. Order:</span><span className="font-bold text-[#1A1A1A]">{formatCurrency(c.minOrderAmount)}</span></div>
                  {c.maxDiscountAmount && <div className="flex justify-between"><span>Max Discount:</span><span className="font-bold text-[#1A1A1A]">{formatCurrency(c.maxDiscountAmount)}</span></div>}
                  <div className="flex justify-between"><span>Usage limit:</span><span className="font-bold text-[#1A1A1A]">{c.usageCount} / {c.maxUsage}</span></div>
                  <div className="flex justify-between"><span>Valid till:</span><span className="font-bold text-[#1A1A1A]">{new Date(c.endDate).toLocaleDateString('en-IN')}</span></div>
                </div>

                <div className="mt-auto flex gap-2">
                  {c.status === 'active' ? (
                    <button onClick={() => updateCoupon(c.id, { status: 'inactive' })} className="flex-1 py-2 border border-[#F0EDE8] rounded-xl text-xs font-bold text-[#4A4540] hover:bg-white">Deactivate</button>
                  ) : c.status === 'inactive' ? (
                    <button onClick={() => updateCoupon(c.id, { status: 'active' })} className="flex-1 py-2 bg-[#FFF7ED] text-[#FF7A00] rounded-xl text-xs font-bold hover:bg-orange-100">Activate</button>
                  ) : null}
                  <button onClick={() => { if(confirm('Delete coupon?')) deleteCoupon(c.id); }} className="w-10 py-2 border border-red-100 text-red-500 rounded-xl flex justify-center items-center hover:bg-red-50"><XCircle size={14}/></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
