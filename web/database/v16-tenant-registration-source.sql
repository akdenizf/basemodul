-- ============================================================
-- V16: Tenant Registration Source
-- Tracks how a tenant master record was created.
-- Values: 'MANUAL' (legacy/manual import, default),
--         'SMS_PORTAL' (registered via upload-portal patch_data flow),
--         'CALL'        (created from a Vapi call — future).
-- Idempotent: safe to re-run on existing databases.
-- ============================================================

ALTER TABLE tenants
  ADD COLUMN IF NOT EXISTS registration_source TEXT DEFAULT 'MANUAL';

-- Backfill: existing rows predate the column and have NULL.
-- Treat them as MANUAL so the column is always queryable.
UPDATE tenants
   SET registration_source = 'MANUAL'
 WHERE registration_source IS NULL;

COMMENT ON COLUMN tenants.registration_source IS
  'How this tenant master record was created: MANUAL (default), SMS_PORTAL (registered via upload portal), CALL (auto-created from a Vapi call).';

-- Optional: index for filtering "show me everyone who self-registered"
CREATE INDEX IF NOT EXISTS idx_tenants_registration_source
  ON tenants (registration_source);
