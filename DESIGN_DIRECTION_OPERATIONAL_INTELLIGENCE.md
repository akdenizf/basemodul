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
- **`RequestArtifactSection`**: kompakter `BaseModulFlow` (unanimiert) über
  der Karte, Tiefenstaffelung wie im Hero, Mono-Zeitstempel bei
  Eingang/Übergabe. Copy, `#beispiel`-Anker und Vorher/Nachher-Zeile
  unverändert.
- **`ProblemSection`**: asymmetrischer Vorher/Nachher-Moment statt
  gleichförmigem 3er-Grid — drei unterschiedlich gestylte, leicht rotierte
  „Fragmente" (verpasster Anruf, WhatsApp-Foto ohne Kontext, unklare
  Dringlichkeit) transformieren sich visuell in ein `BaseModulFlow`-Panel
  („Ein sauberer Vorgang."). Copy unverändert, nur neu komponiert. Einzige
  Sektion, die bewusst vom Karten-Grid-Muster abweichen darf.

## Impeccable-Kritik (2026-08-19)

`$impeccable critique` lief gegen den aktuellen Stand. Ergebnis: Hero/
RequestArtifact/Problem lesen sich nicht als AI-Slop, aber Modules/Workflow/
Pricing/FAQ hatten noch unmigrierte Dark-Premium-Glass-Reste, die dem eigenen
„kein Glow"-Prinzip direkt widersprachen. Automatischer Scan: 1 Fund
(Side-Tab-Border in `VisualContextSection.tsx`). Nielsen-Score vorher: 25/40.

**Gefixt:**
- `AmbientOrbs`/`FlowGrid` aus `WorkflowSection`, `ModulesSection`,
  `PricingSection`, `FaqSection` entfernt (Glow-Reste aus der Dark-Premium-Ära,
  auf hellem Hintergrund unsichtbar/falsch).
- `bg-white/[0.0x]`, `border-white/10`, `backdrop-blur-md`, `border-[#333]` in
  Workflow-Steps, Modul-Kacheln und Pricing-Sekundärbutton auf Papier-Sprache
  (`border-line`/`bg-paper2`/`leafdim`) umgestellt.
- Emoji-Icons in `ModulesSection` durch lucide-Icons ersetzt (konsistent mit
  Hero/RequestArtifact).
- Side-Tab-Border (`border-l-2`) in `VisualContextSection.tsx` auf vollen
  Rand + Tint umgestellt.
- Hero-Flow-Panel von großer dunkler Karte auf schmale Leiste verkleinert —
  Rückrufnotiz ist jetzt der klare, einzige Hauptfokus.

**Zusätzlich gefixt (2026-08-19, zweite Runde):** `VisualContextSection`,
`IntegrationsSection` und `LiveDemoSection` hatten denselben `AmbientOrbs`/
dunklen-Verlauf-Rest wie Workflow/Modules — jetzt überall entfernt,
`AmbientOrbs.tsx` selbst gelöscht (keine Verwender mehr). `LiveDemoSection`
zusätzlich komplett durchgefixt: Szenario-Picker-Pills und das gesamte
Phone-Screen-Innenleben (Anrufer-Karte, Chat-Bubbles, Ergebnis-Karte,
Progress-Bar, Play-Button) liefen noch auf `border-white/10`/`bg-white/[0.0x]`
— jetzt Papier-Sprache. Cyan-Anteil im Ambient-Glow raus (war nie Teil der
Palette). Urgency-Punkte nutzen jetzt echte Tokens statt generischem
Tailwind-Rot/Amber/Blau (`priority`/`leaf`/`appointment`).

## Noch offen (separate Checkpoints, nicht in einem Rutsch)

1. Makro-Navigation für die 15-Sektionen-Seite (P2 aus der Kritik) — kein
   akuter Fix, aber im Hinterkopf behalten.
2. Doku-Font-Widerspruch (P3): sicherstellen, dass alle CLAUDE.md-Dateien
   konsistent „Public Sans" nennen.
3. `/ki-telefonassistent-shk` — separate SHK-Pilot-Seite, teilt keine
   Komponenten, läuft noch auf der alten Optik.
4. Abschließender Konsistenz-Pass über restliche, noch nicht angefasste
   Sektionen (UseCases, StorySeam, LetsWorkTogether, Footer, Navbar).

Jeder Punkt ist ein eigener Review-Checkpoint mit dem Owner, kein Blankoscheck.
