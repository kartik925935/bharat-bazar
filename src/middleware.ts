import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Define which routes need which roles
const protectedRoutes = {
  '/admin': ['super admin', 'admin'],
  '/seller': ['super admin', 'admin', 'seller'],
  '/delivery': ['super admin', 'admin', 'delivery partner'],
  '/profile': ['super admin', 'admin', 'seller', 'delivery partner', 'user'],
  '/orders': ['super admin', 'admin', 'seller', 'user'], // User can view own orders, seller can manage orders
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: DO NOT use getSession() in middleware!
  // Always use getUser() to validate the token securely on the server.
  const { data: { user }, error } = await supabase.auth.getUser()
  
  const pathname = request.nextUrl.pathname

  // Determine if the current route is protected based on prefixes
  let requiredRoles: string[] | null = null
  for (const [route, roles] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route)) {
      requiredRoles = roles
      break
    }
  }

  if (requiredRoles) {
    if (!user || error) {
      // User is not authenticated, redirect to login
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    // Role checking
    const userRole = user.user_metadata?.role || 'user'
    
    if (!requiredRoles.includes(userRole)) {
      // User is authenticated but lacks required role
      const url = request.nextUrl.clone()
      url.pathname = '/unauthorized' // Or redirect to home
      return NextResponse.redirect(url)
    }
  }

  // Example: Prevent logged in users from accessing auth pages
  if (user && (pathname === '/login' || pathname === '/signup')) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
