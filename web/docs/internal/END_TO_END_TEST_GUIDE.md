# End-to-End Test Guide - Callfolio Database Stabilization

## Übersicht
Diese Anleitung führt dich durch die systematische Überprüfung aller Komponenten nach der Database Stabilization Migration.

## Voraussetzungen
1. **Migration ausgeführt**: `database/STABILIZATION_MIGRATION.sql` in Supabase SQL Editor
2. **Code aktualisiert**: Alle TypeScript-Änderungen sind aktiv
3. **Server läuft**: `npm run dev` auf `http://localhost:3000`

## Test-Checkliste

### Phase 1: Database Validation
**Ziel**: Sicherstellen, dass die Datenbank-Migration erfolgreich war

1. **Schema-Validierung**:
   ```sql
   -- In Supabase SQL Editor ausführen:
   \d tickets  -- Sollte match_type (nicht tenant_match_type) und final_caller_name zeigen
   ```

2. **Integritätsprüfung**:
   ```sql
   -- Führe VALIDATION_QUERIES.sql aus
   -- Alle Abfragen sollten 0 Ergebnisse oder "PASSED" Status zeigen
   ```

3. **Testdaten überprüfen**:
   ```sql
   SELECT id, match_type, final_caller_name, matched_tenant_id 
   FROM tickets 
   LIMIT 5;
   ```

### Phase 2: Authentication Flow
**Ziel**: Bestätigen, dass die Auth-Fixes funktionieren

1. **Browser-Cookies löschen**:
   - Chrome DevTools → Application → Storage → Clear storage
   - Oder Incognito-Fenster verwenden

2. **Login testen**:
   - Gehe zu `http://localhost:3000/login`
   - Login: `akdenizfatih@callfolio.de`
   - Password: `senseikakashi`
   - **Erwartung**: "Login erfolgreich" + Redirect zu `/admin`

3. **Cookie-Validierung**:
   - Chrome DevTools → Application → Cookies → `http://localhost:3000`
   - **Erwartung**: `sb-*` Cookies sind sichtbar (z.B. `sb-xxbulengzotyzmllsgij-auth-token`)

4. **Admin API testen**:
   - Besuche: `http://localhost:3000/api/admin/whoami`
   - **Erwartung**: `{"hasUser": true, "email": "akdenizfatih@callfolio.de", "allowlisted": true}`

### Phase 3: Admin Dashboard
**Ziel**: Verifizieren, dass Tickets korrekt geladen werden

1. **Dashboard aufrufen**:
   - Gehe zu `http://localhost:3000/admin/tickets`
   - **Erwartung**: Keine 401/403 Fehler

2. **Ticket-Liste überprüfen**:
   - **Erwartung**: 3 Testtickets werden angezeigt:
     - Max Müller: Rohrbruch (HIGH, NEW)
     - Anna Schmidt: Mietvertragsfrage (LOW, IN_PROGRESS)
     - Unbekannter Anrufer: Licht kaputt (MEDIUM, NEW, Manual Review)

3. **Ticket-Details testen**:
   - Klicke auf ein Ticket in der Liste
   - **Erwartung**: Detail-Panel zeigt korrekte Informationen
   - **Erwartung**: Kein "Ticket null" in der Email-Modal

4. **Match-Typ Anzeige**:
   - **Erwartung**: Grüne Häkchen für PHONE_EXACT matches
   - **Erwartung**: Rote Warnung für NO_MATCH (Unbekannter Anrufer)

### Phase 4: API Endpoints
**Ziel**: Alle Admin-APIs funktionieren korrekt

1. **Tickets API**:
   ```bash
   curl -X GET "http://localhost:3000/api/admin/tickets" \
        -H "Cookie: $(curl -c - -b - -X POST http://localhost:3000/api/admin/login -H 'Content-Type: application/json' -d '{"email":"akdenizfatih@callfolio.de","password":"senseikakashi"}' 2>/dev/null | grep 'Set-Cookie' | cut -d' ' -f2)"
   ```
   - **Erwartung**: JSON mit `{"tickets": [...]}`

2. **Email-Funktionalität** (optional):
   - Klicke "Beauftragen" bei einem Ticket
   - **Erwartung**: Email-Preview öffnet sich ohne Fehler

### Phase 5: Performance Validation
**Ziel**: Sicherstellen, dass neue Indizes funktionieren

1. **Query Performance**:
   ```sql
   -- In Supabase SQL Editor:
   EXPLAIN (ANALYZE, BUFFERS) 
   SELECT * FROM tickets 
   WHERE match_type = 'MATCH' 
   ORDER BY created_at DESC 
   LIMIT 10;
   ```
   - **Erwartung**: Index Scan auf `idx_tickets_match_type`

2. **Dashboard Load Time**:
   - Chrome DevTools → Network → Reload Dashboard
   - **Erwartung**: `/api/admin/tickets` < 500ms Response Time

## Fehlerbehandlung

### Häufige Probleme und Lösungen

#### Problem: 401 Unauthorized bei Admin APIs
**Lösung**:
1. Cookies löschen und neu einloggen
2. Überprüfe `ADMIN_EMAIL` in `.env.local`
3. Teste `/api/admin/whoami` direkt

#### Problem: "Column does not exist" Fehler
**Lösung**:
1. Überprüfe, ob `STABILIZATION_MIGRATION.sql` vollständig ausgeführt wurde
2. Führe `\d tickets` in Supabase aus um Schema zu verifizieren

#### Problem: Tickets laden nicht
**Lösung**:
1. Überprüfe Server-Console auf Fehler
2. Teste direkt: `curl http://localhost:3000/api/admin/tickets`
3. Überprüfe Supabase-Verbindung in `.env.local`

#### Problem: "Ticket null" in UI
**Lösung**:
1. Überprüfe, dass `selectedTicket` korrekt gesetzt wird
2. Verifiziere Ticket-Daten haben `id` Feld

## Erfolgs-Kriterien

### ✅ Alle Tests bestanden wenn:
- [ ] Database Migration ohne Fehler
- [ ] Login setzt Cookies korrekt
- [ ] `/api/admin/whoami` returns `hasUser: true`
- [ ] `/api/admin/tickets` returns 200 mit Daten
- [ ] Dashboard zeigt 3 Testtickets
- [ ] Ticket-Selection funktioniert
- [ ] Keine Console-Errors im Browser
- [ ] Validation Queries zeigen "PASSED"

### 🔧 Bei Problemen:
1. Überprüfe Server-Console Logs
2. Überprüfe Browser Console Errors
3. Führe `VALIDATION_QUERIES.sql` aus
4. Überprüfe `.env.local` Konfiguration

## Rollback-Plan

Falls kritische Probleme auftreten:

1. **Database Rollback**:
   ```sql
   -- Nur falls nötig - führt kompletten Reset durch
   -- VORSICHT: Löscht alle Daten!
   DROP TABLE IF EXISTS ticket_activities CASCADE;
   DROP TABLE IF EXISTS tickets CASCADE;
   DROP TABLE IF EXISTS tenants CASCADE;
   -- Dann erneut Schema aufbauen
   ```

2. **Code Rollback**:
   - Git: `git checkout HEAD~1` (falls committed)
   - Oder manuelle Rückgängigmachung der Änderungen

## Abschluss

Nach erfolgreichem Durchlauf aller Tests ist das Datenbank-Fundament stabilisiert und bereit für den Produktionseinsatz.

**Nächste Schritte**:
1. Entferne temporäre Debug-Logs aus `lib/supabase/server.ts`
2. Dokumentiere die finalen Schema-Änderungen
3. Erstelle Backup der stabilen Datenbank
4. Plane regelmäßige Validierungsläufe