-- v9: Performance indices for phone lookup and address search
-- Run once against the Supabase production database via Supabase Studio or psql.
--
-- Why: ilike('%1701234567') requires a trigram index (pg_trgm) to avoid full-table scans.
-- Without these indices, get-tickets and the dedup check in webhook slow down linearly
-- as the tickets table grows.

-- Enable pg_trgm extension if not already active (requires superuser or rls bypass)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Index on caller_phone for suffix ilike matching (e.g. '%1701234567')
CREATE INDEX IF NOT EXISTS tickets_caller_phone_trgm_idx
  ON tickets USING gin (caller_phone gin_trgm_ops);

-- Index on address for substring ilike matching (address fallback search)
CREATE INDEX IF NOT EXISTS tickets_address_trgm_idx
  ON tickets USING gin (address gin_trgm_ops);

-- Standard btree index on status for the exclusion filter (.not status in RESOLVED/CLOSED)
-- Supabase usually creates this automatically for status columns but adding explicitly for safety.
CREATE INDEX IF NOT EXISTS tickets_status_idx
  ON tickets (status);

-- Composite index: organization_id + status for the dedup check in webhook
CREATE INDEX IF NOT EXISTS tickets_org_status_idx
  ON tickets (organization_id, status);

-- Verification: check index presence
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'tickets'
  AND indexname IN (
    'tickets_caller_phone_trgm_idx',
    'tickets_address_trgm_idx',
    'tickets_status_idx',
    'tickets_org_status_idx'
  );
