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

import { useAuthStore } from '@/lib/store/auth-store';

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
  const { signInWithGoogle } = useAuthStore();
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

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const res = await signInWithGoogle('/seller-dashboard', 'seller');
    if (res.success) {
      toast.success('Welcome back via Google!');
      router.push('/seller-dashboard');
    } else {
      toast.error(res.error || 'Google Login failed');
      setIsLoading(false);
    }
  };

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

  const fillDemo = () => {
    setValue('email', 'seller@test.com', { shouldValidate: true });
    setValue('password', 'Seller@123', { shouldValidate: true });
    toast.info('Demo Seller Account Injected');
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

          {/* Demo creds */}
          <div className="bg-[#FFF7ED] border border-orange-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#FF7A00] mb-1">🧪 Demo Seller Account</p>
                <p className="text-xs text-[#4A4540]">Email: seller@test.com</p>
                <p className="text-xs text-[#4A4540]">Pass: Seller@123</p>
              </div>
              <button onClick={fillDemo} type="button" className="px-3 py-1.5 bg-white border border-orange-200 text-[#FF7A00] text-xs font-bold rounded-lg hover:bg-orange-50 transition-colors cursor-pointer">Fill</button>
            </div>
          </div>

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
            
            {/* Separator */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-[1px] bg-[#E5E4DE]" />
              <span className="text-xs font-semibold text-[#8C8B80]">OR CONTINUE WITH</span>
              <div className="flex-1 h-[1px] bg-[#E5E4DE]" />
            </div>

            {/* Google Authentication */}
            <button 
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border border-[#E5E4DE] font-semibold text-[#1A1A1A] hover:bg-[#FAFAF8] active:scale-98 transition-all cursor-pointer disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
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
