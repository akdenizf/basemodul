-- ============================================================
-- V12: CONTRACTOR PORTAL — Appointment & Confirmation Fields
-- ============================================================

DO $$
BEGIN
    -- appointment_date: Vom Handwerker gesetzter Wunschtermin
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'tickets' AND column_name = 'appointment_date'
    ) THEN
        ALTER TABLE tickets ADD COLUMN appointment_date TIMESTAMPTZ DEFAULT NULL;
    END IF;

    -- contractor_confirmed_at: Zeitstempel der Auftragsbestätigung durch den Handwerker
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'tickets' AND column_name = 'contractor_confirmed_at'
    ) THEN
        ALTER TABLE tickets ADD COLUMN contractor_confirmed_at TIMESTAMPTZ DEFAULT NULL;
    END IF;
END $$;

-- Reload schema cache so PostgREST knows about the new columns
NOTIFY pgrst, 'reload schema';
