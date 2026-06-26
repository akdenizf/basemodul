# basemodul.de

Produktseite für modulare KI-Assistenten von AGENTEQ.

**AGENTEQ** bleibt die Dachfirma / Enterprise-Marke. **basemodul.de** ist die
konkrete Produktmarke für kleine und mittlere Betriebe, die Kundenanfragen
besser annehmen, vorsortieren und übergeben wollen.

## Positionierung

basemodul.de baut KI-Module für Betriebe, die Anrufe, Termine, WhatsApp-
Anfragen, Fotos und Notfälle automatisch vorqualifizieren wollen.

Der Fokus ist nicht "KI als Buzzword", sondern ein konkreter operativer Nutzen:

- keine Anrufe verlieren
- Termine schneller vorbereiten oder buchen
- WhatsApp-Anfragen strukturiert einsammeln
- Fotos und Schäden sauber erfassen
- Notfälle erkennen und an Menschen eskalieren
- Teams jeden Tag weniger Telefon- und Anfragechaos geben

## Module

1. **Telefon-Modul** - Anrufe annehmen, Anliegen erfassen, Rückruf/Ticket
   vorbereiten.
2. **Chat-Modul** - Infos per Chat sammeln, Rückfragen stellen, Übergabe
   ans Team.
3. **Termin-Modul** - Kalender prüfen, Termine vorbereiten, Bestätigungen
   senden.
4. **Foto-&-Datei-Modul** - Fotos oder Anhänge entgegennehmen, Kontext sammeln,
   strukturierte Übergaben erzeugen.
5. **Prioritäts-Modul** - Dringlichkeit erkennen, Pflichtinfos abfragen,
   zuständige Person informieren.

## Arbeitsprinzip

Wir bauen keine riesige Plattform im Blindflug. Wir testen mehrere kleine
Module, messen Rückmeldung im Markt und machen dann aus dem stärksten Signal
ein fokussiertes Angebot.

Bewusst nicht im ersten Fokus:

- keine große Mission-Control-Plattform
- keine vollautomatische Angebotserstellung als Kernangebot
- keine Hausverwaltung/SHK-Schadenfall-Spur als Hauptpositionierung
- keine sensiblen Spezialbereiche zuerst, wenn DSGVO/Regulierung zu schwer wird

## MVP-Webseite (`web/`)

Die kundenseitige Landing + simulierte Demo liegt in `web/`. Sie ist aus dem
erprobten Callfolio-Template abgeleitet (Next.js 14 App Router, TypeScript,
Tailwind). Der Backend-/SaaS-Unterbau ist aktuell geparkt.

### Starten

```bash
cd web
npm install      # einmalig
npm run dev      # http://localhost:3000
```

Weitere Befehle: `npm run build` (Production-Build), `npm start` (Prod-Server),
`npm run lint`.

### Aktueller Umbau-Fokus

Die bestehende Landing soll von "AGENTEQ KMU Assistants" auf **basemodul.de**
umgebaut werden:

- Branding: basemodul.de als Hauptmarke
- Footer/Trust: "Ein Produkt von AGENTEQ"
- Module statt Branchen als Kernlogik
- Hausverwaltung raus
- Design später finalisieren, zuerst Angebot/Copy/Funktion sauber schneiden

### Lean-MVP: was bewusst geparkt ist

Das Callfolio-Template bringt einen vollen Multi-Tenant-SaaS mit (Dashboard,
Auth, Tickets, Tenants, Vapi/Twilio/Resend/Supabase-Backends). Für den
Markt-Test wird nur Landing + Demo betrieben. Der gesamte Backend-Unterbau
liegt unangetastet unter `web/_parked/` und kann beim echten Piloten wieder
verdrahtet werden (eigene, neue Keys nötig - niemals Callfolio-Production-Keys).

Sicherheit beim Übernehmen des Templates erledigt:

- Callfolio-`.env.local` (Live-Secrets) entfernt -> `web/.env.example` (nur Keys)
- mitkopiertes `.git` (zeigte auf Callfolio-Repo) entfernt
- `node_modules`/`.next`/`.vercel` entfernt, frisch installiert
- Middleware neutralisiert (kein Auth/Supabase-Redirect)
- Hero-"Live-Gespräch" (echtes Vapi) -> scrollt zur simulierten Demo

### Guardrails

- keine verbindlichen Zusagen ohne menschliche Freigabe
- Notfälle immer an Menschen eskalieren
- kein medizinischer Entscheidungsassistent
- DSGVO/AVV beachten, Pilot klein halten
- keine echten Sends / Kundendaten im MVP

## Strategie-Dokumente

`PLAN.md` · `OFFER.md` · `WIREFRAME.md` · `DESIGN_BRIEF.md` · `GTM.md` ·
`LEAD_RESEARCH.md` · `TECHNICAL_BLUEPRINT.md`

## Agenten-Prompts

`prompts/basemodul-landing-implementation.md` enthält den Claude-Code-Prompt für
den ersten Landingpage-Umbau auf basemodul.de.
