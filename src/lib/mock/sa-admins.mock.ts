import type { SAAdmin, SAPanelRequest } from '@/types/super-admin.types'
import { buildDefaultGrants } from '@/lib/constants/sa-permissions'

export const MOCK_ADMINS: SAAdmin[] = [
  {
    id: 'adm_000', name: 'Arjun Mehta', email: 'superadmin@bharatbazaar.com',
    role: 'SUPER_ADMIN', status: 'active',
    permissions: buildDefaultGrants('SUPER_ADMIN'),
    createdAt: '2023-01-01T00:00:00Z', lastActive: new Date().toISOString(),
    createdBy: 'System', department: 'Executive',
  },
  {
    id: 'adm_001', name: 'Vikram Singh', email: 'vikram.singh@bharatbazaar.com',
    role: 'SENIOR_ADMIN', status: 'active',
    permissions: buildDefaultGrants('SENIOR_ADMIN'),
    createdAt: '2023-03-10T00:00:00Z', lastActive: new Date(Date.now() - 12 * 60000).toISOString(),
    createdBy: 'Arjun Mehta', department: 'Platform Operations',
  },
  {
    id: 'adm_002', name: 'Neha Kapoor', email: 'neha.kapoor@bharatbazaar.com',
    role: 'FINANCE_ADMIN', status: 'active',
    permissions: buildDefaultGrants('FINANCE_ADMIN'),
    createdAt: '2023-05-22T00:00:00Z', lastActive: new Date(Date.now() - 45 * 60000).toISOString(),
    createdBy: 'Arjun Mehta', department: 'Finance & Accounts',
  },
  {
    id: 'adm_003', name: 'Rahul Deshmukh', email: 'rahul.d@bharatbazaar.com',
    role: 'OPERATIONS_ADMIN', status: 'active',
    permissions: buildDefaultGrants('OPERATIONS_ADMIN'),
    createdAt: '2023-07-01T00:00:00Z', lastActive: new Date(Date.now() - 2 * 3600000).toISOString(),
    createdBy: 'Arjun Mehta', department: 'Order Operations',
  },
  {
    id: 'adm_004', name: 'Sanya Malhotra', email: 'sanya.m@bharatbazaar.com',
    role: 'SUPPORT_ADMIN', status: 'suspended',
    permissions: buildDefaultGrants('SUPPORT_ADMIN'),
    createdAt: '2023-08-14T00:00:00Z', lastActive: '2024-11-02T09:20:00Z',
    createdBy: 'Vikram Singh', department: 'Customer Support',
  },
  {
    id: 'adm_005', name: 'Arun Nair', email: 'arun.nair@bharatbazaar.com',
    role: 'CONTENT_ADMIN', status: 'active',
    permissions: buildDefaultGrants('CONTENT_ADMIN'),
    createdAt: '2024-01-18T00:00:00Z', lastActive: new Date(Date.now() - 5 * 60000).toISOString(),
    createdBy: 'Arjun Mehta', department: 'Catalogue & Content',
  },
  {
    id: 'adm_006', name: 'Divya Rao', email: 'divya.rao@bharatbazaar.com',
    role: 'DELIVERY_ADMIN', status: 'pending',
    permissions: buildDefaultGrants('DELIVERY_ADMIN'),
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), lastActive: '—',
    createdBy: 'Arjun Mehta', department: 'Logistics',
  },
  {
    id: 'adm_007', name: 'Pradeep Kumar', email: 'pradeep.k@bharatbazaar.com',
    role: 'SUPPORT_ADMIN', status: 'active',
    permissions: buildDefaultGrants('SUPPORT_ADMIN'),
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(), lastActive: new Date(Date.now() - 4 * 60000).toISOString(),
    createdBy: 'Vikram Singh', department: 'Customer Support',
  },
  {
    id: 'adm_008', name: 'Aisha Patel', email: 'aisha.p@bharatbazaar.com',
    role: 'CONTENT_ADMIN', status: 'inactive',
    permissions: buildDefaultGrants('CONTENT_ADMIN'),
    createdAt: '2023-11-10T00:00:00Z', lastActive: '2024-02-15T14:30:00Z',
    createdBy: 'Neha Kapoor', department: 'Catalogue & Content',
  },
  {
    id: 'adm_009', name: 'Kabir Ahluwalia', email: 'kabir.a@bharatbazaar.com',
    role: 'CUSTOM_ADMIN', status: 'active',
    permissions: buildDefaultGrants('CUSTOM_ADMIN'),
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), lastActive: new Date().toISOString(),
    createdBy: 'Arjun Mehta', department: 'Special Projects / Cross-Functional',
  }
]

// Cleared for Supabase migration — panel requests will come from real backend
export const MOCK_PANEL_REQUESTS: SAPanelRequest[] = []

// Alias exports to match store import expectations
export const MOCK_SA_ADMINS = MOCK_ADMINS
