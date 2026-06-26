# components/landing/ — Landing-Sektionen

[↑ web/](../../CLAUDE.md) · [Design-Tokens](../../design-system/MASTER.md)

Alle gerenderten Landing-Bausteine. Reihenfolge wird in
[`app/page.tsx`](../../app/page.tsx) komponiert.

## Sektions-Reihenfolge (page.tsx)

`Navbar → HeroSection → TrustSection → PainSection → ModulesSection →
HowItWorksSection → LiveDemoSection → SelfOnboardingSection → VisualContextSection →
RoiSection → IntegrationsSection → PricingSection → LetsWorkTogether →
FaqSection → Footer → FloatingCta`

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
- Positionierung: **KI-Telefonassistent für Servicebetriebe**
- Voice/Telefon ist die Speerspitze
- Module sind Erweiterungen rund um die Telefonannahme: Notdienst, Termin,
  WhatsApp, Foto/Schaden, Integrationen
- SHK/Kältetechnik/Facility sind bewusst naheliegende Beispielbranchen
- Design nicht überoptimieren; Copy, Struktur und Demo-Logik stabil halten

## Wichtige Eigenheiten

- **`LiveDemoSection`** ist self-contained (Audio/Transkript-Player, **kein
  Backend/Vapi**) und in `page.tsx` als `dynamic` mit **`ssr: false`** geladen —
  daher nicht im Server-HTML, rendert nur clientseitig.
- **`ModulesSection`** erklärt die Erweiterungen nach der Telefonannahme.
  Beispiele sollen technisch/service-nah bleiben und nicht in eine reine
  Branchen-SaaS-Spur kippen.
- Hero-Button „Demo ansehen" scrollt zu `#livedemo` (kein echtes Vapi mehr).
- Ungenutzte Legacy-Komponenten (Vapi-`LiveCallExperience`, `UseCasesSection`,
  `ProductShowcase`, `FinalCtaSection`) liegen in
  [`../../_parked/components/landing/`](../../_parked/CLAUDE.md).

## Konvention

CTA-Text weiterhin schlank halten, z. B. **„Demo anfragen"** oder
**„Telefonannahme testen"**. Kein KI-Buzzword-Framing — Benefit zuerst
(Anrufe annehmen, Rückrufnotizen erstellen, Notfälle erkennen).
