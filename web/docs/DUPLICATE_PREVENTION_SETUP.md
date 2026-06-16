# Duplicate Ticket Prevention - Setup Guide

## Überblick

Das Duplicate Ticket Prevention System verhindert, dass Anrufer versehentlich mehrere Tickets für dasselbe Problem erstellen. Es erkennt bestehende offene Tickets und bietet intelligente Optionen für Updates oder neue Tickets.

## 🔧 Setup Schritte

### 1. Datenbank Schema Updates

Führe die SQL-Befehle aus [`database/schema-updates.sql`](../database/schema-updates.sql) in deiner Supabase SQL-Konsole aus:

```sql
-- Wichtigste Updates:
ALTER TABLE tickets ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE tickets ADD COLUMN parent_ticket_id UUID REFERENCES tickets(id);
CREATE INDEX idx_tickets_phone_status ON tickets(caller_phone, status) WHERE status IN ('NEW', 'IN_PROGRESS');
```

### 2. Vapi Tool Konfiguration

Konfiguriere zwei Tools in deinem Vapi Assistant:

#### Tool 1: check_existing_ticket
```json
{
  "name": "check_existing_ticket",
  "description": "Prüft ob der Anrufer bereits ein offenes Ticket hat",
  "parameters": {
    "type": "object",
    "properties": {
      "caller_phone": {
        "type": "string",
        "description": "Telefonnummer des Anrufers"
      }
    },
    "required": ["caller_phone"]
  }
}
```

#### Tool 2: submit_ticket (erweitert)
Füge zu deinem bestehenden `submit_ticket` Tool hinzu:
```json
{
  "existing_ticket_id": {
    "type": "string",
    "description": "ID des bestehenden Tickets für Updates (optional)"
  }
}
```

### 3. Vapi Assistant Prompt

Erweitere deinen Assistant Prompt um diese Logik:

```
## Duplicate Prevention Flow

1. IMMER zuerst nach der Telefonnummer fragen
2. check_existing_ticket(caller_phone) aufrufen
3. WENN has_existing = true:
   - Sage: "Zu Ihrer Meldung '{summary}' vom {created_at} liegt bereits ein Ticket vor."
   - Frage: "Möchten Sie zusätzliche Informationen geben (sagen Sie '1') oder ein neues Problem melden (sagen Sie '2')?"
   
   WENN "1" (Update):
   - Normale Intake-Fragen für zusätzliche Details
   - submit_ticket(..., existing_ticket_id: ticket_id)
   
   WENN "2" (Neues Ticket):
   - Normale Intake-Fragen für neues Problem
   - submit_ticket(...) ohne existing_ticket_id

4. SONST (kein bestehendes Ticket):
   - Normale Intake-Fragen
   - submit_ticket(...)
```

## 🧪 Testing

### Manuelle Tests

1. **Test 1 - Erster Anruf:**
   ```bash
   curl -X POST http://localhost:3000/api/vapi/check-ticket \
     -H "x-vapi-secret: your_secret" \
     -H "Content-Type: application/json" \
     -d '{"caller_phone": "+491701234567"}'
   
   # Expected: {"has_existing": false}
   ```

2. **Test 2 - Ticket erstellen:**
   ```bash
   # Erstelle ein Ticket mit dem Webhook
   # Expected: Neues Ticket in Datenbank
   ```

3. **Test 3 - Zweiter Anruf:**
   ```bash
   # Gleicher check-ticket Call
   # Expected: {"has_existing": true, "ticket_id": "...", "summary": "..."}
   ```

### Automatisierte Tests

Nutze die Test-Suite in [`tests/duplicate-prevention.test.ts`](../tests/duplicate-prevention.test.ts):

```typescript
import { DuplicatePreventionTester } from './tests/duplicate-prevention.test';

const tester = new DuplicatePreventionTester();
await tester.runScenario1();
```

## 📊 Monitoring

### Wichtige Metriken

1. **Duplicate Prevention Rate:**
   ```sql
   SELECT 
     COUNT(*) FILTER (WHERE existing_ticket_id IS NOT NULL) as updates,
     COUNT(*) as total_submissions,
     ROUND(100.0 * COUNT(*) FILTER (WHERE existing_ticket_id IS NOT NULL) / COUNT(*), 2) as prevention_rate
   FROM tickets 
   WHERE created_at > NOW() - INTERVAL '7 days';
   ```

2. **Häufigste Anrufer:**
   ```sql
   SELECT caller_phone, COUNT(*) as ticket_count
   FROM tickets 
   WHERE created_at > NOW() - INTERVAL '30 days'
   GROUP BY caller_phone 
   HAVING COUNT(*) > 1
   ORDER BY ticket_count DESC;
   ```

### Email-Überwachung

- **Neue Tickets:** Subject beginnt mit `[NEW]`
- **Updates:** Subject beginnt mit `[UPDATE]`

## 🚨 Troubleshooting

### Häufige Probleme

1. **check_existing_ticket gibt immer false zurück:**
   - Prüfe Index: `idx_tickets_phone_status`
   - Prüfe Telefonnummer-Format (E.164 empfohlen)
   - Prüfe Status-Filter (`NEW`, `IN_PROGRESS`)

2. **Updates funktionieren nicht:**
   - Prüfe `existing_ticket_id` Parameter
   - Prüfe ob Ticket existiert und nicht geschlossen ist
   - Prüfe `updated_at` Trigger

3. **Performance-Probleme:**
   - Prüfe Indizes mit `EXPLAIN ANALYZE`
   - Überwache Abfrage-Performance in Supabase

### Debug-Queries

```sql
-- Prüfe offene Tickets für Telefonnummer
SELECT * FROM tickets 
WHERE caller_phone = '+491701234567' 
AND status IN ('NEW', 'IN_PROGRESS')
ORDER BY created_at DESC;

-- Prüfe Update-Historie
SELECT ticket_id, issue_summary, issue_details, created_at, updated_at
FROM tickets 
WHERE caller_phone = '+491701234567'
ORDER BY updated_at DESC;

-- Prüfe Index-Nutzung
EXPLAIN ANALYZE 
SELECT ticket_id, issue_summary, created_at
FROM tickets 
WHERE caller_phone = '+491701234567' 
AND status IN ('NEW', 'IN_PROGRESS')
ORDER BY created_at DESC 
LIMIT 1;
```

## 📈 Erweiterte Features

### Zukünftige Verbesserungen

1. **Ähnlichkeits-Erkennung:** Erkennung ähnlicher Probleme auch bei verschiedenen Telefonnummern
2. **Automatische Kategorisierung:** KI-basierte Erkennung ob Update oder neues Problem
3. **Eskalations-Logik:** Automatische Prioritäts-Erhöhung bei wiederholten Anrufen
4. **Analytics Dashboard:** Visualisierung der Duplicate Prevention Metriken

### Integration mit anderen Systemen

- **CRM-Integration:** Sync mit bestehenden Hausverwaltungs-Systemen
- **SMS-Benachrichtigungen:** Automatische Updates an Mieter
- **Kalender-Integration:** Automatische Terminplanung für Reparaturen

## 📞 Support

Bei Problemen oder Fragen:
1. Prüfe die Logs in der Browser-Konsole und Server-Logs
2. Teste mit den bereitgestellten Test-Szenarien
3. Prüfe Supabase-Logs für Datenbank-Fehler
4. Kontaktiere das Entwicklungsteam mit spezifischen Fehlermeldungen