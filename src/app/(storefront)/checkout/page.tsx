'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, MapPin, Truck, CreditCard, Package } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart-store';
import { formatCurrency } from '@/lib/utils/format-currency';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

const steps = [
  { id: 1, label: 'Address', icon: MapPin },
  { id: 2, label: 'Delivery', icon: Truck },
  { id: 3, label: 'Review', icon: Package },
  { id: 4, label: 'Payment', icon: CreditCard },
];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const router = useRouter();

  const { items, finalTotal, clearCart } = useCartStore();

  const handleCompleteOrder = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    toast.success('Order placed successfully!');
    clearCart();
    router.push('/order-success');
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#1C1B14] mb-8 text-center">Checkout</h1>

        {/* Step Bar */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center gap-2">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                  currentStep >= step.id
                    ? 'bg-[#FF7A00] text-white'
                    : 'bg-white border border-gray-300 text-gray-400'
                }`}
              >
                {currentStep > step.id ? <Check size={16} /> : step.id}
              </div>
              <span className="text-xs font-semibold hidden sm:inline">{step.label}</span>
            </div>
          ))}
        </div>

        {/* Step Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm">
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Select Shipping Address</h2>
              <div className="p-4 rounded-2xl border-2 border-[#FF7A00] bg-[#FFF8F0] mb-6">
                <div className="font-semibold text-sm">Priya Sharma (Home)</div>
                <div className="text-xs text-[#555449] mt-1">123 MG Road, Koramangala, Bangalore, Karnataka - 560034</div>
                <div className="text-xs text-[#8C8B80] mt-1">+91 98765 43210</div>
              </div>
              <button
                onClick={() => setCurrentStep(2)}
                className="h-11 px-6 rounded-xl bg-[#FF7A00] text-white font-semibold text-xs"
              >
                Deliver to this Address →
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Select Delivery Method</h2>
              <div className="p-4 rounded-2xl border-2 border-[#FF7A00] bg-[#FFF8F0] mb-6 flex justify-between items-center">
                <div>
                  <div className="font-semibold text-sm">Standard Pan-India Delivery</div>
                  <div className="text-xs text-[#555449]">3-5 business days</div>
                </div>
                <span className="text-xs font-bold text-[#1A9E4E]">FREE</span>
              </div>
              <button
                onClick={() => setCurrentStep(3)}
                className="h-11 px-6 rounded-xl bg-[#FF7A00] text-white font-semibold text-xs"
              >
                Continue to Review →
              </button>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Review Order Items</h2>
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs p-3 bg-gray-50 rounded-xl">
                    <span>{item.product.name} (x{item.quantity})</span>
                    <span className="font-bold">{formatCurrency(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setCurrentStep(4)}
                className="h-11 px-6 rounded-xl bg-[#FF7A00] text-white font-semibold text-xs"
              >
                Proceed to Payment →
              </button>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="space-y-3 mb-6">
                {['upi', 'card', 'cod'].map((method) => (
                  <label
                    key={method}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer ${
                      paymentMethod === method ? 'border-[#FF7A00] bg-[#FFF8F0]' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                        className="accent-[#FF7A00]"
                      />
                      <span className="text-xs font-semibold uppercase">{method}</span>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex justify-between items-center border-t pt-4 mb-6">
                <span className="text-sm font-bold">Total Payable Amount</span>
                <span className="text-xl font-black text-[#FF7A00]">{formatCurrency(finalTotal())}</span>
              </div>
              <button
                onClick={handleCompleteOrder}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white font-bold text-sm shadow-md"
              >
                Pay & Complete Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
