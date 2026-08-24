'use client'
import { useSASessionStore } from '@/lib/store/sa-session-store'
import type { SAAdmin } from '@/types/super-admin.types'

/**
 * Returns the currently logged-in admin's full profile.
 * Returns null if not authenticated.
 * Use this in every component that needs to know who is logged in.
 */
export function useCurrentAdmin(): SAAdmin | null {
  return useSASessionStore((s) => s.currentAdmin)
}

export function useCurrentGrants() {
  return useSASessionStore((s) => s.currentGrants)
}

export function useAllAdmins() {
  return useSASessionStore((s) => s.allAdmins)
}

export function useAllPanelRequests() {
  return useSASessionStore((s) => s.allRequests)
}

export function useIsLoading() {
  return useSASessionStore((s) => s.isLoading)
}
