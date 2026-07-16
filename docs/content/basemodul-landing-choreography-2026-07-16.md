# BaseModul Landing-Choreografie — finale Sektionsentscheidung

Stand: 2026-07-16

Grundlage: `docs/content/heykiki-strategy-transfer-2026-07-16.md`,
`docs/content/basemodul-landing-rebuild-plan-2026-07-16.md`, `WIREFRAME.md`,
`web/app/page.tsx` und alle dort verwendeten Komponenten (gelesen am
2026-07-16).

Dieses Dokument ist die **Entscheidung**, nicht die Diskussion. Wo der
Umbauplan noch "prüfen" sagte, steht hier ein Verdict.

---

## 1. Ausgangslage

Aktuell gerenderte Reihenfolge (`web/app/page.tsx`):

```
Navbar → HeroSection → ProblemSection → ModulesSection → UseCasesSection
→ WorkflowSection → ScrollStorySection → LiveDemoSection
→ VisualContextSection → IntegrationsSection → PricingSection
→ LetsWorkTogether → FaqSection → Footer → FloatingCta
(+ StorySeam zwischen fast allen Blöcken)
```

Drei strukturelle Probleme:

1. **Der Proof kommt zu spät.** Die Seite redet über Module (Sektion 3),
   bevor sie zeigt, wie das Ergebnis aussieht. Der stärkste Beweis — der
   fertige Vorgang — existiert nur verstreut als Mini-Artefakt in
   `ModulesSection` (Rückrufnotiz), `VisualContextSection` (Übergabekarte)
   und `LiveDemoSection` (finalResult).
2. **Der Ablauf wird doppelt erzählt.** `WorkflowSection` (4 Chips, "in fünf
   Sekunden") und `ScrollStorySection` (5 Steps, ~290dvh Sticky-Scroll)
   erklären denselben Weg. Die Workflow-Caption verweist sogar explizit auf
   die Story ("Den Schritt für Schritt zeigt gleich die Story").
3. **Telefon-only-Drift.** Hero-Visual (eingehender Anruf), ScrollStory
   ("Aktiver Anruf"), LiveDemo-Begrüßung ("Telefon-Modul von basemodul.de")
   und Modules-Hierarchie (Telefon = Kern, Rest = Erweiterung) ziehen die
   Seite Richtung HeyKiki-Territorium ("KI-Telefonassistent"), obwohl
   BaseModul horizontal positioniert ist.

Was bereits stimmt und nicht angefasst wird: Dark-Premium-Design,
Pilot-Preisanker (750 €), ehrliche Trust-Signale (kein Logo-Fake), AGENTEQ
als leiser Trust-Layer, self-contained Demo ohne Backend.

---

## 2. Finale Seitenreihenfolge

Dramaturgie: **Pain → fertiger Vorgang → Beispiele → Module → Demo → Pilot**

| # | Sektion | Status | Rolle in der Verkaufslogik |
|---|---|---|---|
| — | `Navbar` | anpassen | Orientierung, 1 Conversion-CTA |
| 1 | `HeroSection` | umschreiben | Pain-Hook + Produktdefinition in 5 Sek. |
| 2 | `RequestArtifactSection` | **NEU** | Der Beweis: so sieht der Output aus |
| 3 | `ProblemSection` | leicht schärfen | Pain vertiefen: "das kennen Sie" |
| 4 | `UseCasesSection` | verschieben + schärfen | Pain → Lösung in 3 Branchen-Szenen |
| 5 | `ModulesSection` | umschreiben | Kaufstruktur: Baukasten, ein Einstieg |
| 6 | `WorkflowSection` | umschreiben | Der Mechanismus in 4 Schritten, kanal-agnostisch |
| 7 | `LiveDemoSection` | Copy entschärfen | Erlebbarer Beweis: Beispiel-Vorgang durchspielen |
| 8 | `VisualContextSection` | minimal anpassen | Zweiter Beweis: Foto/Datei-Spezialfall |
| 9 | `IntegrationsSection` | bleibt | Einwand "neues Tool?" entkräften |
| 10 | `PricingSection` | Copy schärfen | Risiko-Umkehr: kleiner Pilot, klarer Preis |
| 11 | `FaqSection` | **verschieben** (vor CTA) + erweitern | Restliche Einwände vor der Entscheidung räumen |
| 12 | `LetsWorkTogether` | umschreiben | Conversion: 30-Minuten-Check |
| — | `Footer` | bleibt | Trust-Layer AGENTEQ, Recht |
| — | `FloatingCta` | Text anpassen | Conversion immer erreichbar |
| ✗ | `ScrollStorySection` | **parken** | entfällt (siehe Abschnitt 5) |
| ~ | `StorySeam` | reduzieren auf 3 | Rhythmus, kein Dauerornament |

`StorySeam` nur noch an drei Nahtstellen: nach `ProblemSection` (Pain →
Beispiele), nach `WorkflowSection` (Mechanik → Demo) und vor
`PricingSection` (Beweis → Angebot).

Wichtig bei der Umsetzung: Die Eyebrow-Nummerierung ("01 — Problem",
"02 — Die Module" …) muss auf die neue Reihenfolge umgezogen werden, sonst
zählt die Seite falsch.

---

## 3. Sektion-für-Sektion Entscheidung

### Navbar — anpassen

Links neu (Verkaufslogik statt Vollständigkeit, max. 5):
`Beispiel (#beispiel)` · `Module (#modules)` · `Demo (#livedemo)` ·
`Pilot (#pricing)` · `FAQ (#faq)`.

`Integrationen` und `Ablauf` fliegen aus der Nav — beide Sektionen bleiben
auf der Seite, sind aber keine Kaufentscheidungs-Anker. Nav-CTA:
`30-Minuten-Check` → `#cta`. Scroll-Spy-IDs entsprechend aktualisieren.

### 1. HeroSection — umschreiben

**Rolle:** In 5 Sekunden Pain + Produktdefinition. Kein Feature, kein "KI".

- Headline: **"Weniger Telefonchaos. Mehr vollständige Anfragen."**
- Subline: "BaseModul nimmt Anrufe, WhatsApp-Nachrichten, Formulare und
  Fotos entgegen, fragt fehlende Infos ab und übergibt alles sauber an Ihr
  Team."
- CTA primär: `30-Minuten-Check buchen` → `#cta`
- CTA sekundär: `Beispiel-Vorgang ansehen` → `#beispiel`
- Pill "Für lokale Servicebetriebe" und DSGVO-Zeile bleiben.
- Visual: Phone-Mockup bleibt (kein Neubau), aber der Ergebnis-Footer im
  Screen wird von "Rückrufnotiz bereit" zu **"Vorgang bereit"** verschoben
  und die schwebende Rückrufnotiz-Karte bekommt mehr Gewicht (sie ist der
  Vorgeschmack auf Sektion 2). Kein zweites Artefakt in den Hero bauen —
  der volle Vorgang gehört in die RequestArtifactSection, sonst Dopplung.

### 2. RequestArtifactSection — NEU (`id="beispiel"`)

**Rolle:** Der Logo-Ersatz. HeyKiki zeigt 300 Kunden, BaseModul zeigt den
Output. Muss ohne Scrollen nach dem Hero als "aha, DAS kommt raus"
funktionieren.

- Headline: "So sieht eine vollständige Anfrage aus."
- Subline: "BaseModul sammelt die Pflichtinfos ein, markiert Dringlichkeit
  und übergibt den Vorgang dort, wo Ihr Team weiterarbeitet."
- **Ein** großes, scanbares Vorgangs-Artefakt (keine Card-in-Card) mit den
  Feldern: Eingang · Kontakt · Einsatzort · Anliegen · Dringlichkeit ·
  Anhänge · Fehlende Infos · Nächster Schritt · Übergabe.
- Beispieldaten kanal-gemischt (z. B. Eingang "Anruf, 22:47" + Anhang "2
  Fotos per Upload-Link") — damit das Artefakt nicht als reine
  Telefonnotiz gelesen wird.
- Vorher/Nachher-Zeile: "Vorher: 7 Nachrichten, 3 Rückfragen. Nachher: ein
  sauberer Vorgang."
- Kein eigener Button-CTA. Optional ein Textlink "Beispiel-Vorgang
  durchspielen →" zu `#livedemo`.
- Feldwert "Dringlichkeit" nutzt die bestehende Amber-Konvention (Amber =
  dringend, Grün = erledigt/normal).

### 3. ProblemSection — leicht schärfen, Position bleibt relativ (jetzt nach dem Beweis)

**Rolle:** Wiedererkennung. Nach dem "Wow, sauberer Vorgang" folgt "und so
sieht mein Alltag heute aus". Die Fallhöhe zwischen 2 und 3 verkauft.

- Headline-Option: "Halbe Anfragen kosten Zeit, Rückrufe und manchmal
  Aufträge." (aktuelle Headline ist auch haltbar — nur ändern, wenn es in
  einem Rutsch geht).
- Die drei Karten bleiben; Texte stärker auf "unvollständig" drehen:
  "Adresse fehlt", "Foto ohne Kontext", "Dringlichkeit unklar". Keine
  vierte Karte nötig — drei Pains reichen, Formular/E-Mail wird in Subline
  oder Karte 2 miterwähnt.

### 4. UseCasesSection — nach vorn verschieben (vor Modules) + Claims fixen

**Rolle:** Der abstrakte Vorgang wird zu drei konkreten Branchen-Szenen.
Beantwortet "funktioniert das für MEINEN Betrieb?" bevor der Baukasten
kommt.

- Position: direkt nach ProblemSection (aktuell steht sie NACH Modules).
- Die drei Cases bleiben: SHK/Notdienst, Kfz/Fotos, Entrümpelung/Reinigung.
- Claim-Guards einarbeiten:
  - Entrümpelungs-Case: "fertige Angebotsgrundlage" ist ok, aber "Das Modul
    sendet automatisch einen Link" → prüfen, dass nirgends ein
    automatisches *Angebot* impliziert wird. Formulierung: "Das Team erhält
    alle Eckdaten als Angebotsgrundlage."
  - Notdienst-Case: "meldet an die Bereitschaft" bleibt — das Modul
    informiert, es entscheidet nicht.
- Jede Karte endet mit dem benannten Artefakt: **Notfallkarte** ·
  **Schadenfall** · **Angebotsgrundlage**. Das verzahnt die Sektion mit
  RequestArtifact (Sektion 2) und LiveDemo (Sektion 7).

### 5. ModulesSection — umschreiben (weniger Telefon-Hierarchie)

**Rolle:** Kaufstruktur. Nicht fünf Produkte, sondern fünf Eingänge zum
selben Output.

- Headline bleibt: "Ein Baukasten für Ihre Anfragen."
- Subline neu: "Starten Sie mit dem Eingangskanal, der gerade am meisten
  Zeit kostet. Weitere Module lassen sich später kombinieren."
- Layout-Entscheidung: Das Telefon-Modul darf visuell der ausgeführte
  Erstfall bleiben (Speerspitze), aber die Sprache dreht von
  "Kern + Erweiterungen" auf "erster Einstieg + weitere Eingänge". Das
  Label "Weitere Module · flexibel kombinierbar" bleibt, der Ergebnis-Block
  unter dem Telefon-Modul wird von "Rückrufnotiz" zu "Vorgang"
  generalisiert oder auf eine kompakte Mini-Notiz reduziert — er darf das
  große Artefakt aus Sektion 2 nicht wiederholen.
- Kein Grid-Umbau in Phase 1/2 — reine Copy- und Gewichtungsänderung.

### 6. WorkflowSection — umschreiben (kanal-agnostisch), bleibt die einzige Flow-Strecke

**Rolle:** Der Mechanismus, in 5 Sekunden lesbar. Ersetzt zusammen mit
Sektion 2 die gesamte Erklär-Arbeit der geparkten ScrollStory.

- Neue Steps: "Anfrage kommt rein" → "Fehlende Infos werden abgefragt" →
  "Dringlichkeit markiert" (amber) → "Vorgang ans Team übergeben" (grün).
- Caption neu: "Funktioniert für Anrufe, WhatsApp, Formulare, Fotos und
  Terminwünsche."
- Header-Text: Verweis auf "die Story" streichen (ScrollStory entfällt).
  Eyebrow von "Praxisbeispiel" zu "Ablauf".

### 7. LiveDemoSection — Copy entschärfen

**Rolle:** Der erlebbare Beweis. Ehrlich als Beispiel deklariert.

- Headline: "Spielen Sie einen **Beispiel-Vorgang** durch." (nicht mehr
  "echten Ablauf" — die Demo ist self-contained).
- Subline: "Drücken Sie Play und hören Sie, wie BaseModul eine Anfrage
  annimmt, gezielt nachfragt und den Vorgang ans Team übergibt."
- Status-/Ergebnis-Labels im Phone szenariobasiert statt pauschal
  "Rückrufnotiz bereit":
  - Rückruf-Szenario: "Rückrufnotiz bereit" (passt, bleibt)
  - Dringende Meldung: "Vorgang bereit" oder "Meldung übergeben"
  - Terminstatus: "Vorgang bereit"
  - Foto & Datei: "Fotofall bereit"
- "Live-Demo"-Label im Phone-Header ist grenzwertig → "Beispiel-Demo" oder
  "Demo". Transkripte und Audio bleiben unverändert.

### 8. VisualContextSection — bleibt, minimal anpassen

**Rolle:** Zweiter Beweis für den Nicht-Telefon-Kanal (Foto/Datei). Bleibt,
weil sie den Output-Beweis stärkt statt zu dekorieren.

- Abgrenzung zu Sektion 2 explizit machen: Sektion 2 zeigt den generischen
  vollständigen Vorgang, diese Sektion den Spezialfall "Anhang fehlt →
  Modul fragt nach → Fotofall komplett".
- Footer-Zeile "Nächster Schritt: Rückrufnotiz ans Team" → "Nächster
  Schritt: Vorgang ans Team".
- Sonst unverändert (kein Layout-Umbau).

### 9. IntegrationsSection — bleibt

**Rolle:** IT-Angst nehmen. "Es hängt sich an Ihren Alltag — nicht
umgekehrt" ist bereits die richtige Sprache; E-Mail/Sheet/WhatsApp zuerst,
n8n/Webhooks nur im Kleingedruckten. Keine Änderung nötig außer der
Eyebrow-Nummer.

### 10. PricingSection — Copy schärfen

**Rolle:** Risiko-Umkehr. Kein SaaS-Plan-Vergleich, sondern ein kleiner,
konkreter erster Schritt.

- Headline: "Erst einen Eingangskanal testen. Dann entscheiden."
- Pilot-Features auf die neue Story: 30-Minuten-Check · ein Eingangskanal ·
  ein Beispiel-Flow · eine Übergabe ans Team · Test mit realistischen
  Fällen.
- Preise bleiben: Pilot ab 750 € · Modul ab 1.500 € · Custom auf Anfrage.
- Karten-CTAs bleiben auf `#cta` (kein "Jetzt starten"-Vokabular).

### 11. FaqSection — vor den Abschluss-CTA ziehen + erweitern

**Rolle:** Einwand-Maschine. Steht künftig VOR `LetsWorkTogether`, damit
der Abschluss-CTA das Letzte ist, was man sieht (aktuell versandet die
Seite nach dem CTA in der FAQ).

Ergänzen (auf 10–12 Fragen):

- Ist BaseModul ein Callcenter oder ein Telefonbot?
- Muss der Assistent so tun, als wäre er ein Mensch? (Antwort: Nein — er
  sagt ehrlich, was er ist.)
- Welche Infos fragt BaseModul ab?
- Wo landet die fertige Anfrage?
- Bleibt unser Team in Kontrolle? (Antwort: Assistent bereitet vor, Team
  entscheidet; keine verbindlichen Zusagen ohne Freigabe.)
- Wie wird Datenschutz/AVV behandelt?

Bestehende sechs Fragen bleiben alle.

### 12. LetsWorkTogether — umschreiben

**Rolle:** Conversion. Ein Angebot, ein Klick, ein Mensch.

- Headline: "Welcher Eingangskanal kostet Sie aktuell am meisten Zeit?"
- Text: "Wir prüfen gemeinsam, ob Telefon, WhatsApp, Fotos, Formulare oder
  Notdienst der sinnvollste erste Hebel ist. Kein Komplettsystem, kein
  Vertrag im Erstgespräch."
- CTA: "30-Minuten-Check buchen" (öffnet den bestehenden Cal-Link).
- Fatih/AGENTEQ-Block bleibt unverändert — das ist das ehrlichste
  Trust-Signal der Seite.

### Footer — bleibt

"Ein Produkt von AGENTEQ" bleibt die richtige Dosierung. Nur der
Produkt-Linkblock bekommt `Beispiel (#beispiel)` dazu, wenn ohnehin
angefasst.

### FloatingCta — Text anpassen

"Demo anfragen" → **"30-Minuten-Check"**, Ziel bleibt `#cta`. Ein einziges
Conversion-Vokabular auf der ganzen Seite.

---

## 4. CTA-Logik

**Regel 1: Ein Conversion-Ziel.** Alle primären CTAs führen zu `#cta`
(LetsWorkTogether), dort sitzt der Cal-Link. Kein zweiter Kanal, kein
Formular, kein "Jetzt starten".

**Regel 2: Sekundäre CTAs führen nur vorwärts** (tiefer in die Story), nie
zurück nach oben.

| Ort | CTA | Ziel |
|---|---|---|
| Navbar | 30-Minuten-Check | `#cta` |
| Hero primär | 30-Minuten-Check buchen | `#cta` |
| Hero sekundär | Beispiel-Vorgang ansehen | `#beispiel` |
| RequestArtifact (Textlink, optional) | Beispiel-Vorgang durchspielen | `#livedemo` |
| Integrations | Anbindung anfragen | `#cta` |
| Pricing (3 Karten) | Pilot besprechen / Modul planen / Anfrage senden | `#cta` |
| LetsWorkTogether | 30-Minuten-Check buchen | Cal-Link (externes Fenster) |
| FloatingCta | 30-Minuten-Check | `#cta` |

Vokabular fixiert: **"30-Minuten-Check buchen"** (primär) und
**"Beispiel-Vorgang ansehen"** (sekundär). "Demo anfragen" verschwindet als
Begriff — die Demo ist auf der Seite, man muss sie nicht anfragen.

---

## 5. Was fliegt raus oder wird geparkt

### `ScrollStorySection` → parken (nach `web/_parked/components/landing/`)

Begründung der Entscheidung (der Umbauplan ließ das offen):

1. **Dopplung:** Sie erzählt exakt den Ablauf, den WorkflowSection (neu, 4
   Steps) und RequestArtifactSection (Output) zusammen abdecken. Der
   Umbauplan fordert: keine doppelte "so funktioniert's"-Strecke.
2. **Telefon-only:** Das komplette Visual ist auf "Aktiver Anruf" gebaut
   (5 Screens, Klingel-Ringe, verpasste Anrufe). Sie generalisieren hieße
   sie neu bauen — das widerspricht "keine unrelated Refactors".
3. **Tempo:** ~290dvh Sticky-Scroll mitten in der Seite bremst den Weg zur
   Demo und zum Pilot. HeyKikis Stärke ist Momentum, nicht Länge.

Parken, nicht löschen: Das Asset ist hochwertig und kann als Kernstück
einer späteren telefon-spezifischen Branchen-Landing (SHK/Notdienst)
wiederverwendet werden.

### `StorySeam` → von 7 auf 3 Instanzen reduzieren

Bleibt als Komponente, wird aber nur noch an den drei großen Erzähl-Nähten
gesetzt (nach Problem, nach Workflow, vor Pricing). Sieben Seams machen die
Seite langatmig und entwerten den Effekt.

### Nichts weiter fliegt

Alle anderen Sektionen haben eine eindeutige Rolle in der Verkaufslogik
(siehe Tabelle in Abschnitt 2). VisualContextSection stand auf der
Kippliste, bleibt aber als zweiter Output-Beweis für den Foto-Kanal.

---

## 6. Copy-Leitplanken

### Pflicht-Vokabular

- "vollständige Anfrage" / "sauberer Vorgang" / "Übergabe"
- "fragt fehlende Infos ab"
- "Ihr Team entscheidet" / "Team informiert"
- "Eingangskanal" statt "Channel"
- "30-Minuten-Check"

### Verboten (Guardrails)

- **Keine Hausverwaltung**, kein Callfolio — auch nicht in Beispieldaten.
- **Keine erfundenen** Kunden, Logos, Testimonials, Presse, Kundenzahlen
  oder ROI-Prozente.
- **Kein "klingt wie ein Mensch"** — der Assistent sagt ehrlich, was er
  ist. Auch keine impliziten Varianten ("merkt keiner", "natürliche
  Stimme wie ein Mitarbeiter").
- **Keine automatischen Angebote, Rechnungen oder Diagnosen.**
  "Angebotsgrundlage" ist die Obergrenze.
- **Notfälle:** Das Modul *erkennt* und *informiert* — es entscheidet
  nicht. Verbindliche Zusagen bleiben beim Team.
- Kein "echter Ablauf" / "Live" für die simulierte Demo.
- Kein KI-Buzzword-Framing ("autonome Agenten", "Orchestrierung",
  "End-to-end Transformation").
- Kein "Jetzt starten"-SaaS-Vokabular, solange Pilot/Service verkauft wird.

### Wo BaseModul zu sehr HeyKiki würde — aktiv gegensteuern

- Wenn Telefon überall der einzige gezeigte Kanal ist (Hero-Phone +
  ScrollStory + LiveDemo + Modules-Kern). Gegenmittel: ScrollStory geparkt,
  Artefakt-Beispieldaten kanal-gemischt, Workflow kanal-agnostisch,
  Modules-Sprache "erster Einstieg" statt "Kern".
- Wenn die Seite Büro-/Sekretariats-Entlastung verspricht statt
  Vorgangs-Qualität. BaseModuls Satz ist: "Wir machen aus chaotischen
  Eingängen saubere Arbeitsgrundlagen" — nicht "Wir nehmen dir das Büro ab".
- Wenn Pricing wie eine reife SaaS-Tabelle mit Minuten-Paketen aussieht.

### Wo BaseModul zu breit/unkonkret würde — aktiv gegensteuern

- "Vollständiger Vorgang" nie als Abstraktum stehen lassen — immer mit
  konkreten Feldern (Einsatzort, Dringlichkeit, Rückrufnummer) oder
  benanntem Artefakt (Notfallkarte, Schadenfall, Angebotsgrundlage) zeigen.
- Zielgruppe bleibt "lokale Servicebetriebe" mit den drei Beispielbranchen
  SHK/Kälte, Kfz/Gutachter, Entrümpelung/Reinigung — nicht "alle KMU".
- Modul-Baukasten nicht als Plattform-Vision erzählen ("beliebig
  kombinierbar für jeden Use Case"), sondern als: ein Kanal zuerst, dann
  erweitern.

---

## 7. Implementierungsreihenfolge danach

### Phase 1 — hoher Hebel, wenig Risiko (ein Code-Turn)

1. `RequestArtifactSection.tsx` neu bauen (`id="beispiel"`).
2. `HeroSection.tsx`: Headline, Subline, CTAs, Ergebnis-Label "Vorgang
   bereit".
3. `page.tsx`: RequestArtifact direkt nach Hero einfügen.
4. `WorkflowSection.tsx`: Steps + Caption kanal-agnostisch, Story-Verweis
   raus.
5. `LiveDemoSection.tsx`: Headline/Subline/Status-Labels entschärfen.
6. `LetsWorkTogether.tsx`: Headline, Text, CTA-Text.
7. `FloatingCta.tsx`: Text "30-Minuten-Check".
8. `npm run build` in `web/`.

### Phase 2 — Struktur und Einwände

1. `page.tsx`: UseCases vor Modules ziehen; FAQ vor LetsWorkTogether in
   `<main>` ziehen; ScrollStory entfernen; StorySeams auf 3 reduzieren.
2. `ScrollStorySection.tsx` nach `web/_parked/components/landing/`
   verschieben (inkl. Hinweis in `web/_parked/CLAUDE.md`).
3. `ModulesSection.tsx`: Subline, Ergebnis-Label, Gewichtungssprache.
4. `UseCasesSection.tsx`: Claim-Guards, Artefakt-Namen als Abschluss.
5. `PricingSection.tsx`: Headline + Pilot-Features.
6. `FaqSection.tsx`: auf 10–12 Fragen erweitern.
7. `Navbar.tsx`: neue Links + Scroll-Spy-IDs.
8. `VisualContextSection.tsx`: Footer-Zeile "Vorgang ans Team".

### Phase 3 — Politur und Doku

1. Eyebrow-Nummerierung aller Sektionen auf neue Reihenfolge umziehen.
2. `web/components/landing/CLAUDE.md`: tatsächliche Reihenfolge +
   Positionierung ("Anfrage-/Intake-System", nicht mehr
   "KI-Telefonassistent als Hauptspur") syncen.
3. `WIREFRAME.md` optional auf die neue Zielstruktur aktualisieren.
4. Browser-QA Desktop + Mobile: Hero lesbar, Artefakt ohne Scrollen
   erreichbar, alle Anker-CTAs treffen, keine Textüberläufe, Demo spielt.
5. Content-Guard-Check gegen Abschnitt 6.

### Nicht tun

- Keine neue Designrichtung, keine neuen Animationen als Selbstzweck.
- Keine echte Telefon-/WhatsApp-Integration.
- Keine Testimonials/Logos/Presse, keine neuen Detailseiten.
- ScrollStory nicht "nebenbei generalisieren" — parken heißt parken.
