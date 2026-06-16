-- ============================================================
-- CALLFOLIO v5.2 - TICKET ACTIVITIES TABLE
-- ============================================================
-- Diese Tabelle speichert alle Aktivitäten zu einem Ticket
-- (Erstellung, Statusänderungen, E-Mails, Zuordnungen, etc.)
-- ============================================================

-- Tabelle erstellen
CREATE TABLE IF NOT EXISTS public.ticket_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  description TEXT,
  admin_email TEXT,  -- NULL für System-Logs
  old_value JSONB,
  new_value JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index für schnelle Abfragen nach ticket_id
CREATE INDEX IF NOT EXISTS idx_ticket_activities_ticket_id 
  ON public.ticket_activities(ticket_id);

-- Index für chronologische Sortierung
CREATE INDEX IF NOT EXISTS idx_ticket_activities_created_at 
  ON public.ticket_activities(created_at DESC);

-- RLS aktivieren
ALTER TABLE public.ticket_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Nutzer können nur Aktivitäten ihrer Organisation sehen
CREATE POLICY "Users can view activities for their organization tickets"
  ON public.ticket_activities
  FOR SELECT
  USING (
    ticket_id IN (
      SELECT t.id FROM public.tickets t
      WHERE t.organization_id IN (
        SELECT p.organization_id FROM public.profiles p
        WHERE p.user_id = auth.uid()
      )
    )
  );

-- RLS Policy: Service Role kann alles (für Webhook)
CREATE POLICY "Service role can manage all activities"
  ON public.ticket_activities
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Kommentar zur Dokumentation
COMMENT ON TABLE public.ticket_activities IS 'Audit log für alle Ticket-Aktivitäten (v5.2 Clean Architecture)';
COMMENT ON COLUMN public.ticket_activities.activity_type IS 'Typ: created, status_changed, assigned, email_sent, note_added, etc.';
COMMENT ON COLUMN public.ticket_activities.admin_email IS 'E-Mail des Admins oder NULL für System-Aktionen';
