'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Shield, Lock, Eye, EyeOff, Terminal, Key } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store/auth-store';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/super-admin/dashboard';
  
  const { signIn, isAuthenticated, user, signOut } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  // If already admin, bounce to dashboard
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      router.replace(returnUrl);
    }
  }, [isAuthenticated, user, router, returnUrl]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onFormSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setShake(false);
    
    const result = await signIn(values.email, values.password);
    
    if (result.success) {
      const activeUser = useAuthStore.getState().user;
      
      if (activeUser?.role !== 'admin') {
        setShake(true);
        toast.error('ACCESS DENIED: Insufficient permissions.');
        setLoading(false);
        return;
      }
      
      toast.success('Authentication successful. Welcome Commander.');
      // router.replace is handled by useEffect
    } else {
      setShake(true);
      toast.error('INVALID CREDENTIALS');
      setLoading(false);
    }
  };

  const autofillDemo = () => {
    setValue('email', 'admin@bharatbazaar.com', { shouldValidate: true });
    setValue('password', 'Admin@123', { shouldValidate: true });
    toast.info('Super Admin credentials injected.');
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F] font-mono relative overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `linear-gradient(#1E1E2E 1px, transparent 1px), linear-gradient(90deg, #1E1E2E 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        <motion.div 
          animate={shake ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF7A00] to-[#FF4500] flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(255,122,0,0.3)]">
              <Shield size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-black text-[#F0F0F8] tracking-widest uppercase">
              Command Center
            </h1>
            <p className="text-[#FF7A00] text-xs font-bold mt-2 tracking-widest uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-[#FF7A00] rounded-full animate-pulse" />
              Restricted Access
            </p>
          </div>

          {/* Login Form Box */}
          <div className="bg-[#111118]/80 backdrop-blur-xl border border-[#1E1E2E] p-8 rounded-3xl shadow-2xl">
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-[#5C5C78] mb-1.5 uppercase tracking-widest">
                  Administrator ID
                </label>
                <div className="relative">
                  <Terminal size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5C5C78]" />
                  <input
                    type="email"
                    {...register('email')}
                    className={`w-full h-12 pl-11 pr-4 bg-[#0A0A0F] border rounded-xl outline-none text-sm text-[#F0F0F8] transition-all ${
                      errors.email ? 'border-[#EF4444] focus:border-[#EF4444]' : 'border-[#1E1E2E] focus:border-[#FF7A00]'
                    }`}
                    placeholder="sysadmin@bharatbazaar.com"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#5C5C78] mb-1.5 uppercase tracking-widest">
                  Security Clearance Key
                </label>
                <div className="relative">
                  <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5C5C78]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    className={`w-full h-12 pl-11 pr-12 bg-[#0A0A0F] border rounded-xl outline-none text-sm text-[#F0F0F8] transition-all ${
                      errors.password ? 'border-[#EF4444] focus:border-[#EF4444]' : 'border-[#1E1E2E] focus:border-[#FF7A00]'
                    }`}
                    placeholder="Enter clearance key"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5C5C78] hover:text-[#F0F0F8] transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl text-[#0A0A0F] font-black text-sm uppercase tracking-widest bg-gradient-to-r from-[#FF7A00] to-[#FF4500] hover:shadow-[0_0_20px_rgba(255,122,0,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-[#0A0A0F] border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Authorize Entry'
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-[#1E1E2E] text-center">
              <button
                type="button"
                onClick={autofillDemo}
                className="text-xs font-bold text-[#5C5C78] hover:text-[#FF7A00] transition-colors underline decoration-dashed underline-offset-4"
              >
                Inject Demo Administrator Profile
              </button>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link href="/" className="text-[10px] font-bold text-[#5C5C78] hover:text-[#F0F0F8] uppercase tracking-widest flex items-center justify-center gap-2">
              <Lock size={10} />
              Return to Public Storefront
            </Link>
          </div>
        </motion.div>
      </div>
  );
}
