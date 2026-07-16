# components/landing/ — Landing-Sektionen

[↑ web/](../../CLAUDE.md) · [Design-Tokens](../../design-system/MASTER.md)

Alle gerenderten Landing-Bausteine. Reihenfolge wird in
[`app/page.tsx`](../../app/page.tsx) komponiert.

## Sektions-Reihenfolge (page.tsx)

Dramaturgie: **Pain → fertiger Vorgang → Beispiele → Module → Demo → Pilot**
(Entscheidung: [`docs/content/basemodul-landing-choreography-2026-07-16.md`](../../../docs/content/basemodul-landing-choreography-2026-07-16.md))

`Navbar → HeroSection → RequestArtifactSection (#beispiel) → ProblemSection →
StorySeam → UseCasesSection → ModulesSection → WorkflowSection → StorySeam →
LiveDemoSection → VisualContextSection → IntegrationsSection → StorySeam →
PricingSection → FaqSection → LetsWorkTogether → Footer → FloatingCta`

StorySeam bewusst nur an den drei großen Nähten. `ScrollStorySection` ist nach
[`../../_parked/components/landing/`](../../_parked/CLAUDE.md) geparkt
(Dopplung mit Workflow + RequestArtifact, telefon-only Visual).

## Design-Identität: "Dark Premium" (verbindlich)

> Frühere Richtungen ("Professional Navy" / hell-warme "Werkbank") sind
> **verworfen**. Maßgeblich: [`../../../DESIGN_BRIEF.md`](../../../DESIGN_BRIEF.md)
> + die kanonische Referenz [`../../../index.html`](../../../index.html).
> Die Next-Komponenten sind bereits auf diese Richtung portiert; neue Änderungen
> sollen nur gezielt polieren.

| Rolle | Wert |
|---|---|
| Hintergrund | `#0A0A0A` (alt. `#0D0D0D`) |
| Flächen / Karten | `#141414`, hover/aktiv `#181818` |
| Akzent / CTA | **Grün `#4ADE80` / `text-green-400`** (CTA tiefer `#16A34A`) |
| Text primär | `#FAFAFA` · sekundär `#A1A1AA` · gedämpft `#6B6B72` |
| Linien | `rgba(255,255,255,0.08)` |
| Headings + Body | **Inter** (keine Serif) |

Regeln: kein heller/Raster-Hintergrund, keine Uppercase-Headlines, kein
„API-Tool"-Look, genau eine Akzentfarbe, Glow nur subtil.

## Aktueller Umbau-Fokus

Die Landing ist auf **basemodul.de** gedreht:

- Hauptmarke: basemodul.de
- Trust/Absender: ein Produkt von AGENTEQ
- Positionierung: **Anfrage-/Intake-System für Servicebetriebe** — Telefon,
  WhatsApp, Formulare und Fotos werden zu vollständigen Vorgängen
- Telefon ist der häufigste erste Einstieg (Speerspitze), aber nicht der
  ganze Produktkern — kein „KI-Telefonassistent"-Only-Framing
- **`RequestArtifactSection`** (`#beispiel`) ist der zentrale Proof: der
  vollständige Vorgang direkt nach dem Hero (Logo-/Testimonial-Ersatz)
- SHK/Kälte, Kfz/Gutachter, Entrümpelung/Reinigung sind die Beispielbranchen
- Design nicht überoptimieren; Copy, Struktur und Demo-Logik stabil halten

## Wichtige Eigenheiten

- **`LiveDemoSection`** ist self-contained (Audio/Transkript-Player, **kein
  Backend/Vapi**) und in `page.tsx` als `dynamic` mit **`ssr: false`** geladen —
  daher nicht im Server-HTML, rendert nur clientseitig. Copy sagt ehrlich
  „Beispiel-Vorgang", nie „echter Ablauf"/„Live".
- **`ModulesSection`** zeigt den Baukasten: Telefon als „Häufigster Einstieg",
  die weiteren Module gleichwertig als Wege zum selben Output (Vorgang).
- Hero-CTAs: primär „30-Minuten-Check buchen" → `#cta`, sekundär
  „Beispiel-Vorgang ansehen" → `#beispiel`.
- Ungenutzte Legacy-Komponenten (Vapi-`LiveCallExperience`, `UseCasesSection`
  (alt), `ProductShowcase`, `FinalCtaSection`, `ScrollStorySection`) liegen in
  [`../../_parked/components/landing/`](../../_parked/CLAUDE.md).

## Konvention

Ein Conversion-Ziel: alle primären CTAs führen zu `#cta` (dort Cal-Link).
Vokabular fixiert: **„30-Minuten-Check buchen"** (primär),
**„Beispiel-Vorgang ansehen"** (sekundär). „Demo anfragen" ist raus — die Demo
ist auf der Seite. Kein KI-Buzzword-Framing, kein „klingt wie ein Mensch",
keine erfundenen Trust-Signale; Notfälle werden informiert, nicht entschieden.
