-- ============================================================
-- CALLFOLIO v5.4 - Visual Context Feature Migration
-- ============================================================
-- Creates the ticket_attachments table for photo evidence uploads.
-- Storage bucket "ticket-evidence" must be created manually in
-- Supabase Dashboard > Storage > New Bucket.
-- ============================================================

-- 1. Table: ticket_attachments
CREATE TABLE IF NOT EXISTS ticket_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Index for fast lookups by ticket
CREATE INDEX IF NOT EXISTS idx_ticket_attachments_ticket_id
  ON ticket_attachments(ticket_id);

-- 3. RLS policies
ALTER TABLE ticket_attachments ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users (admins) to read all attachments
CREATE POLICY "Authenticated users can read attachments"
  ON ticket_attachments FOR SELECT
  TO authenticated
  USING (true);

-- Allow service role to insert (uploads come through the backend)
CREATE POLICY "Service role can insert attachments"
  ON ticket_attachments FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Allow service role to delete
CREATE POLICY "Service role can delete attachments"
  ON ticket_attachments FOR DELETE
  TO service_role
  USING (true);
