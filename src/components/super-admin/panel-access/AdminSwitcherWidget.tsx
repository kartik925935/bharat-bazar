'use client'
import { useAllAdmins } from '@/lib/hooks/useCurrentAdmin'
import { useSASessionStore } from '@/lib/store/sa-session-store'
import { cn } from '@/lib/utils'
import type { SAAdmin } from '@/types/super-admin.types'

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: 'bg-purple-100 text-purple-700',
  SENIOR_ADMIN: 'bg-indigo-100 text-indigo-700',
  FINANCE_ADMIN: 'bg-green-100 text-green-700',
  OPERATIONS_ADMIN: 'bg-blue-100 text-blue-700',
  SUPPORT_ADMIN: 'bg-teal-100 text-teal-700',
  CONTENT_ADMIN: 'bg-orange-100 text-orange-700',
  DELIVERY_ADMIN: 'bg-yellow-100 text-yellow-700',
  CUSTOM_ADMIN: 'bg-gray-100 text-gray-700',
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

interface AdminSwitcherWidgetProps {
  onClose?: () => void
}

export function AdminSwitcherWidget({ onClose }: AdminSwitcherWidgetProps) {
  const allAdmins = useAllAdmins()
  const switchAdminDev = useSASessionStore((s) => s.switchAdminDev)
  const currentAdminId = useSASessionStore((s) => s.currentAdminId)

  const handleSwitch = (admin: SAAdmin) => {
    switchAdminDev(admin.id)
    onClose?.()
  }

  return (
    <div className="grid grid-cols-2 gap-2 p-1">
      {allAdmins.map((admin) => (
        <button
          key={admin.id}
          onClick={() => handleSwitch(admin)}
          className={cn(
            'flex items-center gap-2.5 p-2.5 rounded-xl border-2 text-left transition-all hover:shadow-md',
            currentAdminId === admin.id
              ? 'border-orange-400 bg-orange-50'
              : 'border-gray-100 hover:border-gray-200 bg-white'
          )}
        >
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {getInitials(admin.name)}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-800 truncate">{admin.name}</p>
            <span className={cn(
              'inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full mt-0.5',
              ROLE_COLORS[admin.role] ?? 'bg-gray-100 text-gray-600'
            )}>
              {admin.role.replace(/_/g, ' ')}
            </span>
          </div>
        </button>
      ))}
    </div>
  )
}
