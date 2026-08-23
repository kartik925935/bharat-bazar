'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SUPER_ADMIN_ONLY_PANELS } from '@/lib/constants/sa-permissions'
import type { SAPanel, SAPermissionLevel } from '@/types/super-admin.types'

interface PermissionMatrixProps {
  permissions: Record<SAPanel, SAPermissionLevel>
  onChange: (panel: SAPanel, level: SAPermissionLevel) => void
  disabled?: boolean
  highlightPanel?: SAPanel
}

type LevelConfig = {
  label: string
  value: SAPermissionLevel
  selectedBg: string
  selectedText: string
  description: string
}

const LEVELS: LevelConfig[] = [
  { label: 'None', value: 'none', selectedBg: 'bg-[#3A3A50]', selectedText: 'text-white', description: 'No access to this panel' },
  { label: 'View', value: 'view', selectedBg: 'bg-[#3B82F6]', selectedText: 'text-white', description: 'Read-only access' },
  { label: 'Edit', value: 'edit', selectedBg: 'bg-[#FF7A00]', selectedText: 'text-white', description: 'Can modify data' },
  { label: 'Full', value: 'full', selectedBg: 'bg-gradient-to-r from-[#F5C842] to-[#F59E0B]', selectedText: 'text-[#1C1B14]', description: 'Complete control including delete' },
]

const PANEL_SECTIONS: { title: string; panels: SAPanel[] }[] = [
  { title: 'Main', panels: ['dashboard', 'analytics'] },
  { title: 'Admin Management', panels: ['admin-control', 'panel-requests'] },
  { title: 'User Management', panels: ['customers', 'sellers', 'kyc-verification'] },
  { title: 'Catalogue', panels: ['products', 'reviews', 'coupons', 'offers'] },
  { title: 'Operations', panels: ['orders', 'delivery', 'support'] },
  { title: 'Finance', panels: ['finance'] },
  { title: 'Audit & System', panels: ['audit-logs', 'notifications', 'settings'] },
]

const PANEL_LABELS: Record<SAPanel, string> = {
  'dashboard': 'Dashboard',
  'admin-control': 'Admin Control',
  'panel-requests': 'Panel Requests',
  'customers': 'Customers',
  'sellers': 'Sellers',
  'products': 'Products',
  'orders': 'Orders',
  'delivery': 'Delivery',
  'finance': 'Finance',
  'kyc-verification': 'KYC Verification',
  'reviews': 'Reviews',
  'coupons': 'Coupons',
  'offers': 'Offers',
  'notifications': 'Notifications',
  'analytics': 'Analytics',
  'audit-logs': 'Audit Logs',
  'support': 'Support',
  'settings': 'Settings',
}

function PermissionRow({
  panel,
  currentLevel,
  onChange,
  disabled,
  isHighlighted,
  isLocked,
}: {
  panel: SAPanel
  currentLevel: SAPermissionLevel
  onChange: (level: SAPermissionLevel) => void
  disabled: boolean
  isHighlighted: boolean
  isLocked: boolean
}) {
  return (
    <motion.div
      animate={isHighlighted ? { boxShadow: ['0 0 0 0 rgba(245,200,66,0)', '0 0 0 2px rgba(245,200,66,0.6)', '0 0 0 0 rgba(245,200,66,0)'] } : {}}
      transition={isHighlighted ? { repeat: Infinity, duration: 1.8, ease: 'easeInOut' } : {}}
      className={cn(
        'flex flex-col sm:flex-row sm:items-center gap-3 py-2.5 px-3 rounded-xl transition-colors',
        isHighlighted && 'ring-1 ring-[#F5C842]/60 bg-[#F5C842]/5',
        isLocked && 'opacity-60',
        !isHighlighted && 'hover:bg-white/[0.02]'
      )}
    >
      {/* Panel label */}
      <div className="flex items-center gap-2 min-w-[160px]">
        <span className={cn(
          'text-sm font-semibold truncate',
          isHighlighted ? 'text-[#F5C842]' : 'text-[#D0D0E0]'
        )}>
          {PANEL_LABELS[panel]}
        </span>
        {isLocked && (
          <div title="Reserved for Super Admin only" className="cursor-default">
            <Lock className="w-3 h-3 text-[#6B6B80]" />
          </div>
        )}
      </div>

      {/* Level selector */}
      <div
        role="radiogroup"
        aria-label={`${PANEL_LABELS[panel]} permission level`}
        className="flex items-center gap-1 flex-1 sm:justify-end"
      >
        {LEVELS.map((lvl) => {
          const isSelected = currentLevel === lvl.value
          const groupId = `perm-${panel}`
          return (
            <button
              key={lvl.value}
              role="radio"
              aria-checked={isSelected}
              aria-label={`${lvl.label}: ${lvl.description}`}
              disabled={disabled || isLocked}
              onClick={() => !disabled && !isLocked && onChange(lvl.value)}
              className={cn(
                'relative flex-1 sm:flex-none sm:w-16 h-9 rounded-lg text-xs font-bold transition-all border focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/30',
                isSelected
                  ? `${lvl.selectedBg} ${lvl.selectedText} border-transparent shadow-sm`
                  : 'bg-transparent text-[#6B6B80] border-[#2A2A3E] hover:border-[#3A3A50] hover:text-[#A0A0B8]',
                (disabled || isLocked) && 'cursor-not-allowed pointer-events-none'
              )}
            >
              {isSelected && (
                <motion.span
                  layoutId={groupId}
                  className="absolute inset-0 rounded-[7px]"
                  style={{ zIndex: -1 }}
                />
              )}
              {lvl.label}
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}

export function PermissionMatrix({ permissions, onChange, disabled = false, highlightPanel }: PermissionMatrixProps) {
  return (
    <div className="w-full space-y-1">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 px-3 py-2 mb-4 rounded-xl bg-[#1A1A26] border border-[#2A2A3E]">
        <span className="text-[10px] font-bold text-[#6B6B80] uppercase tracking-widest shrink-0">Legend:</span>
        {LEVELS.map((lvl) => (
          <span key={lvl.value} className="text-[10px] text-[#8B8B9E] flex items-center gap-1">
            <span className={cn('w-2 h-2 rounded-sm', lvl.selectedBg)} />
            <span className="font-bold text-[#D0D0E0]">{lvl.label}</span>: {lvl.description}
          </span>
        ))}
        <span className="text-[10px] text-[#8B8B9E] flex items-center gap-1 ml-auto">
          <Lock className="w-2.5 h-2.5" />
          Super Admin only
        </span>
      </div>

      {/* Panel sections */}
      {PANEL_SECTIONS.map((section) => (
        <div key={section.title} className="mb-4">
          <p className="text-[9px] font-black text-[#3A3A50] uppercase tracking-[0.15em] px-3 mb-1">{section.title}</p>
          <div className="space-y-0.5">
            {section.panels.map((panel) => {
              const isLocked = SUPER_ADMIN_ONLY_PANELS.includes(panel)
              const currentLevel = isLocked ? 'none' : ((permissions as any)[panel] ?? 'none') as SAPermissionLevel
              return (
                <PermissionRow
                  key={panel}
                  panel={panel}
                  currentLevel={currentLevel}
                  onChange={(level) => onChange(panel, level)}
                  disabled={disabled}
                  isHighlighted={highlightPanel === panel}
                  isLocked={isLocked}
                />
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
