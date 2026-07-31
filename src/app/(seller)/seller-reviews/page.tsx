'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Clock, CheckCircle2, ChevronDown, Package } from 'lucide-react';
import { useSellerStore, SellerReview } from '@/lib/store/seller-store';
import { toast } from 'sonner';

export default function SellerReviewsPage() {
  const { reviews, respondToReview } = useSellerStore();
  const [filter, setFilter] = useState<'all' | 'unanswered' | 'answered'>('all');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = [...reviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (filter === 'unanswered') list = list.filter(r => !r.sellerResponse);
    if (filter === 'answered') list = list.filter(r => !!r.sellerResponse);
    return list;
  }, [reviews, filter]);

  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const unansweredCount = reviews.filter(r => !r.sellerResponse).length;

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#1A1A1A]">Customer Reviews</h1>
          <p className="text-sm text-[#9B8F84]">{reviews.length} total reviews · {avgRating.toFixed(1)} average</p>
        </div>
      </div>

      <div className="flex gap-1.5 pb-2">
        {(['all', 'unanswered', 'answered'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
              filter === f ? 'bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white shadow-md' : 'bg-white border border-[#F0EDE8] text-[#4A4540] hover:text-[#FF7A00]'
            }`}
          >
            {f === 'unanswered' ? `Unanswered (${unansweredCount})` : f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#F0EDE8] p-12 text-center">
            <Star size={40} className="text-[#D4C9BF] mx-auto mb-3" />
            <p className="text-base font-bold text-[#1A1A1A]">No reviews yet</p>
          </div>
        ) : filtered.map(review => (
          <div key={review.id} className="bg-white rounded-2xl border border-[#F0EDE8] p-5">
            <div className="flex justify-between items-start mb-3">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FFF7ED] flex items-center justify-center text-[#FF7A00] font-bold">
                  {review.customerName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1A1A1A]">{review.customerName}</p>
                  <p className="text-xs text-[#9B8F84]">{new Date(review.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={14} className={i <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-100 text-gray-200'} />
                ))}
              </div>
            </div>

            <div className="mb-3 bg-[#FAFAF8] rounded-xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#F0EDE8] flex items-center justify-center text-[#9B8F84]"><Package size={14}/></div>
              <p className="text-sm font-bold text-[#1A1A1A]">{review.productName}</p>
            </div>

            <h3 className="text-sm font-bold text-[#1A1A1A] mb-1">{review.title}</h3>
            <p className="text-sm text-[#4A4540] mb-4">{review.body}</p>

            {review.sellerResponse ? (
              <div className="bg-[#FFF7ED] border border-orange-100 rounded-xl p-4 ml-8 relative before:content-[''] before:absolute before:w-6 before:h-6 before:border-l-2 before:border-b-2 before:border-orange-200 before:rounded-bl-xl before:-left-6 before:top-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#FF7A00] to-[#FF4500] text-white flex items-center justify-center text-[9px] font-bold">BB</div>
                  <p className="text-xs font-bold text-[#1A1A1A]">Your Response</p>
                  <span className="text-[10px] text-[#9B8F84]">{new Date(review.sellerResponseAt!).toLocaleDateString('en-IN')}</span>
                </div>
                <p className="text-sm text-[#4A4540]">{review.sellerResponse}</p>
              </div>
            ) : replyingTo === review.id ? (
              <div className="ml-8">
                <textarea
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type your response to the customer..."
                  className="w-full border border-[#F0EDE8] rounded-xl p-3 text-sm outline-none focus:border-[#FF7A00] mb-2"
                  rows={3}
                />
                <div className="flex gap-2">
                  <button onClick={() => { respondToReview(review.id, replyText); setReplyingTo(null); toast.success('Response sent'); }} className="px-4 py-2 bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-xs font-bold rounded-xl">Send Response</button>
                  <button onClick={() => setReplyingTo(null)} className="px-4 py-2 border border-[#F0EDE8] text-[#4A4540] text-xs font-bold rounded-xl hover:bg-[#FAFAF8]">Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => { setReplyingTo(review.id); setReplyText(''); }} className="flex items-center gap-1.5 text-xs font-bold text-[#FF7A00] hover:bg-[#FFF7ED] px-3 py-1.5 rounded-lg transition-all ml-8">
                <MessageSquare size={13} /> Reply to Review
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
