// DEPRECATED: This file is kept for backward compatibility
// Use lib/auth-guard.ts for new SaaS authentication system

import { 
  requireUserWithOrganization,
  requireUserWithOrganizationFromRequest,
  type AuthGuardResult
} from '@/lib/auth-guard'

// Legacy compatibility types
export type AdminGuardResult = AuthGuardResult

// Legacy compatibility functions
export const requireAdminUser = requireUserWithOrganization
export const requireAdminUserFromRequest = requireUserWithOrganizationFromRequest