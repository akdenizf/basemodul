# Hermes — Claude Code Guidelines

Du bist ein Senior Full-Stack Engineer und baust **Hermes**, eine autonome Outbound-Outreach-Engine für Callfolio.
Stack: Next.js 14 App Router · TypeScript · Tailwind CSS · Shadcn/UI · Supabase · Apify · Anthropic SDK · Resend

**PROJEKT-ZIEL:** Systematische Lead-Generierung bei deutschen Hausverwaltungen — von Google Maps Scraping über KI-Personalisierung bis zum automatisierten E-Mail-Versand.

---

## I. Think Before Coding

- **Annahmen explizit nennen** — Wenn etwas unklar ist, fragen statt raten
- **Stoppen wenn verwirrt** — Das Unklare benennen und nachfragen
- **Erfolgskriterien vorab definieren** — "Das ist erledigt wenn: [konkrete Bedingung]"

## II. Simplicity First

Minimum Code, der das Problem löst. Nichts Spekulatives. Keine Features die nicht angefragt wurden.

## III. Surgical Changes

Nur ändern, was angefragt wurde. Keinen benachbarten Code "verbessern". Vorhandenen Stil beibehalten.

---

## Hermes-spezifische Regeln

### Datenmodell (Supabase — separates Projekt)

```sql
-- Kampagnen-Konfiguration
CREATE TABLE campaigns (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  name            TEXT NOT NULL UNIQUE,
  search_query    TEXT NOT NULL,          -- z.B. "Hausverwaltung München"
  min_rating      NUMERIC(2,1) DEFAULT 3.5,
  system_prompt   TEXT NOT NULL,          -- KI-Persona pro Kampagne
  product_factsheet TEXT NOT NULL         -- Produkt-Kontext für die KI
);

-- Lead-Datenbank
CREATE TABLE outreach_leads (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  campaign_id         UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  company_name        TEXT NOT NULL,
  website             TEXT,
  email               TEXT,
  google_rating       NUMERIC(2,1),
  review_count        INT DEFAULT 0,
  extracted_pain_point TEXT,              -- Von Claude analysierter Schmerzpunkt
  generated_subject   TEXT,              -- KI-generierte Betreffzeile
  generated_body      TEXT,              -- KI-generierte E-Mail
  status              lead_status DEFAULT 'DRAFT'
);

-- Status-Flow: DRAFT → APPROVED → SENT → REPLIED | FAILED
CREATE TYPE lead_status AS ENUM ('DRAFT', 'APPROVED', 'SENT', 'REPLIED', 'FAILED');
```

### API-Konventionen

**Apify (Google Maps Scraper):**
```typescript
// Immer über lib/apify.ts — nie inline implementieren
import { scrapeGoogleMaps } from '@/lib/apify'
// Actor: compass/google-maps-scraper
// Output: { title, rating, reviewsCount, website, categories }[]
```

**Anthropic (Lead-Personalisierung):**
```typescript
// Immer über lib/anthropic.ts — nie inline implementieren
import { generateOutreachEmail } from '@/lib/anthropic'
// Model: claude-opus-4-7 für Personalisierung, claude-haiku-4-5 für Klassifizierung
// KEIN Streaming für Batch-Verarbeitung
```

**Resend (E-Mail-Versand):**
```typescript
// Immer über lib/resend.ts — nie inline implementieren
import { sendOutreachEmail } from '@/lib/resend'
// From: "Fatih Akdeniz <fatih@callfolio.io>"
// Reply-To: fatih@callfolio.io
```

**Supabase:**
```typescript
// Admin-Queries: getSupabaseAdmin() aus lib/supabase/admin.ts
// Client-Queries: createClient() aus lib/supabase/client.ts
// Kein contractor_id, keine ticket-spezifischen Spalten
```

### Status-Maschine (kritisch)

```
DRAFT     — Lead gescrapt, noch nicht KI-bearbeitet
APPROVED  — E-Mail von Claude generiert, warte auf manuellen Review
SENT      — E-Mail verschickt (Resend Message-ID in metadata gespeichert)
REPLIED   — Lead hat geantwortet (manuell gesetzt oder Webhook)
FAILED    — Scraping/Generierung/Versand fehlgeschlagen (Error in metadata)
```

**Regel:** Niemals direkt von DRAFT zu SENT springen — APPROVED-Review ist Pflicht.

### Datei-Struktur

```
app/
├── (app)/                    # Authenticated Dashboard
│   ├── layout.tsx            # Sidebar + Auth Guard
│   ├── campaigns/            # Kampagnen-Übersicht + Erstellen
│   ├── leads/                # Lead-Liste (dreigeteiltes Dashboard)
│   │   ├── page.tsx          # Server Component: Lead-Liste laden
│   │   └── LeadListClient.tsx # Client: Filter, Expand, Actions
│   └── settings/             # API-Keys, Sender-Konfiguration
├── api/
│   ├── campaigns/
│   │   ├── create/route.ts   # POST: Neue Kampagne anlegen
│   │   └── [id]/route.ts     # GET/PATCH/DELETE
│   ├── leads/
│   │   ├── scrape/route.ts   # POST: Apify-Job starten
│   │   ├── generate/route.ts # POST: Claude-Personalisierung
│   │   ├── approve/route.ts  # PATCH: Status DRAFT→APPROVED
│   │   └── send/route.ts     # POST: Resend-Versand, Status→SENT
│   └── webhooks/
│       └── resend/route.ts   # Resend-Events (delivered, opened, clicked)
lib/
├── apify.ts                  # Google Maps Scraper-Wrapper
├── anthropic.ts              # Claude Personalisierungs-Wrapper
├── resend.ts                 # E-Mail-Versand-Wrapper
├── supabase/
│   ├── admin.ts              # Service Role Client
│   └── client.ts            # Anon Client (Browser)
├── types.ts                  # Campaign, OutreachLead, LeadStatus
└── auth-guard.ts             # requireUser() für Dashboard-Routes
knowledge-base/               # Agent-Wissens-Dateien (plain text)
├── callfolio_factsheet.txt
├── pricing_table.txt
├── email_templates.txt
├── faq_objections.txt
├── competitor_intel.txt
└── industry_context.txt
```

### Code-Konventionen

- Kein `any` in TypeScript ohne Kommentar der das Warum erklärt
- Kein `console.log` in Production-Pfaden — `console.error` für Fehler
- UI: Tailwind `dark:` Klassen, keine inline styles
- Batch-Jobs (Scraping, Generierung): Immer mit Rate-Limiting + Error-Handling
- Lead-Generierung: Max. 5 concurrent Anthropic-Calls (parallel, nicht sequentiell)

### Auth & Routes

- Dashboard-Routes: `requireUser()` aus `lib/auth-guard.ts`
- API-Routes: Bearer Token oder Session Cookie
- Webhooks (Resend): `x-resend-signature` Header validieren

### Umgebungsvariablen (.env.local)

```bash
# Supabase (SEPARATES Projekt — nicht Callfolio!)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Apify
APIFY_API_TOKEN=

# Anthropic
ANTHROPIC_API_KEY=

# Resend
RESEND_API_KEY=
RESEND_FROM=fatih@callfolio.io

# App
NEXT_PUBLIC_APP_URL=https://hermes.callfolio.io
```

---

## Skill-Router

| Domain | Aktion |
|---|---|
| UI / Shadcn | Shadcn-Komponenten via `npx shadcn@latest add <component>` |
| Apify | Apify Console → Actor Logs für Debugging |
| Anthropic | Prompt-Engineering in `lib/anthropic.ts` zentralisieren |
| Supabase | Migrations in `database/` — bestehende SQL nie editieren |

---

## Wichtigste Architektur-Invarianten

1. **APPROVED-Gate ist Pflicht** — Kein automatischer Versand ohne manuellen Review
2. **Rate Limiting bei Apify** — Max. 100 Leads pro Scraping-Job (Kosten-Kontrolle)
3. **Knowledge-Base als Kontext** — Jeder Claude-Call bekommt `callfolio_factsheet.txt` + `email_templates.txt` als System-Prompt-Kontext
4. **Resend Message-ID speichern** — In `outreach_leads.metadata` für Bounce-Tracking
5. **Campaign isolation** — Leads gehören immer zu einer Campaign; kein Campaign-übergreifendes Matching
