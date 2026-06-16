import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getSupabaseSecretKey, getSupabaseUrl } from '@/lib/supabase/env'

// ============================================================
// CALLFOLIO - SINGLETON SERVICE-ROLE (ADMIN) CLIENT
// ============================================================
// Separated from server.ts to avoid importing `next/headers`
// in modules that may be transitively loaded by client components.
//
// Usage: import { getSupabaseAdmin } from '@/lib/supabase/admin'
// ============================================================

let adminClient: SupabaseClient | null = null

/**
 * Returns a singleton Supabase admin client using the secret key.
 * Use for server-side DB operations that bypass RLS.
 * NEVER expose to the browser.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (adminClient) return adminClient

  const url = getSupabaseUrl()
  const key = getSupabaseSecretKey()

  if (!url || !key) {
    console.warn('[Supabase] SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY missing — admin client unavailable')
    return createClient(
      url || 'https://placeholder.supabase.co',
      key || 'placeholder',
      { auth: { persistSession: false } }
    )
  }

  adminClient = createClient(url, key, {
    auth: { persistSession: false },
    global: {
      // Bypass Next.js fetch cache for fresh DB reads
      fetch: (input: RequestInfo | URL, init?: RequestInit) =>
        fetch(input, { ...init, cache: 'no-store' }),
    },
  })

  return adminClient
}
