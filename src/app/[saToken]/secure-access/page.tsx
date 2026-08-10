'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lock, Eye, EyeOff, KeyRound, ShieldAlert, ArrowRight, ShieldCheck, Mail, Smartphone, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SA_THEME } from '@/styles/super-admin-theme';
import { useSAAuthStore } from '@/lib/store/sa-auth-store';

// --- ZOD SCHEMAS ---
const credentialSchema = z.object({
  email: z.string().min(1, "Administrator email is required").email("Enter valid administrator email").toLowerCase().trim(),
  password: z.string().min(1, "Security password is required").min(12, "Super admin passwords must be at least 12 characters"),
  rememberDevice: z.boolean().default(false),
});

const totpSchema = z.object({
  code: z.string().optional(),
  backupCode: z.string().optional(),
  isBackupCode: z.boolean().default(false),
}).refine(data => {
  if (data.isBackupCode) {
    return !!data.backupCode && /^[A-Z0-9]{8}-[A-Z0-9]{8}$/.test(data.backupCode);
  }
  return !!data.code && /^\d{6}$/.test(data.code);
}, {
  message: "Invalid code format",
  path: ["code"] // Generic path for the error
});

const deviceSchema = z.object({
  otpCode: z.string().regex(/^\d{8}$/, "Enter the 8-digit code sent to your email"),
  trustDevice: z.boolean().default(false),
});

// --- ANIMATION VARIANTS ---
const pageVariants: any = {
  initial: { opacity: 0, x: 20, filter: 'blur(4px)' },
  animate: {
    opacity: 1, x: 0, filter: 'blur(0px)',
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  exit: {
    opacity: 0, x: -20, filter: 'blur(2px)',
    transition: { duration: 0.2 }
  }
};

export default function SecureAccessPage() {
  const router = useRouter();
  const params = useParams();
  const saToken = params.saToken as string;
  
  const [stage, setStage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const login = useSAAuthStore(state => state.login);

  // Forms
  const credForm = useForm<z.infer<typeof credentialSchema>>({
    resolver: zodResolver(credentialSchema) as any,
    defaultValues: { email: '', password: '', rememberDevice: false }
  });

  const totpForm = useForm<z.infer<typeof totpSchema>>({
    resolver: zodResolver(totpSchema) as any,
    defaultValues: { code: '', backupCode: '', isBackupCode: false }
  });
  const isBackup = totpForm.watch('isBackupCode');

  const deviceForm = useForm<z.infer<typeof deviceSchema>>({
    resolver: zodResolver(deviceSchema) as any,
    defaultValues: { otpCode: '', trustDevice: false }
  });

  // Handlers
  const onCredSubmit = async (data: z.infer<typeof credentialSchema>) => {
    setLoading(true);
    setErrorMsg('');
    // Simulate network delay and verification
    await new Promise(r => setTimeout(r, 1500));
    
    // Mock check
    if (data.email === 'superadmin@bharatbazaar.com' && data.password === 'BharatBazaar@GodMode2026') {
      setStage(2);
    } else {
      setErrorMsg('Invalid credentials or unauthorized account.');
    }
    setLoading(false);
  };

  const onTotpSubmit = async (data: z.infer<typeof totpSchema>) => {
    setLoading(true);
    setErrorMsg('');
    await new Promise(r => setTimeout(r, 1200));
    
    // Mock check (accept any valid looking code for demo)
    if (data.isBackupCode ? data.backupCode : data.code) {
      setStage(3); // Go to device check
    } else {
      setErrorMsg('Invalid authentication code.');
    }
    setLoading(false);
  };

  const onDeviceSubmit = async (data: z.infer<typeof deviceSchema>) => {
    setLoading(true);
    setErrorMsg('');
    await new Promise(r => setTimeout(r, 1500));
    
    // Simulate finalizing login
    login({
      id: 'super-admin-001',
      name: 'Super Admin',
      email: credForm.getValues('email'),
      role: 'super_admin',
      permissions: ['*']
    });
    
    // Redirect to dashboard
    router.push(`/${saToken}/dashboard`);
  };

  // Helper renderers
  const renderInput = (id: string, label: string, form: any, type: string = "text", placeholder: string = "", extraIcon?: React.ReactNode) => {
    const error = form.formState.errors[id]?.message;
    return (
      <div className="space-y-1.5 mb-4">
        <label htmlFor={id} className="text-xs uppercase tracking-wider text-[#9090B8]">
          {label}
        </label>
        <div className="relative">
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            {...form.register(id)}
            className={cn(
              "w-full h-12 px-4 rounded-xl text-[#F0F0FF] placeholder:text-[#5A5A80] transition-all",
              "bg-[#0E0E1A] border focus:outline-none focus:ring-1",
              error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-[#1E1E35] focus:border-[#F5C842] focus:ring-[#F5C842]/20"
            )}
            style={{ fontSize: '16px' }}
          />
          {extraIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A5A80]">
              {extraIcon}
            </div>
          )}
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error as string}</p>}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: SA_THEME.bg.page }}>
      {/* Background glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full opacity-[0.03] blur-[100px]" style={{ background: SA_THEME.gold[500] }} />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] rounded-full opacity-[0.02] blur-[100px]" style={{ background: SA_THEME.gold[300] }} />
      </div>

      <div 
        className="w-full max-w-sm relative z-10 p-8 rounded-3xl border shadow-2xl backdrop-blur-2xl"
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          borderColor: 'rgba(255, 255, 255, 0.08)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.8)'
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 rounded-2xl flex items-center justify-center mb-4 relative" style={{ backgroundColor: 'rgba(245, 200, 66, 0.1)' }}>
            <div className="absolute inset-0 rounded-2xl animate-pulse" style={{ boxShadow: SA_THEME.gold.glow }} />
            <Lock className="w-6 h-6" style={{ color: SA_THEME.gold[500] }} />
          </div>
          <h1 className="text-xl font-bold tracking-tight mb-1" style={{ background: SA_THEME.gold.gradient, WebkitBackgroundClip: 'text', color: 'transparent' }}>
            BHARAT BAZAAR
          </h1>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#5A5A80] font-bold">Super Administration Portal</p>
          
          <div className="flex items-center justify-center gap-3 mt-4 text-[10px] text-[#9090B8]">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Encrypted</span>
            <span className="flex items-center gap-1"><KeyRound className="w-3 h-3" /> MFA</span>
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> Monitored</span>
          </div>
        </div>

        {/* Stage Indicators */}
        <div className="flex gap-2 mb-8 justify-center">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={cn("h-1.5 rounded-full transition-all duration-300", stage >= s ? "w-8" : "w-2")}
              style={{ backgroundColor: stage >= s ? SA_THEME.gold[500] : SA_THEME.border.primary }}
            />
          ))}
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-2 overflow-hidden"
            >
              <ShieldAlert className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-xs text-red-400">{errorMsg}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Forms Container */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            {/* STAGE 1: Credentials */}
            {stage === 1 && (
              <motion.div key="stage1" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                <form onSubmit={credForm.handleSubmit(onCredSubmit as any)}>
                  {renderInput('email', 'Administrator Email', credForm, 'email', 'superadmin@bharatbazaar.com')}
                  {renderInput(
                    'password', 
                    'Security Password', 
                    credForm, 
                    showPassword ? 'text' : 'password', 
                    '••••••••••••',
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-white transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                  
                  <div className="flex items-center gap-2 mb-6">
                    <input type="checkbox" id="remember" {...credForm.register('rememberDevice')} className="rounded border-[#1E1E35] bg-[#0E0E1A] text-[#F5C842] focus:ring-[#F5C842]/20" />
                    <label htmlFor="remember" className="text-xs text-[#9090B8]">Remember this device</label>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-12 rounded-xl flex items-center justify-center font-medium text-black transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                    style={{ background: SA_THEME.gold.gradient }}
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>Verify Identity <ArrowRight className="w-4 h-4 ml-2" /></>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* STAGE 2: TOTP MFA */}
            {stage === 2 && (
              <motion.div key="stage2" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                <form onSubmit={totpForm.handleSubmit(onTotpSubmit as any)}>
                  <div className="text-center mb-6">
                    <Smartphone className="w-8 h-8 text-[#9090B8] mx-auto mb-2" />
                    <h2 className="text-[#F0F0FF] text-sm font-medium">Two-Factor Authentication</h2>
                    <p className="text-xs text-[#5A5A80] mt-1">Enter the security code from your authenticator app</p>
                  </div>

                  {!isBackup ? (
                    renderInput('code', '6-Digit Auth Code', totpForm, 'text', '000000')
                  ) : (
                    renderInput('backupCode', 'Recovery Backup Code', totpForm, 'text', 'XXXXXXXX-XXXXXXXX')
                  )}

                  <button 
                    type="button" 
                    onClick={() => { totpForm.setValue('isBackupCode', !isBackup); totpForm.setValue('code', ''); totpForm.setValue('backupCode', ''); setErrorMsg(''); }}
                    className="text-xs text-[#5A5A80] hover:text-[#F0F0FF] underline mb-6 block text-center w-full"
                  >
                    {isBackup ? 'Use Authenticator App instead' : 'Use a backup recovery code'}
                  </button>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-12 rounded-xl flex items-center justify-center font-medium text-black transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                    style={{ background: SA_THEME.gold.gradient }}
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Authenticate'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* STAGE 3: Device Confirmation */}
            {stage === 3 && (
              <motion.div key="stage3" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                <form onSubmit={deviceForm.handleSubmit(onDeviceSubmit as any)}>
                  <div className="text-center mb-6">
                    <Mail className="w-8 h-8 text-[#9090B8] mx-auto mb-2" />
                    <h2 className="text-[#F0F0FF] text-sm font-medium">Unrecognized Device</h2>
                    <p className="text-xs text-[#5A5A80] mt-1">We sent an 8-digit verification code to <strong className="text-[#F0F0FF]">a***n@bharatbazaar.com</strong></p>
                  </div>

                  {renderInput('otpCode', '8-Digit Email OTP', deviceForm, 'text', '00000000')}

                  <div className="flex items-center gap-2 mb-6">
                    <input type="checkbox" id="trust" {...deviceForm.register('trustDevice')} className="rounded border-[#1E1E35] bg-[#0E0E1A] text-[#F5C842] focus:ring-[#F5C842]/20" />
                    <label htmlFor="trust" className="text-xs text-[#9090B8]">Trust this device for 30 days</label>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-12 rounded-xl flex items-center justify-center font-medium text-black transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:pointer-events-none mb-3"
                    style={{ background: SA_THEME.gold.gradient }}
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Authorize Device'}
                  </button>

                  <button 
                    type="button"
                    onClick={() => alert('Account locked. Administrators have been notified.')}
                    className="w-full h-10 rounded-xl flex items-center justify-center text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    This wasn't me — Lock Account
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
