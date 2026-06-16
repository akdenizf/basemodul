-- ============================================================
-- V17: Tenant Name Split + tenant_id default
-- ============================================================
-- 1) tenants.tenant_id (legacy NOT NULL column) gets a UUID
--    default so portal upserts that omit it stop failing with
--    a NOT NULL constraint violation.
-- 2) Adds first_name + last_name as the new Single Source of Truth.
-- 3) Keeps tenants.name as a denormalized fallback for legacy reads.
-- Idempotent: safe to re-run on existing databases.
-- ============================================================

-- ── 1) tenant_id default ─────────────────────────────────────
-- Existing rows already have a value (column is NOT NULL). The
-- default only kicks in for INSERTs that don't supply tenant_id.
-- Cast to text because the legacy column type is TEXT, not UUID.
ALTER TABLE tenants
  ALTER COLUMN tenant_id SET DEFAULT gen_random_uuid()::text;

-- ── 2) first_name / last_name as SoT ─────────────────────────
ALTER TABLE tenants
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name  TEXT;

-- ── 3) Backfill: split existing `name` into parts on rows where
--    first_name is still NULL. SPLIT_PART(.. , ' ', 1) = first
--    whitespace-separated token; the rest becomes last_name.
UPDATE tenants
   SET first_name = NULLIF(TRIM(SPLIT_PART(name, ' ', 1)), ''),
       last_name  = NULLIF(TRIM(SUBSTRING(name FROM POSITION(' ' IN name) + 1)), '')
 WHERE first_name IS NULL
   AND name IS NOT NULL
   AND TRIM(name) <> '';

-- Single-word names: POSITION(' ' IN name) = 0 → SUBSTRING from
-- 1 returns the full string, which equals first_name. Null it out
-- so last_name doesn't duplicate first_name.
UPDATE tenants
   SET last_name = NULL
 WHERE last_name IS NOT NULL
   AND first_name IS NOT NULL
   AND last_name = first_name
   AND POSITION(' ' IN COALESCE(name, '')) = 0;

-- ── 4) Index for name-based lookups (portal already grew big enough)
CREATE INDEX IF NOT EXISTS idx_tenants_last_name
  ON tenants (last_name)
  WHERE last_name IS NOT NULL;

COMMENT ON COLUMN tenants.first_name IS
  'Single Source of Truth — Vorname. Set by SMS portal register flow.';
COMMENT ON COLUMN tenants.last_name IS
  'Single Source of Truth — Nachname. Set by SMS portal register flow.';
COMMENT ON COLUMN tenants.name IS
  'Denormalized full name (first_name + " " + last_name). Kept for legacy reads — always written by the API alongside the split fields.';
