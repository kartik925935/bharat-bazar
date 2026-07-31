'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Globe, Bell, Lock, Smartphone, Eye, EyeOff, X, AlertTriangle, Check } from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_SETTINGS, type MockSettings } from '@/lib/mock/customer';

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${checked ? 'bg-[#FF7A00]' : 'bg-[#E8E4DE]'}`}
    >
      <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform mx-0.5 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<MockSettings>(MOCK_SETTINGS);

  // Change password modal
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);

  // Delete account modal
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deletePwd, setDeletePwd] = useState('');

  const toggle = (key: keyof MockSettings) => {
    setSettings((prev) => {
      const val = !prev[key];
      toast.success(`${key === 'twoFactor' ? '2FA' : key.replace(/([A-Z])/g, ' $1').trim()} ${val ? 'enabled' : 'disabled'}`);
      return { ...prev, [key]: val };
    });
  };

  const handleSaveRegional = () => {
    toast.success('Regional preferences saved!');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPwd) { toast.error('Enter your current password'); return; }
    if (newPwd.length < 8) { toast.error('New password must be at least 8 characters'); return; }
    if (newPwd !== confirmPwd) { toast.error('Passwords don\'t match'); return; }
    setChangingPwd(true);
    setTimeout(() => {
      setChangingPwd(false);
      setShowChangePwd(false);
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
      toast.success('Password changed successfully! 🔒');
    }, 1200);
  };

  const handleDeleteAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirmText !== 'DELETE') { toast.error('Type DELETE to confirm'); return; }
    if (!deletePwd) { toast.error('Enter your password to confirm'); return; }
    toast.success('Account deletion request submitted. You\'ll receive a confirmation email.');
    setShowDeleteAccount(false);
    setDeleteConfirmText(''); setDeletePwd('');
  };

  const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <div className="flex items-center gap-2 border-b border-[#F0EDE8] pb-3 mb-4">
      <div className="text-[#FF7A00]">{icon}</div>
      <h3 className="text-sm font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>{title}</h3>
    </div>
  );

  const ToggleRow = ({ label, sub, checked, onToggle }: { label: string; sub?: string; checked: boolean; onToggle: () => void }) => (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-xs font-bold text-[#1A0A00]">{label}</p>
        {sub && <p className="text-[11px] text-[#8C7B6E] mt-0.5">{sub}</p>}
      </div>
      <Toggle checked={checked} onChange={onToggle} />
    </div>
  );

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>
          ⚙️ Account Settings
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
              <button onClick={() => setShowChangePwd(true)} className="text-xs font-bold text-[#FF7A00] hover:underline cursor-pointer">
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
                className="w-full h-10 px-3 rounded-xl border border-[#E8E4DE] text-xs font-semibold text-[#1A0A00] bg-white outline-none focus:border-[#FF7A00]"
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
                className="w-full h-10 px-3 rounded-xl border border-[#E8E4DE] text-xs font-semibold text-[#1A0A00] bg-white outline-none focus:border-[#FF7A00]"
              >
                <option value="INR (₹)">INR (₹) Indian Rupee</option>
                <option value="USD ($)">USD ($) US Dollar</option>
                <option value="GBP (£)">GBP (£) British Pound</option>
              </select>
            </div>
          </div>
          <button onClick={handleSaveRegional} className="mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-xs font-bold cursor-pointer hover:opacity-95">
            Save Preferences
          </button>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl border border-[#FCA5A5] p-5">
          <SectionHeader icon={<AlertTriangle size={18} className="text-[#DC2626]" />} title="Danger Zone" />
          <div className="space-y-3">
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
      </div>

      {/* ── Change Password Modal ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showChangePwd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => !changingPwd && setShowChangePwd(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>Change Password</h3>
                <button onClick={() => setShowChangePwd(false)} className="text-[#8C7B6E] hover:text-[#1A0A00] cursor-pointer"><X size={20} /></button>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                {[
                  { label: 'Current Password', value: currentPwd, onChange: setCurrentPwd, show: showCurrentPwd, toggleShow: () => setShowCurrentPwd(s => !s) },
                  { label: 'New Password', value: newPwd, onChange: setNewPwd, show: showNewPwd, toggleShow: () => setShowNewPwd(s => !s) },
                  { label: 'Confirm New Password', value: confirmPwd, onChange: setConfirmPwd, show: showNewPwd, toggleShow: () => setShowNewPwd(s => !s) },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="text-xs font-bold text-[#8C7B6E] uppercase tracking-wider block mb-1">{field.label}</label>
                    <div className="relative">
                      <input
                        type={field.show ? 'text' : 'password'}
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-full h-11 px-4 pr-11 rounded-xl border border-[#E8E4DE] text-sm outline-none focus:border-[#FF7A00]"
                        placeholder="••••••••"
                      />
                      <button type="button" onClick={field.toggleShow}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B5A99A] hover:text-[#4A3728] cursor-pointer">
                        {field.show ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                ))}

                {newPwd && (
                  <div className="space-y-1">
                    {[
                      { label: 'At least 8 characters', ok: newPwd.length >= 8 },
                      { label: 'Contains uppercase letter', ok: /[A-Z]/.test(newPwd) },
                      { label: 'Contains a number', ok: /\d/.test(newPwd) },
                    ].map((req) => (
                      <div key={req.label} className="flex items-center gap-2 text-[11px]">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${req.ok ? 'bg-[#16A34A] text-white' : 'bg-[#E8E4DE] text-[#B5A99A]'}`}>
                          <Check size={9} />
                        </div>
                        <span className={req.ok ? 'text-[#16A34A]' : 'text-[#8C7B6E]'}>{req.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setShowChangePwd(false)}
                    className="flex-1 h-11 rounded-xl border border-[#E8E4DE] text-sm font-semibold text-[#4A3728] cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" disabled={changingPwd}
                    className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-sm font-bold cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2">
                    {changingPwd ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Change Password'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete Account Modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {showDeleteAccount && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteAccount(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-[#DC2626]" style={{ fontFamily: "'Playfair Display', serif" }}>Delete Account</h3>
                <button onClick={() => setShowDeleteAccount(false)} className="text-[#8C7B6E] hover:text-[#1A0A00] cursor-pointer"><X size={20} /></button>
              </div>

              <div className="bg-[#FEF2F2] rounded-xl p-4 text-xs text-[#DC2626] space-y-1">
                <p className="font-bold">⚠️ This action is permanent and cannot be undone.</p>
                <p className="text-[#8C7B6E]">All your orders, wishlist, reviews, and wallet balance will be permanently deleted.</p>
              </div>

              <form onSubmit={handleDeleteAccount} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-[#8C7B6E] uppercase tracking-wider block mb-1">Type DELETE to confirm</label>
                  <input type="text" value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())}
                    placeholder="DELETE" className="w-full h-11 px-4 rounded-xl border border-[#E8E4DE] text-sm font-semibold outline-none focus:border-[#DC2626]" />
                </div>
                <div>
                  <label className="font-bold text-[#8C7B6E] uppercase tracking-wider block mb-1">Confirm Password</label>
                  <input type="password" value={deletePwd} onChange={(e) => setDeletePwd(e.target.value)}
                    placeholder="••••••••" className="w-full h-11 px-4 rounded-xl border border-[#E8E4DE] text-sm outline-none focus:border-[#DC2626]" />
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setShowDeleteAccount(false)}
                    className="flex-1 h-11 rounded-xl border border-[#E8E4DE] text-sm font-semibold text-[#4A3728] cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" disabled={deleteConfirmText !== 'DELETE' || !deletePwd}
                    className="flex-1 h-11 rounded-xl bg-[#DC2626] text-white text-sm font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                    Delete My Account
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
