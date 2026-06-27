---
name: basemodul-core
description: Kernwissen für BaseModul Outreach — Positionierung, Module, Segment-Guardrails, Inbox Guard (department=agenteq-outreach) und Send Timing. Callfolio strikt ausgeschlossen.
---

# Skill: basemodul-core

Lade diesen Skill für jede BaseModul/AGENTEQ-Outreach- oder basemodul.de-Aufgabe.

## 1. Marke & Positionierung

- **AGENTEQ** = Dachfirma / Trust-Layer (Absender, Impressum, Enterprise-Angebot).
- **basemodul.de** = konkrete Produkt-/Landing-Shelf für KMU.
- Verkauft werden **productized KMU inbound/service-process Module**, kein generisches
  KI-Agentur-Framing, kein riesiges SaaS-Versprechen.
- Kernnutzen statt Buzzword: keine Anfrage verlieren, weniger Telefonstress, saubere Übergaben.

**Standard-Hook:** Telefon-/Anfrageannahme für Servicebetriebe — „Kein Anruf mehr verloren,
saubere Rückrufnotiz, Notfälle direkt an den richtigen Menschen."

Gute Sprache: „Kein Anruf mehr verloren", „aus WhatsApp-Chaos saubere Anfragen",
„Fotos rein, strukturierter Fall raus".
Schlechte Sprache: „autonome KI-Agenten", „Multi-Channel-Orchestrierung",
„End-to-end Digital Transformation".

## 2. Module (Produktregal)

1. **Telefon-Modul** — Anrufe annehmen, Anliegen/Kontakt/Standort/Dringlichkeit erfassen,
   Rückrufnotiz oder Ticket.
2. **Termin-Modul** — Kalender/Slots prüfen, Termine vorbereiten/bestätigen, Erinnerungen.
3. **WhatsApp-/Chat-Modul** — strukturierte Infos sammeln, Rückfragen, saubere Team-Übergabe.
4. **Foto-&-Datei-/Schaden-Modul** — Fotos/Schein/Schadenbilder entgegennehmen, Kontext
   abfragen, strukturierten Fall erzeugen (Sachverständige, Kfz, Handwerk, Entrümpelung).
5. **Prioritäts-/Notdienst-Modul** — Dringlichkeit erkennen, Pflichtinfos abfragen,
   Bereitschaft/Team eskalieren.

Aktueller Test-Favorit: **Telefon-Modul + Termin-/Notdienst-Übergabe** für Handwerk, SHK, Kfz,
lokale Servicebetriebe (Callfolio-Voice-Erfahrung vorhanden, schnell demo-fähig).

## 3. Segment-Guardrail

Zielbranchen: SHK, Kälte/Klima, Facility/Reinigung, technischer Service, Werkstätten, Kfz,
Sachverständige, Entrümpelung, lokale Servicebetriebe (2–30 Mitarbeiter, ohne feste Rezeption).

**Nicht als Default-Lane:**

- **Hausverwaltung** → gehört zur Callfolio-Spur, nicht BaseModul.
- Healthcare/Compliance-heavy Verticals als erster Markt-Test.
- Enterprise-Konzerne mit langem Sales-Cycle.

## 4. Inbox Guard (Pflicht, immer `department=agenteq-outreach`)

Vor jeder Follow-up-Planung, Follow-up-Vorbereitung oder jedem Send:

```bash
curl -sS "http://localhost:3000/api/outreach-status?department=agenteq-outreach&includeAll=true"
curl -sS "http://localhost:3000/api/outreach-status?department=agenteq-outreach&email=<leadEmail>"
```

- Guard nicht erreichbar / `ok !== true` → kein Follow-up, nichts send-ready, Haken melden.
- `blockFollowup=true` → nicht vorbereiten/senden, `nextAction` befolgen.
- `no_reply` + `nextAction="follow_up_due"` → Kandidat; nur vorbereiten, nicht senden.
- `replied`/`bounce`/`out_of_office`/`uncertain` → Follow-up blockiert; bei `replied` Reply
  Intent read-only klassifizieren (siehe MORNING_OUTREACH_CHECK.md), nie auto-antworten.
- Guard-Responses mit anderem Department **ignorieren**.

## 5. Send Timing

- Mo–Do bevorzugt · Fr nur vormittags/bewusst · Sa nur Ausnahme + Fatih-Go · So kein Versand.
- Vor jedem Send Decision Gate ausgeben (Tag / Policy / Guard / Fatih-Go / Ergebnis).
- Blockierter Tag → Draft/Preview erlaubt, kein Send, kein `sent`-Status, kein Record-Export.

## 6. Harte Regeln

- **Kein Send ohne Fatih-Go. Kein Follow-up ohne Live-Guard.**
- Callfolio strikt ausschließen (Leads, Kampagnen, Sends, Reports, Suppression).
- Keine echten Sends/Kundendaten/Production-Keys im MVP; niemals Callfolio-Secrets.
- Notfälle an Menschen eskalieren; keine verbindlichen Zusagen ohne Freigabe; DSGVO/AVV.

## 7. Nach echtem Send

1. Send-Log schreiben (BaseModul/AGENTEQ Campaign-Report).
2. Lead Store aktualisieren (`data/agenteq-outreach/leads.json`).
3. `InboxOutboundRecord` mit `department=agenteq-outreach` exportieren
   (`/Users/user/Desktop/Projects/Outreach-Agent/data/inbox-outbound.json`).
4. Mission Control aktualisieren (`mission-control/TODAY.md`).

## Querverweise

- `docs/hermes/BASEMODUL_PROFILE_BLUEPRINT.md`
- `docs/hermes/SOUL.basemodul.md`
- `/Users/user/Desktop/Projects/AgenteqHQ/docs/agenteq-outreach/SEND_TIMING_POLICY.md`
- `/Users/user/Desktop/Projects/AgenteqHQ/docs/agenteq-outreach/MORNING_OUTREACH_CHECK.md`
