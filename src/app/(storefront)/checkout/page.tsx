'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Check, MapPin, Truck, CreditCard, Package, ChevronRight, 
  ChevronLeft, AlertCircle, ShoppingBag, ArrowRight, Loader2
} from 'lucide-react';
import { useCartStore } from '@/lib/store/cart-store';
import { useAuthStore } from '@/lib/store/auth-store';
import { formatCurrency } from '@/lib/utils/format-currency';
import { getAddresses, createAddress } from '@/actions/address/actions';
import { syncCartItems } from '@/actions/cart/actions';
import { createOrder } from '@/actions/orders/actions';
import { processPayment } from '@/actions/payments/actions';
import { useOrderStore } from '@/lib/store/order-store';
import { toast } from 'sonner';

// Step Schemas
const addressSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  addressLine1: z.string().min(5, 'Address line must be at least 5 characters'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit Indian pincode'),
});

const paymentCardSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be exactly 16 digits'),
  cardName: z.string().min(2, 'Card holder name is required'),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Expiry must be in MM/YY format'),
  cvv: z.string().regex(/^\d{3}$/, 'CVV must be 3 digits'),
});

const paymentUpiSchema = z.object({
  upiId: z.string().regex(/^[\w.-]+@[\w.-]+$/, 'Enter a valid UPI ID (e.g. sharma@okaxis)'),
});

type AddressValues = z.infer<typeof addressSchema> & { id?: string };

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <motion.p
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="flex items-center gap-1 text-[10px] text-red-500 mt-1 font-medium"
      role="alert"
    >
      <AlertCircle className="w-3 h-3 flex-shrink-0" />
      {message}
    </motion.p>
  );
}

const inputBase = (error: boolean) =>
  `w-full h-10 px-3 rounded-lg border bg-white text-xs outline-none transition-colors ${
    error
      ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20'
      : 'border-[#E5E4DE] focus:border-[#FF7A00]'
  }`;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, totalDiscount, finalTotal, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [savedAddresses, setSavedAddresses] = useState<AddressValues[]>([
    {
      fullName: 'Priya Sharma',
      phone: '9876543210',
      addressLine1: '123 MG Road, Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560034',
    }
  ]);
  const [selectedAddressIdx, setSelectedAddressIdx] = useState(0);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load saved addresses from database on mount if user is logged in
  useEffect(() => {
    async function loadDbAddresses() {
      if (isAuthenticated && user) {
        try {
          const res = await getAddresses();
          if (res.success && res.data && res.data.length > 0) {
            const mapped: AddressValues[] = res.data.map((a: any) => ({
              id: a.id,
              fullName: a.full_name,
              phone: a.phone,
              addressLine1: a.address_line1,
              city: a.city,
              state: a.state,
              pincode: a.pincode,
            }));
            setSavedAddresses(mapped);
            setSelectedAddressIdx(0);
          }
        } catch (err) {
          console.error('Failed to load user addresses:', err);
        }
      }
    }
    loadDbAddresses();
  }, [isAuthenticated, user]);

  // Forms
  const addressForm = useForm<AddressValues>({
    resolver: zodResolver(addressSchema),
    mode: 'onChange',
    defaultValues: { fullName: '', phone: '', addressLine1: '', city: '', state: '', pincode: '' },
  });

  const cardForm = useForm<z.infer<typeof paymentCardSchema>>({
    resolver: zodResolver(paymentCardSchema),
    defaultValues: { cardNumber: '', cardName: '', expiry: '', cvv: '' },
  });

  const upiForm = useForm<z.infer<typeof paymentUpiSchema>>({
    resolver: zodResolver(paymentUpiSchema),
    defaultValues: { upiId: '' },
  });

  if (items.length === 0 && !orderCompleted) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] pt-28 pb-20 flex items-center justify-center">
        <div className="text-center px-4 max-w-md space-y-6">
          <div className="text-7xl select-none">🛒</div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#1A1A1A]">Your Cart is Empty</h2>
            <p className="text-xs text-[#8C8B80]">Please add handcrafted items to checkout.</p>
          </div>
          <Link href="/products" className="inline-flex items-center gap-1 text-xs font-bold text-white bg-gradient-to-r from-[#FF7A00] to-[#FF4500] px-6 py-2.5 rounded-xl">
            Browse Catalog <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  const handleAddNewAddress = async (data: AddressValues) => {
    if (isAuthenticated) {
      try {
        const res = await createAddress({
          fullName: data.fullName,
          phone: data.phone,
          addressLine1: data.addressLine1,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
        });
        if (res.success && res.data) {
          const newAddress: AddressValues = {
            id: res.data.id,
            fullName: res.data.full_name,
            phone: res.data.phone,
            addressLine1: res.data.address_line1,
            city: res.data.city,
            state: res.data.state,
            pincode: res.data.pincode,
          };
          setSavedAddresses([...savedAddresses, newAddress]);
          setSelectedAddressIdx(savedAddresses.length);
          setShowNewAddressForm(false);
          addressForm.reset();
          toast.success('Shipping address saved to your account!');
          return;
        }
      } catch (err) {
        console.error('Error saving address:', err);
      }
    }

    setSavedAddresses([...savedAddresses, data]);
    setSelectedAddressIdx(savedAddresses.length);
    setShowNewAddressForm(false);
    addressForm.reset();
    toast.success('Shipping address saved!');
  };

  const handleNext = async () => {
    if (step === 1) {
      if (savedAddresses.length === 0) {
        toast.error('Please add a shipping address.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // Step 2 is Order Review, always valid
      setStep(3);
    }
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'card') {
      const valid = await cardForm.trigger();
      if (!valid) {
        toast.error('Please fix card errors.');
        return;
      }
    } else if (paymentMethod === 'upi') {
      const valid = await upiForm.trigger();
      if (!valid) {
        toast.error('Please enter a valid UPI ID.');
        return;
      }
    }

    if (!isAuthenticated) {
      toast.error('Please sign in to place your order');
      router.push('/auth/login?redirect=/checkout');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Ensure address is saved in database to obtain a valid address UUID
      let shippingAddressId: string | undefined = savedAddresses[selectedAddressIdx]?.id;

      if (!shippingAddressId) {
        const selectedAddr = savedAddresses[selectedAddressIdx];
        const addrRes = await createAddress({
          fullName: selectedAddr.fullName,
          phone: selectedAddr.phone,
          addressLine1: selectedAddr.addressLine1,
          city: selectedAddr.city,
          state: selectedAddr.state,
          pincode: selectedAddr.pincode,
        });
        if (addrRes.error || !addrRes.data) {
          toast.error(addrRes.error || 'Failed to save shipping address');
          setIsSubmitting(false);
          return;
        }
        shippingAddressId = addrRes.data.id;
      }

      if (!shippingAddressId) {
        toast.error('Shipping address could not be verified');
        setIsSubmitting(false);
        return;
      }

      // 2. Synchronize client-side cart items with Supabase cart in database
      const syncRes = await syncCartItems(
        items.map((i) => ({
          productId: i.product?.id || i.id,
          quantity: i.quantity,
        }))
      );

      if (syncRes.error) {
        toast.error(syncRes.error || 'Failed to sync cart before ordering');
        setIsSubmitting(false);
        return;
      }

      // 3. Call backend create_order_from_cart RPC via createOrder server action
      const orderRes = await createOrder({ shippingAddressId });

      if (orderRes.error || !orderRes.data) {
        toast.error(orderRes.error || 'Failed to place order');
        setIsSubmitting(false);
        return;
      }

      const createdOrder = orderRes.data;

      // 4. Record payment in database
      const paymentRes = await processPayment({
        orderId: createdOrder.id,
        paymentMethodId: paymentMethod,
        amount: createdOrder.total_amount || totalAmount,
      });

      if (paymentRes.error) {
        console.warn('Payment record warning:', paymentRes.error);
      }

      // 5. Complete order UX
      const finalOrderId = createdOrder.order_number || createdOrder.id || `BB-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      setGeneratedOrderId(finalOrderId);
      setOrderCompleted(true);
      clearCart();
      useOrderStore.getState().fetchOrders();
      toast.success('Thank you! Order placed successfully. 🎉');
    } catch (err: any) {
      console.error('Order placement exception:', err);
      toast.error(err.message || 'An unexpected error occurred while placing your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cartSubtotal = subtotal();
  const estimatedShipping = cartSubtotal >= 999 ? 0 : 40;
  const estimatedGst = Math.round(cartSubtotal * 0.05);
  const totalAmount = Math.max(0, cartSubtotal - totalDiscount() + estimatedShipping + estimatedGst);

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Screen Overlay */}
        <AnimatePresence>
          {orderCompleted && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-50 bg-[#FAFAF8] flex flex-col items-center justify-center p-6 text-center"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-md bg-white p-8 rounded-3xl border border-[#E5E4DE] shadow-xl space-y-6"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-4xl">
                  ✓
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-black text-[#1A1A1A]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Order Placed Successfully!
                  </h1>
                  <p className="text-xs text-[#8C8B80] leading-relaxed">
                    Your artisan order is on the way. A verification text message has been sent to your mobile phone number.
                  </p>
                </div>

                <div className="bg-[#FAFAF8] p-4 rounded-2xl border border-[#E5E4DE] text-left space-y-2 text-xs">
                  <div className="flex justify-between font-bold text-[#1A1A1A]">
                    <span>Order ID:</span>
                    <span className="font-mono text-orange-600">{generatedOrderId}</span>
                  </div>
                  <div className="flex justify-between text-[#8C8B80] font-semibold">
                    <span>Est. Delivery:</span>
                    <span>2-4 Business Days</span>
                  </div>
                  <div className="flex justify-between text-[#8C8B80] font-semibold">
                    <span>Shipping To:</span>
                    <span>{savedAddresses[selectedAddressIdx]?.city}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => router.replace('/orders')}
                    className="w-full h-11 rounded-xl text-white font-bold text-xs bg-gradient-to-r from-[#FF7A00] to-[#FF4500] cursor-pointer"
                  >
                    View in My Orders
                  </button>
                  <button
                    onClick={() => router.replace('/products')}
                    className="w-full h-11 rounded-xl text-[#4A3728] font-bold text-xs bg-[#FAFAF8] border border-[#E5E4DE] hover:bg-[#F0EDE8] transition-colors cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <h1 className="text-3xl font-extrabold text-[#1A1A1A] mb-8 text-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Secure Checkout
        </h1>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-10 max-w-lg mx-auto">
          {[
            { id: 1, label: 'Delivery Address' },
            { id: 2, label: 'Review Order' },
            { id: 3, label: 'Payment Details' },
          ].map((s, idx) => (
            <div key={s.id} className="flex items-center flex-1 last:flex-initial">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  step >= s.id ? 'bg-[#FF7A00] text-white' : 'bg-white border border-[#E5E4DE] text-[#8C8B80]'
                }`}>
                  {step > s.id ? <Check size={14} /> : s.id}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wide hidden sm:inline ${
                  step >= s.id ? 'text-[#FF7A00]' : 'text-[#8C8B80]'
                }`}>
                  {s.label}
                </span>
              </div>
              {idx < 2 && (
                <div className={`flex-1 h-[1px] mx-3 ${step > s.id ? 'bg-[#FF7A00]' : 'bg-[#E5E4DE]'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E4DE] shadow-sm space-y-6">
          <AnimatePresence mode="wait">
            
            {/* Step 1: Address */}
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-[#1A1A1A]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Shipping Address</h2>
                  <p className="text-xs text-[#8C8B80]">Select where we should ship your artisan items</p>
                </div>

                {savedAddresses.map((addr, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setSelectedAddressIdx(idx)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedAddressIdx === idx ? 'border-[#FF7A00] bg-[#FFF8F0]' : 'border-[#E5E4DE] hover:border-[#FF7A00]/40'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-xs text-[#1A1A1A]">{addr.fullName}</span>
                      {selectedAddressIdx === idx && <span className="text-[10px] bg-orange-600 text-white font-bold px-2 py-0.5 rounded-full">Deliver Here</span>}
                    </div>
                    <p className="text-xs text-[#555449]">{addr.addressLine1}, {addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="text-[10px] text-[#8C8B80] mt-1 font-semibold">Phone: +91 {addr.phone}</p>
                  </div>
                ))}

                {!showNewAddressForm ? (
                  <button 
                    onClick={() => setShowNewAddressForm(true)}
                    className="text-xs font-bold text-[#FF7A00] hover:underline"
                  >
                    + Add a new delivery address
                  </button>
                ) : (
                  <form onSubmit={addressForm.handleSubmit(handleAddNewAddress)} className="border border-[#E5E4DE] p-5 rounded-2xl bg-[#FAFAF8] space-y-4">
                    <h3 className="font-bold text-xs text-[#1A1A1A] uppercase tracking-wide">New Shipping Address</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-[#8C8B80] uppercase mb-1">Full Name <span className="text-red-500">*</span></label>
                        <input 
                          {...addressForm.register('fullName')}
                          className={inputBase(!!addressForm.formState.errors.fullName)} 
                        />
                        <AnimatePresence mode="wait"><FieldError message={addressForm.formState.errors.fullName?.message} /></AnimatePresence>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#8C8B80] uppercase mb-1">Mobile Number <span className="text-red-500">*</span></label>
                        <input 
                          {...addressForm.register('phone')}
                          className={inputBase(!!addressForm.formState.errors.phone)} 
                        />
                        <AnimatePresence mode="wait"><FieldError message={addressForm.formState.errors.phone?.message} /></AnimatePresence>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-[#8C8B80] uppercase mb-1">Street Address <span className="text-red-500">*</span></label>
                        <input 
                          {...addressForm.register('addressLine1')}
                          className={inputBase(!!addressForm.formState.errors.addressLine1)} 
                        />
                        <AnimatePresence mode="wait"><FieldError message={addressForm.formState.errors.addressLine1?.message} /></AnimatePresence>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#8C8B80] uppercase mb-1">City <span className="text-red-500">*</span></label>
                        <input 
                          {...addressForm.register('city')}
                          className={inputBase(!!addressForm.formState.errors.city)} 
                        />
                        <AnimatePresence mode="wait"><FieldError message={addressForm.formState.errors.city?.message} /></AnimatePresence>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#8C8B80] uppercase mb-1">State <span className="text-red-500">*</span></label>
                        <input 
                          {...addressForm.register('state')}
                          className={inputBase(!!addressForm.formState.errors.state)} 
                        />
                        <AnimatePresence mode="wait"><FieldError message={addressForm.formState.errors.state?.message} /></AnimatePresence>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#8C8B80] uppercase mb-1">Pincode <span className="text-red-500">*</span></label>
                        <input 
                          {...addressForm.register('pincode')}
                          className={inputBase(!!addressForm.formState.errors.pincode)} 
                        />
                        <AnimatePresence mode="wait"><FieldError message={addressForm.formState.errors.pincode?.message} /></AnimatePresence>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button 
                        type="button" 
                        onClick={() => { setShowNewAddressForm(false); addressForm.reset(); }}
                        className="px-4 py-2 rounded-lg text-xs font-semibold border border-[#E5E4DE] hover:bg-white"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={!addressForm.formState.isValid || addressForm.formState.isSubmitting}
                        className={`px-5 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#FF7A00] to-[#FF4500] transition-opacity ${
                          !addressForm.formState.isValid || addressForm.formState.isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                        }`}
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                )}

                <div className="flex justify-end pt-4 border-t border-[#E5E4DE]/50">
                  <button 
                    onClick={handleNext}
                    className="h-11 px-6 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    Continue <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Review Order */}
            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-[#1A1A1A]">Review Order</h2>
                  <p className="text-xs text-[#8C8B80]">Please verify order items and totals before payment</p>
                </div>

                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-[#FAFAF8] p-3 rounded-xl border border-[#E5E4DE]/50 text-xs">
                      <div className="flex items-center gap-3">
                        <img src={item.product.images[0]} alt="" className="w-8 h-8 rounded object-cover" />
                        <span className="font-bold text-[#1A1A1A] truncate max-w-xs">{item.product.name} (x{item.quantity})</span>
                      </div>
                      <span className="font-bold text-[#1A1A1A]">{formatCurrency(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#E5E4DE]/50 pt-4 flex justify-between">
                  <button 
                    onClick={() => setStep(1)}
                    className="h-11 px-5 rounded-xl border border-[#E5E4DE] text-[#555449] font-bold text-xs flex items-center gap-1"
                  >
                    <ChevronLeft size={14} /> Back
                  </button>
                  <button 
                    onClick={handleNext}
                    className="h-11 px-6 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    Proceed to Payment <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-bold text-[#1A1A1A]">Select Payment Details</h2>
                  <p className="text-xs text-[#8C8B80]">Choose payment method and fill requirements</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'upi', label: 'UPI (GPay / PhonePe)' },
                    { id: 'card', label: 'Credit / Debit Card' },
                    { id: 'cod', label: 'Cash on Delivery (COD)' }
                  ].map((pay) => (
                    <button
                      key={pay.id}
                      type="button"
                      onClick={() => setPaymentMethod(pay.id as any)}
                      className={`p-3.5 rounded-xl border-2 text-xs font-bold transition-all ${
                        paymentMethod === pay.id ? 'border-[#FF7A00] bg-[#FFF8F0] text-[#FF7A00]' : 'border-[#E5E4DE] text-[#555449]'
                      }`}
                    >
                      {pay.label}
                    </button>
                  ))}
                </div>

                <div className="bg-[#FAFAF8] p-5 rounded-2xl border border-[#E5E4DE] space-y-4">
                  {paymentMethod === 'upi' && (
                    <div className="space-y-3">
                      <h4 className="font-bold text-xs text-[#1A1A1A] uppercase tracking-wide">Enter UPI Address</h4>
                      <input 
                        {...upiForm.register('upiId')}
                        placeholder="username@okaxis" 
                        className="w-full h-11 px-3 rounded-lg border border-[#E5E4DE] bg-white text-xs outline-none focus:border-[#FF7A00]"
                      />
                      {upiForm.formState.errors.upiId && <p className="text-[10px] text-red-500 mt-1">{upiForm.formState.errors.upiId.message}</p>}
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-[#8C8B80] uppercase mb-1">Card Number</label>
                        <input 
                          {...cardForm.register('cardNumber')}
                          maxLength={16}
                          placeholder="1234567890123456"
                          className="w-full h-11 px-3 rounded-lg border border-[#E5E4DE] bg-white text-xs outline-none"
                        />
                        {cardForm.formState.errors.cardNumber && <p className="text-[10px] text-red-500 mt-1">{cardForm.formState.errors.cardNumber.message}</p>}
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#8C8B80] uppercase mb-1">Expiry Date</label>
                        <input 
                          {...cardForm.register('expiry')}
                          placeholder="MM/YY"
                          className="w-full h-11 px-3 rounded-lg border border-[#E5E4DE] bg-white text-xs outline-none"
                        />
                        {cardForm.formState.errors.expiry && <p className="text-[10px] text-red-500 mt-1">{cardForm.formState.errors.expiry.message}</p>}
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#8C8B80] uppercase mb-1">CVV Code</label>
                        <input 
                          {...cardForm.register('cvv')}
                          maxLength={3}
                          placeholder="123"
                          className="w-full h-11 px-3 rounded-lg border border-[#E5E4DE] bg-white text-xs outline-none"
                        />
                        {cardForm.formState.errors.cvv && <p className="text-[10px] text-red-500 mt-1">{cardForm.formState.errors.cvv.message}</p>}
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <p className="text-xs text-orange-700 font-semibold bg-orange-50 p-3 rounded-lg">
                      📦 An additional charge of ₹20 applies on cash collections at your doorstep. Please keep cash change ready.
                    </p>
                  )}
                </div>

                <div className="border-t border-[#E5E4DE]/50 pt-4 flex justify-between items-center">
                  <button 
                    onClick={() => setStep(2)}
                    className="h-11 px-5 rounded-xl border border-[#E5E4DE] text-[#555449] font-bold text-xs flex items-center gap-1"
                  >
                    <ChevronLeft size={14} /> Back
                  </button>
                  
                  <div className="flex gap-6 items-center">
                    <div className="text-right">
                      <span className="text-[10px] text-[#8C8B80] block font-semibold uppercase">Total Payable:</span>
                      <span className="text-lg font-black text-[#FF7A00]">{formatCurrency(totalAmount)}</span>
                    </div>
                    <button 
                      onClick={handlePlaceOrder}
                      disabled={isSubmitting}
                      className="h-11 px-6 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white font-bold text-xs flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm active:shadow-none"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <span>Complete Order</span>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
