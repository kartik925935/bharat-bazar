'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Tag, Mail, Phone, Lock, Store, MapPin, ShieldCheck, Building, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { useSellerStore } from '@/lib/store/seller-store';
import { useAuthStore } from '@/lib/store/auth-store';
import { registerSeller as dbRegisterSeller } from '@/actions/auth/seller-register';
import { registerGoogleSeller } from '@/actions/auth/register-google-seller';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { differenceInYears } from 'date-fns';
import { FormInput } from '@/components/ui/form-input';
import { checkEmailRole } from '@/actions/auth/check-email-role';

// === SCHEMAS ===

const step1PasswordSchema = z.object({
  password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters").max(128, "Password too long").regex(/[A-Z]/, "Must include at least one uppercase letter").regex(/[a-z]/, "Must include at least one lowercase letter").regex(/[0-9]/, "Must include at least one number").regex(/[!@#$%^&*(),.?":{}|<>]/, "Must include at least one special character"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Passwords do not match — please re-enter", path: ["confirmPassword"] });
  }
});

const step1PhoneSchema = z.object({
  phone: z.string().min(1, "Mobile number is required").regex(/^[6-9]\d{9}$/, "Enter valid 10-digit Indian mobile number (starts with 6-9)"),
  alternatePhone: z.string().regex(/^[6-9]\d{9}$/, "Enter valid 10-digit Indian mobile number").optional().or(z.literal('')),
}).superRefine((data, ctx) => {
  if (data.alternatePhone && data.alternatePhone === data.phone) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Alternate number must be different from primary number", path: ["alternatePhone"] });
  }
});

const step1OtherFields = z.object({
  legalName: z.string().min(1, "Legal name is required").min(2, "Name must be at least 2 characters").max(100, "Legal name cannot exceed 100 characters").regex(/^[a-zA-Z\s'-]+$/, "Legal name can only contain letters, spaces, hyphens and apostrophes").transform(val => val.trim()),
  displayName: z.string().min(1, "Display name is required").min(2, "Display name must be at least 2 characters").max(60, "Display name cannot exceed 60 characters").regex(/^[a-zA-Z0-9\s&'-]+$/, "Display name can contain letters, numbers, spaces, &, hyphens").transform(val => val.trim()),
  email: z.string().min(1, "Email address is required").email("Please enter a valid email address").max(100, "Email is too long").toLowerCase().trim(),
  dateOfBirth: z.string().min(1, "Date of birth is required").refine(val => {
    const age = differenceInYears(new Date(), new Date(val));
    return age >= 18;
  }, "Seller must be at least 18 years old").refine(val => {
    const age = differenceInYears(new Date(), new Date(val));
    return age <= 100;
  }, "Please enter a valid date of birth"),
  sellerType: z.enum(['artisan', 'ngo', 'village_producer', 'shop_owner', 'shg', 'family_craft', 'professional'], { required_error: "Please select your seller type" }),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
});

const step1Schema = step1PasswordSchema.and(step1PhoneSchema).and(step1OtherFields);

const step2CategorySchema = z.object({
  shopCategory: z.string().min(1, "Please select a shop category"),
  customShopCategory: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.shopCategory === 'Other' && (!data.customShopCategory || data.customShopCategory.trim().length === 0)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please specify your custom category", path: ["customShopCategory"] });
  }
});

const step2OtherFields = z.object({
  shopName: z.string().min(1, "Shop name is required").min(3, "Shop name must be at least 3 characters").max(80, "Shop name cannot exceed 80 characters").regex(/^[a-zA-Z0-9\s&'.-]+$/, "Shop name can contain letters, numbers, spaces and & . - '").transform(val => val.trim()),
  sellerUsername: z.string().min(1, "Shop username is required").min(3, "Username must be at least 3 characters").max(30, "Username cannot exceed 30 characters").regex(/^[a-z][a-z0-9-]*$/, "Username: lowercase letters, numbers, hyphens only. Must start with a letter"),
  shopSubCategory: z.string().min(1, "Please select a subcategory"),
  shopDescription: z.string().min(1, "Shop description is required").min(100, "Description must be at least 100 characters to help customers").max(1000, "Description cannot exceed 1000 characters").trim(),
  shopTagline: z.string().max(100, "Tagline cannot exceed 100 characters").optional(),
  fullAddress: z.string().min(1, "Full address is required").min(10, "Please enter complete address").max(200, "Address too long").trim(),
  village: z.string().min(1, "Village/Town/Area is required").max(100, "Too long").trim(),
  city: z.string().min(1, "City is required").max(100, "City name too long").trim(),
  district: z.string().min(1, "District is required").max(100, "District name too long").trim(),
  state: z.enum([
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
    'Andaman and Nicobar Islands', 'Dadra and Nagar Haveli', 'Lakshadweep'
  ], { required_error: "Please select your state" }),
  pincode: z.string().min(1, "PIN code is required").regex(/^[1-9][0-9]{5}$/, "Enter valid 6-digit PIN code (cannot start with 0)"),
  shopPhone: z.string().min(1, "Shop contact number is required").regex(/^[6-9]\d{9}$/, "Enter valid 10-digit Indian mobile number"),
  shopEmail: z.string().email("Enter valid shop email address").optional().or(z.literal('')),
  website: z.string().url("Enter valid website URL (include https://)").optional().or(z.literal('')),
  operatingHours: z.string().optional(),
  yearEstablished: z.coerce.number().min(1900, "Enter valid year").max(new Date().getFullYear(), "Year cannot be in the future").optional(),
});

const step2Schema = step2CategorySchema.and(step2OtherFields);

// Mocking File for SSR / simplified validation
const fileSchema = z.any(); 

const step3AadhaarSchema = z.object({
  aadhaarNumber: z.string().min(1, "Aadhaar number is required").regex(/^\d{12}$/, "Aadhaar must be exactly 12 digits").refine(val => !['000000000000', '111111111111', '999999999999'].includes(val), "Invalid Aadhaar number"),
  confirmAadhaarNumber: z.string().min(1, "Please confirm Aadhaar number").regex(/^\d{12}$/, "Aadhaar must be exactly 12 digits"),
}).superRefine((data, ctx) => {
  if (data.aadhaarNumber !== data.confirmAadhaarNumber) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Aadhaar numbers do not match", path: ["confirmAadhaarNumber"] });
  }
});

const step3OtherFields = z.object({
  panNumber: z
    .string()
    .min(1, "PAN number is required")
    .transform(v => v.trim().toUpperCase())
    .pipe(
      z.string()
        .length(10, "PAN must be exactly 10 characters")
        .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN format — must be 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F)")
    ),
  gstNumber: z
    .string()
    .transform(v => v.trim().toUpperCase())
    .pipe(
      z.string()
        .refine(v => v === '' || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z][Z][0-9A-Z]$/.test(v), {
          message: "Invalid GSTIN — must be 15 characters (e.g. 22ABCDE1234F1Z5)"
        })
    )
    .optional()
    .or(z.literal('')),
  aadhaarFront: fileSchema.optional(),
  aadhaarBack: fileSchema.optional(),
  panDocument: fileSchema.optional(),
  gstDocument: fileSchema.optional(),
  selfie: fileSchema.optional(),
});

const step3Schema = step3AadhaarSchema.and(step3OtherFields);

const step4AccountSchema = z.object({
  bankAccountNumber: z.string().min(1, "Account number is required").regex(/^\d{9,18}$/, "Account number must be 9-18 digits (numbers only)"),
  confirmBankAccountNumber: z.string().min(1, "Please confirm your account number").regex(/^\d{9,18}$/, "Account number must be 9-18 digits (numbers only)"),
}).superRefine((data, ctx) => {
  if (data.bankAccountNumber !== data.confirmBankAccountNumber) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Account numbers do not match — please re-enter", path: ["confirmBankAccountNumber"] });
  }
});

const step4OtherFields = z.object({
  bankAccountName: z.string().min(1, "Account holder name is required").min(3, "Name must be at least 3 characters").max(100, "Name too long").regex(/^[a-zA-Z\s.]+$/, "Name can only contain letters, spaces and dots").transform(val => val.trim().toUpperCase()),
  bankName: z.string().min(1, "Please select your bank"),
  bankBranch: z.string().min(1, "Branch name is required").max(100, "Branch name too long").trim(),
  ifscCode: z.string().min(1, "IFSC code is required").regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC format. Example: SBIN0001234").toUpperCase(),
  accountType: z.enum(['savings', 'current'], { required_error: "Please select account type" }),
  cancelledCheque: fileSchema.optional(),
  upiId: z.string().regex(/^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/, "Invalid UPI ID format. Example: seller@upi or 9876543210@paytm").optional().or(z.literal('')),
});

const step4Schema = step4AccountSchema.and(step4OtherFields);

const step5Schema = z.object({
  termsAccepted: z.boolean().refine(val => val === true, "You must read and accept the Terms & Conditions"),
  platformPolicyAccepted: z.boolean().refine(val => val === true, "You must accept the Seller Platform Policy"),
  dataConsentAccepted: z.boolean().refine(val => val === true, "You must provide consent for KYC document processing"),
  commissionAcknowledged: z.boolean().refine(val => val === true, "You must acknowledge the platform commission structure"),
  declaration: z.boolean().refine(val => val === true, "You must declare that all submitted information is accurate and truthful"),
});

const sellerRegisterSchema = step1Schema
  .and(step2Schema)
  .and(step3Schema)
  .and(step4Schema)
  .and(step5Schema);

type SellerRegisterFormValues = z.infer<typeof sellerRegisterSchema>;

const STEP_FIELDS: Record<number, any[]> = {
  1: ['legalName', 'displayName', 'email', 'phone', 'alternatePhone', 'password', 'confirmPassword', 'dateOfBirth', 'sellerType', 'gender'],
  2: ['shopName', 'sellerUsername', 'shopCategory', 'shopSubCategory', 'shopDescription', 'shopTagline', 'state', 'district', 'city', 'village', 'pincode', 'fullAddress', 'shopPhone', 'shopEmail', 'website', 'operatingHours', 'yearEstablished'],
  3: ['panNumber', 'aadhaarNumber', 'confirmAadhaarNumber', 'gstNumber', 'aadhaarFront', 'aadhaarBack', 'panDocument', 'gstDocument', 'selfie'],
  4: ['bankAccountName', 'bankName', 'bankBranch', 'bankAccountNumber', 'confirmBankAccountNumber', 'ifscCode', 'accountType', 'cancelledCheque', 'upiId'],
  5: ['termsAccepted', 'platformPolicyAccepted', 'dataConsentAccepted', 'commissionAcknowledged', 'declaration'],
};

export default function SellerRegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [emailRoleError, setEmailRoleError] = useState<string | null>(null);
  const [emailChecking, setEmailChecking] = useState(false);
  const { register: registerSeller, loginWithGoogle } = useSellerStore();
  const { signInWithGoogle, isAuthenticated: isUserAuthed, user: authUser } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryEmail = searchParams.get('email');
  const queryName = searchParams.get('name');
  const isGoogleSignup = !!queryEmail;

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SellerRegisterFormValues>({
    resolver: zodResolver(sellerRegisterSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      sellerType: 'artisan',
      state: 'Maharashtra',
      accountType: 'savings',
      termsAccepted: false,
      platformPolicyAccepted: false,
      dataConsentAccepted: false,
      commissionAcknowledged: false,
      declaration: false,
    }
  });

  // Auto-uppercase + strip whitespace on change for PAN / GST fields
  const makeUppercaseRegister = (fieldName: any) => {
    const r = register(fieldName);
    return {
      ...r,
      onChange: async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.target.value = e.target.value.toUpperCase().replace(/\s/g, '');
        await r.onChange(e);
      },
    };
  };

  useEffect(() => {
    if (queryEmail) {
      setValue('email', queryEmail, { shouldValidate: true });
    }
    if (queryName) {
      setValue('legalName', queryName, { shouldValidate: true });
    }
    if (isGoogleSignup) {
      setValue('password', 'GoogleOAuthTemp123!', { shouldValidate: true });
      setValue('confirmPassword', 'GoogleOAuthTemp123!', { shouldValidate: true });
    }
  }, [queryEmail, queryName, isGoogleSignup, setValue]);

  const handleNextStep = async () => {
    // Block progression if email is flagged as customer
    if (step === 1 && emailRoleError) {
      toast.error('Please use a different email address.');
      return;
    }
    const currentStepFields = STEP_FIELDS[step];
    const isStepValid = await trigger(currentStepFields);

    if (!isStepValid) {
      toast.error("Please complete all required fields correctly");
      return;
    }
    
    setStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onFormSubmit = async (values: SellerRegisterFormValues) => {
    if (step < 5) {
      handleNextStep();
      return;
    }
    
    setLoading(true);
    let res;
    if (isGoogleSignup && authUser?.id) {
      res = await registerGoogleSeller({
        userId: authUser.id,
        fullName: values.legalName,
        phone: values.phone,
        sellerType: values.sellerType,
        shopName: values.shopName,
        shopDescription: values.shopDescription,
        shopCategory: values.shopCategory,
        pincode: values.pincode,
        district: values.district,
        state: values.state,
        fullAddress: values.fullAddress,
        panNumber: values.panNumber,
        aadhaarNumber: values.aadhaarNumber,
        bankAccountName: values.bankAccountName,
        bankName: values.bankName,
        bankAccountNumber: values.bankAccountNumber,
        ifscCode: values.ifscCode,
        accountType: values.accountType,
        village: values.village,
        gstNumber: values.gstNumber || null,
      });
    } else {
      res = await dbRegisterSeller({
        fullName: values.legalName,
        email: values.email,
        phone: values.phone,
        password: values.password,
        shopName: values.shopName,
        shopDescription: values.shopDescription,
        category: values.shopCategory === 'Other' && values.customShopCategory ? values.customShopCategory : values.shopCategory,
        city: values.city,
        state: values.state,
        accountName: values.bankAccountName,
        bank: values.bankName,
        accountNumber: values.bankAccountNumber,
        ifsc: values.ifscCode,
        aadhar: values.aadhaarNumber,
        pan: values.panNumber,
      });
    }

    if (res.success) {
      // Keep mock DB/state in sync
      await registerSeller({
        legalName: values.legalName,
        displayName: values.displayName,
        email: values.email,
        phone: values.phone,
        password: values.password,
        sellerType: values.sellerType,
        shopName: values.shopName,
        shopDescription: values.shopDescription,
        shopCategory: values.shopCategory === 'Other' && values.customShopCategory ? values.customShopCategory : values.shopCategory,
        pincode: values.pincode,
        district: values.district,
        state: values.state,
        fullAddress: values.fullAddress,
        panNumber: values.panNumber,
        aadhaarNumber: values.aadhaarNumber,
        bankAccountName: values.bankAccountName,
        bankName: values.bankName,
        bankAccountNumber: values.bankAccountNumber,
        ifscCode: values.ifscCode,
        accountType: values.accountType,
        avatar: null, shopLogo: null, shopBanner: null, subCategories: [], village: values.village, gstNumber: values.gstNumber || null,
        shippingAreas: ['All India'], processingDays: 2,
        status: 'approved', vacationMode: false, vacationMessage: null,
      });
      setLoading(false);
      setStep(6); // Success step
    } else {
      setLoading(false);
      toast.error(res.error || 'Registration failed');
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    const res = await signInWithGoogle('/seller-dashboard', 'seller');
    if (res.success) {
      toast.success('Google account linked successfully!');
      router.push('/seller-dashboard');
    } else {
      toast.error(res.error || 'Google Sign Up failed');
      setLoading(false);
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
              {step === 5 && 'Review & Submit'}
              {step === 6 && 'Welcome to Bharat Bazaar!'}
            </h2>
            <p className="text-white/70 text-sm mb-12">
              {step === 1 && 'Basic information to create your seller account.'}
              {step === 2 && 'How customers will see your brand on the platform.'}
              {step === 3 && 'To ensure platform safety and compliance.'}
              {step === 4 && 'So we can transfer your earnings securely.'}
              {step === 5 && 'Please accept our terms to complete registration.'}
              {step === 6 && 'Your application has been received.'}
            </p>

            {step < 6 && (
              <div className="mt-auto space-y-6">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={`flex-1 h-1.5 rounded-full ${i <= step ? 'bg-[#FF7A00]' : 'bg-white/20'}`} />
                  ))}
                </div>
                <p className="text-xs font-bold text-[#FF7A00] uppercase tracking-wide">Step {step} of 5</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="w-full md:w-3/5 p-6 sm:p-10 flex flex-col overflow-y-auto max-h-[85vh]">
          {step === 6 ? (
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
            <form onSubmit={handleSubmit(onFormSubmit)} className="flex-1 flex flex-col">
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
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-black text-[#1A1A1A]">Personal Information</h3>
                      </div>

                      {/* Google Authentication */}
                      <button 
                        type="button"
                        onClick={handleGoogleSignUp}
                        disabled={loading}
                        className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border border-[#E5E4DE] font-semibold text-[#1A1A1A] hover:bg-[#FAFAF8] active:scale-98 transition-all cursor-pointer disabled:opacity-50 mb-4"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Sign up with Google
                      </button>

                      <div className="flex items-center gap-3 my-4">
                        <div className="flex-1 h-[1px] bg-[#E5E4DE]" />
                        <span className="text-xs font-semibold text-[#8C8B80]">OR REGISTER WITH EMAIL</span>
                        <div className="flex-1 h-[1px] bg-[#E5E4DE]" />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormInput label="Full Legal Name" required register={register('legalName')} error={errors.legalName} isValid={!errors.legalName && !!watch('legalName')} />
                        <FormInput label="Display Name" required register={register('displayName')} error={errors.displayName} isValid={!errors.displayName && !!watch('displayName')} />
                      </div>
                      <FormInput
                        label="Email Address"
                        type="email"
                        required
                        register={{
                          ...register('email'),
                          onBlur: async (e: React.FocusEvent<HTMLInputElement>) => {
                            register('email').onBlur(e);
                            const email = e.target.value.trim();
                            if (!email || !email.includes('@')) return;
                            setEmailChecking(true);
                            setEmailRoleError(null);
                            try {
                              const result = await checkEmailRole(email);
                              if (result.exists && result.role && result.role !== 'seller') {
                                setEmailRoleError(
                                  `This email is already registered as a customer account. Please use a different email or sign in as a customer.`
                                );
                              }
                            } catch { /* fail silently */ }
                            finally { setEmailChecking(false); }
                          },
                          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                            setEmailRoleError(null);
                            return register('email').onChange(e);
                          },
                        }}
                        error={emailRoleError ? { message: emailRoleError } : errors.email}
                        isValid={!errors.email && !emailRoleError && !!watch('email')}
                        leftIcon={emailChecking ? <span className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin inline-block" /> : <Mail size={16} />}
                      />
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormInput label="Mobile Number" type="tel" required register={register('phone')} error={errors.phone} isValid={!errors.phone && !!watch('phone')} />
                        <FormInput label="Alternate Phone" type="tel" register={register('alternatePhone')} error={errors.alternatePhone} isValid={!errors.alternatePhone && !!watch('alternatePhone')} />
                      </div>
                      {!isGoogleSignup && (
                        <div className="grid sm:grid-cols-2 gap-4">
                          <FormInput label="Password" type="password" required register={register('password')} error={errors.password} isValid={!errors.password && !!watch('password')} />
                          <FormInput label="Confirm Password" type="password" required register={register('confirmPassword')} error={errors.confirmPassword} isValid={!errors.confirmPassword && !!watch('confirmPassword')} />
                        </div>
                      )}
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormInput label="Date of Birth" type="date" required register={register('dateOfBirth')} error={errors.dateOfBirth} isValid={!errors.dateOfBirth && !!watch('dateOfBirth')} />
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
                              onClick={() => setValue('sellerType', t.id as any, { shouldValidate: true })}
                              className={`cursor-pointer border p-3 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition-all ${watch('sellerType') === t.id ? 'border-[#FF7A00] bg-[#FFF7ED] text-[#FF7A00]' : 'border-[#F0EDE8] text-[#9B8F84] hover:bg-[#FAFAF8]'}`}
                            >
                              {t.icon}
                              <span className="text-xs font-bold">{t.label}</span>
                            </div>
                          ))}
                        </div>
                        {errors.sellerType && <p className="text-xs text-red-500 mt-1">{errors.sellerType.message}</p>}
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Shop Setup */}
                  {step === 2 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-black text-[#1A1A1A] mb-6">Shop Setup</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormInput label="Shop Name" required register={register('shopName')} error={errors.shopName} isValid={!errors.shopName && !!watch('shopName')} />
                        <FormInput label="Seller Username" required prefix="@" register={register('sellerUsername')} error={errors.sellerUsername} isValid={!errors.sellerUsername && !!watch('sellerUsername')} />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-[#1C1B14] mb-1.5">Shop Category <span className="text-red-500">*</span></label>
                          <select {...register('shopCategory')} className={`w-full h-12 px-3 border rounded-xl text-base outline-none bg-white ${errors.shopCategory ? 'border-red-500' : 'border-[#F0EDE8] focus:border-[#FF7A00]'}`}>
                            <option value="">Select category...</option>
                            <option value="Handlooms & Textiles">Handlooms & Textiles</option>
                            <option value="Jewelry & Accessories">Jewelry & Accessories</option>
                            <option value="Home Décor">Home Décor</option>
                            <option value="Art & Paintings">Art & Paintings</option>
                            <option value="Pottery & Ceramics">Pottery & Ceramics</option>
                            <option value="Woodcraft">Woodcraft</option>
                            <option value="Metalcraft">Metalcraft</option>
                            <option value="Embroidery & Needlework">Embroidery & Needlework</option>
                            <option value="Block Printing">Block Printing</option>
                            <option value="Natural & Organic">Natural & Organic</option>
                            <option value="Bamboo Products">Bamboo Products</option>
                            <option value="Leather Goods">Leather Goods</option>
                            <option value="Other">Other</option>
                          </select>
                          {errors.shopCategory && <p className="text-xs text-red-500 mt-1">{errors.shopCategory.message}</p>}
                          {watch('shopCategory') === 'Other' && (
                            <div className="mt-3">
                              <input 
                                type="text"
                                placeholder="Please specify your category"
                                {...register('customShopCategory')}
                                className={`w-full h-12 px-3 border rounded-xl text-base outline-none bg-white ${errors.customShopCategory ? 'border-red-500' : 'border-[#F0EDE8] focus:border-[#FF7A00]'}`}
                              />
                              {errors.customShopCategory && <p className="text-xs text-red-500 mt-1">{errors.customShopCategory.message}</p>}
                            </div>
                          )}
                        </div>
                        <FormInput label="Subcategory" required register={register('shopSubCategory')} error={errors.shopSubCategory} isValid={!errors.shopSubCategory && !!watch('shopSubCategory')} />
                      </div>
                      
                      <FormInput label="Shop Tagline" register={register('shopTagline')} error={errors.shopTagline} isValid={!errors.shopTagline && !!watch('shopTagline')} />

                      <div>
                        <label className="block text-sm font-bold text-[#1C1B14] mb-1.5">Shop Description <span className="text-red-500">*</span></label>
                        <textarea {...register('shopDescription')} rows={3} className={`w-full px-3 py-2 border rounded-xl text-base outline-none resize-none ${errors.shopDescription ? 'border-red-500' : 'border-[#F0EDE8] focus:border-[#FF7A00]'}`} placeholder="Tell customers about your craft..." />
                        {errors.shopDescription && <p className="text-xs text-red-500 mt-1">{errors.shopDescription.message}</p>}
                      </div>
                      
                      <FormInput label="Full Address" required register={register('fullAddress')} error={errors.fullAddress} isValid={!errors.fullAddress && !!watch('fullAddress')} />

                      <div className="grid sm:grid-cols-2 gap-4 mt-2">
                        <FormInput label="Village/Area" required register={register('village')} error={errors.village} isValid={!errors.village && !!watch('village')} />
                        <FormInput label="City" required register={register('city')} error={errors.city} isValid={!errors.city && !!watch('city')} />
                      </div>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <FormInput label="District" required register={register('district')} error={errors.district} isValid={!errors.district && !!watch('district')} />
                        <div>
                          <label className="block text-sm font-bold text-[#1C1B14] mb-1.5">State <span className="text-red-500">*</span></label>
                          <select {...register('state')} className={`w-full h-12 px-3 border rounded-xl text-base outline-none bg-white ${errors.state ? 'border-red-500' : 'border-[#F0EDE8] focus:border-[#FF7A00]'}`}>
                            <option value="Andhra Pradesh">Andhra Pradesh</option>
                            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                            <option value="Assam">Assam</option>
                            <option value="Bihar">Bihar</option>
                            <option value="Chhattisgarh">Chhattisgarh</option>
                            <option value="Goa">Goa</option>
                            <option value="Gujarat">Gujarat</option>
                            <option value="Haryana">Haryana</option>
                            <option value="Himachal Pradesh">Himachal Pradesh</option>
                            <option value="Jharkhand">Jharkhand</option>
                            <option value="Karnataka">Karnataka</option>
                            <option value="Kerala">Kerala</option>
                            <option value="Madhya Pradesh">Madhya Pradesh</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Manipur">Manipur</option>
                            <option value="Meghalaya">Meghalaya</option>
                            <option value="Mizoram">Mizoram</option>
                            <option value="Nagaland">Nagaland</option>
                            <option value="Odisha">Odisha</option>
                            <option value="Punjab">Punjab</option>
                            <option value="Rajasthan">Rajasthan</option>
                            <option value="Sikkim">Sikkim</option>
                            <option value="Tamil Nadu">Tamil Nadu</option>
                            <option value="Telangana">Telangana</option>
                            <option value="Tripura">Tripura</option>
                            <option value="Uttar Pradesh">Uttar Pradesh</option>
                            <option value="Uttarakhand">Uttarakhand</option>
                            <option value="West Bengal">West Bengal</option>
                            <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                            <option value="Chandigarh">Chandigarh</option>
                            <option value="Dadra and Nagar Haveli">Dadra and Nagar Haveli</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                            <option value="Ladakh">Ladakh</option>
                            <option value="Lakshadweep">Lakshadweep</option>
                            <option value="Puducherry">Puducherry</option>
                          </select>
                          {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state.message}</p>}
                        </div>
                        <FormInput label="Pincode" required register={register('pincode')} error={errors.pincode} isValid={!errors.pincode && !!watch('pincode')} />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4 mt-2">
                        <FormInput label="Shop Phone" required register={register('shopPhone')} error={errors.shopPhone} isValid={!errors.shopPhone && !!watch('shopPhone')} />
                        <FormInput label="Shop Email" type="email" register={register('shopEmail')} error={errors.shopEmail} isValid={!errors.shopEmail && !!watch('shopEmail')} />
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

                      <FormInput
                        label="PAN Number"
                        required
                        register={makeUppercaseRegister('panNumber')}
                        error={errors.panNumber}
                        isValid={!errors.panNumber && !!watch('panNumber')}
                        placeholder="ABCDE1234F"
                        maxLength={10}
                        helperText="5 letters · 4 digits · 1 letter (10 chars total)"
                      />
                      <FormInput label="Aadhaar Number" required register={register('aadhaarNumber')} error={errors.aadhaarNumber} isValid={!errors.aadhaarNumber && !!watch('aadhaarNumber')} />
                      <FormInput label="Confirm Aadhaar Number" required register={register('confirmAadhaarNumber')} error={errors.confirmAadhaarNumber} isValid={!errors.confirmAadhaarNumber && !!watch('confirmAadhaarNumber')} />
                      <FormInput
                        label="GST Number (Optional)"
                        register={makeUppercaseRegister('gstNumber')}
                        error={errors.gstNumber}
                        isValid={!errors.gstNumber && !!watch('gstNumber')}
                        placeholder="22ABCDE1234F1Z5"
                        maxLength={15}
                        helperText="2 digits · 5 letters · 4 digits · 4 chars (15 chars total)"
                      />
                    </div>
                  )}

                  {/* STEP 4: Bank */}
                  {step === 4 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-black text-[#1A1A1A] mb-6">Banking Details</h3>
                      
                      <FormInput label="Bank Account Name" required register={register('bankAccountName')} error={errors.bankAccountName} isValid={!errors.bankAccountName && !!watch('bankAccountName')} />
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormInput label="Bank Name" required register={register('bankName')} error={errors.bankName} isValid={!errors.bankName && !!watch('bankName')} />
                        <FormInput label="Branch Name" required register={register('bankBranch')} error={errors.bankBranch} isValid={!errors.bankBranch && !!watch('bankBranch')} />
                      </div>

                      <FormInput label="IFSC Code" required register={register('ifscCode')} error={errors.ifscCode} isValid={!errors.ifscCode && !!watch('ifscCode')} />
                      <FormInput label="Account Number" required register={register('bankAccountNumber')} error={errors.bankAccountNumber} isValid={!errors.bankAccountNumber && !!watch('bankAccountNumber')} />
                      <FormInput label="Confirm Account Number" required register={register('confirmBankAccountNumber')} error={errors.confirmBankAccountNumber} isValid={!errors.confirmBankAccountNumber && !!watch('confirmBankAccountNumber')} />
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-[#1C1B14] mb-1.5">Account Type <span className="text-red-500">*</span></label>
                          <select {...register('accountType')} className={`w-full h-12 px-3 border rounded-xl text-base outline-none bg-white ${errors.accountType ? 'border-red-500' : 'border-[#F0EDE8] focus:border-[#FF7A00]'}`}>
                            <option value="savings">Savings</option>
                            <option value="current">Current</option>
                          </select>
                          {errors.accountType && <p className="text-xs text-red-500 mt-1">{errors.accountType.message}</p>}
                        </div>
                        <FormInput label="UPI ID (Optional)" register={register('upiId')} error={errors.upiId} isValid={!errors.upiId && !!watch('upiId')} />
                      </div>
                    </div>
                  )}

                  {/* STEP 5: Review & Terms */}
                  {step === 5 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-black text-[#1A1A1A] mb-6">Review & Submit</h3>
                      
                      <div className="space-y-3 pt-2">
                        {[
                          { id: 'termsAccepted', label: 'I accept the Terms & Conditions.' },
                          { id: 'platformPolicyAccepted', label: 'I accept the Seller Platform Policy.' },
                          { id: 'dataConsentAccepted', label: 'I provide consent for KYC document processing.' },
                          { id: 'commissionAcknowledged', label: 'I acknowledge the platform commission structure.' },
                          { id: 'declaration', label: 'I declare that all submitted information is accurate and truthful.' },
                        ].map(item => (
                          <div key={item.id} className="flex flex-col">
                            <label className="flex items-start gap-2.5 cursor-pointer select-none">
                              <input 
                                type="checkbox" 
                                {...register(item.id as any)}
                                className="mt-1 rounded border-[#E5E4DE] text-[#FF7A00] focus:ring-[#FF7A00] h-4 w-4"
                              />
                              <span className="text-sm text-[#555449] leading-tight">
                                {item.label}
                              </span>
                            </label>
                            {errors[item.id as keyof SellerRegisterFormValues] && (
                              <p className="text-xs text-red-500 mt-1">{(errors[item.id as keyof SellerRegisterFormValues] as any)?.message}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Footer */}
              <div className="mt-10 pt-6 border-t border-[#F0EDE8] flex items-center justify-between">
                {step > 1 ? (
                  <button type="button" onClick={prevStep} className="px-6 py-2.5 rounded-xl font-bold text-[#1A1A1A] bg-[#F0EDE8] hover:bg-[#E5E4DE] transition-colors">
                    Back
                  </button>
                ) : (
                  <div /> // Spacer
                )}
                
                <button
                  type={step === 5 ? "submit" : "button"}
                  onClick={step < 5 ? handleNextStep : undefined}
                  disabled={loading || isSubmitting}
                  className="px-8 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#FF7A00] to-[#FF4500] hover:-translate-y-0.5 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center gap-2"
                >
                  {loading || isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : step === 5 ? (
                    'Submit Application'
                  ) : (
                    <>Continue <ArrowRight size={16} /></>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
