# basemodul.de Content-Wireframe

Stand: 2026-07-16

Dieses Wireframe beschreibt die aktuell umgesetzte Landing-Choreografie nach
dem HeyKiki-Strategie-Transfer. Detailentscheidungen stehen in:

- `docs/content/heykiki-strategy-transfer-2026-07-16.md`
- `docs/content/basemodul-landing-rebuild-plan-2026-07-16.md`
- `docs/content/basemodul-landing-choreography-2026-07-16.md`
- `web/components/landing/CLAUDE.md`

## Ziel der Seite

basemodul.de soll nicht wie eine klassische KI-Agentur wirken und nicht wie
eine HeyKiki- oder Callfolio-Kopie. Die Seite verkauft ein klares
Intake-Produktregal:

> Telefon, WhatsApp, Formulare und Fotos werden zu vollständigen Vorgängen, die
> das Team sauber weiterbearbeiten kann.

AGENTEQ bleibt im Hintergrund als Dachfirma / Trust-Layer.

## Kernbotschaft

Kleine Betriebe verlieren Zeit, Rückrufe und manchmal Aufträge, weil Kunden über
Telefon, WhatsApp, Formulare und Fotos unvollständig reinkommen.

BaseModul fragt fehlende Infos ab, markiert Dringlichkeit und übergibt daraus
einen sauberen Vorgang an das Team.

Kurz:

> Weniger Telefonchaos. Mehr vollständige Anfragen.

## Zielgruppen

Primär:

- Handwerk, SHK, Kälte/Klima, Notdienst
- Kfz-Werkstätten und Sachverständige
- Entrümpelung und lokale Servicebetriebe
- Reinigung / Facility
- inhabergeführte Betriebe mit 2 bis 30 Mitarbeitern ohne feste Rezeption

Bewusst nicht primär:

- Hausverwaltung, weil Callfolio diese Spur separat abdeckt
- Healthcare als erster Fokus, wegen Datenschutz und stärkerem Wettbewerb
- Enterprise-Konzerne mit langem Sales-Cycle

## Seitenstruktur

Dramaturgie:

> Pain → fertiger Vorgang → Beispiele → Module → Demo → Pilot

Aktuelle Reihenfolge:

1. Hero
2. RequestArtifactSection (`#beispiel`)
3. Problem
4. Use Cases
5. Module
6. Workflow
7. LiveDemo
8. VisualContext
9. Integrationen
10. Pricing / Pilot
11. FAQ
12. Abschluss-CTA

`ScrollStorySection` ist geparkt, weil sie den Ablauf doppelt und stark
telefon-only erzählt.

### 1. Hero

Zweck: In 5 Sekunden Schmerz, Nutzen und nächsten Schritt klären.

Headline:

> Weniger Telefonchaos. Mehr vollständige Anfragen.

Subline:

> BaseModul nimmt Anrufe, WhatsApp-Nachrichten, Formulare und Fotos entgegen,
> fragt fehlende Infos ab und übergibt alles sauber an Ihr Team.

Primärer CTA:

> 30-Minuten-Check buchen

Sekundärer CTA:

> Beispiel-Vorgang ansehen

Hero-Visual:

- Telefon bleibt als anschaulicher Einstieg erlaubt.
- Ergebnis muss aber als Vorgang/Rückrufnotiz mit Pflichtinfos sichtbar sein.
- Beispielhinweise wie Adresse, Rückrufnummer und Team-Übergabe stärken den
  Output statt nur die Telefonie.

### 2. Fertiger Vorgang als Beweis

Zweck: Direkt nach dem Hero zeigen, was BaseModul konkret produziert.

Section:

> So sieht eine vollständige Anfrage aus.

Das Artefakt ist der Trust-Ersatz für fehlende Logos, Presse und Testimonials.

Felder:

- Eingang
- Kontakt
- Einsatzort
- Anliegen
- Dringlichkeit
- Anhänge
- Fehlende Infos
- Nächster Schritt
- Übergabe

Beispielcharakter:

- kanal-gemischt, z. B. Anruf plus Fotos per Upload-Link
- klar als Beispiel-Vorgang, nicht als echte Kundenreferenz
- Vorher/Nachher sichtbar:
  - vorher: mehrere Nachrichten und Rückfragen
  - nachher: ein sauberer Vorgang

### 3. Problem

Zweck: Den Alltag der Zielgruppe treffen, ohne zu dramatisieren.

Kernaussage:

> Halbe Anfragen kosten Zeit, Rückrufe und manchmal Aufträge.

Painpoints:

- Telefon klingelt, während alle auf Baustelle, in Werkstatt oder unterwegs sind
- WhatsApp-Anfragen bleiben unsortiert
- Fotos kommen ohne Kontext
- Formulare oder E-Mails enthalten nicht genug Pflichtinfos
- Termine werden per Hin-und-her abgestimmt
- Notfälle landen zu spät beim richtigen Menschen

### 4. Use Cases

Zweck: Aus abstrakten Modulen konkrete Situationen machen.

Flow 1: SHK / Kälte / Notdienst

1. Kunde ruft wegen eines dringenden Problems an.
2. BaseModul fragt Adresse, Problem, Rückrufnummer und Pflichtinfos ab.
3. Dringlichkeit wird markiert.
4. Bereitschaft oder Team wird informiert.
5. Ergebnis: Notfallkarte.

Wichtig: BaseModul informiert und strukturiert. Die Entscheidung bleibt beim
Team.

Flow 2: Kfz / Gutachter / Werkstatt

1. Kunde schickt Fotos eines Schadens.
2. BaseModul fragt Fahrzeugschein, Ort, Hergang und Kontakt ab.
3. Fall wird mit Bildern und Zusammenfassung übergeben.
4. Ergebnis: Schadenfall.

Flow 3: Entrümpelung / Reinigung / Service

1. Kunde fragt per WhatsApp oder Formular an.
2. BaseModul klärt Leistung, Adresse, Umfang und Wunschzeit.
3. Team erhält eine saubere Grundlage für Rückruf oder Termin.
4. Ergebnis: Angebotsgrundlage.

Wichtig: Angebotsgrundlage heißt Vorbereitung, nicht automatische
Angebotserstellung.

### 5. Module

Zweck: Das Produktregal verständlich machen.

Framing:

> Ein Baukasten für Ihre Anfragen.

BaseModul ist kein Telefon-only-Produkt. Telefon ist häufigster Einstieg, aber
alle Module führen zum gleichen Ziel: vollständiger Vorgang, saubere Übergabe.

Module:

#### Telefon-Modul

Für Betriebe, die Anrufe verpassen.

- nimmt Anrufe an
- erkennt Anliegen
- fragt Kontaktdaten, Standort und Dringlichkeit ab
- erstellt Rückrufnotiz oder Vorgang

#### WhatsApp-/Chat-Modul

Für Betriebe, bei denen Kunden per Chat schreiben.

- sammelt strukturierte Infos
- stellt Rückfragen
- erkennt fehlende Angaben
- übergibt die Anfrage sauber ans Team

#### Foto-&-Datei-Modul

Für Betriebe, die Bilder, Schäden oder Dokumente brauchen.

- nimmt Fotos oder Dateien entgegen
- fragt Kontext ab
- verknüpft Anhang, Anliegen und Kontaktdaten
- erstellt einen strukturierten Fall

#### Termin-Modul

Für Betriebe, die Termine manuell abstimmen.

- klärt Leistung und Wunschzeit
- bereitet Termin oder Rückruf vor
- sendet Bestätigungen oder Erinnerungen, wenn im Pilot vereinbart
- reduziert Rückruf-Hin-und-her

#### Prioritäts-/Notdienst-Modul

Für Betriebe mit dringenden Fällen außerhalb normaler Bürozeiten.

- erkennt hohe Dringlichkeit
- fragt Pflichtinfos ab
- informiert Bereitschaft oder Team
- verhindert, dass Notfälle in Mailbox oder Chat verschwinden

### 6. Workflow

Zweck: Den Ablauf kanal-agnostisch in wenigen Sekunden zeigen.

Steps:

1. Anfrage kommt rein
2. Fehlende Infos werden abgefragt
3. Dringlichkeit wird markiert
4. Vorgang ans Team übergeben

Caption:

> Funktioniert für Anrufe, WhatsApp, Formulare, Fotos und Terminwünsche.

### 7. LiveDemo

Zweck: Zeigen statt nur erklären.

Framing:

> Spielen Sie einen Beispiel-Vorgang durch.

Wichtig:

- self-contained Demo, keine echte Telefonie-Integration
- nicht als "echter Ablauf" oder echte Live-Kundensituation bezeichnen
- Ergebnislabel je nach Szenario:
  - Rückrufnotiz bereit
  - Meldung übergeben
  - Vorgang bereit
  - Fotofall bereit

Demo-Szenarien:

- Rückrufnotiz
- dringende Meldung
- Terminstatus
- Foto-Übergabe

### 8. VisualContext

Zweck: Den Foto-/Datei-Spezialfall sichtbar machen.

Rolle:

- kein zweites kanonisches Artefakt
- kein allgemeiner Dashboard-Beweis
- klar abgegrenzter Spezialfall: Fotos, Anhänge, Kontext und Übergabe

### 9. Integrationen

Zweck: IT-Angst senken.

Kernaussage:

> Die Übergabe landet dort, wo Ihr Team heute arbeitet.

Beispiele:

- Telefonie / Weiterleitung
- WhatsApp
- E-Mail
- Google Calendar
- Google Sheets
- CRM oder bestehende Tools nach Bedarf
- n8n / Webhooks nur als technische Option, nicht als Hauptsprache

Integrationen sind wichtig, aber nicht Hauptnavigation. Die Navbar fokussiert:

> Beispiel, Module, Demo, Pilot, FAQ

### 10. Pricing / Pilotangebot

Zweck: Verkaufbarer Einstieg, kein harter SaaS-Sale.

Headline-Richtung:

> Erst einen Eingangskanal testen. Dann entscheiden.

Pilot:

- 30-Minuten-Check
- ein Eingangskanal
- ein Beispiel-Flow
- Übergabe ans Team
- Test mit realistischen Fällen
- ab 750 EUR Setup

Modul:

- angepasster Betriebsflow
- mehrere Übergaben oder Zusatzlogiken
- ab 1.500 EUR Setup

Custom:

- mehrere Module, Standorte, CRM/Kalender oder tiefere Regeln
- auf Anfrage

Wichtig: Keine zu reife SaaS-Planlogik, kein "Jetzt starten" als Hauptsprache.

### 11. FAQ

Zweck: Einwände vor dem Abschluss-CTA beantworten.

Fragen sollten abdecken:

- Ist BaseModul ein Callcenter oder Telefonbot?
- Muss der Assistent so tun, als wäre er ein Mensch?
- Welche Infos fragt BaseModul ab?
- Wo landet die fertige Anfrage?
- Können wir mit einem Modul starten?
- Wie schnell ist ein Pilot aktiv?
- Was passiert bei Notfällen?
- Bleibt unser Team in Kontrolle?
- Was passiert mit WhatsApp und Fotos?
- Können wir unsere bestehende Nummer behalten?
- Wie wird Datenschutz/AVV behandelt?
- Ist basemodul.de ein Produkt von AGENTEQ?

### 12. Abschluss-CTA

Zweck: Das Gespräch als nächsten Schritt verkaufen.

Headline:

> Welcher Eingangskanal kostet Sie aktuell am meisten Zeit?

Subtext:

> Wir prüfen gemeinsam, ob Telefon, WhatsApp, Fotos, Formulare oder Notdienst
> der sinnvollste erste Hebel ist.

CTA:

> 30-Minuten-Check buchen

## CTA-Logik

Ein primäres Conversion-Ziel:

> `#cta` → Cal-Link / Termin mit Fatih

Primäre CTA-Sprache:

> 30-Minuten-Check buchen

Sekundäre CTA-Sprache:

> Beispiel-Vorgang ansehen

Nicht mehr verwenden:

- Demo anfragen
- Jetzt starten
- System live testen

Sekundäre Anker führen nur vorwärts und sollen nicht vom Abschlussziel
wegziehen.

## Tonalität

Direkt, praktisch, betrieblich.

Gut:

- "vollständige Anfrage"
- "sauberer Vorgang"
- "saubere Rückrufnotiz"
- "Fotos mit Kontext"
- "Notfälle an den richtigen Menschen"
- "Ihr Team sieht, was wichtig ist"
- "30-Minuten-Check"

Nicht gut:

- "autonome Agenten"
- "AI-powered Orchestration"
- "End-to-end Digital Transformation"
- "Enterprise Workflow Intelligence"
- "klingt wie ein Mensch"
- "KI-Sekretärin fürs Handwerk"

## Was die Seite vermeiden muss

- kein Callfolio-Look als gefühlte Kopie
- keine Hausverwaltung als Modul/Zielbranche
- keine HeyKiki-Kopie über "KI-Sekretärin"
- keine erfundenen Kunden, Logos, Testimonials, Presse oder Zahlen
- keine überladene Plattform-Vision
- keine automatische Angebotserstellung, Rechnungen oder Diagnosen versprechen
- keine Notfall-Entscheidung durch KI versprechen
- kein Dashboard-Versprechen, das im MVP nicht geliefert wird
- keine medizinischen oder rechtlich sensiblen Automationsversprechen

## Verifikation

Der aktuelle Umbau wurde laut QA auf Desktop und Mobile geprüft:

- kein horizontaler Overflow
- alle Anker vorhanden
- Demo-Player funktioniert mit simulierter Wiedergabe
- Build grün
- `RequestArtifactSection` ist der zentrale Output-Beweis direkt nach Hero

Bei künftigen Änderungen:

1. `npm run build` in `web/`
2. Desktop- und Mobile-Check
3. CTA-Anker prüfen
4. Claim-Guards prüfen
