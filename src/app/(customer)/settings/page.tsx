'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, Bell, Lock, Smartphone, Globe, Moon, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [currency, setCurrency] = useState('INR (₹)');
  const [lang, setLang]         = useState('English');
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>
          ⚙️ Account Settings
        </h1>
        <p className="text-sm text-[#8C7B6E] mt-0.5">Manage security, language and regional preferences</p>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {/* Security */}
        <div className="bg-white rounded-2xl border border-[#E8E4DE] p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#F0EDE8] pb-3">
            <Shield size={18} className="text-[#FF7A00]" />
            <h3 className="text-sm font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>Security</h3>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#1A0A00]">Two-Factor Authentication (2FA)</p>
              <p className="text-[11px] text-[#8C7B6E]">Secure your account with SMS OTP verification on sign in</p>
            </div>
            <button
              onClick={() => { setTwoFactor(!twoFactor); toast.success(`2FA ${!twoFactor ? 'enabled' : 'disabled'}`); }}
              className={`w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${twoFactor ? 'bg-[#FF7A00]' : 'bg-[#E8E4DE]'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform mx-0.5 ${twoFactor ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={() => toast.info('Password change modal coming soon')}
              className="text-xs font-bold text-[#FF7A00] hover:underline cursor-pointer"
            >
              Change Account Password →
            </button>
          </div>
        </div>

        {/* Regional */}
        <div className="bg-white rounded-2xl border border-[#E8E4DE] p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#F0EDE8] pb-3">
            <Globe size={18} className="text-[#FF7A00]" />
            <h3 className="text-sm font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>Regional Preferences</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#8C7B6E] block mb-1">Language</label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#E8E4DE] text-xs font-semibold text-[#1A0A00] bg-white outline-none focus:border-[#FF7A00]"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi (हिंदी) — Coming Soon</option>
                <option value="Bengali">Bengali (বাংলা) — Coming Soon</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#8C7B6E] block mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#E8E4DE] text-xs font-semibold text-[#1A0A00] bg-white outline-none focus:border-[#FF7A00]"
              >
                <option value="INR (₹)">INR (₹) Indian Rupee</option>
                <option value="USD ($)">USD ($) US Dollar</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
