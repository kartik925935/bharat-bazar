'use client';

import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Plus, Check, Trash2, Edit3, Home, Briefcase, Building,
  X, Loader2, AlertCircle, CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { INITIAL_ADDRESSES } from '@/lib/mock/customer';
import { useAuthStore } from '@/lib/store/auth-store';
import { createClient } from '@/lib/supabase/client';

// ─── Indian States ────────────────────────────────────────────────────────────
const INDIAN_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh',
  'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli',
  'Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh',
  'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal',
] as const;

// ─── Zod Schema ───────────────────────────────────────────────────────────────
const addressSchema = z.object({
  fullName: z
    .string()
    .min(1, "Receiver's full name is required")
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens and apostrophes"),

  phone: z
    .string()
    .min(1, 'Mobile number is required')
    .regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit Indian mobile number (starts with 6–9)'),

  alternatePhone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit Indian mobile number')
    .optional()
    .or(z.literal('')),

  pincode: z
    .string()
    .min(1, 'PIN code is required')
    .regex(/^[1-9][0-9]{5}$/, 'Enter valid 6-digit PIN code (cannot start with 0)'),

  addressLine1: z
    .string()
    .min(1, 'Address is required')
    .min(10, 'Please enter complete address (house/flat no. and street name)')
    .max(100, 'Address line 1 cannot exceed 100 characters'),

  addressLine2: z.string().max(100, 'Address line 2 cannot exceed 100 characters').optional(),

  landmark: z.string().max(100, 'Landmark cannot exceed 100 characters').optional(),

  city: z
    .string()
    .min(1, 'City is required')
    .min(2, 'City name must be at least 2 characters')
    .max(100, 'City name too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'City name can only contain letters and spaces'),

  state: z.enum(INDIAN_STATES, {
    required_error: 'Please select your state',
    invalid_type_error: 'Please select a valid Indian state',
  }),

  addressType: z
    .enum(['home', 'work', 'other'], {
      required_error: 'Please select address type',
    })
    .default('home'),

  customLabel: z.string().max(30, 'Label cannot exceed 30 characters').optional(),

  isDefault: z.boolean().default(false),
})
  .refine(
    (data) => !(data.addressType === 'other' && !data.customLabel?.trim()),
    { message: "Please enter a label for this address (e.g. 'Parents Home')", path: ['customLabel'] }
  )
  .refine(
    (data) => !(data.alternatePhone && data.alternatePhone === data.phone),
    { message: 'Alternate number must differ from primary mobile number', path: ['alternatePhone'] }
  );

type AddressFormData = z.infer<typeof addressSchema>;

// ─── Address type (internal) ─────────────────────────────────────────────────
interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  type: 'home' | 'work' | 'other';
  customLabel?: string;
  isDefault: boolean;
}

// ─── Reusable field components ────────────────────────────────────────────────
function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1.5 text-sm text-red-600 mt-1.5"
      role="alert"
    >
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
      {message}
    </motion.p>
  );
}

function FieldSuccess() {
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1.5 text-sm text-green-600 mt-1.5"
    >
      <CheckCircle2 className="w-3.5 h-3.5" />
      Looks good!
    </motion.p>
  );
}

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-xs font-bold text-[#8C7B6E] uppercase tracking-wider mb-1"
    >
      {children}
    </label>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuthStore();
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;
    const fetchAddresses = async () => {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching addresses:', error.message);
        return;
      }
      
      if (data) {
        const mapped: Address[] = data.map((d: any) => {
          const type = ['home', 'work'].includes(d.label?.toLowerCase()) ? d.label.toLowerCase() : 'other';
          return {
            id: d.id,
            name: d.full_name,
            phone: d.phone,
            line1: d.address_line1,
            line2: d.address_line2 || undefined,
            city: d.city,
            state: d.state,
            pincode: d.pincode,
            type: type,
            customLabel: type === 'other' ? d.label : undefined,
            isDefault: d.is_default,
          };
        });
        setAddresses(mapped);
      }
      setIsLoaded(true);
    };
    
    fetchAddresses();
  }, [user]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pincodeLoading, setPincodeLoading] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema) as any,
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      fullName: '',
      phone: '',
      alternatePhone: '',
      pincode: '',
      addressLine1: '',
      addressLine2: '',
      landmark: '',
      city: '',
      state: undefined,
      addressType: 'home',
      customLabel: '',
      isDefault: false,
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    trigger,
    formState: { errors, touchedFields, isSubmitting, isValid, dirtyFields },
  } = form;

  const watchedPincode = watch('pincode');
  const watchedAddressType = watch('addressType');
  const watchedIsDefault = watch('isDefault');

  // ─── Auto-fetch city/state from pincode ──────────────────────────────────
  const handlePincodeBlur = useCallback(async () => {
    const pin = watchedPincode;
    if (!pin || pin.length !== 6 || !/^[1-9][0-9]{5}$/.test(pin)) return;
    setPincodeLoading(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();
      if (data[0]?.Status === 'Success') {
        const postOffice = data[0].PostOffice[0];
        setValue('city', postOffice.District, { shouldValidate: true, shouldDirty: true });
        const matchedState = INDIAN_STATES.find(
          (s) => s.toLowerCase() === postOffice.State.toLowerCase()
        );
        if (matchedState) {
          setValue('state', matchedState, { shouldValidate: true, shouldDirty: true });
        }
        toast.success(`📍 Location set: ${postOffice.District}, ${postOffice.State}`);
      } else {
        toast.error('PIN code not found — please verify');
      }
    } catch {
      // silently fail; user can fill manually
    } finally {
      setPincodeLoading(false);
    }
  }, [watchedPincode, setValue]);

  // ─── Open modals ───────────────────────────────────────────────────────────
  const openAdd = () => {
    reset({
      fullName: '', phone: '', alternatePhone: '', pincode: '',
      addressLine1: '', addressLine2: '', landmark: '', city: '',
      state: undefined, addressType: 'home', customLabel: '',
      isDefault: addresses.length === 0,
    });
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (addr: Address) => {
    setEditingId(addr.id);
    reset({
      fullName: addr.name,
      phone: addr.phone,
      alternatePhone: '',
      pincode: addr.pincode,
      addressLine1: addr.line1,
      addressLine2: addr.line2 || '',
      landmark: '',
      city: addr.city,
      state: addr.state as (typeof INDIAN_STATES)[number],
      addressType: addr.type,
      customLabel: addr.type === 'other' ? addr.customLabel || '' : '',
      isDefault: addr.isDefault,
    });
    setModalOpen(true);
  };

  // ─── Submit ────────────────────────────────────────────────────────────────
  const onSubmit = async (data: AddressFormData) => {
    if (!user) return;
    const dbLabel = data.addressType === 'other' ? data.customLabel : data.addressType;

    if (editingId) {
      const { error } = await supabase
        .from('addresses')
        .update({
          full_name: data.fullName,
          phone: data.phone,
          address_line1: data.addressLine1,
          address_line2: data.addressLine2 || null,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          label: dbLabel,
          is_default: data.isDefault,
        })
        .eq('id', editingId);

      if (error) {
        toast.error('Failed to update address: ' + error.message);
        return;
      }

      if (data.isDefault) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', user.id)
          .neq('id', editingId);
      }

      setAddresses((prev) =>
        prev.map((a) => {
          if (a.id === editingId) {
            return {
              ...a, name: data.fullName, phone: data.phone,
              line1: data.addressLine1, line2: data.addressLine2,
              city: data.city, state: data.state, pincode: data.pincode,
              type: data.addressType, customLabel: data.addressType === 'other' ? data.customLabel : undefined,
              isDefault: data.isDefault || a.isDefault,
            };
          }
          return data.isDefault ? { ...a, isDefault: false } : a;
        })
      );
      toast.success('Address updated! ✅');
    } else {
      const { data: insertData, error } = await supabase
        .from('addresses')
        .insert({
          user_id: user.id,
          full_name: data.fullName,
          phone: data.phone,
          address_line1: data.addressLine1,
          address_line2: data.addressLine2 || null,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          label: dbLabel,
          is_default: data.isDefault || addresses.length === 0,
        })
        .select()
        .single();

      if (error) {
        toast.error('Failed to save address: ' + error.message);
        return;
      }

      if (insertData) {
        const newAddr: Address = {
          id: insertData.id,
          name: insertData.full_name,
          phone: insertData.phone,
          line1: insertData.address_line1,
          line2: insertData.address_line2 || undefined,
          city: insertData.city,
          state: insertData.state,
          pincode: insertData.pincode,
          type: data.addressType,
          customLabel: data.addressType === 'other' ? data.customLabel : undefined,
          isDefault: insertData.is_default,
        };

        if (insertData.is_default) {
          await supabase
            .from('addresses')
            .update({ is_default: false })
            .eq('user_id', user.id)
            .neq('id', insertData.id);

          setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: false })).concat(newAddr));
        } else {
          setAddresses((prev) => [...prev, newAddr]);
        }
      }
      toast.success('Address added! 🏠');
    }
    setModalOpen(false);
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('addresses')
      .update({ is_default: true })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update default address: ' + error.message);
      return;
    }

    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', user.id)
      .neq('id', id);

    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    toast.success('Default address updated!');
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete address: ' + error.message);
      return;
    }

    setAddresses((prev) => prev.filter((a) => a.id !== id));
    setDeletingId(null);
    toast.success('Address deleted!');
  };

  const isFieldValid = (fieldName: keyof AddressFormData) =>
    touchedFields[fieldName] && !errors[fieldName];

  const inputClass = (fieldName: keyof AddressFormData) =>
    cn(
      'w-full h-12 px-4 rounded-xl border-2 text-base outline-none transition-all duration-200 bg-white',
      'focus:ring-4 focus:ring-[#FF7A00]/20',
      errors[fieldName]
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
        : isFieldValid(fieldName)
        ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
        : 'border-[#E8E4DE] focus:border-[#FF7A00]'
    );

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>
            My Addresses
          </h1>
          <p className="text-sm text-[#8C7B6E] mt-0.5">Manage your delivery addresses</p>
        </div>
        <span className="text-xs font-bold text-[#8C7B6E] bg-[#F5F4F0] px-3 py-1.5 rounded-full">
          {addresses.length}/5 saved
        </span>
      </div>

      {/* Address Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {addresses.map((addr) => {
          const isFlipped = deletingId === addr.id;
          return (
            <motion.div
              key={addr.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative bg-white rounded-2xl border p-5 transition-all ${
                addr.isDefault
                  ? 'border-[#FF7A00] shadow-[0_4px_20px_rgba(255,122,0,0.08)]'
                  : 'border-[#E8E4DE]'
              }`}
            >
              {!isFlipped ? (
                <>
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#F5F4F0]">
                    <div className="flex items-center gap-2">
                      {addr.type === 'home' && <Home size={16} className="text-[#FF7A00]" />}
                      {addr.type === 'work' && <Briefcase size={16} className="text-[#FF7A00]" />}
                      {addr.type === 'other' && <Building size={16} className="text-[#FF7A00]" />}
                      <span className="text-sm font-bold text-[#1A0A00] capitalize">{addr.type}</span>
                    </div>
                    {addr.isDefault ? (
                      <span className="text-[10px] font-bold text-[#16A34A] bg-[#F0FDF4] border border-[#BBF7D0] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Check size={10} /> Default
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetDefault(addr.id)}
                        className="text-xs font-semibold text-[#8C7B6E] hover:text-[#FF7A00] cursor-pointer transition-colors"
                        aria-label="Set as default"
                      >
                        Set Default
                      </button>
                    )}
                  </div>
                  <p className="text-sm font-bold text-[#1A0A00]">{addr.name}</p>
                  <p className="text-xs text-[#4A3728] mt-1 leading-relaxed">
                    {addr.line1}
                    {addr.line2 && <><br />{addr.line2}</>}
                    <br />
                    {addr.city}, {addr.state} — {addr.pincode}
                  </p>
                  <p className="text-xs text-[#8C7B6E] mt-2 font-medium">📞 +91 {addr.phone}</p>
                  <div className="flex items-center gap-3 mt-4 pt-3 border-t border-[#F5F4F0]">
                    <button
                      onClick={() => openEdit(addr)}
                      className="flex items-center gap-1 text-xs font-semibold text-[#4A3728] hover:text-[#FF7A00] cursor-pointer transition-colors"
                      aria-label="Edit address"
                    >
                      <Edit3 size={13} /> Edit
                    </button>
                    <button
                      onClick={() => setDeletingId(addr.id)}
                      className="flex items-center gap-1 text-xs font-semibold text-[#DC2626] hover:underline cursor-pointer"
                      aria-label="Delete address"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-6 text-center space-y-3">
                  <p className="text-sm font-bold text-[#1A0A00]">Delete this address?</p>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleDelete(addr.id)}
                      className="px-4 py-1.5 rounded-xl bg-[#DC2626] text-white text-xs font-bold cursor-pointer"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setDeletingId(null)}
                      className="px-4 py-1.5 rounded-xl border border-[#E8E4DE] text-xs font-semibold text-[#4A3728] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}

        {/* Add Card Button */}
        {addresses.length < 5 && (
          <button
            onClick={openAdd}
            className="border-2 border-dashed border-[#E8E4DE] hover:border-[#FF7A00] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-[#8C7B6E] hover:text-[#FF7A00] transition-colors cursor-pointer min-h-[180px]"
            aria-label="Add new address"
          >
            <div className="w-10 h-10 rounded-full bg-[#FFF3E8] flex items-center justify-center text-[#FF7A00]">
              <Plus size={20} />
            </div>
            <span className="text-sm font-bold">Add New Address</span>
          </button>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => !isSubmitting && setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-[#F0EDE8] pb-3">
                <h3 className="text-lg font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  <MapPin className="inline w-5 h-5 text-[#FF7A00] mr-1.5 -mt-0.5" />
                  {editingId ? 'Edit Address' : 'Add New Address'}
                </h3>
                <button
                  onClick={() => !isSubmitting && setModalOpen(false)}
                  className="text-[#8C7B6E] hover:text-[#1A0A00] cursor-pointer transition-colors"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4" noValidate>

                {/* Pincode — auto-fill trigger */}
                <div>
                  <Label htmlFor="pincode">PIN Code <span className="text-red-500">*</span></Label>
                  <div className="relative flex gap-2 items-start">
                    <div className="flex-1 relative">
                      <input
                        id="pincode"
                        type="text"
                        maxLength={6}
                        inputMode="numeric"
                        placeholder="e.g. 560034"
                        {...register('pincode', {
                          onBlur: handlePincodeBlur,
                        })}
                        className={cn(inputClass('pincode'), 'pr-10')}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {pincodeLoading ? (
                          <Loader2 className="w-4 h-4 text-[#FF7A00] animate-spin" />
                        ) : errors.pincode ? (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        ) : isFieldValid('pincode') ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <AnimatePresence mode="wait">
                    {errors.pincode ? (
                      <FieldError key="e" message={errors.pincode.message} />
                    ) : isFieldValid('pincode') ? (
                      <FieldSuccess key="s" />
                    ) : (
                      <motion.p key="h" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-[#8C7B6E] mt-1.5">
                        We'll auto-fill city & state from PIN
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Full Name + Phone */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="fullName">Receiver's Name <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <input
                        id="fullName"
                        type="text"
                        placeholder="Full Name"
                        {...register('fullName')}
                        className={inputClass('fullName')}
                      />
                    </div>
                    <AnimatePresence mode="wait">
                      {errors.fullName ? <FieldError key="e" message={errors.fullName.message} /> : isFieldValid('fullName') ? <FieldSuccess key="s" /> : null}
                    </AnimatePresence>
                  </div>
                  <div>
                    <Label htmlFor="phone">Mobile Number <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <input
                        id="phone"
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="9876543210"
                        {...register('phone')}
                        className={inputClass('phone')}
                      />
                    </div>
                    <AnimatePresence mode="wait">
                      {errors.phone ? <FieldError key="e" message={errors.phone.message} /> : isFieldValid('phone') ? <FieldSuccess key="s" /> : null}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Alternate Phone */}
                <div>
                  <Label htmlFor="alternatePhone">Alternate Mobile (Optional)</Label>
                  <input
                    id="alternatePhone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="Another number (optional)"
                    {...register('alternatePhone')}
                    className={inputClass('alternatePhone')}
                  />
                  <AnimatePresence mode="wait">
                    {errors.alternatePhone ? <FieldError key="e" message={errors.alternatePhone.message} /> : null}
                  </AnimatePresence>
                </div>

                {/* Address Line 1 */}
                <div>
                  <Label htmlFor="addressLine1">Address Line 1 <span className="text-red-500">*</span></Label>
                  <input
                    id="addressLine1"
                    type="text"
                    placeholder="Flat / House No., Building, Street Name"
                    {...register('addressLine1')}
                    className={inputClass('addressLine1')}
                  />
                  <AnimatePresence mode="wait">
                    {errors.addressLine1 ? <FieldError key="e" message={errors.addressLine1.message} /> : isFieldValid('addressLine1') ? <FieldSuccess key="s" /> : null}
                  </AnimatePresence>
                </div>

                {/* Address Line 2 + Landmark */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="addressLine2">Area / Colony (Optional)</Label>
                    <input
                      id="addressLine2"
                      type="text"
                      placeholder="Sector, Colony, Area"
                      {...register('addressLine2')}
                      className={inputClass('addressLine2')}
                    />
                    <AnimatePresence mode="wait">
                      {errors.addressLine2 ? <FieldError key="e" message={errors.addressLine2.message} /> : null}
                    </AnimatePresence>
                  </div>
                  <div>
                    <Label htmlFor="landmark">Landmark (Optional)</Label>
                    <input
                      id="landmark"
                      type="text"
                      placeholder="Near school, temple..."
                      {...register('landmark')}
                      className={inputClass('landmark')}
                    />
                  </div>
                </div>

                {/* City + State */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                    <input
                      id="city"
                      type="text"
                      placeholder="City"
                      {...register('city')}
                      className={inputClass('city')}
                    />
                    <AnimatePresence mode="wait">
                      {errors.city ? <FieldError key="e" message={errors.city.message} /> : isFieldValid('city') ? <FieldSuccess key="s" /> : null}
                    </AnimatePresence>
                  </div>
                  <div>
                    <Label htmlFor="state">State <span className="text-red-500">*</span></Label>
                    <select
                      id="state"
                      {...register('state')}
                      className={cn(
                        'w-full h-12 px-4 rounded-xl border-2 text-base outline-none transition-all duration-200 bg-white appearance-none cursor-pointer',
                        'focus:ring-4 focus:ring-[#FF7A00]/20',
                        errors.state
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : isFieldValid('state')
                          ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
                          : 'border-[#E8E4DE] focus:border-[#FF7A00]'
                      )}
                    >
                      <option value="">Select state</option>
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <AnimatePresence mode="wait">
                      {errors.state ? <FieldError key="e" message={errors.state.message} /> : isFieldValid('state') ? <FieldSuccess key="s" /> : null}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Address Type */}
                <div>
                  <Label>Address Type <span className="text-red-500">*</span></Label>
                  <div className="flex gap-2">
                    {(['home', 'work', 'other'] as const).map((t) => {
                      const icons = { home: <Home size={14} />, work: <Briefcase size={14} />, other: <Building size={14} /> };
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            setValue('addressType', t, { shouldValidate: true, shouldDirty: true });
                          }}
                          className={cn(
                            'flex-1 h-11 rounded-xl border-2 font-bold capitalize transition-all cursor-pointer flex items-center justify-center gap-1.5 text-sm',
                            watchedAddressType === t
                              ? 'border-[#FF7A00] bg-[#FFF3E8] text-[#FF7A00]'
                              : 'border-[#E8E4DE] text-[#4A3728] hover:border-[#FF7A00]/40'
                          )}
                        >
                          {icons[t]} {t}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom label for "other" type */}
                <AnimatePresence>
                  {watchedAddressType === 'other' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Label htmlFor="customLabel">Custom Label <span className="text-red-500">*</span></Label>
                      <input
                        id="customLabel"
                        type="text"
                        maxLength={30}
                        placeholder="e.g. Parents Home, Gym, Office"
                        {...register('customLabel')}
                        className={inputClass('customLabel')}
                      />
                      <AnimatePresence mode="wait">
                        {errors.customLabel ? <FieldError key="e" message={errors.customLabel.message} /> : null}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Default toggle */}
                <label className="flex items-center gap-3 cursor-pointer pt-1 select-none">
                  <div
                    className={cn(
                      'w-11 h-6 rounded-full transition-colors shrink-0',
                      watchedIsDefault ? 'bg-[#FF7A00]' : 'bg-[#E8E4DE]'
                    )}
                    onClick={() => setValue('isDefault', !watchedIsDefault, { shouldDirty: true })}
                    role="switch"
                    aria-checked={watchedIsDefault}
                    tabIndex={0}
                  >
                    <div className={cn('w-5 h-5 rounded-full bg-white shadow-sm transition-transform mx-0.5 mt-0.5', watchedIsDefault ? 'translate-x-5' : 'translate-x-0')} />
                  </div>
                  <span className="text-sm font-semibold text-[#4A3728]">Make this my default delivery address</span>
                </label>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => !isSubmitting && setModalOpen(false)}
                    className="flex-1 h-12 rounded-xl border-2 border-[#E8E4DE] text-sm font-semibold text-[#4A3728] cursor-pointer hover:border-[#FF7A00]/40 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className={cn(
                      'flex-1 h-12 rounded-xl text-white text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2',
                      'bg-gradient-to-r from-[#FF7A00] to-[#FF4500] shadow-lg shadow-orange-500/30',
                      'hover:from-[#FF6A00] hover:to-[#E03D00] active:scale-[0.98]',
                      (!isValid || isSubmitting) && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : editingId ? 'Update Address' : 'Save Address'}
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
