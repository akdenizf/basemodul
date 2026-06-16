# Hermes Knowledge Base — Callfolio Agent Wiki

> **Karpathy-Prinzip:** Der Agent braucht keine Prose — er braucht strukturierte, faktische Textblöcke, die er 1:1 in E-Mails und Gespräche einbauen kann. Jeder Eintrag ist ein Fakt, kein Marketing-Satz.

---

## 1. Produkt-Kerndaten (Factsheet)

```yaml
product_name: Callfolio
tagline: "Die Telefonzentrale, die niemals schläft."
category: Voice-AI SaaS für Immobilienverwaltung
founded: 2025
headquarters: München, Deutschland
founder: Fatih Akdeniz
website: callfolio.de / callfolio.io
tech_stack:
  voice_engine: Vapi (Ultra-Low Latency)
  llm: OpenAI GPT-4o
  telephony: Twilio (DE-Nummern, SMS)
  backend: Next.js + Supabase (PostgreSQL)
  hosting: Vercel (Edge)
current_version: v16.4 (System Prompt) / v12.9 (Webhook)
```

---

## 2. Pricing (verkaufsfähig)

### Tiers

| Paket | Preis | Inklusiv-Anrufe | Minutentaktung | Overage |
|---|---|---|---|---|
| **Starter** | 89 €/Monat | 100 | ❌ Keine | 0,80 €/Anruf |
| **Pro** | 199 €/Monat | 300 | ❌ Keine | 0,80 €/Anruf |
| **Enterprise** | Auf Anfrage | Unbegrenzt | ❌ Keine | Individuell |

### Setup-Gebühr
- **990 € einmalig** — individuelle KI-Konfiguration, Datenimport, Onboarding-Call
- Kein Self-Service-Setup → qualifiziert Kunden und verhindert Churn

### Verkaufsargument gegen Minutentaktung
> „Bei uns zahlen Sie pro Anruf, nicht pro Minute. Ob das Gespräch 30 Sekunden oder 8 Minuten dauert — der Preis bleibt gleich. Ihre Mieter können in Ruhe erklären, was los ist."

### Interne Kalkulation (NUR für Agent-Kontext, nie an Leads kommunizieren)
```yaml
cogs_per_call: 0.28 €  # Vapi + OpenAI + Twilio
margin_starter: 64%     # bei 100 Anrufen
margin_pro: 56%          # bei 300 Anrufen
floor_price: 54 €/Mo     # Break-even bei 100 Anrufen
```

---

## 3. Technische USPs (aus dem Code extrahiert)

Jeder USP ist ein konkretes, im Code implementiertes Feature — kein Roadmap-Item.

### USP 1: Sofortige Anrufer-Erkennung (Pre-Call Identity)
```
Quelle: _handlers/get-caller-context.ts
Was passiert: Noch BEVOR die KI den Anruf annimmt, wird die Telefonnummer 
gegen die Mieterdatenbank geprüft (Last-10-Digits Matching).
Ergebnis: "Guten Tag Frau Schmidt, ich sehe Sie wohnen in der 
Karl-Marx-Ring 17. Wie kann ich Ihnen helfen?"
Verkaufsargument: Ihre Mieter werden namentlich begrüßt — 
wie bei einem persönlichen Anruf.
```

### USP 2: Automatischer SMS-Foto-Upload (Visual Context)
```
Quelle: _handlers/submit-ticket.ts (PHOTO_REQUEST_CATEGORIES)
Was passiert: Bei technischen Kategorien (Sanitär, Heizung, Elektro, Gebäude) 
sendet das System automatisch eine SMS mit Upload-Link.
Ergebnis: Mieter fotografiert den Schaden → Foto landet direkt im 
Dashboard → Handwerker sieht den Schaden VOR der Anfahrt.
Kategorien mit Auto-SMS: PLUMBING, HEATING, ELECTRICAL, BUILDING
Verkaufsargument: "Das Telefon ist blind. Callfolio sieht hin."
```

### USP 3: Intelligente Duplikaterkennung (Follow-Up Guard)
```
Quelle: _handlers/submit-ticket.ts (summariesShareTopic)
Was passiert: Wenn ein Mieter wegen des gleichen Problems erneut anruft, 
erkennt die KI das automatisch und hängt die Info an das bestehende 
Ticket an, statt ein neues zu erstellen.
Methode: Kategorie-Match + semantische Token-Überlappung (≥2 Tokens)
Verkaufsargument: Keine doppelten Tickets. Keine doppelte Arbeit. 
Jeder Folgeanruf wird dem richtigen Vorgang zugeordnet.
```

### USP 4: SMS-Registrierung (Zero-Friction Onboarding)
```
Quelle: _handlers/request-onboarding-link.ts + ticket-update/route.ts (patch_data)
Was passiert: Unbekannte Anrufer erhalten per SMS einen Link zur 
Schnellregistrierung. Name + Adresse eingeben → Tenant-Record wird 
automatisch in der DB erstellt → beim nächsten Anruf namentlich begrüßt.
Verkaufsargument: Kein Login, kein Passwort, kein App-Download. 
Mieter werden in 30 Sekunden registriert.
```

### USP 5: 24/7 Notfall-Triage (Priority Routing)
```
Quelle: System Prompt v16.4, Section 0 + 6
Was passiert: Die KI erkennt Notfälle (Wasserrohrbruch, Gasgeruch, Stromausfall) 
und priorisiert sie automatisch als EMERGENCY/HIGH. Das Ticket wird 
mit roter Markierung im Dashboard angezeigt.
Verkaufsargument: Nachts um 3 — niemand geht ran? 
Callfolio nimmt ab und handelt.
```

### USP 6: DSGVO-konform — Keine Aufzeichnungen
```
Quelle: PROJECT_JOURNAL.md (v5.1 Decision Log)
Was passiert: Callfolio zeichnet keine Telefonate auf. Alle Daten werden 
nur als strukturierter Text (Zusammenfassung) gespeichert.
Verkaufsargument: Volle DSGVO-Konformität. Keine Audio-Recordings. 
Keine Speicherung personenbezogener Sprachdaten.
```

### USP 7: Handwerker-Beauftragung in einem Klick
```
Quelle: Contractor CRM (v6.0), Contractor Portal (v12)
Was passiert: Hausverwaltung weist Ticket einem Handwerker zu → 
automatische E-Mail an Handwerker → Handwerker bestätigt über Portal → 
Termin wird eingetragen → Mieter bekommt SMS-Benachrichtigung.
Verkaufsargument: Vom Anruf bis zur Handwerker-Beauftragung — 
ein durchgehender digitaler Prozess.
```

### USP 8: Audit-Trail / Compliance
```
Quelle: lib/audit-log.ts, ticket_activities Tabelle
Was passiert: Jede Aktion (Ticket erstellt, Status geändert, E-Mail gesendet, 
Handwerker bestätigt, Foto hochgeladen) wird mit Timestamp und Akteur 
in der Timeline protokolliert.
Verkaufsargument: Lückenlose Dokumentation — wichtig für 
Versicherungsfälle und Eigentümer-Reporting.
```

---

## 4. FAQ — Einwandbehandlung

### „Wir haben schon eine Telefonzentrale / Sekretärin"
> Callfolio ersetzt niemanden — es nimmt die Anrufe an, die sonst verloren gehen: Abends, am Wochenende, in der Mittagspause. Ihre Mitarbeiterin kann sich auf die komplexen Fälle konzentrieren.

### „KI am Telefon — das mögen unsere Mieter nicht"
> Die KI stellt sich transparent als digitaler Assistent vor (EU AI Act konform). In unseren Tests zeigen Mieter hohe Akzeptanz, weil sie endlich jemanden erreichen — statt ewig in der Warteschleife zu hängen.

### „Das ist zu teuer"
> 89 €/Monat für 100 Anrufe. Keine Minutentaktung. Eine Teilzeit-Sekretärin kostet 1.800 €/Monat und ist trotzdem nicht 24/7 erreichbar.

### „Was ist mit Datenschutz?"
> Callfolio zeichnet keine Telefonate auf. Alle Daten liegen auf EU-Servern (Supabase/Frankfurt). Die KI gibt sich zu Beginn jedes Anrufs als digitaler Assistent zu erkennen (EU AI Act Pflicht).

### „Wir verwalten nur 200 Einheiten — lohnt sich das?"
> Gerade dann. Bei 200 Einheiten klingelt das Telefon geschätzt 30-50 Mal im Monat. Jeder verpasste Anruf ist ein frustrierter Mieter und eine potenzielle Eskalation. Das Starter-Paket (89 €) ist genau dafür gemacht.

### „Was passiert bei einem echten Notfall?"
> Die KI erkennt Notfall-Keywords (Wasserrohrbruch, Gasgeruch, Stromausfall), priorisiert das Ticket automatisch als EMERGENCY und benachrichtigt die Hausverwaltung sofort per E-Mail. Optional kann ein SMS-Alert an den Bereitschaftsdienst konfiguriert werden.

### „Können wir das testen?"
> Ja — wir bieten einen Live-Demo-Anruf an. Sie rufen unsere Test-Nummer an und erleben die KI in Aktion. Dauer: 2 Minuten. Danach besprechen wir, ob es für {company} passt.

---

## 5. Branchen-Kontext (für glaubwürdige Kommunikation)

### Schmerzpunkte deutscher Hausverwaltungen
```
1. Telefonische Erreichbarkeit: #1 Beschwerde in Google Reviews
2. Personalknappheit: Fachkräftemangel trifft HV besonders hart
3. Schadensdokumentation: Mündliche Beschreibungen = Informationsverlust
4. Mieter-Erwartungen: "Amazon-Mentalität" — sofortige Reaktion erwartet
5. Handwerker-Koordination: Endlose Telefon-Ketten zwischen HV ↔ Mieter ↔ Handwerker
6. Compliance-Druck: Eigentümer verlangen Dokumentation und Transparenz
```

### Regulatorik
```
- EU AI Act: KI muss sich als KI zu erkennen geben (Callfolio tut das)
- DSGVO: Keine Aufzeichnungen, Daten auf EU-Servern, Löschfunktion vorhanden
- WEG-Reform 2020: Digitale Dokumentation wird zunehmend erwartet
```

### Marktgröße (DE)
```
- ~25.000 Hausverwaltungen in Deutschland
- ~3.500 in Bayern, ~1.200 im Großraum München
- Ø verwaltete Einheiten: 500-2.000
- Ø Anrufvolumen pro 1.000 Einheiten: ~150 Anrufe/Monat
```

---

## 6. Callfolio-Differenzierung auf einen Blick

```
┌─────────────────────────────────────────────────────────┐
│  CALLFOLIO vs. KONKURRENZ                                │
│                                                         │
│  ✅ 24/7 Voice AI          ❌ Konkurrenz: Bürozeiten    │
│  ✅ SMS-Foto-Upload        ❌ Konkurrenz: nur Text      │
│  ✅ Namentliche Begrüßung  ❌ Konkurrenz: "Wer sind Sie?"│
│  ✅ 89 €/Mo                ❌ Konkurrenz: 200-500 €     │
│  ✅ Keine Minutentaktung   ❌ Konkurrenz: Minutenpreise │
│  ✅ Handwerker-Portal      ❌ Konkurrenz: E-Mail-Chaos  │
│  ✅ Audit-Trail            ❌ Konkurrenz: Blackbox       │
│  ✅ DSGVO (keine Records)  ❌ Konkurrenz: unklar        │
│  ✅ München-Support        ❌ Konkurrenz: Remote only   │
└─────────────────────────────────────────────────────────┘
```

---

## 7. Assets für den Agenten

Diese Dateien sollten als Kontext-Dokumente in der Agent-Knowledge-Base liegen:

| Datei | Inhalt | Priorität |
|---|---|---|
| `callfolio_factsheet.txt` | Dieses Dokument (Abschnitte 1-6) | 🔴 Kritisch |
| `pricing_table.txt` | Pricing-Tiers, Setup, Overage (Abschnitt 2) | 🔴 Kritisch |
| `email_templates.txt` | Die 3 Hook-Templates aus `01_outreach_specialist.md` | 🔴 Kritisch |
| `faq_objections.txt` | Einwandbehandlung (Abschnitt 4) | 🟡 Wichtig |
| `competitor_intel.txt` | Wettbewerber-Matrix | 🟡 Wichtig |
| `industry_context.txt` | Branchendaten, Marktgröße (Abschnitt 5) | 🟢 Nice-to-have |

### Format-Regeln für Agent-Knowledge-Files
1. **Plain Text** — kein Markdown, keine HTML-Tags
2. **Fakten-First** — jeder Satz ist ein verifizierbarer Fakt
3. **Keine Marketing-Superlative** — „revolutionär", „einzigartig" verboten
4. **Max. 2.000 Tokens pro Datei** — LLM-Kontextfenster schonen
5. **Versioniert** — jede Datei hat ein `Last Updated: YYYY-MM-DD` Header
