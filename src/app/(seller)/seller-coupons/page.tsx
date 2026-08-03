'use client';

import { useState } from 'react';
import { Tag, Plus, CheckCircle2, XCircle, Clock, X, AlertCircle, Loader2 } from 'lucide-react';
import { useSellerStore, SellerCoupon } from '@/lib/store/seller-store';
import { formatCurrency } from '@/lib/utils/format-currency';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';

const couponSchema = z.object({
  code: z.string().min(4, "Coupon code must be at least 4 characters").max(20, "Coupon code cannot exceed 20 characters").regex(/^[A-Z0-9]+$/, "Only uppercase letters and numbers allowed").toUpperCase(),
  description: z.string().min(10, "Description must be at least 10 characters").max(100, "Description cannot exceed 100 characters"),
  discountType: z.enum(['percentage', 'flat']),
  discountValue: z.string().refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Discount value must be a positive number"),
  minOrderAmount: z.string().refine((v) => !isNaN(Number(v)) && Number(v) >= 0, "Min order amount must be a valid number"),
});

type CouponFormData = z.infer<typeof couponSchema>;

export default function SellerCouponsPage() {
  const { coupons, seller, createCoupon, updateCoupon, deleteCoupon } = useSellerStore();
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderAmount: '',
    }
  });

  const { register, handleSubmit, formState: { errors, touchedFields, isValid, isSubmitting }, reset } = form;

  const onSubmit = async (data: CouponFormData) => {
    if (!seller) return;
    await new Promise(r => setTimeout(r, 600)); // mock network
    createCoupon({
      sellerId: seller.sellerId,
      code: data.code,
      description: data.description,
      discountType: data.discountType,
      discountValue: Number(data.discountValue),
      maxDiscountAmount: data.discountType === 'percentage' ? 500 : null,
      minOrderAmount: Number(data.minOrderAmount),
      maxUsage: 100,
      userLimit: 1,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      applicableProducts: [],
      status: 'active',
    });
    toast.success('Coupon created successfully! 🎉');
    setIsCreating(false);
    reset();
  };

  const inputBase = (error: boolean, valid?: boolean) =>
    `w-full h-12 px-4 rounded-xl border-2 text-base outline-none transition-all duration-200 bg-white focus:ring-4 ${
      error
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
        : valid
        ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
        : 'border-[#F0EDE8] focus:border-[#FF7A00] focus:ring-[#FF7A00]/20'
    }`;

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#1A1A1A]">Coupons & Offers</h1>
          <p className="text-sm text-[#9B8F84]">Manage promotional codes</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
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

      {/* Create Coupon Modal */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-[#F0EDE8] flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#1A1A1A]">Create Coupon</h2>
                  <p className="text-xs text-[#9B8F84]">Set up a new promotional offer</p>
                </div>
                <button onClick={() => { setIsCreating(false); reset(); }} className="w-10 h-10 rounded-full flex items-center justify-center text-[#9B8F84] hover:bg-[#FAFAF8] transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4" noValidate>
                <div className="space-y-1.5">
                  <label htmlFor="code" className="text-xs font-bold text-[#1A1A1A]">Coupon Code <span className="text-red-500">*</span></label>
                  <input
                    id="code"
                    {...register('code', { onChange: (e) => e.target.value = e.target.value.toUpperCase() })}
                    className={inputBase(!!errors.code, touchedFields.code && !errors.code)}
                    placeholder="e.g. SUMMER20"
                  />
                  {errors.code && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.code.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="description" className="text-xs font-bold text-[#1A1A1A]">Description <span className="text-red-500">*</span></label>
                  <input
                    id="description"
                    {...register('description')}
                    className={inputBase(!!errors.description, touchedFields.description && !errors.description)}
                    placeholder="e.g. 20% off all summer collections"
                  />
                  {errors.description && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="discountType" className="text-xs font-bold text-[#1A1A1A]">Type <span className="text-red-500">*</span></label>
                    <select
                      id="discountType"
                      {...register('discountType')}
                      className={`${inputBase(!!errors.discountType, touchedFields.discountType && !errors.discountType)} bg-white`}
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="flat">Flat Amount (₹)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label htmlFor="discountValue" className="text-xs font-bold text-[#1A1A1A]">Value <span className="text-red-500">*</span></label>
                    <input
                      id="discountValue"
                      type="number"
                      {...register('discountValue')}
                      className={inputBase(!!errors.discountValue, touchedFields.discountValue && !errors.discountValue)}
                      placeholder="e.g. 20"
                    />
                    {errors.discountValue && <p className="text-red-500 text-[10px] flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.discountValue.message}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="minOrderAmount" className="text-xs font-bold text-[#1A1A1A]">Minimum Order Amount (₹) <span className="text-red-500">*</span></label>
                  <input
                    id="minOrderAmount"
                    type="number"
                    {...register('minOrderAmount')}
                    className={inputBase(!!errors.minOrderAmount, touchedFields.minOrderAmount && !errors.minOrderAmount)}
                    placeholder="e.g. 1000"
                  />
                  {errors.minOrderAmount && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.minOrderAmount.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="w-full h-12 mt-4 bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-base font-black rounded-xl shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                  {isSubmitting ? 'Creating...' : 'Create Coupon'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
