'use client';

import { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, Truck, ShieldCheck, MapPin, CheckCircle } from 'lucide-react';
import { mockProducts } from '@/lib/mock/products';
import { useCartStore } from '@/lib/store/cart-store';
import { useWishlistStore } from '@/lib/store/wishlist-store';
import { formatCurrency } from '@/lib/utils/format-currency';
import { toast } from 'sonner';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = mockProducts.find((p) => p.slug === slug) || mockProducts[0];

  const [selectedImg, setSelectedImg] = useState(0);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping' | 'reviews'>('desc');
  const [qty, setQty] = useState(1);

  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isWishlisted = useWishlistStore((state) => state.isInWishlist(product.id));

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addItem(product, qty);
    toast.success(`Added ${qty} item(s) to your cart!`);
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setPincodeStatus('Delivery available! Estimated delivery within 3-5 business days.');
    } else {
      setPincodeStatus('Please enter a valid 6-digit Indian pincode.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#8C8B80] mb-6">
          <Link href="/" className="hover:text-[#FF7A00]">Home</Link> /
          <Link href="/products" className="hover:text-[#FF7A00]">Products</Link> /
          <span className="text-[#1C1B14] font-medium truncate max-w-xs">{product.name}</span>
        </div>

        {/* Product Details Header Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm mb-12">
          {/* Left - Image Gallery */}
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-4 border border-black/5">
              <Image
                src={product.images[selectedImg] || product.images[0]}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImg(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImg === idx ? 'border-[#FF7A00]' : 'border-transparent opacity-70'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right - Product Information */}
          <div>
            {/* Seller Info Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF8F0] text-[#FF7A00]">
                📍 {product.seller.location}
              </span>
              <span className="text-xs text-[#8C8B80]">Sold by <strong className="text-[#1C1B14]">{product.seller.name}</strong></span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1B14] mb-3 leading-tight">
              {product.name}
            </h1>

            {/* Rating Row */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                <Star size={14} className="fill-[#FFB800] stroke-[#FFB800]" />
                <span className="text-xs font-bold text-amber-900">{product.rating}</span>
              </div>
              <span className="text-xs text-[#8C8B80]">{product.reviewCount} customer reviews</span>
            </div>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 mb-6 p-4 rounded-2xl bg-[#FAFAF8] border border-black/5">
              <span className="text-3xl font-black text-[#1C1B14]">{formatCurrency(product.price)}</span>
              {product.mrp > product.price && (
                <>
                  <span className="text-lg text-[#B0AFA5] line-through">{formatCurrency(product.mrp)}</span>
                  <span className="text-sm font-bold text-[#1A9E4E]">{product.discount}% OFF</span>
                </>
              )}
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-black/10 rounded-xl bg-white h-12">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 h-full flex items-center justify-center font-bold text-lg hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-10 text-center font-semibold text-sm">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(10, qty + 1))}
                  className="w-10 h-full flex items-center justify-center font-bold text-lg hover:bg-gray-50"
                >
                  +
                </button>
              </div>

              <motion.button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 h-12 rounded-xl text-white font-semibold text-sm bg-gradient-to-r from-[#FF7A00] to-[#FF4500] hover:opacity-90 flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
                whileTap={{ scale: 0.98 }}
              >
                <ShoppingCart size={18} /> Add to Cart
              </motion.button>

              <button
                onClick={() => toggleWishlist(product)}
                className="w-12 h-12 rounded-xl border border-black/10 flex items-center justify-center text-[#555449] hover:bg-[#FFF8F0] transition-colors"
              >
                <Heart size={20} className={isWishlisted ? 'fill-red-500 stroke-red-500' : ''} />
              </button>
            </div>

            {/* Pincode Checker */}
            <div className="p-4 rounded-2xl border border-black/5 bg-gray-50 mb-6">
              <div className="text-xs font-semibold text-[#1C1B14] mb-2 flex items-center gap-1.5">
                <Truck size={14} className="text-[#FF7A00]" /> Check Delivery & COD Availability
              </div>
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter 6-digit Pincode"
                  className="flex-1 h-10 px-3 rounded-xl border border-black/10 bg-white text-xs outline-none focus:border-[#FF7A00]"
                />
                <button
                  type="submit"
                  className="h-10 px-4 rounded-xl bg-[#1C1B14] text-white text-xs font-semibold"
                >
                  Check
                </button>
              </form>
              {pincodeStatus && (
                <p className="text-xs mt-2 text-[#1A9E4E] font-medium">{pincodeStatus}</p>
              )}
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm">
          <div className="flex gap-4 border-b border-black/5 pb-4 mb-6">
            {[
              { id: 'desc', label: 'Description' },
              { id: 'specs', label: 'Specifications' },
              { id: 'shipping', label: 'Shipping & Returns' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-2 text-sm font-semibold transition-all relative ${
                  activeTab === tab.id ? 'text-[#FF7A00]' : 'text-[#8C8B80] hover:text-[#1C1B14]'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF7A00] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {activeTab === 'desc' && (
            <p className="text-sm leading-relaxed text-[#555449]">
              {product.description}
            </p>
          )}

          {activeTab === 'specs' && product.specifications && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div key={key} className="flex justify-between p-3 rounded-xl bg-[#FAFAF8] text-xs">
                  <span className="font-semibold text-[#8C8B80]">{key}</span>
                  <span className="font-medium text-[#1C1B14]">{val}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-3 text-xs text-[#555449]">
              <p>🚚 <strong>Pan-India Shipping</strong>: Delivered within 3-7 business days across India.</p>
              <p>↩️ <strong>7-Day Easy Returns</strong>: Returns accepted within 7 days of delivery for damaged or mismatched items.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
