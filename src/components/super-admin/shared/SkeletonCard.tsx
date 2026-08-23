'use client'
import React from 'react'
import { SkeletonBase } from './SkeletonBase'

export function SkeletonCard() {
  return (
    <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <SkeletonBase width={40} height={40} rounded="xl" />
        <SkeletonBase width={60} height={20} rounded="full" />
      </div>
      <SkeletonBase width="70%" height={32} rounded="lg" />
      <SkeletonBase width="50%" height={16} rounded="md" />
    </div>
  )
}

export function SkeletonTable({ rows = 6 }: { rows?: number }) {
  return (
    <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl overflow-hidden">
      {/* Table Header */}
      <div className="p-4 border-b border-[#1E1E2E] flex gap-4">
        <SkeletonBase width="30%" height={14} rounded="md" />
        <SkeletonBase width="20%" height={14} rounded="md" />
        <SkeletonBase width="20%" height={14} rounded="md" />
        <SkeletonBase width="15%" height={14} rounded="md" />
        <SkeletonBase width="10%" height={14} rounded="md" />
      </div>
      {/* Table Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 border-b border-[#1A1A26] flex items-center gap-4">
          <SkeletonBase width={36} height={36} rounded="full" />
          <SkeletonBase width="25%" height={14} rounded="md" />
          <SkeletonBase width="18%" height={14} rounded="md" />
          <SkeletonBase width="18%" height={14} rounded="md" />
          <SkeletonBase width="12%" height={22} rounded="full" />
          <SkeletonBase width="8%" height={14} rounded="md" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <SkeletonBase width={220} height={32} rounded="lg" />
          <SkeletonBase width={320} height={16} rounded="md" />
        </div>
        <SkeletonBase width={140} height={44} rounded="xl" />
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Large Table */}
      <SkeletonTable rows={6} />
    </div>
  )
}
