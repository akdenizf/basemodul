-- ============================================================
-- V18: tenants.unit + tenants.address optional
-- ============================================================
-- The legacy v4 schema declared tenants.unit and tenants.address
-- as NOT NULL. Both are genuinely optional:
--   - manual tenant creation (dashboard) leaves Wohneinheit empty
--   - the SMS upload portal often only has a phone + name
-- A missing unit/address must not block tenant creation.
-- Idempotent: DROP NOT NULL is a no-op if already nullable.
-- ============================================================

ALTER TABLE tenants ALTER COLUMN unit    DROP NOT NULL;
ALTER TABLE tenants ALTER COLUMN address DROP NOT NULL;

COMMENT ON COLUMN tenants.unit IS
  'Wohneinheit (e.g. "3. OG links"). Optional — not every record has it.';
COMMENT ON COLUMN tenants.address IS
  'Objektadresse. Optional — portal registrations may only carry phone + name.';
