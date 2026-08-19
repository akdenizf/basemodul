# BaseModul Webhook Offer Check — 2026-07-14

**Scope:** Angebotsschärfung für BaseModul/AGENTEQ: Was können wir Servicebetrieben über reine Rückrufnotiz hinaus anbieten, wenn Webhooks, n8n, WhatsApp/SMS, Kalender, CRM/Sheet/Tickets und LLM-Intake vorhanden sind?  
**Status:** Strategie-/Offer-Check, kein Outreach-Send, keine Lead-Status-Änderung.

## Quellen geprüft

- `OFFER.md`
- `PLAN.md`
- `GTM.md`
- `WIREFRAME.md`
- `TECHNICAL_BLUEPRINT.md`
- Attachment: `.hermes/desktop-attachments/agenteq_marktanalyse.pdf` via PyMuPDF-Extraktion nach `/tmp/agenteq_marktanalyse_extracted.txt`

## Kernurteil

Fatihs Einwand stimmt: **Rückrufnotiz ist nur der niedrigste Einstieg.**

Das stärkere Angebot ist nicht „wir schreiben eine Notiz“, sondern:

> **Ein kleines Anfrage-Betriebssystem für lokale Servicebetriebe:**
> Eingang über Telefon, WhatsApp, Formular, E-Mail oder Foto → Pflichtinfos abfragen → Dringlichkeit/Typ erkennen → an Kalender, WhatsApp, CRM/Sheet/Ticket, Angebot oder Follow-up weitergeben.

Die Rückrufnotiz bleibt das verständliche Beispiel im Outreach. Verkauft wird aber besser als **Webhook-basierter Anfragefluss** / **digitaler Empfang mit Übergabe-Automation**.

## Warum das laut Marktanalyse passt

Aus der PDF:

- Deutsche KMU wissen, dass KI relevant wird, nutzen sie aber kaum in echten Prozessen.
- Handwerk/Servicebetriebe sind unterversorgt; KI-Adoption im Handwerk nur ca. 8–10%.
- Überlaufen: reine Voice-Bots, generische KI-Beratung, Healthcare-Telefonassistenten.
- Marktlücke: vollständige Workflows nach dem Erstkontakt — Angebotserstellung, Follow-up, CRM, Termin, Status, WhatsApp.
- Kunden verstehen Worte wie „Kein Anruf mehr verpassen“, „Digitaler Empfang“, „Termin-Assistent“, „Automatisches Angebot“ besser als technische KI-Begriffe.

## Angebotsarchitektur: nicht 1 Modul, sondern 5 Webhook-Flows

### 1. Digitaler Empfang / Anfrage-Router

**Für:** SHK, Kälte/Klima, Kfz, Entrümpelung, Reinigung, technische Services.  
**Trigger:** Telefon, Formular, E-Mail, WhatsApp.  
**Webhook-Flow:**

1. Anfrage kommt rein.
2. BaseModul klassifiziert: Notfall, Termin, Angebot, Wartung, Schaden, Statusfrage.
3. Fehlende Pflichtinfos werden nachgefragt.
4. Übergabe an Team per E-Mail/WhatsApp/Sheet/Ticket.
5. Bei Bedarf Follow-up-Reminder.

**Kundennutzen:** nicht nur Rückrufnotiz, sondern keine chaotischen Eingangskanäle mehr.

**Outreach-Satz:**
> Nicht nur Rückrufnotiz: Es geht darum, aus Telefon, WhatsApp und Formular automatisch eine vorsortierte Anfrage mit nächstem Schritt zu machen.

---

### 2. Notdienst- & Prioritätsflow

**Für:** SHK, Kälte/Klima, Elektriker, Rohrreinigung, technische Bereitschaft.  
**Trigger:** Anruf/WhatsApp außerhalb Bürozeiten oder mit Notfallwörtern.  
**Webhook-Flow:**

1. Dringlichkeit erkennen.
2. Pflichtinfos abfragen: Adresse, Problem, Anlage, Gefahr, Rückrufnummer.
3. Bereitschaft per SMS/WhatsApp informieren.
4. Notfall in separater Liste/Ticket markieren.
5. Kunde bekommt sichere Bestätigung: Anfrage wurde aufgenommen, Team prüft.

**Wichtig:** Keine verbindliche Notfallzusage automatisieren.

**Kundennutzen:** Notfälle landen nicht in Mailbox/WhatsApp-Chaos.

---

### 3. Termin- & Kalenderflow

**Für:** Werkstätten, Wartung, Kälte/Klima-Service, lokale Services.  
**Trigger:** Terminwunsch per Telefon/Formular/WhatsApp.  
**Webhook-Flow:**

1. Anliegen und Ort erfassen.
2. Dauer/Kategorie schätzen.
3. Kalender/Slots prüfen oder Rückrufslot vorbereiten.
4. Termin bestätigen oder intern zur Freigabe markieren.
5. Erinnerung per SMS/WhatsApp/E-Mail.

**Kundennutzen:** weniger Hin-und-her, weniger verlorene Termine.

---

### 4. Foto-/Schaden-/Dokumentenflow

**Für:** Kfz-Gutachter, Werkstätten, Entrümpelung, Handwerk, Gebäudeschäden.  
**Trigger:** Kunde schickt Bilder/Fahrzeugschein/Objektfotos.  
**Webhook-Flow:**

1. Bilder/Dateien entgegennehmen.
2. Kontext abfragen: Ort, Hergang, Maße, Fahrzeugdaten, gewünschter Termin.
3. Fehlende Infos erkennen.
4. Fallmappe erstellen: Zusammenfassung + Dateien + Kontaktdaten.
5. Übergabe an Team/CRM/Drive/Sheet.

**Kundennutzen:** Fotos rein, strukturierter Fall raus.

---

### 5. Angebot- & Follow-up-Flow

**Für:** Reinigung, Maler, Entrümpelung, SHK-Projektanfragen, Kfz-Reparaturannahme.  
**Trigger:** qualifizierte Anfrage oder Fallmappe.  
**Webhook-Flow:**

1. Anfrage wird aus Eingangsdaten strukturiert.
2. Preis-/Leistungsparameter werden abgefragt.
3. Angebotsentwurf aus Vorlage erzeugen.
4. Inhaber bekommt Freigabe-Link/WhatsApp/E-Mail.
5. Nach 3/7 Tagen Follow-up-Reminder oder Entwurf.

**Kundennutzen:** mehr Angebote raus, weniger manuelle Büroarbeit.

**Guardrail:** Angebot nur als Entwurf/Freigabe, nicht vollautomatisch verbindlich.

## Empfohlene Offer-Ladder

### Einstieg: Intake Pilot

**Preisanker:** 750–1.500 € Setup + 150–399 €/Monat.  
**Lieferung:** ein Kanal + ein Übergabeziel.  
**Beispiel:** Telefon/Formular → strukturierte Rückruf-/Anfragenotiz → WhatsApp/E-Mail ans Team.

### Core: Anfrage-System

**Preisanker:** 1.500–4.000 € Setup + 300–899 €/Monat.  
**Lieferung:** 2–3 Kanäle + Webhooks + Kalender/Sheet/Ticket + Follow-up-Reminder.  
**Beispiel:** Telefon + WhatsApp + Formular → Klassifikation → Pflichtinfos → Kalender/Teamübergabe.

### Custom: Service-Workflow

**Preisanker:** ab 5.000 € Setup + ab 899 €/Monat.  
**Lieferung:** mehrere Module, mehrere Standorte, CRM, Status, Angebot, Reporting.

## Beste Positionierung für Outreach

Nicht sagen:

> Wir bauen Rückrufnotizen.

Besser:

> Wir bauen einen kleinen Anfragefluss, der Telefon, WhatsApp, Formular oder Fotos annimmt, fehlende Infos abfragt und den nächsten Schritt automatisch vorbereitet — Rückruf, Termin, Notfall, Fallmappe oder Angebotsentwurf.

Noch kürzer:

> Aus jeder Anfrage wird automatisch der nächste saubere Arbeitsschritt fürs Team.

## Was wir im nächsten Outreach testen sollten

### A/B Hook A — Rückrufnotiz als niedrigster Einstieg

> Aus einem Anruf wie „Heizung ausgefallen“ wird automatisch eine vollständige Rückrufnotiz.

### A/B Hook B — Webhook-/Workflow größer

> Aus Telefon, WhatsApp oder Formular wird automatisch eine vorsortierte Anfrage: Dringlichkeit, Pflichtinfos, zuständige Person und nächster Schritt.

### A/B Hook C — Angebot/Follow-up für Betriebe mit Angebotsdruck

> Aus einer Anfrage wird ein vorbereiteter Angebotsentwurf plus Follow-up-Erinnerung — erst nach Ihrer Freigabe raus.

## Empfehlung

Für BaseModul jetzt nicht enger auf Rückrufnotiz gehen. Die Reihenfolge sollte sein:

1. **Extern verständlich starten:** Rückrufnotiz / kein Anruf verloren.
2. **Im zweiten Satz öffnen:** Webhook-Flow zu Termin, WhatsApp, CRM, Ticket, Angebot.
3. **Im Call/Pilot verkaufen:** Anfrage-System mit einem konkreten ersten Workflow.

## Nächster operativer Haken

Ein neues Mini-Asset bauen:

**„Vom Anruf zum Auftrag: 5 Webhook-Flows für SHK/Kälte/Klima-Service“**

Das Asset sollte zeigen:

1. Telefon → Notdienstmeldung
2. WhatsApp → vollständige Serviceanfrage
3. Foto → strukturierter Fall
4. Terminwunsch → vorbereiteter Kalendereintrag
5. Anfrage → Angebotsentwurf + Follow-up

Dieses Asset passt besser als reine Rückrufnotiz, wenn wir Conversion im nächsten Batch erhöhen wollen.
