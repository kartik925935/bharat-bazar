'use client'
import React, { useMemo, useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SAGeographicDataPoint } from '@/lib/mock/sa-analytics.mock'

type Metric = 'orders' | 'gmv' | 'activeSellers' | 'activeCustomers'

interface GeographicBreakdownProps {
  data: SAGeographicDataPoint[]
  metric: Metric
  onMetricChange: (m: Metric) => void
}

const METRIC_LABELS: Record<Metric, string> = {
  orders: 'Orders',
  gmv: 'GMV',
  activeSellers: 'Active Sellers',
  activeCustomers: 'Active Customers',
}

const formatVal = (val: number, metric: Metric) => {
  if (metric === 'gmv') {
    if (val >= 1000000) return `₹${(val / 100000).toFixed(1)}L`
    return `₹${(val / 1000).toFixed(0)}K`
  }
  return val.toLocaleString()
}

// Static SVG India map placeholder — top 5 states highlighted
// TODO: Replace with interactive choropleth map (react-simple-maps + GeoJSON)
function IndiaMapSVG({ top5 }: { top5: SAGeographicDataPoint[] }) {
  const top5Codes = new Set(top5.map(s => s.stateCode))
  return (
    <div className="relative flex flex-col items-center">
      <div className="text-[10px] text-[#4A4A5E] mb-2">
        {/* TODO: Replace with interactive choropleth map (react-simple-maps + GeoJSON) */}
        Static placeholder — interactive map coming soon
      </div>
      <svg viewBox="0 0 300 340" className="w-full max-w-[260px] opacity-90">
        {/* Simplified India outline */}
        <path d="M130,20 L175,18 L200,35 L220,60 L230,90 L225,120 L240,150 L250,180 L245,210 L230,240 L210,265 L195,285 L175,300 L160,315 L148,325 L140,320 L128,308 L115,295 L100,275 L85,255 L75,230 L70,205 L65,180 L68,155 L75,130 L72,105 L80,80 L90,55 L105,35 Z"
          fill="#1A1A2E" stroke="#2A2A3E" strokeWidth="1.5" />
        {/* Northeast */}
        <path d="M230,90 L250,82 L270,88 L275,105 L265,120 L245,115 L230,120 Z"
          fill="#1A1A2E" stroke="#2A2A3E" strokeWidth="1.5" />

        {/* State regions highlighted */}
        {/* MH - Maharashtra */}
        <ellipse cx="110" cy="180" rx="32" ry="22" fill={top5Codes.has('MH') ? '#FF7A0055' : '#0E0E1A'} stroke={top5Codes.has('MH') ? '#FF7A00' : '#2A2A3E'} strokeWidth="1" />
        <text x="110" y="185" textAnchor="middle" fill={top5Codes.has('MH') ? '#FF9A40' : '#4A4A5E'} fontSize="9" fontWeight="bold">MH</text>

        {/* DL - Delhi */}
        <circle cx="142" cy="82" r="10" fill={top5Codes.has('DL') ? '#FF7A0055' : '#0E0E1A'} stroke={top5Codes.has('DL') ? '#FF7A00' : '#2A2A3E'} strokeWidth="1" />
        <text x="142" y="86" textAnchor="middle" fill={top5Codes.has('DL') ? '#FF9A40' : '#4A4A5E'} fontSize="8" fontWeight="bold">DL</text>

        {/* KA - Karnataka */}
        <ellipse cx="110" cy="230" rx="25" ry="18" fill={top5Codes.has('KA') ? '#FF7A0055' : '#0E0E1A'} stroke={top5Codes.has('KA') ? '#FF7A00' : '#2A2A3E'} strokeWidth="1" />
        <text x="110" y="234" textAnchor="middle" fill={top5Codes.has('KA') ? '#FF9A40' : '#4A4A5E'} fontSize="9" fontWeight="bold">KA</text>

        {/* TN - Tamil Nadu */}
        <ellipse cx="130" cy="275" rx="22" ry="18" fill={top5Codes.has('TN') ? '#FF7A0055' : '#0E0E1A'} stroke={top5Codes.has('TN') ? '#FF7A00' : '#2A2A3E'} strokeWidth="1" />
        <text x="130" y="279" textAnchor="middle" fill={top5Codes.has('TN') ? '#FF9A40' : '#4A4A5E'} fontSize="9" fontWeight="bold">TN</text>

        {/* UP - Uttar Pradesh */}
        <ellipse cx="155" cy="105" rx="30" ry="20" fill={top5Codes.has('UP') ? '#FF7A0055' : '#0E0E1A'} stroke={top5Codes.has('UP') ? '#FF7A00' : '#2A2A3E'} strokeWidth="1" />
        <text x="155" y="109" textAnchor="middle" fill={top5Codes.has('UP') ? '#FF9A40' : '#4A4A5E'} fontSize="9" fontWeight="bold">UP</text>

        {/* WB - West Bengal */}
        <ellipse cx="200" cy="145" rx="18" ry="25" fill={top5Codes.has('WB') ? '#FF7A0044' : '#0E0E1A'} stroke={top5Codes.has('WB') ? '#FF7A00' : '#2A2A3E'} strokeWidth="1" />
        <text x="200" y="149" textAnchor="middle" fill={top5Codes.has('WB') ? '#FF9A40' : '#4A4A5E'} fontSize="8" fontWeight="bold">WB</text>

        {/* RJ - Rajasthan */}
        <ellipse cx="95" cy="115" rx="28" ry="30" fill={top5Codes.has('RJ') ? '#FF7A0044' : '#0E0E1A'} stroke={top5Codes.has('RJ') ? '#FF7A00' : '#2A2A3E'} strokeWidth="1" />
        <text x="95" y="119" textAnchor="middle" fill={top5Codes.has('RJ') ? '#FF9A40' : '#4A4A5E'} fontSize="8" fontWeight="bold">RJ</text>

        {/* GJ - Gujarat */}
        <ellipse cx="75" cy="160" rx="22" ry="28" fill={top5Codes.has('GJ') ? '#FF7A0044' : '#0E0E1A'} stroke={top5Codes.has('GJ') ? '#FF7A00' : '#2A2A3E'} strokeWidth="1" />
        <text x="75" y="164" textAnchor="middle" fill={top5Codes.has('GJ') ? '#FF9A40' : '#4A4A5E'} fontSize="8" fontWeight="bold">GJ</text>

        {/* KL - Kerala */}
        <ellipse cx="95" cy="282" rx="14" ry="22" fill={top5Codes.has('KL') ? '#FF7A0044' : '#0E0E1A'} stroke={top5Codes.has('KL') ? '#FF7A00' : '#2A2A3E'} strokeWidth="1" />
        <text x="95" y="286" textAnchor="middle" fill={top5Codes.has('KL') ? '#FF9A40' : '#4A4A5E'} fontSize="8" fontWeight="bold">KL</text>

        {/* Legend */}
        <rect x="15" y="305" width="10" height="10" fill="#FF7A0055" stroke="#FF7A00" strokeWidth="1" rx="2" />
        <text x="30" y="314" fill="#FF7A00" fontSize="8" fontWeight="bold">Top 5 States</text>
        <rect x="15" y="320" width="10" height="10" fill="#0E0E1A" stroke="#2A2A3E" strokeWidth="1" rx="2" />
        <text x="30" y="329" fill="#4A4A5E" fontSize="8">Other States</text>
      </svg>
    </div>
  )
}

export function GeographicBreakdown({ data, metric, onMetricChange }: GeographicBreakdownProps) {
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const sorted = useMemo(() =>
    [...data].sort((a, b) => sortDir === 'desc' ? b[metric] - a[metric] : a[metric] - b[metric]),
    [data, metric, sortDir]
  )
  const top5 = [...data].sort((a, b) => b.gmv - a.gmv).slice(0, 5)

  return (
    <div className="bg-[#0A0A12] border border-[#1E1E2E] rounded-2xl p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-base font-bold text-white">Geographic Distribution</h3>
          <p className="text-xs text-[#6B6B80]">Top 15 Indian states by activity</p>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(Object.keys(METRIC_LABELS) as Metric[]).map(m => (
            <button
              key={m}
              onClick={() => onMetricChange(m)}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border',
                metric === m
                  ? 'bg-[#FF7A00]/15 border-[#FF7A00]/30 text-[#FF9A40]'
                  : 'border-[#1E1E2E] text-[#6B6B80] hover:text-white'
              )}
            >
              {METRIC_LABELS[m]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table */}
        <div className="lg:col-span-2 overflow-x-auto">
          <table className="w-full min-w-[460px]">
            <thead>
              <tr className="text-[10px] font-bold text-[#6B6B80] uppercase border-b border-[#1E1E2E]">
                <th className="text-left py-2 px-2">#</th>
                <th className="text-left py-2 px-2">State</th>
                <th className="text-right py-2 px-2">Orders</th>
                <th className="text-right py-2 px-2">GMV</th>
                <th className="text-right py-2 px-2">Sellers</th>
                <th className="text-right py-2 px-2">Customers</th>
                <th className="text-right py-2 px-2">
                  <button className="flex items-center gap-0.5 ml-auto" onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')}>
                    AOV {sortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((state, i) => {
                const isTop5 = top5.some(t => t.stateCode === state.stateCode)
                return (
                  <tr key={state.stateCode} className="border-b border-[#0E0E1A] hover:bg-[#111118] transition-colors">
                    <td className="py-2 px-2 text-xs text-[#4A4A5E] font-mono">{i + 1}</td>
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-2">
                        {isTop5 && <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] shrink-0" />}
                        <span className="text-xs text-white font-medium">{state.state}</span>
                        <span className="text-[10px] text-[#4A4A5E] font-mono">{state.stateCode}</span>
                      </div>
                    </td>
                    <td className="py-2 px-2 text-right text-xs text-[#A0A0B8] font-mono">{state.orders.toLocaleString()}</td>
                    <td className="py-2 px-2 text-right text-xs text-[#A0A0B8] font-mono">{formatVal(state.gmv, 'gmv')}</td>
                    <td className="py-2 px-2 text-right text-xs text-[#A0A0B8] font-mono">{state.activeSellers}</td>
                    <td className="py-2 px-2 text-right text-xs text-[#A0A0B8] font-mono">{state.activeCustomers.toLocaleString()}</td>
                    <td className="py-2 px-2 text-right text-xs text-[#FF9A40] font-mono font-bold">₹{state.avgOrderValue.toLocaleString()}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Map */}
        <div className="flex flex-col items-center justify-start">
          <IndiaMapSVG top5={top5} />
          <div className="mt-3 space-y-1 w-full max-w-[220px]">
            <p className="text-[10px] text-[#6B6B80] font-bold uppercase mb-2">Top 5 by GMV</p>
            {top5.map((s, i) => (
              <div key={s.stateCode} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00]" />
                  <span className="text-[#A0A0B8]">{s.state}</span>
                </span>
                <span className="text-[#FF9A40] font-mono font-bold">{formatVal(s.gmv, 'gmv')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
