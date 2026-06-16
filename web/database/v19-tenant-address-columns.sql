-- ============================================================
-- V19: Discrete address columns on tenants
-- ============================================================
-- tenants.address was a single concatenated string ("PLZ Stadt,
-- Straße Nr"). Round-tripping it through a regex parser in the
-- edit dialog was fragile — partial addresses (no PLZ, no comma)
-- got mis-parsed (street landed in the city field).
--
-- This adds street / house_number / zip / city as discrete
-- columns — the new Single Source of Truth. `address` is kept as
-- a denormalized concatenation for legacy reads (Vapi lookups,
-- ticket matching, search).
-- Idempotent: safe to re-run.
-- ============================================================

ALTER TABLE tenants
  ADD COLUMN IF NOT EXISTS street       TEXT,
  ADD COLUMN IF NOT EXISTS house_number TEXT,
  ADD COLUMN IF NOT EXISTS zip          TEXT,
  ADD COLUMN IF NOT EXISTS city         TEXT;

-- ── Backfill: best-effort parse of the legacy `address` string
--    into the discrete columns, only for rows not yet populated.
--    Expected legacy format: "PLZ Stadt, Straße Nr".
UPDATE tenants
   SET zip = NULLIF(TRIM((regexp_match(address, '^(\d{5})\s'))[1]), ''),
       city = NULLIF(TRIM((regexp_match(split_part(address, ',', 1), '^\d{5}\s+(.+)$'))[1]), ''),
       street = NULLIF(TRIM((regexp_match(split_part(address, ',', 2), '^(.+?)\s+\d+[a-zA-Z]?$'))[1]), ''),
       house_number = NULLIF(TRIM((regexp_match(split_part(address, ',', 2), '\s(\d+[a-zA-Z]?)$'))[1]), '')
 WHERE street IS NULL
   AND house_number IS NULL
   AND zip IS NULL
   AND city IS NULL
   AND address IS NOT NULL
   AND TRIM(address) <> '';

COMMENT ON COLUMN tenants.street       IS 'Straße — discrete address field (SoT).';
COMMENT ON COLUMN tenants.house_number IS 'Hausnummer — discrete address field (SoT).';
COMMENT ON COLUMN tenants.zip          IS 'Postleitzahl — discrete address field (SoT).';
COMMENT ON COLUMN tenants.city         IS 'Stadt — discrete address field (SoT).';
COMMENT ON COLUMN tenants.address      IS 'Denormalized full address ("PLZ Stadt, Straße Nr"). Kept for legacy reads — always rebuilt from the discrete columns.';
