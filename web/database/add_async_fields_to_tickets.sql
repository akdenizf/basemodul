-- ============================================================
-- CALLFOLIO v5.3 - ADD ASYNC PROCESSING FIELDS TO TICKETS
-- ============================================================
-- Diese Migration fügt Felder hinzu, die für das asynchrone
-- E-Mail-Versand-System benötigt werden.
-- ============================================================

-- Felder für Fuzzy Matching Status
ALTER TABLE public.tickets 
  ADD COLUMN IF NOT EXISTS match_type TEXT DEFAULT 'NONE';

ALTER TABLE public.tickets 
  ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ;

ALTER TABLE public.tickets 
  ADD COLUMN IF NOT EXISTS email_sent_at TIMESTAMPTZ;

-- Kommentare zur Dokumentation
COMMENT ON COLUMN public.tickets.match_type IS 'Matching-Typ: NONE, PHONE_EXACT, FUZZY_HIGH, FUZZY_LOW';
COMMENT ON COLUMN public.tickets.processed_at IS 'Zeitstempel der Fuzzy-Matching-Verarbeitung';
COMMENT ON COLUMN public.tickets.email_sent_at IS 'Zeitstempel des E-Mail-Versands';

-- Index für schnelle Abfragen nach unverarbeiteten Tickets
CREATE INDEX IF NOT EXISTS idx_tickets_processed_at 
  ON public.tickets(processed_at) 
  WHERE processed_at IS NULL;

-- Index für Match-Typ Statistiken
CREATE INDEX IF NOT EXISTS idx_tickets_match_type 
  ON public.tickets(match_type);

SELECT '✅ Async processing fields added to tickets table' as status;
