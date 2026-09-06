import 'server-only'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { publicEnv } from '@/config/env.public'
import { serverEnv } from '@/config/env.server'

if (typeof globalThis.WebSocket === 'undefined') {
  (globalThis as any).WebSocket = class WebSocket {}
}

/**
 * Service Role client with full administrative privileges.
 * Bypasses Row Level Security (RLS) entirely.
 * 
 * WARNING: MUST NEVER be exposed to the browser or used in Client Components.
 * Use strictly in secure server-side routes/actions where admin rights are necessary.
 */
export function createAdminClient() {
  return createSupabaseClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
