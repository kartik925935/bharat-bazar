'use client'
import React, { useEffect, useState } from 'react'

import { 
  getAnalyticsRevenue, getGeographicData, getFunnelData, getCohortData, 
  getSellerGrowth, getProductHealth, getPlatformHealth 
} from '@/lib/store/selectors/analytics.selectors'
import { PlatformHealthCard } from '@/components/super-admin/analytics/PlatformHealthCard'
import { RevenueChart } from '@/components/super-admin/analytics/RevenueChart'
import { ConversionFunnel } from '@/components/super-admin/analytics/ConversionFunnel'
import { CohortChart } from '@/components/super-admin/analytics/CohortChart'
import { GeographicBreakdown } from '@/components/super-admin/analytics/GeographicBreakdown'
import { SellerGrowthChart, ProductHealthCard } from '@/components/super-admin/analytics/SellerGrowthChart'

import { fetchOrdersAction, fetchSellersAction, fetchCustomersAction, fetchProductsAction } from '@/actions/super-admin/queries'

export default function AnalyticsPage() {
  const [revenueGranularity, setRevenueGranularity] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [geographyMetric, setGeographyMetric] = useState<'gmv' | 'orders' | 'activeSellers' | 'activeCustomers'>('gmv')

  const exportAnalyticsReport = (type: string) => {
    // Basic CSV export logic
    const dataStr = "data:text/csv;charset=utf-8,Type,Value\n" + type + ",Data"
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href", encodeURI(dataStr))
    downloadAnchorNode.setAttribute("download", `analytics_${type}.csv`)
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  const [dbData, setDbData] = useState<{
    orders: any[],
    sellers: any[],
    customers: any[],
    products: any[]
  }>({
    orders: [],
    sellers: [],
    customers: [],
    products: []
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const [ordersRes, sellersRes, customersRes, productsRes] = await Promise.all([
        fetchOrdersAction(),
        fetchSellersAction(),
        fetchCustomersAction(),
        fetchProductsAction()
      ])
      
      setDbData({
        orders: ordersRes.data || [],
        sellers: sellersRes.data || [],
        customers: customersRes.data || [],
        products: productsRes.data || []
      })
      setIsLoading(false)
    }
    loadData()
  }, [])

  const { orders, sellers, customers, products } = dbData

  // Compute live data
  const revenueSeries = React.useMemo(
    () => getAnalyticsRevenue({ orders: orders as any, settlements: [] }, revenueGranularity),
    [orders, revenueGranularity]
  )

  const geographicData = React.useMemo(
    () => getGeographicData({ orders: orders as any, sellers: sellers as any, customers: customers as any }),
    [orders, sellers, customers]
  )

  const funnelData = React.useMemo(() => getFunnelData({ customers: customers as any, orders: orders as any }), [customers, orders])
  const cohortData = React.useMemo(() => getCohortData({ customers: customers as any }), [customers])
  const sellerGrowth = React.useMemo(() => getSellerGrowth({ sellers: sellers as any }), [sellers])
  const productHealth = React.useMemo(() => getProductHealth({ products: products as any }), [products])
  const platformHealth = React.useMemo(() => getPlatformHealth(), [])

  if (isLoading) {
    return <div className="p-6 text-white text-sm">Loading analytics...</div>
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 overflow-y-auto h-full bg-[#09090B]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Deep Analytics</h1>
        <p className="text-sm text-[#6B6B80] mt-1">
          Platform intelligence & business metrics
        </p>
      </div>

      {/* Section 1 — Platform Health */}
      <PlatformHealthCard health={platformHealth} />

      {/* Section 2 — Revenue Overview */}
      <RevenueChart
        data={revenueSeries}
        granularity={revenueGranularity}
        onGranularityChange={setRevenueGranularity}
        onExport={() => exportAnalyticsReport('revenue')}
      />

      {/* Section 3 — Conversion Funnel */}
      <ConversionFunnel data={funnelData} />

      {/* Section 4 — Cohort Retention */}
      <CohortChart data={cohortData} />

      {/* Section 5 — Geographic */}
      <GeographicBreakdown
        data={geographicData}
        metric={geographyMetric}
        onMetricChange={setGeographyMetric}
      />

      {/* Section 6 — Seller Growth & Product Health */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SellerGrowthChart data={sellerGrowth} />
        <ProductHealthCard health={productHealth} />
      </div>

      {/* Export row */}
      <div className="flex flex-wrap gap-3 pb-4">
        <button
          onClick={() => exportAnalyticsReport('revenue')}
          className="px-4 py-2 bg-[#111118] border border-[#1E1E2E] hover:border-[#FF7A00]/30 text-[#A0A0B8] hover:text-white rounded-xl text-sm transition-all"
        >
          Export Revenue CSV
        </button>
        <button
          onClick={() => exportAnalyticsReport('geographic')}
          className="px-4 py-2 bg-[#111118] border border-[#1E1E2E] hover:border-[#FF7A00]/30 text-[#A0A0B8] hover:text-white rounded-xl text-sm transition-all"
        >
          Export Geographic CSV
        </button>
        <button
          onClick={() => exportAnalyticsReport('seller_growth')}
          className="px-4 py-2 bg-[#111118] border border-[#1E1E2E] hover:border-[#FF7A00]/30 text-[#A0A0B8] hover:text-white rounded-xl text-sm transition-all"
        >
          Export Seller Growth CSV
        </button>
      </div>
    </div>
  )
}