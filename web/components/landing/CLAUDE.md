# components/landing/ — Landing-Sektionen

[↑ web/](../../CLAUDE.md) · [Design-Tokens](../../design-system/MASTER.md)

Alle gerenderten Landing-Bausteine. Reihenfolge wird in
[`app/page.tsx`](../../app/page.tsx) komponiert.

## Sektions-Reihenfolge (page.tsx)

`Navbar → HeroSection → TrustSection → LiveDemoSection → BranchenSection →
PainSection → HowItWorksSection → SelfOnboardingSection → VisualContextSection →
RoiSection → IntegrationsSection → PricingSection → LetsWorkTogether →
FaqSection → Footer → FloatingCta`

## Design-Identität: "Professional Navy"

| Rolle | Wert |
|---|---|
| Akzent / CTA | `#0369A1` (Blau), Hover `#075985` |
| Akzent-Button-Text | `text-white` (nie Navy auf Blau) |
| Dunkeltext / Navy | `#0F172A` |
| Hintergrund | `#F8FAFC` |
| Headings | `font-display` = Calistoga (Serif) |
| Body | `font-sans` = Inter |
| Badges | `bg-[#0369A1]/10` + `text-[#0369A1]` |

## Wichtige Eigenheiten

- **`LiveDemoSection`** ist self-contained (Audio/Transkript-Player, **kein
  Backend/Vapi**) und in `page.tsx` als `dynamic` mit **`ssr: false`** geladen —
  daher nicht im Server-HTML, rendert nur clientseitig.
- **`BranchenSection`** = die 3 Branchenkarten (Handwerk/SHK, Hausverwaltung,
  Facility). „Hausverwaltung" hier ist gewollt (Branchenname), kein Rest.
- Hero-Button „Demo ansehen" scrollt zu `#livedemo` (kein echtes Vapi mehr).
- Ungenutzte Callfolio-Komponenten (Vapi-`LiveCallExperience`, `UseCasesSection`,
  `ProductShowcase`, `FinalCtaSection`) liegen in
  [`../../_parked/components/landing/`](../../_parked/CLAUDE.md).

## Konvention

CTA-Text durchgängig **„Pilotplatz anfragen"**. Kein KI-Buzzword-Framing —
Benefit zuerst (keine Anfrage verlieren, Dringlichkeit erkennen).
