# Claude Code Prompt: basemodul.de Landing Umbau

Du arbeitest im Repo:

`/Users/user/Desktop/Projects/Agenteq-KMU-Assistants`

## Aufgabe

Baue die bestehende Next.js-Landing unter `web/` inhaltlich auf
**basemodul.de** um.

Wichtig: Es geht zuerst um **Content, Struktur und klare Produktlogik**. Kein
großer Design-Overkill. Kein kompletter Rewrite ohne Not.

## Projektkontext lesen

Lies zuerst nur diese Dateien:

1. `CLAUDE.md`
2. `OFFER.md`
3. `PLAN.md`
4. `WIREFRAME.md`
5. `DESIGN_BRIEF.md`
6. `web/CLAUDE.md`
7. `web/components/landing/CLAUDE.md`

Nur wenn nötig danach konkrete Komponenten in `web/components/landing/` lesen.

## North Star

**basemodul.de** ist die sichtbare Produktmarke.

**AGENTEQ** bleibt Dachfirma / Trust-Layer im Hintergrund.

Die Landing soll verkaufen:

> KI-Module für Betriebe, die Anrufe, Termine, WhatsApp-Anfragen, Fotos und
> Notfälle automatisch vorqualifizieren wollen.

## Module

Die Seite soll diese fünf Module erklären:

1. Telefon-Modul
2. Termin-Modul
3. WhatsApp-Modul
4. Foto-/Schaden-Modul
5. Notdienst-Modul

## Wichtig: was raus muss

- Hausverwaltung als Zielbranche oder Modul
- Callfolio-Brandinggefühl
- AGENTEQ als sichtbare Hauptmarke
- generisches "KI-Agentur für KMU"-Framing
- "Anfrage zu Angebot" als Hauptangebot
- große Mission-Control-/Dashboard-Versprechen
- echte Sends, echte Kundendaten, echte Telefonie-Keys

## Was bleiben darf

- Next.js 14 App Router
- Tailwind
- bestehende Demo als funktionale Basis
- geparkter Backend-Unterbau in `web/_parked/`
- Grundstruktur der Landing, sofern sinnvoll

## Gewünschte Seitenstruktur

Orientiere dich an `WIREFRAME.md`.

Die aktive Startseite sollte ungefähr so laufen:

1. Navbar
   - Marke: `basemodul.de`
   - kleiner Trust-Hinweis: `Ein Produkt von AGENTEQ`
   - Links: Module, Demo, Pilot

2. Hero
   - Headline:
     `KI-Module für Betriebe, die keine Anfrage mehr verlieren wollen.`
   - Subline:
     `basemodul.de nimmt Anrufe, Termine, WhatsApp-Nachrichten und Fotos entgegen, fragt fehlende Infos ab und übergibt alles sauber an Ihr Team.`
   - CTAs:
     `Demo anfragen`
     `Module ansehen`
   - Visuell:
     Eingang -> Modul -> Übergabe, nicht Callfolio-Karte 1:1.

3. Problem
   - Fokus auf Alltag:
     Telefon klingelt, WhatsApp-Chaos, Fotos ohne Kontext, Termine gehen unter,
     Notfälle landen zu spät beim richtigen Menschen.

4. Module
   - Ersetze/baue die bisherige Branchenlogik zu einer Modulübersicht um.
   - Fünf Module mit kurzem Nutzen und 3 Fähigkeiten.

5. Beispiel-Flows
   - SHK-Notdienst
   - Kfz / Sachverständige
   - Lokaler Servicebetrieb

6. Live-Demo
   - bestehende Demo funktional halten
   - Copy auf basemodul.de drehen
   - keine Hausverwaltung
   - Szenario: Anruf oder WhatsApp kommt rein -> KI fragt nach -> Ergebnis ans Team.

7. Für wen passt das?
   - Handwerk/SHK
   - Kfz/Werkstätten/Sachverständige
   - Entrümpelung/lokale Servicebetriebe
   - Reinigung/Facility

8. Wie der Pilot läuft
   - 30-Minuten-Check
   - Modul auswählen
   - Pilot bauen
   - zwei Wochen testen
   - ausbauen/anpassen/stoppen

9. Integrationen
   - Telefonie
   - WhatsApp
   - E-Mail
   - Google Calendar
   - Google Sheets
   - CRM/Webhooks/n8n nach Bedarf

10. Pilot-CTA
   - Fokus: erstes Modul testen
   - Kein harter SaaS-Sale

11. Footer
   - basemodul.de
   - `Ein Produkt von AGENTEQ`
   - Rechtslinks erhalten

## Design-Richtung

Nutze `DESIGN_BRIEF.md`.

Kurz:

- nicht wie Callfolio
- weniger tech-y
- praktischer digitaler Werkzeugkasten
- robust, ruhig, modular
- keine Neon-/Gradient-/Glassmorphism-Optik
- keine futuristische KI-Roboter-Sprache
- keine verschachtelten Karten
- max. 8px Card-Radius, sofern Cards genutzt werden
- mobile sauber lesbar

Wenn Design und Inhalt kollidieren: Inhalt gewinnt.

## Technische Regeln

- Bestehende Patterns respektieren.
- Keine neuen Dependencies ohne klare Not.
- Keine Backend-Reaktivierung.
- Keine API-Routes aus `_parked` zurückholen.
- Keine echten externen Sends.
- Keine Secrets.
- TypeScript sauber halten.
- Keine destruktiven Git-Aktionen.

## Erwartete Dateien

Wahrscheinlich betroffen:

- `web/app/page.tsx`
- `web/app/layout.tsx`
- `web/components/landing/Navbar.tsx`
- `web/components/landing/HeroSection.tsx`
- `web/components/landing/BranchenSection.tsx` oder neuer Modul-Section-Name
- `web/components/landing/LiveDemoSection.tsx`
- `web/components/landing/PainSection.tsx`
- `web/components/landing/HowItWorksSection.tsx`
- `web/components/landing/IntegrationsSection.tsx`
- `web/components/landing/PricingSection.tsx`
- `web/components/landing/FaqSection.tsx`
- `web/components/landing/Footer.tsx`

Wenn du `BranchenSection.tsx` semantisch ersetzt, benenne sie lieber sauber um,
z. B. `ModulesSection.tsx`, und passe Imports an.

## Verifikation

Nach Änderungen ausführen:

```bash
cd web
npm run build
```

Wenn ein Dev-Server sinnvoll ist:

```bash
cd web
npm run dev
```

Dann im Browser prüfen:

- Startseite lädt
- Mobile und Desktop grob sauber
- keine Hausverwaltung im aktiven sichtbaren Inhalt
- basemodul.de als Hauptmarke
- AGENTEQ nur als Trust-Layer
- Demo-Sektion nicht kaputt

## Ergebnisbericht

Bitte am Ende kurz berichten:

- welche Dateien geändert wurden
- welche Sektionen neu/umgebaut wurden
- welche Checks gelaufen sind
- was noch offen ist

Keine riesige Zusammenfassung. Klar, knapp, ehrlich.
