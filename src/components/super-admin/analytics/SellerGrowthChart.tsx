'use client'
import React from 'react'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { AlertTriangle } from 'lucide-react'
import type { SASellerGrowthPoint, SAProductHealthMetrics } from '@/lib/mock/sa-analytics.mock'

interface SellerGrowthChartProps {
  data: SASellerGrowthPoint[]
}

interface ProductHealthCardProps {
  health: SAProductHealthMetrics
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#111118] border border-[#2A2A3E] rounded-xl p-3 shadow-2xl">
      <p className="text-xs text-[#8B8B9E] mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex justify-between gap-4 text-xs mb-1">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="text-white font-bold">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export function SellerGrowthChart({ data }: SellerGrowthChartProps) {
  return (
    <div className="bg-[#0A0A12] border border-[#1E1E2E] rounded-2xl p-5 h-full">
      <div className="mb-5">
        <h3 className="text-base font-bold text-white">Seller Growth</h3>
        <p className="text-xs text-[#6B6B80]">12-month view — new, approved & cumulative active</p>
      </div>
      {!data || data.length === 0 ? (
        <div className="w-full h-[260px] flex items-center justify-center text-[#6B6B80] text-sm">
          No seller data available.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1A1A26" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#6B6B80', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fill: '#6B6B80', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: '#6B6B80', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#8B8B9E' }} />
            <Bar yAxisId="left" dataKey="newSellers" name="New Sellers" fill="#FF7A0066" radius={[3, 3, 0, 0]} />
            <Bar yAxisId="left" dataKey="approvedSellers" name="Approved" fill="#22C55E66" radius={[3, 3, 0, 0]} />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cumulativeActive"
              name="Cumulative Active"
              stroke="#F5C842"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export function ProductHealthCard({ health }: ProductHealthCardProps) {
  const maxGmvShare = Math.max(...health.topCategories.map(c => c.gmvShare))
  return (
    <div className="bg-[#0A0A12] border border-[#1E1E2E] rounded-2xl p-5 h-full flex flex-col gap-5">
      <div>
        <h3 className="text-base font-bold text-white">Product Health</h3>
        <p className="text-xs text-[#6B6B80]">{health.totalProducts.toLocaleString()} total products</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#111118] rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-[#22C55E]">{health.approvalRate}%</div>
          <div className="text-[10px] text-[#6B6B80] uppercase tracking-wide mt-0.5">Approval Rate</div>
          <div className="mt-2 h-1.5 bg-[#1E1E2E] rounded-full overflow-hidden">
            <div className="h-full bg-[#22C55E] rounded-full" style={{ width: `${health.approvalRate}%` }} />
          </div>
        </div>
        <div className="bg-[#111118] rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-[#3B82F6]">{health.avgCompletenessScore}%</div>
          <div className="text-[10px] text-[#6B6B80] uppercase tracking-wide mt-0.5">Avg Score</div>
          <div className="mt-2 h-1.5 bg-[#1E1E2E] rounded-full overflow-hidden">
            <div className="h-full bg-[#3B82F6] rounded-full" style={{ width: `${health.avgCompletenessScore}%` }} />
          </div>
        </div>
        <div className="bg-[#111118] rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-[#F59E0B]">{health.avgTimeToApproval}h</div>
          <div className="text-[10px] text-[#6B6B80] uppercase tracking-wide mt-0.5">Avg Approval</div>
          <div className="text-[10px] text-[#4A4A5E] mt-1">time</div>
        </div>
      </div>

      {/* Top Categories */}
      <div>
        <p className="text-[11px] font-bold text-[#8B8B9E] uppercase tracking-wider mb-2">Top Categories</p>
        <div className="space-y-2">
          {health.topCategories.map(cat => (
            <div key={cat.category}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#A0A0B8]">{cat.category}</span>
                <span className="text-[#FF9A40] font-bold">{cat.gmvShare}%</span>
              </div>
              <div className="h-1.5 bg-[#1E1E2E] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FF7A00] to-[#F5C842]"
                  style={{ width: `${(cat.gmvShare / maxGmvShare) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zero-sale alert */}
      <div className="flex items-start gap-2.5 p-3 bg-[#F59E0B]/8 border border-[#F59E0B]/20 rounded-xl">
        <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-[#F59E0B]">
            {health.zeroSaleProducts} products have 0 sales in 90 days
          </p>
          <p className="text-[11px] text-[#A0A0B8] mt-0.5">
            Consider seller outreach prompts or promotional placement
          </p>
        </div>
      </div>
    </div>
  )
}
