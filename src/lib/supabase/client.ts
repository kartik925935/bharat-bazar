import { createBrowserClient } from '@supabase/ssr'

/**
 * Supabase client for use in browser environments (Client Components).
 * It automatically handles browser cookies.
 * 
 * Safe to use in components marked with 'use client'.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
