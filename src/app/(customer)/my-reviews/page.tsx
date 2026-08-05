'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle2, AlertCircle, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { RatingStars } from '@/components/ui/rating-stars';
import { toast } from 'sonner';
import { MOCK_REVIEWS, PENDING_REVIEWS } from '@/lib/mock/customer';

// ─── Schema ─────────────────────────────────────────────────────────────────
const reviewSchema = z.object({
  overallRating: z
    .number({ required_error: 'Please select a star rating' })
    .min(1, 'Please rate this product (minimum 1 star)')
    .max(5, 'Rating cannot exceed 5 stars'),
  reviewTitle: z
    .string()
    .min(1, 'Please add a title to your review')
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  reviewText: z
    .string()
    .min(1, 'Please write your review')
    .min(30, 'Review must be at least 30 characters to be helpful')
    .max(1000, 'Review cannot exceed 1000 characters'),
  wouldRecommend: z
    .boolean({ required_error: "Please tell others if you'd recommend this product" })
    .optional(),
});
type ReviewFormData = z.infer<typeof reviewSchema>;

const RATING_LABELS: Record<number, string> = {
  1: 'Terrible', 2: 'Poor', 3: 'Okay', 4: 'Good', 5: 'Excellent',
};

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


type ReviewItem = typeof MOCK_REVIEWS[0];
type PendingItem = typeof PENDING_REVIEWS[0];

export default function MyReviewsPage() {
  const [tab, setTab] = useState<'written' | 'pending'>('pending');
  const [reviews, setReviews] = useState<ReviewItem[]>(MOCK_REVIEWS);
  const [pending, setPending] = useState<PendingItem[]>(PENDING_REVIEWS);

  // Review modal state
  const [modalProduct, setModalProduct] = useState<PendingItem | null>(null);

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: { overallRating: 5, reviewTitle: '', reviewText: '', wouldRecommend: undefined },
  });

  const { register, handleSubmit, watch, setValue, reset,
    formState: { errors, touchedFields, isSubmitting, isValid } } = form;

  const watchedRating = watch('overallRating', 5);
  const watchedRecommend = watch('wouldRecommend');
  const watchedText = watch('reviewText', '');

  const openModal = (product: PendingItem) => {
    setModalProduct(product);
    reset({ overallRating: 5, reviewTitle: '', reviewText: '', wouldRecommend: undefined });
  };

  const onSubmitReview = async (data: ReviewFormData) => {
    if (!modalProduct) return;
    await new Promise((r) => setTimeout(r, 1000));
    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      orderId: modalProduct.orderId,
      productId: modalProduct.productId,
      productName: modalProduct.productName,
      productImage: modalProduct.productImage,
      sellerName: modalProduct.sellerName,
      rating: data.overallRating,
      title: data.reviewTitle,
      comment: data.reviewText,
      date: 'Just now',
      status: 'published',
      helpful: 0,
    };
    setReviews([newRev, ...reviews]);
    setPending(pending.filter((p) => p.productId !== modalProduct.productId));
    setModalProduct(null);
    reset();
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
                  onClick={() => openModal(item)}
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

              <form onSubmit={handleSubmit(onSubmitReview)} className="space-y-4 text-xs" noValidate>
                {/* Star Rating */}
                <div>
                  <label className="font-bold text-[#8C7B6E] uppercase tracking-wider block mb-1.5">
                    Overall Rating <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setValue('overallRating', star, { shouldValidate: true, shouldDirty: true })}
                        className={`p-2 rounded-xl border-2 transition-all cursor-pointer ${
                          watchedRating >= star ? 'border-[#FF7A00] bg-[#FFF3E8] text-[#FF7A00]' : 'border-[#E8E4DE] text-[#B5A99A]'
                        }`}
                        aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                      >
                        <Star size={22} fill={watchedRating >= star ? '#FF7A00' : 'none'} />
                      </button>
                    ))}
                    {watchedRating > 0 && (
                      <motion.span
                        key={watchedRating}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-sm font-bold text-[#FF7A00] ml-2"
                      >
                        {RATING_LABELS[watchedRating]}
                      </motion.span>
                    )}
                  </div>
                </div>

                {/* Review Title */}
                <div>
                  <label htmlFor="reviewTitle" className="font-bold text-[#8C7B6E] uppercase tracking-wider block mb-1">
                    Review Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="reviewTitle"
                    type="text"
                    maxLength={100}
                    placeholder="e.g. Beautiful craft and fast shipping!"
                    {...register('reviewTitle')}
                    className={`w-full h-12 px-3 rounded-xl border-2 text-base outline-none transition-all duration-200 focus:ring-4 ${
                      errors.reviewTitle
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : touchedFields.reviewTitle && !errors.reviewTitle
                        ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
                        : 'border-[#E8E4DE] focus:border-[#FF7A00] focus:ring-[#FF7A00]/20'
                    }`}
                  />
                  <AnimatePresence mode="wait">
                    {errors.reviewTitle ? <FieldError key="e" message={errors.reviewTitle.message} /> : touchedFields.reviewTitle && !errors.reviewTitle ? (
                      <motion.p key="s" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1.5 text-sm text-green-600 mt-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Looks good!
                      </motion.p>
                    ) : null}
                  </AnimatePresence>
                </div>

                {/* Detailed Review */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="reviewText" className="font-bold text-[#8C7B6E] uppercase tracking-wider">
                      Detailed Review <span className="text-red-500">*</span>
                    </label>
                    <span className={`text-[11px] font-semibold ${watchedText.length > 900 ? 'text-red-500' : 'text-[#8C7B6E]'}`}>
                      {watchedText.length}/1000
                    </span>
                  </div>
                  <textarea
                    id="reviewText"
                    rows={4}
                    maxLength={1000}
                    placeholder="What did you like or dislike? Mention quality, packaging, material… (min 30 chars)"
                    {...register('reviewText')}
                    className={`w-full p-3 rounded-xl border-2 text-base outline-none transition-all duration-200 focus:ring-4 resize-none ${
                      errors.reviewText
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : touchedFields.reviewText && !errors.reviewText
                        ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
                        : 'border-[#E8E4DE] focus:border-[#FF7A00] focus:ring-[#FF7A00]/20'
                    }`}
                  />
                  <AnimatePresence mode="wait">
                    {errors.reviewText ? <FieldError key="e" message={errors.reviewText.message} /> : touchedFields.reviewText && !errors.reviewText ? (
                      <motion.p key="s" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1.5 text-sm text-green-600 mt-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Looks good!
                      </motion.p>
                    ) : null}
                  </AnimatePresence>
                </div>

                {/* Would Recommend */}
                <div>
                  <label className="font-bold text-[#8C7B6E] uppercase tracking-wider block mb-2">Would you recommend this to others?</label>
                  <div className="flex gap-3">
                    <button type="button"
                      onClick={() => setValue('wouldRecommend', true, { shouldValidate: true, shouldDirty: true })}
                      className={`flex-1 h-11 rounded-xl border-2 font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        watchedRecommend === true ? 'border-[#16A34A] bg-[#F0FDF4] text-[#16A34A]' : 'border-[#E8E4DE] text-[#8C7B6E] hover:border-[#16A34A]/40'
                      }`}>
                      <ThumbsUp size={16} /> Yes, definitely!
                    </button>
                    <button type="button"
                      onClick={() => setValue('wouldRecommend', false, { shouldValidate: true, shouldDirty: true })}
                      className={`flex-1 h-11 rounded-xl border-2 font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        watchedRecommend === false ? 'border-[#DC2626] bg-[#FEF2F2] text-[#DC2626]' : 'border-[#E8E4DE] text-[#8C7B6E] hover:border-[#DC2626]/40'
                      }`}>
                      <ThumbsDown size={16} /> No
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setModalProduct(null); reset(); }}
                    className="flex-1 h-12 rounded-xl border-2 border-[#E8E4DE] text-sm font-semibold text-[#4A3728] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className={`flex-1 h-12 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 active:scale-[0.98] transition-all ${
                      (!isValid || isSubmitting) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-95'
                    }`}
                  >
                    {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : 'Submit Review'}
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
