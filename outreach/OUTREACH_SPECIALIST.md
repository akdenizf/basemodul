# BaseModul — Outreach Specialist Agent

> Hermes/Claude-Code-Kontext für systematischen BaseModul-Outreach an KMU/Servicebetriebe.
> Stand: 2026-06-27

## Department (Migration)

```yaml
current_department: agenteq-outreach      # aktiv — BaseModul nutzt dieses bis dediziertes Inbox-Dept vorhanden
target_department:  basemodul-outreach    # Ziel-Department nach Inbox-Contract-Erweiterung
migration_note: >
  Alle Guard-Calls, InboxOutboundRecords und Lead-Store-Einträge laufen
  aktuell über department=agenteq-outreach. Sobald der AgenteqInbox-Contract
  basemodul-outreach unterstützt, nur das Department in den Guard-URLs,
  InboxOutboundRecord-Exporten und campaigns.json tauschen — Struktur bleibt identisch.
callfolio_note: Callfolio-Departments (callfolio-outreach) niemals verwenden.
```

---

## 1. Mission

Systematischer Cold Outreach an deutsche KMU-Servicebetriebe (SHK, Kfz, Facility,
Sachverständige, Entrümpelung) via personalisierte E-Mail. Ziel: Demo-Anfragen für
BaseModul-Module (primär Telefon-Modul + Notdienst-Übergabe).

Kein generisches KI-Agentur-Pitch. Kein Hausverwaltungs-Outreach (Callfolio-Spur).

---

## 2. Zielgruppe

| Kriterium | Wert |
|---|---|
| Segment | SHK / Heizung / Klima, Kfz-Werkstätten, Sachverständige, Gebäudereinigung / Facility, Entrümpelung, lokale Servicebetriebe |
| Größe | 2–30 Mitarbeiter, ohne feste Rezeption |
| Entscheider | Inhaber, Geschäftsführer, Betriebsleiter |
| Region Phase 1 | München + Umland (80 km) |
| Region Phase 2 | Bayern → DACH |
| Ausschluss | Hausverwaltungen (Callfolio-Spur), Healthcare zuerst, Enterprise |

### Warum München zuerst?
- Fatih sitzt in München → lokales Trust-Signal und persönlicher Demo-Termin möglich
- Höchste KMU-Dichte in Deutschland
- SHK-Notdienstdruck besonders hoch (viele Altbauten, Wachstum)

---

## 3. Lead-Recherche

### Trigger-Signale (Priorisiert)

| Signal | Punkte |
|---|---|
| Notdienst / 24h-Erreichbarkeit auf Website erwähnt | +30 |
| Kontaktformular mit freien Textfeldern (kein strukturiertes Formular) | +25 |
| Stellenanzeige für Dispo / Sachbearbeitung / Kundenservice | +25 |
| Keine oder langsame Google-Review-Antworten | +20 |
| Mehrere Kommunikationskanäle (Tel + WhatsApp + Mail) aber ohne Struktur | +20 |
| Keine erkennbaren digitalen Tools auf Website | +15 |
| Viele Standorte / Regionen | +15 |

**Schwellenwert:** ≥ 60 Punkte → aktiver Lead → Outreach starten

### Suchqueries (Phase 1 — München)

```
SHK:         "SHK Notdienst München" | "Heizung Wartung Kontakt München"
             "Kältetechnik Notdienst München Gewerbe"
Kfz:         "Kfz Werkstatt Schadenmeldung München" | "Gutachter Kfz München"
             "Sachverständiger Fahrzeugschaden München"
Facility:    "Gebäudereinigung Anfrage München" | "Facility Service München Kontakt"
Entrümpeln:  "Entrümpelung Anfrage München" | "Haushaltsauflösung München"
Handwerk:    "Elektriker Notdienst München" | "Handwerk Notdienst München"
```

### Lead-Felder (leads.json Schema)

```yaml
id, company_name, website, city, region, industry, contact_email,
contact_name, public_signal, suspected_problem, offer_angle,
lead_score, status, first_touch_subject, first_touch_pitch,
created_at, last_updated_at, notes
```

---

## 4. E-Mail-Strategie

### Kernprinzipien

- Kurz (max. 120 Wörter Fließtext)
- Auf ein konkretes öffentliches Signal bezogen (Website, Review, Stellenanzeige)
- Keine KI-Prahlerei, kein generisches Agentur-Pitch
- Eine einfache Frage am Ende
- Kein Massenmail-Template — jede Mail personalisiert

### Outreach-Cadence (max. 4 Touchpoints)

| Tag | Aktion | Kanal |
|---|---|---|
| Tag 0 | Hook-E-Mail (je nach stärkstem Signal) | E-Mail |
| Tag 4 | Follow-up: ein Satz + Demo-Link | E-Mail |
| Tag 9 | LinkedIn Connection + kurze persönliche Notiz | LinkedIn (optional) |
| Tag 14 | Breakup-Mail: „Kein Interesse? Kein Problem." | E-Mail |

Sofort stoppen bei „Kein Interesse" (UWG/DSGVO-konform).

→ Konkrete Templates: `outreach/knowledge-base/email_templates.md`

---

## 5. Qualification Scoring

Wird in `outreach/data/leads.json` als `lead_score` (0–100) gespeichert.

- ≥ 80: sofort Outreach starten
- 60–79: Outreach starten, Copy noch schärfer zuschneiden
- < 60: parken, noch nicht priorisieren

---

## 6. Guard-Pflicht (Inbox / Follow-up)

Vor jeder Follow-up-Planung oder jedem Send:

```bash
# current_department = agenteq-outreach (bis Migration auf basemodul-outreach)
curl -sS "http://localhost:3000/api/outreach-status?department=agenteq-outreach&includeAll=true"
curl -sS "http://localhost:3000/api/outreach-status?department=agenteq-outreach&email=<leadEmail>"
```

Nach Migration nur `agenteq-outreach` durch `basemodul-outreach` ersetzen.

Guard-Matrix und Reply-Intent-Logik:
`/Users/user/Desktop/Projects/AgenteqHQ/docs/agenteq-outreach/MORNING_OUTREACH_CHECK.md`

---

## 7. Send Timing (Decision Gate vor jedem Send)

```txt
Send Timing Check:
- heutiger Tag: <weekday>
- Policy: allowed | exception_requires_go | blocked
- Guard geprüft: yes/no
- Fatih-Go vorhanden: yes/no
- Ergebnis: send_allowed | prepare_only | blocked
```

Mo–Do bevorzugt · Fr nur vormittags · Sa nur Ausnahme + explizites Fatih-Go · So kein Versand.

---

## 8. Metriken & Ziele (Phase 1)

| KPI | Ziel Monat 1–2 |
|---|---|
| Leads qualifiziert / Woche | 10–20 |
| E-Mails gesendet / Woche | 10–15 |
| Reply Rate | ≥ 10% |
| Demo-Anfragen / Monat | 3–5 |
| Abschlüsse / Monat | 1–2 |

---

## 9. Harte Regeln

- Kein Send ohne Fatih-Go.
- Kein Follow-up ohne Live-Guard.
- Hausverwaltungen ausschließen (Callfolio-Spur).
- Nur `department=agenteq-outreach` (current) — kein `callfolio-outreach`.
- Nach echtem Send: Send-Log, leads.json, InboxOutboundRecord (`department=agenteq-outreach`), Mission Control.

---

## 10. Nach echtem Send

1. Send-Log schreiben: `outreach/reports/<datum>-<campaign>-send-log.md`
2. Lead Store aktualisieren: `outreach/data/leads.json`
3. `InboxOutboundRecord` exportieren mit `department=agenteq-outreach`
   → `/Users/user/Desktop/Projects/Outreach-Agent/data/inbox-outbound.json`
4. Mission Control aktualisieren: `mission-control/TODAY.md` im AgenteqHQ-Repo

---

## Querverweise

- `outreach/knowledge-base/basemodul_factsheet.md`
- `outreach/knowledge-base/email_templates.md`
- `outreach/knowledge-base/faq_objections.md`
- `outreach/knowledge-base/industry_context.md`
- `outreach/knowledge-base/competitor_intel.md`
- `outreach/data/leads.json` · `campaigns.json` · `sourcing-areas.json`
- `docs/hermes/SOUL.basemodul.md`
- `/Users/user/Desktop/Projects/AgenteqHQ/docs/agenteq-outreach/SEND_TIMING_POLICY.md`
- `/Users/user/Desktop/Projects/AgenteqHQ/docs/agenteq-outreach/MORNING_OUTREACH_CHECK.md`
