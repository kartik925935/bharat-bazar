import { createBrowserClient } from '@supabase/ssr'
import { publicEnv } from '@/config/env.public'

/**
 * Supabase client for use in browser environments (Client Components).
 * It automatically handles browser cookies.
 * 
 * Safe to use in components marked with 'use client'.
 */
export function createClient() {
  return createBrowserClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
