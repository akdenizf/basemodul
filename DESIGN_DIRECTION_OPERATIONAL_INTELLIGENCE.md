# basemodul.de — Operational Intelligence (v4-Erweiterung)

> Erweitert [`DESIGN_DIRECTION_HANDWERKSNAH.md`](DESIGN_DIRECTION_HANDWERKSNAH.md),
> ersetzt sie nicht. Helles, warmes Waldgrün-System bleibt die Basis — diese
> Datei fügt mehr visuellen Kontrast, ein wiederkehrendes Signature-Motiv und
> eine "Betriebssystem"-Craft-Ebene hinzu, ohne Struktur, Copy oder
> CTA-Vokabular zu ändern.

## Leitprinzip

**„Meisterbetrieb-Leitstand", nicht „SaaS-Dashboard".** Die Copy bleibt
menschlich (Rückrufnotiz, Übergabe, Bereitschaft) — nur die *Rendering*-Ebene
wird selbstbewusster: Mono-IDs als Werkzettel-Stempel-Detail, Status-Chips als
Marker auf dem Klemmbrett des Disponenten, Tiefe als physisches
Papier-Stapeln. **Test an jedem Checkpoint:** Wirkt das noch wie eine Notiz
auf dem Klemmbrett — oder schon wie ein App-Screen? Bei Zweifel zurückrudern.

## Neue Tokens (`web/tailwind.config.ts`)

Additiv zur bestehenden `leaf*`-Familie, die unangetastet bleibt.

| Token | Wert | Verwendung |
|---|---|---|
| `forestdeep` | `#16382B` | Dunkle Kontrast-Momente (Hero-Szene-Panel, Hub-Badge) |
| `inkdeep` | `#16231C` | Nahezu-Schwarz für maximale Kontrastflächen |
| `signal` / `signaldim` | `#4CA66B` / `#DCEEDF` | Helleres Grün ausschließlich für Betonungsmomente (Flow-Connector, „live"-Indikatoren) — **kein** Ersatz für `leafbtn` auf Buttons |
| `appointment` / `appointmentdim` | `#3E6E8C` / `#E8EFF3` | Zurückhaltender kühler Akzent, ausschließlich Termin-Kontext |

## Das Signature-Motiv — `BaseModulFlow`

`web/components/landing/BaseModulFlow.tsx`. Eingang (Telefon/WhatsApp/Foto) →
animierte SVG-Connectors → „BaseModul"-Hub (`forestdeep`) → Checklist
(Kontakt/Standort/Anliegen/Priorität) → Team-Output. Props: `size`
(`full`/`compact`), `orientation`, `animated`, `activeStep` (reserviert für
späteres Hover-Snap-in in der Module-Sektion).

Soll wiederkehrend auftauchen: Hero (umgesetzt), später Module-Sektion, Demo,
Pricing — macht die Wiedererkennung erst zum Brand-Element.

## Craft-Regeln

- **Mono-Typografie** (`font-mono`, JetBrains Mono — Token existierte, war
  ungenutzt) für IDs und Zeitstempel (`#BM-2417`, `22:49`) — als Werkzettel-
  Detail, nicht als Tabellen-Spalte.
- **Tiefenstaffelung** statt flacher Karten: eine zweite, leicht versetzte
  Kartenkante hinter der Hauptkarte (siehe Hero) simuliert physisches
  Papier-Stapeln.
- **Status-Chips** (dringend/orange, bereit/grün) bleiben Marker-Sprache,
  keine Tabellen-Badges.
- Bestehende `.work-paper`-Klasse (`globals.css`) bleibt der Anker — Papier-
  Textur und leichte Rotation erhalten, nicht durch Glas/Schatten-Spielereien
  ersetzen.

## Umgesetzt

- **Hero** (`HeroSection.tsx`): Operations-Szene (`BaseModulFlow`, animiert,
  auf `inkdeep`-Panel) ersetzt die einzelne statische Karte; Rückrufnotiz
  bleibt darunter, jetzt tiefengestaffelt mit Mono-ID/Zeitstempel.

## Noch offen (separate Checkpoints, nicht in einem Rutsch)

1. `RequestArtifactSection` — Mono-Zeitstempel in Feldwerten, Tiefenstaffelung,
   optional kompakter `BaseModulFlow`.
2. `ProblemSection` — ein editorialer Vorher/Nachher-Moment statt Karten-Grid.
3. `ModulesSection` — `BaseModulFlow` mit Hover-Snap-in; **Achtung:** enthält
   noch unmigrierte Dark-Premium-Klassen (`bg-white/[0.0x]`, `border-white/10`,
   `backdrop-blur-md`), die auf dem hellen `bg-paper`-Hintergrund kaum
   sichtbar sind — beim Umbau mitfixen.
4. `LiveDemoSection` — als Hero-Level-Moment mit `forestdeep`/`inkdeep`
   ausbauen; gleiches Dark-Premium-Leftover-Problem wie oben, außerhalb des
   Phone-Mockups.
5. Abschließender Konsistenz-Pass über restliche Sektionen.

Jeder Punkt ist ein eigener Review-Checkpoint mit dem Owner, kein Blankoscheck.
