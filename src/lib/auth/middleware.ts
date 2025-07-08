import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Database } from '@/lib/supabase/database.types'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Get current user session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/auth/signin', '/auth/signup', '/auth/callback', '/pricing', '/features']
  
  // API routes that don't require authentication
  const publicApiRoutes = ['/api/auth', '/api/stripe/webhook']

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route))
  const isPublicApiRoute = publicApiRoutes.some(route => pathname.startsWith(route))

  // If accessing a protected route without session, redirect to signin
  if (!session && !isPublicRoute && !isPublicApiRoute) {
    const redirectUrl = new URL('/auth/signin', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If accessing auth pages with active session, redirect to dashboard
  if (session && (pathname.startsWith('/auth/signin') || pathname.startsWith('/auth/signup'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // For protected routes, check subscription status
  if (session && !isPublicRoute && !isPublicApiRoute) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('subscription_tier, trial_ends_at')
      .eq('user_id', session.user.id)
      .single()

    if (profile) {
      const now = new Date()
      const trialEnd = profile.trial_ends_at ? new Date(profile.trial_ends_at) : null
      
      // Check if trial has expired and no active subscription
      if (
        profile.subscription_tier === 'trial' && 
        trialEnd &&
        now > trialEnd &&
        !pathname.startsWith('/billing')
      ) {
        return NextResponse.redirect(new URL('/billing?expired=true', request.url))
      }

      // Check if subscription is canceled or past due
      if (
        ['canceled', 'past_due'].includes(profile.subscription_tier || '') &&
        !pathname.startsWith('/billing')
      ) {
        return NextResponse.redirect(new URL('/billing?status=' + profile.subscription_tier, request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 