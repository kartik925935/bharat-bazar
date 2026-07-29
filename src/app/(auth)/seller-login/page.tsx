'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, Eye, EyeOff, Check, Store } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store/auth-store';
import { RedirectIfAuthed } from '@/components/auth/redirect-if-authed';

const sellerLoginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SellerLoginFormValues = z.infer<typeof sellerLoginSchema>;

export default function SellerLoginPage() {
  const router = useRouter();
  const { signIn } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SellerLoginFormValues>({
    resolver: zodResolver(sellerLoginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onFormSubmit = async (values: SellerLoginFormValues) => {
    setLoading(true);
    const result = await signIn(values.email, values.password, 'seller');

    if (result.success) {
      toast.success('Welcome back, Artisan! 🙏 Dashboard ready.');
      router.replace('/seller-dashboard');
    } else {
      toast.error(result.error || 'Invalid credentials or you are not a registered seller.');
      setLoading(false);
    }
  };

  return (
    <RedirectIfAuthed>
      <div className="min-h-screen flex bg-[#FAFAF8]">
        {/* Left Side: Dark Theme with Orange Accents */}
        <div 
          className="hidden lg:flex lg:w-[50%] bg-[#1A0A00] relative flex-col justify-between p-12 text-white overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-5 bg-[#FF7A00] translate-x-1/4 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full opacity-5 bg-[#FF7A00] -translate-x-1/4 translate-y-1/4" />

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 relative z-10 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] flex items-center justify-center text-white font-black text-sm">BB</div>
            <span className="font-black text-2xl text-white tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Artisan Center
            </span>
          </Link>

          {/* Seller Benefits Content */}
          <div className="flex-1 flex flex-col justify-center items-start relative z-10 max-w-md my-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] flex items-center justify-center text-white mb-6 shadow-lg shadow-orange-500/25">
              <Store size={28} />
            </div>
            
            <h2 className="text-3xl font-bold mb-4 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Join 5,000+ artisans selling on Bharat Bazaar
            </h2>
            <p className="text-[#8C8B80] text-sm leading-relaxed mb-8">
              Empower your craft shop with direct customer reach, robust order management, and detailed revenue analytics.
            </p>

            <div className="space-y-4 w-full">
              {[
                { title: 'Zero Commission First Month', desc: 'Keep 100% of your earnings to kickstart your store.' },
                { title: 'Easy KYC & Listing Checks', desc: 'Onboard and start selling within 24 hours.' },
                { title: 'Direct Weekly Settlements', desc: 'Fast bank payouts directly to your verified account.' }
              ].map((benefit) => (
                <div key={benefit.title} className="flex gap-3.5 items-start">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <span className="text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{benefit.title}</h4>
                    <p className="text-xs text-[#8C8B80] mt-0.5">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-around border-t border-white/10 pt-6 text-xs text-white/50 font-semibold relative z-10 shrink-0">
            <span>🎨 Certified Craft Registry</span>
            <span>📍 Regional Hub Support</span>
            <span>💬 Live Seller Assistance</span>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
          {/* Mobile Logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs bg-gradient-to-r from-[#FF7A00] to-[#FF4500]">BB</div>
            <span className="font-black text-xl text-[#FF7A00]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Bharat Bazaar</span>
          </Link>

          <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-[#E5E4DE] shadow-sm space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Artisan Console
              </h2>
              <p className="text-sm text-[#8C8B80]">Manage your artisan store & orders</p>
            </div>

            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5 uppercase tracking-wide">
                  Seller Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C8B80]" />
                  <input
                    type="email"
                    {...register('email')}
                    className={`w-full h-12 pl-11 pr-4 rounded-xl border outline-none text-sm transition-all focus:shadow-md focus:shadow-orange-500/5 ${
                      errors.email ? 'border-red-500 focus:border-red-600' : 'border-[#E5E4DE] focus:border-[#FF7A00]'
                    }`}
                    placeholder="meena@handicrafts.com"
                    disabled={loading}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wide">
                    Password
                  </label>
                  <Link 
                    href="/forgot-password" 
                    className="text-xs font-semibold text-[#FF7A00] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C8B80]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    className={`w-full h-12 pl-11 pr-12 rounded-xl border outline-none text-sm transition-all focus:shadow-md focus:shadow-orange-500/5 ${
                      errors.password ? 'border-red-500 focus:border-red-600' : 'border-[#E5E4DE] focus:border-[#FF7A00]'
                    }`}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8C8B80] hover:text-[#1A1A1A] transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-[#FF7A00] to-[#FF4500] shadow-lg shadow-orange-500/20 active:scale-98 hover:shadow-orange-500/30 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Entering dashboard...
                  </>
                ) : (
                  'Enter Seller Dashboard'
                )}
              </button>
            </form>

            <div className="border-t border-[#E5E4DE] pt-4 text-center text-xs text-[#8C8B80]">
              Not a registered seller yet?{' '}
              <Link href="/seller-register" className="font-bold text-[#FF7A00] hover:underline">
                Apply for Seller Account
              </Link>
            </div>

            <div className="border border-orange-200 bg-[#FFF7ED] rounded-xl p-3 flex justify-between items-center text-[11px] text-orange-900">
              <div>
                <span className="font-bold mr-1">Demo Seller:</span>
                <span>seller@test.com</span>
              </div>
              <button 
                onClick={() => {
                  setValue('email', 'seller@test.com');
                  setValue('password', 'Test@123');
                  toast.info('Autofilled demo seller credentials!');
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-2 py-0.5 rounded text-[10px]"
              >
                Autofill
              </button>
            </div>
          </div>
        </div>
      </div>
    </RedirectIfAuthed>
  );
}
