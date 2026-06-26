# Angebot

## North Star

**basemodul.de** ist die Produktmarke für modulare KI-Assistenten.

**AGENTEQ** bleibt die Dachfirma / Enterprise-Marke im Hintergrund. AGENTEQ kann
als Trust-Layer, Absender, Impressum, E-Mail und späteres Enterprise-Angebot
auftreten, aber die aktuelle Angebotsseite soll unter **basemodul.de** laufen.

Kurz:

> basemodul.de baut KI-Module für Betriebe, die Anrufe, Termine, WhatsApp-
> Anfragen und Fotos automatisch vorqualifizieren wollen.

## Was wir verkaufen

Keine generische KI-Agenturleistung und kein riesiges SaaS-Versprechen.

Wir verkaufen konkrete Module, die einen klaren Eingangskanal oder Prozess
entlasten:

1. **Telefon-Modul**
   - nimmt Anrufe an
   - fragt Anliegen, Kontakt, Standort und Dringlichkeit ab
   - erstellt Rückrufnotiz oder Ticket

2. **Termin-Modul**
   - prüft Kalender oder freie Slots
   - bereitet Termine vor oder bestätigt sie
   - sendet Bestätigungen und Erinnerungen

3. **WhatsApp-Modul**
   - sammelt strukturierte Infos per Chat
   - stellt Rückfragen
   - übergibt die Anfrage sauber ans Team

4. **Foto-/Schaden-Modul**
   - nimmt Fotos, Fahrzeugschein, Schadenbilder oder Objektbilder entgegen
   - erkennt grob Kontext und fehlende Infos
   - erstellt strukturierte Fälle für Sachverständige, Kfz, Handwerk,
     Entrümpelung oder Servicebetriebe

5. **Notdienst-Modul**
   - erkennt dringende Fälle
   - fragt Pflichtinfos ab
   - eskaliert an Bereitschaft, Techniker oder Team

## Bewusst nicht im ersten Fokus

- keine große Mission-Control-Plattform
- kein komplexes Multi-Tenant-SaaS
- keine verbindlichen Zusagen ohne menschliche Freigabe
- keine vollautomatische Angebotserstellung als Kernangebot
- keine Hausverwaltung als neue Zielnische, weil Callfolio diese Spur bereits
  abdeckt
- keine Healthcare-/Compliance-heavy Verticals als erster Markt-Test

## Positionierung

Kunden kaufen nicht "KI". Kunden kaufen weniger verpasste Anfragen, weniger
Telefonstress und bessere Übergaben.

Gute Sprache:

> Kein Anruf mehr verloren.

> Aus WhatsApp-Chaos werden saubere Anfragen.

> Fotos rein, strukturierter Fall raus.

> Ihr Team bekommt nur noch vorsortierte Rückrufe, Termine und Notfälle.

Schlechte Sprache:

> Wir bauen autonome KI-Agenten mit Multi-Channel-Orchestrierung.

## Seitenarchitektur

Start mit einer zentralen Produktseite:

- **Startseite basemodul.de**: Übersicht über alle KI-Module

Danach schlanke Detailseiten pro Modul:

- `/telefon-modul`
- `/termin-modul`
- `/whatsapp-modul`
- `/foto-modul`
- `/notdienst-modul`

Später, wenn ein Markt-Signal zieht, eigene Nischen-Seiten:

- `/ki-telefonassistent-handwerk`
- `/ki-telefonassistent-kfz`
- `/whatsapp-schadenaufnahme-kfz`
- `/foto-assistent-sachverstaendige`
- `/notdienst-assistent-shk`

## Einstiegspakete

### Pilot

Preisidee: 500 bis 1.500 EUR Setup, danach 150 bis 399 EUR monatlich.

Für Betriebe, die ein Modul schnell testen wollen.

### Modul

Preisidee: 1.500 bis 4.000 EUR Setup, danach 300 bis 899 EUR monatlich.

Für ein sauber integriertes Modul mit echtem Betriebsflow, z. B. Telefon +
WhatsApp-Übergabe + Kalender.

### Custom

Preisidee: ab 5.000 EUR Setup, danach ab 899 EUR monatlich.

Für mehrere Module, mehrere Standorte, CRM/Kalender, Reporting, Support und
tiefe Prozesslogik.

## Aktueller Favorit für den ersten Test

**Telefon-Modul + Termin-/Notdienst-Übergabe** für Handwerk, SHK, Kfz und lokale
Servicebetriebe.

Warum:

- passt zur Callfolio-Erfahrung
- schnell demo-fähig
- sofort verständlicher Painpoint
- Vapi/Twilio/n8n/WhatsApp/Webhook-Erfahrung vorhanden
- leichter zu verkaufen als trockene Angebotsautomatisierung

## Arbeitsprinzip

Wir testen Module leichtgewichtig. Wenn ein Modul innerhalb weniger Wochen kein
Signal zeigt, wird es nicht romantisiert, sondern geparkt. Wenn ein Modul zieht,
wird es fokussiert, besser verpackt und als eigene Nischen-Seite ausgebaut.
