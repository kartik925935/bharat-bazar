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
import { useSuperAdminStore } from '@/lib/store/super-admin-store'
import { useSAAuthStore } from '@/lib/store/sa-auth-store'
import type { DashboardActivity, ActivityType } from '@/lib/mock/sa-dashboard.mock'

// Map metric titles to specific Lucide icons
const METRIC_ICONS: Record<string, any> = {
  'Total GMV': IndianRupee,
  'Total Orders': ShoppingBag,
  'Active Sellers': Users,
  'Active Customers': UserCircle,
  'Pending Approvals': AlertCircle,
  'Platform Revenue': Wallet,
}

// Generate random mock activity for the live feed simulation
const MOCK_LIVE_EVENTS = [
  { type: 'new_order', msg: 'placed a new order worth ₹1,200', actor: 'Priya S.' },
  { type: 'seller_approved', msg: 'was approved to start selling', actor: 'Varanasi Silks' },
  { type: 'kyc_submitted', msg: 'uploaded new KYC documents', actor: 'Raju Crafts' },
  { type: 'customer_registered', msg: 'created a new account', actor: 'Rahul Verma' },
  { type: 'product_submitted', msg: 'submitted a new Handicraft item', actor: 'Ali Artisans' },
]

export default function DashboardPage() {
  const { superAdmin } = useSAAuthStore()
  const { 
    financeSummary, orders, sellers, customers, panelRequests,
    refreshDashboard, addActivityEvent 
  } = useSuperAdminStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate initial load
    refreshDashboard().then(() => {
      setIsLoading(false)
    })
  }, [refreshDashboard])

  // Simulate real-time activity feed updates
  useEffect(() => {
    // TODO: replace with Supabase Realtime channel subscription
    const interval = setInterval(() => {
      const randEvent = MOCK_LIVE_EVENTS[Math.floor(Math.random() * MOCK_LIVE_EVENTS.length)]
      const newActivity: DashboardActivity = {
        id: `live-${Date.now()}`,
        type: randEvent.type as ActivityType,
        message: randEvent.msg,
        actorName: randEvent.actor,
        timestamp: new Date().toISOString(),
      }
      addActivityEvent(newActivity)
    }, 25000) // Push a new event every 25s

    return () => clearInterval(interval)
  }, [addActivityEvent])

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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 xl:gap-6"
      >
        {/* TOP METRIC CARDS */}
        {[
          { label: 'Total GMV', value: financeSummary.totalGMV, change: 12.4, changeType: 'increase' as const, period: 'vs last month' },
          { label: 'Total Orders', value: orders.length, change: 8.1, changeType: 'increase' as const, period: 'vs last month' },
          { label: 'Active Sellers', value: sellers.filter(s => s.status === 'active').length, change: 5.6, changeType: 'increase' as const, period: 'vs last month' },
          { label: 'Active Customers', value: customers.filter(c => c.status === 'active').length, change: -2.3, changeType: 'decrease' as const, period: 'vs last month' },
          { label: 'Pending Approvals', value: panelRequests.filter(r => r.status === 'pending').length, change: 0, changeType: 'neutral' as const, period: 'requires action' },
          { label: 'Platform Revenue', value: financeSummary.totalCommission, change: 15.2, changeType: 'increase' as const, period: 'vs last month' },
        ].map((metric, i) => {
          // Special styling mapping based on title
          let format: 'currency' | 'number' | 'percentage' = 'number'
          if (metric.label.includes('GMV') || metric.label.includes('Revenue')) format = 'currency'
          
          let color = '#FF7A00'
          if (metric.label.includes('Orders')) color = '#3B82F6'
          if (metric.label.includes('Customers')) color = '#22C55E'
          if (metric.label.includes('Approvals')) color = '#F59E0B'
          if (metric.label.includes('Revenue')) color = '#A855F7'

          const Icon = METRIC_ICONS[metric.label] || AlertCircle

          return (
            <div key={metric.label} className={i >= 4 ? 'hidden md:block xl:block' : ''}>
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
                onClick={metric.label.includes('Approvals') ? () => {} : undefined} // Make some clickable just for demo
              />
            </div>
          )
        })}

        {/* QUICK ACTIONS - Full width row */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-6">
          <QuickActionsPanel isLoading={isLoading} />
        </div>

        {/* MIDDLE TIER: Charts */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-4 h-full">
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
          <SystemHealthWidget isLoading={isLoading} />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-2 h-[480px]">
          <ActivityFeed isLoading={isLoading} />
        </div>

      </motion.div>
    </div>
  )
}
