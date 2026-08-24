import type { SAAdminRole, PanelKey, SAPanelAccessGrant } from '@/types/super-admin.types'

/** Panels that only SUPER_ADMIN may access — other roles cannot be granted these */
export const SUPER_ADMIN_ONLY_PANELS: PanelKey[] = ['audit-logs', 'settings', 'panel-requests']

const PANEL_KEYS: PanelKey[] = [
  'dashboard', 'analytics', 'finance', 'finance.commissions', 'finance.settlements',
  'kyc-verification', 'products', 'reviews', 'sellers', 'customers', 'orders', 'returns',
  'delivery', 'coupons', 'offers', 'panel-requests', 'settings', 'storefront', 'audit-logs'
]

export function buildDefaultGrants(role: SAAdminRole): SAPanelAccessGrant[] {
  const grants: Partial<Record<PanelKey, SAPanelAccessGrant['level']>> = {}

  switch (role) {
    case 'SUPER_ADMIN':
      // ALL panels -> full
      PANEL_KEYS.forEach(panel => {
        grants[panel] = 'full'
      })
      break

    case 'SENIOR_ADMIN':
      grants['dashboard'] = 'full'
      grants['analytics'] = 'full'
      grants['sellers'] = 'full'
      grants['customers'] = 'full'
      grants['products'] = 'edit'
      grants['kyc-verification'] = 'edit'
      grants['orders'] = 'edit'
      grants['returns'] = 'edit'
      grants['reviews'] = 'view'
      grants['panel-requests'] = 'view'
      grants['audit-logs'] = 'view'
      grants['settings'] = 'view'
      break

    case 'FINANCE_ADMIN':
      grants['dashboard'] = 'view'
      grants['analytics'] = 'view'
      grants['finance'] = 'full'
      grants['finance.commissions'] = 'full'
      grants['finance.settlements'] = 'full'
      grants['audit-logs'] = 'view'
      break

    case 'OPERATIONS_ADMIN':
      grants['dashboard'] = 'view'
      grants['orders'] = 'full'
      grants['returns'] = 'full'
      grants['delivery'] = 'full'
      grants['sellers'] = 'view'
      grants['products'] = 'view'
      break

    case 'SUPPORT_ADMIN':
      grants['dashboard'] = 'view'
      grants['orders'] = 'view'
      grants['returns'] = 'view'
      grants['customers'] = 'view'
      grants['reviews'] = 'edit'
      break

    case 'CONTENT_ADMIN':
      grants['dashboard'] = 'view'
      grants['products'] = 'full'
      grants['reviews'] = 'full'
      grants['storefront'] = 'full'
      grants['coupons'] = 'edit'
      grants['offers'] = 'edit'
      break

    case 'DELIVERY_ADMIN':
      grants['dashboard'] = 'view'
      grants['delivery'] = 'full'
      grants['orders'] = 'view'
      break

    case 'CUSTOM_ADMIN':
      grants['dashboard'] = 'view'
      break
  }

  // Convert map to array format
  return Object.entries(grants).map(([panel, level]) => ({
    panel: panel as PanelKey,
    level: level as SAPanelAccessGrant['level'],
    source: 'default'
  }))
}
