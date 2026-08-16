'use client'
import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import type { SACohortRow } from '@/lib/mock/sa-analytics.mock'

interface CohortChartProps {
  data: SACohortRow[]
}

function retentionColor(val: number | null): string {
  if (val === null) return '#111118'
  if (val >= 80) return '#14532D'
  if (val >= 65) return '#166534'
  if (val >= 50) return '#15803D'
  if (val >= 35) return '#B45309'
  if (val >= 20) return '#7F1D1D'
  return '#450A0A'
}

function retentionTextColor(val: number | null): string {
  if (val === null) return '#3A3A50'
  if (val >= 50) return '#86EFAC'
  if (val >= 35) return '#FCD34D'
  return '#FCA5A5'
}

const MONTHS = ['M+0', 'M+1', 'M+2', 'M+3', 'M+4', 'M+5']
const MONTH_KEYS = ['month0', 'month1', 'month2', 'month3', 'month4', 'month5'] as const

export function CohortChart({ data }: CohortChartProps) {
  const [tooltip, setTooltip] = useState<{ cohort: string; month: number; val: number | null; customers: number } | null>(null)

  return (
    <div className="bg-[#0A0A12] border border-[#1E1E2E] rounded-2xl p-5">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-white">Customer Cohort Retention</h3>
          <p className="text-xs text-[#6B6B80]">Heat-mapped retention by cohort month</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-[#6B6B80]">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-[#166534]" /> High
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-[#B45309]" /> Medium
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-[#7F1D1D]" /> Low
          </span>
        </div>
      </div>

      <div className="overflow-x-auto -mx-2 px-2">
        <div className="min-w-[480px]">
          {/* Header */}
          <div className="grid gap-1 mb-1" style={{ gridTemplateColumns: '120px 80px repeat(6, 1fr)' }}>
            <div className="text-[10px] font-bold text-[#6B6B80] uppercase px-2">Cohort</div>
            <div className="text-[10px] font-bold text-[#6B6B80] uppercase text-center">Users</div>
            {MONTHS.map(m => (
              <div key={m} className="text-[10px] font-bold text-[#6B6B80] uppercase text-center">{m}</div>
            ))}
          </div>

          {/* Rows */}
          {data.map((row) => (
            <div
              key={row.cohortMonth}
              className="grid gap-1 mb-1"
              style={{ gridTemplateColumns: '120px 80px repeat(6, 1fr)' }}
            >
              <div className="flex items-center px-2 text-xs text-[#A0A0B8] font-medium">{row.cohortMonth}</div>
              <div className="flex items-center justify-center text-xs text-[#6B6B80] font-mono">{row.totalCustomers}</div>
              {MONTH_KEYS.map((key, i) => {
                const val = row.retention[key]
                const customers = val !== null ? Math.round((val / 100) * row.totalCustomers) : null
                return (
                  <div
                    key={key}
                    className="relative flex items-center justify-center h-9 rounded-lg cursor-default transition-all hover:scale-105"
                    style={{ backgroundColor: retentionColor(val) }}
                    onMouseEnter={() => setTooltip({ cohort: row.cohortMonth, month: i, val, customers: customers ?? 0 })}
                    onMouseLeave={() => setTooltip(null)}
                  >
                    <span
                      className="text-xs font-bold"
                      style={{ color: retentionTextColor(val) }}
                    >
                      {val !== null ? `${val}%` : '—'}
                    </span>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && tooltip.val !== null && (
        <div className="mt-3 p-2.5 bg-[#111118] border border-[#2A2A3E] rounded-xl text-xs text-[#A0A0B8] inline-block">
          <strong className="text-white">{tooltip.cohort}</strong> cohort —{' '}
          <strong style={{ color: retentionTextColor(tooltip.val) }}>{tooltip.val}%</strong> still active in Month {tooltip.month}{' '}
          ({tooltip.customers.toLocaleString()} customers)
        </div>
      )}

      <p className="text-[11px] text-[#4A4A5E] mt-4">
        Retention = % of cohort customers who placed at least one order in that month. "—" = data not yet available.
      </p>
    </div>
  )
}
