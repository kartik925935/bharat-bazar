'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShieldAlert, Tag, Image as ImageIcon, History, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StatusBadge } from '@/components/super-admin/shared/StatusBadge'
import { CompletenessScore } from '@/components/super-admin/products/CompletenessScore'
import { ImageComplianceChecklist } from '@/components/super-admin/products/ImageComplianceChecklist'
import { formatCurrency, formatRelativeTime } from '@/lib/utils/formatters'
import type { SAProductDetail } from '@/types/super-admin.types'

interface ProductReviewModalProps {
  product: SAProductDetail | null
  onClose: () => void
  onApprove: (id: string) => void
  onReject: (id: string, reason: string) => void
  onUpdateStatus?: (id: string, status: SAProductDetail['status']) => void
}

export function ProductReviewModal({ product, onClose, onApprove, onReject, onUpdateStatus }: ProductReviewModalProps) {
  const [rejectReason, setRejectReason] = useState('')
  const [isRejecting, setIsRejecting] = useState(false)
  const [tab, setTab] = useState<'details' | 'history'>('details')

  const [mainImage, setMainImage] = useState<string>('')

  React.useEffect(() => {
    if (product?.images && product.images.length > 0) {
      setMainImage(product.images[0])
    }
  }, [product])

  if (!product) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-[#0D0D14] border border-[#1E1E2E] rounded-2xl flex flex-col shadow-2xl z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="shrink-0 p-5 border-b border-[#1E1E2E] flex items-start gap-4 bg-[#111118]">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-white truncate">{product.name}</h2>
                <StatusBadge 
                  status={product.status} 
                  variant={product.status === 'published' ? 'success' : product.status === 'rejected' ? 'error' : 'warning'} 
                />
              </div>
              <p className="text-xs text-[#8B8B9E] truncate">
                by <span className="font-medium text-white">{product.sellerName}</span> • SKU: {product.sku} • {product.category}
              </p>
              {product.productBadges && product.productBadges.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {product.productBadges.map(badge => (
                    <span key={badge} className="px-2 py-0.5 rounded-full text-[10px] font-bold border border-[#FF7A00]/30 bg-[#FF7A00]/10 text-[#FF7A00]">
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B6B80] hover:text-white hover:bg-[#1A1A26] transition-colors shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
            {/* Left Column - Main Details */}
            <div className="flex-1 overflow-y-auto p-5 border-r border-[#1E1E2E]">
              {/* Product Images */}
              <div className="mb-6">
                <div className="w-full h-64 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl flex items-center justify-center overflow-hidden mb-3">
                  {mainImage ? (
                    <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-[#6B6B80]">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-medium">No Images Provided</p>
                    </div>
                  )}
                </div>
                {product.images && product.images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {product.images.map((img, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => setMainImage(img)}
                        className={cn(
                          "w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all",
                          mainImage === img ? "border-[#FF7A00]" : "border-transparent opacity-50 hover:opacity-100"
                        )}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {product.shortDescription && (
                  <div>
                    <h3 className="text-xs font-bold text-[#8B8B9E] uppercase tracking-wider mb-2">Short Description</h3>
                    <p className="text-sm text-white font-medium">{product.shortDescription}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-xs font-bold text-[#8B8B9E] uppercase tracking-wider mb-2">Description</h3>
                  <p className="text-sm text-[#D0D0E0] leading-relaxed">{product.description}</p>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-[#8B8B9E] uppercase tracking-wider mb-2">Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(product.specifications || {}).map(([key, val]) => (
                      <div key={key} className="bg-[#1A1A26] border border-[#2A2A3E] p-3 rounded-xl">
                        <span className="text-[10px] text-[#6B6B80] uppercase tracking-wider block mb-0.5">{key}</span>
                        <span className="text-sm font-medium text-white">{String(val)}</span>
                      </div>
                    ))}
                    
                    {/* Add extra fields from seller portal */}
                    {product.gstSlab && (
                      <div className="bg-[#1A1A26] border border-[#2A2A3E] p-3 rounded-xl">
                        <span className="text-[10px] text-[#6B6B80] uppercase tracking-wider block mb-0.5">GST Slab</span>
                        <span className="text-sm font-medium text-white">{product.gstSlab}</span>
                      </div>
                    )}
                    <div className="bg-[#1A1A26] border border-[#2A2A3E] p-3 rounded-xl">
                      <span className="text-[10px] text-[#6B6B80] uppercase tracking-wider block mb-0.5">Stock</span>
                      <span className="text-sm font-medium text-white">{product.stock} Units</span>
                    </div>
                    {product.weight && (
                      <div className="bg-[#1A1A26] border border-[#2A2A3E] p-3 rounded-xl">
                        <span className="text-[10px] text-[#6B6B80] uppercase tracking-wider block mb-0.5">Weight / Volume</span>
                        <span className="text-sm font-medium text-white">{product.weight}</span>
                      </div>
                    )}
                    {product.processingTime && (
                      <div className="bg-[#1A1A26] border border-[#2A2A3E] p-3 rounded-xl">
                        <span className="text-[10px] text-[#6B6B80] uppercase tracking-wider block mb-0.5">Processing Time</span>
                        <span className="text-sm font-medium text-white">{product.processingTime}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Review & Actions */}
            <div className="w-full md:w-80 shrink-0 bg-[#111118] overflow-y-auto p-5 flex flex-col">
              
              <div className="space-y-6 flex-1">
                {/* Pricing Analysis */}
                <div className={cn(
                  "p-4 rounded-xl border",
                  product.priceAnomalyFlag ? "bg-red-500/5 border-red-500/20" : "bg-[#1A1A26] border-[#2A2A3E]"
                )}>
                  <h3 className="text-xs font-bold text-[#8B8B9E] uppercase tracking-wider mb-3">Pricing Analysis</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#A0A0B8]">Selling Price</span>
                      <span className="text-lg font-black text-white">{formatCurrency(product.price)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#A0A0B8]">MRP</span>
                      <span className="text-sm font-medium text-[#6B6B80] line-through">{formatCurrency(product.mrp)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#A0A0B8]">Discount</span>
                      <span className="text-sm font-bold text-[#FF7A00]">{product.discount}% OFF</span>
                    </div>
                  </div>

                  {product.priceAnomalyFlag && (
                    <div className="mt-4 pt-3 border-t border-red-500/20 flex gap-2 text-xs text-red-400">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <p>High discount detected. Verify pricing authenticity.</p>
                    </div>
                  )}
                </div>

                <CompletenessScore score={product.completenessScore} flags={product.qualityFlags} />
                <ImageComplianceChecklist flags={product.qualityFlags} />
              </div>

              {/* Action Area */}
              <div className="mt-8 space-y-3 pt-5 border-t border-[#1E1E2E]">
                {(product.status === 'pending_review' || product.status === 'draft') && (
                  isRejecting ? (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3">
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Provide reason for rejection..."
                        className="w-full h-24 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl p-3 text-sm text-white placeholder:text-[#6B6B80] focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-none"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => setIsRejecting(false)} className="flex-1 py-2 rounded-xl text-xs font-bold text-[#A0A0B8] hover:bg-[#1A1A26] transition-colors">
                          Cancel
                        </button>
                        <button 
                          onClick={() => onReject(product.id, rejectReason)}
                          disabled={!rejectReason.trim()}
                          className="flex-1 py-2 rounded-xl bg-red-500 text-white text-xs font-bold disabled:opacity-50 transition-colors hover:bg-red-600"
                        >
                          Confirm Rejection
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <>
                      <button 
                        onClick={() => onApprove(product.id)}
                        className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold transition-all shadow-lg shadow-green-500/20"
                      >
                        Approve & Publish
                      </button>
                      <button 
                        onClick={() => setIsRejecting(true)}
                        className="w-full py-3 rounded-xl bg-[#1A1A26] border border-[#2A2A3E] text-red-400 font-bold hover:bg-red-500/10 transition-colors"
                      >
                        Reject Listing
                      </button>
                    </>
                  )
                )}

                {product.status === 'published' && onUpdateStatus && (
                  <button 
                    onClick={() => onUpdateStatus(product.id, 'suspended')}
                    className="w-full py-3 rounded-xl bg-[#1A1A26] border border-[#2A2A3E] text-amber-500 font-bold hover:bg-amber-500/10 transition-colors"
                  >
                    Revoke / Suspend
                  </button>
                )}

                {(product.status === 'rejected' || product.status === 'suspended') && onUpdateStatus && (
                  <button 
                    onClick={() => onUpdateStatus(product.id, 'published')}
                    className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold transition-all shadow-lg shadow-green-500/20"
                  >
                    Publish Product
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
