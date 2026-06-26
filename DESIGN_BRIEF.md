# basemodul.de Design-Brief

> **Diese Datei ist die verbindliche Design-Richtlinie.** Frühere Versionen
> (hell/warm/„Werkbank"/„Professional Navy") sind **verworfen**. Maßgeblich ist
> ausschließlich diese Richtung. Die kanonische Referenz-Umsetzung ist
> [`index.html`](index.html) im Repo-Root — neue Flächen orientieren sich daran.

## Richtung

Modern, **dunkel, premium**. Vorbild: **Linear.app, Vercel, Stripe** — klare
Typografie, viel Whitespace, mutige Headlines, subtile Gradienten/Glows.

Kein heller/beiger Hintergrund. Kein Raster-/Grid-Pattern. Kein
„SaaS-Starter-Template"-Look (Exa/Firecrawl-artig). Kein „API-Tool"-Look
(keine Terminal-Fenster, keine Code-Snippets als Deko). Keine
Uppercase-Hauptüberschriften (Uppercase nur für kleine Labels/Tags).

## Farben (Tokens)

| Rolle | Wert |
|---|---|
| Hintergrund | `#0A0A0A` (alt. Sektion `#0D0D0D`) |
| Flächen / Karten | `#141414`, hover/aktiv `#181818` |
| Linien | `rgba(255,255,255,0.08)`, stärker `0.14` |
| Text primär (Headlines) | `#FAFAFA` |
| Text sekundär (Fließtext, Labels) | `#A1A1AA` |
| Text gedämpft | `#6B6B72` |
| Akzent | **Grün `#22C55E`** (tiefer `#16A34A`) |
| Akzent-Flächen | `rgba(34,197,94,0.12)`, Linie `0.35` |

Genau **eine** Akzentfarbe (Grün) für CTAs, Highlights, aktive Zustände, Pfeile,
Tags. Glow sparsam und subtil einsetzen (Hero, CTA), nie grell.

## Typografie

- Font: **Inter** (400–900), `system-ui` als Fallback.
- Hero-Headline sehr groß und mutig: Desktop ~72–84px, `font-weight 800`,
  `line-height ~1.0`, `letter-spacing -0.03em`. Kernaussage/zweites Wort in Grün.
- Sektions-Headlines `clamp(30px, 4.5vw, 46px)`, bold, weiß.
- Fließtext `#A1A1AA`, ~15–17px, max. ~60ch.
- Tabular-Figures für Preise/Nummern.

## Komponenten

- **Nav:** sticky, dunkel, leicht transparent mit `backdrop-blur`; Logo
  „basemodul.de" weiß + „/ von AGENTEQ" grau; Links mittig; grüner CTA rechts.
- **Hero:** volle Viewport-Höhe, mutige Headline, grauer Subtext, zwei Buttons
  (grün gefüllt + transparent mit Rand), Trust-Zeile „DSGVO · Server in
  Frankfurt", darunter die 5 Module als horizontale Karten (aktiver Zustand
  zyklisch). Kein Screenshot.
- **Karten:** dunkle Fläche `#141414` + 1px Linie; Hover = grüne Umrandung +
  dezenter grüner Glow + leichtes Anheben. Radius 10–16px.
- **Buttons:** primär = grün gefüllt, dunkler Text; sekundär = transparent,
  heller Rand. Hover: leichtes `translateY(-1px)`.
- **Icons:** ausschließlich inline-SVG (1.5–1.8 Stroke) oder Unicode — keine
  externen Icon-Bibliotheken/Bilder.

## Inhaltliche Leitplanken (unverändert gültig)

- Marke: **basemodul.de**; **AGENTEQ** nur Trust-Layer/Anbieter im Hintergrund.
- Module: Telefon, Termin, WhatsApp, Foto-/Schaden, Notdienst — Prinzip
  „Eingang rein → Modul fragt nach → fertige Aktion raus".
- Keine Hausverwaltung. Keine Fake-Claims (kein 24/7, 241ms, 80%, 30+ Sprachen).
- Tonalität: direkt, betrieblich, deutsch. Keine AI-Buzzwords.

## Technische Leitplanken (für die Referenz `index.html`)

- Eine `index.html`, eingebettetes CSS + vanilla JS, kein CSS-Framework.
- Google Fonts (Inter), Smooth-Scroll, FAQ-Accordion (JS), responsive @768px.
- Alle CTAs → `#demo`. Keine externen Bilder, nur inline-SVG/Unicode.
- `prefers-reduced-motion` respektieren.

> Die Next.js-Landing unter `web/` wird später an diese Richtung angeglichen
> bzw. aus `index.html` zurückportiert. Bei Konflikt gilt **diese Datei +
> `index.html`**.
