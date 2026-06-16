-- CALLFOLIO DATABASE STABILIZATION MIGRATION
-- Behebt alle identifizierten Schema-Code-Inkonsistenzen
-- Ausführung: Kopiere diesen gesamten Block in den Supabase SQL Editor

-- ========================================
-- PHASE 1: KRITISCHE KORREKTUREN
-- ========================================

-- 1. Fehlende Spalte hinzufügen: final_caller_name
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS final_caller_name TEXT;

-- 2. Feldnamen-Standardisierung: Entscheidung für 'match_type' (einfacher für Code)
-- Umbenennung von tenant_match_type zu match_type
ALTER TABLE tickets RENAME COLUMN tenant_match_type TO match_type;

-- 3. ticket_json Nullability standardisieren (nullable für GDPR-Compliance)
ALTER TABLE tickets ALTER COLUMN ticket_json DROP NOT NULL;

-- 4. Audit-Log Trigger korrigieren (verwendet jetzt match_type statt tenant_match_type)
CREATE OR REPLACE FUNCTION log_ticket_creation()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO ticket_activities (
    ticket_id,
    admin_email,
    activity_type,
    description,
    new_value,
    metadata
  ) VALUES (
    NEW.id,
    'system@callfolio.io',
    'created',
    'Ticket automatisch erstellt über Vapi-Anruf',
    jsonb_build_object(
      'caller_name', NEW.caller_name,
      'caller_phone', NEW.caller_phone,
      'issue_summary', NEW.issue_summary,
      'urgency', NEW.urgency,
      'category', NEW.category
    ),
    jsonb_build_object(
      'call_id', NEW.call_id,
      'match_type', NEW.match_type,  -- KORRIGIERT: verwendet jetzt match_type
      'match_confidence', NEW.match_confidence
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Audit-Log Update Trigger korrigieren
CREATE OR REPLACE FUNCTION log_ticket_update()
RETURNS TRIGGER AS $$
DECLARE
  changes_detected BOOLEAN := FALSE;
  change_description TEXT := '';
BEGIN
  -- Check for status changes
  IF OLD.status != NEW.status THEN
    changes_detected := TRUE;
    change_description := change_description || 'Status: ' || OLD.status || ' → ' || NEW.status || '; ';
  END IF;
  
  -- Check for urgency changes
  IF OLD.urgency != NEW.urgency THEN
    changes_detected := TRUE;
    change_description := change_description || 'Dringlichkeit: ' || OLD.urgency || ' → ' || NEW.urgency || '; ';
  END IF;
  
  -- Check for assignment changes (caller_name as proxy for tenant assignment)
  IF COALESCE(OLD.caller_name, '') != COALESCE(NEW.caller_name, '') THEN
    changes_detected := TRUE;
    change_description := change_description || 'Mieter zugeordnet: ' || COALESCE(NEW.caller_name, 'Unbekannt') || '; ';
  END IF;
  
  -- Log the changes if any were detected
  IF changes_detected THEN
    INSERT INTO ticket_activities (
      ticket_id,
      admin_email,
      activity_type,
      description,
      old_value,
      new_value
    ) VALUES (
      NEW.id,
      'system@callfolio.io',
      'updated',
      'Ticket aktualisiert: ' || TRIM(TRAILING '; ' FROM change_description),
      jsonb_build_object(
        'status', OLD.status,
        'urgency', OLD.urgency,
        'caller_name', OLD.caller_name,
        'match_type', OLD.match_type  -- KORRIGIERT: verwendet jetzt match_type
      ),
      jsonb_build_object(
        'status', NEW.status,
        'urgency', NEW.urgency,
        'caller_name', NEW.caller_name,
        'match_type', NEW.match_type  -- KORRIGIERT: verwendet jetzt match_type
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- PHASE 2: STRUKTURELLE VERBESSERUNGEN
-- ========================================

-- 6. Fremdschlüssel-Constraints mit ON DELETE Verhalten härten
ALTER TABLE tickets 
  DROP CONSTRAINT IF EXISTS tickets_matched_tenant_id_fkey,
  ADD CONSTRAINT tickets_matched_tenant_id_fkey 
    FOREIGN KEY (matched_tenant_id) REFERENCES tenants(id) ON DELETE SET NULL;

ALTER TABLE tickets 
  DROP CONSTRAINT IF EXISTS tickets_duplicate_of_fkey,
  ADD CONSTRAINT tickets_duplicate_of_fkey 
    FOREIGN KEY (duplicate_of) REFERENCES tickets(id) ON DELETE SET NULL;

ALTER TABLE tickets 
  DROP CONSTRAINT IF EXISTS tickets_parent_ticket_id_fkey,
  ADD CONSTRAINT tickets_parent_ticket_id_fkey 
    FOREIGN KEY (parent_ticket_id) REFERENCES tickets(id) ON DELETE SET NULL;

-- 7. Fehlende Performance-kritische Indizes hinzufügen
CREATE INDEX IF NOT EXISTS idx_tickets_match_type 
  ON tickets(match_type, created_at DESC) WHERE match_type IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_tickets_matched_tenant_id 
  ON tickets(matched_tenant_id) WHERE matched_tenant_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_tenants_tenant_id 
  ON tenants(tenant_id);

CREATE INDEX IF NOT EXISTS idx_tickets_status_created 
  ON tickets(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_tickets_tenant_status_created 
  ON tickets(tenant_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_tickets_final_caller_name
  ON tickets(final_caller_name) WHERE final_caller_name IS NOT NULL;

-- 8. Check-Constraints für Datenintegrität hinzufügen
ALTER TABLE tickets ADD CONSTRAINT tickets_match_confidence_check 
  CHECK (match_confidence IS NULL OR (match_confidence >= 0 AND match_confidence <= 1));

ALTER TABLE tickets ADD CONSTRAINT tickets_ticket_code_format 
  CHECK (ticket_code IS NULL OR ticket_code ~ '^[0-9]{6}$');

-- 9. Tenants Tabelle standardisieren
-- Unique Constraint hinzufügen (falls noch nicht vorhanden)
ALTER TABLE tenants 
  DROP CONSTRAINT IF EXISTS tenants_tenant_phone_unit_unique;
ALTER TABLE tenants 
  ADD CONSTRAINT tenants_tenant_phone_unit_unique 
    UNIQUE(tenant_id, phone, unit);

-- 10. Updated_at Trigger für tenants hinzufügen
CREATE OR REPLACE FUNCTION update_tenants_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Spalte hinzufügen falls nicht vorhanden
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Trigger erstellen
DROP TRIGGER IF EXISTS update_tenants_updated_at ON tenants;
CREATE TRIGGER update_tenants_updated_at
    BEFORE UPDATE ON tenants
    FOR EACH ROW
    EXECUTE FUNCTION update_tenants_updated_at();

-- 11. Indizes für ticket_activities Performance
CREATE INDEX IF NOT EXISTS idx_ticket_activities_ticket_created 
  ON ticket_activities(ticket_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ticket_activities_admin_created 
  ON ticket_activities(admin_email, created_at DESC);

-- ========================================
-- PHASE 3: VALIDIERUNG UND KOMMENTARE
-- ========================================

-- 12. Spalten-Kommentare für Dokumentation aktualisieren
COMMENT ON COLUMN tickets.match_type IS 'Type of tenant match: MATCH, REVIEW, UNKNOWN (renamed from tenant_match_type)';
COMMENT ON COLUMN tickets.final_caller_name IS 'Cleaned/corrected caller name after fuzzy matching';
COMMENT ON COLUMN tickets.match_confidence IS 'Confidence score (0.00-1.00) for fuzzy matches';
COMMENT ON COLUMN tickets.ticket_json IS 'Original Vapi JSON data (nullable for GDPR compliance)';

-- 13. Validierungsabfragen ausführen
DO $$
DECLARE
  orphaned_count INTEGER;
  duplicate_count INTEGER;
  invalid_confidence_count INTEGER;
  missing_required_count INTEGER;
BEGIN
  -- Check für verwaiste matched_tenant_id Referenzen
  SELECT COUNT(*) INTO orphaned_count
  FROM tickets t 
  WHERE t.matched_tenant_id IS NOT NULL 
    AND NOT EXISTS (SELECT 1 FROM tenants WHERE id = t.matched_tenant_id);
  
  IF orphaned_count > 0 THEN
    RAISE WARNING 'Found % orphaned matched_tenant_id references', orphaned_count;
  END IF;
  
  -- Check für doppelte call_ids
  SELECT COUNT(*) INTO duplicate_count
  FROM (
    SELECT call_id 
    FROM tickets 
    GROUP BY call_id 
    HAVING COUNT(*) > 1
  ) duplicates;
  
  IF duplicate_count > 0 THEN
    RAISE WARNING 'Found % duplicate call_ids', duplicate_count;
  END IF;
  
  -- Check für ungültige match_confidence Werte
  SELECT COUNT(*) INTO invalid_confidence_count
  FROM tickets 
  WHERE match_confidence IS NOT NULL 
    AND (match_confidence < 0 OR match_confidence > 1);
  
  IF invalid_confidence_count > 0 THEN
    RAISE WARNING 'Found % invalid match_confidence values', invalid_confidence_count;
  END IF;
  
  -- Check für Tickets mit fehlenden Pflichtfeldern
  SELECT COUNT(*) INTO missing_required_count
  FROM tickets 
  WHERE tenant_id IS NULL OR call_id IS NULL 
    OR urgency IS NULL OR category IS NULL OR sentiment IS NULL;
  
  IF missing_required_count > 0 THEN
    RAISE WARNING 'Found % tickets with missing required fields', missing_required_count;
  END IF;
  
  -- Erfolgreiche Validierung
  IF orphaned_count = 0 AND duplicate_count = 0 AND invalid_confidence_count = 0 AND missing_required_count = 0 THEN
    RAISE NOTICE 'All validation checks passed successfully!';
  END IF;
END $$;

-- 14. Abschließende Bestätigung mit Statistiken
SELECT 
  'MIGRATION COMPLETED' as status,
  (SELECT COUNT(*) FROM tickets) as total_tickets,
  (SELECT COUNT(*) FROM tenants) as total_tenants,
  (SELECT COUNT(*) FROM ticket_activities) as total_activities,
  NOW() as completed_at;

-- 15. Performance-Test Abfragen
EXPLAIN (ANALYZE, BUFFERS) 
SELECT t.*, ten.name as tenant_name 
FROM tickets t 
LEFT JOIN tenants ten ON t.matched_tenant_id = ten.id 
WHERE t.status = 'NEW' 
ORDER BY t.created_at DESC 
LIMIT 50;

SELECT 'Database stabilization migration completed successfully!' as final_status;