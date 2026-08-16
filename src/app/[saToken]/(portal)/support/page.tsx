'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { HeadphonesIcon, Clock, AlertTriangle, ShieldCheck, Tag } from 'lucide-react'
import { DataTable, Column } from '@/components/super-admin/shared/DataTable'
import { StatusBadge } from '@/components/super-admin/shared/StatusBadge'
import { useSAStore } from '@/lib/store/super-admin-store'
import { TicketDetailDrawer } from '@/components/super-admin/support/TicketDetailDrawer'
import { cn } from '@/lib/utils'
import type { SATicket } from '@/types/super-admin.types'

export default function SupportPage() {
  const { tickets, getOpenTicketsCount, getSlaBreachedTicketsCount, getAvgFirstResponseTime, getCSATScore } = useSAStore()
  
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const ticketId = searchParams.get('ticketId')
    if (ticketId) {
      setSelectedTicketId(ticketId)
    }
  }, [searchParams])

  const columns: Column<any>[] = [
    {
      key: 'ticketNumber',
      header: 'Ticket ID',
      sortable: true,
      render: (t) => (
        <div>
          <span className="font-mono text-white font-bold">{t.ticketNumber}</span>
          {t.slaBreached && (
            <span className="flex items-center gap-1 text-[10px] text-red-500 font-bold uppercase mt-1">
              <AlertTriangle className="w-3 h-3" /> SLA Breach
            </span>
          )}
        </div>
      )
    },
    {
      key: 'subject',
      header: 'Subject & Submitter',
      render: (t) => (
        <div className="max-w-[250px]">
          <p className="text-sm font-bold text-white truncate" title={t.subject}>{t.subject}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={cn(
              "px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold uppercase tracking-wider",
              t.submitterRole === 'customer' ? "bg-blue-500/10 text-blue-400" : "bg-orange-500/10 text-orange-400"
            )}>
              {t.submitterRole}
            </span>
            <span className="text-xs text-[#8B8B9E] truncate">{t.submitterName}</span>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      render: (t) => (
        <span className="text-xs text-[#A0A0B8] capitalize">{t.category.replace(/_/g, ' ')}</span>
      )
    },
    {
      key: 'priority',
      header: 'Priority',
      sortable: true,
      render: (t) => {
        const pColors: any = { urgent: 'text-red-500', high: 'text-orange-500', medium: 'text-blue-500', low: 'text-gray-400' }
        return <span className={cn("text-xs font-bold uppercase tracking-wider", pColors[t.priority])}>{t.priority}</span>
      }
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (t) => {
        let variant: any = 'neutral'
        if (t.status === 'open') variant = 'warning'
        if (t.status === 'in_progress') variant = 'info'
        if (t.status === 'resolved') variant = 'success'
        if (t.status === 'waiting_for_user') variant = 'warning'
        return <StatusBadge variant={variant} status={t.status.replace(/_/g, ' ')} />
      }
    },
    {
      key: 'assignedAdminName',
      header: 'Assignee',
      sortable: true,
      render: (t) => (
        <span className="text-xs text-[#A0A0B8]">{t.assignedAdminName || 'Unassigned'}</span>
      )
    },
    {
      key: 'updatedAt',
      header: 'Last Updated',
      sortable: true,
      render: (t) => <span className="text-xs text-[#A0A0B8]">{new Date(t.updatedAt).toLocaleDateString()}</span>
    }
  ]

  return (
    <div className="h-full flex flex-col min-h-0 bg-[#0B0B12]">
      {/* Page Header */}
      <div className="shrink-0 p-6 border-b border-[#1E1E2E] bg-[#111118] flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Support Tickets</h1>
            <p className="text-[#8B8B9E] text-sm">Manage customer and seller support requests, disputes, and appeals.</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-[#1A1A26] rounded-xl p-4 border border-[#2A2A3E] relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
              <HeadphonesIcon className="w-32 h-32 text-white" />
            </div>
            <p className="text-xs text-[#8B8B9E] font-medium mb-1">Open Tickets</p>
            <p className="text-2xl font-bold text-white">{getOpenTicketsCount()}</p>
          </div>
          
          <div className="bg-red-500/5 rounded-xl p-4 border border-red-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-20"><AlertTriangle className="w-10 h-10 text-red-500" /></div>
            <p className="text-xs text-red-400 font-medium mb-1">SLA Breaches</p>
            <p className="text-2xl font-bold text-red-400">{getSlaBreachedTicketsCount()}</p>
          </div>

          <div className="bg-[#1A1A26] rounded-xl p-4 border border-[#2A2A3E]">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-blue-400" />
              <p className="text-xs text-[#8B8B9E] font-medium">Avg First Response</p>
            </div>
            <p className="text-2xl font-bold text-white">{getAvgFirstResponseTime()}</p>
          </div>
          
          <div className="bg-[#1A1A26] rounded-xl p-4 border border-[#2A2A3E]">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              <p className="text-xs text-[#8B8B9E] font-medium">CSAT Score</p>
            </div>
            <p className="text-2xl font-bold text-white">{getCSATScore().toFixed(1)} <span className="text-sm font-normal text-[#6B6B80]">/ 5.0</span></p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden p-6 min-h-0">
        <DataTable
          data={tickets}
          columns={columns}
          searchPlaceholder="Search by ticket ID, subject, or submitter..."
          searchKeys={['ticketNumber', 'subject', 'submitterName', 'submitterEmail']}
          onRowClick={(t) => setSelectedTicketId(t.id)}
          keyExtractor={(t) => t.id}
        />
      </div>

      <AnimatePresence>
        {selectedTicketId && (
          <TicketDetailDrawer
            ticketId={selectedTicketId}
            onClose={() => setSelectedTicketId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}