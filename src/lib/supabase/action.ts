import 'server-only'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { publicEnv } from '@/config/env.public'

/**
 * Supabase client for Server Actions.
 *
 * Unlike Server Components, Server Actions CAN write cookies. Therefore, this
 * client DOES NOT swallow errors in the `setAll` adapter. If a cookie fails to
 * write here, it indicates a critical configuration error.
 *
 * TRUST RULE: In all server-side code, ALWAYS use `supabase.auth.getUser()`
 * to make trust decisions. NEVER use `supabase.auth.getSession()` for
 * authorization. `getSession()` only reads the local cookie and does NOT
 * revalidate the token with the Supabase auth server — it can be spoofed
 * by a client sending a crafted cookie.
 */
export async function createActionClient() {
  const cookieStore = await cookies()

  return createServerClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
