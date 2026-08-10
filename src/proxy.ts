import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Routes that require authentication and a specific role
const protectedRoutes: Record<string, string[]> = {
  '/admin-dashboard': ['super_admin', 'admin'],
  '/admin': ['super_admin', 'admin'],
  '/seller-dashboard': ['seller'],
  '/seller-shop': ['seller'],
  '/seller-products': ['seller'],
  '/seller-orders': ['seller'],
  '/seller-inventory': ['seller'],
  '/seller-returns': ['seller'],
  '/seller-reviews': ['seller'],
  '/seller-coupons': ['seller'],
  '/seller-performance': ['seller'],
  '/seller-earnings': ['seller'],
  '/seller-notifications': ['seller'],
  '/seller-settings': ['seller'],
  '/dashboard': ['customer', 'seller', 'admin', 'super_admin'],
}

// Routes that are always public (no auth required)
const publicRoutes = [
  '/seller-register',
  '/seller-login',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/email-verified',
  '/auth',
  '/account-suspended',
  '/session-expired',
  '/',
]

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  // For the current mock environment (Zustand + localStorage), 
  // we must bypass Supabase server-side auth checks.
  const USE_MOCK_AUTH = true;
  if (USE_MOCK_AUTH || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return supabaseResponse;
  }

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
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Always use getUser() not getSession() in middleware
  const { data: { user }, error } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  // Check if this is a public route
  const isPublicRoute = publicRoutes.some(
    route => pathname === route || pathname.startsWith(route + '/')
  )

  if (isPublicRoute) {
    return supabaseResponse
  }

  // Handle Super Admin 32-character token route logic
  const SA_PATH_TOKEN = process.env.SA_PATH_TOKEN || '7f3a9b2c4d1e8f6a0b5c3d7e2f4a9b1c';
  const pathSegments = pathname.split('/').filter(Boolean);
  const firstSegment = pathSegments[0];

  if (firstSegment === SA_PATH_TOKEN) {
    // Valid secret path, allow to pass
    return supabaseResponse;
  }
  
  if (firstSegment && /^[a-f0-9]{32}$/i.test(firstSegment)) {
    // Other 32-char path -> hard 404
    return new NextResponse(null, { status: 404 });
  }

  // Find matching protected route
  let requiredRoles: string[] | null = null
  for (const [route, roles] of Object.entries(protectedRoutes)) {
    if (pathname === route || pathname.startsWith(route + '/')) {
      requiredRoles = roles
      break
    }
  }

  if (requiredRoles) {
    if (!user || error) {
      // Not authenticated — redirect to appropriate login page
      const url = request.nextUrl.clone()
      url.pathname = pathname.startsWith('/seller') ? '/seller-login' : '/login'
      url.searchParams.set('returnUrl', pathname)
      return NextResponse.redirect(url)
    }

    // Check role — stored in user_metadata from signup
    const userRole: string = user.user_metadata?.role || 'customer'

    const hasRole =
      requiredRoles.includes(userRole) ||
      // super_admin can access all admin routes
      (userRole === 'super_admin' && requiredRoles.includes('admin'))

    if (!hasRole) {
      const url = request.nextUrl.clone()
      url.pathname = '/403'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
