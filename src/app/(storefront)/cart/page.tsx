'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Minus, Plus, Trash2, ArrowRight, ShoppingBag,
  Tag, X, Heart, Package, ShieldCheck, RefreshCw, Truck,
  ChevronDown, ChevronUp,
} from 'lucide-react';
import { useCartStore } from '@/lib/store/cart-store';
import { useWishlistStore } from '@/lib/store/wishlist-store';
import { formatCurrency } from '@/lib/utils/format-currency';
import { toast } from 'sonner';
import { ProductCard } from '@/components/storefront/product-card';
import { getFeaturedProducts } from '@/actions/products/storefront-queries';
import { Product } from '@/types';
import { useEffect } from 'react';
import { SkeletonCard } from '@/components/ui/skeletons';
const FREE_DELIVERY_THRESHOLD = 999;

export default function CartPage() {
  const router = useRouter();
  const {
    items, savedForLater, updateQuantity, removeItem,
    saveForLater, moveToCart, couponCode, applyCoupon,
    removeCoupon, subtotal, totalDiscount, finalTotal,
  } = useCartStore();

  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);

  const [inputCoupon, setInputCoupon]   = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [savedOpen, setSavedOpen]       = useState(true);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);

  const cartSubtotal     = subtotal();
  const isFreeDelivery   = cartSubtotal >= FREE_DELIVERY_THRESHOLD;
  const deliveryProgress = Math.min(100, (cartSubtotal / FREE_DELIVERY_THRESHOLD) * 100);
  const remainingForFree = FREE_DELIVERY_THRESHOLD - cartSubtotal;
  const shipping         = cartSubtotal === 0 ? 0 : isFreeDelivery ? 0 : 49;
  const discount         = totalDiscount();
  const total            = cartSubtotal - discount + shipping;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    setCouponLoading(true);
    setTimeout(async () => {
      const code = inputCoupon.trim().toUpperCase();
      const ok = await applyCoupon(code);
      setCouponLoading(false);
      if (ok) {
        toast.success(`Coupon "${code}" applied! 🎉`);
        setInputCoupon('');
      } else {
        toast.error('Invalid coupon. Try WELCOME100 or ARTISAN50');
      }
    }, 600);
  };

  const handleQtyChange = (itemId: string, currentQty: number, delta: number) => {
    const next = currentQty + delta;
    if (next < 1) { removeItem(itemId); toast.info('Item removed from cart.'); return; }
    if (next > 10) { toast.warning('Max 10 per product.'); return; }
    updateQuantity(itemId, next);
  };

  // Recommendations
  useEffect(() => {
    const fetchRecs = async () => {
      setRecommendationsLoading(true);
      const res = await getFeaturedProducts(4);
      if (res.data) {
        // filter out items already in cart
        const filtered = res.data.filter((p) => !items.find((i) => i.id === p.id)).slice(0, 4);
        setRecommendations(filtered);
      }
      setRecommendationsLoading(false);
    };
    fetchRecs();
  }, [items]);

  // ── EMPTY STATE ───────────────────────────────────────────────────────────
  if (items.length === 0 && savedForLater.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] pt-28 pb-20 flex items-center justify-center">
        <div className="text-center px-4 max-w-md space-y-6">
          <div className="w-28 h-28 mx-auto rounded-3xl bg-gradient-to-br from-[#FFF3E8] to-[#FFE4CC] flex items-center justify-center">
            <ShoppingBag size={52} className="text-[#FF7A00]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#1A0A00] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}>
              Your Cart is Empty
            </h2>
            <p className="text-sm text-[#8C7B6E]">Discover authentic Indian crafts from our artisans.</p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white shadow-[0_8px_24px_rgba(255,122,0,0.3)] hover:-translate-y-0.5 transition-all"
            style={{ background: 'linear-gradient(135deg, #FF7A00, #FF4500)' }}
          >
            Start Shopping <ArrowRight size={16} />
          </Link>

          {/* Recommendations */}
          {(recommendations.length > 0 || recommendationsLoading) && (
            <div className="mt-12 text-left">
              <h3 className="text-lg font-black text-[#1A0A00] mb-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                Trending This Week
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {recommendationsLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={i} variant="product" />
                  ))
                ) : (
                  recommendations.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24 pb-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#1A0A00]"
              style={{ fontFamily: "'Playfair Display', serif" }}>
            Your Cart
          </h1>
          <p className="text-sm text-[#8C7B6E] mt-1">{items.length} item{items.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── LEFT: Cart Items ──────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Free Delivery Progress */}
            {!isFreeDelivery && cartSubtotal > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-[#E8E4DE] p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-[#4A3728]">
                    <Truck size={16} className="text-[#FF7A00]" />
                    Add {formatCurrency(remainingForFree)} more for FREE delivery!
                  </div>
                  <span className="text-xs text-[#8C7B6E]">{Math.round(deliveryProgress)}%</span>
                </div>
                <div className="h-2 bg-[#F5F4F0] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${deliveryProgress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #FF7A00, #FF4500)' }}
                  />
                </div>
              </motion.div>
            )}

            {isFreeDelivery && (
              <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl px-4 py-3 flex items-center gap-2">
                <Truck size={16} className="text-[#16A34A]" />
                <span className="text-sm font-semibold text-[#16A34A]">
                  You've unlocked FREE delivery on this order!
                </span>
              </div>
            )}

            {/* Cart Items */}
            <div className="space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl border border-[#E8E4DE] p-4 hover:shadow-[0_4px_16px_rgba(255,122,0,0.06)] transition-shadow"
                  >
                    <div className="flex gap-4">
                      {/* Image */}
                      <Link href={`/products/${item.product.slug}`} className="shrink-0">
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#F5F4F0]">
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            sizes="112px"
                            className="object-cover"
                          />
                        </div>
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-[10px] font-bold text-[#FF7A00] uppercase tracking-wide mb-0.5">
                              {item.product.seller.name}
                            </p>
                            <Link href={`/products/${item.product.slug}`}>
                              <h3 className="text-sm font-semibold text-[#1A0A00] line-clamp-2 leading-snug hover:text-[#FF7A00] transition-colors">
                                {item.product.name}
                              </h3>
                            </Link>
                          </div>
                          <button
                            onClick={() => { removeItem(item.id); toast.info('Removed from cart.'); }}
                            className="p-1.5 rounded-lg text-[#B5A99A] hover:text-[#EF4444] hover:bg-[#FEF2F2] transition-all cursor-pointer shrink-0"
                          >
                            <X size={15} />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                          {/* Qty */}
                          <div className="flex items-center gap-0 border border-[#E8E4DE] rounded-xl overflow-hidden">
                            <button
                              onClick={() => handleQtyChange(item.id, item.quantity, -1)}
                              className="w-9 h-9 flex items-center justify-center text-[#4A3728] hover:bg-[#FFF3E8] hover:text-[#FF7A00] transition-colors cursor-pointer"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-10 text-center text-sm font-bold text-[#1A0A00]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQtyChange(item.id, item.quantity, +1)}
                              className="w-9 h-9 flex items-center justify-center text-[#4A3728] hover:bg-[#FFF3E8] hover:text-[#FF7A00] transition-colors cursor-pointer"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="ml-auto text-right">
                            <p className="text-base font-black text-[#1A0A00]">
                              {formatCurrency(item.product.price * item.quantity)}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-[10px] text-[#8C7B6E]">
                                {formatCurrency(item.product.price)} each
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Save for later */}
                        <button
                          onClick={() => { saveForLater(item.id); toast.success('Saved for later.'); }}
                          className="flex items-center gap-1.5 text-xs font-medium text-[#8C7B6E] hover:text-[#FF7A00] mt-2 cursor-pointer transition-colors"
                        >
                          <Heart size={12} /> Save for later
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Saved for Later */}
            {savedForLater.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#E8E4DE] overflow-hidden">
                <button
                  onClick={() => setSavedOpen((v) => !v)}
                  className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-[#FAFAF8] transition-colors"
                >
                  <span className="text-sm font-bold text-[#1A0A00]">
                    Saved for Later ({savedForLater.length})
                  </span>
                  {savedOpen ? <ChevronUp size={16} className="text-[#8C7B6E]" /> : <ChevronDown size={16} className="text-[#8C7B6E]" />}
                </button>
                <AnimatePresence>
                  {savedOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden divide-y divide-[#F5F4F0]"
                    >
                      {savedForLater.map((item) => (
                        <div key={item.id} className="flex gap-4 p-4">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#F5F4F0] shrink-0">
                            <Image src={item.product.images[0]} alt={item.product.name} fill sizes="64px" className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-[#1A0A00] line-clamp-2">{item.product.name}</p>
                            <p className="text-xs font-bold text-[#FF7A00] mt-1">{formatCurrency(item.product.price)}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <button
                                onClick={() => moveToCart(item.id)}
                                className="text-xs font-bold text-[#FF7A00] hover:underline cursor-pointer"
                              >
                                Move to Cart
                              </button>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-xs text-[#B5A99A] hover:text-[#EF4444] cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* ── RIGHT: Order Summary ──────────────────────────────────────── */}
          <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-2xl border border-[#E8E4DE] p-5">
              <h2 className="text-base font-black text-[#1A0A00] mb-4">Order Summary</h2>

              {/* Price breakdown */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-[#4A3728]">
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>{formatCurrency(cartSubtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#16A34A]">
                    <span>Coupon Discount</span>
                    <span>− {formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#4A3728]">
                  <span>Delivery</span>
                  <span className={isFreeDelivery ? 'text-[#16A34A] font-semibold' : ''}>
                    {cartSubtotal === 0 ? '—' : isFreeDelivery ? 'FREE' : formatCurrency(shipping)}
                  </span>
                </div>
                <div className="border-t border-[#E8E4DE] pt-3 flex justify-between font-black text-base text-[#1A0A00]">
                  <span>Total</span>
                  <span>{formatCurrency(Math.max(0, total))}</span>
                </div>
              </div>

              {/* Coupon */}
              <div className="mt-4">
                {couponCode ? (
                  <div className="flex items-center justify-between bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Tag size={14} className="text-[#16A34A]" />
                      <span className="text-xs font-bold text-[#16A34A]">{couponCode}</span>
                    </div>
                    <button onClick={removeCoupon} className="text-[#16A34A] hover:text-[#15803D] cursor-pointer">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                      placeholder="Coupon code"
                      className="flex-1 h-10 px-3 rounded-xl border border-[#E8E4DE] text-xs font-medium outline-none focus:border-[#FF7A00] transition-colors bg-[#FAFAF8]"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading || !inputCoupon.trim()}
                      className="h-10 px-4 rounded-xl text-xs font-bold text-[#FF7A00] border border-[#FF7A00] hover:bg-[#FF7A00] hover:text-white transition-all cursor-pointer disabled:opacity-50"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </form>
                )}
              </div>

              {/* CTA */}
              <button
                onClick={() => router.push('/checkout')}
                className="mt-5 w-full h-12 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                style={{ background: 'linear-gradient(135deg, #FF7A00, #FF4500)', boxShadow: '0 8px 24px rgba(255,122,0,0.3)' }}
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>

              {/* Trust */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#E8E4DE]">
                {[
                  { icon: ShieldCheck, label: 'Secure' },
                  { icon: RefreshCw, label: 'Easy Returns' },
                  { icon: Package, label: 'Authentic' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1">
                    <Icon size={14} className="text-[#8C7B6E]" />
                    <span className="text-[10px] text-[#8C7B6E] text-center">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {(recommendations.length > 0 || recommendationsLoading) && (
          <div className="mt-12">
            <h2 className="text-2xl font-black text-[#1A0A00] mb-6"
                style={{ fontFamily: "'Playfair Display', serif" }}>
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {recommendationsLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonCard key={i} variant="product" />
                ))
              ) : (
                recommendations.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
