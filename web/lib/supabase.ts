// ============================================================
// CALLFOLIO - SUPABASE RE-EXPORTS (Backwards Compatibility)
// ============================================================
// The canonical admin client now lives in lib/supabase/admin.ts
// This file re-exports it so existing `import { supabaseAdmin }`
// statements continue to work without changes.
// ============================================================

import { getSupabaseAdmin } from '@/lib/supabase/admin'

/**
 * @deprecated Use `getSupabaseAdmin()` from `@/lib/supabase/admin` directly.
 */
export const supabaseAdmin = getSupabaseAdmin()
