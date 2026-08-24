'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, ChevronRight, Award } from 'lucide-react'
import { useSuperAdminStore } from '@/lib/store/super-admin-store'
import { formatCurrency, formatNumber } from '@/lib/utils/formatters'
import { SkeletonBase } from '@/components/super-admin/shared/SkeletonBase'
import { cn } from '@/lib/utils'
import { getTopPerformingSellers } from '@/lib/store/selectors/dashboard.selectors'
import type { SASeller, SellerTier } from '@/types/super-admin.types'

const TIER_STYLES: Record<SellerTier, string> = {
  platinum: 'bg-gradient-to-r from-[#E5E4E2] via-white to-[#E5E4E2] text-[#4A4A5E] border-white/40 shadow-[0_0_10px_rgba(255,255,255,0.2)]',
  gold: 'bg-gradient-to-r from-[#F5C842] to-[#F59E0B] text-white border-[#F5C842]/40',
  silver: 'bg-gradient-to-r from-[#C0C0C0] to-[#A0A0A0] text-white border-[#C0C0C0]/40',
  bronze: 'bg-gradient-to-r from-[#CD7F32] to-[#8B4513] text-white border-[#CD7F32]/40',
}

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
}

const itemVariants: any = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
}

export function TopSellersWidget({ isLoading = false }: { isLoading?: boolean }) {
  const params = useParams()
  const saToken = params.saToken as string
  const storeState = useSuperAdminStore()
  
  // Need to pass the full state required by selector
  const topSellers = getTopPerformingSellers(storeState, 7)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-5 flex flex-col h-full relative"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-bold text-[#6B6B80] uppercase tracking-widest">Top Performing Sellers</h2>
        <Link
          href={`/${saToken}/sellers`}
          className="text-xs font-semibold text-[#FF7A00] hover:text-[#F5C842] flex items-center gap-1 transition-colors"
        >
          View All <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <SkeletonBase className="w-6 h-6 rounded shrink-0" />
              <SkeletonBase className="w-10 h-10 rounded-xl shrink-0" />
              <div className="flex-1 space-y-1.5">
                <SkeletonBase className="w-32 h-4" />
                <SkeletonBase className="w-24 h-3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div variants={listVariants} initial="hidden" animate="show" className="flex flex-col gap-2">
          {topSellers.map((seller, index) => (
            <motion.div variants={itemVariants} key={seller.id}>
              <Link
                href={`/${saToken}/sellers/${seller.id}`}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.03] transition-colors group"
              >
                {/* Rank Badge */}
                <div className={cn(
                  'w-6 h-6 rounded flex items-center justify-center text-xs font-black shrink-0',
                  index === 0 ? 'bg-[#FF7A00] text-white shadow-lg shadow-[#FF7A00]/20' : 'bg-[#1A1A26] text-[#6B6B80]'
                )}>
                  {index + 1}
                </div>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2A2A3E] to-[#1A1A26] flex items-center justify-center text-sm font-bold text-[#A0A0B8] shrink-0 border border-[#2A2A3E]">
                  {seller.displayName.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white truncate">{seller.displayName}</p>
                    <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded-full border uppercase tracking-widest flex items-center gap-0.5', TIER_STYLES[seller.tier])}>
                      {seller.tier === 'platinum' && <Award className="w-2.5 h-2.5" />}
                      {seller.tier}
                    </span>
                  </div>
                  <p className="text-xs text-[#8B8B9E] truncate mt-0.5">{seller.shopName}</p>
                </div>

                {/* Stats */}
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-white tabular-nums">{formatCurrency(seller.totalSales, true)}</p>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    {/* Simulated trend since not tracked historically per-seller yet */}
                    {index < 3 ? <TrendingUp className="w-3 h-3 text-[#22C55E]" /> : <Minus className="w-3 h-3 text-[#6B6B80]" />}
                    <span className="text-[10px] text-[#6B6B80] font-medium">{formatNumber(seller.totalOrders)} orders</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}
