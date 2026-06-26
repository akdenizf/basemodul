# CLAUDE.md — basemodul.de · Navigationskarte

> **Prinzip (token-effizient, Karpathy-Wiki-Stil):** Diese Datei ist nur die
> *Karte*. Lies **nicht** alles — spring über die Tabelle zur passenden,
> verzeichnis-lokalen `CLAUDE.md`. Jede Leaf-Datei hält genau einen Bereich,
> kurz und verlinkt. Detail steht im Blatt, nicht hier.

## Was ist das?

Dieses Repo baut die Produktseite **basemodul.de**: modulare KI-Assistenten für
Betriebe, die Anrufe, Termine, Chat-Anfragen, Fotos, Dateien und Prioritäten sauber
vorqualifizieren wollen. **AGENTEQ** bleibt Dachfirma / Trust-Layer, aber nicht
die sichtbare Hauptmarke dieser Landingpage.

Die aktuellen Module: Telefon-Modul, Chat-Modul, Termin-Modul,
Foto-&-Datei-Modul, Prioritäts-Modul. Kein generisches KI-Agentur-Framing, keine
Hausverwaltung/SHK-Schadenfall-Spur als Hauptpositionierung.

## Wohin für was

| Du arbeitest an… | Geh zu | Inhalt |
|---|---|---|
| **der Web-App / Landing** | [`web/CLAUDE.md`](web/CLAUDE.md) | Stack, Start, Lean-MVP-Logik |
| **Landing-Sektionen / Look** | [`web/components/landing/CLAUDE.md`](web/components/landing/CLAUDE.md) | Sektionen, Design-Identität |
| **dem geparkten Backend** | [`web/_parked/CLAUDE.md`](web/_parked/CLAUDE.md) | Was geparkt ist, Reaktivierung |
| **Routen (aktiv/geparkt)** | [`web/app/CLAUDE.md`](web/app/CLAUDE.md) | Routen-Map |
| **Design-Richtung (verbindlich)** | [`DESIGN_BRIEF.md`](DESIGN_BRIEF.md) + [`index.html`](index.html) | Dark Premium, kanonische Referenz |

## Strategie-Doku (Business, kein Code)

[`PLAN.md`](PLAN.md) · [`OFFER.md`](OFFER.md) · [`WIREFRAME.md`](WIREFRAME.md) ·
[`DESIGN_BRIEF.md`](DESIGN_BRIEF.md) · [`GTM.md`](GTM.md) ·
[`LEAD_RESEARCH.md`](LEAD_RESEARCH.md) · [`TECHNICAL_BLUEPRINT.md`](TECHNICAL_BLUEPRINT.md)

## Agenten-Prompts

[`prompts/basemodul-landing-implementation.md`](prompts/basemodul-landing-implementation.md)
— Prompt für Claude Code, um die bestehende Landing auf basemodul.de umzubauen.

## Harte Regeln (gelten überall)

- **Keine echten Sends / Kundendaten / Production-Keys** im MVP.
- Niemals Callfolio-Production-Secrets verwenden (Projekt stammt aus
  Callfolio-Template, sauber bereinigt — siehe [`web/CLAUDE.md`](web/CLAUDE.md)).
- Notfälle → Mensch eskalieren; keine verbindlichen Zusagen ohne Freigabe; DSGVO/AVV.

*Für andere Tools liegt parallel `AGENTS.md` (zeigt hierher).*
