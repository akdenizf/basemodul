# app/ — Routen (Next.js App Router)

[↑ web/](../CLAUDE.md) · [Landing-Sektionen](../components/landing/CLAUDE.md)

Nur **aktive** öffentliche Routen. Das Backend ist geparkt
([`_parked/`](../_parked/CLAUDE.md)).

## Aktive Routen

| Pfad | Datei | Zweck |
|---|---|---|
| `/` | `page.tsx` | Landing (komponiert `components/landing/*`) |
| `/kontakt` | `kontakt/page.tsx` | Kontakt + Cal-Link (kein Backend) |
| `/ueber-uns` · `/karriere` | je `page.tsx` | Unternehmensseiten |
| `/impressum` · `/datenschutz` · `/agb` | je `page.tsx` | Recht — echte AGENTEQ-Stammdaten, **vor Live-Gang anwaltlich prüfen** |

- `layout.tsx` — Root-Layout: Fonts (Inter/JetBrains), Voice-first-Metadaten.
- `globals.css` — globale Styles.

## Konventionen

- Marketing/Recht generalisiert auf **KMU/Servicebetriebe**.
- Geparkte Routen (`/dashboard`, `/login`, `/api/*` …) liefern bewusst **404**.
- Neue Marketing-Seite? Identität aus
  [`components/landing/CLAUDE.md`](../components/landing/CLAUDE.md) übernehmen.
