'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { UserPlus, Users, UserCheck, UserX, Clock } from 'lucide-react'
import { PageHeader } from '@/components/super-admin/shared/PageHeader'
import { StatCard } from '@/components/super-admin/shared/StatCard'
import { AdminsTable } from '@/components/super-admin/admin-control/AdminsTable'
import { AdminDetailDrawer } from '@/components/super-admin/admin-control/AdminDetailDrawer'
import { CreateAdminModal } from '@/components/super-admin/admin-control/CreateAdminModal'
import { useSAStore } from '@/lib/store/super-admin-store'
import type { SAAdmin } from '@/types/super-admin.types'

export default function AdminControlPage() {
  const { admins } = useSAStore()
  const searchParams = useSearchParams()
  const [selectedAdmin, setSelectedAdmin] = useState<SAAdmin | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500)
    // Deep-link: auto-open create modal if ?action=create
    if (searchParams.get('action') === 'create') {
      setShowCreateModal(true)
    }
  }, [searchParams])

  const totalAdmins = admins.length
  const activeAdmins = admins.filter((a) => a.status === 'active').length
  const suspendedAdmins = admins.filter((a) => a.status === 'suspended').length
  const pendingAdmins = admins.filter((a) => a.status === 'pending').length

  const stats = [
    { label: 'Total Admins', value: totalAdmins, icon: Users, color: '#A855F7' },
    { label: 'Active', value: activeAdmins, icon: UserCheck, color: '#22C55E' },
    { label: 'Suspended', value: suspendedAdmins, icon: UserX, color: '#EF4444' },
    { label: 'Pending Invites', value: pendingAdmins, icon: Clock, color: '#F59E0B' },
  ]

  return (
    <div className="space-y-6 pb-safe">
      <PageHeader
        title="Admin Control"
        description="Manage sub-admins, roles, and panel-level permissions"
      >
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 h-9 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4500] text-white text-sm font-bold shadow-lg shadow-[#FF7A00]/20 hover:shadow-[#FF7A00]/30 transition-shadow"
        >
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Create Admin</span>
        </button>
      </PageHeader>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            format="number"
            icon={stat.icon}
            iconColor={stat.color}
            isLoading={isLoading}
            delay={i}
          />
        ))}
      </div>

      {/* Admins Table */}
      <AdminsTable onRowClick={setSelectedAdmin} />

      {/* Admin Detail Drawer */}
      {selectedAdmin && (
        <AdminDetailDrawer
          admin={selectedAdmin}
          onClose={() => setSelectedAdmin(null)}
        />
      )}

      {/* Create Admin Modal */}
      <CreateAdminModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  )
}