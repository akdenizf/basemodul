-- ============================================================
-- CALLFOLIO v5.3 - Add is_archived column to tickets
-- Run this in Supabase SQL Editor
-- ============================================================

-- Add is_archived column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tickets' AND column_name = 'is_archived'
    ) THEN
        ALTER TABLE tickets ADD COLUMN is_archived BOOLEAN DEFAULT FALSE;
        
        -- Create index for faster filtering
        CREATE INDEX IF NOT EXISTS idx_tickets_is_archived ON tickets(is_archived);
        
        -- Update existing tickets to have is_archived = false//
        UPDATE tickets SET is_archived = FALSE WHERE is_archived IS NULL;
        
        RAISE NOTICE 'Column is_archived added successfully';
    ELSE
        RAISE NOTICE 'Column is_archived already exists';
    END IF;
END $$;

-- Verify the column exists
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'tickets' AND column_name = 'is_archived';
