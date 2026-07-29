'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Tag, X, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart-store';
import { formatCurrency } from '@/lib/utils/format-currency';
import { toast } from 'sonner';

export default function CartPage() {
  const router = useRouter();
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
  const [loading, setLoading] = useState(false);

  const cartSubtotal = subtotal();
  const isFreeDelivery = cartSubtotal >= 999;
  const estimatedShipping = cartSubtotal === 0 ? 0 : (isFreeDelivery ? 0 : 40);
  const estimatedGst = Math.round(cartSubtotal * 0.05);

  const calculatedTotal = Math.max(0, cartSubtotal - totalDiscount() + estimatedShipping + estimatedGst);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    
    setLoading(true);
    // Simulate API call for premium UI experience
    setTimeout(async () => {
      const code = inputCoupon.trim().toUpperCase();
      const success = await applyCoupon(code);
      setLoading(false);
      if (success) {
        toast.success(`Coupon "${code}" applied! 🎉 Discount calculated.`);
        setInputCoupon('');
      } else {
        toast.error('Invalid coupon. Try "WELCOME100" (₹100 off) or "DIWALI10" (10% off)');
      }
    }, 600);
  };

  const handleQtyChange = (itemId: string, currentQty: number, change: number) => {
    const nextQty = currentQty + change;
    if (nextQty < 1) {
      removeItem(itemId);
      toast.info('Item removed from cart.');
      return;
    }
    if (nextQty > 10) {
      toast.warning('Maximum quantity limit of 10 items per product reached.');
      return;
    }
    updateQuantity(itemId, nextQty);
  };

  if (items.length === 0 && savedForLater.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] pt-28 pb-20 flex items-center justify-center">
        <div className="text-center px-4 max-w-md space-y-6">
          <div className="text-7xl select-none">🛒</div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#1A1A1A]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Your Shopping Cart is Empty
            </h2>
            <p className="text-xs text-[#8C8B80] leading-relaxed">
              Discover authentic regional creations, textiles, pottery, and spices sourced directly from state cooperatives.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white font-bold text-xs shadow-md shadow-orange-500/10 hover:shadow-orange-500/25 active:scale-98 transition-all"
          >
            Explore Catalog <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-[#1A1A1A] mb-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Shopping Cart ({items.length})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence initial={false}>
              {items.map((item, idx) => (
                <motion.div 
                  key={item.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E5E4DE] flex gap-4 items-center shadow-sm relative overflow-hidden"
                >
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-[#FAFAF8] border border-[#E5E4DE] shrink-0">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <h3 className="font-bold text-xs sm:text-sm text-[#1A1A1A] line-clamp-1">{item.product.name}</h3>
                    <div className="text-[10px] text-[#8C8B80] font-semibold">Seller: {item.product.seller.name}</div>
                    <div className="text-sm font-black text-[#1A1A1A]">{formatCurrency(item.product.price)}</div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center border border-[#E5E4DE] rounded-xl bg-white h-9">
                    <button
                      onClick={() => handleQtyChange(item.id, item.quantity, -1)}
                      className="w-8 h-full flex items-center justify-center font-bold text-sm text-[#555449] hover:bg-[#FAFAF8] rounded-l-xl cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-[#1A1A1A]">{item.quantity}</span>
                    <button
                      onClick={() => handleQtyChange(item.id, item.quantity, 1)}
                      className="w-8 h-full flex items-center justify-center font-bold text-sm text-[#555449] hover:bg-[#FAFAF8] rounded-r-xl cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      removeItem(item.id);
                      toast.info('Item removed from cart');
                    }}
                    className="p-2 text-[#8C8B80] hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Saved For Later Shelf */}
            {savedForLater.length > 0 && (
              <div className="mt-8 space-y-3">
                <h3 className="font-bold text-sm text-[#1A1A1A] uppercase tracking-wide">Saved For Later ({savedForLater.length})</h3>
                <div className="space-y-3">
                  {savedForLater.map((item) => (
                    <div key={item.id} className="bg-[#FAFAF8] rounded-2xl p-4 border border-[#E5E4DE] flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#E5E4DE] bg-white">
                          <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs font-bold text-[#1A1A1A] truncate max-w-xs">{item.product.name}</span>
                      </div>
                      <button
                        onClick={() => {
                          moveToCart(item.id);
                          toast.success('Moved back to cart! 🛒');
                        }}
                        className="text-xs font-bold text-[#FF7A00] hover:underline cursor-pointer"
                      >
                        Move to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Checkout calculations summary card */}
          <div>
            <div className="bg-white rounded-3xl p-6 border border-[#E5E4DE] shadow-sm space-y-6 sticky top-24">
              <h2 className="font-bold text-base text-[#1A1A1A] uppercase tracking-wide">Order Summary</h2>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    placeholder="Coupon Code (WELCOME100)"
                    disabled={loading}
                    className="flex-1 h-11 px-3 rounded-xl border border-[#E5E4DE] text-xs font-semibold outline-none focus:border-[#FF7A00]"
                  />
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="h-11 px-4 rounded-xl bg-[#1C1B14] hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    {loading ? '...' : 'Apply'}
                  </button>
                </div>
                {couponCode && (
                  <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl font-bold">
                    <span className="flex items-center gap-1.5"><Tag size={12} /> Code "{couponCode}" applied</span>
                    <button type="button" onClick={removeCoupon} className="text-red-500 hover:underline cursor-pointer">Remove</button>
                  </div>
                )}
              </form>

              <div className="space-y-3.5 text-xs text-[#555449] border-t border-[#E5E4DE]/50 pt-4">
                <div className="flex justify-between">
                  <span>Cart Subtotal</span>
                  <span className="font-bold text-[#1A1A1A]">{formatCurrency(cartSubtotal)}</span>
                </div>
                {totalDiscount() > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-{formatCurrency(totalDiscount())}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Taxes (5% GST)</span>
                  <span className="font-bold text-[#1A1A1A]">{formatCurrency(estimatedGst)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className={`font-bold ${isFreeDelivery ? 'text-emerald-600' : 'text-[#1A1A1A]'}`}>
                    {isFreeDelivery ? 'FREE' : formatCurrency(estimatedShipping)}
                  </span>
                </div>
                {!isFreeDelivery && (
                  <p className="text-[10px] text-orange-600 font-semibold bg-orange-50 px-2 py-1 rounded-lg">
                    Add {formatCurrency(999 - cartSubtotal)} more for free delivery!
                  </p>
                )}
                <div className="flex justify-between text-base font-black text-[#1A1A1A] border-t border-[#E5E4DE]/50 pt-4">
                  <span>Total Amount</span>
                  <span className="text-[#FF7A00]">{formatCurrency(calculatedTotal)}</span>
                </div>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/25 active:scale-98 transition-all cursor-pointer"
              >
                Proceed to Checkout <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
