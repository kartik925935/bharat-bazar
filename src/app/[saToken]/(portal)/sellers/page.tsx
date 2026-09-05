'use client'

import React, { useEffect, useState } from 'react'
import { Ban, CheckCircle, ShieldAlert } from 'lucide-react'
import { DataTable, Column } from '@/components/super-admin/shared/DataTable'
import { ExportButton } from '@/components/super-admin/shared/ExportButton'
import { AdvancedFilterBuilder, FilterField, FilterRule, applyFilterRules } from '@/components/super-admin/shared/AdvancedFilterBuilder'
import { SavedViewsBar } from '@/components/super-admin/shared/SavedViewsBar'
import { StatusBadge } from '@/components/super-admin/shared/StatusBadge'
import { TierBadge } from '@/components/super-admin/shared/TierBadge'
import { SellerDetailDrawer } from '@/components/super-admin/sellers/SellerDetailDrawer'
import { useUndoableAction } from '@/lib/hooks/useUndoableAction'
import { cn } from '@/lib/utils'
import type { SASellerExtended } from '@/types/super-admin.types'
import { fetchSellersAction, updateSellerStatusAction } from '@/actions/super-admin/queries'

const SELLER_FIELDS: FilterField[] = [
  { key: 'shopName', label: 'Shop Name', type: 'text' },
  { key: 'sellerId', label: 'Seller ID', type: 'text' },
  { key: 'status', label: 'Status', type: 'enum', options: [
    { label: 'Active', value: 'active' },
    { label: 'Pending', value: 'pending' },
    { label: 'Under Review', value: 'under_review' },
    { label: 'Suspended', value: 'suspended' },
    { label: 'Rejected', value: 'rejected' },
  ]},
  { key: 'tier', label: 'Tier', type: 'enum', options: [
    { label: 'Platinum', value: 'platinum' },
    { label: 'Gold', value: 'gold' },
    { label: 'Silver', value: 'silver' },
    { label: 'Bronze', value: 'bronze' },
  ]},
  { key: 'sellerType', label: 'Type', type: 'enum', options: [
    { label: 'NGO', value: 'ngo' },
    { label: 'Village Producer', value: 'village_producer' },
    { label: 'Artisan', value: 'artisan' },
    { label: 'Shop Owner', value: 'shop_owner' },
    { label: 'SHG Group', value: 'shg_group' },
    { label: 'Professional', value: 'professional' },
  ]},
  { key: 'kycStatus', label: 'KYC Status', type: 'enum', options: [
    { label: 'Verified', value: 'verified' },
    { label: 'Pending', value: 'pending' },
    { label: 'Rejected', value: 'rejected' },
  ]},
  { key: 'state', label: 'State', type: 'text' },
  { key: 'totalSales', label: 'Total Sales', type: 'number' },
]

export default function SellersPage() {
  const { execute } = useUndoableAction()
  
  const [sellers, setSellers] = useState<SASellerExtended[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeRules, setActiveRules] = useState<FilterRule[]>([])
  const [selectedSeller, setSelectedSeller] = useState<SASellerExtended | null>(null)

  useEffect(() => {
    async function load() {
      const { data } = await fetchSellersAction()
      setSellers(data as SASellerExtended[] || [])
      setIsLoading(false)
    }
    load()
  }, [])

  const filteredSellers = applyFilterRules(sellers, activeRules, SELLER_FIELDS)

  const columns: Column<SASellerExtended>[] = [
    {
      key: 'shop',
      header: 'Seller',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3 min-w-[220px]">
          {row.avatar ? (
            <img src={row.avatar} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-[#1A1A26] border border-[#2A2A3E] flex items-center justify-center text-sm font-bold text-[#A0A0B8] shrink-0">
              {row.shopName?.charAt(0) || '?'}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-bold text-white truncate">{row.shopName}</p>
            <p className="text-[10px] text-[#8B8B9E] truncate uppercase tracking-wider">{(row.sellerType || '').replace(/_/g, ' ')}</p>
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
          variant={
            row.status === 'active' ? 'success' : 
            row.status === 'suspended' || row.status === 'rejected' ? 'error' : 'warning'
          } 
        />
      ),
    },
    {
      key: 'kycStatus',
      header: 'KYC',
      sortable: true,
      hideOnMobile: true,
      render: (row) => (
        <div className="flex items-center gap-1.5">
          {row.kycStatus === 'verified' ? (
            <span className="flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
              <CheckCircle className="w-3 h-3" /> Verified
            </span>
          ) : row.kycStatus === 'pending' ? (
            <span className="flex items-center gap-1 text-[10px] font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
               <ShieldAlert className="w-3 h-3" /> Pending
            </span>
          ) : (
             <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
               <Ban className="w-3 h-3" /> Rejected
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'tier',
      header: 'Tier',
      sortable: true,
      hideOnMobile: true,
      render: (row) => <TierBadge tier={row.tier} showIcon />,
    },
    {
      key: 'sales',
      header: 'Sales',
      sortable: true,
      hideOnMobile: true,
      render: (row) => (
        <div className="text-sm">
          <p className="font-bold text-white">
            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(row.totalSales || 0)}
          </p>
        </div>
      ),
    }
  ]

  const bulkActions = [
    {
      label: 'Suspend Selected',
      icon: Ban,
      variant: 'danger' as const,
      requireConfirm: {
        title: 'Suspend {count} Sellers',
        description: 'Are you sure you want to suspend {count} sellers? Their products will be hidden from the marketplace immediately.',
        confirmLabel: 'Suspend Sellers'
      },
      onClick: async (selected: SASellerExtended[]) => {
        const ids = selected.map(s => s.id)
        await execute({
          description: `Suspended ${ids.length} sellers`,
          action: async () => {
            const promises = ids.map(id => updateSellerStatusAction(id, 'suspended'))
            await Promise.all(promises)
            setSellers(prev => prev.map(s => ids.includes(s.id) ? { ...s, status: 'suspended' } : s))
            return true
          },
          undoAction: async () => {
            const promises = ids.map(id => updateSellerStatusAction(id, 'active'))
            await Promise.all(promises)
            setSellers(prev => prev.map(s => ids.includes(s.id) ? { ...s, status: 'active' } : s))
          }
        })
      }
    }
  ]

  const exportColumns = [
    { key: 'id', header: 'ID', accessor: (r: SASellerExtended) => r.sellerId },
    { key: 'shop', header: 'Shop Name', accessor: (r: SASellerExtended) => r.shopName },
    { key: 'name', header: 'Owner Name', accessor: (r: SASellerExtended) => r.legalName },
    { key: 'email', header: 'Email', accessor: (r: SASellerExtended) => r.email },
    { key: 'phone', header: 'Phone', accessor: (r: SASellerExtended) => r.phone ?? '' },
    { key: 'status', header: 'Status', accessor: (r: SASellerExtended) => r.status },
    { key: 'kyc', header: 'KYC Status', accessor: (r: SASellerExtended) => r.kycStatus },
    { key: 'tier', header: 'Tier', accessor: (r: SASellerExtended) => r.tier },
    { key: 'sales', header: 'Total Sales', accessor: (r: SASellerExtended) => r.totalSales },
    { key: 'state', header: 'State', accessor: (r: SASellerExtended) => r.state },
  ]

  const handleUpdateStatus = async (status: SASellerExtended['status']) => {
    if (!selectedSeller) return
    const id = selectedSeller.id
    const oldStatus = selectedSeller.status
    await execute({
      description: `Updated seller status to ${status}`,
      action: async () => {
        await updateSellerStatusAction(id, status)
        setSellers(prev => prev.map(s => s.id === id ? { ...s, status } : s))
        return true
      },
      undoAction: async () => {
        await updateSellerStatusAction(id, oldStatus)
        setSellers(prev => prev.map(s => s.id === id ? { ...s, status: oldStatus } : s))
      }
    })
    setSelectedSeller(null)
  }

  if (isLoading) {
    return <div className="p-6 text-white text-sm">Loading sellers...</div>
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight font-sans">Sellers</h1>
          <p className="text-sm text-[#A0A0B8] mt-1">Manage {sellers.length} sellers, verify KYC, and track performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton 
            data={sellers as SASellerExtended[]} 
            visibleData={filteredSellers} 
            columns={exportColumns} 
            filename="bharat_bazaar_sellers" 
          />
        </div>
      </div>

      <div className="space-y-4">
        <SavedViewsBar 
          pageKey="sa-sellers" 
          currentState={{ activeRules }}
          onSelectView={(state) => setActiveRules((state.activeRules as FilterRule[]) || [])}
        />
        
        <DataTable
          data={filteredSellers}
          columns={columns}
          keyExtractor={(row) => row.id}
          searchable
          searchPlaceholder="Search by shop name, seller ID, or phone..."
          searchKeys={['shopName', 'sellerId', 'phone', 'email']}
          pagination={{ pageSize: 15 }}
          bulkActions={bulkActions}
          onRowClick={setSelectedSeller}
          filters={
            <AdvancedFilterBuilder
              fields={SELLER_FIELDS}
              activeRules={activeRules}
              onApply={setActiveRules}
              onClear={() => setActiveRules([])}
            />
          }
        />
      </div>

      <SellerDetailDrawer 
        seller={selectedSeller}
        onClose={() => setSelectedSeller(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  )
}