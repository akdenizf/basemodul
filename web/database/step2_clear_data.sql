-- ============================================================
-- SCHRITT 2: DATEN LÖSCHEN
-- ============================================================

-- Alle Daten löschen (werden neu erstellt)
TRUNCATE TABLE tickets CASCADE;
TRUNCATE TABLE tenants CASCADE;
TRUNCATE TABLE profiles CASCADE;

-- ticket_activities falls vorhanden
DROP TABLE IF EXISTS ticket_activities CASCADE;

SELECT 'Schritt 2 abgeschlossen: Alle Daten gelöscht' as status;