'use client'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter, useParams } from 'next/navigation'
import type { PanelKey, AccessLevel } from '@/types/super-admin.types'
import { useCurrentAdmin } from '@/lib/hooks/useCurrentAdmin'

interface PanelAccessRestrictedProps {
  panel: PanelKey
  minLevel?: AccessLevel
}

const PANEL_LABELS: Record<PanelKey, string> = {
  'dashboard': 'Dashboard',
  'analytics': 'Analytics',
  'finance': 'Finance',
  'finance.commissions': 'Commissions',
  'finance.settlements': 'Settlements',
  'kyc-verification': 'KYC Verification',
  'products': 'Products',
  'reviews': 'Reviews',
  'sellers': 'Sellers',
  'customers': 'Customers',
  'orders': 'Orders',
  'returns': 'Returns',
  'delivery': 'Delivery',
  'coupons': 'Coupons',
  'offers': 'Offers',
  'panel-requests': 'Panel Requests',
  'settings': 'Settings',
  'storefront': 'Storefront',
  'audit-logs': 'Audit Logs',
  'notifications': 'Notifications',
  'support': 'Support',
  'admin-control': 'Admin Control',
}

export function PanelAccessRestricted({ panel, minLevel = 'view' }: PanelAccessRestrictedProps) {
  const admin = useCurrentAdmin()
  const router = useRouter()
  const params = useParams<{ saToken: string }>()

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <Lock className="w-8 h-8 text-red-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
      <p className="text-gray-500 mb-1 max-w-sm">
        You need at least <span className="font-semibold text-gray-700 capitalize">{minLevel}</span> access to{' '}
        <span className="font-semibold text-gray-700">{PANEL_LABELS[panel]}</span>.
      </p>
      {admin && (
        <p className="text-sm text-gray-400 mb-6">
          Your current role: <span className="font-medium text-gray-500">{admin.role.replace(/_/g, ' ')}</span>
        </p>
      )}
      <Button
        onClick={() =>
          router.push(`/${params?.saToken}/my-access?panel=${panel}`)
        }
        className="bg-[#FF7A00] hover:bg-[#FF4500] text-white rounded-xl"
      >
        Request Access
      </Button>
    </div>
  )
}
