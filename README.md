# AGENTEQ KMU Assistants

AGENTEQ baut kleine, verkaufbare Assistenten fuer KMU, die viele Anfragen, Anrufe, WhatsApps, E-Mails oder Terminabstimmungen manuell sortieren muessen.

Der Fokus ist nicht "KI als Buzzword", sondern ein konkreter operativer Nutzen:

- keine Anfrage verlieren
- Notfaelle und Dringlichkeit erkennen
- fehlende Infos strukturiert abfragen
- Termine, Rueckrufe oder Tickets sauber vorbereiten
- dem Team jeden Tag Arbeit abnehmen

## Arbeitsprinzip

Wir bauen keine riesige Plattform im Blindflug. Wir testen mehrere kleine Service-Angebote parallel, messen Rueckmeldung im Markt und machen dann aus dem staerksten Signal ein eigenes Vertical.

## Erste Zielgruppen

- Handwerker und SHK-Betriebe
- Hausverwaltungen
- Facility und Gebaeudereinigung
- Umzug und Entruempelung
- kleine Dienstleister mit viel Telefon-/WhatsApp-Aufkommen

---

## MVP-Webseite (`web/`)

Die kundenseitige Landing + simulierte Demo liegt in `web/`. Sie ist aus dem
erprobten Callfolio-Template abgeleitet (Next.js 14 App Router, TypeScript,
Tailwind) und auf KMU/Handwerk umgebaut.

### Starten

```bash
cd web
npm install      # einmalig
npm run dev      # http://localhost:3000
```

Weitere Befehle: `npm run build` (Production-Build), `npm start` (Prod-Server),
`npm run lint`.

### Was die Seite zeigt

- **Hero** "Keine Anfrage geht mehr verloren" mit animierter Anfrage-Karte
- **Live-Demo** (`#livedemo`): self-contained, simulierter Anrufverlauf mit
  Transkript-Streaming und Dringlichkeits-/Ticket-Ergebnis. Kein Backend, kein
  Telefonie-Key noetig.
- **Branchen** (`#branchen`): drei Karten — Handwerk/SHK, Hausverwaltung,
  Facility/Gebaeudereinigung
- Pain, So-funktioniert's, Self-Onboarding, Visueller Kontext, ROI,
  Integrationen, Preise, FAQ
- Rechtsseiten (Impressum/Datenschutz/AGB) mit echten AGENTEQ-Stammdaten,
  von Hausverwaltung auf KMU generalisiert. **Vor Live-Gang anwaltlich pruefen.**
- CTA durchgaengig: "Pilotplatz anfragen"

### Lean-MVP: was bewusst geparkt ist

Das Callfolio-Template bringt einen vollen Multi-Tenant-SaaS mit (Dashboard,
Auth, Tickets, Tenants, Vapi/Twilio/Resend/Supabase-Backends). Fuer den
Markt-Test wird nur Landing + Demo betrieben. Der gesamte Backend-Unterbau
liegt unangetastet unter `web/_parked/` und kann beim echten Piloten wieder
verdrahtet werden (eigene, neue Keys noetig — niemals Callfolio-Production-Keys).

Sicherheit beim Uebernehmen des Templates erledigt:

- Callfolio-`.env.local` (Live-Secrets) entfernt -> `web/.env.example` (nur Keys)
- mitkopiertes `.git` (zeigte auf Callfolio-Repo) entfernt
- `node_modules`/`.next`/`.vercel` entfernt, frisch installiert
- Middleware neutralisiert (kein Auth/Supabase-Redirect)
- Hero-"Live-Gespraech" (echtes Vapi) -> scrollt zur simulierten Demo

### Guardrails (aus TECHNICAL_BLUEPRINT.md)

- keine verbindlichen Zusagen ohne menschliche Freigabe
- Notfaelle immer an Menschen eskalieren
- kein medizinischer Entscheidungsassistent
- DSGVO/AVV beachten, Pilot klein halten
- keine echten Sends / Kundendaten im MVP

## Strategie-Dokumente

`PLAN.md` · `OFFER.md` · `GTM.md` · `LEAD_RESEARCH.md` · `TECHNICAL_BLUEPRINT.md`
