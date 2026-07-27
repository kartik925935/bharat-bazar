'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Tag } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart-store';
import { formatCurrency } from '@/lib/utils/format-currency';
import { toast } from 'sonner';

export default function CartPage() {
  const {
    items,
    savedForLater,
    updateQuantity,
    removeItem,
    saveForLater,
    moveToCart,
    couponCode,
    applyCoupon,
    removeCoupon,
    subtotal,
    totalDiscount,
    finalTotal,
  } = useCartStore();

  const [inputCoupon, setInputCoupon] = useState('');

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const success = await applyCoupon(inputCoupon);
    if (success) {
      toast.success(`Coupon ${inputCoupon.toUpperCase()} applied!`);
      setInputCoupon('');
    } else {
      toast.error('Invalid coupon code. Try WELCOME100 or VILLAGE20');
    }
  };

  if (items.length === 0 && savedForLater.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] pt-28 pb-20 flex items-center justify-center">
        <div className="text-center px-4 max-w-md">
          <div className="text-7xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-[#1C1B14] mb-2">Your Shopping Cart is Empty</h2>
          <p className="text-sm text-[#8C8B80] mb-6">Discover handcrafted sarees, pottery, and organic spices directly from artisans</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white font-semibold text-sm shadow-md"
          >
            Explore Products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#1C1B14] mb-8">Shopping Cart ({items.length})</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-4 sm:p-5 border border-black/5 flex gap-4 items-center">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                  <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-[#1C1B14] line-clamp-1">{item.product.name}</h3>
                  <div className="text-xs text-[#8C8B80] mb-2">Seller: {item.product.seller.name}</div>
                  <div className="text-sm font-bold text-[#1C1B14]">{formatCurrency(item.product.price)}</div>
                </div>

                <div className="flex items-center border border-black/10 rounded-xl bg-white h-9">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-full flex items-center justify-center font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-full flex items-center justify-center font-bold text-sm"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}

            {/* Saved For Later Shelf */}
            {savedForLater.length > 0 && (
              <div className="mt-8">
                <h3 className="font-bold text-base text-[#1C1B14] mb-3">Saved For Later ({savedForLater.length})</h3>
                <div className="space-y-3">
                  {savedForLater.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-2xl p-4 border border-black/5 flex items-center justify-between">
                      <span className="text-xs font-semibold truncate max-w-xs">{item.product.name}</span>
                      <button
                        onClick={() => moveToCart(item.id)}
                        className="text-xs font-semibold text-[#FF7A00] hover:underline"
                      >
                        Move to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary & Coupon Panel */}
          <div>
            <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm sticky top-24">
              <h2 className="font-bold text-lg text-[#1C1B14] mb-4">Order Summary</h2>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    placeholder="Coupon code (WELCOME100)"
                    className="flex-1 h-10 px-3 rounded-xl border border-black/10 text-xs outline-none focus:border-[#FF7A00]"
                  />
                  <button type="submit" className="h-10 px-4 rounded-xl bg-[#1C1B14] text-white text-xs font-semibold">
                    Apply
                  </button>
                </div>
                {couponCode && (
                  <div className="flex items-center justify-between text-xs text-[#1A9E4E] mt-2 font-semibold bg-green-50 p-2 rounded-lg">
                    <span>Tag: {couponCode} applied</span>
                    <button onClick={removeCoupon} className="text-red-500">Remove</button>
                  </div>
                )}
              </form>

              <div className="space-y-3 text-xs text-[#555449] border-t border-black/5 pt-4 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1C1B14]">{formatCurrency(subtotal())}</span>
                </div>
                {totalDiscount() > 0 && (
                  <div className="flex justify-between text-[#1A9E4E]">
                    <span>Coupon Discount</span>
                    <span className="font-semibold">-{formatCurrency(totalDiscount())}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-[#1A9E4E]">FREE</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#1C1B14] border-t border-black/5 pt-3">
                  <span>Total Amount</span>
                  <span className="text-[#FF7A00]">{formatCurrency(finalTotal())}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:opacity-90 transition-all"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
