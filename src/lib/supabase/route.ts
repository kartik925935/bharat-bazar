import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { publicEnv } from '@/config/env.public'

/**
 * Supabase client factory for Route Handlers (API routes) and Middleware.
 *
 * In Next.js, cookie writes in Route Handlers are silently dropped unless they
 * are explicitly bound to the `NextResponse` object that is eventually returned
 * to the client. This factory handles that binding.
 *
 * TRUST RULE: In all server-side code, ALWAYS use `supabase.auth.getUser()`
 * to make trust decisions. NEVER use `supabase.auth.getSession()` for
 * authorization. `getSession()` only reads the local cookie and does NOT
 * revalidate the token with the Supabase auth server — it can be spoofed
 * by a client sending a crafted cookie.
 *
 * @param request The incoming NextRequest
 * @returns An object containing both the initialized Supabase client and the
 *          NextResponse object. YOU MUST return this exact response object
 *          from your route handler.
 */
export function createRouteClient(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  return { supabase, response }
}
