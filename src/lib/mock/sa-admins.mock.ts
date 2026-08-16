import type { SAAdmin, SAPanelRequest } from '@/types/super-admin.types'
import { DEFAULT_ROLE_PERMISSIONS } from '@/lib/constants/sa-permissions'

export const MOCK_ADMINS: SAAdmin[] = [
  {
    id: 'adm_001', name: 'Vikram Singh', email: 'vikram.singh@bharatbazaar.com',
    role: 'SENIOR_ADMIN', status: 'active',
    permissions: DEFAULT_ROLE_PERMISSIONS.SENIOR_ADMIN,
    createdAt: '2023-03-10T00:00:00Z', lastActive: new Date(Date.now() - 12 * 60000).toISOString(),
    createdBy: 'Arjun Mehta', department: 'Platform Operations',
  },
  {
    id: 'adm_002', name: 'Neha Kapoor', email: 'neha.kapoor@bharatbazaar.com',
    role: 'FINANCE_ADMIN', status: 'active',
    permissions: DEFAULT_ROLE_PERMISSIONS.FINANCE_ADMIN,
    createdAt: '2023-05-22T00:00:00Z', lastActive: new Date(Date.now() - 45 * 60000).toISOString(),
    createdBy: 'Arjun Mehta', department: 'Finance & Accounts',
  },
  {
    id: 'adm_003', name: 'Rahul Deshmukh', email: 'rahul.d@bharatbazaar.com',
    role: 'OPERATIONS_ADMIN', status: 'active',
    permissions: DEFAULT_ROLE_PERMISSIONS.OPERATIONS_ADMIN,
    createdAt: '2023-07-01T00:00:00Z', lastActive: new Date(Date.now() - 2 * 3600000).toISOString(),
    createdBy: 'Arjun Mehta', department: 'Order Operations',
  },
  {
    id: 'adm_004', name: 'Sanya Malhotra', email: 'sanya.m@bharatbazaar.com',
    role: 'SUPPORT_ADMIN', status: 'suspended',
    permissions: DEFAULT_ROLE_PERMISSIONS.SUPPORT_ADMIN,
    createdAt: '2023-08-14T00:00:00Z', lastActive: '2024-11-02T09:20:00Z',
    createdBy: 'Vikram Singh', department: 'Customer Support',
  },
  {
    id: 'adm_005', name: 'Arun Nair', email: 'arun.nair@bharatbazaar.com',
    role: 'CONTENT_ADMIN', status: 'active',
    permissions: DEFAULT_ROLE_PERMISSIONS.CONTENT_ADMIN,
    createdAt: '2024-01-18T00:00:00Z', lastActive: new Date(Date.now() - 5 * 60000).toISOString(),
    createdBy: 'Arjun Mehta', department: 'Catalogue & Content',
  },
  {
    id: 'adm_006', name: 'Divya Rao', email: 'divya.rao@bharatbazaar.com',
    role: 'DELIVERY_ADMIN', status: 'pending',
    permissions: DEFAULT_ROLE_PERMISSIONS.DELIVERY_ADMIN,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), lastActive: '—',
    createdBy: 'Arjun Mehta', department: 'Logistics',
  },
  {
    id: 'adm_007', name: 'Pradeep Kumar', email: 'pradeep.k@bharatbazaar.com',
    role: 'SUPPORT_ADMIN', status: 'active',
    permissions: DEFAULT_ROLE_PERMISSIONS.SUPPORT_ADMIN,
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(), lastActive: new Date(Date.now() - 4 * 60000).toISOString(),
    createdBy: 'Vikram Singh', department: 'Customer Support',
  },
  {
    id: 'adm_008', name: 'Aisha Patel', email: 'aisha.p@bharatbazaar.com',
    role: 'CONTENT_ADMIN', status: 'inactive',
    permissions: DEFAULT_ROLE_PERMISSIONS.CONTENT_ADMIN,
    createdAt: '2023-11-10T00:00:00Z', lastActive: '2024-02-15T14:30:00Z',
    createdBy: 'Neha Kapoor', department: 'Catalogue & Content',
  }
]

export const MOCK_PANEL_REQUESTS: SAPanelRequest[] = [
  {
    id: 'req_001', adminId: 'adm_003', adminName: 'Rahul Deshmukh', adminEmail: 'rahul.d@bharatbazaar.com',
    adminRole: 'OPERATIONS_ADMIN', requestedPanel: 'finance', requestedLevel: 'view',
    reason: 'Need visibility into settlement status to resolve seller payment disputes faster without escalating every time.',
    status: 'pending', requestedAt: new Date(Date.now() - 3 * 3600000).toISOString(),
  },
  {
    id: 'req_002', adminId: 'adm_005', adminName: 'Arun Nair', adminEmail: 'arun.nair@bharatbazaar.com',
    adminRole: 'CONTENT_ADMIN', requestedPanel: 'coupons', requestedLevel: 'edit',
    reason: 'Running a festival content campaign and need to create matching promotional coupons directly.',
    status: 'pending', requestedAt: new Date(Date.now() - 8 * 3600000).toISOString(),
  },
  {
    id: 'req_003', adminId: 'adm_004', adminName: 'Sanya Malhotra', adminEmail: 'sanya.m@bharatbazaar.com',
    adminRole: 'SUPPORT_ADMIN', requestedPanel: 'orders', requestedLevel: 'edit',
    reason: 'Support team needs to directly cancel/modify stuck orders instead of routing to Ops team.',
    status: 'approved', requestedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    reviewedAt: new Date(Date.now() - 4 * 86400000).toISOString(), reviewedBy: 'Arjun Mehta',
    reviewNote: 'Approved for 3-month trial period.',
  },
  {
    id: 'req_004', adminId: 'adm_006', adminName: 'Divya Rao', adminEmail: 'divya.rao@bharatbazaar.com',
    adminRole: 'DELIVERY_ADMIN', requestedPanel: 'customers', requestedLevel: 'view',
    reason: 'Need customer contact details to coordinate failed delivery attempts.',
    status: 'rejected', requestedAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    reviewedAt: new Date(Date.now() - 5 * 86400000).toISOString(), reviewedBy: 'Arjun Mehta',
    reviewNote: 'Use the Delivery panel customer snippet instead — full customer data access not required for this role.',
  },
  {
    id: 'req_005', adminId: 'adm_007', adminName: 'Pradeep Kumar', adminEmail: 'pradeep.k@bharatbazaar.com',
    adminRole: 'SUPPORT_ADMIN', requestedPanel: 'reviews', requestedLevel: 'full',
    reason: 'Need full access to delete inappropriate spam reviews flagged by customers.',
    status: 'pending', requestedAt: new Date(Date.now() - 1 * 3600000).toISOString(),
  }
]

// Alias exports to match store import expectations
export const MOCK_SA_ADMINS = MOCK_ADMINS
