'use client';

import { useSellerStore } from '@/lib/store/seller-store';
import { Store, Palmtree, Truck, ShieldCheck, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function SellerSettingsPage() {
  const { seller, updateProfile, toggleVacationMode } = useSellerStore();
  const [vacationMsg, setVacationMsg] = useState(seller?.vacationMessage || '');

  if (!seller) return null;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#1A1A1A]">Shop Settings</h1>
        <p className="text-sm text-[#9B8F84]">Manage your shop preferences and availability</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Vacation Mode */}
          <div className="bg-white rounded-2xl border border-[#F0EDE8] overflow-hidden">
            <div className="p-5 border-b border-[#F0EDE8] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${seller.vacationMode ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500'}`}>
                  <Palmtree size={20} />
                </div>
                <div>
                  <h2 className="text-base font-black text-[#1A1A1A]">Vacation Mode</h2>
                  <p className="text-xs text-[#9B8F84]">Temporarily hide your products from the store</p>
                </div>
              </div>
              <button
                onClick={() => { toggleVacationMode(); toast.success(seller.vacationMode ? 'Vacation mode off' : 'Vacation mode on'); }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${seller.vacationMode ? 'bg-[#FF7A00]' : 'bg-[#D4C9BF]'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${seller.vacationMode ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            {seller.vacationMode && (
              <div className="p-5 bg-[#FAFAF8]">
                <label className="block text-xs font-bold text-[#1A1A1A] mb-2">Message to Customers</label>
                <textarea
                  value={vacationMsg}
                  onChange={e => setVacationMsg(e.target.value)}
                  className="w-full border border-[#F0EDE8] rounded-xl p-3 text-sm"
                  rows={2}
                  placeholder="E.g. We are on a break for Diwali. Will be back on..."
                />
                <button
                  onClick={() => { updateProfile({ vacationMessage: vacationMsg }); toast.success('Message saved'); }}
                  className="mt-3 px-4 py-2 bg-[#1A1A1A] text-white text-xs font-bold rounded-xl"
                >
                  Save Message
                </button>
              </div>
            )}
          </div>

          {/* Shipping & Processing */}
          <div className="bg-white rounded-2xl border border-[#F0EDE8] p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><Truck size={20} /></div>
              <div>
                <h2 className="text-base font-black text-[#1A1A1A]">Shipping & Processing</h2>
                <p className="text-xs text-[#9B8F84]">How you handle orders</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">Standard Processing Time (Days)</label>
                <select 
                  className="w-full sm:w-1/2 border border-[#F0EDE8] rounded-xl p-3 text-sm bg-white"
                  value={seller.processingDays}
                  onChange={e => { updateProfile({ processingDays: Number(e.target.value) }); toast.success('Updated'); }}
                >
                  <option value={1}>1 Day</option>
                  <option value={2}>2 Days</option>
                  <option value={3}>3 Days</option>
                  <option value={5}>5 Days</option>
                  <option value={7}>7 Days</option>
                </select>
                <p className="text-[10px] text-[#9B8F84] mt-1">Time taken to pack and dispatch after receiving an order</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Read only info block */}
          <div className="bg-white rounded-2xl border border-[#F0EDE8] p-5">
            <h3 className="text-sm font-black text-[#1A1A1A] mb-4 uppercase tracking-wide flex items-center gap-2"><ShieldCheck size={16} className="text-emerald-500"/> Verified Info</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-[#9B8F84]">Legal Name</p>
                <p className="font-bold text-[#1A1A1A]">{seller.legalName}</p>
              </div>
              <div>
                <p className="text-xs text-[#9B8F84]">PAN Number</p>
                <p className="font-bold text-[#1A1A1A]">{seller.panNumber}</p>
              </div>
              <div>
                <p className="text-xs text-[#9B8F84]">Bank Account</p>
                <p className="font-bold text-[#1A1A1A]">{seller.bankAccountNumber} ({seller.bankName})</p>
              </div>
              <div className="pt-3 mt-3 border-t border-[#F0EDE8]">
                <p className="text-[10px] text-[#9B8F84]">To change verified information, please contact seller support and provide new KYC documents.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
