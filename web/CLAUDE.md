# web/ — basemodul.de Landing + Demo

[↑ Root-Karte](../CLAUDE.md) · Geschwister: [landing](components/landing/CLAUDE.md) · [_parked](_parked/CLAUDE.md) · [app](app/CLAUDE.md)

Kundenseitige **Landing + simulierte Demo**. Abgeleitet aus dem Callfolio-Template
(Next.js 14 App Router · TypeScript · Tailwind). Aktueller Umbau-Fokus:
**basemodul.de** als Produktseite für KI-Module. AGENTEQ bleibt Dachfirma /
Trust-Layer, aber nicht die sichtbare Hauptmarke der Landing.

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

## Aktuelle Produktlogik

Kernmodule:

- Telefon-Modul
- Chat-Modul
- Termin-Modul
- Foto-&-Datei-Modul
- Prioritäts-Modul

Nicht als Hauptspur verwenden: Hausverwaltung/SHK-Schadenfälle, generische
KI-Beratung, vollautomatische Angebotserstellung als Kernangebot.

## Design-Identität: "Dark Premium" (verbindlich)

Dunkel/premium (Linear/Vercel/Stripe): BG `#0A0A0A` · Flächen `#141414` ·
Akzent **Grün `#22C55E`** · Text `#FAFAFA`/`#A1A1AA` · Font **Inter**.
**Verbindliche Quelle:** [`../DESIGN_BRIEF.md`](../DESIGN_BRIEF.md) + die
kanonische Referenz [`../index.html`](../index.html) (Repo-Root, standalone).
Frühere Richtungen (Navy/hell-warm) und `design-system/MASTER.md` sind
**verworfen**. Diese Landing wird später an `index.html` angeglichen.

## Schlüssel-Dateien

- `app/layout.tsx` — Fonts + Metadaten
- `app/page.tsx` — Sektions-Reihenfolge der Landing
- `tailwind.config.ts` — `font-display`=Calistoga, `font-sans`=Inter
- `middleware.ts` — Pass-through (neutralisiert)

*Veraltete Callfolio-Doku (`GEMINI.md`, `lib/AGENTS.md`, `database/AGENTS.md`)
beschreibt den geparkten Backend-Code — nicht für den MVP relevant.*
