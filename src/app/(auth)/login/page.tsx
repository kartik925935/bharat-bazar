'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, Eye, EyeOff, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store/auth-store';
import { RedirectIfAuthed } from '@/components/auth/redirect-if-authed';

import { FormInput } from '@/components/ui/form-input';

const loginSchema = z.object({
  email: z.string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean()
    .default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';
  
  const { signIn, signInWithGoogle, error } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [copiedText, setCopiedText] = useState('');
  const [shake, setShake] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onFormSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setShake(false);
    
    const result = await signIn(values.email, values.password);
    
    if (result.success) {
      const activeUser = useAuthStore.getState().user;
      toast.success(`Welcome back, ${activeUser?.name}! 🙏`);
      
      // Determine redirection target based on role
      if (activeUser?.role === 'admin' || activeUser?.role === 'super_admin') {
        router.replace('/admin-dashboard');
      } else if (activeUser?.role === 'seller') {
        router.replace('/seller-dashboard');
      } else {
        router.replace(returnUrl === '/' ? '/dashboard' : returnUrl);
      }
    } else {
      setShake(true);
      toast.error(result.error || 'Invalid credentials. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const result = await signInWithGoogle();
    if (result.success) {
      const activeUser = useAuthStore.getState().user;
      toast.success(`Welcome back, ${activeUser?.name || 'Google Guest'}! 🙏`);
      router.replace('/dashboard');
    } else {
      if (result.error !== 'Google login cancelled') {
        toast.error(result.error || 'Google Sign In failed');
      }
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    toast.success(`Copied ${type} to clipboard!`);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const autofillDemo = (email: string, pass: string) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', pass, { shouldValidate: true });
    toast.info('Demo credentials loaded!');
  };

  return (
    <RedirectIfAuthed>
      <div className="min-h-screen flex bg-[#FAFAF8]">
        {/* Left Side: Crafts Collage */}
        <div 
          className="hidden lg:flex lg:w-[50%] bg-[#FF7A00] relative flex-col justify-between p-12 text-white overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #FF7A00, #FF4500)' }}
        >
          {/* Decorative Backdrops */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-10 bg-white translate-x-1/4 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full opacity-10 bg-white -translate-x-1/4 translate-y-1/4" />

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 relative z-10 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-black text-sm">BB</div>
            <span className="font-black text-2xl text-white tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Bharat Bazaar
            </span>
          </Link>

          {/* Collage Content */}
          <div className="flex-1 flex flex-col justify-center items-center relative z-10 my-8">
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="grid grid-cols-2 gap-4 max-w-sm"
            >
              {[
                'https://images.unsplash.com/photo-1569909115134-a0426936c879?w=300&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1536266305399-b367feb671f9?w=300&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1663325265966-0d17de3e85c5?w=300&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1620619767323-b95a89183081?w=300&auto=format&fit=crop',
              ].map((url, i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden shadow-xl border border-white/10">
                  <img src={url} alt="Indian Craft" className="w-full h-full object-cover" />
                </div>
              ))}
            </motion.div>
            
            <p className="mt-8 text-xl font-medium text-center text-white/95 max-w-xs italic leading-relaxed" style={{ fontFamily: "'Playfair Display', serif" }}>
              "From Village Hands to Your Home"
            </p>
          </div>

          {/* Lower Badges */}
          <div className="flex items-center justify-around border-t border-white/20 pt-6 text-xs text-white/90 font-semibold relative z-10 shrink-0">
            <span>🛡️ 10k+ Artisans</span>
            <span>⭐ Authentic Products</span>
            <span>💳 Secure Payments</span>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
          {/* Mobile Brand Link */}
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs bg-gradient-to-r from-[#FF7A00] to-[#FF4500]">BB</div>
            <span className="font-black text-xl text-[#FF7A00]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Bharat Bazaar</span>
          </Link>

          <motion.div 
            animate={shake ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md bg-white p-8 rounded-3xl border border-[#E5E4DE] shadow-sm space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Welcome back
              </h2>
              <p className="text-sm text-[#8C8B80]">Sign in to continue shopping</p>
            </div>

            {/* Google Authentication */}
            <button 
              onClick={handleGoogleSignIn}
              disabled={loading}
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

            {/* Separator */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-[1px] bg-[#E5E4DE]" />
              <span className="text-xs font-semibold text-[#8C8B80]">OR CONTINUE WITH</span>
              <div className="flex-1 h-[1px] bg-[#E5E4DE]" />
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
              <FormInput
                label="Email Address"
                placeholder="your@email.com"
                type="email"
                required
                register={register('email')}
                error={errors.email}
                isValid={!errors.email && !!watch('email')}
                disabled={loading}
                leftIcon={<Mail size={16} />}
              />

              <div>
                <div className="flex justify-end mb-[-24px] relative z-10 mr-1">
                  <Link 
                    href="/forgot-password" 
                    className="text-xs font-semibold text-[#FF7A00] hover:underline bg-white px-1"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormInput
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  required
                  register={register('password')}
                  error={errors.password}
                  isValid={!errors.password && !!watch('password')}
                  disabled={loading}
                  leftIcon={<Lock size={16} />}
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    {...register('rememberMe')}
                    className="rounded border-[#E5E4DE] text-[#FF7A00] focus:ring-[#FF7A00] h-4 w-4"
                  />
                  <span className="text-xs text-[#555449] font-medium">Remember me</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-[#FF7A00] to-[#FF4500] shadow-lg shadow-orange-500/20 active:scale-98 hover:shadow-orange-500/30 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <p className="text-xs text-center text-[#8C8B80]">
              New to Bharat Bazaar?{' '}
              <Link href="/register" className="font-bold text-[#FF7A00] hover:underline">
                Create account
              </Link>
            </p>

            <div className="border-t border-[#E5E4DE] pt-4 text-center">
              <span className="text-xs text-[#8C8B80]">Are you an artisan or seller? 🏪</span>
              <br />
              <Link 
                href="/seller-login" 
                className="inline-flex items-center gap-1 text-xs font-bold text-[#FF7A00] hover:underline mt-1"
              >
                Access Seller Dashboard
              </Link>
            </div>

            {/* Development / Demo credentials Box */}
            <div className="border border-orange-200 bg-[#FFF7ED] rounded-xl p-4 space-y-2">
              <button 
                type="button"
                onClick={() => setShowDemo(!showDemo)}
                className="w-full flex items-center justify-between text-xs font-bold text-orange-800 hover:text-orange-950 outline-none"
              >
                <span>🛠️ Development Demo Credentials</span>
                <span>{showDemo ? 'Hide' : 'Show'}</span>
              </button>

              {showDemo && (
                <div className="text-[11px] text-orange-900 space-y-2 pt-2 border-t border-orange-200">
                  {[
                    { role: 'Customer', email: 'customer@test.com', pass: 'Test@123' },
                    { role: 'Seller', email: 'seller@test.com', pass: 'Test@123' },
                    { role: 'Admin', email: 'admin@bharatbazaar.com', pass: 'Admin@123' },
                  ].map((demo) => (
                    <div key={demo.role} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 bg-white/50 p-2 rounded-lg border border-orange-200/40">
                      <div>
                        <span className="font-bold uppercase text-[9px] bg-orange-100 px-1 py-0.5 rounded text-orange-800 mr-1">{demo.role}</span>
                        <span>{demo.email}</span>
                      </div>
                      <div className="flex gap-1.5 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => autofillDemo(demo.email, demo.pass)}
                          className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-1.5 py-0.5 rounded text-[10px] cursor-pointer transition-colors"
                        >
                          Autofill
                        </button>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(demo.email, `${demo.role} Email`)}
                          className="bg-orange-100 hover:bg-orange-200 text-orange-800 font-bold px-1.5 py-0.5 rounded text-[10px] cursor-pointer transition-colors flex items-center gap-0.5"
                        >
                          {copiedText === `${demo.role} Email` ? <Check size={10} /> : 'Copy'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </RedirectIfAuthed>
  );
}
