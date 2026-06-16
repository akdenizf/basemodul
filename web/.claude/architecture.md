# Architecture — Callfolio MVP

## System-Datenfluss

```
Telefonnetz
    ↓
Vapi AI Agent  ←──── assistant-request ──── Dynamic First Message
    │                (Caller-Lookup via Supabase: Name + Adresse)
    │
    ├── get_active_tickets(phone) ──→ /api/vapi/get-tickets
    │         ↓ Liste offener Tickets
    │
    ├── add_ticket_note(id, note) ──→ /api/vapi/add-ticket-note
    │         ↓ Notiz + Activity-Log
    │
    └── submit_ticket(...) ─────────→ /api/vapi/webhook
              ↓ SCHRITT 1.5: Server-seitiger Dedup-Check
              ↓ INSERT tickets
              ↓ INSERT ticket_activities (created)
              ↓ SMS via Twilio (Foto-Upload-Link)
              ↓
          Supabase: tickets + ticket_activities + ticket_attachments
                    ↓
    Dashboard (TicketDashboard.tsx)
          ↓
    /api/admin/send-email ──→ Resend ──→ Handwerker / Mieter E-Mail
                         └──→ UPDATE ticket status
                         └──→ INSERT ticket_activities (email_sent)
```

---

## Module & Verantwortlichkeiten

### `app/api/vapi/` — Voice-Intake Layer
| Datei | Zweck |
|-------|-------|
| `webhook/route.ts` | Haupt-Handler: `assistant-request` + `submit_ticket` + `end_call` |
| `get-tickets/route.ts` | Lookup offener Tickets per Telefon (Tool: `get_active_tickets`) |
| `add-ticket-note/route.ts` | Notiz an bestehendes Ticket hängen (Tool: `add_ticket_note`) |
| `check-ticket/route.ts` | Einzelnes Ticket per Code/Adresse verifizieren |

**Auth:** `x-vapi-secret` Header (kein Supabase-Auth)

### `app/api/admin/` — Dashboard-Backend (Auth required)
| Datei | Zweck |
|-------|-------|
| `tickets/route.ts` | Ticket-Liste mit Pagination, Filtern, Follow-up-Counts |
| `tickets/[id]/activities/route.ts` | Activity-Timeline eines Tickets |
| `tickets/[id]/status/route.ts` | Status-Update (PATCH) |
| `tickets/[id]/attachments/route.ts` | Foto-Anhänge lesen |
| `send-email/route.ts` | E-Mail an Mieter/Handwerker + Activity-Log |
| `tenants/search/route.ts` | Mieter-Suche für manuelles Matching |

**Auth:** `requireUserWithOrganizationFromRequest()` (Supabase Bearer Token)

### `app/(app)/` — Dashboard-UI (alle AuthGuard-geschützt)
- `tickets/page.tsx` → Ticket-Dashboard (Haupt-View)
- `tenants/page.tsx` → Mieter-Verwaltung
- `settings/page.tsx` → Org-Einstellungen + Vapi-Config
- `history/page.tsx` → Archiv abgeschlossener Tickets
- `import/page.tsx` → CSV-Mieter-Import (Papa Parse)

### `lib/` — Shared Business Logic
| Datei | Zweck |
|-------|-------|
| `types.ts` | Alle TypeScript-Interfaces (Ticket, Tenant, etc.) |
| `auth-guard.ts` | `requireUserWithOrganizationFromRequest()` |
| `supabase/admin.ts` | Singleton Service-Role-Client |
| `supabase/client.ts` | Browser-Singleton |
| `supabase/server.ts` | SSR-Client für Server-Components |
| `fuzzy-match.ts` | 3-Tier-Matching: Phone(1.0) → Fuzzy(≥0.7) → Review(≥0.4) |
| `twilio.ts` | `sendPhotoRequestSMS()` + `isTwilioConfigured()` |
| `email-templates.ts` | Resend-HTML-Templates mit `{{variable}}`-Syntax |
| `audit-log.ts` | `logSystemError()` für ticket_activities |
| `translations.ts` | DE-Übersetzungen für Enums (Urgency, Status, etc.) |

---

## Datenbankschema (Kern-Tabellen)

```sql
organizations
  id, name, slug, vapi_phone_id, notification_email,
  logo_url, is_active, created_at

profiles
  id, user_id → auth.users, organization_id → organizations

tenants
  id, organization_id, name, address, unit,
  phone (E.164), email, notes

tickets
  id, organization_id, call_id (UNIQUE), ticket_code (generiert),
  status (NEW|IN_PROGRESS|RESOLVED|CLOSED),
  urgency (LOW|MEDIUM|HIGH|EMERGENCY),
  category, sentiment,
  caller_name, caller_phone, address, unit,
  issue_summary, issue_details,
  matched_tenant_id → tenants, contractor_id → contractors,
  match_type, match_confidence (0.00-1.00),
  requires_manual_review, is_archived,
  raw_caller_name, raw_caller_address,
  created_at, updated_at

ticket_activities
  id, ticket_id → tickets,
  activity_type (created|follow_up_call|photo_requested|email_sent|status_changed|system_error),
  description, metadata (JSONB), admin_email, created_at

ticket_attachments
  id, ticket_id → tickets, storage_path, created_at

contractors
  id, organization_id, name, email, phone, trade

communication_templates
  id, organization_id, slug, label, subject, content ({{variable}} Syntax)
```

---

## Multi-Tenancy
- Jede `Organization` = eine Hausverwaltung (Callfolio-Kunde)
- **Alle** DB-Abfragen sind nach `organization_id` gefiltert
- Supabase RLS erzwingt Row-Level-Security für Browser-Queries
- `vapi_phone_id` verknüpft Vapi-Rufnummer mit Organisation → Dynamic First Message

---

## Tenant-Matching (3-Tier)
```
1. Phone Exact    confidence=1.0  → letzten 10 Ziffern matchen (ilike)
2. Fuzzy Text     confidence≥0.7  → Postgres RPC match_tenant (pg_trgm)
3. Manual Review  confidence≥0.4  → Dashboard-Badge: Review
4. UNKNOWN        confidence<0.4  → Manuell zuordnen
```
Implementierung: `lib/fuzzy-match.ts` + Postgres RPC `match_tenant`

---

## Anti-Duplicate-Logic (v9.1)

```
KI-Seite (proaktiv — nach Empathie-Phase):
  Signalwort erkannt → get_active_tickets(phone) [ohne Ankündigung]
    → Ticket(s) gefunden:
        "Ich sehe Ihr Ticket zum [summary] vom [Datum]."
        Neue Info?   → add_ticket_note(id, note) → Abschluss (KEIN submit_ticket!)
        And. Problem → submit_ticket() (kein Präfix)
    → Kein Ticket:
        → submit_ticket() MIT [RÜCKFRAGE]-Präfix in issue_summary
  Kein Signalwort → submit_ticket() (normaler Flow)

Fairness-Regel:
  Urgency basiert AUSSCHLIESSLICH auf Schaden, nie auf Anrufhäufigkeit.

Server-Seite (Safety Net in submit_ticket, SCHRITT 1.5):
  phone normalisieren (letzten 10 Ziffern)
  ilike('caller_phone', '%${last10}') + in('status', ['NEW', 'IN_PROGRESS'])
  → Bei Treffer: Activity-Log + updated_at touch + isDuplicate=true Response
  → Bei Kein Treffer: INSERT neues Ticket
```

---

## Middleware-Routing

```
callfolio.de + /dashboard|/tickets|etc → 301 redirect → callfolio.io
callfolio.de root                       → Landing Page (app/page.tsx, kein Supabase)
callfolio.io /                          → redirect → /dashboard
callfolio.io + any path                 → Supabase session refresh (getUser())
localhost                               → wie callfolio.io (Dev-Modus)
```

---

## Wichtige Integrationspunkte

| Integration | Config | Verwendet in |
|-------------|--------|--------------|
| Vapi | `vapi_phone_id` in organizations | `webhook/route.ts`, Dynamic First Message |
| Twilio | `TWILIO_*` ENV-Vars | `lib/twilio.ts` → `sendPhotoRequestSMS()` |
| Resend | `RESEND_API_KEY` ENV-Var | `app/api/admin/send-email/route.ts` |
| Supabase Storage | Bucket: `ticket-evidence` | `app/api/upload/route.ts` |
