'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSellerStore } from '@/lib/store/seller-store';
import { Store, Palmtree, Truck, ShieldCheck, MapPin, Save, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const kycSchema = z.object({
  legalName: z.string().min(2, 'Legal name must be at least 2 characters').max(100, 'Name too long'),
  panNumber: z
    .string()
    .min(1, 'PAN number is required')
    .transform(v => v.trim().toUpperCase())
    .pipe(
      z.string()
        .length(10, 'PAN must be exactly 10 characters')
        .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Invalid PAN — must be 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F)')
    ),
  gstNumber: z
    .string()
    .transform(v => v.trim().toUpperCase())
    .pipe(
      z.string()
        .refine(v => v === '' || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z][Z][0-9A-Z]$/.test(v), {
          message: 'Invalid GSTIN — must be 15 characters (e.g. 22ABCDE1234F1Z5)'
        })
    )
    .optional()
    .or(z.literal('')),
  bankName: z.string().min(2, 'Bank name is required'),
  bankAccountNumber: z.string().regex(/^\d{9,18}$/, 'Bank account must be 9-18 digits'),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format'),
});

type KYCFormData = z.infer<typeof kycSchema>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <motion.p
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="flex items-center gap-1 text-[10px] text-red-500 mt-1 font-medium"
      role="alert"
    >
      <AlertCircle className="w-3 h-3 flex-shrink-0" />
      {message}
    </motion.p>
  );
}

const inputBase = (error: boolean) =>
  `w-full border rounded-xl p-3 text-sm outline-none transition-colors ${
    error
      ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 bg-white'
      : 'border-[#F0EDE8] focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00]/20 bg-white'
  }`;

export default function SellerSettingsPage() {
  const { seller, updateProfile, toggleVacationMode } = useSellerStore();
  const [vacationMsg, setVacationMsg] = useState(seller?.vacationMessage || '');

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = useForm<KYCFormData>({
    resolver: zodResolver(kycSchema),
    mode: 'onChange',
    defaultValues: {
      legalName: seller?.legalName || '',
      panNumber: seller?.panNumber || '',
      gstNumber: '', // Not in mock seller data, but we can manage it in form
      bankName: seller?.bankName || '',
      bankAccountNumber: seller?.bankAccountNumber || '',
      ifscCode: '', // New field for IFSC
    },
  });

  const onSubmit = async (data: KYCFormData) => {
    await new Promise(r => setTimeout(r, 600));
    updateProfile({
      legalName: data.legalName,
      panNumber: data.panNumber,
      bankName: data.bankName,
      bankAccountNumber: data.bankAccountNumber,
      // We would save GST and IFSC to backend here too
    });
    toast.success('KYC and Bank Information updated successfully');
  };

  if (!seller) return null;

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-black text-[#1A1A1A]">Shop Settings</h1>
        <p className="text-sm text-[#9B8F84]">Manage your shop preferences, availability, and financial details</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* KYC Form */}
          <div className="bg-white rounded-2xl border border-[#F0EDE8] p-5 shadow-sm">
            <h3 className="text-sm font-black text-[#1A1A1A] mb-4 uppercase tracking-wide flex items-center gap-2 border-b border-[#F0EDE8] pb-3">
              <ShieldCheck size={16} className="text-[#FF7A00]" /> Financial & KYC Details
            </h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1">Legal Entity Name <span className="text-red-500">*</span></label>
                  <input {...register('legalName')} className={inputBase(!!errors.legalName)} placeholder="e.g. Acme Crafts Pvt Ltd" />
                  <AnimatePresence mode="wait"><FieldError message={errors.legalName?.message} /></AnimatePresence>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1">PAN Number <span className="text-red-500">*</span></label>
                  <input
                    {...register('panNumber')}
                    onChange={(e) => {
                      e.target.value = e.target.value.toUpperCase().replace(/\s/g, '');
                      register('panNumber').onChange(e);
                    }}
                    className={inputBase(!!errors.panNumber)}
                    placeholder="ABCDE1234F"
                    maxLength={10}
                  />
                  <p className="text-[10px] text-[#9B8F84] mt-0.5">5 letters · 4 digits · 1 letter (10 chars)</p>
                  <AnimatePresence mode="wait"><FieldError message={errors.panNumber?.message} /></AnimatePresence>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1">GST Number <span className="text-[#9B8F84] font-normal">(Optional)</span></label>
                  <input
                    {...register('gstNumber')}
                    onChange={(e) => {
                      e.target.value = e.target.value.toUpperCase().replace(/\s/g, '');
                      register('gstNumber').onChange(e);
                    }}
                    className={inputBase(!!errors.gstNumber)}
                    placeholder="22ABCDE1234F1Z5"
                    maxLength={15}
                  />
                  <p className="text-[10px] text-[#9B8F84] mt-0.5">2 digits · 5 letters · 4 digits · 4 chars (15 chars)</p>
                  <AnimatePresence mode="wait"><FieldError message={errors.gstNumber?.message} /></AnimatePresence>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-[#F0EDE8]">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1">Bank Name <span className="text-red-500">*</span></label>
                  <input {...register('bankName')} className={inputBase(!!errors.bankName)} placeholder="e.g. State Bank of India" />
                  <AnimatePresence mode="wait"><FieldError message={errors.bankName?.message} /></AnimatePresence>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1">Account Number <span className="text-red-500">*</span></label>
                  <input {...register('bankAccountNumber')} className={inputBase(!!errors.bankAccountNumber)} placeholder="1234567890" />
                  <AnimatePresence mode="wait"><FieldError message={errors.bankAccountNumber?.message} /></AnimatePresence>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1">IFSC Code <span className="text-red-500">*</span></label>
                  <input {...register('ifscCode')} className={inputBase(!!errors.ifscCode)} placeholder="SBIN0001234" />
                  <AnimatePresence mode="wait"><FieldError message={errors.ifscCode?.message} /></AnimatePresence>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={!isDirty || !isValid || isSubmitting}
                  className={`px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                    (!isDirty || !isValid || isSubmitting) ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-95 hover:-translate-y-0.5 shadow-orange-500/20'
                  }`}
                >
                  {isSubmitting ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Save size={14} /> Save Details</>}
                </button>
              </div>
            </form>
          </div>

          {/* Vacation Mode */}
          <div className="bg-white rounded-2xl border border-[#F0EDE8] overflow-hidden shadow-sm">
            <div className="p-5 border-b border-[#F0EDE8] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${seller.vacationMode ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500'}`}>
                  <Palmtree size={20} />
                </div>
                <div>
                  <h2 className="text-base font-black text-[#1A1A1A]">Vacation Mode</h2>
                  <p className="text-xs text-[#9B8F84]">Temporarily hide your products from the store</p>
                </div>
              </div>
              <button
                onClick={() => { toggleVacationMode(); toast.success(seller.vacationMode ? 'Vacation mode off' : 'Vacation mode on'); }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${seller.vacationMode ? 'bg-[#FF7A00]' : 'bg-[#D4C9BF]'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${seller.vacationMode ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            {seller.vacationMode && (
              <div className="p-5 bg-[#FAFAF8]">
                <label className="block text-xs font-bold text-[#1A1A1A] mb-2">Message to Customers</label>
                <textarea
                  value={vacationMsg}
                  onChange={e => setVacationMsg(e.target.value)}
                  className="w-full border border-[#F0EDE8] rounded-xl p-3 text-sm focus:border-[#FF7A00] outline-none"
                  rows={2}
                  placeholder="E.g. We are on a break for Diwali. Will be back on..."
                />
                <button
                  onClick={() => { updateProfile({ vacationMessage: vacationMsg }); toast.success('Message saved'); }}
                  className="mt-3 px-4 py-2 bg-[#1A1A1A] text-white text-xs font-bold rounded-xl hover:bg-black transition-colors"
                >
                  Save Message
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Shipping & Processing */}
          <div className="bg-white rounded-2xl border border-[#F0EDE8] p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-5 border-b border-[#F0EDE8] pb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><Truck size={20} /></div>
              <div>
                <h2 className="text-sm font-black text-[#1A1A1A] uppercase tracking-wide">Shipping Config</h2>
                <p className="text-[10px] text-[#9B8F84] mt-0.5">How you handle orders</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">Standard Processing Time</label>
                <select 
                  className="w-full border border-[#F0EDE8] rounded-xl p-3 text-sm bg-white focus:border-[#FF7A00] outline-none"
                  value={seller.processingDays}
                  onChange={e => { updateProfile({ processingDays: Number(e.target.value) }); toast.success('Updated Processing Time'); }}
                >
                  <option value={1}>1 Day</option>
                  <option value={2}>2 Days</option>
                  <option value={3}>3 Days</option>
                  <option value={5}>5 Days</option>
                  <option value={7}>7 Days</option>
                </select>
                <p className="text-[10px] text-[#9B8F84] mt-1.5">Time taken to pack and dispatch after receiving an order</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
