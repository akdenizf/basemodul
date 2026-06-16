# Hermes — Outreach Specialist (Setup-Anleitung)

Dieses Verzeichnis enthält alles, was du brauchst, um das Hermes-Projekt in Claude Code zu starten.

## Projektstruktur (neues Repo)

```
hermes/
├── CLAUDE.md              ← diese Datei ins Projekt-Root kopieren
├── knowledge-base/        ← diesen Ordner 1:1 ins Projekt kopieren
│   ├── callfolio_factsheet.txt
│   ├── pricing_table.txt
│   ├── email_templates.txt
│   ├── faq_objections.txt
│   ├── competitor_intel.txt
│   └── industry_context.txt
└── README.md              ← nur für Setup-Anleitung, kann danach gelöscht werden
```

## Schritt-für-Schritt Setup

### 1. Neues Projekt anlegen (NICHT Callfolio clonen)

```bash
npx create-next-app@14 hermes --typescript --tailwind --app --src-dir=false
cd hermes
```

### 2. Dependencies installieren

```bash
npm install @supabase/supabase-js apify-client @anthropic-ai/sdk resend
npx shadcn@latest init
npx shadcn@latest add button input select badge card table dialog
```

### 3. CLAUDE.md + knowledge-base/ kopieren

Kopiere `CLAUDE.md` aus diesem Blueprint-Ordner ins Hermes-Root.
Kopiere den `knowledge-base/` Ordner ins Hermes-Root.

### 4. .env.local anlegen

```bash
cp .env.example .env.local
# Dann ausfüllen:
# - Supabase: SEPARATES Projekt (nicht Callfolio)
# - Apify API Token
# - Anthropic API Key
# - Resend API Key
```

### 5. Datenbank-Migration ausführen

Im Supabase SQL Editor ausführen:

```sql
CREATE TYPE lead_status AS ENUM ('DRAFT', 'APPROVED', 'SENT', 'REPLIED', 'FAILED');

CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL UNIQUE,
  search_query TEXT NOT NULL,
  min_rating NUMERIC(2,1) DEFAULT 3.5,
  system_prompt TEXT NOT NULL,
  product_factsheet TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS outreach_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  website TEXT,
  email TEXT,
  google_rating NUMERIC(2,1),
  review_count INT DEFAULT 0,
  extracted_pain_point TEXT,
  generated_subject TEXT,
  generated_body TEXT,
  status lead_status DEFAULT 'DRAFT'
);
```

### 6. Erstes Prompt für Claude Code

Wenn du das neue Projekt in Claude Code öffnest, starte mit:

> "Lies CLAUDE.md und erstelle die grundlegende App-Struktur: Supabase-Client, Auth-Guard, Sidebar-Layout und die Campaigns-Übersichtsseite. Die Datenbank-Tabellen sind bereits angelegt."

---

## Warum kein Callfolio-Clone?

Callfolio ist tief mit Vapi, Twilio und Tenant-Logik verwoben. Hermes braucht
stattdessen Apify, Anthropic und Resend. Refactoring würde mehr Zeit kosten
als ein Greenfield-Start — nur das UI-Layout (Sidebar + dreigeteiltes Dashboard)
ist wiederverwendbar und kann als einzelne Komponente kopiert werden.
