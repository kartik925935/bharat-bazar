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

import { FormInput } from '@/components/ui/form-input';

const superAdminLoginSchema = z.object({
  email: z.string()
    .min(1, "Administrator ID is required")
    .email("Enter valid administrator email")
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(1, "Security clearance key is required")
    .min(12, "Security key must be at least 12 characters"),
  totpCode: z.string()
    .regex(/^\d{6}$/, "2FA code must be exactly 6 digits")
    .optional()
    .or(z.literal('')), // Enable when 2FA is implemented
  adminAccessCode: z.string()
    .min(1, "Access code is required")
    .regex(/^[A-Z0-9]{8,16}$/, "Invalid access code format"),
  ipWhitelistAck: z.boolean()
    .refine(val => val === true, "You must acknowledge accessing from authorized network"),
});

type LoginFormValues = z.infer<typeof superAdminLoginSchema>;

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/super-admin/dashboard';
  
  const { signIn, isAuthenticated, user, signOut, setUser } = useAuthStore();
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
    watch,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(superAdminLoginSchema),
    mode: "onChange",
    defaultValues: { email: '', password: '', totpCode: '', adminAccessCode: '', ipWhitelistAck: false },
  });

  const onFormSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setShake(false);
    
    // Demo bypass for frontend-only testing
    if (values.email === 'admin@bharatbazaar.com' && values.password === 'Admin@12345678' && values.adminAccessCode === 'ACCESS12345678') {
      await new Promise(r => setTimeout(r, 1000)); // Simulate network
      setUser({
        id: 'demo-admin-1',
        email: 'admin@bharatbazaar.com',
        name: 'Super Admin',
        role: 'admin',
        createdAt: new Date().toISOString(),
      });
      toast.success('Authentication successful. Welcome Commander.');
      setLoading(false);
      return;
    }

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
    setValue('password', 'Admin@12345678', { shouldValidate: true });
    setValue('adminAccessCode', 'ACCESS12345678', { shouldValidate: true });
    setValue('ipWhitelistAck', true, { shouldValidate: true });
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
          <div className="bg-[#111118]/90 backdrop-blur-xl border border-[#1E1E2E] p-8 rounded-3xl shadow-2xl">
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
              <FormInput
                label="Administrator ID"
                placeholder="sysadmin@bharatbazaar.com"
                type="email"
                required
                register={register('email')}
                error={errors.email}
                isValid={!errors.email && !!watch('email')}
                disabled={loading}
                leftIcon={<Terminal size={16} />}
                inputClassName="bg-[#0A0A0F] border-[#1E1E2E] text-[#F0F0F8] placeholder:text-[#5C5C78]"
                labelClassName="text-[10px] text-[#5C5C78] uppercase tracking-widest font-bold"
              />

              <FormInput
                label="Security Clearance Key"
                placeholder="Enter clearance key"
                type="password"
                required
                register={register('password')}
                error={errors.password}
                isValid={!errors.password && !!watch('password')}
                disabled={loading}
                leftIcon={<Key size={16} />}
                inputClassName="bg-[#0A0A0F] border-[#1E1E2E] text-[#F0F0F8] placeholder:text-[#5C5C78]"
                labelClassName="text-[10px] text-[#5C5C78] uppercase tracking-widest font-bold"
              />

              <FormInput
                label="Admin Access Code"
                placeholder="ACCESS-XXXX-XXXX"
                type="text"
                required
                register={register('adminAccessCode')}
                error={errors.adminAccessCode}
                isValid={!errors.adminAccessCode && !!watch('adminAccessCode')}
                disabled={loading}
                leftIcon={<Lock size={16} />}
                inputClassName="bg-[#0A0A0F] border-[#1E1E2E] text-[#F0F0F8] placeholder:text-[#5C5C78]"
                labelClassName="text-[10px] text-[#5C5C78] uppercase tracking-widest font-bold"
              />

              {/* IP Whitelist Checkbox */}
              <div className="space-y-2 pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    {...register('ipWhitelistAck')}
                    className="mt-1 rounded border-[#1E1E2E] bg-[#0A0A0F] text-[#FF7A00] focus:ring-[#FF7A00]/20 h-4 w-4"
                  />
                  <span className="text-[11px] text-[#5C5C78] leading-tight">
                    I acknowledge that I am accessing this portal from an authorized and whitelisted IP network.
                  </span>
                </label>
                {errors.ipWhitelistAck && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.ipWhitelistAck.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !isValid}
                className="w-full h-12 rounded-xl text-[#0A0A0F] font-black text-sm uppercase tracking-widest bg-gradient-to-r from-[#FF7A00] to-[#FF4500] hover:shadow-[0_0_20px_rgba(255,122,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
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
