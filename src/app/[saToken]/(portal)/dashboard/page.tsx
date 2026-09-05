'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  IndianRupee, ShoppingBag, Users, UserCircle, AlertCircle, Wallet 
} from 'lucide-react'
import { PageHeader } from '@/components/super-admin/shared/PageHeader'
import { StatCard } from '@/components/super-admin/shared/StatCard'
import { RevenueChart } from '@/components/super-admin/dashboard/RevenueChart'
import { CategoryBreakdownChart } from '@/components/super-admin/dashboard/CategoryBreakdownChart'
import { TopSellersWidget } from '@/components/super-admin/dashboard/TopSellersWidget'
import { ActivityFeed } from '@/components/super-admin/dashboard/ActivityFeed'
import { QuickActionsPanel } from '@/components/super-admin/dashboard/QuickActionsPanel'
import { SystemHealthWidget } from '@/components/super-admin/dashboard/SystemHealthWidget'
import { useSAAuthStore } from '@/lib/store/sa-auth-store'
import { fetchDashboardAction } from '@/actions/super-admin/queries'

// Map metric titles to specific Lucide icons
const METRIC_ICONS: Record<string, any> = {
  'Total GMV': IndianRupee,
  'Active Orders': ShoppingBag,
  'Active Sellers': Users,
  'Pending KYC': AlertCircle,
}

export default function DashboardPage() {
  const { superAdmin } = useSAAuthStore()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalGmv: 0,
    activeOrders: 0,
    activeSellers: 0,
    pendingKyc: 0,
  })

  useEffect(() => {
    async function loadStats() {
      const res = await fetchDashboardAction()
      if (res.data) {
        setStats({
          totalGmv: res.data.totalGmv || 0,
          activeOrders: res.data.activeOrders || 0,
          activeSellers: res.data.activeSellers || 0,
          pendingKyc: res.data.pendingKyc || 0,
        })
      }
      setIsLoading(false)
    }
    loadStats()
  }, [])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  }

  return (
    <div className="space-y-6 max-w-[1920px] mx-auto pb-safe">
      <PageHeader 
        title="Dashboard" 
        description={`${getGreeting()}, ${superAdmin?.name?.split(' ')[0] || 'Admin'}`} 
      />

      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show" 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-6"
      >
        {/* TOP METRIC CARDS */}
        {[
          { label: 'Total GMV', value: stats.totalGmv, change: 0, changeType: 'neutral' as const, period: 'all time' },
          { label: 'Active Orders', value: stats.activeOrders, change: 0, changeType: 'neutral' as const, period: 'currently' },
          { label: 'Active Sellers', value: stats.activeSellers, change: 0, changeType: 'neutral' as const, period: 'currently' },
          { label: 'Pending KYC', value: stats.pendingKyc, change: 0, changeType: 'neutral' as const, period: 'requires action' },
        ].map((metric, i) => {
          let format: 'currency' | 'number' | 'percentage' = 'number'
          if (metric.label.includes('GMV') || metric.label.includes('Revenue')) format = 'currency'
          
          let color = '#FF7A00'
          if (metric.label.includes('Orders')) color = '#3B82F6'
          if (metric.label.includes('Sellers')) color = '#22C55E'
          if (metric.label.includes('KYC')) color = '#F59E0B'

          const Icon = METRIC_ICONS[metric.label] || AlertCircle

          return (
            <div key={metric.label}>
              <StatCard
                label={metric.label}
                value={metric.value}
                format={format}
                change={metric.change}
                changeType={metric.changeType}
                period={metric.period}
                icon={Icon}
                iconColor={color}
                isLoading={isLoading}
                delay={i}
              />
            </div>
          )
        })}

        {/* QUICK ACTIONS - Full width row */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4">
          <QuickActionsPanel isLoading={isLoading} />
        </div>

        {/* MIDDLE TIER: Charts */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2 h-full">
          <RevenueChart isLoading={isLoading} />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-2 h-full">
          <CategoryBreakdownChart isLoading={isLoading} />
        </div>

        {/* BOTTOM TIER: Widgets */}
        <div className="col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-2 h-full">
          <TopSellersWidget isLoading={isLoading} />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-2 h-full">
          <ActivityFeed isLoading={isLoading} />
        </div>

      </motion.div>
    </div>
  )
}
