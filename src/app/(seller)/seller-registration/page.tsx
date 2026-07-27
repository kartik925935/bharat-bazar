'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function SellerRegistrationPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    shopName: '',
    sellerType: 'artisan',
    state: 'Rajasthan',
    aadhaar: '',
    pan: '',
  });

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Registration submitted! Our team will verify your KYC documents within 24 hours.');
    router.push('/seller-dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#1C1B14] mb-2 text-center">Become a Seller on Bharat Bazaar</h1>
        <p className="text-xs text-[#8C8B80] text-center mb-8">Join 50,000+ artisans, NGOs, and village producers across India</p>

        {/* Step Indicator */}
        <div className="flex justify-around mb-8">
          {[
            { id: 1, label: 'Personal Info' },
            { id: 2, label: 'Shop Details' },
            { id: 3, label: 'KYC & Verification' },
          ].map((s) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= s.id ? 'bg-[#FF7A00] text-white' : 'bg-gray-200 text-gray-500'}`}>
                {step > s.id ? <Check size={14} /> : s.id}
              </div>
              <span className="text-xs font-semibold hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-4">
          {step === 1 && (
            <>
              <h2 className="font-bold text-lg mb-4">Step 1: Personal Details</h2>
              <div>
                <label className="block text-xs font-semibold text-[#555449] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Meena Devi"
                  className="w-full h-11 px-4 rounded-xl border border-black/10 text-xs outline-none focus:border-[#FF7A00]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#555449] mb-1">Mobile Number (Aadhaar Linked)</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full h-11 px-4 rounded-xl border border-black/10 text-xs outline-none focus:border-[#FF7A00]"
                />
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full h-11 rounded-xl bg-[#FF7A00] text-white font-semibold text-xs mt-4"
              >
                Next: Shop Details →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="font-bold text-lg mb-4">Step 2: Shop & Craft Details</h2>
              <div>
                <label className="block text-xs font-semibold text-[#555449] mb-1">Shop / Enterprise Name</label>
                <input
                  type="text"
                  required
                  value={formData.shopName}
                  onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                  placeholder="e.g. Meena Handicrafts"
                  className="w-full h-11 px-4 rounded-xl border border-black/10 text-xs outline-none focus:border-[#FF7A00]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#555449] mb-1">Seller Category / Type</label>
                <select
                  value={formData.sellerType}
                  onChange={(e) => setFormData({ ...formData, sellerType: e.target.value })}
                  className="w-full h-11 px-3 rounded-xl border border-black/10 text-xs outline-none focus:border-[#FF7A00]"
                >
                  <option value="artisan">Individual Artisan</option>
                  <option value="ngo">NGO / Welfare Society</option>
                  <option value="village_producer">Village Producer Co-op</option>
                  <option value="shg">Self-Help Group (SHG)</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setStep(1)} className="flex-1 h-11 rounded-xl border text-xs font-semibold">Back</button>
                <button type="button" onClick={() => setStep(3)} className="flex-1 h-11 rounded-xl bg-[#FF7A00] text-white text-xs font-semibold">Next: KYC Verification →</button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="font-bold text-lg mb-4">Step 3: Aadhaar & PAN KYC</h2>
              <div>
                <label className="block text-xs font-semibold text-[#555449] mb-1">Aadhaar Number (12 Digits)</label>
                <input
                  type="text"
                  required
                  maxLength={12}
                  value={formData.aadhaar}
                  onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value })}
                  placeholder="1234 5678 9012"
                  className="w-full h-11 px-4 rounded-xl border border-black/10 text-xs outline-none focus:border-[#FF7A00]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#555449] mb-1">PAN Card Number</label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={formData.pan}
                  onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                  placeholder="ABCDE1234F"
                  className="w-full h-11 px-4 rounded-xl border border-black/10 text-xs outline-none focus:border-[#FF7A00]"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => setStep(2)} className="flex-1 h-11 rounded-xl border text-xs font-semibold">Back</button>
                <button type="submit" className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-xs font-bold">Submit Registration</button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
