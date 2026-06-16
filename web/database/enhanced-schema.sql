-- Enhanced Database Schema for Callfolio MVP
-- Includes: Ticket Codes, Duplicate Detection, Emergency Keywords
-- Safe to re-run (idempotent)

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums (create if not exists)
DO $$ BEGIN
    CREATE TYPE ticket_status AS ENUM ('NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ticket_urgency AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'EMERGENCY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ticket_category AS ENUM ('PLUMBING', 'HEATING', 'ELECTRICAL', 'BUILDING', 'ADMIN', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ticket_sentiment AS ENUM ('CALM', 'STRESSED', 'ANGRY', 'UNKNOWN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Main tickets table (create if not exists, then add new columns)
CREATE TABLE IF NOT EXISTS tickets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Identification
  tenant_id TEXT NOT NULL,
  call_id TEXT UNIQUE NOT NULL,
  ticket_id TEXT, -- Human-readable ID (auto-generated)
  
  -- Classification
  status ticket_status DEFAULT 'NEW',
  urgency ticket_urgency NOT NULL,
  category ticket_category NOT NULL,
  sentiment ticket_sentiment NOT NULL,
  
  -- Caller Information
  caller_name TEXT,
  caller_phone TEXT,
  
  -- Location
  address TEXT,
  unit TEXT,
  
  -- Issue Details
  issue_summary TEXT,
  issue_details TEXT,
  
  -- Escalation
  escalation_is_emergency BOOLEAN DEFAULT FALSE,
  escalation_reason TEXT,
  
  -- Meta
  vapi_cost NUMERIC(10,4),
  ticket_json JSONB NOT NULL
);

-- Add new columns if they don't exist
ALTER TABLE tickets 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE tickets 
ADD COLUMN IF NOT EXISTS ticket_code VARCHAR(6) UNIQUE;

ALTER TABLE tickets 
ADD COLUMN IF NOT EXISTS duplicate_of UUID REFERENCES tickets(id);

ALTER TABLE tickets 
ADD COLUMN IF NOT EXISTS parent_ticket_id UUID REFERENCES tickets(id);

-- Trigger function for ticket_code generation
CREATE OR REPLACE FUNCTION generate_ticket_code()
RETURNS TRIGGER AS $$
DECLARE
  new_code VARCHAR(6);
  attempt_count INTEGER := 0;
  max_attempts INTEGER := 100;
BEGIN
  -- Only generate if ticket_code is null
  IF NEW.ticket_code IS NULL THEN
    LOOP
      -- Generate 6-digit numeric code (avoid codes starting with 0)
      new_code := LPAD((FLOOR(RANDOM() * 900000) + 100000)::TEXT, 6, '0');
      
      -- Check if code already exists
      IF NOT EXISTS (SELECT 1 FROM tickets WHERE ticket_code = new_code) THEN
        NEW.ticket_code := new_code;
        EXIT;
      END IF;
      
      attempt_count := attempt_count + 1;
      IF attempt_count >= max_attempts THEN
        RAISE EXCEPTION 'Could not generate unique ticket code after % attempts', max_attempts;
      END IF;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger function for human-readable ticket_id generation
CREATE OR REPLACE FUNCTION generate_ticket_id()
RETURNS TRIGGER AS $$
DECLARE
  year_suffix TEXT;
  sequence_num INTEGER;
  new_ticket_id TEXT;
BEGIN
  -- Only generate if ticket_id is null
  IF NEW.ticket_id IS NULL THEN
    -- Get current year suffix (e.g., "2026" -> "26")
    year_suffix := RIGHT(EXTRACT(YEAR FROM NOW())::TEXT, 2);
    
    -- Get next sequence number for this tenant and year
    SELECT COALESCE(MAX(
      CASE 
        WHEN ticket_id ~ ('^HV-' || year_suffix || '-[0-9]+$') 
        THEN SUBSTRING(ticket_id FROM LENGTH('HV-' || year_suffix || '-') + 1)::INTEGER
        ELSE 0
      END
    ), 0) + 1
    INTO sequence_num
    FROM tickets 
    WHERE tenant_id = NEW.tenant_id 
    AND ticket_id IS NOT NULL;
    
    -- Format: HV-26-000001
    new_ticket_id := 'HV-' || year_suffix || '-' || LPAD(sequence_num::TEXT, 6, '0');
    NEW.ticket_id := new_ticket_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers to avoid conflicts
DROP TRIGGER IF EXISTS generate_ticket_code_trigger ON tickets;
DROP TRIGGER IF EXISTS generate_ticket_id_trigger ON tickets;
DROP TRIGGER IF EXISTS update_tickets_updated_at ON tickets;

-- Create triggers
CREATE TRIGGER generate_ticket_code_trigger
    BEFORE INSERT ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION generate_ticket_code();

CREATE TRIGGER generate_ticket_id_trigger
    BEFORE INSERT ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION generate_ticket_id();

CREATE TRIGGER update_tickets_updated_at
    BEFORE UPDATE ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance (create if not exists)
CREATE INDEX IF NOT EXISTS idx_tickets_tenant_created ON tickets(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_call_id ON tickets(call_id);
CREATE INDEX IF NOT EXISTS idx_tickets_phone_status ON tickets(caller_phone, status) WHERE status IN ('NEW', 'IN_PROGRESS');
CREATE INDEX IF NOT EXISTS idx_tickets_updated_at ON tickets(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_ticket_code ON tickets(ticket_code) WHERE ticket_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tickets_duplicate_of ON tickets(duplicate_of) WHERE duplicate_of IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tickets_address_unit ON tickets(tenant_id, address, unit) WHERE status IN ('NEW', 'IN_PROGRESS');
CREATE INDEX IF NOT EXISTS idx_tickets_tenant_address_unit_time ON tickets(tenant_id, address, unit, created_at) WHERE status IN ('NEW', 'IN_PROGRESS');

-- Update existing tickets to have updated_at = created_at if null
UPDATE tickets 
SET updated_at = created_at 
WHERE updated_at IS NULL;

-- Add comments for documentation
COMMENT ON TABLE tickets IS 'Main table for storing voice intake tickets with enhanced features';
COMMENT ON COLUMN tickets.ticket_code IS '6-digit numeric code for easy phone verification';
COMMENT ON COLUMN tickets.duplicate_of IS 'Reference to original ticket if this is a duplicate';
COMMENT ON COLUMN tickets.parent_ticket_id IS 'Reference to parent ticket for related tickets';
COMMENT ON COLUMN tickets.updated_at IS 'Timestamp of last ticket update (auto-managed)';

-- Create a view for easy ticket lookup with all related info
CREATE OR REPLACE VIEW ticket_details AS
SELECT 
  t.*,
  orig.ticket_code as original_ticket_code,
  orig.issue_summary as original_summary,
  parent.ticket_code as parent_ticket_code,
  parent.issue_summary as parent_summary
FROM tickets t
LEFT JOIN tickets orig ON t.duplicate_of = orig.id
LEFT JOIN tickets parent ON t.parent_ticket_id = parent.id;

COMMENT ON VIEW ticket_details IS 'Enhanced view with duplicate and parent ticket information';

-- Create function for duplicate detection (used by API)
CREATE OR REPLACE FUNCTION find_potential_duplicates(
  p_tenant_id TEXT,
  p_address TEXT,
  p_unit TEXT,
  p_hours_back INTEGER DEFAULT 24
)
RETURNS TABLE(
  ticket_id TEXT,
  ticket_code VARCHAR(6),
  issue_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  similarity_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.ticket_id,
    t.ticket_code,
    t.issue_summary,
    t.created_at,
    -- Simple similarity score based on address/unit matching
    CASE 
      WHEN LOWER(t.address) = LOWER(p_address) AND LOWER(t.unit) = LOWER(p_unit) THEN 1.0
      WHEN LOWER(t.address) LIKE '%' || LOWER(p_address) || '%' AND LOWER(t.unit) LIKE '%' || LOWER(p_unit) || '%' THEN 0.8
      WHEN LOWER(t.address) LIKE '%' || LOWER(p_address) || '%' OR LOWER(t.unit) LIKE '%' || LOWER(p_unit) || '%' THEN 0.6
      ELSE 0.0
    END as similarity_score
  FROM tickets t
  WHERE t.tenant_id = p_tenant_id
    AND t.status IN ('NEW', 'IN_PROGRESS')
    AND t.created_at >= NOW() - (p_hours_back || ' hours')::INTERVAL
    AND (
      LOWER(t.address) LIKE '%' || LOWER(p_address) || '%' 
      OR LOWER(t.unit) LIKE '%' || LOWER(p_unit) || '%'
    )
  ORDER BY similarity_score DESC, t.created_at DESC
  LIMIT 5;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION find_potential_duplicates IS 'Find potential duplicate tickets based on address/unit similarity';

-- Create emergency keywords table for configurable keyword detection
CREATE TABLE IF NOT EXISTS emergency_keywords (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  keyword TEXT NOT NULL UNIQUE,
  language TEXT DEFAULT 'de',
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Insert default German emergency keywords
INSERT INTO emergency_keywords (keyword, category) VALUES
  ('112', 'emergency_number'),
  ('notfall', 'emergency'),
  ('feuer', 'fire'),
  ('brand', 'fire'),
  ('wasser', 'water'),
  ('überschwemmung', 'water'),
  ('gas', 'gas'),
  ('gasgeruch', 'gas'),
  ('unfall', 'accident'),
  ('verletzt', 'injury'),
  ('gefahr', 'danger'),
  ('hilfe', 'help'),
  ('sofort', 'urgency'),
  ('dringend', 'urgency'),
  ('lebensbedrohlich', 'life_threatening'),
  ('stromausfall', 'electrical'),
  ('kurzschluss', 'electrical')
ON CONFLICT (keyword) DO NOTHING;

COMMENT ON TABLE emergency_keywords IS 'Configurable keywords for automatic emergency detection';

-- Create index on emergency keywords
CREATE INDEX IF NOT EXISTS idx_emergency_keywords_active ON emergency_keywords(keyword) WHERE is_active = TRUE;

-- Create function to check for emergency keywords
CREATE OR REPLACE FUNCTION detect_emergency_keywords(text_input TEXT)
RETURNS TABLE(
  is_emergency BOOLEAN,
  matched_keywords TEXT[],
  categories TEXT[]
) AS $$
DECLARE
  matched_kw TEXT[];
  matched_cat TEXT[];
BEGIN
  -- Find matching keywords (case insensitive)
  SELECT 
    ARRAY_AGG(ek.keyword),
    ARRAY_AGG(DISTINCT ek.category)
  INTO matched_kw, matched_cat
  FROM emergency_keywords ek
  WHERE ek.is_active = TRUE
    AND LOWER(text_input) LIKE '%' || LOWER(ek.keyword) || '%';
  
  RETURN QUERY SELECT 
    COALESCE(array_length(matched_kw, 1) > 0, FALSE),
    COALESCE(matched_kw, ARRAY[]::TEXT[]),
    COALESCE(matched_cat, ARRAY[]::TEXT[]);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION detect_emergency_keywords IS 'Detect emergency keywords in text input';

-- Grant necessary permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE ON tickets TO your_app_user;
-- GRANT SELECT ON ticket_details TO your_app_user;
-- GRANT SELECT ON emergency_keywords TO your_app_user;
-- GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO your_app_user;