import { createClient as createSupabaseClient } from '@supabase/supabase-js'

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
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase URL or Service Role Key')
  }

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
