import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getSupabasePublishableKey, getSupabaseUrl } from '@/lib/supabase/env'

// ============================================================
// CALLFOLIO - SINGLETON BROWSER CLIENT
// ============================================================
// Eliminates "Multiple GoTrueClient instances" warning.
// Import via: import { getSupabaseBrowserClient } from '@/lib/supabase/client'
// ============================================================

let browserClient: SupabaseClient | null = null

/**
 * Returns a singleton Supabase browser client.
 * Safe to call multiple times — only one instance is ever created.
 * No domain restriction on cookies (handled by middleware).
 */
export function getSupabaseBrowserClient(): SupabaseClient {
  if (browserClient) return browserClient

  browserClient = createBrowserClient(
    getSupabaseUrl()!,
    getSupabasePublishableKey()!,
    {
      auth: {
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
        flowType: 'pkce',
      },
      // No cookieOptions.domain — let the browser set cookies for the
      // current origin automatically. This avoids issues where a hard-coded
      // A fixed production cookie domain blocks cookies on localhost or Vercel preview URLs.
    }
  )

  return browserClient
}

// Legacy alias so existing `import { createClient }` still works
// during the migration. New code should use getSupabaseBrowserClient().
export const createClient = getSupabaseBrowserClient
