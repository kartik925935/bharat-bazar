'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Tag, Mail, Phone, Lock, Store, MapPin, ShieldCheck, Building, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { useSellerStore } from '@/lib/store/seller-store';
import { toast } from 'sonner';

export default function SellerRegisterPage() {
  const [step, setStep] = useState(1);
  const { register } = useSellerStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form State
  const [form, setForm] = useState({
    legalName: '', displayName: '', email: '', phone: '', password: '',
    sellerType: 'artisan' as any,
    shopName: '', shopDescription: '', shopCategory: '', pincode: '', district: '', state: '', fullAddress: '',
    panNumber: '', aadhaarNumber: '', bankAccountName: '', bankName: '', bankAccountNumber: '', ifscCode: '', accountType: 'savings' as any
  });

  const updateForm = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      nextStep();
      return;
    }
    setLoading(true);
    const res = await register({
      ...form,
      avatar: null, shopLogo: null, shopBanner: null, subCategories: [], village: '', gstNumber: null,
      shippingAreas: ['All India'], processingDays: 2,
      status: 'pending', vacationMode: false, vacationMessage: null,
    });
    setLoading(false);
    if (res.success) {
      setStep(5); // Success step
    } else {
      toast.error(res.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-5xl w-full bg-white rounded-3xl border border-[#F0EDE8] shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Context Panel */}
        <div className="hidden md:block w-2/5 bg-gradient-to-br from-[#1A0A00] to-[#3D1800] p-10 text-white relative">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at top left, #FF7A00 0%, transparent 60%)' }} />
          <div className="relative z-10 flex flex-col h-full">
            <Link href="/" className="inline-flex items-center gap-2 mb-12 text-white/80 hover:text-white transition-colors text-sm">
              <ArrowLeft size={16} /> Back
            </Link>

            <h2 className="text-3xl font-black mb-4">
              {step === 1 && 'Tell us about yourself'}
              {step === 2 && 'Build your digital shop'}
              {step === 3 && 'Secure verification'}
              {step === 4 && 'Banking & Setup'}
              {step === 5 && 'Welcome to Bharat Bazaar!'}
            </h2>
            <p className="text-white/70 text-sm mb-12">
              {step === 1 && 'Basic information to create your seller account.'}
              {step === 2 && 'How customers will see your brand on the platform.'}
              {step === 3 && 'To ensure platform safety and compliance.'}
              {step === 4 && 'So we can transfer your earnings securely.'}
              {step === 5 && 'Your application has been received.'}
            </p>

            {step < 5 && (
              <div className="mt-auto space-y-6">
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`flex-1 h-1.5 rounded-full ${i <= step ? 'bg-[#FF7A00]' : 'bg-white/20'}`} />
                  ))}
                </div>
                <p className="text-xs font-bold text-[#FF7A00] uppercase tracking-wide">Step {step} of 4</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="w-full md:w-3/5 p-6 sm:p-10 flex flex-col">
          {step === 5 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <Check className="text-emerald-500" size={40} />
              </motion.div>
              <h2 className="text-3xl font-black text-[#1A1A1A] mb-2">Application Submitted!</h2>
              <p className="text-[#9B8F84] mb-8 max-w-md">We're reviewing your application. You will receive an email once your account is approved.</p>
              <button onClick={() => router.push('/seller-dashboard')} className="px-8 py-3 bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white font-bold rounded-xl shadow-lg hover:-translate-y-0.5 transition-all">
                Go to Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1"
                >
                  {/* STEP 1: Personal Info */}
                  {step === 1 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-black text-[#1A1A1A] mb-6">Personal Information</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">Full Legal Name *</label>
                          <input required value={form.legalName} onChange={e=>updateForm('legalName', e.target.value)} className="w-full h-11 px-3 border border-[#F0EDE8] rounded-xl text-sm outline-none focus:border-[#FF7A00]" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">Display Name *</label>
                          <input required value={form.displayName} onChange={e=>updateForm('displayName', e.target.value)} className="w-full h-11 px-3 border border-[#F0EDE8] rounded-xl text-sm outline-none focus:border-[#FF7A00]" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">Email Address *</label>
                        <input type="email" required value={form.email} onChange={e=>updateForm('email', e.target.value)} className="w-full h-11 px-3 border border-[#F0EDE8] rounded-xl text-sm outline-none focus:border-[#FF7A00]" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">Mobile Number *</label>
                        <input required value={form.phone} onChange={e=>updateForm('phone', e.target.value)} className="w-full h-11 px-3 border border-[#F0EDE8] rounded-xl text-sm outline-none focus:border-[#FF7A00]" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">Password *</label>
                        <input type="password" required minLength={6} value={form.password} onChange={e=>updateForm('password', e.target.value)} className="w-full h-11 px-3 border border-[#F0EDE8] rounded-xl text-sm outline-none focus:border-[#FF7A00]" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#1A1A1A] mb-2 mt-4">I am a... *</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {[
                            { id: 'artisan', label: 'Artisan', icon: <User size={16}/> },
                            { id: 'ngo', label: 'NGO', icon: <Building size={16}/> },
                            { id: 'shop_owner', label: 'Shop Owner', icon: <Store size={16}/> },
                          ].map(t => (
                            <div
                              key={t.id}
                              onClick={() => updateForm('sellerType', t.id)}
                              className={`cursor-pointer border p-3 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition-all ${form.sellerType === t.id ? 'border-[#FF7A00] bg-[#FFF7ED] text-[#FF7A00]' : 'border-[#F0EDE8] text-[#9B8F84] hover:bg-[#FAFAF8]'}`}
                            >
                              {t.icon}
                              <span className="text-xs font-bold">{t.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Shop Setup */}
                  {step === 2 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-black text-[#1A1A1A] mb-6">Shop Setup</h3>
                      <div>
                        <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">Shop Name *</label>
                        <input required value={form.shopName} onChange={e=>updateForm('shopName', e.target.value)} className="w-full h-11 px-3 border border-[#F0EDE8] rounded-xl text-sm outline-none focus:border-[#FF7A00]" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">Shop Category *</label>
                        <select required value={form.shopCategory} onChange={e=>updateForm('shopCategory', e.target.value)} className="w-full h-11 px-3 border border-[#F0EDE8] rounded-xl text-sm outline-none focus:border-[#FF7A00] bg-white">
                          <option value="">Select category...</option>
                          <option value="Paintings & Art">Paintings & Art</option>
                          <option value="Handlooms">Handlooms & Textiles</option>
                          <option value="Jewelry">Handcrafted Jewelry</option>
                          <option value="Home Decor">Home Decor</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">Shop Description *</label>
                        <textarea required value={form.shopDescription} onChange={e=>updateForm('shopDescription', e.target.value)} rows={3} className="w-full px-3 py-2 border border-[#F0EDE8] rounded-xl text-sm outline-none focus:border-[#FF7A00] resize-none" placeholder="Tell customers about your craft..." />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4 mt-2">
                        <div>
                          <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">State *</label>
                          <input required value={form.state} onChange={e=>updateForm('state', e.target.value)} className="w-full h-11 px-3 border border-[#F0EDE8] rounded-xl text-sm outline-none focus:border-[#FF7A00]" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">City/District *</label>
                          <input required value={form.district} onChange={e=>updateForm('district', e.target.value)} className="w-full h-11 px-3 border border-[#F0EDE8] rounded-xl text-sm outline-none focus:border-[#FF7A00]" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">Pincode *</label>
                          <input required value={form.pincode} onChange={e=>updateForm('pincode', e.target.value)} className="w-full h-11 px-3 border border-[#F0EDE8] rounded-xl text-sm outline-none focus:border-[#FF7A00]" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">Full Address *</label>
                        <input required value={form.fullAddress} onChange={e=>updateForm('fullAddress', e.target.value)} className="w-full h-11 px-3 border border-[#F0EDE8] rounded-xl text-sm outline-none focus:border-[#FF7A00]" />
                      </div>
                    </div>
                  )}

                  {/* STEP 3: KYC */}
                  {step === 3 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-black text-[#1A1A1A] mb-6">KYC Information</h3>
                      <div className="bg-[#FFF7ED] border border-orange-100 p-4 rounded-xl mb-4">
                        <p className="text-xs font-bold text-[#FF7A00] flex items-center gap-2 mb-1"><ShieldCheck size={14}/> Secure Verification</p>
                        <p className="text-xs text-[#9B8F84]">Your details are encrypted and only used for verification and tax purposes.</p>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">PAN Card Number *</label>
                        <input required value={form.panNumber} onChange={e=>updateForm('panNumber', e.target.value.toUpperCase())} placeholder="ABCDE1234F" maxLength={10} className="w-full h-11 px-3 border border-[#F0EDE8] rounded-xl text-sm outline-none focus:border-[#FF7A00] font-mono" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">Aadhaar Number *</label>
                        <input required value={form.aadhaarNumber} onChange={e=>updateForm('aadhaarNumber', e.target.value)} placeholder="XXXX XXXX XXXX" maxLength={14} className="w-full h-11 px-3 border border-[#F0EDE8] rounded-xl text-sm outline-none focus:border-[#FF7A00] font-mono" />
                      </div>
                    </div>
                  )}

                  {/* STEP 4: Banking */}
                  {step === 4 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-black text-[#1A1A1A] mb-6">Banking Details</h3>
                      <div>
                        <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">Account Holder Name *</label>
                        <input required value={form.bankAccountName} onChange={e=>updateForm('bankAccountName', e.target.value)} className="w-full h-11 px-3 border border-[#F0EDE8] rounded-xl text-sm outline-none focus:border-[#FF7A00]" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">Bank Name *</label>
                        <input required value={form.bankName} onChange={e=>updateForm('bankName', e.target.value)} placeholder="e.g. State Bank of India" className="w-full h-11 px-3 border border-[#F0EDE8] rounded-xl text-sm outline-none focus:border-[#FF7A00]" />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">Account Number *</label>
                          <input required type="password" value={form.bankAccountNumber} onChange={e=>updateForm('bankAccountNumber', e.target.value)} className="w-full h-11 px-3 border border-[#F0EDE8] rounded-xl text-sm outline-none focus:border-[#FF7A00]" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">IFSC Code *</label>
                          <input required value={form.ifscCode} onChange={e=>updateForm('ifscCode', e.target.value.toUpperCase())} className="w-full h-11 px-3 border border-[#F0EDE8] rounded-xl text-sm outline-none focus:border-[#FF7A00] font-mono" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5 mt-2">Account Type *</label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input type="radio" name="accType" checked={form.accountType==='savings'} onChange={()=>updateForm('accountType', 'savings')} className="accent-[#FF7A00]" /> Savings
                          </label>
                          <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input type="radio" name="accType" checked={form.accountType==='current'} onChange={()=>updateForm('accountType', 'current')} className="accent-[#FF7A00]" /> Current
                          </label>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-[#F0EDE8]">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" required className="mt-1 accent-[#FF7A00]" />
                          <span className="text-xs text-[#4A4540]">I confirm that the information provided is accurate and I agree to Bharat Bazaar's Seller Terms & Conditions.</span>
                        </label>
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="mt-auto pt-6 border-t border-[#F0EDE8] flex items-center justify-between">
                {step > 1 ? (
                  <button type="button" onClick={prevStep} className="px-4 py-2 border border-[#F0EDE8] text-[#4A4540] text-sm font-bold rounded-xl hover:bg-[#FAFAF8] transition-colors">
                    Back
                  </button>
                ) : <div/>}
                
                <button type="submit" disabled={loading} className="px-6 py-2 bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-sm font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0">
                  {loading ? 'Submitting...' : step === 4 ? 'Submit Application' : 'Continue'} <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
