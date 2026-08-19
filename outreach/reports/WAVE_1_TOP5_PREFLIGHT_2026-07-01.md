# BaseModul Wave 1 — Top 5 Preflight

Datum: 2026-07-01 11:14 CEST  
Scope: Preflight/Review für Wave-1 Top 5. **Kein Versand**, keine Auto-Mail, keine InboxOutboundRecords.  
Department: `base-modul-outreach`

## Send Timing Check

- heutiger Tag: Wednesday
- Policy: allowed
- Guard geprüft: yes
- Fatih-Go vorhanden: no
- Ergebnis: prepare_only

## Guard Ergebnis

Live-Guard Endpoint:

```txt
GET http://localhost:4550/api/outreach-status?department=base-modul-outreach&includeAll=true
GET http://localhost:4550/api/outreach-status?department=base-modul-outreach&email=<leadEmail>
```

Guard war erreichbar: `ok=true`  
SyncedAt: `2026-07-01T08:54:21.831Z`

Für diese Top-5-E-Mails gab es jeweils `count=0`, also keine bestehenden Status-/Reply-/Block-Einträge im BaseModul-Guard:

| Lead | Email | Guard | Action |
|---|---|---:|---|
| Hühnchen Heiztechnik GmbH | info@heiztechnik-gmbh.de | count=0 | preview_only |
| allwartung GmbH | info@allwartung.de | count=0 | preview_only |
| J. Baumgartner GmbH | info@j-baumgartner.de | count=0 | preview_only |
| Achatz Wärmetechnik GmbH | info@achatz-heizung.de | count=0 | preview_only |
| Herrlinger Dienstleistungen | info@herrlinger.eu | count=0 | preview_only |

Hinweis: `includeAll=true` zeigt bestehende BaseModul-Records aus anderen früheren Kampagnen/Leads, darunter Follow-up-Wartefälle und eine Out-of-office-Adresse. Diese gehören nicht zu den fünf neuen Wave-1-Top-Leads.

## Versand-Reihenfolge Empfehlung

### Mini-Batch A — stärkste 3

1. **Hühnchen Heiztechnik GmbH**  
   Warum: stärkstes öffentliches Signal durch 365-Tage-Notdienst.  
   Betreff: `Kurze Frage zu Ihrem 365-Tage-Notdienst`

2. **allwartung GmbH**  
   Warum: Kundendienst + Notdienst + mehrere Gewerke; guter Prozess-Fit.  
   Betreff: `Kurze Frage zu Kundendienst und Notdienst`

3. **J. Baumgartner GmbH**  
   Warum: Telefon, Mail, Formular und WhatsApp plus Service/Notdienst; guter Multi-Channel-Hook.  
   Betreff: `Telefon, Formular und WhatsApp — kurze Frage`

### Mini-Batch B — danach

4. **Achatz Wärmetechnik GmbH**  
   Warum: Wochenend-/Feiertags-Notdienst + Anfragearten.  
   Betreff: `Kurze Frage zu Notdienst-Anfragen`

5. **Herrlinger Dienstleistungen**  
   Warum: SOS-Notdienst klar sichtbar, aber kleiner/engerer Fit.  
   Betreff: `SOS-Notdienst — kurze Frage zur Erstaufnahme`

## Copy-Status

Die finalen Drafts liegen hier:

`outreach/reports/WAVE_1_COPY_PREVIEW_TOP5_2026-07-01.md`

## Entscheidung

Aktueller Status: **prepare_only**

Für echten Versand fehlt noch:

1. explizites Fatih-Go für konkrete Leads,
2. direkt vor Versand nochmals Send Timing Check,
3. Versand-Tool/Provider-Ausführung,
4. danach Send-Log, Lead Store Update, InboxOutboundRecord und Mission-Control-Update.
