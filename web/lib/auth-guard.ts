import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getCurrentUser, getCurrentUserFromRequest } from "@/lib/supabase/server";
import { NextRequest } from 'next/server';

// ============================================================
// CALLFOLIO v5.2 - AUTH GUARD (CLEAN ARCHITECTURE)
// ============================================================
// Saubere Trennung:
//   - organizations: Kundenbetriebe
//   - tenants: Kontakte/Endkunden
// ============================================================

export interface AuthGuardResult {
  ok: boolean;
  user_id?: string;
  email?: string;
  organization_id?: string;
  organization_name?: string;
  organization_slug?: string;
  vapi_phone_id?: string;
  notification_email?: string;
  status?: number;
  error?: string;
  // Legacy compatibility
  tenant_id_string?: string;
}

// Use the singleton admin client from consolidated module
const supabase = getSupabaseAdmin();

/**
 * Helper function to get organization data for a user
 */
async function getOrganizationForUser(userId: string): Promise<{
  organization_id?: string;
  organization_name?: string;
  organization_slug?: string;
  vapi_phone_id?: string;
  notification_email?: string;
  organization_logo_url?: string;
}> {
  console.log(`[AUTH] Getting organization for user: ${userId}`);

  // Step 1: Get profile with organization_id
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (profileError) {
    console.error('[AUTH] Profile lookup error:', profileError);
    return {};
  }

  console.log(`[AUTH] Profile found: organization_id=${profile?.organization_id || 'NONE'}`);

  if (!profile?.organization_id) {
    console.error('[AUTH] No organization_id in profile!');
    return {};
  }

  // Step 2: Get organization details separately (avoids join issues)
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .select('id, name, slug, vapi_phone_id, notification_email, logo_url')
    .eq('id', profile.organization_id)
    .maybeSingle();

  if (orgError) {
    console.error('[AUTH] Organization lookup error:', orgError);
    return { organization_id: profile.organization_id };
  }

  console.log(`[AUTH] Organization found: ${org?.name} (${org?.id})`);

  return {
    organization_id: org?.id,
    organization_name: org?.name,
    organization_slug: org?.slug,
    vapi_phone_id: org?.vapi_phone_id,
    notification_email: org?.notification_email,
    organization_logo_url: org?.logo_url
  };
}

/**
 * Server-side authentication guard for server components
 */
export async function requireAuthenticatedUser(): Promise<AuthGuardResult> {
  try {
    const userResult = await getCurrentUser();

    if (!userResult) {
      return { ok: false, status: 401, error: 'Not authenticated' };
    }

    const { user } = userResult;
    const orgData = await getOrganizationForUser(user.id);

    return {
      ok: true,
      user_id: user.id,
      email: user.email || '',
      ...orgData,
      // Legacy compatibility
      tenant_id_string: orgData.organization_slug
    };
  } catch (error) {
    console.error('Auth guard error:', error);
    return { ok: false, status: 500, error: 'Authentication error' };
  }
}

/**
 * Server-side authentication guard for API routes
 */
export async function requireAuthenticatedUserFromRequest(request: NextRequest): Promise<AuthGuardResult> {
  try {
    const userResult = await getCurrentUserFromRequest(request);

    if (!userResult) {
      return { ok: false, status: 401, error: 'Not authenticated' };
    }

    const { user } = userResult;
    const orgData = await getOrganizationForUser(user.id);

    return {
      ok: true,
      user_id: user.id,
      email: user.email || '',
      ...orgData,
      // Legacy compatibility
      tenant_id_string: orgData.organization_slug
    };
  } catch (error) {
    console.error('Auth guard error:', error);
    return { ok: false, status: 500, error: 'Authentication error' };
  }
}

/**
 * Require user to have an organization (for dashboard access)
 */
export async function requireUserWithOrganization(): Promise<AuthGuardResult> {
  const result = await requireAuthenticatedUser();

  if (!result.ok) {
    return result;
  }

  if (!result.organization_id) {
    return { ok: false, status: 403, error: 'Organization required' };
  }

  return result;
}

/**
 * Require user to have an organization (for API routes)
 */
export async function requireUserWithOrganizationFromRequest(request: NextRequest): Promise<AuthGuardResult> {
  const result = await requireAuthenticatedUserFromRequest(request);

  if (!result.ok) {
    return result;
  }

  if (!result.organization_id) {
    return { ok: false, status: 403, error: 'Organization required' };
  }

  return result;
}

// Legacy compatibility
export type AdminGuardResult = AuthGuardResult;
export const requireAdminUser = requireUserWithOrganization;
export const requireAdminUserFromRequest = requireUserWithOrganizationFromRequest;
