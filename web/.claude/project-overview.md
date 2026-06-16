# Project Overview — Callfolio MVP

## Purpose
Callfolio ist ein KI-gestütztes Telefon-Intake-System für deutsche Hausverwaltungen.
Mieter rufen eine Nummer an → ein Vapi-Voice-Agent nimmt das Anliegen auf → ein strukturiertes Ticket erscheint im Dashboard → der Hausverwalter beauftragt direkt einen Handwerker per E-Mail.

**Kernwert:** Kein verpasster Anruf, kein Zettelchaos — jedes Anliegen landet automatisch als priorisiertes Ticket.

---

## Tech Stack

| Layer | Technologie |
|-------|-------------|
| Framework | Next.js 14 (App Router) |
| Sprache | TypeScript 5, strict mode |
| Styling | Tailwind CSS 3 + Lucide Icons |
| Datenbank | Supabase (Postgres + RLS + pg_trgm) |
| Auth | Supabase Auth (Email/Password) |
| Voice KI | Vapi (Voice AI Platform) |
| SMS | Twilio (Foto-Upload-Link per SMS) |
| E-Mail | Resend |
| Animationen | Framer Motion |
| Charts | Recharts |
| Forms | React Hook Form + Zod v4 |
| Deployment | Vercel |

---

## Multi-Domain Setup

| Domain | Zweck | Auth |
|--------|-------|------|
| `callfolio.de` | Landing Page (Marketing, SEO) | Kein Supabase |
| `callfolio.io` | SaaS-App (Dashboard, Tickets) | Supabase Auth |
| `localhost:3000` | Entwicklung (beides) | Supabase Auth |

Die Trennung wird durch `middleware.ts` erzwungen.

---

## Key Directories

```
app/                    Next.js App Router Root
├── (app)/              Authenticated Dashboard-Routes
├── (auth)/             Login / Onboarding
├── api/                Backend API-Routes (Server-side only)
│   ├── vapi/           Vapi-Webhook + Tool-Endpoints
│   ├── admin/          Auth-geschützte Admin-APIs
│   └── tickets/        Ticket-CRUD API
├── page.tsx            Landing Page (.de)
components/
├── dashboard/          Ticket-UI-Komponenten
├── landing/            Marketing-Komponenten (kein Supabase)
├── layout/             App-Shell (Sidebar)
├── tenants/            Mieter-Verwaltung
└── ui/                 Shadcn/Radix Primitives
lib/
├── types.ts            Zentrale TypeScript-Interfaces
├── auth-guard.ts       API-Route-Schutz
├── supabase/           Supabase-Clients (browser/server/admin)
├── fuzzy-match.ts      3-Tier Tenant-Matching
├── twilio.ts           SMS-Foto-Request
└── email-templates.ts  Resend-Templates
database/               SQL-Migrations (manuell ausführen)
docs/                   Vapi-Prompts, Tool-Schemas, API-Referenz
tests/                  Manuelle Test-Szenarien (kein Test-Runner)
```

---

## Aktuelle Version
**v9.0** — Anti-Duplicate & Lookup (feature/launch-prep Branch)
- Proaktiver Folgeanruf-Check via `get_active_tickets` Tool
- `add_ticket_note` für Updates ohne neues Ticket
- Follow-up-Count-Badge im Dashboard
