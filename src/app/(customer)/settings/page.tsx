'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Globe, Bell, Lock, AlertTriangle, Check, X,
  Eye, EyeOff, Loader2, AlertCircle, CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_SETTINGS, type MockSettings } from '@/lib/mock/customer';

// ─── Helper ───────────────────────────────────────────────────────────────────
function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

// ─── Toggle component ─────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${checked ? 'bg-[#FF7A00]' : 'bg-[#E8E4DE]'}`}
    >
      <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform mx-0.5 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

// ─── Password Strength Meter ───────────────────────────────────────────────────
function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { label: 'Very Weak', color: 'bg-red-500', width: '16%', textColor: 'text-red-500' };
  if (score === 3) return { label: 'Weak', color: 'bg-orange-500', width: '33%', textColor: 'text-orange-500' };
  if (score === 4) return { label: 'Fair', color: 'bg-yellow-500', width: '50%', textColor: 'text-yellow-500' };
  if (score === 5) return { label: 'Good', color: 'bg-blue-500', width: '75%', textColor: 'text-blue-500' };
  return { label: 'Strong', color: 'bg-green-500', width: '100%', textColor: 'text-green-600' };
}

// ─── Schemas ──────────────────────────────────────────────────────────────────
const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Current password is required'),

  newPassword: z
    .string()
    .min(1, 'New password is required')
    .min(8, 'New password must be at least 8 characters')
    .max(128, 'Password is too long')
    .regex(/[A-Z]/, 'Must include at least one uppercase letter (A–Z)')
    .regex(/[a-z]/, 'Must include at least one lowercase letter (a–z)')
    .regex(/[0-9]/, 'Must include at least one number (0–9)')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Must include at least one special character'),

  confirmNewPassword: z.string().min(1, 'Please confirm your new password'),
})
  .refine((d) => d.newPassword === d.confirmNewPassword, {
    message: 'Passwords do not match — please re-enter',
    path: ['confirmNewPassword'],
  })
  .refine((d) => d.currentPassword !== d.newPassword, {
    message: 'New password must differ from your current password',
    path: ['newPassword'],
  });

type ChangePasswordData = z.infer<typeof changePasswordSchema>;

const deleteAccountSchema = z.object({
  confirmText: z
    .string()
    .min(1, 'Please type the confirmation text')
    .refine((v) => v === 'DELETE MY ACCOUNT', 'Type exactly: DELETE MY ACCOUNT (all caps)'),

  password: z.string().min(1, 'Your password is required to delete account'),

  reason: z.enum(
    [
      'not_using_anymore', 'privacy_concerns', 'too_many_emails',
      'found_better_platform', 'dissatisfied_with_service', 'temporary_break', 'other',
    ],
    { required_error: "Please tell us why you're leaving" }
  ),

  acknowledgeDataLoss: z
    .boolean()
    .refine((v) => v === true, 'You must acknowledge that all your data will be permanently deleted'),

  acknowledgeOrderHistory: z
    .boolean()
    .refine((v) => v === true, 'You must acknowledge that your order history will be lost'),
});

type DeleteAccountData = z.infer<typeof deleteAccountSchema>;

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-[#F0EDE8] pb-3 mb-4">
      <div className="text-[#FF7A00]">{icon}</div>
      <h3 className="text-sm font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>{title}</h3>
    </div>
  );
}

function ToggleRow({ label, sub, checked, onToggle }: { label: string; sub?: string; checked: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-xs font-bold text-[#1A0A00]">{label}</p>
        {sub && <p className="text-[11px] text-[#8C7B6E] mt-0.5">{sub}</p>}
      </div>
      <Toggle checked={checked} onChange={onToggle} />
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1.5 text-sm text-red-600 mt-1.5"
      role="alert"
    >
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
      {message}
    </motion.p>
  );
}

function FieldSuccess() {
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1.5 text-sm text-green-600 mt-1.5"
    >
      <CheckCircle2 className="w-3.5 h-3.5" />
      Looks good!
    </motion.p>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [settings, setSettings] = useState<MockSettings>(MOCK_SETTINGS);
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);

  const toggle = (key: keyof MockSettings) => {
    setSettings((prev) => {
      const val = !prev[key];
      toast.success(`${key.replace(/([A-Z])/g, ' $1').trim()} ${val ? 'enabled' : 'disabled'}`);
      return { ...prev, [key]: val };
    });
  };

  const handleSaveRegional = () => toast.success('Regional preferences saved!');

  // ── Change Password form ───────────────────────────────────────────────────
  const pwdForm = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
  });

  const { register: pwdReg, handleSubmit: pwdSubmit, watch: pwdWatch,
    formState: { errors: pwdErrors, touchedFields: pwdTouched, isSubmitting: pwdSubmitting, isValid: pwdValid },
    reset: pwdReset } = pwdForm;

  const watchedNewPwd = pwdWatch('newPassword', '');
  const pwdStrength = watchedNewPwd ? getPasswordStrength(watchedNewPwd) : null;

  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const onChangePwd = async (_data: ChangePasswordData) => {
    await new Promise((r) => setTimeout(r, 1200));
    toast.success('Password changed successfully! 🔒');
    setShowChangePwd(false);
    pwdReset();
  };

  const pwdInputClass = (field: keyof ChangePasswordData) =>
    cn(
      'w-full h-12 px-4 pr-11 rounded-xl border-2 text-base outline-none transition-all duration-200 bg-white',
      'focus:ring-4 focus:ring-[#FF7A00]/20',
      pwdErrors[field]
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
        : pwdTouched[field] && !pwdErrors[field]
        ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
        : 'border-[#E8E4DE] focus:border-[#FF7A00]'
    );

  // ── Delete Account form ────────────────────────────────────────────────────
  const delForm = useForm<DeleteAccountData>({
    resolver: zodResolver(deleteAccountSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      confirmText: '',
      password: '',
      reason: undefined,
      acknowledgeDataLoss: false,
      acknowledgeOrderHistory: false,
    },
  });

  const { register: delReg, handleSubmit: delSubmit, watch: delWatch,
    formState: { errors: delErrors, touchedFields: delTouched, isSubmitting: delSubmitting, isValid: delValid },
    reset: delReset } = delForm;

  const delAckData = delWatch('acknowledgeDataLoss');
  const delAckOrders = delWatch('acknowledgeOrderHistory');
  const [showDelPwd, setShowDelPwd] = useState(false);

  const onDeleteAccount = async (_data: DeleteAccountData) => {
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Account deletion request submitted. You'll receive a confirmation email.");
    setShowDeleteAccount(false);
    delReset();
  };

  const delInputClass = (field: keyof DeleteAccountData) =>
    cn(
      'w-full h-12 px-4 rounded-xl border-2 text-base outline-none transition-all duration-200 bg-white',
      'focus:ring-4',
      delErrors[field]
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
        : delTouched[field] && !delErrors[field]
        ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
        : 'border-[#E8E4DE] focus:border-[#FF7A00] focus:ring-[#FF7A00]/20'
    );

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>
          Account Settings
        </h1>
        <p className="text-sm text-[#8C7B6E] mt-0.5">Manage security, notifications, language and regional preferences</p>
      </div>

      <div className="space-y-4">
        {/* Security */}
        <div className="bg-white rounded-2xl border border-[#E8E4DE] p-5">
          <SectionHeader icon={<Shield size={18} />} title="Security" />
          <div className="space-y-3">
            <ToggleRow
              label="Two-Factor Authentication (2FA)"
              sub="Secure your account with SMS OTP verification on sign in"
              checked={settings.twoFactor}
              onToggle={() => toggle('twoFactor')}
            />
            <div className="pt-2 border-t border-[#F5F4F0]">
              <button
                onClick={() => setShowChangePwd(true)}
                className="text-xs font-bold text-[#FF7A00] hover:underline cursor-pointer"
              >
                Change Account Password →
              </button>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-2xl border border-[#E8E4DE] p-5">
          <SectionHeader icon={<Bell size={18} />} title="Notification Preferences" />
          <div className="space-y-1 divide-y divide-[#F5F4F0]">
            <ToggleRow label="Email Notifications" sub="Account updates, order receipts and newsletters" checked={settings.emailNotifs} onToggle={() => toggle('emailNotifs')} />
            <ToggleRow label="Push Notifications" sub="Real-time alerts on your browser or device" checked={settings.pushNotifs} onToggle={() => toggle('pushNotifs')} />
            <ToggleRow label="SMS Notifications" sub="Order and delivery updates via text message" checked={settings.smsNotifs} onToggle={() => toggle('smsNotifs')} />
            <ToggleRow label="Order Status Updates" sub="Shipping, delivery and return updates" checked={settings.orderUpdates} onToggle={() => toggle('orderUpdates')} />
            <ToggleRow label="Offer Alerts & Deals" sub="Exclusive deals, flash sales and coupon codes" checked={settings.offerAlerts} onToggle={() => toggle('offerAlerts')} />
            <ToggleRow label="Review Reminders" sub="Reminders to review delivered products and earn points" checked={settings.reviewReminders} onToggle={() => toggle('reviewReminders')} />
          </div>
        </div>

        {/* Regional Preferences */}
        <div className="bg-white rounded-2xl border border-[#E8E4DE] p-5">
          <SectionHeader icon={<Globe size={18} />} title="Regional Preferences" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#8C7B6E] block mb-1">Language</label>
              <select
                value={settings.language}
                onChange={(e) => setSettings((s) => ({ ...s, language: e.target.value }))}
                className="w-full h-12 px-3 rounded-xl border-2 border-[#E8E4DE] text-sm font-semibold text-[#1A0A00] bg-white outline-none focus:border-[#FF7A00]"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi (हिंदी) — Coming Soon</option>
                <option value="Bengali">Bengali (বাংলা) — Coming Soon</option>
                <option value="Tamil">Tamil (தமிழ்) — Coming Soon</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-[#8C7B6E] block mb-1">Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings((s) => ({ ...s, currency: e.target.value }))}
                className="w-full h-12 px-3 rounded-xl border-2 border-[#E8E4DE] text-sm font-semibold text-[#1A0A00] bg-white outline-none focus:border-[#FF7A00]"
              >
                <option value="INR (₹)">INR (₹) Indian Rupee</option>
                <option value="USD ($)">USD ($) US Dollar</option>
                <option value="GBP (£)">GBP (£) British Pound</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleSaveRegional}
            className="mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-xs font-bold cursor-pointer hover:opacity-95"
          >
            Save Preferences
          </button>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl border border-[#FCA5A5] p-5">
          <SectionHeader icon={<AlertTriangle size={18} className="text-[#DC2626]" />} title="Danger Zone" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#1A0A00]">Delete Account</p>
              <p className="text-[11px] text-[#8C7B6E]">Permanently delete your account and all data. This cannot be undone.</p>
            </div>
            <button
              onClick={() => setShowDeleteAccount(true)}
              className="px-4 py-2 rounded-xl bg-[#FEF2F2] text-[#DC2626] text-xs font-bold hover:bg-[#FEE2E2] transition-colors cursor-pointer shrink-0"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* ── Change Password Modal ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {showChangePwd && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => !pwdSubmitting && setShowChangePwd(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-[#1A0A00] flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  <Lock size={18} className="text-[#FF7A00]" /> Change Password
                </h3>
                <button onClick={() => setShowChangePwd(false)} className="text-[#8C7B6E] hover:text-[#1A0A00] cursor-pointer" aria-label="Close">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={pwdSubmit(onChangePwd)} className="space-y-4" noValidate>
                {/* Current Password */}
                <div>
                  <label htmlFor="currentPassword" className="text-xs font-bold text-[#8C7B6E] uppercase tracking-wider block mb-1">
                    Current Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="currentPassword"
                      type={showCurrentPwd ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...pwdReg('currentPassword')}
                      className={pwdInputClass('currentPassword')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B5A99A] hover:text-[#4A3728] cursor-pointer"
                      aria-label={showCurrentPwd ? 'Hide password' : 'Show password'}
                    >
                      {showCurrentPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <AnimatePresence mode="wait">
                    {pwdErrors.currentPassword ? <FieldError key="e" message={pwdErrors.currentPassword.message} /> : pwdTouched.currentPassword && !pwdErrors.currentPassword ? <FieldSuccess key="s" /> : null}
                  </AnimatePresence>
                </div>

                {/* New Password */}
                <div>
                  <label htmlFor="newPassword" className="text-xs font-bold text-[#8C7B6E] uppercase tracking-wider block mb-1">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      type={showNewPwd ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...pwdReg('newPassword')}
                      className={pwdInputClass('newPassword')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPwd(!showNewPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B5A99A] hover:text-[#4A3728] cursor-pointer"
                      aria-label={showNewPwd ? 'Hide password' : 'Show password'}
                    >
                      {showNewPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <AnimatePresence mode="wait">
                    {pwdErrors.newPassword ? <FieldError key="e" message={pwdErrors.newPassword.message} /> : null}
                  </AnimatePresence>
                  {/* Password Strength Meter */}
                  {watchedNewPwd && pwdStrength && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#8C7B6E]">Strength</span>
                        <span className={`text-xs font-bold ${pwdStrength.textColor}`}>{pwdStrength.label}</span>
                      </div>
                      <div className="h-1.5 bg-[#F0EDE8] rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${pwdStrength.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: pwdStrength.width }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-1 mt-2">
                        {[
                          { label: '8+ characters', ok: watchedNewPwd.length >= 8 },
                          { label: 'Uppercase (A–Z)', ok: /[A-Z]/.test(watchedNewPwd) },
                          { label: 'Lowercase (a–z)', ok: /[a-z]/.test(watchedNewPwd) },
                          { label: 'Number (0–9)', ok: /[0-9]/.test(watchedNewPwd) },
                          { label: 'Special char', ok: /[^A-Za-z0-9]/.test(watchedNewPwd) },
                        ].map((req) => (
                          <div key={req.label} className="flex items-center gap-1.5 text-[11px]">
                            <div className={cn('w-4 h-4 rounded-full flex items-center justify-center shrink-0', req.ok ? 'bg-green-500 text-white' : 'bg-[#E8E4DE] text-[#B5A99A]')}>
                              <Check size={8} />
                            </div>
                            <span className={req.ok ? 'text-green-600' : 'text-[#8C7B6E]'}>{req.label}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Confirm New Password */}
                <div>
                  <label htmlFor="confirmNewPassword" className="text-xs font-bold text-[#8C7B6E] uppercase tracking-wider block mb-1">
                    Confirm New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="confirmNewPassword"
                      type={showConfirmPwd ? 'text' : 'password'}
                      placeholder="••••••••"
                      onPaste={(e) => e.preventDefault()}
                      {...pwdReg('confirmNewPassword')}
                      className={pwdInputClass('confirmNewPassword')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B5A99A] hover:text-[#4A3728] cursor-pointer"
                      aria-label={showConfirmPwd ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <AnimatePresence mode="wait">
                    {pwdErrors.confirmNewPassword ? <FieldError key="e" message={pwdErrors.confirmNewPassword.message} /> : pwdTouched.confirmNewPassword && !pwdErrors.confirmNewPassword ? <FieldSuccess key="s" /> : null}
                  </AnimatePresence>
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => { setShowChangePwd(false); pwdReset(); }}
                    className="flex-1 h-12 rounded-xl border-2 border-[#E8E4DE] text-sm font-semibold text-[#4A3728] cursor-pointer"
                    disabled={pwdSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!pwdValid || pwdSubmitting}
                    className={cn(
                      'flex-1 h-12 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2',
                      'bg-gradient-to-r from-[#FF7A00] to-[#FF4500] shadow-lg shadow-orange-500/30',
                      'active:scale-[0.98] transition-all duration-200',
                      (!pwdValid || pwdSubmitting) && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {pwdSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Changing...</> : 'Change Password'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete Account Modal ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {showDeleteAccount && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => !delSubmitting && setShowDeleteAccount(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-[#DC2626]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Delete Account
                </h3>
                <button onClick={() => setShowDeleteAccount(false)} className="text-[#8C7B6E] hover:text-[#1A0A00] cursor-pointer" aria-label="Close">
                  <X size={20} />
                </button>
              </div>

              <div className="bg-[#FEF2F2] rounded-xl p-4 text-xs text-[#DC2626] space-y-1.5">
                <p className="font-bold text-sm">⚠️ This action is permanent and cannot be undone.</p>
                <ul className="list-disc list-inside space-y-0.5 text-[#8C7B6E]">
                  <li>All your orders and order history will be lost</li>
                  <li>Your wishlist and saved addresses will be deleted</li>
                  <li>Your reviews and ratings will be removed</li>
                  <li>Any wallet balance will be forfeited</li>
                </ul>
              </div>

              <form onSubmit={delSubmit(onDeleteAccount)} className="space-y-4" noValidate>
                {/* Reason */}
                <div>
                  <label htmlFor="reason" className="text-xs font-bold text-[#8C7B6E] uppercase tracking-wider block mb-1">
                    Reason for leaving <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="reason"
                    {...delReg('reason')}
                    className={cn(
                      'w-full h-12 px-4 rounded-xl border-2 text-base bg-white outline-none transition-all duration-200 appearance-none cursor-pointer',
                      delErrors.reason ? 'border-red-500 focus:ring-red-500/20' : 'border-[#E8E4DE] focus:border-[#FF7A00] focus:ring-[#FF7A00]/20',
                      'focus:ring-4'
                    )}
                  >
                    <option value="">Select a reason...</option>
                    <option value="not_using_anymore">Not using the platform anymore</option>
                    <option value="privacy_concerns">Privacy concerns</option>
                    <option value="too_many_emails">Too many emails/notifications</option>
                    <option value="found_better_platform">Found a better platform</option>
                    <option value="dissatisfied_with_service">Dissatisfied with service</option>
                    <option value="temporary_break">Taking a temporary break</option>
                    <option value="other">Other</option>
                  </select>
                  <AnimatePresence mode="wait">
                    {delErrors.reason ? (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1.5 text-sm text-red-600 mt-1.5" role="alert">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        {delErrors.reason.message}
                      </motion.p>
                    ) : null}
                  </AnimatePresence>
                </div>

                {/* Confirmation text */}
                <div>
                  <label htmlFor="confirmText" className="text-xs font-bold text-[#8C7B6E] uppercase tracking-wider block mb-1">
                    Type <span className="font-black text-[#DC2626]">DELETE MY ACCOUNT</span> to confirm <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="confirmText"
                    type="text"
                    placeholder="DELETE MY ACCOUNT"
                    {...delReg('confirmText', {
                      onChange: (e) => { e.target.value = e.target.value.toUpperCase(); }
                    })}
                    className={delInputClass('confirmText')}
                  />
                  <AnimatePresence mode="wait">
                    {delErrors.confirmText ? <FieldError key="e" message={delErrors.confirmText.message} /> : null}
                  </AnimatePresence>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="deletePassword" className="text-xs font-bold text-[#8C7B6E] uppercase tracking-wider block mb-1">
                    Your Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="deletePassword"
                      type={showDelPwd ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...delReg('password')}
                      className={cn(delInputClass('password'), 'pr-11')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowDelPwd(!showDelPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B5A99A] hover:text-[#4A3728] cursor-pointer"
                      aria-label={showDelPwd ? 'Hide password' : 'Show password'}
                    >
                      {showDelPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <AnimatePresence mode="wait">
                    {delErrors.password ? <FieldError key="e" message={delErrors.password.message} /> : null}
                  </AnimatePresence>
                </div>

                {/* Acknowledgements */}
                <div className="space-y-3 pt-1">
                  {[
                    { field: 'acknowledgeDataLoss' as const, label: 'I understand all my data will be permanently deleted and cannot be recovered' },
                    { field: 'acknowledgeOrderHistory' as const, label: 'I understand my order history and wallet balance will be permanently lost' },
                  ].map(({ field, label }) => (
                    <label key={field} className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        {...delReg(field)}
                        className="mt-0.5 rounded border-2 border-[#E8E4DE] text-[#DC2626] focus:ring-[#DC2626] w-4 h-4 shrink-0 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-[#4A3728] leading-relaxed">{label}</span>
                    </label>
                  ))}
                  {(delErrors.acknowledgeDataLoss || delErrors.acknowledgeOrderHistory) && (
                    <FieldError message="Please acknowledge all consequences before proceeding" />
                  )}
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => { setShowDeleteAccount(false); delReset(); }}
                    className="flex-1 h-12 rounded-xl border-2 border-[#E8E4DE] text-sm font-semibold text-[#4A3728] cursor-pointer"
                    disabled={delSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!delValid || delSubmitting}
                    className={cn(
                      'flex-1 h-12 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2',
                      'bg-[#DC2626] hover:bg-[#B91C1C] active:scale-[0.98] transition-all duration-200',
                      (!delValid || delSubmitting) && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {delSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</> : 'Permanently Delete My Account'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
