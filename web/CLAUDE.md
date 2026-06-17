# web/ — AGENTEQ Landing + Demo

[↑ Root-Karte](../CLAUDE.md) · Geschwister: [landing](components/landing/CLAUDE.md) · [_parked](_parked/CLAUDE.md) · [app](app/CLAUDE.md)

Kundenseitige **Landing + simulierte Demo**. Abgeleitet aus dem Callfolio-Template
(Next.js 14 App Router · TypeScript · Tailwind), auf KMU/Handwerk umgebaut.

## Start

```bash
npm install        # einmalig
npm run dev        # http://localhost:3000
npm run build      # Prod-Build (Typecheck inkl.)
```

## Lean-MVP-Prinzip (wichtig)

Nur **Landing + Demo** sind aktiv. Der gesamte SaaS-Unterbau (Dashboard, Auth,
Tickets, Vapi/Twilio/Resend/Supabase) ist nach **`_parked/`** verschoben und
vom Typecheck ausgeschlossen (`tsconfig.json` → `exclude: ["_parked"]`).
→ Details & Reaktivierung: [`_parked/CLAUDE.md`](_parked/CLAUDE.md)

## Sicherheit (beim Template-Übernehmen erledigt)

- Callfolio `.env.local` (Live-Secrets) entfernt → `.env.example` (nur Keys).
- Mitkopiertes `.git` (zeigte auf Callfolio-Repo) entfernt.
- Middleware neutralisiert (kein Auth/Supabase-Redirect): `middleware.ts`.
- **Nie** Callfolio-Production-Keys verwenden; für echten Piloten eigene Keys.

## Design-Identität: "Professional Navy"

Akzent/CTA `#0369A1` (Blau) · Text `#0F172A` (Navy) · BG `#F8FAFC` ·
Headings **Calistoga** (Serif) · Body **Inter** · Mono JetBrains.
Tokens & Regeln: [`design-system/MASTER.md`](design-system/MASTER.md).
Umsetzung pro Sektion: [`components/landing/CLAUDE.md`](components/landing/CLAUDE.md).

## Schlüssel-Dateien

- `app/layout.tsx` — Fonts + Metadaten
- `app/page.tsx` — Sektions-Reihenfolge der Landing
- `tailwind.config.ts` — `font-display`=Calistoga, `font-sans`=Inter
- `middleware.ts` — Pass-through (neutralisiert)

*Veraltete Callfolio-Doku (`GEMINI.md`, `lib/AGENTS.md`, `database/AGENTS.md`)
beschreibt den geparkten Backend-Code — nicht für den MVP relevant.*
