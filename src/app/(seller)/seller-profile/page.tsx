'use client';

import { useSellerStore } from '@/lib/store/seller-store';
import { User, Store, Mail, Phone, MapPin, Building, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function SellerProfilePage() {
  const { seller } = useSellerStore();

  if (!seller) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#1A1A1A]">Profile & KYC</h1>
        <p className="text-sm text-[#9B8F84]">View your public profile and verified information</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Shop Info */}
        <div className="bg-white rounded-2xl border border-[#F0EDE8] overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-[#FF7A00] to-[#FF4500]" />
          <div className="px-6 pb-6 relative">
            <div className="w-20 h-20 rounded-2xl bg-white p-1 border border-[#F0EDE8] absolute -top-10 shadow-sm">
              <div className="w-full h-full bg-[#FFF7ED] rounded-xl flex items-center justify-center text-[#FF7A00] text-2xl font-black">
                {seller.shopName.charAt(0)}
              </div>
            </div>
            
            <div className="pt-12">
              <h2 className="text-xl font-black text-[#1A1A1A]">{seller.shopName}</h2>
              <p className="text-sm text-[#9B8F84] mb-4">@{seller.shopName.toLowerCase().replace(/\s+/g, '-')}</p>
              
              <div className="space-y-4">
                <div className="flex gap-3 text-sm text-[#4A4540]">
                  <Store size={18} className="text-[#C4B8AF] flex-shrink-0" />
                  <div>
                    <p className="font-bold">About Shop</p>
                    <p className="text-[#9B8F84] mt-1">{seller.shopDescription}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-sm text-[#4A4540]">
                  <Building size={18} className="text-[#C4B8AF]" />
                  <span>Seller Type: <strong className="capitalize">{seller.sellerType.replace('_', ' ')}</strong></span>
                </div>
                
                <div className="flex items-center gap-3 text-sm text-[#4A4540]">
                  <MapPin size={18} className="text-[#C4B8AF]" />
                  <span>{seller.district}, {seller.state}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal & Contact */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#F0EDE8] p-6">
            <h3 className="text-sm font-black text-[#1A1A1A] mb-4 uppercase tracking-wide flex items-center gap-2">
              <User size={16} className="text-[#FF7A00]" /> Personal Info
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-[#9B8F84]">Display Name</p>
                <p className="font-bold text-[#1A1A1A]">{seller.displayName}</p>
              </div>
              <div>
                <p className="text-xs text-[#9B8F84]">Legal Name (KYC Verified)</p>
                <p className="font-bold text-[#1A1A1A] flex items-center gap-1">{seller.legalName} <CheckCircle2 size={12} className="text-emerald-500"/></p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#F0EDE8] p-6">
            <h3 className="text-sm font-black text-[#1A1A1A] mb-4 uppercase tracking-wide flex items-center gap-2">
              <Phone size={16} className="text-[#FF7A00]" /> Contact Info
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-[#C4B8AF]" />
                <div>
                  <p className="text-xs text-[#9B8F84]">Email</p>
                  <p className="font-bold text-[#1A1A1A]">{seller.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-[#C4B8AF]" />
                <div>
                  <p className="text-xs text-[#9B8F84]">Mobile</p>
                  <p className="font-bold text-[#1A1A1A]">{seller.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* KYC Status */}
          {seller.kycStatus === 'verified' && (
            <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="text-sm font-black text-emerald-800">KYC Verified</h3>
                <p className="text-xs text-emerald-600 mt-1">Your documents (PAN, Aadhaar) have been verified successfully.</p>
              </div>
            </div>
          )}
          {seller.kycStatus === 'pending' && (
            <div className="bg-orange-50 rounded-2xl border border-orange-100 p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="text-sm font-black text-orange-800">KYC Pending</h3>
                <p className="text-xs text-orange-600 mt-1">Your documents are currently under review by our admin team.</p>
              </div>
            </div>
          )}
          {seller.kycStatus === 'failed' && (
            <div className="bg-red-50 rounded-2xl border border-red-100 p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="text-sm font-black text-red-800">KYC Failed</h3>
                <p className="text-xs text-red-600 mt-1">Your documents could not be verified. Please update your details.</p>
              </div>
            </div>
          )}
          {seller.kycStatus === 'changes_required' && (
            <div className="bg-amber-50 rounded-2xl border border-amber-100 p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="text-sm font-black text-amber-800">Changes Required</h3>
                <p className="text-xs text-amber-600 mt-1">Please provide the requested documents to complete your KYC.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
