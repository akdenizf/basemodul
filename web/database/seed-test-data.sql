-- Test Data for Callfolio v4.0 (Fuzzy Matching)

-- 1. Insert a test tenant (Hausverwaltung)
-- Note: Replace 'test-verwaltung' with the ID you use in your TENANT_MAPPING
INSERT INTO tenants (tenant_id, name, phone, address, unit, email, notes)
VALUES 
  ('test-verwaltung', 'Max Müller', '+491701234567', 'Musterstraße 12, 80331 München', '3. OG links', 'max.mueller@example.com', 'Hauptmieter'),
  ('test-verwaltung', 'Anna Schmidt', '+491709876543', 'Leopoldstraße 45, 80802 München', 'EG rechts', 'anna.schmidt@example.com', 'Gewerbeeinheit'),
  ('test-verwaltung', 'Bülent Akdeniz', '+491701112233', 'Sendlinger Straße 78, 80331 München', '2. OG', 'b.akdeniz@example.com', 'VIP Mieter')
;

-- 2. Insert some initial tickets to test the dashboard filters
INSERT INTO tickets (
  tenant_id, call_id, status, urgency, category, sentiment, 
  caller_name, caller_phone, address, unit, issue_summary, issue_details,
  raw_caller_name, raw_caller_address, tenant_match_type, match_confidence, 
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
  )
;

-- 3. Verify matches
-- You can run: SELECT * FROM fuzzy_tenant_search('test-verwaltung', 'Maks Müllar', 'Musterstr. 12');
