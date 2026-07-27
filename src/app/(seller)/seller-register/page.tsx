'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft, Upload, Store, Package, Truck, Star } from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Basic Info', icon: '👤' },
  { id: 2, title: 'Shop Setup', icon: '🏪' },
  { id: 3, title: 'Products', icon: '📦' },
  { id: 4, title: 'Bank & KYC', icon: '🏦' },
  { id: 5, title: 'All Done!', icon: '🎉' },
];

const CATEGORIES = [
  'Handloom & Textiles', 'Pottery & Ceramics', 'Jewelry & Accessories',
  'Organic Foods & Spices', 'Home Decor', 'Art & Paintings',
  'Leather Crafts', 'Bamboo & Cane', 'Natural Beauty', 'Others'
];

export default function SellerRegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '', phone: '', email: '', state: '', city: '', experience: '',
    shopName: '', shopDescription: '', category: '', monthlySales: '',
    productTypes: '',
    accountName: '', accountNumber: '', ifsc: '', bank: '',
    aadhar: '', pan: '', gst: '',
  });

  const set = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));
  const isLast = step === STEPS.length;

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-20 pb-20 lg:pb-8">
      {/* Hero Banner */}
      <div className="border-b border-black/5 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4" style={{ background: '#FFF8F0', color: '#FF7A00' }}>
                🌟 FREE to sell • No listing fees
              </div>
              <h1 className="text-[#1C1B14] mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800 }}>
                Start Selling on Bharat Bazaar
              </h1>
              <p className="text-[#555449] text-base mb-6">Join 50,000+ artisans and village sellers reaching customers across India</p>
              <div className="flex flex-wrap gap-4">
                {[
                  { icon: Store, text: 'Free storefront' },
                  { icon: Package, text: 'Easy listings' },
                  { icon: Truck, text: 'Pickup service' },
                  { icon: Star, text: 'Support 24/7' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-sm text-[#555449]">
                    <Icon size={16} style={{ color: '#1A9E4E' }} />
                    {text}
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:grid grid-cols-2 gap-3 shrink-0">
              {[
                { label: '50K+', sub: 'Active Sellers' },
                { label: '₹2.4L', sub: 'Avg Monthly Earning' },
                { label: '500K+', sub: 'Customers' },
                { label: '28', sub: 'States' },
              ].map((s) => (
                <div key={s.label} className="bg-[#FAFAF8] rounded-2xl p-4 text-center border border-black/5">
                  <div className="text-2xl font-black mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#FF7A00' }}>{s.label}</div>
                  <div className="text-xs text-[#8C8B80]">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {/* Step Indicator */}
        {!isLast && (
          <div className="flex items-center mb-10">
            {STEPS.slice(0, -1).map((s, i) => (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={{
                      backgroundColor: step > s.id ? '#1A9E4E' : step === s.id ? '#FF7A00' : '#E5E4DE',
                      scale: step === s.id ? 1.1 : 1,
                    }}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  >
                    {step > s.id ? <Check size={16} /> : s.icon}
                  </motion.div>
                  <div className={`text-xs mt-1 font-medium ${step === s.id ? 'text-[#FF7A00]' : step > s.id ? 'text-[#1A9E4E]' : 'text-[#B0AFA5]'}`}>{s.title}</div>
                </div>
                {i < STEPS.length - 2 && (
                  <div className="flex-1 h-0.5 mx-2 mb-5 rounded-full" style={{ background: step > s.id ? '#1A9E4E' : '#E5E4DE' }} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="p-8">
                <h2 className="text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1.5rem' }}>Tell us about yourself</h2>
                <p className="text-[#8C8B80] text-sm mb-8">Basic information about you as a seller</p>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-[#1C1B14] mb-1.5">Full Name*</label>
                      <input className="w-full h-11 px-4 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" placeholder="Meena Devi" value={formData.fullName} onChange={e => set('fullName', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1C1B14] mb-1.5">Mobile Number*</label>
                      <input className="w-full h-11 px-4 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" placeholder="+91 98765 43210" value={formData.phone} onChange={e => set('phone', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1C1B14] mb-1.5">Email Address</label>
                      <input type="email" className="w-full h-11 px-4 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" placeholder="meena@example.com" value={formData.email} onChange={e => set('email', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1C1B14] mb-1.5">State*</label>
                      <select className="w-full h-11 px-4 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm bg-white" value={formData.state} onChange={e => set('state', e.target.value)}>
                        <option value="">Select State</option>
                        {['Rajasthan', 'Gujarat', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Jammu & Kashmir'].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1C1B14] mb-1.5">City / Village</label>
                      <input className="w-full h-11 px-4 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" placeholder="Your village/city name" value={formData.city} onChange={e => set('city', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1C1B14] mb-1.5">Craft Experience</label>
                      <select className="w-full h-11 px-4 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm bg-white" value={formData.experience} onChange={e => set('experience', e.target.value)}>
                        <option value="">Years of experience</option>
                        {['0-1 year', '1-3 years', '3-5 years', '5-10 years', '10+ years'].map(y => <option key={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="p-8">
                <h2 className="text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1.5rem' }}>Set up your shop</h2>
                <p className="text-[#8C8B80] text-sm mb-8">Your shop is your storefront — make it shine!</p>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-[#1C1B14] mb-1.5">Shop Name*</label>
                    <input className="w-full h-11 px-4 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" placeholder="e.g. Meena's Jaipur Crafts" value={formData.shopName} onChange={e => set('shopName', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1C1B14] mb-1.5">Shop Description</label>
                    <textarea rows={4} className="w-full px-4 py-3 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm resize-none" placeholder="Tell customers about your craft, your story, and what makes your products special..." value={formData.shopDescription} onChange={e => set('shopDescription', e.target.value)} />
                    <div className="text-xs text-[#B0AFA5] mt-1">{formData.shopDescription.length}/300 characters</div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1C1B14] mb-2">Primary Category*</label>
                    <div className="grid grid-cols-2 gap-2">
                      {CATEGORIES.map((cat) => (
                        <button type="button" key={cat} onClick={() => set('category', cat)} className={`px-3 py-2 rounded-xl text-xs font-medium border-2 text-left transition-all ${formData.category === cat ? 'border-[#FF7A00] text-[#FF7A00] bg-[#FFF8F0]' : 'border-[#D4D3CB] text-[#555449] hover:border-[#FF7A00]/50'}`}>
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Shop Logo upload placeholder */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1C1B14] mb-2">Shop Logo</label>
                    <div className="border-2 border-dashed border-[#D4D3CB] rounded-2xl p-8 text-center hover:border-[#FF7A00] cursor-pointer transition-all">
                      <Upload size={32} className="mx-auto mb-2 text-[#B0AFA5]" />
                      <p className="text-sm text-[#8C8B80]">Click to upload your logo</p>
                      <p className="text-xs text-[#B0AFA5]">PNG, JPG up to 2MB</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="p-8">
                <h2 className="text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1.5rem' }}>Your Products</h2>
                <p className="text-[#8C8B80] text-sm mb-8">Tell us what you sell and your typical volume</p>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-[#1C1B14] mb-1.5">Types of Products*</label>
                    <textarea rows={3} className="w-full px-4 py-3 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm resize-none" placeholder="e.g. Block printed sarees, hand-dyed dupattas, embroidered cushion covers..." value={formData.productTypes} onChange={e => set('productTypes', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1C1B14] mb-2">Expected Monthly Sales</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {['₹0 – ₹10K', '₹10K – ₹50K', '₹50K – ₹1L', '₹1L – ₹5L', '₹5L+', 'Not Sure'].map(range => (
                        <button type="button" key={range} onClick={() => set('monthlySales', range)} className={`py-2.5 rounded-xl text-xs font-medium border-2 transition-all ${formData.monthlySales === range ? 'border-[#FF7A00] text-[#FF7A00] bg-[#FFF8F0]' : 'border-[#D4D3CB] text-[#555449] hover:border-[#FF7A00]/50'}`}>
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Sample product photos */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1C1B14] mb-2">Sample Product Photos (Optional)</label>
                    <div className="border-2 border-dashed border-[#D4D3CB] rounded-2xl p-8 text-center hover:border-[#FF7A00] cursor-pointer transition-all">
                      <Upload size={32} className="mx-auto mb-2 text-[#B0AFA5]" />
                      <p className="text-sm text-[#8C8B80]">Upload up to 5 sample photos</p>
                      <p className="text-xs text-[#B0AFA5]">PNG, JPG up to 5MB each</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="p-8">
                <h2 className="text-[#1C1B14] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1.5rem' }}>Bank & KYC Details</h2>
                <p className="text-[#8C8B80] text-sm mb-6">Required for receiving payments. 100% secure 🔒</p>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-[#1C1B14] mb-1.5">Account Holder Name*</label>
                      <input className="w-full h-11 px-4 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" placeholder="Name as on bank account" value={formData.accountName} onChange={e => set('accountName', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1C1B14] mb-1.5">Bank Name*</label>
                      <input className="w-full h-11 px-4 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" placeholder="State Bank of India" value={formData.bank} onChange={e => set('bank', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1C1B14] mb-1.5">Account Number*</label>
                      <input className="w-full h-11 px-4 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" placeholder="XXXXXXXXXXXXXX" value={formData.accountNumber} onChange={e => set('accountNumber', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1C1B14] mb-1.5">IFSC Code*</label>
                      <input className="w-full h-11 px-4 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" placeholder="SBIN0001234" value={formData.ifsc} onChange={e => set('ifsc', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1C1B14] mb-1.5">Aadhaar Number*</label>
                      <input className="w-full h-11 px-4 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" placeholder="XXXX XXXX XXXX" value={formData.aadhar} onChange={e => set('aadhar', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1C1B14] mb-1.5">PAN (Optional)</label>
                      <input className="w-full h-11 px-4 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" placeholder="ABCDE1234F" value={formData.pan} onChange={e => set('pan', e.target.value)} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-[#1C1B14] mb-1.5">GST Number (Optional)</label>
                      <input className="w-full h-11 px-4 rounded-xl border-2 border-[#D4D3CB] focus:border-[#FF7A00] outline-none text-sm" placeholder="27AAPFU0939F1ZV" value={formData.gst} onChange={e => set('gst', e.target.value)} />
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: '#F0FDF4' }}>
                    <span className="text-green-600 mt-0.5">🔒</span>
                    <p className="text-sm text-green-700">Your details are encrypted and used only for payment processing. We follow RBI & SEBI guidelines.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                  className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mx-auto mb-6"
                  style={{ background: 'linear-gradient(135deg, #FF7A00, #FF4500)' }}
                >
                  🎉
                </motion.div>
                <h2 className="text-[#1C1B14] mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '1.75rem' }}>
                  Welcome to Bharat Bazaar!
                </h2>
                <p className="text-[#8C8B80] mb-2">
                  Your application has been submitted successfully.
                </p>
                <p className="text-sm text-[#B0AFA5] mb-8">
                  Our team will verify your details and activate your seller account within 24-48 hours.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {[
                    { icon: '✅', title: 'Application Submitted', sub: 'Just now' },
                    { icon: '🔍', title: 'Verification', sub: '24-48 hours' },
                    { icon: '🚀', title: 'Go Live!', sub: 'Start selling!' },
                  ].map(item => (
                    <div key={item.title} className="bg-[#FAFAF8] rounded-2xl p-4 border border-black/5">
                      <div className="text-3xl mb-2">{item.icon}</div>
                      <div className="text-sm font-semibold text-[#1C1B14]">{item.title}</div>
                      <div className="text-xs text-[#B0AFA5]">{item.sub}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Link href="/seller-dashboard" className="px-8 py-3 rounded-2xl text-white font-semibold text-sm" style={{ background: 'linear-gradient(135deg, #FF7A00, #FF4500)' }}>
                    Go to Seller Dashboard
                  </Link>
                  <Link href="/" className="px-8 py-3 rounded-2xl font-semibold text-sm border border-black/10 text-[#555449] hover:border-[#FF7A00] transition-all">
                    Back to Home
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          {!isLast && (
            <div className="px-8 pb-8 flex justify-between">
              <motion.button
                type="button"
                onClick={() => setStep(s => Math.max(1, s - 1))}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm border border-black/10 text-[#555449] transition-all hover:border-[#FF7A00] ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                whileTap={{ scale: 0.97 }}
              >
                <ArrowLeft size={16} /> Back
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setStep(s => Math.min(STEPS.length, s + 1))}
                className="flex items-center gap-2 px-8 py-3 rounded-2xl font-semibold text-sm text-white"
                style={{ background: 'linear-gradient(135deg, #FF7A00, #FF4500)' }}
                whileTap={{ scale: 0.97 }}
              >
                {step === 4 ? 'Submit Application' : 'Continue'} <ArrowRight size={16} />
              </motion.button>
            </div>
          )}
        </div>

        {/* Already a seller? */}
        {!isLast && (
          <p className="text-center text-sm text-[#8C8B80] mt-6">
            Already a seller?{' '}
            <Link href="/seller-dashboard" className="font-semibold hover:underline" style={{ color: '#FF7A00' }}>
              Go to Dashboard
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
