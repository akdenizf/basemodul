-- CALLFOLIO DATABASE VALIDATION QUERIES
-- Führe diese Abfragen aus, um die Datenintegrität zu überprüfen
-- Alle Abfragen sollten 0 Ergebnisse oder "OK" Status zurückgeben

-- ========================================
-- REFERENTIELLE INTEGRITÄT
-- ========================================

-- 1. Verwaiste matched_tenant_id Referenzen
SELECT 
  'CRITICAL: Orphaned matched_tenant_id references found' as issue,
  COUNT(*) as count,
  ARRAY_AGG(t.id) as ticket_ids
FROM tickets t 
WHERE t.matched_tenant_id IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM tenants WHERE id = t.matched_tenant_id)
HAVING COUNT(*) > 0;

-- 2. Verwaiste duplicate_of Referenzen
SELECT 
  'CRITICAL: Orphaned duplicate_of references found' as issue,
  COUNT(*) as count,
  ARRAY_AGG(t.id) as ticket_ids
FROM tickets t 
WHERE t.duplicate_of IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM tickets WHERE id = t.duplicate_of)
HAVING COUNT(*) > 0;

-- 3. Verwaiste parent_ticket_id Referenzen
SELECT 
  'CRITICAL: Orphaned parent_ticket_id references found' as issue,
  COUNT(*) as count,
  ARRAY_AGG(t.id) as ticket_ids
FROM tickets t 
WHERE t.parent_ticket_id IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM tickets WHERE id = t.parent_ticket_id)
HAVING COUNT(*) > 0;

-- 4. Verwaiste ticket_activities Referenzen
SELECT 
  'CRITICAL: Orphaned ticket_activities references found' as issue,
  COUNT(*) as count,
  ARRAY_AGG(ta.id) as activity_ids
FROM ticket_activities ta 
WHERE NOT EXISTS (SELECT 1 FROM tickets WHERE id = ta.ticket_id)
HAVING COUNT(*) > 0;

-- ========================================
-- DATEN-KONSISTENZ
-- ========================================

-- 5. Doppelte call_ids (sollten unique sein)
SELECT 
  'ERROR: Duplicate call_ids found' as issue,
  call_id,
  COUNT(*) as duplicate_count,
  ARRAY_AGG(id) as ticket_ids
FROM tickets 
GROUP BY call_id 
HAVING COUNT(*) > 1;

-- 6. Doppelte ticket_codes (sollten unique sein)
SELECT 
  'ERROR: Duplicate ticket_codes found' as issue,
  ticket_code,
  COUNT(*) as duplicate_count,
  ARRAY_AGG(id) as ticket_ids
FROM tickets 
WHERE ticket_code IS NOT NULL
GROUP BY ticket_code 
HAVING COUNT(*) > 1;

-- 7. Ungültige match_confidence Werte (sollten 0.00-1.00 sein)
SELECT 
  'ERROR: Invalid match_confidence values found' as issue,
  id,
  match_confidence,
  'Should be between 0.00 and 1.00' as expected
FROM tickets 
WHERE match_confidence IS NOT NULL 
  AND (match_confidence < 0 OR match_confidence > 1);

-- 8. Ungültige ticket_code Formate (sollten 6 Ziffern sein)
SELECT 
  'ERROR: Invalid ticket_code format found' as issue,
  id,
  ticket_code,
  'Should be 6 digits' as expected
FROM tickets 
WHERE ticket_code IS NOT NULL 
  AND ticket_code !~ '^[0-9]{6}$';

-- ========================================
-- PFLICHTFELD-VALIDIERUNG
-- ========================================

-- 9. Tickets mit fehlenden Pflichtfeldern
SELECT 
  'ERROR: Tickets with missing required fields' as issue,
  id,
  CASE 
    WHEN tenant_id IS NULL THEN 'tenant_id missing'
    WHEN call_id IS NULL THEN 'call_id missing'
    WHEN urgency IS NULL THEN 'urgency missing'
    WHEN category IS NULL THEN 'category missing'
    WHEN sentiment IS NULL THEN 'sentiment missing'
    WHEN status IS NULL THEN 'status missing'
  END as missing_field
FROM tickets 
WHERE tenant_id IS NULL 
   OR call_id IS NULL 
   OR urgency IS NULL 
   OR category IS NULL 
   OR sentiment IS NULL
   OR status IS NULL;

-- 10. Tenants mit fehlenden Pflichtfeldern
SELECT 
  'ERROR: Tenants with missing required fields' as issue,
  id,
  CASE 
    WHEN tenant_id IS NULL THEN 'tenant_id missing'
    WHEN name IS NULL THEN 'name missing'
    WHEN address IS NULL THEN 'address missing'
    WHEN unit IS NULL THEN 'unit missing'
  END as missing_field
FROM tenants 
WHERE tenant_id IS NULL 
   OR name IS NULL 
   OR address IS NULL 
   OR unit IS NULL;

-- ========================================
-- LOGISCHE KONSISTENZ
-- ========================================

-- 11. MATCH-Typ Tickets ohne matched_tenant_id
SELECT 
  'WARNING: MATCH tickets without matched_tenant_id' as issue,
  id,
  match_type,
  match_confidence,
  'MATCH tickets should have matched_tenant_id' as expected
FROM tickets 
WHERE match_type = 'MATCH' 
  AND matched_tenant_id IS NULL;

-- 12. Hohe Confidence ohne MATCH-Typ
SELECT 
  'WARNING: High confidence without MATCH type' as issue,
  id,
  match_type,
  match_confidence,
  'High confidence (>= 0.7) should be MATCH type' as expected
FROM tickets 
WHERE match_confidence >= 0.7 
  AND match_type != 'MATCH';

-- 13. UNKNOWN-Typ mit Confidence > 0
SELECT 
  'WARNING: UNKNOWN type with confidence > 0' as issue,
  id,
  match_type,
  match_confidence,
  'UNKNOWN type should have confidence 0 or NULL' as expected
FROM tickets 
WHERE match_type = 'UNKNOWN' 
  AND match_confidence > 0;

-- 14. Manual Review Flag Inkonsistenz
SELECT 
  'WARNING: Manual review flag inconsistency' as issue,
  id,
  match_type,
  requires_manual_review,
  'MATCH should not require manual review, REVIEW/UNKNOWN should' as expected
FROM tickets 
WHERE (match_type = 'MATCH' AND requires_manual_review = true)
   OR (match_type IN ('REVIEW', 'UNKNOWN') AND requires_manual_review = false);

-- ========================================
-- PERFORMANCE-VALIDIERUNG
-- ========================================

-- 15. Tabellen-Größen und Index-Nutzung
SELECT 
  'INFO: Table sizes' as info,
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
  pg_stat_get_live_tuples(c.oid) as row_count
FROM pg_tables pt
JOIN pg_class c ON c.relname = pt.tablename
WHERE schemaname = 'public' 
  AND tablename IN ('tickets', 'tenants', 'ticket_activities', 'emergency_keywords')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- 16. Fehlende Indizes für häufige Abfragen
SELECT 
  'WARNING: Check index usage' as info,
  'Run EXPLAIN ANALYZE on common queries to verify index usage' as recommendation;

-- ========================================
-- ZUSAMMENFASSUNG
-- ========================================

-- 17. Gesamtstatistik
SELECT 
  'SUMMARY: Database overview' as summary,
  (SELECT COUNT(*) FROM tickets) as total_tickets,
  (SELECT COUNT(*) FROM tenants) as total_tenants,
  (SELECT COUNT(*) FROM ticket_activities) as total_activities,
  (SELECT COUNT(*) FROM tickets WHERE match_type = 'MATCH') as matched_tickets,
  (SELECT COUNT(*) FROM tickets WHERE requires_manual_review = true) as manual_review_tickets,
  (SELECT COUNT(*) FROM tickets WHERE status = 'NEW') as new_tickets,
  (SELECT COUNT(*) FROM tickets WHERE escalation_is_emergency = true) as emergency_tickets;

-- 18. Match-Typ Verteilung
SELECT 
  'INFO: Match type distribution' as info,
  match_type,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM tickets), 2) as percentage
FROM tickets 
WHERE match_type IS NOT NULL
GROUP BY match_type
ORDER BY count DESC;

-- 19. Status Verteilung
SELECT 
  'INFO: Status distribution' as info,
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM tickets), 2) as percentage
FROM tickets 
GROUP BY status
ORDER BY count DESC;

-- 20. Abschließende Validierung
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM tickets t 
      WHERE t.matched_tenant_id IS NOT NULL 
        AND NOT EXISTS (SELECT 1 FROM tenants WHERE id = t.matched_tenant_id)
    ) THEN 'FAILED: Orphaned references found'
    WHEN EXISTS (
      SELECT call_id FROM tickets GROUP BY call_id HAVING COUNT(*) > 1
    ) THEN 'FAILED: Duplicate call_ids found'
    WHEN EXISTS (
      SELECT 1 FROM tickets 
      WHERE match_confidence IS NOT NULL 
        AND (match_confidence < 0 OR match_confidence > 1)
    ) THEN 'FAILED: Invalid match_confidence values'
    WHEN EXISTS (
      SELECT 1 FROM tickets 
      WHERE tenant_id IS NULL OR call_id IS NULL 
        OR urgency IS NULL OR category IS NULL OR sentiment IS NULL
    ) THEN 'FAILED: Missing required fields'
    ELSE 'PASSED: All critical validations successful'
  END as final_validation_result,
  NOW() as validated_at;