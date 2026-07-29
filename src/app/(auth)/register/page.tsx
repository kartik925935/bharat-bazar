'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store/auth-store';
import { RedirectIfAuthed } from '@/components/auth/redirect-if-authed';

const registerSchema = z.object({
  fullName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number starting with 6-9'),
  password: z.string()
    .min(8, 'Minimum 8 characters')
    .regex(/[A-Z]/, 'One uppercase letter required')
    .regex(/[0-9]/, 'One number required')
    .regex(/[^A-Za-z0-9]/, 'One special character required'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  terms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms & conditions' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuthStore();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', phone: '', password: '', confirmPassword: '', terms: true },
  });

  // Capitalize first letter of each word
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const capitalized = value.replace(/\b\w/g, (char) => char.toUpperCase());
    setValue('fullName', capitalized, { shouldValidate: true });
  };

  // Indian phone formatter (+91 prefix shown, inputs formatted as numbers only)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '').slice(0, 10);
    setValue('phone', rawVal, { shouldValidate: true });
  };

  // Check password strength
  const getPasswordStrength = () => {
    let score = 0;
    if (passwordValue.length >= 8) score++;
    if (/[A-Z]/.test(passwordValue)) score++;
    if (/[0-9]/.test(passwordValue)) score++;
    if (/[^A-Za-z0-9]/.test(passwordValue)) score++;
    return score;
  };

  const strengthScore = getPasswordStrength();
  const strengthLabels = ['Too Weak', 'Weak', 'Fair', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];

  const onFormSubmit = async (values: RegisterFormValues) => {
    setLoading(true);
    const result = await signUp({
      fullName: values.fullName,
      email: values.email,
      phone: `+91 ${values.phone.slice(0, 5)} ${values.phone.slice(5)}`,
      password: values.password,
      role: 'customer',
    });

    if (result.success) {
      toast.success('Welcome to Bharat Bazaar! 🎉 Start exploring authentic Indian crafts.');
      router.replace('/dashboard');
    } else {
      toast.error(result.error || 'Sign up failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <RedirectIfAuthed>
      <div className="min-h-screen flex bg-[#FAFAF8]">
        {/* Left Side Brand Info */}
        <div 
          className="hidden lg:flex lg:w-[50%] bg-[#FF7A00] relative flex-col justify-between p-12 text-white overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #FF7A00, #FF4500)' }}
        >
          {/* Backdrops */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-10 bg-white translate-x-1/4 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full opacity-10 bg-white -translate-x-1/4 translate-y-1/4" />

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 relative z-10 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-black text-sm">BB</div>
            <span className="font-black text-2xl text-white tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Bharat Bazaar
            </span>
          </Link>

          {/* Hero Banner */}
          <div className="flex-1 flex flex-col justify-center items-center relative z-10 my-8">
            <div className="text-center text-white max-w-sm">
              <div className="text-7xl mb-6">🎁</div>
              <h2 className="text-3xl font-bold mb-4 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Join India's Largest Craft Community
              </h2>
              <p className="text-white/80 text-sm leading-relaxed mb-6">
                Connect directly with certified rural artisans and get **15% off** your first order with coupon code <code className="bg-white/25 px-1.5 py-0.5 rounded font-mono text-xs">WELCOME100</code>!
              </p>
            </div>
          </div>

          <div className="flex items-center justify-around border-t border-white/20 pt-6 text-xs text-white/90 font-semibold relative z-10 shrink-0">
            <span>🛡️ 10k+ Artisans</span>
            <span>⭐ Authentic Products</span>
            <span>💳 Secure Payments</span>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs bg-gradient-to-r from-[#FF7A00] to-[#FF4500]">BB</div>
            <span className="font-black text-xl text-[#FF7A00]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Bharat Bazaar</span>
          </Link>

          <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-[#E5E4DE] shadow-sm space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Create an account
              </h2>
              <p className="text-sm text-[#8C8B80]">Join thousands of craft enthusiasts</p>
            </div>

            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5 uppercase tracking-wide">
                  Full Name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C8B80]" />
                  <input
                    type="text"
                    {...register('fullName')}
                    onChange={handleNameChange}
                    className={`w-full h-12 pl-11 pr-4 rounded-xl border outline-none text-sm transition-all focus:shadow-md focus:shadow-orange-500/5 ${
                      errors.fullName ? 'border-red-500 focus:border-red-600' : 'border-[#E5E4DE] focus:border-[#FF7A00]'
                    }`}
                    placeholder="Priya Sharma"
                    disabled={loading}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5 uppercase tracking-wide">
                  Email address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C8B80]" />
                  <input
                    type="email"
                    {...register('email')}
                    className={`w-full h-12 pl-11 pr-4 rounded-xl border outline-none text-sm transition-all focus:shadow-md focus:shadow-orange-500/5 ${
                      errors.email ? 'border-red-500 focus:border-red-600' : 'border-[#E5E4DE] focus:border-[#FF7A00]'
                    }`}
                    placeholder="you@email.com"
                    disabled={loading}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5 uppercase tracking-wide">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C8B80]" />
                  <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm text-[#1A1A1A] font-semibold">
                    +91
                  </span>
                  <input
                    type="tel"
                    {...register('phone')}
                    onChange={handlePhoneChange}
                    className={`w-full h-12 pl-20 pr-4 rounded-xl border outline-none text-sm transition-all focus:shadow-md focus:shadow-orange-500/5 ${
                      errors.phone ? 'border-red-500 focus:border-red-600' : 'border-[#E5E4DE] focus:border-[#FF7A00]'
                    }`}
                    placeholder="98765 43210"
                    disabled={loading}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C8B80]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    onChange={(e) => {
                      register('password').onChange(e);
                      setPasswordValue(e.target.value);
                    }}
                    className={`w-full h-12 pl-11 pr-12 rounded-xl border outline-none text-sm transition-all focus:shadow-md focus:shadow-orange-500/5 ${
                      errors.password ? 'border-red-500 focus:border-red-600' : 'border-[#E5E4DE] focus:border-[#FF7A00]'
                    }`}
                    placeholder="Create a strong password"
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
                {passwordValue && (
                  <div className="mt-2 space-y-1.5">
                    {/* Progress indicator */}
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#8C8B80]">
                      <span>Password Strength:</span>
                      <span className={
                        strengthScore === 1 ? 'text-red-500' :
                        strengthScore === 2 ? 'text-orange-500' :
                        strengthScore === 3 ? 'text-yellow-500' : 'text-green-500'
                      }>
                        {strengthLabels[Math.max(0, strengthScore - 1)]}
                      </span>
                    </div>
                    <div className="flex gap-1 h-1.5 w-full">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`flex-1 h-full rounded-full transition-all ${
                            i < strengthScore ? strengthColors[strengthScore - 1] : 'bg-[#E5E4DE]/50'
                          }`}
                        />
                      ))}
                    </div>
                    {/* Requirements validation indicator */}
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1 text-[10px] text-[#8C8B80]">
                      <div className="flex items-center gap-1">
                        <span className={passwordValue.length >= 8 ? 'text-green-500' : ''}>
                          {passwordValue.length >= 8 ? '✓' : '•'} Min 8 chars
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={/[A-Z]/.test(passwordValue) ? 'text-green-500' : ''}>
                          {/[A-Z]/.test(passwordValue) ? '✓' : '•'} 1 Uppercase
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={/[0-9]/.test(passwordValue) ? 'text-green-500' : ''}>
                          {/[0-9]/.test(passwordValue) ? '✓' : '•'} 1 Number
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={/[^A-Za-z0-9]/.test(passwordValue) ? 'text-green-500' : ''}>
                          {/[^A-Za-z0-9]/.test(passwordValue) ? '✓' : '•'} 1 Special Char
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5 uppercase tracking-wide">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C8B80]" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword')}
                    className={`w-full h-12 pl-11 pr-12 rounded-xl border outline-none text-sm transition-all focus:shadow-md focus:shadow-orange-500/5 ${
                      errors.confirmPassword ? 'border-red-500 focus:border-red-600' : 'border-[#E5E4DE] focus:border-[#FF7A00]'
                    }`}
                    placeholder="Repeat password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8C8B80] hover:text-[#1A1A1A] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="space-y-2 pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    {...register('terms')}
                    className="mt-1 rounded border-[#E5E4DE] text-[#FF7A00] focus:ring-[#FF7A00] h-4 w-4"
                  />
                  <span className="text-xs text-[#555449] leading-tight">
                    I agree to Bharat Bazaar's{' '}
                    <Link href="/terms" target="_blank" className="font-semibold text-[#FF7A00] hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy" target="_blank" className="font-semibold text-[#FF7A00] hover:underline">Privacy Policy</Link>
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-xs text-red-500">{errors.terms.message}</p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-[#FF7A00] to-[#FF4500] shadow-lg shadow-orange-500/20 active:scale-98 hover:shadow-orange-500/30 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <p className="text-xs text-center text-[#8C8B80]">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-[#FF7A00] hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </RedirectIfAuthed>
  );
}
