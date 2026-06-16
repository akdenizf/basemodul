import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { getSupabasePublishableKey, getSupabaseUrl } from '@/lib/supabase/env'

// Re-export getSupabaseAdmin so existing imports from server.ts still work
export { getSupabaseAdmin } from '@/lib/supabase/admin'

// ============================================================
// CALLFOLIO - SERVER SSR CLIENTS (Per-Request, Cookie-Based)
// ============================================================

/**
 * Creates a Supabase SSR client that reads/writes cookies via
 * next/headers. Use in Server Components and Server Actions.
 */
export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    getSupabaseUrl()!,
    getSupabasePublishableKey()!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // Called from a Server Component — middleware will handle refresh.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch {
            // Called from a Server Component — middleware will handle refresh.
          }
        },
      },
    }
  )
}

/**
 * Singleton-like helper for server-side Supabase access.
 * Use in Server Components and API routes.
 */
export const getSupabaseServerClient = createClient;

/**
 * Creates a Supabase SSR client from a NextRequest.
 * Supports cookie-based auth and Bearer token auth.
 */
export function createClientFromRequest(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (token) {
    return createServerClient(
      getSupabaseUrl()!,
      getSupabasePublishableKey()!,
      {
        global: {
          headers: { Authorization: `Bearer ${token}` },
        },
        cookies: {
          get() { return undefined },
          set() { },
          remove() { },
        },
      }
    )
  }

  return createServerClient(
    getSupabaseUrl()!,
    getSupabasePublishableKey()!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set() { },
        remove() { },
      },
    }
  )
}

// --- Auth Helpers --------------------------------------------------

/**
 * Gets the current authenticated user from Server Components.
 */
export async function getCurrentUser() {
  const supabase = createClient()

  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null
    return { user, email: user.email || null }
  } catch (error) {
    console.error('[Auth] Error getting current user:', error)
    return null
  }
}

/**
 * Gets the current authenticated user from an API route request.
 */
export async function getCurrentUserFromRequest(req: NextRequest) {
  const supabase = createClientFromRequest(req)

  try {
    const authHeader = req.headers.get('authorization')
    const allCookies = req.cookies.getAll()
    const sbCookies = allCookies.filter(c =>
      c.name.includes('sb-') || c.name.includes('supabase')
    )

    console.log('[Auth] Request auth check:', {
      hasBearer: !!authHeader,
      totalCookies: allCookies.length,
      sbCookies: sbCookies.map(c => c.name),
    })

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      console.warn('[Auth] Supabase auth error:', error.message)
    }

    if (error || !user) {
      console.warn('[Auth] No authenticated user found')
      return null
    }

    console.log('[Auth] Authenticated:', user.email)
    return { user, email: user.email || null }
  } catch (error) {
    console.error('[Auth] Exception in getCurrentUserFromRequest:', error)
    return null
  }
}
