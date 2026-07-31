'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle2 } from 'lucide-react';
import { RatingStars } from '@/components/ui/rating-stars';
import { toast } from 'sonner';
import { MOCK_REVIEWS, PENDING_REVIEWS } from '@/lib/mock/customer';

type ReviewItem = typeof MOCK_REVIEWS[0];
type PendingItem = typeof PENDING_REVIEWS[0];

export default function MyReviewsPage() {
  const [tab, setTab] = useState<'written' | 'pending'>('pending');
  const [reviews, setReviews] = useState<ReviewItem[]>(MOCK_REVIEWS);
  const [pending, setPending] = useState<PendingItem[]>(PENDING_REVIEWS);

  // Review modal state
  const [modalProduct, setModalProduct] = useState<PendingItem | null>(null);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalProduct || !title.trim() || !comment.trim()) {
      toast.error('Please complete rating, title, and review');
      return;
    }

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      orderId: modalProduct.orderId,
      productId: modalProduct.productId,
      productName: modalProduct.productName,
      productImage: modalProduct.productImage,
      sellerName: modalProduct.sellerName,
      rating,
      title,
      comment,
      date: 'Just now',
      status: 'published',
      helpful: 0,
    };

    setReviews([newRev, ...reviews]);
    setPending(pending.filter((p) => p.productId !== modalProduct.productId));
    setModalProduct(null);
    setTitle('');
    setComment('');
    toast.success('Thank you for reviewing! 🙏 Points added to your account.');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>
          ⭐ My Reviews
        </h1>
        <p className="text-sm text-[#8C7B6E] mt-0.5">Share feedback and help other shoppers support Indian artisans</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#E8E4DE] pb-2">
        <button
          onClick={() => setTab('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            tab === 'pending' ? 'bg-[#FFF3E8] text-[#FF7A00]' : 'text-[#8C7B6E] hover:text-[#1A0A00]'
          }`}
        >
          Pending Reviews ({pending.length})
        </button>
        <button
          onClick={() => setTab('written')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            tab === 'written' ? 'bg-[#FFF3E8] text-[#FF7A00]' : 'text-[#8C7B6E] hover:text-[#1A0A00]'
          }`}
        >
          Published Reviews ({reviews.length})
        </button>
      </div>

      {/* Pending Reviews Tab */}
      {tab === 'pending' && (
        <div className="space-y-4">
          {pending.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E8E4DE] p-12 text-center">
              <CheckCircle2 size={40} className="text-[#16A34A] mx-auto mb-3" />
              <p className="text-sm font-bold text-[#4A3728]">All caught up!</p>
              <p className="text-xs text-[#8C7B6E] mt-1">You have written reviews for all your delivered orders.</p>
            </div>
          ) : (
            pending.map((item) => (
              <div
                key={item.productId}
                className="bg-white rounded-2xl border border-[#E8E4DE] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex gap-3">
                  <img src={item.productImage} alt={item.productName} className="w-16 h-16 rounded-xl object-cover bg-[#F5F4F0] shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-[#FF7A00]">{item.sellerName}</p>
                    <p className="text-sm font-semibold text-[#1A0A00] line-clamp-1">{item.productName}</p>
                    <p className="text-xs text-[#8C7B6E] mt-0.5">{item.deliveredDate}</p>
                  </div>
                </div>
                <button
                  onClick={() => setModalProduct(item)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-xs font-bold shadow-[0_4px_12px_rgba(255,122,0,0.25)] hover:opacity-95 cursor-pointer shrink-0"
                >
                  Write Review (+20 pts)
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Written Reviews Tab */}
      {tab === 'written' && (
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E8E4DE] p-12 text-center">
              <Star size={40} className="text-[#E8E4DE] mx-auto mb-3" />
              <p className="text-sm font-bold text-[#4A3728]">No written reviews yet</p>
            </div>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="bg-white rounded-2xl border border-[#E8E4DE] p-5 space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-[#F5F4F0]">
                  <img src={rev.productImage} alt={rev.productName} className="w-12 h-12 rounded-xl object-cover bg-[#F5F4F0] shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#1A0A00] truncate">{rev.productName}</p>
                    <p className="text-[11px] text-[#8C7B6E]">Reviewed on {rev.date}</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <RatingStars rating={rev.rating} size={14} />
                    <span className="text-xs font-bold text-[#1A0A00]">{rev.title}</span>
                  </div>
                  <p className="text-xs text-[#4A3728] leading-relaxed">{rev.comment}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Write Review Modal */}
      <AnimatePresence>
        {modalProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setModalProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-black text-[#1A0A00]" style={{ fontFamily: "'Playfair Display', serif" }}>
                Write a Review
              </h3>

              <div className="flex items-center gap-3 p-3 bg-[#FAFAF8] rounded-xl">
                <img src={modalProduct.productImage} alt={modalProduct.productName} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <p className="text-xs font-bold text-[#1A0A00] line-clamp-1">{modalProduct.productName}</p>
                  <p className="text-[10px] text-[#8C7B6E]">by {modalProduct.sellerName}</p>
                </div>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-[#8C7B6E] uppercase tracking-wider block mb-1.5">Overall Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                          rating >= star ? 'border-[#FF7A00] bg-[#FFF3E8] text-[#FF7A00]' : 'border-[#E8E4DE] text-[#B5A99A]'
                        }`}
                      >
                        <Star size={20} fill={rating >= star ? '#FF7A00' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#8C7B6E] uppercase tracking-wider block mb-1">Headline / Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Beautiful craft and fast shipping!"
                    className="w-full h-10 px-3 rounded-xl border border-[#E8E4DE] text-sm outline-none focus:border-[#FF7A00]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#8C7B6E] uppercase tracking-wider block mb-1">Detailed Review *</label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What did you like or dislike about this product? Mention quality, packaging, material…"
                    className="w-full p-3 rounded-xl border border-[#E8E4DE] text-sm outline-none focus:border-[#FF7A00] resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalProduct(null)}
                    className="flex-1 h-11 rounded-xl border border-[#E8E4DE] text-sm font-semibold text-[#4A3728] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-sm font-bold cursor-pointer"
                  >
                    Submit Review
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
