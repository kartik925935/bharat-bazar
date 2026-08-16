'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EmptyState } from './EmptyState'
import { Input } from '@/components/ui/input'
import { SkeletonBase } from './SkeletonBase'
import { useSAUIStore } from '@/lib/store/sa-ui-store'

export interface Column<T> {
  key: string
  header: string
  sortable?: boolean
  render: (row: T) => React.ReactNode
  className?: string
  hideOnMobile?: boolean
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  isLoading?: boolean
  onRowClick?: (row: T) => void
  searchable?: boolean
  searchPlaceholder?: string
  searchKeys?: (keyof T)[]
  filters?: React.ReactNode
  emptyState?: { title: string; description: string; action?: React.ReactNode }
  pagination?: { pageSize: number }
  bulkActions?: {
    label: string
    icon: LucideIcon
    onClick: (selectedRows: T[]) => void
    variant?: 'default' | 'danger'
    requireConfirm?: {
      title: string
      description: string
      confirmLabel: string
    }
  }[]
  // Provide a key extractor for React keys
  keyExtractor: (row: T) => string
}

export function DataTable<T>({
  data,
  columns,
  isLoading = false,
  onRowClick,
  searchable = false,
  searchPlaceholder = 'Search...',
  searchKeys = [],
  filters,
  emptyState = { title: 'No data found', description: 'Try adjusting your search or filters.' },
  pagination,
  bulkActions,
  keyExtractor
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set())
  const { openConfirmModal } = useSAUIStore()

  const pageSize = pagination?.pageSize || 10

  // 1. Filter
  const filteredData = useMemo(() => {
    if (!searchTerm || searchKeys.length === 0) return data
    const lowerSearch = searchTerm.toLowerCase()
    return data.filter((row) =>
      searchKeys.some((key) => {
        const val = row[key]
        return val != null && String(val).toLowerCase().includes(lowerSearch)
      })
    )
  }, [data, searchTerm, searchKeys])

  // 2. Sort
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData
    return [...filteredData].sort((a: any, b: any) => {
      const aVal = a[sortConfig.key]
      const bVal = b[sortConfig.key]
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredData, sortConfig])

  // 3. Paginate
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize))
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData
    const start = (currentPage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, currentPage, pageSize, pagination])

  // Handlers
  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        if (current.direction === 'asc') return { key, direction: 'desc' }
        return null
      }
      return { key, direction: 'asc' }
    })
  }

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedKeys(new Set(paginatedData.map(keyExtractor)))
    } else {
      setSelectedKeys(new Set())
    }
  }

  const handleSelectRow = (key: string, checked: boolean) => {
    const next = new Set(selectedKeys)
    if (checked) next.add(key)
    else next.delete(key)
    setSelectedKeys(next)
  }

  // Derived state
  const isAllSelected = paginatedData.length > 0 && paginatedData.every((r) => selectedKeys.has(keyExtractor(r)))
  const selectedRows = data.filter((r) => selectedKeys.has(keyExtractor(r)))

  if (isLoading) {
    return (
      <div className="w-full bg-[#111118] border border-[#1E1E2E] rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-[#1E1E2E] flex justify-between">
          <SkeletonBase className="w-48 h-10 rounded-xl" />
          <SkeletonBase className="w-32 h-10 rounded-xl" />
        </div>
        <div className="divide-y divide-[#1E1E2E]">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <SkeletonBase className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <SkeletonBase className="w-48 h-4" />
                <SkeletonBase className="w-24 h-3" />
              </div>
              <SkeletonBase className="w-24 h-6 rounded-full" />
              <SkeletonBase className="w-32 h-4" />
              <SkeletonBase className="w-8 h-8 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-[#111118] border border-[#1E1E2E] rounded-2xl overflow-hidden flex flex-col relative">
      {/* Top Bar: Search & Filters */}
      {(searchable || filters) && (
        <div className="p-4 border-b border-[#1E1E2E] flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#151520]">
          {searchable && (
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B80]" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-9 h-10 bg-[#1A1A26] border-[#2A2A3E] focus:border-[#FF7A00] focus:ring-[#FF7A00]/20 text-sm text-white rounded-xl placeholder:text-[#6B6B80]"
              />
            </div>
          )}
          {filters && <div className="w-full sm:w-auto flex items-center gap-2">{filters}</div>}
        </div>
      )}

      {paginatedData.length === 0 ? (
        <EmptyState title={emptyState.title} description={emptyState.description} action={emptyState.action} />
      ) : (
        <>
          {/* Desktop Table View (hidden on very small screens) */}
          <div className="hidden md:block w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1E1E2E] bg-[#1A1A26]/50">
                  {bulkActions && (
                    <th className="p-4 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        className="rounded border-[#3A3A50] bg-[#111118] text-[#FF7A00] focus:ring-[#FF7A00]/20"
                      />
                    </th>
                  )}
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      aria-sort={sortConfig?.key === col.key ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                      className={cn(
                        'p-4 text-xs font-bold text-[#6B6B80] uppercase tracking-wider',
                        col.className
                      )}
                    >
                      {col.sortable ? (
                        <button
                          onClick={() => handleSort(col.key)}
                          className="flex items-center gap-1.5 cursor-pointer hover:text-[#A0A0B8] select-none group focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/50 rounded px-1 -ml-1"
                        >
                          {col.header}
                          <span className="flex flex-col text-[#3A3A50] group-hover:text-[#6B6B80] transition-colors">
                            <ChevronUp className={cn('w-2 h-2 -mb-0.5', sortConfig?.key === col.key && sortConfig.direction === 'asc' && 'text-[#FF7A00]')} />
                            <ChevronDown className={cn('w-2 h-2', sortConfig?.key === col.key && sortConfig.direction === 'desc' && 'text-[#FF7A00]')} />
                          </span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5">{col.header}</div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E1E2E]">
                {paginatedData.map((row, i) => {
                  const rKey = keyExtractor(row)
                  const isSelected = selectedKeys.has(rKey)
                  return (
                    <motion.tr
                      initial={paginatedData.length <= 20 ? { opacity: 0, y: 10 } : false}
                      animate={paginatedData.length <= 20 ? { opacity: 1, y: 0 } : false}
                      transition={{ delay: i * 0.03 }}
                      key={rKey}
                      onClick={() => onRowClick?.(row)}
                      className={cn(
                        'transition-colors',
                        onRowClick && 'cursor-pointer hover:bg-white/[0.02]',
                        isSelected ? 'bg-[#FF7A00]/[0.05]' : ''
                      )}
                    >
                      {bulkActions && (
                        <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleSelectRow(rKey, e.target.checked)}
                            className="rounded border-[#3A3A50] bg-[#111118] text-[#FF7A00] focus:ring-[#FF7A00]/20"
                          />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td key={col.key} className={cn('p-4 align-middle text-sm text-[#D0D0E0]', col.className)}>
                          {col.render(row)}
                        </td>
                      ))}
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (hidden on md and up) */}
          <div className="md:hidden flex flex-col divide-y divide-[#1E1E2E]">
            {paginatedData.map((row, i) => {
              const rKey = keyExtractor(row)
              const isSelected = selectedKeys.has(rKey)
              return (
                <div
                  key={rKey}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'p-4 flex flex-col gap-3 transition-colors relative',
                    onRowClick && 'active:bg-white/[0.04]',
                    isSelected && 'bg-[#FF7A00]/[0.05]'
                  )}
                >
                  {bulkActions && (
                    <div className="absolute top-4 right-4 z-10" onClick={(e) => e.stopPropagation()}>
                       <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(rKey, e.target.checked)}
                          className="rounded border-[#3A3A50] bg-[#111118] text-[#FF7A00] focus:ring-[#FF7A00]/20 w-5 h-5"
                        />
                    </div>
                  )}
                  {columns.filter((c) => !c.hideOnMobile).map((col, idx) => (
                    <div key={col.key} className={idx === 0 ? 'pr-8' : ''}>
                      {idx !== 0 && <span className="text-[10px] font-bold text-[#6B6B80] uppercase tracking-wider block mb-1">{col.header}</span>}
                      <div className="text-sm">{col.render(row)}</div>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Pagination Footer */}
      {pagination && totalPages > 1 && (
        <div className="p-4 border-t border-[#1E1E2E] flex items-center justify-between bg-[#151520]">
          <span className="text-xs text-[#6B6B80] font-medium">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              aria-label="Previous Page"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#A0A0B8] hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-white min-w-[32px] text-center" aria-live="polite" aria-atomic="true">
              {currentPage} / {totalPages}
            </span>
            <button
              aria-label="Next Page"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#A0A0B8] hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bulk Actions Floating Bar */}
      <AnimatePresence>
        {bulkActions && selectedKeys.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#FF7A00] text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-4 z-20"
          >
            <span className="text-sm font-bold">{selectedKeys.size} selected</span>
            <div className="w-px h-4 bg-white/30" />
            <div className="flex items-center gap-2">
              {bulkActions.map((action, idx) => {
                const Icon = action.icon
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (action.requireConfirm) {
                        openConfirmModal({
                          title: action.requireConfirm.title.replace('{count}', String(selectedRows.length)),
                          description: action.requireConfirm.description.replace('{count}', String(selectedRows.length)),
                          confirmLabel: action.requireConfirm.confirmLabel,
                          variant: action.variant === 'danger' ? 'danger' : 'warning',
                          onConfirm: () => {
                            action.onClick(selectedRows)
                            setSelectedKeys(new Set())
                          }
                        })
                      } else {
                        action.onClick(selectedRows)
                        setSelectedKeys(new Set())
                      }
                    }}
                    className={cn(
                      "flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-colors",
                      action.variant === 'danger' ? "bg-red-500/20 hover:bg-red-500/40 text-white" : "bg-white/20 hover:bg-white/30"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {action.label}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
