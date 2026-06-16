-- ============================================================
-- One-time sync: Set is_archived based on status
-- Run if you have tickets with status=CLOSED but is_archived=false
-- (from previous bulk-action that only set status)
-- ============================================================

UPDATE tickets SET is_archived = TRUE WHERE status = 'CLOSED';
UPDATE tickets SET is_archived = FALSE WHERE status IN ('NEW', 'IN_PROGRESS', 'RESOLVED');
