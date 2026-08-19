# BaseModul — LLM-Wiki (kompakte Wissensbasis)

> Zweck: Diese Datei ist die Source of Truth für jeden Agent/jedes LLM, das
> BaseModul-Content erstellt (Posts, Videos, Outreach, Landing-Copy, Kampagnen).
> Ausführliche Ideen & Beispiele: [`product-content-angles.md`](product-content-angles.md).
> Bei Widerspruch zwischen beiden gewinnt diese Datei.
> Stand: 2026-07-03 · Sprache aller Kunden-Assets: Deutsch, Sie-Form.

---

## 1. Identity Snapshot

- **Produkt:** BaseModul (basemodul.de) — intelligentes Intake-System für
  lokale Servicebetriebe. Productized KI-Module, kein SaaS-Abo-Produkt,
  keine Agenturleistung.
- **Leitmotiv:** „Aus chaotischen Anfragen werden fertige Arbeitsaufträge."
- **Hauptversprechen:** Anfragen annehmen (Telefon/WhatsApp/Formular),
  fehlende Infos abfragen, fertigen strukturierten Fall ans Team übergeben.
- **Dachmarke:** AGENTEQ = Dachfirma/Trust-Layer/Absender („Ein Produkt von
  AGENTEQ"). BaseModul = sichtbare Produktmarke. Nie umgekehrt.
- **Gründer/Absender:** Fatih Akdeniz, München, gegründet 2026.
- **Strategie:** Produkt horizontal (eine Basis für alle), Vermarktung
  vertikal über Nischen-Linsen (SHK, Kfz, Entrümpelung/Reinigung).
- **Schwesterprodukt Callfolio (Hausverwaltungen):** existiert, wird in
  BaseModul-Content **niemals erwähnt**.

## 2. Audience Snapshot

- **ICP:** Lokale Servicebetriebe, 2–30 Mitarbeiter, ohne feste Rezeption,
  inhabergeführt. Entscheider: Inhaber/GF/Betriebsleiter.
- **Region:** Phase 1 München + Umland (80 km) → Bayern → DACH.
- **Nischen (priorisiert):**
  1. SHK / Kälte / Klima / Elektro-Notdienst → Module: Telefon, Notdienst, Termin
  2. Kfz-Werkstätten / Gutachter → Module: WhatsApp, Foto/Datei, Telefon
  3. Entrümpelung / Reinigung / Facility → Module: WhatsApp, Foto/Datei, Termin
- **Ausgeschlossen (nie ansprechen):** Hausverwaltungen (Callfolio-Spur),
  Healthcare/Compliance-heavy, Enterprise.
- **Selbstbild der Zielgruppe:** Praktiker, keine IT-Abteilung, skeptisch
  gegenüber „KI"-Verkäufern, kaufen Ergebnisse, nicht Technologie.

## 3. Product Truth (nur das ist belegt)

- 5 Module, einzeln startbar: Telefon, WhatsApp/Chat, Termin, Foto-&-Datei,
  Prioritäts-/Notdienst (Details → Abschnitt 4).
- Ergebnis jedes Flows: strukturierter Fall / Rückrufnotiz / Ticket —
  übergeben per E-Mail, Google Sheet, WhatsApp oder Telegram.
- Start ohne IT-Projekt: Rufumleitung oder WhatsApp-Nummer reicht; keine neue
  Telefonanlage nötig.
- Pakete: **Pilot** ab 750 € Setup, 150–399 €/Monat, Setup 1–2 Wochen, keine
  Mindestlaufzeit · **Modul** ab 1.500 € Setup, 300–899 €/Monat, Setup 2–4
  Wochen · **Custom** auf Anfrage.
- Datenschutz: keine Aufzeichnung von Telefonaten, Daten auf EU-Servern,
  DSGVO/AVV; Assistent stellt sich zu Gesprächsbeginn als digitaler Assistent
  vor (EU AI Act).
- Grenzen (bewusst): keine verbindlichen Zusagen/Preise/Diagnosen durch die
  KI; Notfälle werden immer an Menschen eskaliert; keine vollautomatische
  Angebotserstellung; ersetzt kein Personal.
- **Status (intern, prägt Claims):** MVP-/Pilotphase. Landing-Demo ist
  simuliert. Es gibt **keine dokumentierten Referenzkunden, Testimonials
  oder gemessenen Ergebnisse.**
- Tech-Stack (intern, nie im Kundentext): Vapi, Twilio/WhatsApp Business API,
  n8n, Next.js/Supabase, OpenAI/Claude, Vercel.

## 4. Feature/Service Atoms

Format je Atom: Fakt · Warum · einfach · stark · vermeiden · Content-Idee.

**A1 Telefon-Modul**
- Fakt: Nimmt Anrufe an (auch außerhalb Bürozeiten), erkennt Anliegen +
  Dringlichkeit, sichert Kontakt/Standort, erstellt Rückrufnotiz/Ticket.
- Warum: Verpasste Anrufe = verlorene Aufträge; Rückruf ohne Infos = doppelte Arbeit.
- Einfach: „Auch um 22 Uhr nimmt jemand ab."
- Stark: „Kein Anruf mehr verloren — Ihr Techniker weiß beim Rückruf schon, was Sache ist."
- Vermeiden: „24/7 KI-Voice-Agent", Latency-/Tech-Angeberei.
- Content: Short „Heizungsausfall um 22:13 Uhr".

**A2 WhatsApp-/Chat-Modul**
- Fakt: Sortiert Chat-Anfragen, fragt fehlende Angaben nach, bündelt
  Kommunikation, übergibt sauber ans Team.
- Warum: WhatsApp-Anfragen kommen unstrukturiert und werden vergessen
  (v. a. übers Wochenende).
- Einfach: „WhatsApp-Anfragen kommen vollständig an."
- Stark: „Aus WhatsApp-Chaos werden saubere Anfragen."
- Vermeiden: „Conversational AI", „Chatbot" als Selbstbezeichnung.
- Content: Post „Montagmorgen: 14 WhatsApp-Nachrichten vom Wochenende".

**A3 Termin-Modul**
- Fakt: Klärt Leistung + Wunschzeit vorab, prüft Kalender/Slots, bereitet
  Buchung/Rückruf vor, sendet Bestätigungen und Erinnerungen.
- Warum: Terminabstimmung ist Rückruf-Ping-Pong.
- Einfach: „Termine werden vorbereitet statt hin- und hertelefoniert."
- Stark: „Weniger Rückruf-Hin-und-her — der Termin steht, bevor Ihr Team anruft."
- Vermeiden: „Automatisches Scheduling mit Kalender-Sync" (Tool-Sprache).
- Content: Carousel-Slide im Modul-Baukasten.

**A4 Foto-&-Datei-Modul**
- Fakt: Fordert gezielt Bilder/Dokumente an (Schadenbilder, Fahrzeugschein),
  fragt Kontext ab (Ort, Hergang), verknüpft alles zum strukturierten Fall.
- Warum: Fotos ohne Kontext erzwingen dreifaches Nachfragen; ohne Fotos keine
  Volumenschätzung (Entrümpelung).
- Einfach: „Bilder kommen mit Kontext an."
- Stark: „Fotos rein, strukturierter Fall raus."
- Vermeiden: „KI-Bilderkennung/Schadensbewertung" — es wird erfasst und
  strukturiert, nicht automatisch bewertet.
- Content: Short „7 Fotos, 0 Kontext".

**A5 Prioritäts-/Notdienst-Modul**
- Fakt: Erkennt Dringlichkeit, fragt Pflichtinfos ab (Adresse, Problem,
  Rückrufnummer), alarmiert Bereitschaft per SMS/WhatsApp; Entscheidung
  bleibt beim Menschen.
- Warum: Notfälle, die in Mailbox/Chat verschwinden, sind der teuerste Fehler.
- Einfach: „Notfälle landen sofort beim richtigen Menschen."
- Stark: „Kein Notfall verschwindet mehr in einer Mailbox."
- Vermeiden: „Autonome Eskalation", „KI entscheidet".
- Content: DRINGEND-Ticket als visueller Payoff jedes Notdienst-Assets.

**A6 Pilot-Einstieg**
- Fakt: Ab 750 € Setup, 150–399 €/Monat, ein Modul, Setup 1–2 Wochen, keine
  Mindestlaufzeit; Vergleichsanker: Teilzeitkraft fürs Telefon 1.500+ €/Monat.
- Warum: Zielgruppe kauft kein Risiko und kein Jahresabo.
- Einfach: „Erst testen, dann entscheiden."
- Stark: „Ein Modul, zwei Wochen Setup, keine Vertragsbindung."
- Vermeiden: Rabatt-/Urgency-Mechanik, SaaS-Preistabellen-Ästhetik.
- Content: Carousel „So läuft der Pilot".

**A7 Ehrliche, konforme KI**
- Fakt: Assistent stellt sich als digital vor (EU AI Act); keine
  Gesprächsaufzeichnung; EU-Server; DSGVO.
- Warum: Häufigster Einwand ist „KI am Telefon mögen Kunden nicht" —
  Erreichbarkeit schlägt Warteschleife.
- Einfach: „Der Assistent sagt ehrlich, dass er digital ist."
- Stark: „Ein ehrlicher digitaler Empfang ist besser als eine Mailbox um 22 Uhr."
- Vermeiden: „Nicht von einem Menschen zu unterscheiden" (verboten).
- Content: Einwand-Post-Serie.

**A8 Modul-Baukasten**
- Fakt: Start mit einem Modul, Erweiterung ohne Systemwechsel (Kanäle,
  Standorte, CRM-Anbindung).
- Warum: Differenzierung gegen All-in-One-SaaS und Einzweck-Bots.
- Einfach: „Sie kaufen nur das Modul, das Sie brauchen."
- Stark: „Ein Baukasten für Ihre Anfragen — heute ein Kanal, morgen mehr."
- Vermeiden: „Plattform", „Ökosystem", „Suite".
- Content: Carousel „Die 5 Module — Sie brauchen erstmal nur eins."

## 5. Message Map

| Ebene | Botschaft |
|---|---|
| Kernversprechen | Aus chaotischen Anfragen werden fertige Arbeitsaufträge. |
| Mechanik (3 Schritte) | 1. Anfrage kommt rein (Telefon/WhatsApp/Formular) · 2. Assistent fragt fehlende Infos ab · 3. Team bekommt fertigen Fall. |
| SHK-Linse | Kein Anruf mehr verloren. Notfälle sauber erfassen und eskalieren. |
| Kfz-Linse | Fotos rein, strukturierter Schadenfall raus. |
| Entrümpelung/Reinigung-Linse | Aus chaotischen Anfragen werden vollständige Aufträge. |
| Beweis (erlaubt) | Konkrete Szenario-Demos (22:13 Uhr / 7 Fotos / Goethestraße) — als typische Szenarien, nie als Kundenreferenz. |
| Risiko-Umkehr | Pilot ab 750 €, 1–2 Wochen, keine Mindestlaufzeit. |
| Vertrauen | DSGVO, EU-Server, keine Aufzeichnung, KI gibt sich zu erkennen, Notfälle → Mensch, ersetzt niemanden. Absender: AGENTEQ, München. |
| CTA | Weiche Frage (Outreach) oder „Pilot besprechen"/„Demo anfragen" (Landing). Ein CTA pro Asset. |

## 6. Content Rules

1. Pro Asset: eine Branche, ein Painpoint, ein Modul, ein CTA.
2. Struktur der Produktstory immer: Szenario → Vorher → Mit BaseModul →
   **Artefakt** (Rückrufnotiz/Fallkarte/Ticket). Das Artefakt ist der Payoff.
3. Painpoint muss in den ersten 3 Sekunden / der ersten Zeile erkennbar sein.
4. Spezifik statt Abstraktion: „22:13 Uhr", „7 Fotos", „Goethestraße" —
   keine generischen KI-Visuals/Roboter als Hauptmotiv.
5. Videos: nur für E-Mail-Outreach und Social Shorts — **nicht auf der
   Landingpage einbetten** (bewusste Entscheidung, Stand 2026-07).
6. Outreach-Mails: max. 120 Wörter, genau ein zitiertes öffentliches Signal,
   eine einfache Frage am Ende, personalisiert, kein Massen-Template.
   Cadence: Tag 0 → Tag 4 → (Tag 9 LinkedIn) → Tag 14 Breakup; Stopp bei
   „kein Interesse".
7. Landingpage bleibt horizontal (Intake-System), Nischen erscheinen als
   Use-Case-Karten; Vertikalisierung passiert in Videos/Outreach/Ads.
8. Wenn eine Information nicht in dieser Datei belegt ist: nicht erfinden —
   als offene Frage markieren.

## 7. Tone of Voice

- Deutsch, Sie-Form. Klar und direkt: kurze Sätze, aktive Verben, kein
  Fachchinesisch.
- Lokal und nahbar: „Betrieb", „Team", „Anfrage", „Übergabe", „Bereitschaft",
  „Rückrufnotiz" — die Sprache des Betriebs, nicht der Tech-Branche.
- Verkaufsnah, aber nicht marktschreierisch: messbarer Alltagsnutzen statt
  Superlative; keine Ausrufezeichen-Ketten, keine Uppercase-Headlines.
- Seriös: BaseModul ist ein verlässliches Werkzeug, kein Gadget.
- Selbstbeschreibung klein: „kleine digitale Assistenten", „Intake-Module" —
  nie „Plattform", nie „KI-Lösung".
- Verbotene Wörter: „AI Agents", „autonome KI-Agenten", „Multi-Channel-
  Orchestrierung", „Transformation", „Disruption", „Enterprise-Lösung",
  „End-to-end", generisches KI-Blabla.

## 8. Claim Guards

**Hart verboten (jedes Asset ablehnen/korrigieren, das dies enthält):**
1. Erfundene Kunden, Testimonials, Fallstudien, Kundenzahlen, Logos —
   es gibt keine dokumentierten Referenzen (Stand 2026-07).
2. Erfundene Ergebniszahlen („X % weniger verpasste Anrufe", „spart X
   Stunden") — es gibt keine Messungen.
3. „Nicht von Menschen zu unterscheiden" o. Ä. — der Assistent muss sich als
   KI zu erkennen geben.
4. KI trifft verbindliche Zusagen, nennt verbindliche Preise, stellt
   Diagnosen oder erstellt automatisch Angebote — tut sie nicht.
5. Personal-Ersatz-Claims („ersetzt Ihre Sekretärin").
6. Callfolio erwähnen; Hausverwaltung, Healthcare oder Enterprise ansprechen.
7. Wettbewerber proaktiv nennen (nur reaktiv bei direkter Nachfrage).
8. Tech-Stack im Kundentext (Vapi, Twilio, n8n, GPT, Supabase …).
9. Aufzeichnungs-Versprechen („wir zeichnen alles auf") — es wird nicht
   aufgezeichnet.

**Erlaubt (belegt):** Pilot ab 750 € / keine Mindestlaufzeit / Setup 1–2
Wochen (Pilot), 2–4 Wochen (Modul) · DSGVO, EU-Server, keine Aufzeichnung,
KI-Transparenz · Start per Rufumleitung/WhatsApp-Nummer · Übergabe per
E-Mail/Sheet/WhatsApp/Telegram · Notfall-Eskalation an Menschen ·
Vergleichsanker Teilzeitkraft 1.500+ €/Monat · Marktzahlen nur mit
„rund/ca." (~35.000 SHK-, ~36.000 Kfz-Betriebe, ~8.000 Kfz-Sachverständige,
~20.000 Gebäudereiniger in DE).

**Szenario-Regel:** Die Use Cases (22:13 Uhr / 7 Fotos / Goethestraße) sind
typische, konstruierte Szenarien. Erzählen als „so läuft es ab" — niemals als
reale Kundengeschichte ausgeben.

## 9. Ready-to-use Prompts

**P1 — LinkedIn-Post:**
> Schreibe einen LinkedIn-Post (max. 120 Wörter, Deutsch, Sie-Form) für
> BaseModul. Nische: {SHK|Kfz|Entrümpelung}. Painpoint in Zeile 1, dann
> Szenario → Artefakt (Rückrufnotiz/Fallkarte), Abschluss mit einer der
> Kernbotschaften aus der Message Map. Beachte Claim Guards (Abschnitt 8)
> und Tone of Voice (Abschnitt 7). Keine Hashtag-Wände (max. 3), kein Emoji-Spam.

**P2 — Outreach-Mail:**
> Schreibe eine Cold-E-Mail für BaseModul an einen {Branche}-Betrieb.
> Öffentliches Signal: {Signal}. Max. 120 Wörter, Signal konkret zitieren,
> eine Frage zur aktuellen Ersterfassung stellen, BaseModul in einem Satz als
> „kleine digitale Assistenten/Intake-Module" einführen, weiche Frage als CTA
> („Wäre ein 20-minütiger Blick darauf grundsätzlich interessant?").
> Absender: Fatih Akdeniz, AGENTEQ / basemodul.de. Kein Send ohne
> Fatih-Freigabe.

**P3 — Video-Script (Short):**
> Schreibe ein 30-Sekunden-Shorts-Script für BaseModul, Use Case {UC1|UC2|UC3}.
> Struktur: 0–3 s Painpoint als Text-Overlay · 3–20 s Interaktion
> (Anruf/Chat mit 2–3 Rückfragen) · 20–27 s Artefakt als Payoff
> (Ticket/Fallkarte erscheint) · 27–30 s Abbinder „Aus chaotischen Anfragen
> werden fertige Arbeitsaufträge. basemodul.de". Video ist für
> E-Mail/Shorts, nicht für die Landingpage.

**P4 — Carousel:**
> Erstelle ein LinkedIn-Carousel (6–8 Slides) für BaseModul zum Thema
> {Thema aus product-content-angles.md §10}. Ein Gedanke pro Slide, max.
> 20 Wörter pro Slide, letzter Slide = ein CTA aus der CTA-Bank.

**P5 — Landing-Copy:**
> Schreibe Copy für die Sektion {Sektion} der basemodul.de-Landing.
> Horizontal bleiben (Intake-System, keine Einzelnische im Hero), Nischen
> nur in Use-Case-Karten. Stil: kurze Sätze, keine Uppercase-Headlines,
> Benefit vor Mechanik. Referenz-Ton: Hero „Aus chaotischen Anfragen werden
> fertige Arbeitsaufträge."

**P6 — Claim-Check (als letzter Schritt jedes Assets):**
> Prüfe den folgenden BaseModul-Text gegen Abschnitt 8 (Claim Guards) und
> Abschnitt 7 (verbotene Wörter). Liste jede Verletzung mit Korrektur.
> Prüfe zusätzlich: Wird Callfolio/Hausverwaltung erwähnt? Werden Kunden
> oder Zahlen impliziert, die es nicht gibt?

## 10. Machine-readable YAML Map

```yaml
brand:
  product: BaseModul
  domain: basemodul.de
  parent_brand: AGENTEQ            # Trust-Layer/Absender, nie Hauptmarke
  founder: Fatih Akdeniz
  location: München
  founded: 2026
  language: de
  form_of_address: Sie
positioning:
  one_liner: >-
    Intelligentes Intake-System für lokale Servicebetriebe: nimmt Anfragen an,
    fragt fehlende Infos ab, übergibt dem Team einen fertigen Fall.
  leitmotiv: Aus chaotischen Anfragen werden fertige Arbeitsaufträge.
  strategy: horizontal_product_vertical_lenses
icp:
  size: 2-30 Mitarbeiter
  traits: [ohne feste Rezeption, inhabergeführt, keine IT-Abteilung]
  region_phase1: München + Umland (80 km)
  deciders: [Inhaber, Geschäftsführer, Betriebsleiter]
  niches:
    - id: shk
      label: SHK / Kälte / Klima / Elektro-Notdienst
      hook: Kein Anruf mehr verloren. Notfälle sauber erfassen und eskalieren.
      modules: [telefon, notdienst, termin]
      priority: 1
    - id: kfz
      label: Kfz-Werkstätten / Gutachter / Sachverständige
      hook: Fotos rein, strukturierter Schadenfall raus.
      modules: [whatsapp, foto_datei, telefon]
      priority: 2
    - id: entruempelung_reinigung
      label: Entrümpelung / Reinigung / Facility
      hook: Aus chaotischen Anfragen werden vollständige Aufträge.
      modules: [whatsapp, foto_datei, termin]
      priority: 3
  excluded: [Hausverwaltung, Healthcare, Enterprise]
modules:
  - id: telefon
    name: Telefon-Modul
    does: Anrufe annehmen (auch außerhalb Bürozeiten), Anliegen + Dringlichkeit
      erkennen, Kontakt/Standort sichern, Rückrufnotiz oder Ticket erstellen
  - id: whatsapp
    name: WhatsApp-/Chat-Modul
    does: Chat-Anfragen sortieren, fehlende Angaben nachfragen, sauber ans Team übergeben
  - id: termin
    name: Termin-Modul
    does: Leistung + Wunschzeit klären, Kalender/Slots prüfen, Buchung/Rückruf
      vorbereiten, Bestätigungen und Erinnerungen senden
  - id: foto_datei
    name: Foto-&-Datei-Modul
    does: Bilder/Dokumente gezielt anfordern (inkl. Fahrzeugschein), Kontext
      abfragen, strukturierten Fall erzeugen
  - id: notdienst
    name: Prioritäts-/Notdienst-Modul
    does: Dringlichkeit erkennen, Pflichtinfos abfragen, Bereitschaft per
      SMS/WhatsApp alarmieren; Entscheidung bleibt beim Menschen
handoff_targets: [E-Mail, Google Sheet, WhatsApp, Telegram]
offers:
  pilot:   {setup_eur: ab 750, monthly_eur: 150-399, setup_time: 1-2 Wochen, commitment: keine Mindestlaufzeit}
  modul:   {setup_eur: ab 1500, monthly_eur: 300-899, setup_time: 2-4 Wochen}
  custom:  {setup_eur: auf Anfrage, monthly_eur: auf Anfrage}
compliance:
  - keine Aufzeichnung von Telefonaten
  - Daten auf EU-Servern (DSGVO/AVV)
  - Assistent gibt sich als KI zu erkennen (EU AI Act)
  - Notfälle werden an Menschen eskaliert
  - keine verbindlichen Zusagen/Preise/Diagnosen durch die KI
claim_guards:
  forbidden:
    - erfundene Kunden/Testimonials/Fallstudien/Kundenzahlen
    - erfundene Ergebnis-/Prozentzahlen
    - "nicht von Menschen zu unterscheiden"
    - Personal-Ersatz-Claims
    - Callfolio/Hausverwaltung/Healthcare/Enterprise erwähnen
    - Wettbewerber proaktiv nennen
    - Tech-Stack im Kundentext (Vapi, Twilio, n8n, GPT, Supabase)
    - vollautomatische Angebotserstellung versprechen
  banned_words: [AI Agents, autonome KI-Agenten, Multi-Channel-Orchestrierung,
    Transformation, Disruption, Enterprise-Lösung, End-to-end, Plattform,
    Ökosystem]
  allowed_anchors:
    - Pilot ab 750 EUR Setup, keine Mindestlaufzeit
    - Teilzeitkraft fürs Telefon kostet 1.500+ EUR/Monat (Vergleichsanker)
    - Marktzahlen nur als ca.-Angaben (~35k SHK, ~36k Kfz, ~8k Gutachter, ~20k Reinigung)
content_rules:
  per_asset: [eine Branche, ein Painpoint, ein Modul, ein CTA]
  story_structure: [Szenario, Vorher, Mit BaseModul, Artefakt]
  video_usage: nur E-Mail-Outreach und Social Shorts, nicht Landingpage
  outreach: {max_words: 120, signals_per_mail: 1, cadence_days: [0, 4, 9, 14],
    stop_on: kein Interesse}
canonical_use_cases:
  - {id: uc1, niche: shk, scene: "Heizungsausfall um 22:13 Uhr",
     artifact: DRINGEND-Ticket an Bereitschaftstechniker}
  - {id: uc2, niche: kfz, scene: "7 Unfallfotos per WhatsApp, ohne Text",
     artifact: Schadenfall-Karte mit Bildern + Fahrzeugdaten + Kontakt}
  - {id: uc3, niche: entruempelung_reinigung,
     scene: "vage Anfrage Wohnungsauflösung Goethestraße",
     artifact: vollständige Kalkulationsgrundlage}
status:
  phase: MVP / Pilotphase (Stand 2026-07)
  references: keine dokumentierten Kunden oder Messwerte — kein Social Proof erfinden
  landing_demo: simuliert, kein Live-Backend
```

## 11. Final Instruction for future LLMs

Du erstellst Content für BaseModul. Halte dich an diese Reihenfolge:

1. **Lies Abschnitt 8 (Claim Guards) zuerst.** Alles, was dort verboten ist,
   darf in keinem Asset erscheinen — auch nicht abgeschwächt oder impliziert.
2. Wähle **eine** Nische (Abschnitt 2), **einen** Painpoint und **ein** Modul.
   Nutze die passende Nischen-Hook aus der Message Map.
3. Baue jede Produktstory als Szenario → Vorher → Mit BaseModul → **Artefakt**.
   Ende immer mit der Rückrufnotiz/Fallkarte/dem Ticket.
4. Schreibe im Ton von Abschnitt 7: Deutsch, Sie-Form, kurze Sätze,
   Betriebssprache, keine verbotenen Wörter.
5. Verwende nur Fakten aus Abschnitt 3/4 und der YAML-Map. Wenn dir eine
   Information fehlt: **nicht erfinden** — markiere sie als offene Frage und
   verweise auf `product-content-angles.md` §19 (Open Questions).
6. Prüfe dein fertiges Asset mit Prompt P6 (Claim-Check), bevor du es abgibst.
7. Kein Outreach-Versand ohne explizite Freigabe von Fatih; du lieferst
   Entwürfe/Previews, keine Sends.

Für mehr Ideen (Hooks, Skripte, Batches, Carousels):
`docs/content/product-content-angles.md`. Für Outreach-Prozessregeln (Guard,
Send Timing): `docs/hermes/basemodul-core.SKILL.md`.
