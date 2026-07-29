'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, Heart, ShoppingCart, Truck, ShieldCheck, MapPin, 
  CheckCircle, Share2, Copy, Send, Check, MessageSquare 
} from 'lucide-react';
import { mockProducts } from '@/lib/mock/products';
import { useCartStore } from '@/lib/store/cart-store';
import { useWishlistStore } from '@/lib/store/wishlist-store';
import { formatCurrency } from '@/lib/utils/format-currency';
import { RatingStars } from '@/components/ui/rating-stars';
import { TIER_ICONS } from '@/lib/mock/sellers';
import { toast } from 'sonner';
import { useBrowsingStore } from '@/lib/store/browsing-store';

interface Review {
  id: string;
  name: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
}

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const product = mockProducts.find((p) => p.slug === slug);

  if (!product) {
    return notFound();
  }

  const [selectedImg, setSelectedImg] = useState(0);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
  const [pincodeSuccess, setPincodeSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping' | 'reviews'>('desc');
  const [qty, setQty] = useState(1);
  const [shareCopied, setShareCopied] = useState(false);

  // Reviews interactive state
  const [reviewsList, setReviewsList] = useState<Review[]>([
    { id: '1', name: 'Rajesh K.', rating: 5, title: 'Incredible Craftsmanship!', comment: 'The colors are vibrant and the hand loom details are clear. Fully worth the purchase.', date: 'July 15, 2026', verified: true },
    { id: '2', name: 'Sunita Sharma', rating: 4, title: 'Beautiful but slightly small', comment: 'Authentic looking blue pottery bowl, but dimensions are slightly smaller than I expected.', date: 'June 28, 2026', verified: true },
  ]);
  const [writeReviewOpen, setWriteReviewOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewName, setNewReviewName] = useState('');

  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isWishlisted = useWishlistStore((state) => state.isInWishlist(product.id));
  const { addRecentlyViewed } = useBrowsingStore();

  // Track recently viewed
  useEffect(() => {
    if (product) addRecentlyViewed(product);
  }, [product]);

  // Store in recently viewed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const items = localStorage.getItem('bb-recently-viewed');
      let parsed = items ? JSON.parse(items) : [];
      parsed = parsed.filter((id: string) => id !== product.id);
      parsed = [product.id, ...parsed].slice(0, 8);
      localStorage.setItem('bb-recently-viewed', JSON.stringify(parsed));
    }
  }, [product.id]);

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addItem(product, qty);
    toast.success(`Added ${qty} item(s) to your cart! 🛒`);
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setPincodeSuccess(true);
      setPincodeStatus('Express delivery available! Estimated delivery in 2-4 days. Cash on delivery accepted.');
    } else {
      setPincodeSuccess(false);
      setPincodeStatus('Please enter a valid 6-digit Indian postal code.');
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      toast.success('Product link copied to clipboard!');
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  const handleShareWhatsApp = () => {
    if (typeof window !== 'undefined') {
      const text = `Check out this beautiful handcrafted creation: ${product.name} on Bharat Bazaar!\n${window.location.href}`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim() || !newReviewName.trim()) {
      toast.error('Please fill out your name and comment.');
      return;
    }
    const newRev: Review = {
      id: String(Date.now()),
      name: newReviewName,
      rating: newRating,
      title: newReviewTitle || 'Customer Review',
      comment: newReviewComment,
      date: 'Today',
      verified: true,
    };
    setReviewsList([newRev, ...reviewsList]);
    setWriteReviewOpen(false);
    setNewReviewName('');
    setNewReviewTitle('');
    setNewReviewComment('');
    setNewRating(5);
    toast.success('Thank you! Your verified review has been published.');
  };

  // Score breakdown percentages
  const scoreBreakdowns = [
    { star: 5, pct: '75%' },
    { star: 4, pct: '18%' },
    { star: 3, pct: '5%' },
    { star: 2, pct: '2%' },
    { star: 1, pct: '0%' }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#8C8B80] mb-6">
          <Link href="/" className="hover:text-[#FF7A00]">Home</Link> /
          <Link href="/products" className="hover:text-[#FF7A00]">Catalog</Link> /
          <span className="text-[#1A1A1A] font-bold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Main Product Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E4DE] shadow-sm mb-12">
          
          {/* Gallery View */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FAFAF8] border border-[#E5E4DE]">
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
                    selectedImg === idx ? 'border-[#FF7A00]' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info Column */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF8F0] text-[#FF7A00]">
                📍 {product.seller.location}
              </span>
              
              <div className="flex gap-2">
                <button 
                  onClick={handleCopyLink} 
                  className="w-9 h-9 rounded-full bg-[#FAFAF8] hover:bg-[#FFF8F0] flex items-center justify-center border border-[#E5E4DE] text-[#555449] hover:text-[#FF7A00] transition-colors"
                  title="Copy link"
                >
                  {shareCopied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                </button>
                <button 
                  onClick={handleShareWhatsApp}
                  className="w-9 h-9 rounded-full bg-[#FAFAF8] hover:bg-emerald-50 flex items-center justify-center border border-[#E5E4DE] text-[#555449] hover:text-emerald-600 transition-colors"
                  title="Share on WhatsApp"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {product.name}
              </h1>
              <p className="text-xs text-[#8C8B80] mt-1.5">
                Sold by <Link href="/sellers" className="font-bold text-[#FF7A00] hover:underline">{product.seller.name}</Link>
                <span className="ml-1 text-xs">{TIER_ICONS[product.seller.tier]}</span>
              </p>
            </div>

            {/* Ratings Row */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                <Star size={14} className="fill-[#FFB800] stroke-[#FFB800]" />
                <span className="text-xs font-bold text-[#1A1A1A]">{product.rating}</span>
              </div>
              <span className="text-xs text-[#8C8B80]">|</span>
              <span className="text-xs text-[#8C8B80] font-semibold">{product.reviewCount} customer reviews</span>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 p-4 rounded-2xl bg-[#FAFAF8] border border-[#E5E4DE] max-w-sm">
              <span className="text-3xl font-black text-[#1A1A1A]">{formatCurrency(product.price)}</span>
              {product.mrp > product.price && (
                <>
                  <span className="text-base text-[#B0AFA5] line-through font-semibold">{formatCurrency(product.mrp)}</span>
                  <span className="text-xs font-bold text-emerald-600">({product.discount}% OFF)</span>
                </>
              )}
            </div>

            {/* Quantity Selector & Action Controls */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center border border-[#E5E4DE] rounded-xl bg-white h-12">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-11 h-full flex items-center justify-center font-bold text-[#555449] hover:bg-[#FAFAF8] rounded-l-xl cursor-pointer"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm text-[#1A1A1A]">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(10, qty + 1))}
                  className="w-11 h-full flex items-center justify-center font-bold text-[#555449] hover:bg-[#FAFAF8] rounded-r-xl cursor-pointer"
                >
                  +
                </button>
              </div>

              <motion.button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 h-12 rounded-xl text-white font-bold text-xs bg-gradient-to-r from-[#FF7A00] to-[#FF4500] hover:shadow-lg hover:shadow-orange-500/10 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-w-[160px]"
                whileTap={{ scale: 0.97 }}
              >
                <ShoppingCart size={16} /> Add to Cart
              </motion.button>

              <button
                onClick={() => {
                  toggleWishlist(product);
                  toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist! ❤️');
                }}
                className="w-12 h-12 rounded-xl border border-[#E5E4DE] hover:bg-[#FFF8F0] flex items-center justify-center text-[#555449] hover:text-[#FF7A00] transition-colors cursor-pointer"
              >
                <Heart size={18} className={isWishlisted ? 'fill-red-500 stroke-red-500' : ''} />
              </button>
            </div>

            {/* Pincode & Delivery Availability */}
            <div className="p-4 rounded-2xl border border-[#E5E4DE] bg-[#FAFAF8] space-y-3">
              <div className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
                <Truck size={14} className="text-[#FF7A00]" /> Check delivery pincode
              </div>
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit Pincode"
                  className="flex-1 h-10 px-3 rounded-xl border border-[#E5E4DE] bg-white text-xs font-semibold outline-none focus:border-[#FF7A00]"
                />
                <button
                  type="submit"
                  className="h-10 px-4 rounded-xl bg-[#1C1B14] hover:bg-black text-white text-xs font-bold cursor-pointer transition-colors"
                >
                  Verify
                </button>
              </form>
              {pincodeStatus && (
                <p className={`text-xs font-semibold flex items-center gap-1 ${pincodeSuccess ? 'text-emerald-600' : 'text-red-500'}`}>
                  {pincodeSuccess ? '✓' : '•'} {pincodeStatus}
                </p>
              )}
            </div>

            {/* Trust parameters */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-[10px] text-[#8C8B80] font-bold">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-500" /> Verified Artisan product
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-emerald-500" /> Secure checkout payments
              </div>
            </div>
          </div>
        </div>

        {/* Tab content panel */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E4DE] shadow-sm space-y-6">
          <div className="flex gap-6 border-b border-[#E5E4DE] pb-4 overflow-x-auto">
            {[
              { id: 'desc', label: 'Artisan Story' },
              { id: 'specs', label: 'Product Specifications' },
              { id: 'shipping', label: 'Shipping & Returns' },
              { id: 'reviews', label: `Reviews (${reviewsList.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-2.5 text-xs font-bold whitespace-nowrap outline-none cursor-pointer relative transition-colors ${
                  activeTab === tab.id ? 'text-[#FF7A00]' : 'text-[#8C8B80] hover:text-[#1A1A1A]'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="detail-active-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF7A00]"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="pt-2">
            {activeTab === 'desc' && (
              <div className="space-y-4">
                <p className="text-xs sm:text-sm leading-relaxed text-[#555449]">
                  {product.description || 'This beautiful handicraft is spun and colored using traditional wooden looms by native rural weaver families. Perfect addition to modern homes seeking a heritage aesthetic.'}
                </p>
                <div className="bg-[#FAFAF8] p-5 rounded-2xl border border-[#E5E4DE] flex flex-col sm:flex-row gap-4 items-center mt-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white flex items-center justify-center font-bold text-2xl">
                    {product.seller.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="space-y-1 text-center sm:text-left flex-1">
                    <h4 className="font-bold text-sm text-[#1A1A1A]">About Weaving Cooperative: {product.seller.name}</h4>
                    <p className="text-xs text-[#8C8B80]">Certified Gold Tier Artisan Cooperative based in {product.seller.location}.</p>
                    <Link href="/sellers" className="text-xs font-bold text-[#FF7A00] hover:underline inline-block pt-1">
                      Explore cooperative shop &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
                {product.specifications ? (
                  Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="flex justify-between p-3 rounded-xl bg-[#FAFAF8] text-xs border border-[#E5E4DE]/40">
                      <span className="font-bold text-[#8C8B80]">{key}</span>
                      <span className="font-semibold text-[#1A1A1A]">{val}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-[#8C8B80]">No specs listed for this item.</div>
                )}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4 text-xs sm:text-sm text-[#555449] leading-relaxed max-w-xl">
                <div className="flex gap-2">
                  <span>🚚</span>
                  <p><strong>Pan-India Shipping</strong>: Dispatched within 24 hours. Delivery takes 3-5 days for metro cities, 5-7 days for other regions.</p>
                </div>
                <div className="flex gap-2">
                  <span>📦</span>
                  <p><strong>Careful Packaging</strong>: Items are bubble-wrapped in double-ply corrugated containers to ensure pottery and fabrics arrive without damage.</p>
                </div>
                <div className="flex gap-2">
                  <span>↩️</span>
                  <p><strong>Easy Returns</strong>: Return request accepted within 7 days of shipment delivery if product is cracked, stained, or broken.</p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* Score breakdown bar */}
                <div className="flex flex-col md:flex-row gap-8 items-center border-b border-[#E5E4DE]/50 pb-6">
                  <div className="text-center space-y-1">
                    <div className="text-4xl font-black text-[#1A1A1A]">{product.rating}</div>
                    <div className="flex gap-0.5 text-[#FFB800] justify-center">
                      <Star size={16} className="fill-[#FFB800]" />
                      <Star size={16} className="fill-[#FFB800]" />
                      <Star size={16} className="fill-[#FFB800]" />
                      <Star size={16} className="fill-[#FFB800]" />
                      <Star size={16} className="fill-[#FFB800]" />
                    </div>
                    <p className="text-[10px] font-bold text-[#8C8B80] uppercase tracking-wide">Out of 5 Stars</p>
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    {scoreBreakdowns.map((score) => (
                      <div key={score.star} className="flex items-center gap-3 text-xs">
                        <span className="w-4 font-bold text-[#555449]">{score.star}★</span>
                        <div className="flex-1 h-2 rounded-full bg-[#E5E4DE]/50 overflow-hidden">
                          <div className="h-full bg-[#FFB800] rounded-full" style={{ width: score.pct }} />
                        </div>
                        <span className="w-8 font-bold text-[#8C8B80] text-right">{score.pct}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setWriteReviewOpen(!writeReviewOpen)}
                    className="px-5 py-2.5 rounded-xl bg-[#1C1B14] hover:bg-black text-white text-xs font-bold cursor-pointer"
                  >
                    Write a Review
                  </button>
                </div>

                {/* Collapsible review writing form */}
                <AnimatePresence>
                  {writeReviewOpen && (
                    <motion.form
                      onSubmit={handleAddReview}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-[#FAFAF8] p-5 rounded-2xl border border-[#E5E4DE] space-y-4 overflow-hidden"
                    >
                      <h4 className="font-bold text-xs text-[#1A1A1A] uppercase tracking-wide">Tell us about your experience</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-[#8C8B80] uppercase mb-1">Your Name</label>
                          <input
                            type="text"
                            required
                            value={newReviewName}
                            onChange={(e) => setNewReviewName(e.target.value)}
                            placeholder="e.g. Priya Sharma"
                            className="w-full h-10 px-3 rounded-lg border border-[#E5E4DE] bg-white text-xs outline-none focus:border-[#FF7A00]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[#8C8B80] uppercase mb-1">Rating</label>
                          <RatingStars 
                            rating={newRating} 
                            onRatingChange={setNewRating} 
                            interactive 
                            size={18} 
                            className="mt-1" 
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#8C8B80] uppercase mb-1">Review Title</label>
                        <input
                          type="text"
                          value={newReviewTitle}
                          onChange={(e) => setNewReviewTitle(e.target.value)}
                          placeholder="e.g. Excellent weaving quality!"
                          className="w-full h-10 px-3 rounded-lg border border-[#E5E4DE] bg-white text-xs outline-none focus:border-[#FF7A00]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#8C8B80] uppercase mb-1">Comments</label>
                        <textarea
                          rows={3}
                          required
                          value={newReviewComment}
                          onChange={(e) => setNewReviewComment(e.target.value)}
                          placeholder="Write your review comments here..."
                          className="w-full p-3 rounded-lg border border-[#E5E4DE] bg-white text-xs outline-none focus:border-[#FF7A00] resize-none"
                        />
                      </div>

                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => setWriteReviewOpen(false)}
                          className="px-4 py-2 rounded-lg text-xs font-bold border border-[#E5E4DE] text-[#555449] hover:bg-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#FF7A00] to-[#FF4500]"
                        >
                          Submit Review
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviewsList.map((rev) => (
                    <div key={rev.id} className="p-4 bg-[#FAFAF8] rounded-2xl border border-[#E5E4DE]/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#1A1A1A]">{rev.name}</span>
                          {rev.verified && (
                            <span className="text-[9px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                              Verified Buyer
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#8C8B80]">{rev.date}</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-[#FFB800]">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star 
                            key={idx} 
                            size={11} 
                            className={idx < rev.rating ? 'fill-[#FFB800] stroke-[#FFB800]' : 'stroke-[#D4D3CB] fill-transparent'} 
                          />
                        ))}
                      </div>
                      <h5 className="font-bold text-xs text-[#1A1A1A]">{rev.title}</h5>
                      <p className="text-xs text-[#555449] leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
