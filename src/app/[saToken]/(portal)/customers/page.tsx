'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Ban, ShieldCheck } from 'lucide-react'
import { DataTable, Column } from '@/components/super-admin/shared/DataTable'
import { ExportButton } from '@/components/super-admin/shared/ExportButton'
import { AdvancedFilterBuilder, FilterField, FilterRule, applyFilterRules } from '@/components/super-admin/shared/AdvancedFilterBuilder'
import { SavedViewsBar } from '@/components/super-admin/shared/SavedViewsBar'
import { StatusBadge } from '@/components/super-admin/shared/StatusBadge'
import { CustomerDetailDrawer } from '@/components/super-admin/customers/CustomerDetailDrawer'
import { fetchCustomersAction, updateCustomerStatusAction } from '@/actions/super-admin/customers'
import { toast } from 'sonner'
import { useUndoableAction } from '@/lib/hooks/useUndoableAction'
import { cn } from '@/lib/utils'
import type { SACustomerExtended } from '@/types/super-admin.types'

const CUSTOMER_FIELDS: FilterField[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'email', label: 'Email', type: 'text' },
  { key: 'status', label: 'Status', type: 'enum', options: [
    { label: 'Active', value: 'active' },
    { label: 'Blocked', value: 'blocked' },
    { label: 'Suspended', value: 'suspended' },
    { label: 'Pending', value: 'pending' },
  ]},
  { key: 'tier', label: 'Tier', type: 'enum', options: [
    { label: 'Platinum', value: 'platinum' },
    { label: 'Gold', value: 'gold' },
    { label: 'Silver', value: 'silver' },
    { label: 'Bronze', value: 'bronze' },
  ]},
  { key: 'totalOrders', label: 'Total Orders', type: 'number' },
  { key: 'totalSpent', label: 'Total Spent', type: 'number' },
  { key: 'riskScore', label: 'Risk Score', type: 'number' },
]

const TIER_COLORS: Record<string, string> = {
  bronze: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  silver: 'bg-slate-300/10 text-slate-300 border-slate-300/20',
  gold: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
  platinum: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20',
}

export default function CustomersPage() {
  const { execute } = useUndoableAction()
  
  const [customers, setCustomers] = useState<SACustomerExtended[]>([])
  const [loading, setLoading] = useState(true)
  const [activeRules, setActiveRules] = useState<FilterRule[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<SACustomerExtended | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    setLoading(true)
    const { data, error } = await fetchCustomersAction()
    if (error) {
      toast.error('Failed to load customers: ' + error)
    } else {
      setCustomers(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    const customerId = searchParams.get('customerId')
    if (customerId && customers.length > 0) {
      const cust = customers.find(c => c.id === customerId)
      if (cust) setSelectedCustomer(cust)
    }
  }, [searchParams, customers])

  const blockCustomer = async (id: string) => {
    await updateCustomerStatusAction(id, true)
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: 'blocked' } : c))
  }

  const unblockCustomer = async (id: string) => {
    await updateCustomerStatusAction(id, false)
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: 'active' } : c))
  }

  // Apply filters
  const filteredCustomers = applyFilterRules(customers, activeRules, CUSTOMER_FIELDS)

  const columns: Column<SACustomerExtended>[] = [
    {
      key: 'customer',
      header: 'Customer',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3 min-w-[200px]">
          {row.avatar ? (
            <img src={row.avatar} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#1A1A26] border border-[#2A2A3E] flex items-center justify-center text-sm font-bold text-[#A0A0B8] shrink-0">
              {row.name.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-bold text-white truncate flex items-center gap-1.5">
              {row.name}
              {row.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-green-500" />}
            </p>
            <p className="text-xs text-[#8B8B9E] truncate">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => (
        <StatusBadge 
          status={row.status} 
          variant={row.status === 'active' ? 'success' : row.status === 'blocked' ? 'error' : 'warning'} 
        />
      ),
    },
    {
      key: 'tier',
      header: 'Tier',
      sortable: true,
      hideOnMobile: true,
      render: (row) => (
        <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider whitespace-nowrap', TIER_COLORS[row.tier])}>
          {row.tier}
        </span>
      ),
    },
    {
      key: 'orders',
      header: 'Orders',
      sortable: true,
      hideOnMobile: true,
      render: (row) => (
        <div className="text-sm">
          <p className="font-bold text-white">{row.totalOrders}</p>
        </div>
      ),
    },
    {
      key: 'spent',
      header: 'Spent',
      sortable: true,
      hideOnMobile: true,
      render: (row) => (
        <div className="text-sm">
          <p className="font-bold text-white">
            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(row.totalSpent)}
          </p>
        </div>
      ),
    },
    {
      key: 'riskScore',
      header: 'Risk',
      sortable: true,
      hideOnMobile: true,
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <div className={cn(
            "w-2 h-2 rounded-full",
            row.riskScore > 70 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' :
            row.riskScore > 30 ? 'bg-amber-500' : 'bg-green-500'
          )} />
          <span className={cn(
            "text-xs font-bold",
            row.riskScore > 70 ? 'text-red-500' : row.riskScore > 30 ? 'text-amber-500' : 'text-green-500'
          )}>{row.riskScore}</span>
        </div>
      ),
    }
  ]

  const bulkActions = [
    {
      label: 'Block Selected',
      icon: Ban,
      variant: 'danger' as const,
      requireConfirm: {
        title: 'Block {count} Customers',
        description: 'Are you sure you want to block {count} customers? They will no longer be able to place orders or log in.',
        confirmLabel: 'Block Customers'
      },
      onClick: async (selected: SACustomerExtended[]) => {
        const ids = selected.map(s => s.id)
        await execute({
          description: `Blocked ${ids.length} customers`,
          action: async () => {
            ids.forEach(id => blockCustomer(id))
            return true
          },
          undoAction: async () => {
            ids.forEach(id => unblockCustomer(id))
          }
        })
      }
    }
  ]

  const exportColumns = [
    { key: 'id', header: 'ID', accessor: (r: SACustomerExtended) => r.id },
    { key: 'name', header: 'Name', accessor: (r: SACustomerExtended) => r.name },
    { key: 'email', header: 'Email', accessor: (r: SACustomerExtended) => r.email },
    { key: 'phone', header: 'Phone', accessor: (r: SACustomerExtended) => r.phone ?? '' },
    { key: 'status', header: 'Status', accessor: (r: SACustomerExtended) => r.status },
    { key: 'tier', header: 'Tier', accessor: (r: SACustomerExtended) => r.tier },
    { key: 'orders', header: 'Total Orders', accessor: (r: SACustomerExtended) => r.totalOrders },
    { key: 'spent', header: 'Total Spent', accessor: (r: SACustomerExtended) => r.totalSpent },
    { key: 'riskScore', header: 'Risk Score', accessor: (r: SACustomerExtended) => r.riskScore },
  ]

  const handleUpdateStatus = async (status: SACustomerExtended['status']) => {
    if (!selectedCustomer) return
    const id = selectedCustomer.id
    const oldStatus = selectedCustomer.status
    if (status === 'blocked') {
      await execute({
        description: `Blocked customer ${selectedCustomer.name}`,
        action: async () => blockCustomer(id),
        undoAction: async () => unblockCustomer(id) // assumes unblock restores to active, which is what unblockCustomer does
      })
    } else {
      await execute({
        description: `Unblocked customer ${selectedCustomer.name}`,
        action: async () => unblockCustomer(id),
        undoAction: async () => blockCustomer(id)
      })
    }
    setSelectedCustomer(null)
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight font-sans">Customers</h1>
          <p className="text-sm text-[#A0A0B8] mt-1">Manage {customers.length} users, tiers, and trust intelligence.</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton 
            data={customers} 
            visibleData={filteredCustomers} 
            columns={exportColumns} 
            filename="bharat_bazaar_customers" 
          />
        </div>
      </div>

      <div className="space-y-4">
        <SavedViewsBar 
          pageKey="sa-customers" 
          currentState={{ activeRules }}
          onSelectView={(state) => setActiveRules((state.activeRules as FilterRule[]) || [])}
        />
        
        <DataTable
          data={filteredCustomers}
          columns={columns}
          keyExtractor={(row) => row.id}
          searchable
          searchPlaceholder="Search customers by name, email, or phone..."
          searchKeys={['name', 'email', 'phone', 'id']}
          pagination={{ pageSize: 15 }}
          bulkActions={bulkActions}
          onRowClick={setSelectedCustomer}
          filters={
            <AdvancedFilterBuilder
              fields={CUSTOMER_FIELDS}
              activeRules={activeRules}
              onApply={setActiveRules}
              onClear={() => setActiveRules([])}
            />
          }
        />
      </div>

      <CustomerDetailDrawer 
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  )
}