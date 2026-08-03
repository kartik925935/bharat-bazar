'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, AlertTriangle, Settings2, Database, AlertCircle, Loader2 } from 'lucide-react';
import { useSuperAdminStore } from '@/lib/store/super-admin-store';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const settingsSchema = z.object({
  siteName: z.string().min(2, 'Platform Name must be at least 2 characters'),
  siteTagline: z.string().min(2, 'Tagline must be at least 2 characters'),
  supportEmail: z.string().email('Valid support email required'),
  financeEmail: z.string().email('Valid finance email required'),
  settlementCycleDays: z
    .number({ invalid_type_error: 'Must be a number' })
    .int('Must be a whole number')
    .min(1, 'Minimum 1 day')
    .max(30, 'Maximum 30 days'),
  minWithdrawalAmount: z
    .number({ invalid_type_error: 'Must be a number' })
    .min(100, 'Minimum withdrawal is ₹100'),
  defaultCommissionRate: z
    .number({ invalid_type_error: 'Must be a number' })
    .min(0, 'Commission cannot be negative')
    .max(100, 'Commission cannot exceed 100%'),
  maxProductsPerSeller: z
    .number({ invalid_type_error: 'Must be a number' })
    .int('Must be a whole number')
    .min(1, 'Minimum 1 product'),
  maintenanceMode: z.boolean(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

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
  `w-full h-10 bg-[#111118] border rounded-xl px-4 text-xs text-[#F0F0F8] outline-none transition-colors ${
    error
      ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20'
      : 'border-[#1E1E2E] focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00]/20'
  }`;

export default function PlatformSettingsPage() {
  const { platformSettings, updatePlatformSettings } = useSuperAdminStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    mode: 'onChange',
    defaultValues: {
      siteName: platformSettings.siteName,
      siteTagline: platformSettings.siteTagline,
      supportEmail: platformSettings.supportEmail,
      financeEmail: platformSettings.financeEmail,
      settlementCycleDays: platformSettings.settlementCycleDays,
      minWithdrawalAmount: platformSettings.minWithdrawalAmount,
      defaultCommissionRate: platformSettings.defaultCommissionRate,
      maxProductsPerSeller: platformSettings.maxProductsPerSeller,
      maintenanceMode: platformSettings.maintenanceMode,
    },
  });

  const isMaintenance = watch('maintenanceMode');

  const onSubmit = async (data: SettingsFormData) => {
    await new Promise((r) => setTimeout(r, 600));
    updatePlatformSettings(data);
    toast.success('Platform configurations saved successfully');
  };

  return (
    <div className="space-y-6 pb-20 relative">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-[#F0F0F8]" style={{ fontFamily: "'Playfair Display', serif" }}>
              ⚙️ Platform Configurations
            </h1>
            <p className="text-xs text-[#9898B0] mt-0.5">Global settings, features toggles, and system parameters</p>
          </div>
          <button
            type="submit"
            disabled={!isDirty || !isValid || isSubmitting}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-xs font-bold transition-all shadow-lg ${
              (!isDirty || !isValid || isSubmitting) ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 hover:-translate-y-0.5'
            }`}
          >
            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Maintenance Mode Toggle - Move it to top for visibility */}
        <div className={`border rounded-2xl p-4 mb-6 flex items-center justify-between transition-colors ${isMaintenance ? 'bg-[#F59E0B]/10 border-[#F59E0B]/30' : 'bg-[#16161F] border-[#1E1E2E]'}`}>
          <div className="flex gap-3 items-center">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isMaintenance ? 'bg-[#F59E0B]/20 text-[#F59E0B]' : 'bg-[#111118] text-[#5C5C78]'}`}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className={`text-sm font-bold ${isMaintenance ? 'text-[#F59E0B]' : 'text-[#F0F0F8]'}`}>Maintenance Mode</h3>
              <p className="text-xs text-[#9898B0] mt-0.5">Take the platform offline for non-admins.</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" {...register('maintenanceMode')} />
            <div className="w-11 h-6 bg-[#111118] border border-[#1E1E2E] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#5C5C78] peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F59E0B] peer-checked:border-[#F59E0B]"></div>
          </label>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl p-6 space-y-5 shadow-xl">
            <h2 className="text-sm font-black text-[#F0F0F8] border-b border-[#1E1E2E] pb-3 flex items-center gap-2">
              <Settings2 size={16} className="text-[#FF7A00]" /> General Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] font-bold text-[#5C5C78] uppercase mb-1 block">Platform Name</label>
                <input {...register('siteName')} className={inputBase(!!errors.siteName)} />
                <AnimatePresence mode="wait"><FieldError message={errors.siteName?.message} /></AnimatePresence>
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#5C5C78] uppercase mb-1 block">Tagline</label>
                <input {...register('siteTagline')} className={inputBase(!!errors.siteTagline)} />
                <AnimatePresence mode="wait"><FieldError message={errors.siteTagline?.message} /></AnimatePresence>
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#5C5C78] uppercase mb-1 block">Support Email</label>
                <input {...register('supportEmail')} className={inputBase(!!errors.supportEmail)} />
                <AnimatePresence mode="wait"><FieldError message={errors.supportEmail?.message} /></AnimatePresence>
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#5C5C78] uppercase mb-1 block">Finance Dept Email</label>
                <input {...register('financeEmail')} className={inputBase(!!errors.financeEmail)} />
                <AnimatePresence mode="wait"><FieldError message={errors.financeEmail?.message} /></AnimatePresence>
              </div>
            </div>
          </div>

          <div className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl p-6 space-y-5 shadow-xl">
            <h2 className="text-sm font-black text-[#F0F0F8] border-b border-[#1E1E2E] pb-3 flex items-center gap-2">
              <Database size={16} className="text-[#FF7A00]" /> Operational Parameters
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] font-bold text-[#5C5C78] uppercase mb-1 block">Settlement Cycle (Days)</label>
                <input
                  type="number"
                  {...register('settlementCycleDays', { valueAsNumber: true })}
                  className={`${inputBase(!!errors.settlementCycleDays)} font-mono`}
                />
                <AnimatePresence mode="wait"><FieldError message={errors.settlementCycleDays?.message} /></AnimatePresence>
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#5C5C78] uppercase mb-1 block">Min Withdrawal (₹)</label>
                <input
                  type="number"
                  {...register('minWithdrawalAmount', { valueAsNumber: true })}
                  className={`${inputBase(!!errors.minWithdrawalAmount)} font-mono`}
                />
                <AnimatePresence mode="wait"><FieldError message={errors.minWithdrawalAmount?.message} /></AnimatePresence>
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#5C5C78] uppercase mb-1 block">Default Commission (%)</label>
                <input
                  type="number"
                  {...register('defaultCommissionRate', { valueAsNumber: true })}
                  className={`${inputBase(!!errors.defaultCommissionRate)} font-mono`}
                />
                <AnimatePresence mode="wait"><FieldError message={errors.defaultCommissionRate?.message} /></AnimatePresence>
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#5C5C78] uppercase mb-1 block">Max Products / Seller</label>
                <input
                  type="number"
                  {...register('maxProductsPerSeller', { valueAsNumber: true })}
                  className={`${inputBase(!!errors.maxProductsPerSeller)} font-mono`}
                />
                <AnimatePresence mode="wait"><FieldError message={errors.maxProductsPerSeller?.message} /></AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
