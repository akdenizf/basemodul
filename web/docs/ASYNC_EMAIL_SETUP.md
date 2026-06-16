# Async Email Setup - Callfolio v5.3

## Überblick

Ab v5.3 werden E-Mails **nicht mehr** direkt im Vapi Webhook versendet. Stattdessen:

1. **Vapi Webhook** schreibt nur die Rohdaten (was die KI gehört hat) in die Datenbank
2. **Supabase Database Webhook** triggert automatisch die Verarbeitung
3. **Async Processor** führt Fuzzy Matching durch und versendet die E-Mail mit sauberen Daten

## Architektur

```
┌─────────────┐
│ Vapi Call   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────┐
│ Next.js Webhook         │
│ /api/vapi/webhook       │
│                         │
│ - Rohdaten speichern    │
│ - Ticket-Code generieren│
│ - Keine E-Mail!         │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Supabase DB             │
│ tickets table           │
│                         │
│ INSERT trigger fires    │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Database Webhook        │
│ (Supabase Dashboard)    │
│                         │
│ POST to /api/tickets/   │
│         process-new     │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Async Processor         │
│ /api/tickets/process-new│
│                         │
│ 1. Fuzzy Matching       │
│ 2. Ticket Update        │
│ 3. E-Mail senden        │
└─────────────────────────┘
```

## Setup-Schritte

### 1. Datenbank-Migration ausführen

```bash
# In Supabase SQL Editor:
```

Führe das SQL-Skript aus: `database/add_async_fields_to_tickets.sql`

Dies fügt folgende Felder zur `tickets`-Tabelle hinzu:
- `match_type` (TEXT): NONE, PHONE_EXACT, FUZZY_HIGH, FUZZY_LOW
- `processed_at` (TIMESTAMPTZ): Wann wurde das Fuzzy Matching durchgeführt?
- `email_sent_at` (TIMESTAMPTZ): Wann wurde die E-Mail versendet?

### 2. Supabase Database Webhook einrichten

1. Gehe zu **Supabase Dashboard** → **Database** → **Webhooks**
2. Klicke auf **Create a new hook**
3. Konfiguration:

```
Name: process-new-ticket
Table: tickets
Events: INSERT
Type: HTTP Request
Method: POST
URL: https://callfolio.io/api/tickets/process-new
Headers:
  Content-Type: application/json
  Authorization: Bearer YOUR_SECRET_WEBHOOK_TOKEN (optional)
```

4. **Payload-Template**:

```json
{
  "ticket_id": "{{ record.id }}",
  "ticket_code": "{{ record.ticket_code }}",
  "organization_id": "{{ record.organization_id }}"
}
```

5. Speichern und aktivieren

### 3. Webhook-Token sichern (optional)

Füge in deiner `.env.local` hinzu:

```env
WEBHOOK_SECRET=dein-geheimer-token
```

Und in `/api/tickets/process-new/route.ts` am Anfang:

```typescript
// Webhook-Authentifizierung (optional)
const authHeader = req.headers.get('authorization');
const expectedToken = process.env.WEBHOOK_SECRET;

if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

## Vorteile dieser Architektur

### 1. Daten-Integrität
- **Vorher**: E-Mail wurde versendet, auch wenn DB-Insert fehlschlug
- **Jetzt**: E-Mail wird nur versendet, wenn das Ticket in der DB ist

### 2. Saubere Daten
- **Vorher**: E-Mail enthielt "Fatig Akinew" (was die KI gehört hat)
- **Jetzt**: E-Mail enthält "Fatih Akdeniz" (nach Fuzzy Matching)

### 3. Fehler-Isolation
- **Vorher**: Wenn Resend down ist, hängt der Vapi-Call
- **Jetzt**: Vapi-Call ist sofort fertig, E-Mail wird asynchron versucht

### 4. Retry-Logik möglich
- Falls E-Mail fehlschlägt, kann der Processor später erneut aufgerufen werden
- Supabase Webhooks haben automatisches Retry (5x mit Exponential Backoff)

### 5. Audit Trail
- Jeder Schritt wird geloggt: Insert → Processing → Email
- `match_type` zeigt, wie gut der Mieter identifiziert wurde

## Matching-Typen

| Match Type    | Beschreibung                                      | Aktion                          |
|---------------|---------------------------------------------------|---------------------------------|
| `PHONE_EXACT` | Telefonnummer stimmt exakt überein (Last 10)      | Auto-Assign, E-Mail sofort      |
| `FUZZY_HIGH`  | Name/Adresse-Match ≥ 0.7                          | Auto-Assign, E-Mail sofort      |
| `FUZZY_LOW`   | Name/Adresse-Match 0.4-0.69                       | Manuelle Review, E-Mail mit ⚠️  |
| `NONE`        | Kein Match gefunden                               | Gast-Ticket, E-Mail mit Rohdaten|

## Testing

### Manueller Test des Processors

```bash
curl -X POST https://callfolio.io/api/tickets/process-new \
  -H "Content-Type: application/json" \
  -d '{"ticket_id": "DEINE-TICKET-UUID"}'
```

### Log-Überprüfung

Nach einem Anruf solltest du in den Vercel-Logs sehen:

```
📝 INSERT START: call_id=abc123
✅ INSERT SUCCESS: id=xyz code=492989
📤 RESPONSE: code=492989
   NOTE: Email will be sent asynchronously after fuzzy matching
```

Dann in den Logs des Processors:

```
🔄 PROCESSING TICKET: xyz
📋 TICKET LOADED: 492989
✅ PHONE MATCH: Fatih Akdeniz
✅ TICKET UPDATED with match_type=PHONE_EXACT
📧 EMAIL SENT to info@akdeniz-hausverwaltung.de
```

## Troubleshooting

### E-Mail wird nicht versendet

1. Prüfe Supabase Webhook Logs: Dashboard → Database → Webhooks → Logs
2. Prüfe Vercel Function Logs für `/api/tickets/process-new`
3. Prüfe `tickets` Tabelle: Ist `processed_at` NULL?

### Doppelte E-Mails

- Supabase Webhooks können bei Timeouts retries machen
- Lösung: Prüfe in `process-new` ob `processed_at` bereits gesetzt ist

```typescript
if (ticket.processed_at) {
  console.log(`⚠️ Ticket already processed, skipping`);
  return NextResponse.json({ success: true, message: "Already processed" });
}
```

### Fuzzy Matching findet nichts

- Prüfe ob `match_tenant` RPC-Funktion existiert (aus v5.2 Migration)
- Prüfe ob `tenants` Tabelle Daten für die richtige `organization_id` hat
- Prüfe ob `canonical_address` in `tenants` korrekt befüllt ist

## Migration von v5.2 zu v5.3

Falls du bereits v5.2 im Betrieb hast:

1. **Backup**: Exportiere deine `tickets` Tabelle
2. **Migration**: Führe `add_async_fields_to_tickets.sql` aus
3. **Deploy**: Pushe die neue `route.ts` (ohne Resend-Code)
4. **Webhook**: Richte den Database Webhook ein
5. **Test**: Mache einen Testanruf und prüfe die Logs

**Wichtig**: Alte Tickets (vor v5.3) haben `processed_at = NULL`. Du kannst sie nachträglich verarbeiten:

```sql
SELECT id FROM tickets WHERE processed_at IS NULL;
```

Dann für jede ID den Processor manuell aufrufen.

## Nächste Schritte (Optional)

### Automatische Retry-Queue

Für Tickets, bei denen die E-Mail fehlgeschlagen ist:

```typescript
// Cron-Job (z.B. Vercel Cron oder Supabase Edge Function)
const { data: failedTickets } = await supabase
  .from('tickets')
  .select('id')
  .is('processed_at', null)
  .lt('created_at', new Date(Date.now() - 5 * 60 * 1000)); // älter als 5 Min

for (const ticket of failedTickets) {
  await fetch('/api/tickets/process-new', {
    method: 'POST',
    body: JSON.stringify({ ticket_id: ticket.id })
  });
}
```

### Dashboard-Integration

Zeige `match_type` im Ticket-Dashboard:

```tsx
{ticket.match_type === 'FUZZY_LOW' && (
  <Badge variant="warning">⚠️ Niedrige Übereinstimmung</Badge>
)}
```

### Statistiken

```sql
SELECT 
  match_type, 
  COUNT(*) as count,
  AVG(EXTRACT(EPOCH FROM (email_sent_at - created_at))) as avg_processing_time_seconds
FROM tickets
WHERE processed_at IS NOT NULL
GROUP BY match_type;
```

## Fazit

Mit dieser Architektur ist Callfolio jetzt:
- **Zuverlässiger**: Keine verlorenen Tickets mehr
- **Professioneller**: Saubere Daten in E-Mails
- **Skalierbarer**: Async-Processing kann unabhängig skalieren
- **Wartbarer**: Klare Trennung von Voice-Input und Daten-Verarbeitung
