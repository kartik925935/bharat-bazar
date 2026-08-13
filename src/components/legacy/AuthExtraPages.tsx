'use client';
import Link from 'next/link';
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, CheckCircle, AlertTriangle, ArrowLeft, ShieldAlert } from "lucide-react";

const BB_LOGO = () => (
  <div className="flex items-center gap-2 justify-center mb-8">
    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm" style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>BB</div>
    <span className="font-black text-lg text-[#1C1B14]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Bharat Bazaar</span>
  </div>
);

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { error: sbError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });
      if (sbError) throw sbError;
      setSent(true);
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-black/5 shadow-lg w-full max-w-md p-8">
        <BB_LOGO />
        <Link href="/login" className="flex items-center gap-1.5 text-xs text-[#8C8B80] hover:text-[#1C1B14] mb-6 transition-colors w-fit">
          <ArrowLeft size={14} /> Back to Login
        </Link>

        {!sent ? (
          <>
            <div className="text-center mb-7">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF8F0] flex items-center justify-center mx-auto mb-4">
                <Mail size={24} style={{ color: "#FF7A00" }} />
              </div>
              <h1 className="text-2xl font-black text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Forgot Password?</h1>
              <p className="text-sm text-[#8C8B80]">Enter your registered email and we'll send you a reset link</p>
            </div>
            <div className="mb-5">
              <label className="block text-xs font-semibold text-[#1C1B14] mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(null); }}
                placeholder="you@example.com"
                disabled={loading}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                className="w-full h-12 px-4 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm disabled:opacity-60"
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">
                <AlertTriangle size={15} className="flex-shrink-0" />
                {error}
              </div>
            )}
            <motion.button
              onClick={handleSend}
              whileTap={{ scale: 0.97 }}
              disabled={loading || !email}
              className="w-full h-12 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending…
                </>
              ) : 'Send Reset Link'}
            </motion.button>
            <p className="text-center text-xs text-[#8C8B80] mt-4">
              Remember your password? <Link href="/login" className="font-semibold" style={{ color: "#FF7A00" }}>Sign in</Link>
            </p>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={32} className="text-[#1A9E4E]" />
            </div>
            <h2 className="text-xl font-bold text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Check Your Email</h2>
            <p className="text-sm text-[#8C8B80] mb-1">We've sent a password reset link to</p>
            <p className="font-semibold text-[#1C1B14] mb-5">{email}</p>
            <div className="bg-[#FFF8F0] rounded-2xl p-4 mb-5 text-xs text-[#8C8B80]">
              The link expires in 30 minutes. Check your spam folder if you don't see it.
            </div>
            <button onClick={() => { setSent(false); setError(null); }} className="text-sm font-semibold" style={{ color: "#FF7A00" }}>
              Try a different email →
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export function ResetPasswordPage() {
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const strong = pw.length >= 8;
  const match = pw === pw2 && pw2.length > 0;

  const handleReset = async () => {
    if (!strong || !match) return;
    setLoading(true);
    setError(null);
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { error: sbError } = await supabase.auth.updateUser({ password: pw });
      if (sbError) throw sbError;
      setDone(true);
    } catch (e: any) {
      setError(e.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-black/5 shadow-lg w-full max-w-md p-8">
        <BB_LOGO />
        {!done ? (
          <>
            <div className="text-center mb-7">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF8F0] flex items-center justify-center mx-auto mb-4">
                <Lock size={24} style={{ color: "#FF7A00" }} />
              </div>
              <h1 className="text-2xl font-black text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Set New Password</h1>
              <p className="text-sm text-[#8C8B80]">Choose a strong password for your account</p>
            </div>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-[#1C1B14] mb-1.5">New Password</label>
                <div className="relative">
                  <input type={show ? "text" : "password"} value={pw} onChange={e => { setPw(e.target.value); setError(null); }}
                    placeholder="At least 8 characters"
                    className="w-full h-12 px-4 pr-11 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" />
                  <button onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B0AFA5]">
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {pw.length > 0 && (
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex gap-1 flex-1">
                      {[0,1,2].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${pw.length >= (i+1)*3 ? "bg-[#FF7A00]" : "bg-[#F5F4F0]"}`} />)}
                    </div>
                    <span className="text-xs text-[#8C8B80]">{pw.length < 4 ? "Weak" : pw.length < 8 ? "Fair" : "Strong"}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1C1B14] mb-1.5">Confirm Password</label>
                <input type="password" value={pw2} onChange={e => { setPw2(e.target.value); setError(null); }} placeholder="Repeat your new password"
                  className={`w-full h-12 px-4 rounded-xl border-2 outline-none text-sm ${pw2.length > 0 ? (match ? "border-[#1A9E4E]" : "border-red-400") : "border-[#D4D3CB] focus:border-[#FF7A00]"}`} />
                {pw2.length > 0 && !match && <p className="text-xs text-red-500 mt-1">Passwords don't match</p>}
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">
                <AlertTriangle size={15} className="flex-shrink-0" />
                {error}
              </div>
            )}
            <motion.button
              onClick={handleReset}
              whileTap={{ scale: 0.97 }}
              disabled={!strong || !match || loading}
              className="w-full h-12 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Resetting…
                </>
              ) : 'Reset Password'}
            </motion.button>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={32} className="text-[#1A9E4E]" />
            </div>
            <h2 className="text-xl font-bold text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Password Reset!</h2>
            <p className="text-sm text-[#8C8B80] mb-8">Your password has been updated. Please sign in with your new password.</p>
            <Link href="/login" className="inline-flex items-center justify-center w-full h-12 rounded-xl text-white font-semibold text-sm"
              style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>Continue to Login</Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export function VerifyEmailPage() {
  const [resent, setResent] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-black/5 shadow-lg w-full max-w-md p-8 text-center">
        <BB_LOGO />
        <div className="text-5xl mb-4">📧</div>
        <h1 className="text-2xl font-black text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Verify Your Email</h1>
        <p className="text-sm text-[#8C8B80] mb-6">
          We've sent a verification link to your email address. Click the link to activate your Bharat Bazaar account.
        </p>
        <div className="bg-[#FFF8F0] border border-[#FFD4A8] rounded-2xl p-4 mb-6 text-sm text-[#555449] text-left">
          <strong className="text-[#FF7A00]">💡 Tip:</strong> Check your spam / promotions folder if you don't see it within 2 minutes.
        </div>
        {resent ? (
          <div className="flex items-center justify-center gap-2 text-sm text-[#1A9E4E] font-semibold mb-4">
            <CheckCircle size={16} /> Verification email resent!
          </div>
        ) : (
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setResent(true)}
            className="w-full h-12 rounded-xl border-2 border-[#D4D3CB] text-sm font-semibold text-[#555449] hover:border-[#FF7A00] transition-all mb-3">
            Resend Verification Email
          </motion.button>
        )}
        <Link href="/login" className="text-sm text-[#8C8B80] hover:text-[#FF7A00] transition-colors">Back to Login</Link>
      </motion.div>
    </div>
  );
}

import { useSearchParams } from 'next/navigation';

export function EmailVerifiedPage() {
  const searchParams = useSearchParams();
  const isSeller = searchParams.get('role') === 'seller';

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl border border-black/5 shadow-lg w-full max-w-md p-8 text-center">
        <BB_LOGO />
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={40} className="text-[#1A9E4E]" />
        </motion.div>
        <h1 className="text-2xl font-black text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Email Verified! 🎉</h1>
        <p className="text-sm text-[#8C8B80] mb-2">Your email has been successfully verified.</p>
        <p className="text-sm text-[#8C8B80] mb-8">
          {isSeller 
            ? "Welcome to Bharat Bazaar — manage your shop and start selling your creations!" 
            : "Welcome to Bharat Bazaar — India's Artisan & Village Marketplace!"}
        </p>
        <Link href={isSeller ? "/seller-dashboard" : "/dashboard"} className="inline-flex items-center justify-center w-full h-12 rounded-xl text-white font-semibold text-sm"
          style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
          {isSeller ? "Go to Seller Dashboard →" : "Explore the Marketplace →"}
        </Link>
      </motion.div>
    </div>
  );
}

export function GoogleOAuthCallbackPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl border border-black/5 shadow-lg w-full max-w-md p-8 text-center">
        <BB_LOGO />
        <div className="w-16 h-16 rounded-full bg-[#FFF8F0] flex items-center justify-center mx-auto mb-5">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-3 border-[#FF7A00] border-t-transparent rounded-full"
            style={{ borderWidth: 3 }}
          />
        </div>
        <h1 className="text-xl font-black text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Signing you in…</h1>
        <p className="text-sm text-[#8C8B80] mb-4">Completing Google authentication. Please wait a moment.</p>
        <div className="bg-[#FAFAF8] rounded-2xl p-4 text-xs text-[#8C8B80]">
          You'll be redirected automatically. If nothing happens,{" "}
          <Link href="/login" className="font-semibold" style={{ color: "#FF7A00" }}>click here to try again</Link>.
        </div>
      </motion.div>
    </div>
  );
}

export function AccountSuspendedPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-black/5 shadow-lg w-full max-w-md p-8 text-center">
        <BB_LOGO />
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
          <ShieldAlert size={28} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-black text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Account Suspended</h1>
        <p className="text-sm text-[#8C8B80] mb-5">
          Your account has been temporarily suspended due to a violation of our community guidelines.
        </p>
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6 text-sm text-red-700 text-left">
          <strong className="block mb-1 text-red-800">Reason for suspension:</strong>
          Multiple unresolved complaints received regarding product quality misrepresentation.
        </div>
        <div className="text-sm text-[#8C8B80] mb-6">
          If you believe this is an error, please contact our support team and we'll review your case within 48 hours.
        </div>
        <Link href="/support/new" className="inline-flex items-center justify-center w-full h-12 rounded-xl text-white font-semibold text-sm mb-3"
          style={{ background: "linear-gradient(135deg, #FF7A00, #FF4500)" }}>
          Contact Support
        </Link>
        <Link href="/" className="text-sm text-[#8C8B80] hover:text-[#FF7A00] transition-colors">Back to Homepage</Link>
      </motion.div>
    </div>
  );
}
