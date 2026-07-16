# BaseModul Landing-Umbauplan nach HeyKiki-Transfer

Stand: 2026-07-16

Ziel: Aus dem Strategie-Transfer zu HeyKiki einen konkreten, umsetzbaren
Landing-Umbauplan ableiten. Nicht die Seite neu erfinden, sondern die vorhandene
BaseModul-Landing schärfen: früherer Proof, klarere Anfrage-Logik, weniger
Telefon-only-Framing, stärkerer Pilot-CTA.

## 0. Geprüfte Quellen

- `docs/content/heykiki-strategy-transfer-2026-07-16.md`
- `CLAUDE.md`
- `OFFER.md`
- `PLAN.md`
- `WIREFRAME.md`
- `web/components/landing/CLAUDE.md`
- `web/app/page.tsx`
- aktuelle Landing-Komponenten unter `web/components/landing/`

Hinweis: `web/components/landing/CLAUDE.md` ist bei der gerenderten
Sektions-Reihenfolge nicht mehr vollständig synchron mit `web/app/page.tsx`.
Der Umbau soll sich an `page.tsx` orientieren und danach die lokale
Landing-Doku korrigieren.

## 1. Strategische Entscheidung

BaseModul soll nicht wie eine HeyKiki-Kopie wirken.

HeyKiki steht für:

> KI-Sekretärin fürs Handwerk, Telefon zuerst, komplette Büro-Entlastung.

BaseModul soll stehen für:

> Telefon, WhatsApp, Formulare und Fotos werden zu vollständigen Vorgängen, die
> das Team sauber weiterbearbeiten kann.

Der stärkste Landing-Satz bleibt:

> Weniger Telefonchaos. Mehr vollständige Anfragen.

Als interne Nordstern-Formulierung:

> BaseModul macht aus chaotischen Kundenanfragen vollständige Vorgänge für Ihr
> Team.

## 2. Was aus HeyKiki übernommen wird

Übernehmen:

- Pain-first Hero statt Produktbeschreibung.
- Sofort sichtbarer Demo-/Proof-Moment.
- Flow-Erklärung statt Feature-Matrix.
- Einfache Einrichtung ohne IT-Angst.
- Kontrolle/Freigabe explizit machen.
- Pilot und Preise sichtbar genug machen.
- FAQ als Einwand-Maschine nutzen.

Nicht übernehmen:

- "KI-Sekretärin" als Hauptbegriff.
- "klingt wie ein Mensch" oder ähnliche Tarnungs-Claims.
- "vom Anruf bis zur Rechnung" als Lieferumfang.
- erfundene Logos, Kundenzahlen, Testimonials oder Presse.
- eine zu reife SaaS-Preislogik, die den Pilotstatus überdeckt.

## 3. Aktueller Zustand der Landing

Gerendete Reihenfolge in `web/app/page.tsx`:

1. `Navbar`
2. `HeroSection`
3. `ProblemSection`
4. `StorySeam`
5. `ModulesSection`
6. `StorySeam`
7. `UseCasesSection`
8. `StorySeam`
9. `WorkflowSection`
10. `StorySeam`
11. `ScrollStorySection`
12. `StorySeam`
13. `LiveDemoSection`
14. `StorySeam`
15. `VisualContextSection`
16. `StorySeam`
17. `IntegrationsSection`
18. `PricingSection`
19. `LetsWorkTogether`
20. `FaqSection`
21. `Footer`
22. `FloatingCta`

Was schon gut ist:

- Dark-Premium-Richtung ist konsistent genug.
- Hero spricht bereits von chaotischen Anfragen und fertigen Arbeitsaufträgen.
- ProblemSection deckt Telefon, WhatsApp und Dringlichkeit ab.
- ModulesSection erklärt den Baukasten.
- UseCasesSection hat passende Praxisbeispiele.
- PricingSection enthält bereits Pilot/Modul/Custom.
- FAQ behandelt wichtige Einwände.
- Abschluss-CTA mit Fatih/AGENTEQ ist glaubwürdig.

Hauptproblem:

Der stärkste Proof kommt noch nicht früh genug. Die Seite spricht über Module,
bevor sie sehr deutlich zeigt, wie eine fertige Anfrage aussieht.

## 4. Neue Zielstruktur

Empfohlene Reihenfolge:

1. `Navbar`
2. `HeroSection`
3. neue oder umgebaute Output-Sektion: `RequestArtifactSection`
4. `ProblemSection`
5. `UseCasesSection`
6. `ModulesSection`
7. `WorkflowSection`
8. `LiveDemoSection`
9. `VisualContextSection`
10. `IntegrationsSection`
11. `PricingSection`
12. `FaqSection`
13. `LetsWorkTogether`
14. `Footer`
15. `FloatingCta`

Warum:

- Erst der Nutzen: weniger Chaos, vollständige Anfrage.
- Dann der Beweis: so sieht die fertige Übergabe aus.
- Danach die Schmerzen und Beispiel-Flows.
- Erst dann der Baukasten.
- Preis und FAQ später, aber vor dem finalen CTA oder direkt danach.

Optional: `StorySeam` kann zwischen großen Blöcken bleiben, sollte aber nicht
jede Sektion künstlich trennen, wenn die Seite dadurch langatmig wird.

## 5. Konkrete Komponenten-Entscheidungen

### `HeroSection`

Status: behalten, gezielt schärfen.

Ändern:

- Headline auf den neuen Favoriten setzen:
  `Weniger Telefonchaos. Mehr vollständige Anfragen.`
- Subline breiter machen:
  `BaseModul nimmt Anrufe, WhatsApp-Nachrichten, Formulare und Fotos entgegen,
  fragt fehlende Infos ab und übergibt alles sauber an Ihr Team.`
- Primär-CTA von `System live testen` zu `Demo anfragen` oder
  `30-Minuten-Check buchen` ändern.
- Sekundär-CTA zu `Beispiel-Vorgang ansehen` ändern und auf neue
  Output-Sektion verlinken.
- Hero-Visual nicht nur als Telefon darstellen, sondern stärker als
  fertige Vorgangskarte/Rückrufnotiz mit Pflichtinfos.

Behalten:

- Zielgruppen-Pill `Für lokale Servicebetriebe`.
- DSGVO/Server-Hinweis, aber ohne zu starken Trust-Overclaim.
- Dark-Premium-Sprache und grünen Akzent.

### Neue `RequestArtifactSection`

Status: neu bauen oder aus bestehenden Artefakt-Elementen extrahieren.

Zweck:

HeyKiki hat Logos/Presse. BaseModul zeigt stattdessen den Output.

Inhalt:

- Headline: `So sieht eine vollständige Anfrage aus.`
- Subline: `Nicht nur ein Anruf, nicht nur ein Chat: ein Vorgang mit den Infos,
  die Ihr Team zum Weiterarbeiten braucht.`
- Zentrales Artefakt als Card:
  - Kunde/Kontakt
  - Eingangskanal
  - Anliegen
  - Adresse/Einsatzort
  - Dringlichkeit
  - Anhänge/Fotos
  - fehlende Infos
  - nächster Schritt
  - Übergabe an Team/Bereitschaft
- Kleine Vorher/Nachher-Zeile:
  `Vorher: 7 Nachrichten, 3 Rückfragen.`
  `Nachher: ein sauberer Vorgang.`

Design:

- Keine nested Cards in Card.
- Ein großes, scanbares Arbeitsartefakt.
- Mobile zuerst: Felder stapeln, keine Mini-Schrift.

### `ProblemSection`

Status: behalten, minimal schärfen.

Ändern:

- Headline optional:
  `Halbe Anfragen kosten Zeit, Rückrufe und manchmal Aufträge.`
- Problemkarten um `Formular/E-Mail` ergänzen oder vorhandene drei Karten
  beibehalten und Text stärker auf "unvollständig" drehen.
- Nicht dramatisieren, sondern Alltagssprache:
  `Adresse fehlt`, `Foto ohne Kontext`, `Dringlichkeit unklar`.

### `UseCasesSection`

Status: behalten, nach oben ziehen.

Ändern:

- Die drei Praxisbeispiele bleiben: SHK/Notdienst, Kfz/Fotos, Entrümpelung.
- Copy an Claim Guards anpassen:
  - Keine automatische Angebotserstellung versprechen.
  - `Angebotsgrundlage` ist ok, aber klar als Vorbereitung.
  - Bei Notdienst: `informiert Bereitschaft`, nicht `entscheidet`.
- Jede Karte soll mit einem konkreten Artefakt enden:
  `Notfallkarte`, `Schadenfall`, `Termin-/Rückrufgrundlage`.

### `ModulesSection`

Status: behalten, aber weniger Telefon-Hierarchie.

Problem:

Aktuell ist Telefon-Modul der Kern und alle anderen sind Erweiterungen. Das ist
für die Speerspitze gut, kann aber BaseModul zu nah an HeyKiki ziehen.

Ändern:

- Text: `Ein Baukasten für Ihre Anfragen. Starten Sie mit dem Eingangskanal, der
  aktuell am meisten Zeit kostet.`
- Telefon darf erster Einstieg bleiben, aber nicht das einzige Kernmodul sein.
- Die fünf Module gleichwertiger als Wege zum selben Output zeigen:
  vollständiger Vorgang.
- Ergebnis-Label von `Rückrufnotiz` auf variableres `Vorgang` oder
  `Übergabe` erweitern.

### `WorkflowSection`

Status: behalten, aber allgemeiner machen.

Ändern:

- Aktuell stark Notdienst-Anruf. Besser:
  `Anfrage kommt rein → fehlende Infos werden abgefragt → Dringlichkeit markiert
  → Vorgang ans Team übergeben`.
- Caption:
  `Funktioniert für Anrufe, WhatsApp, Formulare, Fotos und Terminwünsche.`

### `ScrollStorySection`

Status: prüfen, nicht automatisch behalten.

Entscheidung:

- Wenn die Sektion den gleichen Ablauf noch einmal lang erzählt, kürzen oder
  später parken.
- Wenn sie stark visuell erklärt, kann sie nach `WorkflowSection` bleiben.
- Ziel: keine doppelte "so funktioniert's"-Strecke.

### `LiveDemoSection`

Status: behalten, Copy schärfen.

Ändern:

- Heading von `Hören Sie einen echten Ablauf` auf
  `Spielen Sie einen Beispiel-Vorgang durch.`
- Nicht `echter Ablauf`, wenn Demo simuliert/self-contained ist.
- Szenarien stärker auf Ergebnis benennen:
  - `Rückrufnotiz`
  - `Dringende Meldung`
  - `Terminstatus`
  - `Foto-Übergabe`
- Ergebnis im Phone nicht immer `Rückrufnotiz bereit`, sondern je nach Szenario:
  `Vorgang bereit`, `Notfallkarte bereit`, `Fotofall bereit`.

### `VisualContextSection`

Status: prüfen.

Aufgabe:

- Muss entweder den Output-Beweis stärken oder raus.
- Keine rein dekorative Sektion.
- Falls die Sektion Integrationen/Übergabe visualisiert, behalten.

### `IntegrationsSection`

Status: behalten.

Ändern:

- Sprache ohne IT-Angst:
  `Die Übergabe landet dort, wo Ihr Team heute arbeitet.`
- Beispiele: E-Mail, WhatsApp, Kalender, Sheets, CRM/Ticketliste.
- Nicht mit n8n/Webhooks führen; das bleibt optional/technisch.

### `PricingSection`

Status: behalten, leicht vereinfachen.

Behalten:

- Pilot ab 750 EUR.
- Modul ab 1.500 EUR.
- Custom auf Anfrage.

Ändern:

- Headline stärker nach Risiko-Umkehr:
  `Erst einen Eingangskanal testen. Dann entscheiden.`
- Pilot-Features auf die neue Story drehen:
  - 30-Minuten-Check
  - ein Eingangskanal
  - ein Beispiel-Flow
  - eine Übergabe ans Team
  - Test mit realistischen Fällen
- SaaS-artigen Eindruck vermeiden: kein "jetzt starten", keine zu harten
  Monatsplan-Vergleiche.

### `FaqSection`

Status: behalten, erweitern.

Ergänzen:

- `Ist BaseModul ein Callcenter oder ein Telefonbot?`
- `Muss der Assistent so tun, als wäre er ein Mensch?`
- `Welche Infos fragt BaseModul ab?`
- `Wo landet die fertige Anfrage?`
- `Bleibt unser Team in Kontrolle?`
- `Wie wird Datenschutz/AVV behandelt?`

Behalten:

- Module einzeln startbar.
- Pilotdauer.
- Notfälle.
- bestehende Nummer.
- WhatsApp/Fotos.
- AGENTEQ Trust-Layer.

### `LetsWorkTogether`

Status: behalten, Copy schärfen.

Ändern:

- Headline:
  `Welcher Eingangskanal kostet Sie aktuell am meisten Zeit?`
- Text:
  `Wir prüfen gemeinsam, ob Telefon, WhatsApp, Fotos, Formulare oder Notdienst
  der sinnvollste erste Hebel ist.`
- CTA:
  `30-Minuten-Check buchen`

### `FloatingCta`

Status: prüfen.

Ändern:

- CTA nicht `Jetzt starten`, sondern `30-Minuten-Check` oder `Demo anfragen`.
- Keine aggressive SaaS-Sprache.

### `Navbar` und `Footer`

Status: prüfen.

Ändern:

- Navigation an neue Reihenfolge anpassen:
  `Beispiel`, `Module`, `Demo`, `Pilot`, `FAQ`.
- AGENTEQ im Footer als Trust-Layer, nicht als Hauptmarke.
- Keine Hausverwaltung/Callfolio-Bezüge.

## 6. Copy-Spezifikation pro Abschnitt

### Hero

Headline:

> Weniger Telefonchaos. Mehr vollständige Anfragen.

Subline:

> BaseModul nimmt Anrufe, WhatsApp-Nachrichten, Formulare und Fotos entgegen,
> fragt fehlende Infos ab und übergibt alles sauber an Ihr Team.

CTA primär:

> 30-Minuten-Check buchen

CTA sekundär:

> Beispiel-Vorgang ansehen

### Output-Beweis

Headline:

> So sieht eine vollständige Anfrage aus.

Subline:

> BaseModul sammelt die Pflichtinfos ein, markiert Dringlichkeit und übergibt
> den Vorgang dort, wo Ihr Team weiterarbeitet.

Artefakt-Labels:

- Eingang
- Kontakt
- Einsatzort
- Anliegen
- Dringlichkeit
- Anhänge
- Fehlende Infos
- Nächster Schritt
- Übergabe

### Module

Headline:

> Ein Baukasten für Ihre Anfragen.

Subline:

> Starten Sie mit dem Eingangskanal, der gerade am meisten Zeit kostet. Weitere
> Module lassen sich später kombinieren.

### Pilot

Headline:

> Erst einen Eingangskanal testen. Dann entscheiden.

Subline:

> Wir bauen einen schlanken Piloten, testen ihn mit realistischen Fällen und
> zeigen, ob die Übergabe im Alltag wirklich entlastet.

### Abschluss

Headline:

> Welcher Eingangskanal kostet Sie aktuell am meisten Zeit?

CTA:

> 30-Minuten-Check buchen

## 7. Umsetzungsphasen

### Phase 1 — Hoher Hebel, wenig Risiko

Ziel: HeyKiki-Verkaufslogik übertragen, ohne die ganze Seite umzubauen.

Änderungen:

1. Hero-Copy und CTA anpassen.
2. `RequestArtifactSection` bauen.
3. `RequestArtifactSection` direkt nach Hero einsetzen.
4. `WorkflowSection` allgemeiner formulieren.
5. `LiveDemoSection` von "echter Ablauf" auf "Beispiel-Vorgang" drehen.
6. Abschluss-CTA auf 30-Minuten-Check schärfen.

Ergebnis:

Die Seite erklärt sofort den Schmerz, zeigt sofort den Output und bleibt
MVP-ehrlich.

### Phase 2 — Struktur und Einwände

Änderungen:

1. Use Cases näher an den Anfang ziehen.
2. ModulesSection weniger telefon-only formulieren.
3. PricingSection auf Eingangskanal/Pilot statt Planlogik schärfen.
4. FAQ auf 10-12 echte Einwände erweitern.
5. Navbar/Floating CTA an neue Begriffe anpassen.

Ergebnis:

Mehr Klarheit, weniger HeyKiki-Nähe, stärkere Kaufargumente.

### Phase 3 — Politur und Doku

Änderungen:

1. `web/components/landing/CLAUDE.md` mit tatsächlicher Reihenfolge syncen.
2. `WIREFRAME.md` optional auf neue Zielstruktur aktualisieren.
3. ScrollStory/VisualContext prüfen und bei Dopplung kürzen/parken.
4. Mobile Layouts auf Textüberläufe und Artefakt-Lesbarkeit prüfen.
5. Build und Browser-QA.

Ergebnis:

Die Landing ist nicht nur strategisch, sondern auch im Repo-Gedächtnis sauber.

## 8. Verifikation nach Umsetzung

Pflicht:

1. `npm run build` im `web/`-Verzeichnis.
2. Lokalen Server starten.
3. Desktop- und Mobile-Check:
   - Hero lesbar.
   - Output-Artefakt direkt sichtbar.
   - CTAs funktionieren.
   - keine Textüberläufe.
   - LiveDemo spielt oder fällt sauber zurück.
4. Content-Guard:
   - keine Hausverwaltung.
   - kein Callfolio.
   - keine erfundenen Kunden/Logos/Testimonials.
   - kein "klingt wie Mensch".
   - keine automatischen Angebote/Rechnungen/Diagnosen.
   - Notfälle bleiben menschlich freigegeben.

Optional:

- Screenshot-Vergleich nach Desktop/Mobile.
- Lighthouse nur als grober Check, nicht als Design-Entscheider.

## 9. Reihenfolge für den nächsten Code-Turn

Empfohlene erste Umsetzung:

1. Neue `RequestArtifactSection.tsx` erstellen.
2. `HeroSection.tsx` Copy/CTAs anpassen.
3. `web/app/page.tsx` neue Sektion nach Hero einfügen.
4. `WorkflowSection.tsx` allgemeiner formulieren.
5. `LiveDemoSection.tsx` Demo-Claims entschärfen.
6. `LetsWorkTogether.tsx` auf 30-Minuten-Check drehen.
7. Build ausführen.

Nicht im ersten Code-Turn:

- komplette Design-Neuinterpretation.
- neue Animationen als Selbstzweck.
- echte Telefon-/WhatsApp-Integration.
- Testimonials/Logos/Presse.
- neue Detailseiten.

## 10. Kurzfassung

Die aktuelle Landing ist nicht falsch. Sie braucht eine andere Dramaturgie:

> Pain → fertiger Vorgang → Beispiele → Module → Demo → Pilot.

Das ist der sauberste Transfer aus HeyKiki: nicht "KI-Sekretärin" kopieren,
sondern die Klarheit, den frühen Proof und die einfache Kaufentscheidung.
