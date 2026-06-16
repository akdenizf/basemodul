# API Contract — Vapi Webhooks & Interaction (V9.1)

**V9.1 SCOPE**: Tool-Integration in Gesprächsflow. `get_active_tickets` wird nach der Empathie-Phase ausgeführt (nicht am Anfang). `add_ticket_note` ist der primäre Pfad für Folgeanrufe mit bestehendem Ticket. Fairness-Regel: Urgency nie wegen Folgeanruf erhöhen.

---

## Webhook Handler (`app/api/vapi/webhook/route.ts`)
- **Security**: No auth header (Vapi-internal — called from assistant-request + tool-calls)
- **Tool Handling**: `submit_ticket`, `end_call` / `end_call_tool`
- **assistant-request**: Dynamic First Message — lädt Tenant aus DB via `vapi_phone_id` + Telefonnummer
- **submit_ticket SCHRITT 1.5**: Server-seitiger Dedup-Check als Safety Net
  - Normalisiert Telefonnummer (letzten 10 Ziffern)
  - Sucht offene Tickets (`NEW`, `IN_PROGRESS`) via `ilike`
  - Bei Treffer: `follow_up_call` Activity-Log + `updated_at` touch — kein neues Ticket
- **Priority Mapping**: `args.priority` OR `args.urgency` (fallback: MEDIUM); URGENT→HIGH
- **Categories**: PLUMBING, HEATING, ELECTRICAL, BUILDING(→STRUCTURAL), WATER_DAMAGE, COMMERCIAL, BILLING, UTILITIES, NOISE_COMPLAINT, OTHER
- **SMS Photo Request**: Twilio-SMS bei PLUMBING, WATER_DAMAGE, HEATING, ELECTRICAL, STRUCTURAL, BILLING

---

## Get-Tickets API (`app/api/vapi/get-tickets/route.ts`)
- **Auth**: `x-vapi-secret` Header
- **Payload**: `{ phone_number: string }`
- **Logik**: Normalisiert auf letzten 10 Ziffern → `ilike('caller_phone', '%${last10}')` + `in('status', ['NEW', 'IN_PROGRESS'])`
- **Response**: `{ tickets: Array<{ id, ticket_code, issue_summary, status, created_at, category, urgency }> }`
- **Vapi Tool-Name**: `get_active_tickets`
- **Aufruf-Zeitpunkt**: Nach Empathie-Reaktion, wenn Signalwort erkannt (ohne Ankündigung)

---

## Add-Ticket-Note API (`app/api/vapi/add-ticket-note/route.ts`)
- **Auth**: `x-vapi-secret` Header
- **Payload**: `{ ticket_id: string, note: string, caller_phone?: string }`
- **Logik**:
  1. Verifiziert Ticket existiert und ist `NEW`/`IN_PROGRESS`
  2. Hängt Notiz an `issue_details` an (mit Timestamp)
  3. `ticket_activities` INSERT mit `activity_type: 'follow_up_call'` → Dashboard-Badge
  4. `updated_at` touch → Ticket erscheint oben in sortierter Liste
- **Response**: `{ success: true, ticket_code: string, message: string }`
- **Vapi Tool-Name**: `add_ticket_note`
- **Fairness**: Ändert Urgency des Tickets NICHT

---

## Check-Ticket API (`app/api/vapi/check-ticket/route.ts`)
- **Auth**: `x-vapi-secret` Header
- **Intent**: Einzelnes Ticket per Code/Adresse verifizieren (Legacy — in v9.1 durch `get_active_tickets` für Folgeanrufe ersetzt)
- **Payload**: `{ caller_phone, ticket_code?, address?, unit? }`
- **Response**: `{ has_existing, verified, match_type, ticket? }`

---

## V9.1 Gesprächsflow — Entscheidungsbaum

```
Anruf
  │
  ▼
Begrüßung (assistant-request → Dynamic First Message)
  │
  ▼
Empathie + Problemaufnahme + Diagnosefrage
  │
  ├─ Signalwort? ("schon angerufen", "Status", "Wann kommt", "immer noch", "nochmal")
  │       │ JA
  │       ▼
  │   "Ich schaue sofort nach." + get_active_tickets(phone) [ohne Ankündigung]
  │       │
  │       ├─ Ticket(s) gefunden?
  │       │       │ JA
  │       │       ▼
  │       │   "Ich sehe Ihr Ticket zum [summary] vom [Datum]."
  │       │   "Neue Info oder anderes Problem?"
  │       │       │
  │       │       ├─ Neue Info  →  add_ticket_note(id, note)  →  ABSCHLUSS (kein Code)
  │       │       │
  │       │       └─ Anderes Problem  →  Schritt 3–5  →  submit_ticket (kein Präfix)
  │       │
  │       └─ Kein Ticket  →  Schritt 3–5  →  submit_ticket ([RÜCKFRAGE]-Präfix)
  │
  └─ Kein Signalwort  →  Schritt 3–5  →  submit_ticket (normaler Flow)
          │
          ▼  (submit_ticket Response)
      isDuplicate=true?  →  "Vorgang bereits erfasst"  →  ABSCHLUSS
      isDuplicate=false  →  Ticketnummer vorlesen  →  end_call_tool
```

---

## V9.1 Prompt-Prinzipien
- **Trigger nach Empathie**: `get_active_tickets` wird nach der ersten empathischen Reaktion aufgerufen — nicht vor dem Gespräch
- **Silent Tool Call**: `get_active_tickets` ohne Ankündigung aufrufen (kein "Ich rufe jetzt ein Tool auf")
- **Named Confrontation**: Anrufer mit konkretem Ticket konfrontieren: "Ich sehe Ihr Ticket zum Rohrbruch..."
- **add_ticket_note = primärer Pfad**: Bestehende Tickets nicht mit submit_ticket duplizieren
- **Server Fallback**: SCHRITT 1.5 in submit_ticket fängt ab, was die KI übersieht
- **Fairness-Regel**: Urgency basiert auf Schaden, nie auf Anrufhäufigkeit
- **[RÜCKFRAGE]-Präfix**: Nur wenn Signalwort vorhanden + kein Ticket gefunden
- **Dashboard-Badge**: `follow_up_count` aus `ticket_activities (activity_type='follow_up_call')` → "X Anrufe" Badge in TicketListItem
- **Tonalität**: Bayerisch-höflich, kein Dialekt, kein Papageien-Effekt, kein Buchstabieren

---

## Aktueller System Prompt
`docs/vapi-system-prompt-v9.1.md` — enthält vollständigen Prompt zum Einfügen in Vapi Dashboard

## Aktuelles Tool-Schema
`docs/vapi-tools-config.json` (version: 9.1) — alle 4 Tools mit Server-URLs
