'use client'
import React from 'react'

export function SADashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-[120px] bg-[#111118] border border-[#2A2A3E] rounded-2xl p-5" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[400px] bg-[#111118] border border-[#2A2A3E] rounded-2xl" />
        <div className="h-[400px] bg-[#111118] border border-[#2A2A3E] rounded-2xl" />
      </div>
    </div>
  )
}

export function SATableSkeleton({ columns = 5, rows = 10 }: { columns?: number, rows?: number }) {
  return (
    <div className="w-full space-y-4 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="w-64 h-10 bg-[#111118] border border-[#2A2A3E] rounded-xl" />
        <div className="flex gap-2">
          <div className="w-24 h-10 bg-[#111118] border border-[#2A2A3E] rounded-xl" />
          <div className="w-24 h-10 bg-[#111118] border border-[#2A2A3E] rounded-xl" />
        </div>
      </div>
      <div className="bg-[#111118] border border-[#2A2A3E] rounded-2xl overflow-hidden">
        <div className="h-12 border-b border-[#2A2A3E] flex items-center px-4 gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="h-4 bg-[#2A2A3E] rounded w-full" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-16 border-b border-[#1E1E2E] flex items-center px-4 gap-4">
            {Array.from({ length: columns }).map((_, j) => (
              <div key={j} className="h-4 bg-[#1E1E2E] rounded w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function SADrawerSkeleton() {
  return (
    <div className="p-6 space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="w-48 h-8 bg-[#111118] rounded-xl" />
        <div className="w-32 h-4 bg-[#111118] rounded-md" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-20 bg-[#111118] rounded-xl" />
        ))}
      </div>
      <div className="h-64 bg-[#111118] rounded-xl" />
      <div className="h-48 bg-[#111118] rounded-xl" />
    </div>
  )
}

export function SAChartSkeleton({ height = "h-80" }: { height?: string }) {
  return (
    <div className={`w-full ${height} bg-[#111118] border border-[#2A2A3E] rounded-2xl animate-pulse p-6 flex flex-col justify-end gap-2`}>
      <div className="w-32 h-6 bg-[#2A2A3E] rounded-md mb-auto" />
      <div className="flex items-end gap-2 h-2/3">
        {[1, 2, 3, 4, 5, 6, 7].map(i => (
          <div key={i} className="flex-1 bg-[#1E1E2E] rounded-t-md" style={{ height: `${Math.random() * 60 + 20}%` }} />
        ))}
      </div>
    </div>
  )
}
