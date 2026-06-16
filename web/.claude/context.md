# CALLFOLIO — Claude Code Master Context

> Lese diese Datei zuerst. Sie enthält alles, was eine Session in < 30 Sekunden auf Stand bringt.

---

## Was ist Callfolio?
KI-Telefon-Assistent für deutsche Hausverwaltungen. Mieter rufen an → Vapi-KI nimmt das Anliegen auf → Ticket landet im Dashboard → Hausverwalter beauftragt Handwerker per E-Mail.

**Live:** `callfolio.io` (App) / `callfolio.de` (Landing)
**Stack:** Next.js 14 App Router · TypeScript · Supabase (Postgres + RLS) · Vapi · Twilio · Resend · Tailwind CSS
**Version:** v10.0 (feature/launch-prep Branch)

---

## Kritische Regeln (NIE brechen)

| Regel | Details |
|-------|---------|
| **Kein git push** | Nur auf explizite Anfrage pushen |
| **Admin-Client nur Server-seitig** | `getSupabaseAdmin()` → niemals im Browser |
| **Auth-Guard in API-Routes** | `requireUserWithOrganizationFromRequest()` für alle Dashboard-APIs |
| **Vapi-Endpoints** | Auth via `x-vapi-secret` Header, nicht Supabase |
| **middleware.ts nicht anfassen** | Multi-Domain-Routing ist heilig |
| **Alle UI-Texte auf Deutsch** | Ausnahme: technische Status-Enums (NEW, IN_PROGRESS…) |
| **Typen aus `lib/types.ts`** | Kein `any`, strict TypeScript |

---

## Schnell-Orientierung: Wo ist was?

```
app/api/vapi/          → Vapi-Webhooks & Tools (submit_ticket, get-tickets, add-ticket-note)
app/api/admin/         → Auth-geschützte Dashboard-APIs
app/api/tickets/       → Ticket-CRUD (Auth required)
app/(app)/             → Authenticated Dashboard-Pages
app/(auth)/            → Login / Onboarding
app/page.tsx           → Landing Page (kein Supabase!)
components/dashboard/  → TicketListItem, TicketFilterBar, ContractorSection
components/landing/    → Statische Marketing-Komponenten
lib/types.ts           → ALLE TypeScript-Interfaces
lib/auth-guard.ts      → requireUserWithOrganizationFromRequest()
lib/supabase/admin.ts  → getSupabaseAdmin() (Singleton, Service Role)
middleware.ts          → Domain-Routing .de → .io
docs/vapi-system-prompt-v9.1.md → Aktuellster System Prompt
docs/vapi-tools-config.json     → Alle Vapi Tool-Schemas
database/              → SQL-Migrations (manuell via Supabase Studio)
```

---

## Vapi Flow (v9.1)

```
Anruf → assistant-request → Dynamic First Message
      → Empathie + Problemaufnahme + Diagnosefrage
      → Signalwort erkannt? ("schon angerufen", "Status", "immer noch"...)
          JA → get_active_tickets(phone) [ohne Ankündigung, nach Empathie-Phase]
               Ticket gefunden → add_ticket_note(id, note) → Abschluss (kein neuer Ticket-Code)
               Kein Ticket     → submit_ticket() mit [RÜCKFRAGE]-Präfix in issue_summary
          NEIN → submit_ticket() → Ticket in DB + SMS-Foto-Link
      → isDuplicate=true (Server Safety Net) → Abschluss ohne neues Ticket
      → end_call_tool

**Multi-Ticket (v9.2):** 1 Ticket → namentlich nennen; 2 → beide; 3+ → nach Ticketnummer fragen
**Fall A (Notiz):** "Direkt im bestehenden Vorgang" — kein SMS-Hinweis
**Fall B (Neu):** SMS-Hinweis nur bei PLUMBING/HEATING/ELECTRICAL/BUILDING; unterdrückt bei NOISE_COMPLAINT/BILLING/etc.
```

**Server-Side Safety Net:** `submit_ticket` prüft nochmals auf Duplikate (SCHRITT 1.5 im Webhook).

**Fairness-Regel:** Urgency basiert auf dem Schaden — ein Folgeanruf erhöht sie **nie**.

**[RÜCKFRAGE]-Präfix** in `issue_summary`: nur wenn Signalwort vorhanden + kein Ticket gefunden.

**Aktuelle Konfiguration:** `docs/vapi-system-prompt-v10.0.md` + `docs/vapi-tools-config.json` (v10.0)

---

## Supabase-Clients — welcher wann?

| Situation | Import |
|-----------|--------|
| API Route (schreibt DB) | `import { getSupabaseAdmin } from '@/lib/supabase/admin'` |
| API Route (liest Session) | `import { createClientFromRequest } from '@/lib/supabase/server'` |
| Browser / Client-Component | `import { createClient } from '@/lib/supabase/client'` |
| Server-Component | `import { createClient } from '@/lib/supabase/server'` |

---

## Ticket-Status-Enums

```
Status:   NEW | IN_PROGRESS | RESOLVED | CLOSED
Urgency:  LOW | MEDIUM | HIGH | EMERGENCY
Category: PLUMBING | HEATING | ELECTRICAL | BUILDING | COMMERCIAL | BILLING | UTILITIES | NOISE_COMPLAINT | OTHER
```

---

## Validierung nach Änderungen

```bash
npm run build   # TypeScript-Fehler + Next.js Build
npm run lint    # ESLint
npm run dev     # Lokaler Test auf localhost:3000
```

**Kein automatisches Test-Framework** — Tests in `tests/` sind manuelle Szenarien.

---

## Weiterführende Context-Dateien

| Datei | Für was |
|-------|---------|
| `.claude/architecture.md` | DB-Schema, Datenfluss, Module |
| `.claude/coding-guidelines.md` | Konventionen, Patterns, Anti-Patterns |
| `.claude/important-files.md` | Alle kritischen Dateipfade + ENV-Vars |
| `PROJECT_CONTEXT.md` | Mermaid-Datenfluss, SQL-Schema |
| `AGENTS.md` | Git-Regeln, Supabase-Constraints |
| `components/AGENTS.md` | UI-Semantik, Dashboard-Struktur |
| `lib/AGENTS.md` | Supabase-Client-Architektur |
