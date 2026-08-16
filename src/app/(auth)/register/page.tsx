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
import { checkEmailRole } from '@/actions/auth/check-email-role';

import { FormInput } from '@/components/ui/form-input';

const registerSchema = z.object({
  fullName: z.string()
    .min(1, "Full name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens and apostrophes")
    .transform(val => val.trim()),
  email: z.string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address")
    .max(100, "Email is too long")
    .toLowerCase()
    .trim(),
  phone: z.string()
    .min(1, "Mobile number is required")
    .regex(/^[6-9]\d{9}$/, "Enter valid 10-digit Indian mobile number (must start with 6, 7, 8, or 9)"),
  password: z.string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long")
    .regex(/[A-Z]/, "Must include at least one uppercase letter (A-Z)")
    .regex(/[a-z]/, "Must include at least one lowercase letter (a-z)")
    .regex(/[0-9]/, "Must include at least one number (0-9)")
    .regex(/[!@#$%^&*()_,.?":{}|<>]/, "Must include at least one special character (!@#$%_...)"),
  confirmPassword: z.string()
    .min(1, "Please confirm your password"),
  dateOfBirth: z.string()
    .optional()
    .refine(val => {
      if (!val) return true;
      const age = new Date().getFullYear() - new Date(val).getFullYear();
      return age >= 13;
    }, "You must be at least 13 years old to register"),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  referralCode: z.string()
    .regex(/^[A-Z0-9]{6,10}$/, "Invalid referral code format")
    .optional()
    .or(z.literal('')),
  terms: z.boolean()
    .refine(val => val === true, "You must accept the Terms & Conditions to continue"),
  marketingConsent: z.boolean().optional().default(false),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuthStore();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');
  const [emailRoleError, setEmailRoleError] = useState<string | null>(null);
  const [emailChecking, setEmailChecking] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: { fullName: '', email: '', phone: '', password: '', confirmPassword: '', terms: false },
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

  // Live email role check — run on blur to catch seller emails early
  const handleEmailBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const email = e.target.value.trim();
    if (!email || !email.includes('@')) return;
    setEmailChecking(true);
    setEmailRoleError(null);
    try {
      const result = await checkEmailRole(email);
      if (result.exists && result.role && result.role !== 'customer') {
        setEmailRoleError(
          `This email is already registered as a seller account. Please use a different email or sign in as a seller.`
        );
      }
    } catch { /* fail silently */ }
    finally { setEmailChecking(false); }
  };

  // Check password strength
  const getPasswordStrength = () => {
    const pwd = watch('password') || '';
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
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
              <FormInput
                label="Full Name"
                placeholder="Priya Sharma"
                required
                register={register('fullName')}
                error={errors.fullName}
                isValid={!errors.fullName && !!watch('fullName')}
                disabled={loading}
                leftIcon={<User size={16} />}
              />

              {/* Email */}
              <FormInput
                label="Email address"
                placeholder="you@email.com"
                type="email"
                required
                register={{
                  ...register('email'),
                  onBlur: handleEmailBlur,
                }}
                error={emailRoleError ? { message: emailRoleError } : errors.email}
                isValid={!errors.email && !emailRoleError && !!watch('email')}
                disabled={loading}
                leftIcon={emailChecking ? <span className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin inline-block" /> : <Mail size={16} />}
              />

              {/* Phone */}
              <FormInput
                label="Phone Number"
                placeholder="98765 43210"
                type="tel"
                required
                prefix="+91"
                register={register('phone')}
                error={errors.phone}
                isValid={!errors.phone && !!watch('phone')}
                disabled={loading}
              />

              {/* Password */}
              <div>
                <FormInput
                  label="Password"
                  placeholder="Create a strong password"
                  type="password"
                  required
                  register={register('password')}
                  error={errors.password}
                  isValid={!errors.password && !!watch('password')}
                  disabled={loading}
                  leftIcon={<Lock size={16} />}
                />
                
                {watch('password') && (
                  <div className="mt-2 space-y-1.5">
                    {/* Progress indicator */}
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#8C8B80]">
                      <span>Password Strength:</span>
                      <span className={
                        getPasswordStrength() === 1 ? 'text-red-500' :
                        getPasswordStrength() === 2 ? 'text-orange-500' :
                        getPasswordStrength() === 3 ? 'text-yellow-500' : 'text-green-500'
                      }>
                        {strengthLabels[Math.max(0, getPasswordStrength() - 1)]}
                      </span>
                    </div>
                    <div className="flex gap-1 h-1.5 w-full">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`flex-1 h-full rounded-full transition-all ${
                            i < getPasswordStrength() ? strengthColors[getPasswordStrength() - 1] : 'bg-[#E5E4DE]/50'
                          }`}
                        />
                      ))}
                    </div>
                    {/* Requirements validation indicator */}
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1 text-[10px] text-[#8C8B80]">
                      <div className="flex items-center gap-1">
                        <span className={(watch('password') || '').length >= 8 ? 'text-green-500' : ''}>
                          {(watch('password') || '').length >= 8 ? '✓' : '•'} Min 8 chars
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={/[A-Z]/.test(watch('password') || '') ? 'text-green-500' : ''}>
                          {/[A-Z]/.test(watch('password') || '') ? '✓' : '•'} 1 Uppercase
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={/[0-9]/.test(watch('password') || '') ? 'text-green-500' : ''}>
                          {/[0-9]/.test(watch('password') || '') ? '✓' : '•'} 1 Number
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={/[!@#$%^&*()_,.?":{}|<>]/.test(watch('password') || '') ? 'text-green-500' : ''}>
                          {/[!@#$%^&*()_,.?":{}|<>]/.test(watch('password') || '') ? '✓' : '•'} 1 Special Char
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <FormInput
                label="Confirm Password"
                placeholder="Repeat password"
                type="password"
                required
                register={register('confirmPassword')}
                error={errors.confirmPassword}
                isValid={!errors.confirmPassword && !!watch('confirmPassword')}
                disabled={loading}
                leftIcon={<Lock size={16} />}
              />

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
                  <p className="text-xs text-red-500 flex items-center gap-1.5 mt-1.5"><AlertCircle className="w-3.5 h-3.5" />{errors.terms.message}</p>
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
