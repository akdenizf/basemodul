# CLAUDE.md — AGENTEQ KMU Assistants · Navigationskarte

> **Prinzip (token-effizient, Karpathy-Wiki-Stil):** Diese Datei ist nur die
> *Karte*. Lies **nicht** alles — spring über die Tabelle zur passenden,
> verzeichnis-lokalen `CLAUDE.md`. Jede Leaf-Datei hält genau einen Bereich,
> kurz und verlinkt. Detail steht im Blatt, nicht hier.

## Was ist das?

AGENTEQ baut verkaufbare **Anfrage-Assistenten für KMU** (Handwerk/SHK,
Hausverwaltung, Facility): nehmen Anrufe/Nachrichten an, erkennen Dringlichkeit,
fragen fehlende Infos ab, übergeben strukturiert ans Team. Kein KI-Buzzword —
konkreter Nutzen. Eigenständiges Projekt, strategisch anschlussfähig an
`../AgenteqHQ` (Hermes/Mission Control).

## Wohin für was

| Du arbeitest an… | Geh zu | Inhalt |
|---|---|---|
| **der Web-App / Landing** | [`web/CLAUDE.md`](web/CLAUDE.md) | Stack, Start, Lean-MVP-Logik |
| **Landing-Sektionen / Look** | [`web/components/landing/CLAUDE.md`](web/components/landing/CLAUDE.md) | Sektionen, Design-Identität |
| **dem geparkten Backend** | [`web/_parked/CLAUDE.md`](web/_parked/CLAUDE.md) | Was geparkt ist, Reaktivierung |
| **Routen (aktiv/geparkt)** | [`web/app/CLAUDE.md`](web/app/CLAUDE.md) | Routen-Map |
| **Design-Tokens/Regeln** | [`web/design-system/MASTER.md`](web/design-system/MASTER.md) | Source of Truth (ui-ux-pro-max) |

## Strategie-Doku (Business, kein Code)

[`PLAN.md`](PLAN.md) · [`OFFER.md`](OFFER.md) · [`GTM.md`](GTM.md) ·
[`LEAD_RESEARCH.md`](LEAD_RESEARCH.md) · [`TECHNICAL_BLUEPRINT.md`](TECHNICAL_BLUEPRINT.md)

## Harte Regeln (gelten überall)

- **Keine echten Sends / Kundendaten / Production-Keys** im MVP.
- Niemals Callfolio-Production-Secrets verwenden (Projekt stammt aus
  Callfolio-Template, sauber bereinigt — siehe [`web/CLAUDE.md`](web/CLAUDE.md)).
- Notfälle → Mensch eskalieren; keine verbindlichen Zusagen ohne Freigabe; DSGVO/AVV.

*Für andere Tools liegt parallel `AGENTS.md` (zeigt hierher).*
