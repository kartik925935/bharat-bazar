'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { useSellerStore } from '@/lib/store/seller-store';
import { toast } from 'sonner';
import { FormInput } from '@/components/ui/form-input';

const sellerLoginSchema = z.object({
  email: z.string()
    .min(1, "Seller email is required")
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(1, "Password is required")
    .min(6, "Invalid password"),
  rememberMe: z.boolean().default(false),
});

type SellerLoginFormValues = z.infer<typeof sellerLoginSchema>;

export default function SellerLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useSellerStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(sellerLoginSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onFormSubmit = async (values: SellerLoginFormValues) => {
    setIsLoading(true);
    const res = await login(values.email, values.password);
    setIsLoading(false);
    if (res.success) {
      toast.success('Welcome back!');
      router.push('/seller-dashboard');
    } else {
      toast.error(res.error || 'Login failed');
    }
  };


  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Left panel (Image/Brand) */}
      <div className="hidden md:flex flex-col justify-between w-1/2 bg-gradient-to-br from-[#1A0A00] to-[#2D1000] p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, #FF7A00 0%, transparent 70%)' }} />
        
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-16 text-white/80 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Back to Storefront
          </Link>
          
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF7A00] to-[#FF4500] flex items-center justify-center text-white font-black text-xl mb-6 shadow-xl shadow-orange-500/20">
            BB
          </div>
          <h1 className="text-4xl font-black mb-4 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Your craft deserves<br/>the world's attention.
          </h1>
          <p className="text-lg text-white/70 max-w-md">Join Bharat Bazaar's seller community and take your traditional handcrafted products to millions of customers across India.</p>
        </div>

        <div className="relative z-10 space-y-4 text-sm text-white/80">
          <div className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-emerald-400">✓</span> Zero commission for 30 days</div>
          <div className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-emerald-400">✓</span> Weekly bank settlements</div>
          <div className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-emerald-400">✓</span> Dedicated artisan support</div>
        </div>
      </div>

      {/* Right panel (Form) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-md w-full">
          <div className="md:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#FF4500] flex items-center justify-center text-white font-black text-lg">BB</div>
            <span className="font-black text-xl text-[#1A1A1A]">Bharat Bazaar</span>
          </div>

          <h2 className="text-3xl font-black text-[#1A1A1A] mb-2">Welcome Back, Artisan! 🙏</h2>
          <p className="text-sm text-[#9B8F84] mb-8">Sign in to manage your shop</p>



          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <FormInput
              label="Email Address"
              placeholder="your@email.com"
              type="email"
              required
              register={register('email')}
              error={errors.email}
              isValid={!errors.email && !!watch('email')}
              disabled={isLoading}
              leftIcon={<Mail size={16} />}
            />

            <div>
              <div className="flex justify-end mb-[-24px] relative z-10 mr-1">
                <a href="#" className="text-xs font-semibold text-[#FF7A00] hover:underline bg-white px-1">
                  Forgot password?
                </a>
              </div>
              <FormInput
                label="Password"
                placeholder="••••••••"
                type="password"
                required
                register={register('password')}
                error={errors.password}
                isValid={!errors.password && !!watch('password')}
                disabled={isLoading}
                leftIcon={<Lock size={16} />}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 mt-4 bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-sm font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0 cursor-pointer"
            >
              {isLoading ? 'Signing in...' : <>Sign In to Seller Portal <ArrowRight size={16} /></>}
            </button>
            

          </form>

          <div className="mt-8 text-center text-sm text-[#9B8F84]">
            New seller? <Link href="/seller-register" className="font-bold text-[#FF7A00] hover:underline">Register your shop →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
