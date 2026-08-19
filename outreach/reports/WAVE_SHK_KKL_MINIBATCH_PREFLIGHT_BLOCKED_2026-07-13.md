# BaseModul SHK/Kälte/Klima Mini-Batch — Preflight Blocked

**Datum:** 2026-07-13  
**Department:** `base-modul-outreach`  
**Scope:** 5 polished SHK/Kälte/Klima Leads aus `WAVE_SHK_KKL_MINIBATCH_POLISHED_PREVIEW_2026-07-13.md`  
**Status:** blocked / prepare-only — kein Versand, kein `send-ready`, keine Lead-Status-Änderung, kein Outbound Record.

## Send Timing Check

- heutiger Tag: Monday 2026-07-13 12:50 CEST
- Policy: allowed
- Guard geprüft: yes, aber nicht erreichbar
- Fatih-Go vorhanden: ambiguous (`Okay let's go` = weiter/preflight; kein explizites `sende diese 5`)
- Ergebnis: blocked

## Guard Check

Command:

```bash
curl -sS --max-time 10 'http://localhost:4550/api/outreach-status?department=base-modul-outreach&includeAll=true'
```

Result:

```txt
curl: (7) Failed to connect to localhost port 4550 after 0 ms: Couldn't connect to server
```

Nach BaseModul-Regel gilt: Guard nicht erreichbar / `ok !== true` → kein Follow-up, nichts send-ready, kein Send.

## Betroffene Mini-Batch Leads

1. `bm-w1-002` — MH Münchner Heizungsbau GmbH / Heizungsbau Hirt — info@muenchner-heizungsbau.de
2. `bm-w1-011` — Anton Ostler GmbH & Co. KG — info@anton-ostler.de
3. `bm-w1-014` — Lengauer GmbH Heizung + Sanitär — info@lengauer.de
4. `bm-w1-009` — Karl Greiner GmbH — info@karl-greiner-gmbh.de
5. `bm-w1-007` — Memminger Heizungsbau GmbH — info@memminger-gmbh.de

## Nicht gemacht

- nichts gesendet
- keine Lead-Statuses geändert
- keine Follow-ups geplant
- keine Outbound Records geschrieben
- keine `send-ready` Markierung gesetzt

## Nächster Haken

Inbox Guard auf Port `4550` starten/prüfen. Danach mit explizitem Go `sende diese 5` erneut Preflight laufen lassen: Live-Guard pro Batch/Lead + Send Timing + dann erst Versand.
