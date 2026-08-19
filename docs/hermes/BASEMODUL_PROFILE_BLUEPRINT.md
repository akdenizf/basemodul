# BaseModul Hermes Profile Blueprint

> Blueprint für ein künftiges Hermes-Profil `basemodul`.
> Ziel: per Claude Code reproduzierbar einrichten, ohne dass AGENTEQ, BaseModul und
> Callfolio vermischt werden.
> Stand: 2026-06-27

Diese Datei lebt im **basemodul-Repo** und ist die projekt-lokale Spiegelung des
HQ-Blueprints aus
`/Users/user/Desktop/Projects/AgenteqHQ/docs/agenteq-outreach/BASEMODUL_PROFILE_BLUEPRINT.md`.
Sie beschreibt **nur Projekt-Doku**. Sie erstellt **kein** Hermes-Profil und ändert
**keine** `~/.hermes`-Dateien.

---

## 1. Profil-Mission

**Name:** `basemodul`

**Rolle:** BaseModul Outreach / Productized KMU Module Agent

**Scope:**

- basemodul.de Positionierung, Landing, Module, Content, Outreach-Preview
- AGENTEQ/BaseModul Leads und Kampagnen
- `department=base-modul-outreach` für BaseModul Inbox Guard / Follow-up Guard
- **keine** Callfolio-Leads, **keine** Callfolio-Kampagnen, **keine** Callfolio-Sends

**Source of Truth:**

- `/Users/user/Desktop/Projects/basemodul` (dieses Repo)
- `/Users/user/Desktop/Projects/basemodul/CLAUDE.md`
- `/Users/user/Desktop/Projects/basemodul/README.md`
- `/Users/user/Desktop/Projects/basemodul/OFFER.md`
- `/Users/user/Desktop/Projects/basemodul/PLAN.md`
- `/Users/user/Desktop/Projects/basemodul/WIREFRAME.md`
- `/Users/user/Desktop/Projects/basemodul/docs/hermes/SOUL.basemodul.md`
- `/Users/user/Desktop/Projects/basemodul/docs/hermes/basemodul-core.SKILL.md`
- `/Users/user/Desktop/Projects/AgenteqHQ/docs/agenteq-outreach/SEND_TIMING_POLICY.md`
- `/Users/user/Desktop/Projects/AgenteqHQ/docs/agenteq-outreach/MORNING_OUTREACH_CHECK.md`
- `/Users/user/Desktop/Projects/basemodul/outreach/data/leads.json`

---

## 2. Operating Rules

1. Nur BaseModul/AGENTEQ Outreach bearbeiten.
2. Für BaseModul Inbox-/Reply-/Follow-up-Guard ausschließlich `department=base-modul-outreach` auf `http://localhost:4550` nutzen.
3. Alle Guard-Responses mit anderem Department ignorieren.
4. Keine Callfolio-Artefakte anfassen (Leads, Kampagnen, Reports, Suppression, Sends),
   außer Fatih beauftragt explizit eine **getrennte** Callfolio-Aufgabe.
5. **Kein Send ohne Fatih-Go.**
6. **Kein Follow-up ohne Live-Guard.**
7. Send Timing Policy beachten:
   - Mo–Do bevorzugt
   - Fr nur vormittags/bewusst
   - Sa nur Ausnahme + explizites Fatih-Go
   - So kein Versand
8. Nach echtem Send: Send-Log, Lead Store und InboxOutboundRecord `department=base-modul-outreach` aktualisieren; Ergebnis knapp berichten. Keine Mission-Control-Pflicht.

---

## 3. Guard-Pflicht (Inbox / Follow-up)

Vor jeder Follow-up-Planung, Follow-up-Vorbereitung oder jedem Send:

```bash
curl -sS "http://localhost:4550/api/outreach-status?department=base-modul-outreach&includeAll=true"
```

Für einzelne Leads:

```bash
curl -sS "http://localhost:4550/api/outreach-status?department=base-modul-outreach&email=<leadEmail>"
```

Regeln:

- Guard nicht erreichbar / Timeout / ungültiges JSON / `ok !== true` →
  **kein Follow-up vorbereiten, nichts als send-ready markieren**, Inbox-Server-Haken melden.
- `blockFollowup === true` → kein Follow-up vorbereiten/queue'n/senden, `nextAction` befolgen.
- `nextAction="follow_up_due"` → Follow-up nur vorbereiten; vor echtem Send Live-Guard erneut prüfen.
- `replied` → Follow-up blockiert; Reply Intent klassifizieren (read-only), nie automatisch antworten.

Vollständige Guard-Matrix und Reply-Intent-Logik:
`/Users/user/Desktop/Projects/AgenteqHQ/docs/agenteq-outreach/MORNING_OUTREACH_CHECK.md`.

---

## 4. Send Timing (Decision Gate vor jedem Send)

Vor jedem Send kurz prüfen und reporten:

```txt
Send Timing Check:
- heutiger Tag: <weekday>
- Policy: allowed | exception_requires_go | blocked
- Guard geprüft: yes/no
- Fatih-Go vorhanden: yes/no
- Ergebnis: send_allowed | prepare_only | blocked
```

Wochenregel (Quelle: SEND_TIMING_POLICY.md):

| Tag | First Touch | Follow-up |
|---|---|---|
| Mo–Do | erlaubt (bevorzugt) | erlaubt (bevorzugt) |
| Fr | erlaubt, vorzugsweise vormittags | erlaubt, vorzugsweise vormittags |
| Sa | nur Ausnahme + explizites Fatih-Go | nur Ausnahme + explizites Fatih-Go |
| So | nicht senden | nicht senden |

Bei blockiertem Tag: Draft/Preview erlaubt, kein Send, kein Store-Status `sent`,
kein `InboxOutboundRecord`-Export; nächsten erlaubten Slot vorschlagen.

---

## 5. Pflicht nach jedem echten Send

1. **Send-Log** schreiben (BaseModul/AGENTEQ Campaign-Report bzw. Send-Log).
2. **Lead Store** aktualisieren — BaseModul: `outreach/data/leads.json`.
3. **InboxOutboundRecord** exportieren mit `department=base-modul-outreach`
   (Ziel-MVP: `/Users/user/Desktop/Projects/Outreach-Agent/data/inbox-outbound.json`).
   Pflichtfelder: `source`, `department`, `campaignName`, `leadId`, `leadEmail`,
   `companyName`, `fromEmail`, `replyToEmail`, `subject`, `provider`,
   `providerMessageId`, `resendMessageId`, `sentAt`, `nextFollowupAt`, `status`.
4. **Ergebnis knapp berichten** — Chat oder Run-Report; keine Mission-Control-Pflicht und keine `mission-control/TODAY.md` erzeugen.

---

## 6. Empfohlener Skill: `basemodul-core`

Siehe `docs/hermes/basemodul-core.SKILL.md`. Inhalt deckt ab:

- BaseModul Positionierung: productized KMU inbound/service-process modules
- AGENTEQ = Dachfirma / Trust Layer, BaseModul = konkrete Produkt-/Landing-Shelf
- Standard-Hook: Telefon-/Anfrageannahme für Servicebetriebe
- Module: Telefon, Termin, WhatsApp/Chat, Foto-&-Datei/Schaden, Priorität/Notdienst
- Segment-Guardrail: SHK, Kälte/Klima, Facility, technischer Service, Werkstätten,
  Kfz, Sachverständige, Entrümpelung, lokale Servicebetriebe
- **keine Hausverwaltung als Default-Lane** (Callfolio-Spur)
- Send Timing Policy
- Inbox Guard mit `department=base-modul-outreach`

---

## 7. Profil-SOUL

Der SOUL-Entwurf liegt in `docs/hermes/SOUL.basemodul.md`. Er ist die Vorlage für
ein späteres Hermes-Profil und wird **nicht** automatisch aus einer AGENTEQ-Session
cross-profile geschrieben.

---

## 8. Optionale Hermes CLI Schritte

> Nur ausführen, wenn Fatih explizit Go gibt. Nicht blind aus dieser Session laufen lassen.

```bash
hermes profile create basemodul --clone-from agenteq
hermes profile show basemodul
```

Danach Profil-Dateien unter `~/.hermes/profiles/basemodul/` mit den Vorlagen aus
`docs/hermes/SOUL.basemodul.md` und `docs/hermes/basemodul-core.SKILL.md` verdrahten.
Kein cross-profile Write aus einer AGENTEQ-Session.

---

## 9. Abgrenzung Callfolio (hart)

- BaseModul nutzt nur `department=base-modul-outreach`.
- Callfolio hat eigenes Department (`callfolio-outreach`), eigene Stores/Reports/Send-Logs/Suppression.
- Keine Vermischung in Reports oder Records.
- Hausverwaltung ist die Callfolio-Lane und **nicht** BaseModul-Zielbranche.
