'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, Flag, MessageSquare, Star, ShieldAlert, MonitorSmartphone, ShieldCheck } from 'lucide-react'
import { DataTable, Column } from '@/components/super-admin/shared/DataTable'
import { StatusBadge } from '@/components/super-admin/shared/StatusBadge'
import { useSAStore } from '@/lib/store/super-admin-store'
import { ReviewDetailModal } from '@/components/super-admin/reviews/ReviewDetailModal'
import { cn } from '@/lib/utils'
import type { SAReview } from '@/types/super-admin.types'

export default function ReviewsPage() {
  const { reviews, approveReview, rejectReview, bulkApproveReviews, bulkRejectReviews, flagReview, getSentimentBreakdown } = useSAStore()
  
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const reviewId = searchParams.get('reviewId')
    if (reviewId) {
      setSelectedReviewId(reviewId)
    }
  }, [searchParams])
  
  // Modals state
  const selectedReview = reviews.find(r => r.id === selectedReviewId) || null

  // Derived stats
  const pendingCount = reviews.filter(r => r.status === 'pending_approval').length
  const flaggedCount = reviews.filter(r => r.status === 'flagged').length
  
  // In a real app we'd filter by last 7d, here we just count totals for mock
  const approvedCount = reviews.filter(r => r.status === 'approved').length
  const rejectedCount = reviews.filter(r => r.status === 'rejected').length
  const sentiment = getSentimentBreakdown()

  const columns: Column<SAReview>[] = [
    {
      key: 'productName',
      header: 'Product',
      sortable: true,
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#1A1A26] border border-[#2A2A3E] shrink-0">
            <img src={r.productImage} alt="" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-medium text-white truncate max-w-[150px]">{r.productName}</p>
            <p className="text-xs text-[#6B6B80]">by {r.sellerName}</p>
          </div>
        </div>
      )
    },
    {
      key: 'customerName',
      header: 'Customer',
      sortable: true,
      render: (r) => (
        <div>
          <p className="text-sm font-medium text-white">{r.customerName}</p>
          <span className="text-[10px] font-bold text-[#FF7A00] uppercase tracking-wider">{r.customerTier}</span>
        </div>
      )
    },
    {
      key: 'rating',
      header: 'Rating',
      sortable: true,
      render: (r) => (
        <div className="flex items-center gap-1">
          <span className="font-bold text-white mr-1">{r.rating}</span>
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
        </div>
      )
    },
    {
      key: 'body',
      header: 'Review',
      render: (r) => (
        <div className="max-w-[200px]">
          <p className="text-xs font-bold text-[#A0A0B8] truncate">{r.title}</p>
          <p className="text-xs text-[#6B6B80] truncate">{r.body}</p>
        </div>
      )
    },
    {
      key: 'sentimentLabel',
      header: 'Sentiment',
      sortable: true,
      render: (r) => {
        let color = 'text-gray-400 bg-gray-400/10 border-gray-400/20'
        if (r.sentimentLabel === 'very_positive') color = 'text-green-500 bg-green-500/10 border-green-500/20'
        else if (r.sentimentLabel === 'positive') color = 'text-green-400 bg-green-400/10 border-green-400/20'
        else if (r.sentimentLabel === 'negative') color = 'text-orange-500 bg-orange-500/10 border-orange-500/20'
        else if (r.sentimentLabel === 'very_negative') color = 'text-red-500 bg-red-500/10 border-red-500/20'
        return (
          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border", color)}>
            {r.sentimentLabel.replace('_', ' ')}
          </span>
        )
      }
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (r) => (
        <StatusBadge 
          variant={
            r.status === 'pending_approval' ? 'warning' :
            r.status === 'flagged' ? 'error' :
            r.status === 'approved' ? 'success' : 'neutral'
          }
          status={r.status.replace('_', ' ')}
        />
      )
    },
    {
      key: 'createdAt',
      header: 'Date',
      sortable: true,
      render: (r) => (
        <span className="text-xs text-[#A0A0B8]">{new Date(r.createdAt).toLocaleDateString()}</span>
      )
    }
  ]

  const bulkActions = [
    {
      label: 'Approve Selected',
      icon: CheckCircle2,
      onClick: async (rows: SAReview[]) => { await bulkApproveReviews(rows.map(r => r.id)) },
      variant: 'default' as const
    },
    {
      label: 'Reject Selected',
      icon: XCircle,
      onClick: async (rows: SAReview[]) => { await bulkRejectReviews(rows.map(r => r.id)) },
      variant: 'danger' as const
    }
  ]


  const totalReviews = reviews.length
  
  return (
    <div className="h-full flex flex-col min-h-0 bg-[#0B0B12]">
      {/* Page Header */}
      <div className="shrink-0 p-6 border-b border-[#1E1E2E] bg-[#111118] flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Reviews Moderation</h1>
            <p className="text-[#8B8B9E] text-sm">Review, approve, and moderate customer product reviews.</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-[#1A1A26] rounded-xl p-4 border border-[#2A2A3E]">
            <p className="text-xs text-[#8B8B9E] font-medium mb-1">Total Reviews</p>
            <p className="text-2xl font-bold text-white">{totalReviews}</p>
          </div>
          <div className="bg-[#1A1A26] rounded-xl p-4 border border-[#2A2A3E]">
            <p className="text-xs text-orange-400 font-medium mb-1">Pending Approval</p>
            <p className="text-2xl font-bold text-white">{pendingCount}</p>
          </div>
          <div className="bg-[#1A1A26] rounded-xl p-4 border border-red-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10"><Flag className="w-10 h-10 text-red-500" /></div>
            <p className="text-xs text-red-400 font-medium mb-1">Flagged for Review</p>
            <p className="text-2xl font-bold text-red-400">{flaggedCount}</p>
          </div>
          <div className="bg-[#1A1A26] rounded-xl p-4 border border-[#2A2A3E]">
            <p className="text-xs text-green-400 font-medium mb-1">Approved</p>
            <p className="text-2xl font-bold text-white">{approvedCount}</p>
          </div>
          <div className="bg-[#1A1A26] rounded-xl p-4 border border-[#2A2A3E]">
            <p className="text-xs text-[#8B8B9E] font-medium mb-1">Rejected</p>
            <p className="text-2xl font-bold text-white">{rejectedCount}</p>
          </div>
        </div>
        
        {/* Sentiment Analysis Bar */}
        <div className="bg-[#1A1A26] border border-[#2A2A3E] rounded-xl p-4">
          <h3 className="text-xs font-bold text-[#8B8B9E] uppercase tracking-wider mb-3">Overall Sentiment Breakdown</h3>
          <div className="flex h-3 rounded-full overflow-hidden mb-3 bg-[#111118]">
            <div style={{ width: `${(sentiment.very_positive / totalReviews) * 100}%` }} className="bg-green-500" title={`Very Positive: ${sentiment.very_positive}`}></div>
            <div style={{ width: `${(sentiment.positive / totalReviews) * 100}%` }} className="bg-green-400" title={`Positive: ${sentiment.positive}`}></div>
            <div style={{ width: `${(sentiment.neutral / totalReviews) * 100}%` }} className="bg-gray-400" title={`Neutral: ${sentiment.neutral}`}></div>
            <div style={{ width: `${(sentiment.negative / totalReviews) * 100}%` }} className="bg-orange-500" title={`Negative: ${sentiment.negative}`}></div>
            <div style={{ width: `${(sentiment.very_negative / totalReviews) * 100}%` }} className="bg-red-500" title={`Very Negative: ${sentiment.very_negative}`}></div>
          </div>
          <div className="flex justify-between text-[10px] text-[#6B6B80] font-medium px-1 uppercase">
            <span>Very Positive ({(sentiment.very_positive / totalReviews * 100).toFixed(0)}%)</span>
            <span>Positive ({(sentiment.positive / totalReviews * 100).toFixed(0)}%)</span>
            <span>Neutral ({(sentiment.neutral / totalReviews * 100).toFixed(0)}%)</span>
            <span>Negative ({(sentiment.negative / totalReviews * 100).toFixed(0)}%)</span>
            <span>Very Negative ({(sentiment.very_negative / totalReviews * 100).toFixed(0)}%)</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden p-6 min-h-0">
        <DataTable
          data={reviews}
          columns={columns}
          searchPlaceholder="Search reviews by product, customer, or keywords..."
          searchKeys={['productName', 'customerName', 'title', 'body', 'sellerName']}
          onRowClick={(r) => setSelectedReviewId(r.id)}
          bulkActions={bulkActions}
          keyExtractor={(r) => r.id}
        />
      </div>

      <AnimatePresence>
        {selectedReviewId && (
          <ReviewDetailModal
            review={selectedReview}
            onClose={() => setSelectedReviewId(null)}
            onApprove={(id, note) => approveReview(id, note)}
            onReject={(id, note) => rejectReview(id, note)}
            onFlag={(id, reason) => flagReview(id, reason as any)}
            onClearFlag={(id) => approveReview(id, 'Cleared flag')}
          />
        )}
      </AnimatePresence>
    </div>
  )
}