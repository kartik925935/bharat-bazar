import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { publicEnv } from '@/config/env.public'

export async function proxy(request: NextRequest) {
  // Initialize the response object that will be returned
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create the Supabase client for session refresh
  const supabase = createServerClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Set on the incoming request so downstream code sees the new cookie
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          
          // Re-initialize the response so it carries the updated request state
          supabaseResponse = NextResponse.next({
            request,
          })
          
          // Bind the newly issued cookies to the outgoing response
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Trigger a session refresh.
  // We MUST call getUser() — not getSession() — to securely validate the token
  // with the Supabase server and trigger a refresh if the token is expiring.
  // The result is ignored here because this file's ONLY job is session refresh.
  // Route protection is handled strictly at the layout/action layer.
  await supabase.auth.getUser()

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - any file with an extension (e.g., .svg, .png, .jpg)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)',
  ],
}
