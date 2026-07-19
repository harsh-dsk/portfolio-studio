/**
 * lib/supabase/middleware.ts
 *
 * Supabase session refresh helper for Next.js middleware.
 * - Refreshes the auth token on every request.
 * - Redirects unauthenticated users away from /admin/* to /admin/login.
 * - Redirects authenticated non-admin users to /admin/login as well.
 */
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from './database.types'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: do not add code between createServerClient and supabase.auth.getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Protect /admin/* routes (but not /admin/login or /auth/*)
  const isAdminRoute = pathname.startsWith('/admin')
  const isLoginPage  = pathname.startsWith('/admin/login')
  const isAuthRoute  = pathname.startsWith('/auth')

  if (isAdminRoute && !isLoginPage && !isAuthRoute) {
    if (!user) {
      // Not authenticated → redirect to login
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    // Authenticated but not the admin email → redirect to login
    const adminEmail = process.env.ADMIN_EMAIL
    if (adminEmail && user.email !== adminEmail) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.searchParams.set('error', 'unauthorized')
      return NextResponse.redirect(url)
    }
  }

  // If already logged in and visiting login page → redirect to admin dashboard
  if (isLoginPage && user) {
    const adminEmail = process.env.ADMIN_EMAIL
    if (!adminEmail || user.email === adminEmail) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
