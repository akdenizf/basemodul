# Callfolio API & Core Rules

## Architecture Constraints
- **Database**: Supabase (Postgres + pg_trgm), RLS mandatory
- **Supabase Clients**:
  - Browser: `lib/supabase/client.ts` 
  - Admin (Server): `lib/supabase/admin.ts` (Mandatory for Service Role ops)
- **Security**: 
  - All DB writes via Service Role in server-side API routes.
  - Unified Auth Guard via `requireUserWithOrganizationFromRequest`.
- **Domain Integrity**: Strict routing to `www.callfolio.io` for all app paths via middleware.

## Git Safety Protocol
- **No Proactive Pushes**: Only execute `git push` when explicitly requested.
- **Commit Review**: Provide commit summaries and wait for confirmation.
- **No Force Push**: Destructive commands require explicit, repeated confirmation.
