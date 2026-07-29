'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Check, ArrowRight, ArrowLeft, Upload, Store, Package, Truck, Star, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store/auth-store';
import { RedirectIfAuthed } from '@/components/auth/redirect-if-authed';

const STEPS = [
  { id: 1, title: 'Basic Info', icon: '👤' },
  { id: 2, title: 'Shop Setup', icon: '🏪' },
  { id: 3, title: 'Products', icon: '📦' },
  { id: 4, title: 'Bank & KYC', icon: '🏦' },
  { id: 5, title: 'All Done!', icon: '🎉' },
];

const CATEGORIES = [
  'Handloom & Textiles',
  'Pottery & Ceramics',
  'Jewelry & Accessories',
  'Organic Foods & Spices',
  'Home Decor',
  'Art & Paintings',
  'Leather Crafts',
  'Bamboo & Cane',
  'Natural Beauty',
  'Others',
];

// Step Validation Schemas
const step1Schema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  state: z.string().min(1, 'Please select your state'),
  city: z.string().min(1, 'Please enter your city/village'),
  experience: z.string().min(1, 'Please select your experience level'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const step2Schema = z.object({
  shopName: z.string().min(2, 'Shop Name must be at least 2 characters'),
  shopDescription: z.string().max(300, 'Description must not exceed 300 characters').optional(),
  category: z.string().min(1, 'Please select a category'),
});

const step3Schema = z.object({
  productTypes: z.string().min(1, 'Please detail the type of products you sell'),
  monthlySales: z.string().min(1, 'Please select expected monthly sales'),
});

const step4Schema = z.object({
  accountName: z.string().min(2, 'Account Holder Name is required'),
  bank: z.string().min(2, 'Bank Name is required'),
  accountNumber: z.string().min(9, 'Enter a valid account number'),
  ifsc: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Enter a valid IFSC code (e.g. SBIN0001234)'),
  aadhar: z.string().regex(/^\d{12}$/, 'Enter a valid 12-digit Aadhaar number'),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Enter a valid PAN format (e.g. ABCDE1234F)').optional().or(z.literal('')),
});

const finalSchema = step1Schema.merge(step2Schema).merge(step3Schema).merge(step4Schema);
type FormValues = z.infer<typeof finalSchema>;

export default function SellerRegisterPage() {
  const router = useRouter();
  const { signUp } = useAuthStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(
      (step === 1 ? step1Schema :
       step === 2 ? step2Schema :
       step === 3 ? step3Schema :
       step4Schema) as any
    ),
    mode: 'onBlur',
    defaultValues: {
      fullName: '', phone: '', email: '', state: '', city: '', experience: '', password: '',
      shopName: '', shopDescription: '', category: '',
      productTypes: '', monthlySales: '',
      accountName: '', bank: '', accountNumber: '', ifsc: '', aadhar: '', pan: '',
    },
  });

  const handleNext = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) {
      fieldsToValidate = ['fullName', 'phone', 'email', 'state', 'city', 'experience', 'password'];
    } else if (step === 2) {
      fieldsToValidate = ['shopName', 'shopDescription', 'category'];
    } else if (step === 3) {
      fieldsToValidate = ['productTypes', 'monthlySales'];
    } else if (step === 4) {
      fieldsToValidate = ['accountName', 'bank', 'accountNumber', 'ifsc', 'aadhar', 'pan'];
    }

    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) {
      if (step < 4) {
        setStep(s => s + 1);
      } else {
        await onFinalSubmit();
      }
    }
  };

  const onFinalSubmit = async () => {
    setLoading(true);
    const data = getValues();
    
    // Create new seller account
    const result = await signUp({
      fullName: data.fullName,
      email: data.email,
      phone: `+91 ${data.phone}`,
      password: data.password,
      role: 'seller',
    });

    if (result.success) {
      // Store additional shop details inside local storage under their shop name / id
      const sellerDetails = {
        sellerId: result.error || `seller-${Date.now()}`,
        shopName: data.shopName,
        category: data.category,
        experience: data.experience,
        city: data.city,
        state: data.state,
      };
      localStorage.setItem(`bb-seller-shop-${data.email}`, JSON.stringify(sellerDetails));
      
      toast.success('Seller application submitted successfully! 🎉');
      setStep(5);
    } else {
      toast.error(result.error || 'Registration failed. Email might already exist.');
    }
    setLoading(false);
  };

  const isLast = step === STEPS.length;
  const progressPercent = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <RedirectIfAuthed>
      <div className="min-h-screen bg-[#FAFAF8] pt-20 pb-20 lg:pb-8">
        {/* Header */}
        <div className="border-b border-[#E5E4DE] bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4 bg-[#FFF8F0] text-[#FF7A00]">
                  🌟 FREE to sell • No listing fees
                </div>
                <h1 className="text-[#1A1A1A] mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800 }}>
                  Start Selling on Bharat Bazaar
                </h1>
                <p className="text-[#8C8B80] text-sm mb-6">Join 50,000+ artisans and village sellers reaching customers across India</p>
                <div className="flex flex-wrap gap-4">
                  {[
                    { icon: Store, text: 'Free storefront' },
                    { icon: Package, text: 'Easy listings' },
                    { icon: Truck, text: 'Pickup service' },
                    { icon: Star, text: 'Support 24/7' },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2 text-xs font-semibold text-[#555449]">
                      <Icon size={14} className="text-emerald-500" />
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
                  <div key={s.label} className="bg-[#FAFAF8] rounded-2xl p-4 text-center border border-[#E5E4DE]">
                    <div className="text-2xl font-black mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif', color: '#FF7A00" }}>{s.label}</div>
                    <div className="text-xs text-[#8C8B80]">{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          {/* Progress Bar & Steps */}
          {!isLast && (
            <div className="mb-10 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-[#8C8B80]">
                <span>Progress: {Math.round(progressPercent)}%</span>
                <span>Step {step} of 4</span>
              </div>
              <div className="h-2 w-full bg-[#E5E4DE] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#FF7A00] to-[#FF4500] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between items-center pt-2">
                {STEPS.slice(0, -1).map((s) => (
                  <div key={s.id} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step > s.id ? 'bg-emerald-500 text-white' :
                      step === s.id ? 'bg-[#FF7A00] text-white ring-4 ring-[#FFF8F0]' : 'bg-[#E5E4DE]/60 text-[#8C8B80]'
                    }`}>
                      {step > s.id ? <Check size={14} /> : s.icon}
                    </div>
                    <span className={`text-[10px] mt-1 font-semibold ${step === s.id ? 'text-[#FF7A00]' : 'text-[#8C8B80]'}`}>
                      {s.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form Content */}
          <div className="bg-white rounded-3xl border border-[#E5E4DE] shadow-sm overflow-hidden">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1" 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }} 
                  className="p-8 space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-bold text-[#1A1A1A] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Basic Information</h2>
                    <p className="text-xs text-[#8C8B80]">Tell us about yourself and your experience</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5 uppercase">Full Name*</label>
                      <input 
                        {...register('fullName')}
                        className={`w-full h-11 px-4 rounded-xl border outline-none text-sm focus:shadow-md ${errors.fullName ? 'border-red-500' : 'border-[#E5E4DE] focus:border-[#FF7A00]'}`}
                        placeholder="Meena Devi" 
                      />
                      {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5 uppercase">Mobile Number*</label>
                      <input 
                        type="tel"
                        {...register('phone')}
                        className={`w-full h-11 px-4 rounded-xl border outline-none text-sm focus:shadow-md ${errors.phone ? 'border-red-500' : 'border-[#E5E4DE] focus:border-[#FF7A00]'}`}
                        placeholder="9876543210" 
                      />
                      {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5 uppercase">Email Address*</label>
                      <input 
                        type="email"
                        {...register('email')}
                        className={`w-full h-11 px-4 rounded-xl border outline-none text-sm focus:shadow-md ${errors.email ? 'border-red-500' : 'border-[#E5E4DE] focus:border-[#FF7A00]'}`}
                        placeholder="meena@example.com" 
                      />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5 uppercase">Password*</label>
                      <input 
                        type="password"
                        {...register('password')}
                        className={`w-full h-11 px-4 rounded-xl border outline-none text-sm focus:shadow-md ${errors.password ? 'border-red-500' : 'border-[#E5E4DE] focus:border-[#FF7A00]'}`}
                        placeholder="At least 6 characters" 
                      />
                      {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5 uppercase">State*</label>
                      <select 
                        {...register('state')}
                        className={`w-full h-11 px-4 rounded-xl border bg-white outline-none text-sm ${errors.state ? 'border-red-500' : 'border-[#E5E4DE]'}`}
                      >
                        <option value="">Select State</option>
                        {['Rajasthan', 'Gujarat', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Jammu & Kashmir'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5 uppercase">City / Village*</label>
                      <input 
                        {...register('city')}
                        className={`w-full h-11 px-4 rounded-xl border outline-none text-sm focus:shadow-md ${errors.city ? 'border-red-500' : 'border-[#E5E4DE]'}`}
                        placeholder="Your city name" 
                      />
                      {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5 uppercase">Craft Experience*</label>
                      <select 
                        {...register('experience')}
                        className={`w-full h-11 px-4 rounded-xl border bg-white outline-none text-sm ${errors.experience ? 'border-red-500' : 'border-[#E5E4DE]'}`}
                      >
                        <option value="">Years of experience</option>
                        {['0-1 year', '1-3 years', '3-5 years', '5-10 years', '10+ years'].map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                      {errors.experience && <p className="text-xs text-red-500 mt-1">{errors.experience.message}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2" 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }} 
                  className="p-8 space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-bold text-[#1A1A1A] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Set up your shop</h2>
                    <p className="text-xs text-[#8C8B80]">Details for your public storefront</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5 uppercase">Shop Name*</label>
                      <input 
                        {...register('shopName')}
                        className={`w-full h-11 px-4 rounded-xl border outline-none text-sm focus:shadow-md ${errors.shopName ? 'border-red-500' : 'border-[#E5E4DE] focus:border-[#FF7A00]'}`}
                        placeholder="e.g. Meena's Jaipur Crafts" 
                      />
                      {errors.shopName && <p className="text-xs text-red-500 mt-1">{errors.shopName.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5 uppercase">Shop Description</label>
                      <textarea 
                        rows={3} 
                        {...register('shopDescription')}
                        className="w-full px-4 py-3 rounded-xl border border-[#E5E4DE] focus:border-[#FF7A00] outline-none text-sm resize-none" 
                        placeholder="Tell customers about your craft, your story..." 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-2 uppercase">Primary Category*</label>
                      <div className="grid grid-cols-2 gap-2">
                        {CATEGORIES.map((cat) => (
                          <button 
                            type="button" 
                            key={cat} 
                            onClick={() => setValue('category', cat, { shouldValidate: true })} 
                            className={`px-3 py-2.5 rounded-xl text-xs font-medium border text-left transition-all ${
                              getValues('category') === cat 
                                ? 'border-[#FF7A00] text-[#FF7A00] bg-[#FFF8F0] font-bold' 
                                : 'border-[#E5E4DE] text-[#555449] hover:border-[#FF7A00]/50'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                      {errors.category && <p className="text-xs text-red-500 mt-2">{errors.category.message}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3" 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }} 
                  className="p-8 space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-bold text-[#1A1A1A] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Your Products</h2>
                    <p className="text-xs text-[#8C8B80]">Typical product volume and sales range</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5 uppercase">Types of Products*</label>
                      <textarea 
                        rows={3} 
                        {...register('productTypes')}
                        className={`w-full px-4 py-3 rounded-xl border outline-none text-sm resize-none focus:shadow-md ${errors.productTypes ? 'border-red-500' : 'border-[#E5E4DE]'}`} 
                        placeholder="e.g. Block printed sarees, hand-dyed dupattas..." 
                      />
                      {errors.productTypes && <p className="text-xs text-red-500 mt-1">{errors.productTypes.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-2 uppercase">Expected Monthly Sales*</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {['₹0 – ₹10K', '₹10K – ₹50K', '₹50K – ₹1L', '₹1L – ₹5L', '₹5L+', 'Not Sure'].map(range => (
                          <button 
                            type="button" 
                            key={range} 
                            onClick={() => setValue('monthlySales', range, { shouldValidate: true })} 
                            className={`py-2.5 rounded-xl text-xs font-medium border transition-all ${
                              getValues('monthlySales') === range 
                                ? 'border-[#FF7A00] text-[#FF7A00] bg-[#FFF8F0] font-bold' 
                                : 'border-[#E5E4DE] text-[#555449] hover:border-[#FF7A00]/50'
                            }`}
                          >
                            {range}
                          </button>
                        ))}
                      </div>
                      {errors.monthlySales && <p className="text-xs text-red-500 mt-2">{errors.monthlySales.message}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div 
                  key="step4" 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }} 
                  className="p-8 space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-bold text-[#1A1A1A] mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Bank & KYC Details</h2>
                    <p className="text-xs text-[#8C8B80]">Encrypted, secure verification fields</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5 uppercase">Account Holder Name*</label>
                      <input 
                        {...register('accountName')}
                        className={`w-full h-11 px-4 rounded-xl border outline-none text-sm focus:shadow-md ${errors.accountName ? 'border-red-500' : 'border-[#E5E4DE]'}`} 
                        placeholder="Meena Devi" 
                      />
                      {errors.accountName && <p className="text-xs text-red-500 mt-1">{errors.accountName.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5 uppercase">Bank Name*</label>
                      <input 
                        {...register('bank')}
                        className={`w-full h-11 px-4 rounded-xl border outline-none text-sm focus:shadow-md ${errors.bank ? 'border-red-500' : 'border-[#E5E4DE]'}`} 
                        placeholder="State Bank of India" 
                      />
                      {errors.bank && <p className="text-xs text-red-500 mt-1">{errors.bank.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5 uppercase">Account Number*</label>
                      <input 
                        {...register('accountNumber')}
                        className={`w-full h-11 px-4 rounded-xl border outline-none text-sm focus:shadow-md ${errors.accountNumber ? 'border-red-500' : 'border-[#E5E4DE]'}`} 
                        placeholder="XXXXXXXXXXXXXX" 
                      />
                      {errors.accountNumber && <p className="text-xs text-red-500 mt-1">{errors.accountNumber.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5 uppercase">IFSC Code*</label>
                      <input 
                        {...register('ifsc')}
                        className={`w-full h-11 px-4 rounded-xl border outline-none text-sm focus:shadow-md ${errors.ifsc ? 'border-red-500' : 'border-[#E5E4DE]'}`} 
                        placeholder="SBIN0001234" 
                      />
                      {errors.ifsc && <p className="text-xs text-red-500 mt-1">{errors.ifsc.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5 uppercase">Aadhaar Number*</label>
                      <input 
                        {...register('aadhar')}
                        className={`w-full h-11 px-4 rounded-xl border outline-none text-sm focus:shadow-md ${errors.aadhar ? 'border-red-500' : 'border-[#E5E4DE]'}`} 
                        placeholder="12 digits" 
                      />
                      {errors.aadhar && <p className="text-xs text-red-500 mt-1">{errors.aadhar.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5 uppercase">PAN (Optional)</label>
                      <input 
                        {...register('pan')}
                        className={`w-full h-11 px-4 rounded-xl border outline-none text-sm focus:shadow-md ${errors.pan ? 'border-red-500' : 'border-[#E5E4DE]'}`} 
                        placeholder="ABCDE1234F" 
                      />
                      {errors.pan && <p className="text-xs text-red-500 mt-1">{errors.pan.message}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div 
                  key="step5" 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  className="p-10 text-center space-y-6"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#FF7A00] to-[#FF4500] flex items-center justify-center text-4xl mx-auto shadow-lg shadow-orange-500/20">
                    🎉
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-[#1A1A1A]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Welcome to the Bazaar!
                    </h2>
                    <p className="text-sm text-[#8C8B80]">
                      Your application has been received and you're now logged in.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { icon: '📝', title: 'Submitted', sub: 'Completed' },
                      { icon: '🔍', title: 'Review', sub: 'In Progress' },
                      { icon: '🚀', title: 'Start Selling!', sub: 'Pending' },
                    ].map(item => (
                      <div key={item.title} className="bg-[#FAFAF8] rounded-xl p-3 border border-[#E5E4DE] text-center">
                        <span className="text-xl mb-1 block">{item.icon}</span>
                        <div className="text-xs font-bold text-[#1A1A1A]">{item.title}</div>
                        <div className="text-[10px] text-[#8C8B80]">{item.sub}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 justify-center pt-2">
                    <button
                      onClick={() => {
                        // Complete session and direct to seller dashboard
                        const mockEmail = getValues('email');
                        useAuthStore.getState().signIn(mockEmail, getValues('password'), 'seller');
                        router.replace('/seller-dashboard');
                      }}
                      className="px-6 py-2.5 rounded-xl text-white font-semibold text-xs bg-gradient-to-r from-[#FF7A00] to-[#FF4500] cursor-pointer"
                    >
                      Enter Seller Dashboard
                    </button>
                    <Link 
                      href="/" 
                      className="px-6 py-2.5 rounded-xl font-semibold text-xs border border-[#E5E4DE] text-[#555449] hover:bg-[#FAFAF8]"
                    >
                      Back to Home
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Actions */}
            {!isLast && (
              <div className="px-8 pb-8 flex justify-between gap-4 pt-2 border-t border-[#E5E4DE]/50">
                <button
                  type="button"
                  onClick={() => setStep(s => Math.max(1, s - 1))}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs border border-[#E5E4DE] text-[#555449] hover:bg-[#FAFAF8] cursor-pointer transition-all ${
                    step === 1 ? 'opacity-0 pointer-events-none' : ''
                  }`}
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-[#FF7A00] to-[#FF4500] cursor-pointer shadow-lg shadow-orange-500/10 hover:shadow-orange-500/25 active:scale-98 transition-all"
                >
                  {loading ? (
                    <>
                      <div className="w-3.5 h-3.5 border border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      {step === 4 ? 'Complete Registration' : 'Continue'} <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </RedirectIfAuthed>
  );
}
