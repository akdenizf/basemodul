# Callfolio Final Testing Guide

Diese Branch (`final-testing`) dient der finalen Validierung aller Features vor dem Release.

## 1. Datenbank-Validierung
Stelle sicher, dass alle Migrationen (bis v11) im Supabase SQL Editor ausgeführt wurden.

### Checkliste:
- [ ] `database/v10-billing.sql` ausgeführt
- [ ] `database/v11-billing-duration.sql` ausgeführt

### Validierungsscript:
Führe `tests/db-check.ts` aus, um das Schema zu prüfen:
```bash
npx tsx tests/db-check.ts
```

## 2. API & Webhook Tests
Wir nutzen manuelle Integrationstests, um den Vapi-Flow zu simulieren.

### Test-Szenarien:
1. **Ticket-Erstellung**: Simuliert einen Anruf, der ein Ticket erstellt.
2. **Billing-Check**: Prüft, ob `current_month_calls` hochgezählt wird.
3. **Duration-Check**: Sendet ein `call-ended` Event und prüft die Sekunden-Abrechnung.
4. **Completion-SMS**: Setzt ein Ticket auf `RESOLVED` und prüft das Twilio-Log.

## 3. Manuelle Checkliste (Dashboard)
- [ ] Login mit `ADMIN_EMAIL` funktioniert.
- [ ] Tickets werden korrekt geladen.
- [ ] Status-Änderung (In Bearbeitung / Erledigt) zeigt Spinner und aktualisiert die DB.
- [ ] Billing-Status im Dashboard zeigt verbrauchte Minuten/Anrufe.

## 4. Automatisierte Integrationstests (Beta)
Das Script `tests/run_api_tests.sh` kann genutzt werden, um die API-Endpoints lokal zu testen:
```bash
chmod +x tests/run_api_tests.sh
./tests/run_api_tests.sh
```
