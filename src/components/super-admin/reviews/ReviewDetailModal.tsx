'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Star, ShieldAlert, CheckCircle2, ShieldCheck, Clock, MonitorSmartphone, AlertTriangle, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SAReview } from '@/types/super-admin.types'

interface ReviewDetailModalProps {
  review: SAReview | null
  onClose: () => void
  onApprove: (id: string, note?: string) => void
  onReject: (id: string, note: string) => void
  onFlag: (id: string, reason: string) => void
  onClearFlag?: (id: string) => void
}

export function ReviewDetailModal({ review, onClose, onApprove, onReject, onFlag, onClearFlag }: ReviewDetailModalProps) {
  const [adminNote, setAdminNote] = useState(review?.adminNote || '')
  const [isRejecting, setIsRejecting] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  if (!review) return null

  const getSentimentColor = (label: string) => {
    switch(label) {
      case 'very_positive': return 'text-green-500 bg-green-500/10 border-green-500/20'
      case 'positive': return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'neutral': return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
      case 'negative': return 'text-orange-500 bg-orange-500/10 border-orange-500/20'
      case 'very_negative': return 'text-red-500 bg-red-500/10 border-red-500/20'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-5xl bg-[#111118] border border-[#1E1E2E] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E1E2E] shrink-0 bg-[#151520]">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Review Moderation
              {review.status === 'flagged' && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-500 border border-red-500/20">FLAGGED</span>}
              {review.status === 'pending_approval' && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-500 border border-orange-500/20">PENDING</span>}
              {review.status === 'approved' && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-500 border border-green-500/20">APPROVED</span>}
            </h2>
            <p className="text-xs text-[#8B8B9E] mt-1">Review ID: {review.id} • Posted by {review.customerName}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B6B80] hover:text-white hover:bg-[#1A1A26] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0">
          {/* Left Panel - Content */}
          <div className="flex-1 p-6 overflow-y-auto border-r border-[#1E1E2E]">
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={cn("w-5 h-5", i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-600")} />
              ))}
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">{review.title}</h3>
            <p className="text-[#D0D0E0] leading-relaxed mb-6 whitespace-pre-wrap">{review.body}</p>

            {review.images && review.images.length > 0 && (
              <div className="mb-8">
                <h4 className="text-xs font-bold text-[#8B8B9E] uppercase tracking-wider mb-3">Customer Images</h4>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {review.images.map((img, i) => (
                    <div key={i} className="w-32 h-32 rounded-xl border border-[#2A2A3E] overflow-hidden shrink-0 bg-[#1A1A26]">
                      <img src={img} alt="Review" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-[#1A1A26] rounded-xl border border-[#2A2A3E] p-5">
              <h4 className="text-xs font-bold text-[#8B8B9E] uppercase tracking-wider mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Seller Response
              </h4>
              {review.sellerReplyText ? (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-white text-sm">{review.sellerName}</span>
                    <span className="text-xs text-[#6B6B80]">replied on {new Date(review.sellerReplyAt || '').toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-[#A0A0B8]">{review.sellerReplyText}</p>
                </div>
              ) : (
                <p className="text-sm text-[#6B6B80] italic">No seller response yet.</p>
              )}
            </div>
          </div>

          {/* Right Panel - Context & Moderation */}
          <div className="w-full md:w-96 shrink-0 flex flex-col bg-[#111118] overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Flag Card */}
              {review.status === 'flagged' && (
                <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5">
                  <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Flagged for Review
                  </h4>
                  <p className="text-sm text-red-200/80 mb-3">
                    Flagged by <span className="font-medium text-red-200">{review.flaggedBy}</span> for <span className="font-medium text-red-200">{review.flagReason?.replace(/_/g, ' ')}</span>
                  </p>
                  {onClearFlag && (
                    <button onClick={() => onClearFlag(review.id)} className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold transition-colors">
                      Clear Flag
                    </button>
                  )}
                </div>
              )}

              {/* Product Context */}
              <div className="p-4 rounded-xl border border-[#2A2A3E] bg-[#151520] flex items-center gap-4">
                <img src={review.productImage} alt="" className="w-12 h-12 rounded-lg object-cover bg-[#1A1A26] border border-[#2A2A3E]" />
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">{review.productName}</h4>
                  <p className="text-xs text-[#8B8B9E] mt-1">by {review.sellerName}</p>
                </div>
              </div>

              {/* Authenticity Signals */}
              <div>
                <h4 className="text-xs font-bold text-[#8B8B9E] uppercase tracking-wider mb-3">Authenticity Signals</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    {review.verifiedPurchase ? <ShieldCheck className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /> : <ShieldAlert className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />}
                    <div>
                      <span className="text-sm font-medium text-white block">Verified Purchase</span>
                      <span className="text-xs text-[#6B6B80]">{review.verifiedPurchase ? 'Customer purchased this item' : 'No confirmed purchase history for this item'}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className={cn("w-5 h-5 shrink-0 mt-0.5", review.purchaseToReviewDays < 1 ? 'text-orange-500' : 'text-green-500')} />
                    <div>
                      <span className="text-sm font-medium text-white block">Purchase to Review: {review.purchaseToReviewDays} days</span>
                      {review.purchaseToReviewDays < 1 && <span className="text-xs text-orange-400 block">Reviewed same day as delivery — unusual</span>}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Star className={cn("w-5 h-5 shrink-0 mt-0.5", review.reviewVelocityFlag ? 'text-red-500' : 'text-green-500')} />
                    <div>
                      <span className="text-sm font-medium text-white block">Review Velocity</span>
                      <span className={cn("text-xs", review.reviewVelocityFlag ? 'text-red-400' : 'text-[#6B6B80]')}>
                        {review.reviewVelocityFlag ? '5+ reviews posted in 24 hours' : 'Normal activity pattern'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MonitorSmartphone className={cn("w-5 h-5 shrink-0 mt-0.5", review.sameDeviceFlag ? 'text-red-500' : 'text-green-500')} />
                    <div>
                      <span className="text-sm font-medium text-white block">Device Fingerprint</span>
                      <span className={cn("text-xs", review.sameDeviceFlag ? 'text-red-400' : 'text-[#6B6B80]')}>
                        {review.sameDeviceFlag ? 'Multiple reviews from same device detected' : 'Unique device signature'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sentiment */}
              <div>
                <h4 className="text-xs font-bold text-[#8B8B9E] uppercase tracking-wider mb-2">Sentiment Analysis</h4>
                <div className={cn("inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border capitalize", getSentimentColor(review.sentimentLabel))}>
                  {review.sentimentLabel.replace('_', ' ')} ({(review.sentimentScore > 0 ? '+' : '')}{review.sentimentScore.toFixed(2)})
                </div>
              </div>

              {/* Admin Note */}
              <div>
                <h4 className="text-xs font-bold text-[#8B8B9E] uppercase tracking-wider mb-2">Internal Note</h4>
                <textarea 
                  value={adminNote}
                  onChange={e => setAdminNote(e.target.value)}
                  placeholder="Add a private note about this moderation decision..."
                  className="w-full h-24 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl p-3 text-sm text-white placeholder:text-[#6B6B80] focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] resize-none"
                />
              </div>

            </div>

            {/* Actions */}
            <div className="p-6 border-t border-[#1E1E2E] bg-[#151520]">
              {(review.status === 'pending_approval' || review.status === 'flagged') ? (
                isRejecting ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={rejectReason}
                      onChange={e => setRejectReason(e.target.value)}
                      placeholder="Reason for rejection..."
                      className="w-full bg-[#1A1A26] border border-[#2A2A3E] rounded-lg px-3 py-2 text-sm text-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => setIsRejecting(false)} className="flex-1 py-2 rounded-xl text-xs font-bold text-[#A0A0B8] hover:bg-[#1A1A26] transition-colors">
                        Cancel
                      </button>
                      <button 
                        disabled={!rejectReason.trim()}
                        onClick={() => { onReject(review.id, rejectReason); onClose(); }} 
                        className="flex-1 py-2 rounded-xl bg-red-500 text-white text-xs font-bold disabled:opacity-50 hover:bg-red-600 transition-colors"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <button onClick={() => { onApprove(review.id, adminNote); onClose(); }} className="flex-1 py-2.5 rounded-xl bg-[#FF7A00] hover:bg-[#FF4500] text-white text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Approve & Publish
                    </button>
                    <button onClick={() => setIsRejecting(true)} className="px-4 py-2.5 rounded-xl bg-[#1A1A26] hover:bg-red-500/10 border border-[#2A2A3E] hover:border-red-500/30 text-red-400 text-sm font-bold transition-all flex items-center justify-center gap-2">
                      <X className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )
              ) : (
                <div className="text-center">
                  <p className="text-sm text-[#8B8B9E]">This review has been {review.status}.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
