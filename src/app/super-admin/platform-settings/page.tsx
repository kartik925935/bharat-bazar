'use client';

import { useState } from 'react';
import { Save, AlertTriangle, ShieldCheck, Mail, Settings2, Database, Zap, Key, Trash2, Plus } from 'lucide-react';
import { useSuperAdminStore } from '@/lib/store/super-admin-store';
import { toast } from 'sonner';

export default function PlatformSettingsPage() {
  const { platformSettings, updatePlatformSettings, partnerApis, generatePartnerApiKey, revokePartnerApiKey } = useSuperAdminStore();
  const [settings, setSettings] = useState(platformSettings);
  const [newKeyName, setNewKeyName] = useState('');

  const handleSave = () => {
    updatePlatformSettings(settings);
    toast.success('Platform configurations saved successfully');
  };

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName) return toast.error('API Key name is required');
    generatePartnerApiKey(newKeyName);
    setNewKeyName('');
    toast.success('Partner API Key generated');
  };

  return (
    <div className="space-y-6 pb-20 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F0F0F8]" style={{ fontFamily: "'Playfair Display', serif" }}>
            ⚙️ Platform Configurations
          </h1>
          <p className="text-xs text-[#9898B0] mt-0.5">Global settings, features toggles, and system parameters</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-xs font-bold hover:opacity-90 cursor-pointer shadow-lg">
          <Save size={14} /> Save Changes
        </button>
      </div>

      {settings.maintenanceMode && (
        <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="text-[#F59E0B] shrink-0 mt-0.5" size={18} />
          <div>
            <h3 className="text-xs font-bold text-[#F59E0B]">Maintenance Mode Active</h3>
            <p className="text-[11px] text-[#9898B0] mt-1">The platform is currently offline for non-admin users. Traffic is being redirected to the maintenance page.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl p-6 space-y-5 shadow-xl">
            <h2 className="text-sm font-black text-[#F0F0F8] border-b border-[#1E1E2E] pb-3 flex items-center gap-2"><Settings2 size={16} className="text-[#FF7A00]"/> General Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] font-bold text-[#5C5C78] uppercase mb-1 block">Platform Name</label>
                <input value={settings.siteName} onChange={(e) => setSettings({...settings, siteName: e.target.value})} className="w-full h-10 bg-[#111118] border border-[#1E1E2E] rounded-xl px-4 text-xs text-[#F0F0F8] focus:border-[#FF7A00] outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#5C5C78] uppercase mb-1 block">Tagline</label>
                <input value={settings.siteTagline} onChange={(e) => setSettings({...settings, siteTagline: e.target.value})} className="w-full h-10 bg-[#111118] border border-[#1E1E2E] rounded-xl px-4 text-xs text-[#F0F0F8] focus:border-[#FF7A00] outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#5C5C78] uppercase mb-1 block">Support Email</label>
                <input value={settings.supportEmail} onChange={(e) => setSettings({...settings, supportEmail: e.target.value})} className="w-full h-10 bg-[#111118] border border-[#1E1E2E] rounded-xl px-4 text-xs text-[#F0F0F8] focus:border-[#FF7A00] outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#5C5C78] uppercase mb-1 block">Finance Dept Email</label>
                <input value={settings.financeEmail} onChange={(e) => setSettings({...settings, financeEmail: e.target.value})} className="w-full h-10 bg-[#111118] border border-[#1E1E2E] rounded-xl px-4 text-xs text-[#F0F0F8] focus:border-[#FF7A00] outline-none" />
              </div>
            </div>
          </div>

          <div className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl p-6 space-y-5 shadow-xl">
            <h2 className="text-sm font-black text-[#F0F0F8] border-b border-[#1E1E2E] pb-3 flex items-center gap-2"><Database size={16} className="text-[#FF7A00]"/> Operational Parameters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] font-bold text-[#5C5C78] uppercase mb-1 block">Settlement Cycle (Days)</label>
                <input type="number" value={settings.settlementCycleDays} onChange={(e) => setSettings({...settings, settlementCycleDays: Number(e.target.value)})} className="w-full h-10 bg-[#111118] border border-[#1E1E2E] rounded-xl px-4 text-xs text-[#F0F0F8] font-mono focus:border-[#FF7A00] outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#5C5C78] uppercase mb-1 block">Min Withdrawal (₹)</label>
                <input type="number" value={settings.minWithdrawalAmount} onChange={(e) => setSettings({...settings, minWithdrawalAmount: Number(e.target.value)})} className="w-full h-10 bg-[#111118] border border-[#1E1E2E] rounded-xl px-4 text-xs text-[#F0F0F8] font-mono focus:border-[#FF7A00] outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#5C5C78] uppercase mb-1 block">Default Commission (%)</label>
                <input type="number" value={settings.defaultCommissionRate} onChange={(e) => setSettings({...settings, defaultCommissionRate: Number(e.target.value)})} className="w-full h-10 bg-[#111118] border border-[#1E1E2E] rounded-xl px-4 text-xs text-[#F0F0F8] font-mono focus:border-[#FF7A00] outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#5C5C78] uppercase mb-1 block">Max Products Per Seller</label>
                <input type="number" value={settings.maxProductsPerSeller} onChange={(e) => setSettings({...settings, maxProductsPerSeller: Number(e.target.value)})} className="w-full h-10 bg-[#111118] border border-[#1E1E2E] rounded-xl px-4 text-xs text-[#F0F0F8] font-mono focus:border-[#FF7A00] outline-none" />
              </div>
            </div>
          </div>

          <div className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl p-6 space-y-5 shadow-xl">
            <h2 className="text-sm font-black text-[#F0F0F8] border-b border-[#1E1E2E] pb-3 flex items-center gap-2"><Key size={16} className="text-[#A855F7]"/> Partner APIs</h2>
            <div className="space-y-4">
              <form onSubmit={handleGenerateKey} className="flex gap-2">
                <input 
                  type="text" 
                  value={newKeyName} 
                  onChange={e => setNewKeyName(e.target.value)} 
                  placeholder="App Name (e.g. Inventory Sync Tool)" 
                  className="flex-1 h-10 bg-[#111118] border border-[#1E1E2E] rounded-xl px-4 text-xs text-[#F0F0F8] focus:border-[#A855F7] outline-none" 
                />
                <button type="submit" className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#7E22CE] text-white text-xs font-bold hover:opacity-90 flex items-center gap-1">
                  <Plus size={14} /> Generate Key
                </button>
              </form>
              
              {partnerApis.length > 0 ? (
                <div className="space-y-2 mt-4">
                  {partnerApis.map(api => (
                    <div key={api.id} className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-3 flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold text-[#F0F0F8]">{api.name}</p>
                        <p className="text-[10px] font-mono text-[#5C5C78] mt-0.5">{api.key}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] text-[#5C5C78]">Created: {api.createdAt}</span>
                        <button onClick={() => revokePartnerApiKey(api.id)} className="p-1.5 text-[#EF4444] bg-[#EF4444]/10 rounded hover:bg-[#EF4444]/20 transition-colors" title="Revoke">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#5C5C78] mt-2 italic">No partner APIs generated yet.</p>
              )}
            </div>
          </div>

        </div>

        <div className="space-y-6">
          <div className="bg-[#16161F] border border-[#1E1E2E] rounded-2xl p-6 space-y-5 shadow-xl">
            <h2 className="text-sm font-black text-[#F0F0F8] border-b border-[#1E1E2E] pb-3 flex items-center gap-2"><Zap size={16} className="text-[#FF7A00]"/> Feature Toggles</h2>
            <div className="space-y-4">
              {[
                { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Blocks all non-admin traffic' },
                { key: 'autoApproveProducts', label: 'Auto-Approve Products', desc: 'Bypasses manual product moderation' },
                { key: 'autoApproveSellers', label: 'Auto-Approve Sellers', desc: 'Bypasses KYC manual review' },
                { key: 'razorpayEnabled', label: 'Razorpay Gateway', desc: 'Primary payment processor' },
                { key: 'upiEnabled', label: 'UPI Payments', desc: 'Enable native UPI intents' },
                { key: 'codEnabled', label: 'Cash on Delivery', desc: 'Enable COD for eligible items' }
              ].map(toggle => (
                <div key={toggle.key} className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#F0F0F8]">{toggle.label}</p>
                    <p className="text-[10px] text-[#5C5C78]">{toggle.desc}</p>
                  </div>
                  <button 
                    onClick={() => handleToggle(toggle.key as keyof typeof settings)}
                    className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${settings[toggle.key as keyof typeof settings] ? 'bg-[#22C55E]' : 'bg-[#1E1E2E]'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${settings[toggle.key as keyof typeof settings] ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
