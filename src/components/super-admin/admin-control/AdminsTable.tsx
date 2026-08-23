'use client'

import React, { useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { Eye, Edit2, UserX, UserCheck, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { DataTable, type Column } from '@/components/super-admin/shared/DataTable'
import { StatusBadge } from '@/components/super-admin/shared/StatusBadge'
import { ActionDropdown } from '@/components/super-admin/shared/ActionDropdown'
import { useSAStore } from '@/lib/store/super-admin-store'
import { useSAUIStore } from '@/lib/store/sa-ui-store'
import { formatRelativeTime } from '@/lib/utils/formatters'
import { cn } from '@/lib/utils'
import type { SAAdmin, AdminRole, AdminStatus } from '@/types/super-admin.types'

const ROLE_COLORS: Record<AdminRole, string> = {
  SUPER_ADMIN: 'text-[#F5C842] bg-[#F5C842]/10 border-[#F5C842]/20',
  SENIOR_ADMIN: 'text-[#A855F7] bg-[#A855F7]/10 border-[#A855F7]/20',
  OPERATIONS_ADMIN: 'text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/20',
  SUPPORT_ADMIN: 'text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20',
  FINANCE_ADMIN: 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20',
  CONTENT_ADMIN: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20',
  DELIVERY_ADMIN: 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20',
  CUSTOM_ADMIN: 'text-[#8B8B9E] bg-[#8B8B9E]/10 border-[#8B8B9E]/20',
}

const STATUS_VARIANT: Record<AdminStatus, 'success' | 'warning' | 'error' | 'neutral'> = {
  active: 'success',
  inactive: 'neutral',
  suspended: 'error',
  pending: 'warning',
}

interface AdminsTableProps {
  onRowClick: (admin: SAAdmin) => void
}

export function AdminsTable({ onRowClick }: AdminsTableProps) {
  const { admins, updateAdminStatus, deleteAdmin } = useSAStore()
  const { openConfirmModal } = useSAUIStore()
  const params = useParams()

  const columns: Column<SAAdmin>[] = [
    {
      key: 'name',
      header: 'Admin',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black shrink-0',
            row.status === 'suspended' ? 'bg-[#2A2A3E] text-[#5A5A70]' : 'bg-gradient-to-br from-[#FF7A00]/20 to-[#FF4500]/20 text-[#FF7A00]'
          )}>
            {row.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className={cn('text-sm font-semibold truncate', row.status === 'suspended' ? 'text-[#6B6B80]' : 'text-white')}>
              {row.name}
            </p>
            <p className="text-xs text-[#6B6B80] truncate">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      render: (row) => (
        <span className={cn('text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider', ROLE_COLORS[row.role])}>
          {row.role.replace(/_/g, ' ')}
        </span>
      ),
      hideOnMobile: true,
    },
    {
      key: 'department',
      header: 'Department',
      render: (row) => <span className="text-xs text-[#A0A0B8]">{row.department}</span>,
      hideOnMobile: true,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => <StatusBadge status={row.status} variant={STATUS_VARIANT[row.status]} />,
    },
    {
      key: 'lastActive',
      header: 'Last Active',
      sortable: true,
      render: (row) => (
        <span className="text-xs text-[#8B8B9E]">
          {row.lastActive === '—' ? '—' : formatRelativeTime(row.lastActive)}
        </span>
      ),
      hideOnMobile: true,
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ActionDropdown
            items={[
              { label: 'View & Edit', icon: Edit2, onClick: () => onRowClick(row) },
              {
                label: row.status === 'suspended' ? 'Reactivate' : 'Suspend',
                icon: row.status === 'suspended' ? UserCheck : UserX,
                onClick: async () => {
                  const newStatus: AdminStatus = row.status === 'suspended' ? 'active' : 'suspended'
                  await new Promise((r) => setTimeout(r, 500))
                  updateAdminStatus(row.id, newStatus)
                  toast.success(`${row.name} ${newStatus === 'suspended' ? 'suspended' : 'reactivated'}`)
                },
              },
              {
                label: 'Delete Admin',
                icon: Trash2,
                variant: 'danger',
                onClick: () => {
                  openConfirmModal({
                    title: 'Delete Admin Account',
                    description: `This will permanently remove ${row.name}'s access. This cannot be undone.`,
                    confirmLabel: 'Delete',
                    variant: 'danger',
                    onConfirm: async () => {
                      await new Promise((r) => setTimeout(r, 600))
                      deleteAdmin(row.id)
                      toast.error(`${row.name} removed`)
                    },
                  })
                },
              },
            ]}
          />
        </div>
      ),
      className: 'w-12 text-right',
    },
  ]

  return (
    <DataTable<SAAdmin>
      data={admins}
      columns={columns}
      keyExtractor={(r) => r.id}
      onRowClick={onRowClick}
      searchable
      searchPlaceholder="Search admins by name or email..."
      searchKeys={['name', 'email', 'department']}
      pagination={{ pageSize: 8 }}
      emptyState={{
        title: 'No admins found',
        description: 'Try adjusting your search or filters.',
      }}
    />
  )
}
