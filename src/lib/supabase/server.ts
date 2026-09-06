import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { publicEnv } from '@/config/env.public'

/**
 * Supabase client for Server Components (RSC).
 * It manages auth state through Next.js cookies, but since Server Components
 * cannot write cookies, `setAll` must silently catch errors.
 *
 * TRUST RULE: In all server-side code, ALWAYS use `supabase.auth.getUser()`
 * to make trust decisions. NEVER use `supabase.auth.getSession()` for
 * authorization. `getSession()` only reads the local cookie and does NOT
 * revalidate the token with the Supabase auth server — it can be spoofed
 * by a client sending a crafted cookie.
 *
 * MUST ONLY be used in server-side code.
 */
export async function createClient() {
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
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch (error) {
            // The `setAll` method was called from a Server Component.
            // This is expected and ignored. The middleware handles session refresh.
          }
        },
      },
    }
  )
}
