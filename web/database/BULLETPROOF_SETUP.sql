-- BULLETPROOF CALLFOLIO SETUP
-- Dieses Skript MUSS funktionieren - keine Ausreden!
-- Führe es in einem Rutsch im Supabase SQL Editor aus

-- SCHRITT 1: Sauberer Slate (falls nötig)
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS tenants CASCADE;
DROP TABLE IF EXISTS emergency_keywords CASCADE;
DROP FUNCTION IF EXISTS fuzzy_tenant_search CASCADE;
DROP FUNCTION IF EXISTS generate_ticket_code CASCADE;
DROP FUNCTION IF EXISTS generate_ticket_id CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
DROP FUNCTION IF EXISTS find_potential_duplicates CASCADE;
DROP FUNCTION IF EXISTS detect_emergency_keywords CASCADE;

-- SCHRITT 2: Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- SCHRITT 3: Enums
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

-- SCHRITT 4: Tenants Tabelle
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    unit TEXT,
    email TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    canonical_address TEXT
);

-- SCHRITT 5: Tickets Tabelle (VOLLSTÄNDIG)
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Identification
    tenant_id TEXT NOT NULL,
    call_id TEXT UNIQUE NOT NULL,
    ticket_id TEXT,
    ticket_code VARCHAR(6) UNIQUE,
    
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
    
    -- Relationships
    duplicate_of UUID REFERENCES tickets(id),
    parent_ticket_id UUID REFERENCES tickets(id),
    
    -- v4.0 Fuzzy Matching Fields
    raw_caller_name TEXT,
    raw_caller_address TEXT,
    match_type TEXT,
    match_confidence NUMERIC(3,2),
    matched_tenant_id UUID,
    requires_manual_review BOOLEAN DEFAULT FALSE,
    
    -- Meta
    vapi_cost NUMERIC(10,4),
    ticket_json JSONB -- OPTIONAL, nicht NOT NULL!
);

-- SCHRITT 6: Trigger Functions
CREATE OR REPLACE FUNCTION generate_ticket_code()
RETURNS TRIGGER AS $$
DECLARE
  new_code VARCHAR(6);
  attempt_count INTEGER := 0;
  max_attempts INTEGER := 100;
BEGIN
  IF NEW.ticket_code IS NULL THEN
    LOOP
      new_code := LPAD((FLOOR(RANDOM() * 900000) + 100000)::TEXT, 6, '0');
      
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

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- SCHRITT 7: Triggers
CREATE TRIGGER generate_ticket_code_trigger
    BEFORE INSERT ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION generate_ticket_code();

CREATE TRIGGER update_tickets_updated_at
    BEFORE UPDATE ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- SCHRITT 8: Fuzzy Search Function
CREATE OR REPLACE FUNCTION fuzzy_tenant_search(
    search_tenant_id TEXT,
    search_name TEXT,
    search_address TEXT
)
RETURNS TABLE(
    id UUID,
    tenant_id TEXT,
    name TEXT,
    phone TEXT,
    address TEXT,
    unit TEXT,
    email TEXT,
    combined_score NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.tenant_id,
        t.name,
        t.phone,
        t.address,
        t.unit,
        t.email,
        GREATEST(
            similarity(t.name, search_name),
            similarity(t.address, search_address)
        ) as combined_score
    FROM tenants t
    WHERE t.tenant_id = search_tenant_id
    ORDER BY combined_score DESC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- SCHRITT 9: Indexes
CREATE INDEX idx_tenants_name_trgm ON tenants USING gin (name gin_trgm_ops);
CREATE INDEX idx_tenants_address_trgm ON tenants USING gin (address gin_trgm_ops);
CREATE UNIQUE INDEX IF NOT EXISTS idx_tenants_canonical_address ON tenants (tenant_id, canonical_address);
CREATE INDEX idx_tickets_tenant_created ON tickets(tenant_id, created_at DESC);
CREATE INDEX idx_tickets_call_id ON tickets(call_id);
CREATE INDEX idx_tickets_phone_status ON tickets(caller_phone, status) WHERE status IN ('NEW', 'IN_PROGRESS');

-- SCHRITT 10: Testdaten (GARANTIERT FUNKTIONIEREND)
INSERT INTO tenants (tenant_id, name, phone, address, unit, email, notes)
VALUES 
  ('test-verwaltung', 'Max Müller', '+491701234567', 'Musterstraße 12, 80331 München', '3. OG links', 'max.mueller@example.com', 'Hauptmieter'),
  ('test-verwaltung', 'Anna Schmidt', '+491709876543', 'Leopoldstraße 45, 80802 München', 'EG rechts', 'anna.schmidt@example.com', 'Gewerbeeinheit'),
  ('test-verwaltung', 'Bülent Akdeniz', '+491701112233', 'Sendlinger Straße 78, 80331 München', '2. OG', 'b.akdeniz@example.com', 'VIP Mieter');

INSERT INTO tickets (
  tenant_id, call_id, status, urgency, category, sentiment, 
  caller_name, caller_phone, address, unit, issue_summary, issue_details,
  raw_caller_name, raw_caller_address, match_type, match_confidence, 
  requires_manual_review, escalation_is_emergency, ticket_json
)
VALUES 
  (
    'test-verwaltung', 
    'sim_001', 
    'NEW', 
    'HIGH', 
    'PLUMBING', 
    'STRESSED', 
    'Max Müller', 
    '+491701234567', 
    'Musterstraße 12', 
    '3. OG links', 
    'Rohrbruch', 
    'Wasser läuft aus der Decke im Badezimmer.',
    'Max Müller',
    'Musterstraße 12',
    'PHONE_EXACT',
    1.00,
    false,
    false,
    '{"caller_input": "Wasserschaden", "ai_classification": "PLUMBING"}'::jsonb
  ),
  (
    'test-verwaltung', 
    'sim_002', 
    'IN_PROGRESS', 
    'LOW', 
    'ADMIN', 
    'CALM', 
    'Anna Schmidt', 
    '+491709876543', 
    'Leopoldstraße 45', 
    'EG rechts', 
    'Frage zum Mietvertrag', 
    'Möchte Untermieter anmelden.',
    'Anna Schmidt',
    'Leopoldstraße 45',
    'PHONE_EXACT',
    1.00,
    false,
    false,
    '{"caller_input": "Mietvertrag", "ai_classification": "ADMIN"}'::jsonb
  ),
  (
    'test-verwaltung', 
    'sim_003', 
    'NEW', 
    'MEDIUM', 
    'ELECTRICAL', 
    'UNKNOWN', 
    'Unbekannter Anrufer', 
    '+491510000000', 
    'Unbekannte Str. 1', 
    '?', 
    'Licht im Flur kaputt', 
    'Es ist stockfinster im Hausflur.',
    'Unbekannter Anrufer',
    'Unbekannte Str. 1',
    'NO_MATCH',
    0.00,
    true,
    false,
    '{"caller_input": "Licht kaputt", "ai_classification": "ELECTRICAL"}'::jsonb
  );

-- FERTIG! 
SELECT 'SETUP ERFOLGREICH - ' || COUNT(*) || ' Tickets erstellt!' as result FROM tickets;