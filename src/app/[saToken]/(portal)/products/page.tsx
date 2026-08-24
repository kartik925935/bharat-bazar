'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Plus, Upload, CheckCircle2, XCircle } from 'lucide-react'
import { DataTable, Column } from '@/components/super-admin/shared/DataTable'
import { ExportButton } from '@/components/super-admin/shared/ExportButton'
import { AdvancedFilterBuilder, FilterField, FilterRule, applyFilterRules } from '@/components/super-admin/shared/AdvancedFilterBuilder'
import { SavedViewsBar } from '@/components/super-admin/shared/SavedViewsBar'
import { StatusBadge } from '@/components/super-admin/shared/StatusBadge'
import { ProductReviewModal } from '@/components/super-admin/products/ProductReviewModal'
import { BulkImportModal } from '@/components/super-admin/products/BulkImportModal'
import { getAdminProducts, updateProductStatus as serverUpdateProductStatus, ProductStatus as ServerProductStatus } from '@/actions/products/admin-actions'
import { toast } from 'sonner'
import { useUndoableAction } from '@/lib/hooks/useUndoableAction'
import { formatCurrency, formatRelativeTime } from '@/lib/utils/formatters'
import { cn } from '@/lib/utils'
import type { SAProductDetail } from '@/types/super-admin.types'

const PRODUCT_FIELDS: FilterField[] = [
  { key: 'name', label: 'Product Name', type: 'text' },
  { key: 'sku', label: 'SKU', type: 'text' },
  { key: 'category', label: 'Category', type: 'enum', options: [
    { label: 'Clothing & Apparel', value: 'Clothing & Apparel' },
    { label: 'Home Decor', value: 'Home Decor' },
    { label: 'Jewelry', value: 'Jewelry' },
    { label: 'Food & Spices', value: 'Food & Spices' },
    { label: 'Art & Collectibles', value: 'Art & Collectibles' },
  ]},
  { key: 'status', label: 'Status', type: 'enum', options: [
    { label: 'Published', value: 'published' },
    { label: 'Pending Review', value: 'pending_review' },
    { label: 'Draft', value: 'draft' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Suspended', value: 'suspended' },
  ]},
  { key: 'price', label: 'Price', type: 'number' },
  { key: 'stock', label: 'Stock', type: 'number' },
  { key: 'completenessScore', label: 'Completeness', type: 'number' },
]

export default function ProductsPage() {
  const { execute } = useUndoableAction()
  
  const [activeRules, setActiveRules] = useState<FilterRule[]>([])
  const [selectedProduct, setSelectedProduct] = useState<SAProductDetail | null>(null)
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false)
  const [products, setProducts] = useState<SAProductDetail[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()

  const fetchProducts = async () => {
    setIsLoading(true)
    const result = await getAdminProducts()
    if (result.error) {
      toast.error('Failed to load products: ' + result.error)
    } else {
      setProducts(result.data || [])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts()
  }, [])

  useEffect(() => {
    const productId = searchParams.get('productId')
    if (productId && products.length > 0) {
      const prod = products.find(p => p.id === productId)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (prod) setSelectedProduct(prod as SAProductDetail)
    }
  }, [searchParams, products])

  const updateProductStatusLocal = async (id: string, status: ServerProductStatus, reason?: string) => {
    // Optimistic update
    setProducts(current => current.map(p => p.id === id ? { ...p, status: status as any } : p))
    const res = await serverUpdateProductStatus(id, status, reason)
    if (!res.success) {
      toast.error('Failed to update status: ' + res.error)
      // Revert on failure by refetching
      fetchProducts()
      throw new Error(res.error)
    }
  }

  const filteredProducts = applyFilterRules(products as SAProductDetail[], activeRules, PRODUCT_FIELDS)

  const columns: Column<SAProductDetail>[] = [
    {
      key: 'product',
      header: 'Product',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3 min-w-[240px]">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#1A1A26] border border-[#2A2A3E] shrink-0">
            {row.images && row.images[0] ? (
              <img src={row.images[0]} alt="" className="w-full h-full object-cover" />
            ) : null}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-white truncate">{row.name}</p>
            <p className="text-[10px] text-[#8B8B9E] truncate">SKU: {row.sku} • {row.category}</p>
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
            row.status === 'published' ? 'success' : 
            row.status === 'rejected' || row.status === 'suspended' ? 'error' : 'warning'
          } 
        />
      ),
    },
    {
      key: 'price',
      header: 'Price / Stock',
      sortable: true,
      hideOnMobile: true,
      render: (row) => (
        <div>
          <p className="text-sm font-bold text-white flex items-center gap-1.5">
            {formatCurrency(row.price)}
            {row.priceAnomalyFlag && <span className="w-2 h-2 rounded-full bg-red-500" title="Price anomaly detected" />}
          </p>
          <p className="text-[10px] text-[#A0A0B8]">Stock: {row.stock}</p>
        </div>
      ),
    },
    {
      key: 'score',
      header: 'Completeness',
      sortable: true,
      hideOnMobile: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-[#1A1A26] rounded-full overflow-hidden">
            <div 
              className={cn("h-full rounded-full transition-all", row.completenessScore >= 80 ? 'bg-green-500' : row.completenessScore >= 50 ? 'bg-amber-500' : 'bg-red-500')}
              style={{ width: `${Math.min(row.completenessScore, 100)}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-[#A0A0B8]">{row.completenessScore}%</span>
        </div>
      ),
    },
    {
      key: 'updatedAt',
      header: 'Last Updated',
      sortable: true,
      hideOnMobile: true,
      render: (row) => (
        <span className="text-xs text-[#A0A0B8]">{formatRelativeTime(row.updatedAt)}</span>
      )
    },
    {
      key: 'action',
      header: '',
      render: (row) => (
        <button 
          onClick={(e) => { e.stopPropagation(); setSelectedProduct(row) }}
          className="px-3 py-1.5 rounded-lg bg-[#2A2A3E] text-white text-xs font-bold hover:bg-[#3A3A50] transition-colors"
        >
          {row.status === 'pending_review' ? 'Review' : 'View'}
        </button>
      )
    }
  ]

  const bulkActions = [
    {
      label: 'Approve Selected',
      icon: CheckCircle2,
      requireConfirm: {
        title: 'Approve {count} Products',
        description: 'Are you sure you want to approve and publish {count} products? They will go live immediately.',
        confirmLabel: 'Approve & Publish'
      },
      onClick: async (selected: SAProductDetail[]) => {
        const ids = selected.map(s => s.id)
        await execute({
          description: `Approved ${ids.length} products`,
          action: async () => {
            for (const id of ids) await updateProductStatusLocal(id, 'published')
            return true
          },
          undoAction: async () => {
            for (const id of ids) await updateProductStatusLocal(id, 'pending_review')
          }
        })
      }
    },
    {
      label: 'Suspend Selected',
      icon: XCircle,
      variant: 'danger' as const,
      requireConfirm: {
        title: 'Suspend {count} Products',
        description: 'Are you sure you want to suspend {count} products? They will be hidden from the marketplace.',
        confirmLabel: 'Suspend Products'
      },
      onClick: async (selected: SAProductDetail[]) => {
        const ids = selected.map(s => s.id)
        await execute({
          description: `Suspended ${ids.length} products`,
          action: async () => {
            for (const id of ids) await updateProductStatusLocal(id, 'suspended')
            return true
          },
          undoAction: async () => {
            for (const id of ids) await updateProductStatusLocal(id, 'published')
          }
        })
      }
    }
  ]

  const exportColumns = [
    { key: 'id', header: 'Product ID', accessor: (r: SAProductDetail) => r.id },
    { key: 'sku', header: 'SKU', accessor: (r: SAProductDetail) => r.sku },
    { key: 'name', header: 'Product Name', accessor: (r: SAProductDetail) => r.name },
    { key: 'category', header: 'Category', accessor: (r: SAProductDetail) => r.category },
    { key: 'seller', header: 'Seller', accessor: (r: SAProductDetail) => r.sellerName },
    { key: 'status', header: 'Status', accessor: (r: SAProductDetail) => r.status },
    { key: 'mrp', header: 'MRP', accessor: (r: SAProductDetail) => r.mrp },
    { key: 'price', header: 'Price', accessor: (r: SAProductDetail) => r.price },
    { key: 'stock', header: 'Stock', accessor: (r: SAProductDetail) => r.stock },
    { key: 'score', header: 'Completeness Score', accessor: (r: SAProductDetail) => r.completenessScore },
  ]

  const handleApprove = async (id: string) => {
    await execute({
      description: 'Approved product listing',
      action: async () => { await updateProductStatusLocal(id, 'published'); return true; },
      undoAction: async () => { await updateProductStatusLocal(id, 'pending_review'); }
    })
    setSelectedProduct(null)
  }

  const handleReject = async (id: string, reason: string) => {
    await execute({
      description: 'Rejected product listing',
      action: async () => { await updateProductStatusLocal(id, 'rejected', reason); return true; },
      undoAction: async () => { await updateProductStatusLocal(id, 'pending_review'); }
    })
    setSelectedProduct(null)
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight font-sans">Products</h1>
          <p className="text-sm text-[#A0A0B8] mt-1">Manage catalogue, review new listings, and monitor pricing.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsBulkImportOpen(true)}
            className="h-10 px-4 rounded-xl bg-[#1A1A26] border border-[#2A2A3E] text-white text-sm font-bold flex items-center gap-2 hover:bg-[#2A2A3E] transition-colors"
          >
            <Upload className="w-4 h-4" /> Import CSV
          </button>
          <ExportButton 
            data={products as SAProductDetail[]} 
            visibleData={filteredProducts} 
            columns={exportColumns} 
            filename="bharat_bazaar_products" 
          />
        </div>
      </div>

      <div className="space-y-4">
        <SavedViewsBar 
          pageKey="sa-products" 
          currentState={{ activeRules }}
          onSelectView={(state) => setActiveRules((state.activeRules as FilterRule[]) || [])}
        />
        
        <DataTable
          data={filteredProducts}
          columns={columns}
          keyExtractor={(row) => row.id}
          searchable
          searchPlaceholder="Search products by name or SKU..."
          searchKeys={['name', 'sku']}
          pagination={{ pageSize: 15 }}
          bulkActions={bulkActions}
          onRowClick={setSelectedProduct}
          filters={
            <AdvancedFilterBuilder
              fields={PRODUCT_FIELDS}
              activeRules={activeRules}
              onApply={setActiveRules}
              onClear={() => setActiveRules([])}
            />
          }
        />
      </div>

      <ProductReviewModal 
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        onUpdateStatus={async (id, status) => {
          const oldStatus = selectedProduct?.status || 'pending_review'
          await execute({
            description: `Updated product status to ${status.replace('_', ' ')}`,
            action: async () => { await updateProductStatusLocal(id, status as ServerProductStatus); return true; },
            undoAction: async () => { await updateProductStatusLocal(id, oldStatus as ServerProductStatus); }
          })
          setSelectedProduct(null)
        }}
      />

      <BulkImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        onImport={async (file) => {
          // Mock import delay
          await new Promise(resolve => setTimeout(resolve, 2000))
        }}
      />
    </div>
  )
}