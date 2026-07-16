# HeyKiki → BaseModul Strategie-Transfer

Stand: 2026-07-16

Ziel: HeyKiki nicht kopieren, sondern die Verkaufsmaschine dahinter verstehen und sauber auf BaseModul übersetzen. Erst Strategie-Transfer, danach Landing-Umbau.

## 0. Quellen & Leitplanken

Geprüft:

- Live-Seite `https://heykiki.de/` am 2026-07-16
- `CLAUDE.md`, `README.md`, `OFFER.md`, `PLAN.md`, `WIREFRAME.md`
- `web/app/page.tsx`
- `web/components/landing/CLAUDE.md`
- BaseModul Skill-Referenz `base-modul-landing-transformation-2026-06.md`

Leitplanken:

- BaseModul bleibt horizontal: Anfrage-/Intake-System für Servicebetriebe.
- Telefon ist Speerspitze, aber nicht der ganze Produktkern.
- Keine Hausverwaltung-Lane, keine Callfolio-Kopie.
- Kein unehrliches „klingt wie ein Mensch“ als Hauptversprechen.
- Keine erfundenen Logos, Kundenstimmen, Presse oder harte ROI-Zahlen.
- AGENTEQ ist Trust-Layer, keine eigene große Konzern-Erzählung auf der Landing.

---

## 1. HeyKiki zerlegt: 10 Mechaniken, die stark sind

### 1. Hartes Pain-Framing im Hero

HeyKiki startet nicht mit „KI“ oder Feature-Liste, sondern mit Verlustangst:

> Verpasster Anruf? Verlorener Auftrag.

Das ist stark, weil es in 2 Sekunden eine wirtschaftliche Konsequenz zeigt.

**Transfer für BaseModul:**
Nicht nur „Anruf“, sondern „halbe Anfrage“ als Verlustmoment:

> Halbe Anfrage? Halber Auftrag.

oder ruhiger:

> Aus halben Anfragen werden vollständige Vorgänge.

### 2. Sofort testbarer Demo-Moment

HeyKiki lässt die Besucherin direkt eine Telefonnummer eingeben und sich anrufen lassen. Das macht das Produkt fühlbar, bevor man alles versteht.

**Transfer für BaseModul:**
BaseModul braucht einen ähnlich greifbaren Proof, aber MVP-sicher:

- Demo ansehen statt echter Live-Telefonie als Pflicht
- Beispiel-Anfrage durchspielen
- „So sieht die fertige Übergabe aus“ prominent zeigen
- optional später: Testnummer / Test-WhatsApp nach Fatih-Go

### 3. Enge Zielgruppe als Klarheits-Booster

HeyKiki sagt konsequent „Handwerk“. Dadurch wird die Seite sofort kaufbar, auch wenn die Technik breiter wäre.

**Transfer für BaseModul:**
BaseModul darf nicht beliebig wirken. Der horizontale Kern bleibt, aber die erste Sprache ist:

> Servicebetriebe, die Anrufe, WhatsApp, Fotos und Termine nicht sauber sortiert bekommen.

Beispielbranchen: SHK/Kälte/Notdienst, Kfz/Gutachter/Werkstätten, Entrümpelung/Reinigung.

### 4. Trust früh und sichtbar

HeyKiki zeigt:

- „300+ Handwerksbetriebe“
- Logos
- Medienberichte
- Testimonials
- Video-Testimonial

Das nimmt Risiko raus.

**Transfer für BaseModul:**
Nicht faken. Stattdessen andere Beweisformen:

- Beispiel-Rückrufnotiz
- Beispiel-Notfallkarte
- Beispiel-WhatsApp/Fotofall
- Demo-Screens
- transparenter Pilotablauf
- AGENTEQ als technischer Umsetzungs-/Trust-Layer

### 5. Flow-Erklärung als Story, nicht Feature-Matrix

HeyKiki zeigt „Vom Anruf zum fertigen Auftrag“ in Schritten. Das ist besser als reine Feature-Blöcke, weil man den Weg versteht.

**Transfer für BaseModul:**
BaseModul sollte den Weg von Eingang → Rückfragen → strukturierte Übergabe zeigen:

1. Kunde meldet sich per Telefon/WhatsApp/Formular/Foto.
2. BaseModul fragt fehlende Pflichtinfos ab.
3. Dringlichkeit und Kategorie werden markiert.
4. Team bekommt einen fertigen Vorgang.
5. Mensch entscheidet über Termin, Angebot, Rückruf oder Eskalation.

### 6. Kontrolle wird explizit gemacht

HeyKiki hat „Du behältst die Kontrolle“ und Freigabe-Buttons. Das beantwortet einen zentralen Einwand: „Macht die KI einfach irgendwas?“

**Transfer für BaseModul:**
Sehr wichtig. BaseModul muss klar sagen:

- Der Assistent sammelt und sortiert.
- Verbindliche Zusagen bleiben beim Team.
- Notfälle werden eskaliert.
- Angebote/Rechnungen nicht automatisch raus im MVP.

### 7. Integration ohne IT-Angst

HeyKiki sagt: „Kein neues Tool, keine doppelte Pflege.“

**Transfer für BaseModul:**
Guter Mechanismus. BaseModul-Sprache:

> Die Übergabe landet dort, wo Ihr Team heute arbeitet: E-Mail, WhatsApp, Kalender, Sheet, CRM oder Ticketliste.

Nicht mit Webhook/N8N/API führen.

### 8. Onboarding extrem einfach erzählt

HeyKiki: Nummer bekommen → Rufweiterleitung aktivieren → fertig. Das senkt Kaufangst massiv.

**Transfer für BaseModul:**
BaseModul braucht einen 4-Schritte-Pilot:

1. 30-Minuten-Check: welcher Eingangskanal nervt?
2. Beispiel-Flow festlegen.
3. Pilot mit Testnummer/Testchat/Beispielfällen bauen.
4. Zwei Wochen testen und entscheiden.

### 9. Transparente Preislogik

HeyKiki nutzt klare Monatspläne mit Minuten und Paketen. Das macht es SaaS-like und vergleichbar.

**Transfer für BaseModul:**
BaseModul ist noch eher Pilot/Service. Trotzdem sollte Preisangst reduziert werden:

- Pilot ab 750 € Setup
- monatliche Betreuung nach Umfang
- optional später Module/Pakete

Nicht direkt zu komplexe SaaS-Preis-Tabelle kopieren.

### 10. FAQ beantwortet echte Kaufängste

HeyKiki behandelt Stimme, Einrichtung, Anpassung, Datenschutz, bestehende Nummer, Kontrolle, Kosten, Gewerke.

**Transfer für BaseModul:**
FAQ muss Einwände für BaseModul beantworten:

- Klingt der Assistent ehrlich als digitaler Assistent?
- Was passiert bei Notfällen?
- Was passiert, wenn Infos fehlen?
- Welche Kanäle gehen zuerst?
- Bleibt das Team in Kontrolle?
- Wo landen Daten?
- Wie klein kann der Pilot starten?

---

## 2. BaseModul dagegengelegt

### Was wir übernehmen dürfen

| HeyKiki-Mechanik | BaseModul-Transfer |
|---|---|
| Pain-first Hero | „Weniger Telefonchaos. Mehr vollständige Anfragen.“ |
| Sofort greifbare Demo | fertige Anfragekarte / Rückrufnotiz / Fotofall zeigen |
| Enger Zielgruppen-Einstieg | Servicebetriebe statt alle KMU |
| Flow statt Feature-Liste | Eingang → Rückfrage → Übergabe |
| Kontrollversprechen | Mensch gibt Termine/Angebote/Notfälle frei |
| Simple Einrichtung | 30-Minuten-Check → Pilot → Test → Entscheidung |
| Konkrete Preisanker | Pilot ab 750 € Setup statt versteckter Agenturpreis |
| FAQ als Einwand-Maschine | Datenschutz, Kontrolle, Notfälle, bestehende Tools |

### Was gefährlich wäre

- „KI-Sekretärin fürs Handwerk“ kopieren → zu nah und zu eng.
- „Klingt wie ein Mensch“ kopieren → falsche Ethik-/Trust-Kante für BaseModul.
- „Vom Anruf bis zur Rechnung“ kopieren → zu großes Liefer-/Haftungsversprechen.
- Kundenlogos/Medien/Testimonials simulieren → No-Go.
- Monatliche SaaS-Tabelle 1:1 bauen → wirkt reifer als das Angebot aktuell ist.
- Nur Telefon verkaufen → BaseModul verliert die eigene Kante.

### BaseModuls eigene Kante

HeyKiki ist stark bei:

> Telefon + Handwerk + KI-Sekretärin + komplette Büro-/Auftragslogik.

BaseModul wird stark bei:

> Telefon, WhatsApp, Formular, Fotos und Sprachnachrichten werden zu vollständigen Vorgängen, die das Team sauber weiterbearbeiten kann.

Kernunterschied:

- HeyKiki: „Wir nehmen dir das Telefon/Büro ab.“
- BaseModul: „Wir machen aus chaotischen Eingängen saubere Arbeitsgrundlagen.“

---

## 3. Copy-Prinzipien

### Nicht so

- „KI-Sekretärin fürs Handwerk“
- „klingt wie ein Mensch“
- „vom Anruf bis zur Rechnung“
- „autonome KI-Agenten“
- „Multi-Channel-Orchestrierung“
- „End-to-end Digital Transformation“

### Sondern so

- „Aus halben Anfragen werden vollständige Vorgänge.“
- „Weniger Telefonchaos. Mehr vollständige Anfragen.“
- „Kunden melden sich. BaseModul fragt die wichtigen Infos ab.“
- „Adresse, Problem, Dringlichkeit und Rückrufnummer — alles da, bevor das Team zurückruft.“
- „Fotos rein, Reparaturfall raus.“
- „Der digitale Assistent sagt ehrlich, was er ist.“
- „Vom ersten Kontakt bis zur sauberen Übergabe.“

### Hero-Optionen

**Option A — nah am aktuellen North Star**

> Weniger Telefonchaos. Mehr vollständige Anfragen.
>
> BaseModul nimmt Anrufe, WhatsApp-Nachrichten, Formulare und Fotos entgegen, fragt fehlende Infos ab und übergibt alles sauber an Ihr Team.

**Option B — stärkerer HeyKiki-Transfer**

> Halbe Anfrage? Halber Auftrag.
>
> BaseModul macht aus Anrufen, WhatsApp-Nachrichten und Fotos vollständige Vorgänge — mit Problem, Adresse, Dringlichkeit und nächstem Schritt.

**Option C — ruhig/professionell**

> Aus Kundenanfragen werden fertige Vorgänge.
>
> Der digitale Assistent für Servicebetriebe: fragt nach, sortiert vor und übergibt Telefon-, WhatsApp- und Fotofälle sauber ans Team.

Empfehlung: **Option A** als sicherer Hero, **Option B** als Test-Hook für Outreach/Ads/Follow-up-Assets.

### Kernclaim

> BaseModul macht aus chaotischen Kundenanfragen vollständige Vorgänge für Ihr Team.

### 3 Subclaims

1. **Telefon entlasten** — Anrufe annehmen, Anliegen und Dringlichkeit erfassen, Rückrufnotiz vorbereiten.
2. **WhatsApp & Fotos strukturieren** — Bilder und Nachrichten mit Kontext einsammeln statt Chat-Chaos.
3. **Sauber übergeben** — Vorgang landet mit Pflichtinfos im passenden Tool oder direkt beim richtigen Menschen.

### CTA-Sprache

Primär:

- „Demo anfragen“
- „30-Minuten-Check buchen“
- „Pilot prüfen“

Sekundär:

- „Beispiel-Vorgang ansehen“
- „Module ansehen“
- „So funktioniert die Übergabe“

Nicht primär:

- „Jetzt starten“ als SaaS-Haupt-CTA, solange Pilot/Service verkauft wird.

---

## 4. Neuer Landing-Wireframe

### 1. Hero: harter Pain + klare Produktdefinition

Headline: „Weniger Telefonchaos. Mehr vollständige Anfragen.“

Subline: BaseModul nimmt Anrufe, WhatsApp, Formulare und Fotos entgegen, fragt fehlende Infos ab und übergibt alles sauber ans Team.

Visual: links Eingangskanäle, rechts fertige Vorgangskarte.

CTA: „Demo anfragen“ + „Beispiel ansehen“.

### 2. So sieht eine fertige Anfrage aus

Vor den Modulen direkt den Output zeigen:

- Name / Kontakt
- Adresse / Einsatzort
- Problem
- Dringlichkeit
- Fotos / Anhänge
- fehlende Infos
- empfohlener nächster Schritt

Das ist BaseModuls stärkster Proof-Ersatz für Logos.

### 3. Drei Beispiel-Flows

1. SHK/Kälte/Notdienst: Anruf → Pflichtinfos → Notfallkarte → Eskalation.
2. Kfz/Gutachter/Werkstatt: Fotos → Rückfragen → Schadenfall → Rückruf/Termin.
3. Reinigung/Entrümpelung/Service: WhatsApp/Formular → Leistungsumfang → Terminvorbereitung.

### 4. Modul-Baukasten

Nicht fünf gleich laute Produkte, sondern ein Baukasten um den fertigen Vorgang:

- Telefon-Modul
- WhatsApp-/Chat-Modul
- Foto-&-Datei-Modul
- Termin-Modul
- Prioritäts-/Notdienst-Modul

Copy: „Starten Sie mit einem Modul. Kombinieren Sie, was Ihr Betrieb braucht.“

### 5. Kontrolle & Datenschutz

Kernbotschaft:

> Der Assistent bereitet vor. Ihr Team entscheidet.

Punkte:

- digitale Assistenz wird transparent benannt
- keine verbindlichen Zusagen ohne Freigabe
- Notfälle an Menschen
- DSGVO/AVV im Pilot klären
- Daten nur in vereinbarten Tools

### 6. Pilot-Angebot

Statt SaaS-Preistabelle:

- 30-Minuten-Check
- erster Flow
- Demo/Testnummer/Testchat
- Übergabe ans Team
- 2 Wochen Pilot
- Entscheidung

Preisanker: „Pilot ab 750 € Setup, danach monatliche Betreuung nach Umfang.“

### 7. Integrationen ohne IT-Angst

Sprache:

> Kein neues System erzwingen. Die Übergabe landet dort, wo Ihr Team arbeitet.

Beispiele: E-Mail, WhatsApp, Google Calendar, Sheets, CRM, Ticketliste, Drive.

### 8. Onboarding in 4 Schritten

1. Eingangskanal wählen.
2. Pflichtinfos definieren.
3. Übergabeformat bauen.
4. Mit echten oder realistischen Fällen testen.

### 9. FAQ

Siehe FAQ-Fragen aus Abschnitt 6 unten.

### 10. Abschluss-CTA

Headline:

> Welcher Eingangskanal kostet Sie aktuell am meisten Zeit?

CTA:

> 30-Minuten-Check buchen

Subtext:

> Wir prüfen gemeinsam, ob Telefon, WhatsApp, Fotos oder Notdienst der sinnvollste erste Hebel ist.

---

## 5. Beweisstrategie ohne erfundene Claims

HeyKiki hat Logos, Presse und echte Testimonials. BaseModul braucht Beweise, die wir selbst erzeugen können, ohne so zu tun, als gäbe es schon 300 Kunden.

### Sofort nutzbare Beweise

1. **Beispiel-Rückrufnotiz**
   - Anrufer, Anliegen, Adresse, Dringlichkeit, Rückrufnummer, nächster Schritt.

2. **Beispiel-Notfallkarte**
   - SHK/Kälte: Problem, Gefahr, Absperrung, Standort, Bereitschaftskontakt.

3. **Beispiel-WhatsApp-/Fotofall**
   - Fotos + fehlende Angaben + strukturierter Reparaturfall.

4. **Demo-Screen**
   - Vorher: Chat/Anruf/Fotos fragmentiert.
   - Nachher: ein Vorgang.

5. **Pilotpreis + Ablauf**
   - transparent, kein „Preis auf Anfrage“-Nebel.

6. **AGENTEQ Trust-Layer**
   - technische Umsetzung, Datenschutz-/AVV-Haltung, menschliche Freigabe.

### Später ergänzen

- anonymisierte Pilotbeispiele
- echte Vorher/Nachher-Screens
- kurze Loom-/Demo-Videos
- Kundenzitate nur nach echter Freigabe
- branchenspezifische Landing-Varianten

---

## 6. FAQ-/Einwand-Maschine für BaseModul

Empfohlene FAQ-Fragen:

1. Ist BaseModul ein Callcenter oder ein Telefonbot?
2. Muss der Assistent so tun, als wäre er ein Mensch?
3. Was passiert bei Notfällen?
4. Welche Infos fragt BaseModul ab?
5. Kann BaseModul mit WhatsApp und Fotos umgehen?
6. Wo landet die fertige Anfrage?
7. Können wir mit nur einem Modul starten?
8. Wie lange dauert ein Pilot?
9. Was kostet ein erster Pilot?
10. Was passiert, wenn der Assistent etwas nicht versteht?
11. Bleibt unser Team in Kontrolle?
12. Wie wird Datenschutz/AVV behandelt?

---

## 7. Konkreter Umsetzungsplan nach dem Strategie-Transfer

### Phase 1 — Content-Spec finalisieren

Artefakte:

- dieses Dokument als Strategie-Transfer
- aktualisiertes `WIREFRAME.md` oder eigener Landing-Umbauplan
- Copy-Draft pro Sektion

Entscheidung vor Umsetzung:

- Hero A, B oder C
- Preis sichtbar ja/nein
- Demo-Fokus: Telefon zuerst oder fertiger Vorgang zuerst

### Phase 2 — Landing-Struktur anpassen

Betroffene Sektionen aus `web/app/page.tsx` und `web/components/landing/*`:

- `HeroSection`: breiter als Telefon, aber Telefonchaos als Hook behalten
- `ProblemSection`: halbe Anfragen über Telefon/WhatsApp/Fotos statt nur verpasste Anrufe
- neue/angepasste Output-Sektion: „So sieht eine fertige Anfrage aus“
- `ModulesSection`: Baukasten klarer, nicht nur Voice-Erweiterung
- `UseCasesSection`/`WorkflowSection`: 3 Beispiel-Flows nach oben ziehen
- `PricingSection`: SaaS-Planlogik prüfen, ggf. auf Pilot-Angebot umstellen
- `FaqSection`: Einwand-Maschine ersetzen
- `LetsWorkTogether`: 30-Minuten-Check als Abschluss

### Phase 3 — Was bleibt

- Dark Premium Design
- Modul-Logik
- LiveDemoSection als self-contained Demo
- AGENTEQ als Trust-Layer
- Fokus Servicebetriebe

### Phase 4 — Was raus oder runter muss

- zu enge „KI-Telefonassistent“-Only-Sprache, wenn sie BaseModul verengt
- zu große SaaS-/Plattformversprechen
- jede Hausverwaltungs-Assoziation
- erfundene Trust-Signale
- „klingt wie Mensch“-Versprechen

### Phase 5 — Verifikation

Nach Umsetzung:

1. `npm run build` in `web/`
2. Landing lokal starten
3. Browser-Check: Hero, Output-Beweis, Modulfluss, FAQ, CTAs
4. Prüfen: keine Hausverwaltung, keine Callfolio-Secrets, keine falschen Unternehmensbezeichnungen

---

## 8. Empfehlung: nächster Hook

Nicht direkt blind umbauen.

Nächster sinnvoller Schritt:

> Einen kompakten Landing-Umbauplan aus diesem Transfer ableiten: konkrete Sektionen, neue Copy, bestehende Komponenten, was bleibt/rauskommt — danach erst Code.

Wenn schnell getestet werden soll: zuerst Hero + Output-Beweis + Pilot-CTA ändern, nicht die ganze Seite neu erfinden.
