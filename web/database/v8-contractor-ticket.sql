-- ============================================================
-- V8: CONTRACTOR ↔ TICKET INTEGRATION
-- Adds contractor_id FK to tickets for direct assignment
-- ============================================================

-- 1. Add contractor_id column to tickets
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'tickets' AND column_name = 'contractor_id'
    ) THEN
        ALTER TABLE tickets
            ADD COLUMN contractor_id UUID REFERENCES contractors(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 2. Index for fast lookups by contractor
CREATE INDEX IF NOT EXISTS idx_tickets_contractor_id ON tickets (contractor_id)
    WHERE contractor_id IS NOT NULL;
