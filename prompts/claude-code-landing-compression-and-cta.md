# Claude Code Prompt: BaseModul Landing komprimieren + CTA schärfen

Du arbeitest im Repo:

`/Users/user/Desktop/Projects/basemodul`

## Aufgabe

Die BaseModul-Landing wurde inhaltlich verbessert. Jetzt soll sie **kompakter, klarer und conversion-stärker** werden — ohne die neue Positionierung wieder zu verwässern.

Nicht neu erfinden. Nicht komplett redesignen. Bitte gezielt verdichten.

## Kontext zuerst lesen

Lies zuerst:

1. `CLAUDE.md`
2. `web/CLAUDE.md`
3. `web/components/landing/CLAUDE.md`
4. `docs/content/heykiki-strategy-transfer-2026-07-16.md`
5. `web/app/page.tsx`

Dann nur die Komponenten lesen, die du wirklich bearbeitest.

## North Star

BaseModul verkauft nicht einfach „Telefonbot“, sondern:

> Aus chaotischen Kundenanfragen werden vollständige Vorgänge für das Team.

Aktueller Haupt-Hook bleibt:

> Weniger Telefonchaos. Mehr vollständige Anfragen.

Die Seite soll in den ersten 20 Sekunden vermitteln:

1. Für wen: lokale Servicebetriebe
2. Was passiert: Anrufe, WhatsApp, Formulare, Fotos kommen rein
3. Ergebnis: vollständiger Vorgang mit Pflichtinfos
4. Einstieg: 30-Minuten-Check buchen

## Wichtig: was unbedingt bleiben soll

- Haupt-CTA: **„30-Minuten-Check buchen“**
- Der 30-Minuten-Check soll sich leicht, schnell und risikoarm anfühlen: „zack, kurzer Check, kein langer Sales-Prozess“.
- Server-/DSGVO-Hinweis darf bleiben. Der Server-Standort Frankfurt ist für BaseModul korrekt/gewollt.
- Servicebetrieb-Fokus bleibt.
- Keine Hausverwaltung.
- Kein Callfolio-Framing.
- AGENTEQ nur als Trust-Layer / „Ein Produkt von AGENTEQ“.
- Keine erfundenen Kundenlogos, Presse, Testimonials oder falsche Live-Claims.

## Zielbild nach dem Feinschliff

Die Landing soll weniger voll wirken:

- weniger Wiederholungen
- kürzere Bullet-Listen
- weniger Mikrocopy in Karten
- klarere Section-Hierarchie
- mehr Luft zwischen starken Aussagen
- CTAs konsequent vereinheitlichen

Die Seite soll nicht dünn werden — nur fokussierter.

## Konkrete To-dos

### 1. CTA-Sprache vereinheitlichen

Haupt-CTA überall bevorzugt:

> 30-Minuten-Check buchen

Sekundär-CTA nur sparsam:

> Beispiel-Vorgang ansehen
> Demo ansehen

Bitte prüfen und vereinheitlichen:

- Navbar CTA
- Hero CTA
- Beispiel-Sektion CTA
- Pricing/Pilot CTA
- Abschluss-CTA
- Floating CTA

Vermeide zu viele verschiedene CTA-Texte wie „Anbindung anfragen“, „Pilot besprechen“, „Anfrage senden“, wenn sie dieselbe Handlung meinen. Falls unterschiedliche CTAs bleiben, müssen sie bewusst unterschiedliche Intent-Stufen haben.

### 2. Hero nicht umbauen, nur schärfen

Hero soll bleiben:

> Weniger Telefonchaos. Mehr vollständige Anfragen.

Subline darf maximal leicht gekürzt werden. Sie muss enthalten:

- Anrufe
- WhatsApp/Formulare/Fotos
- fehlende Infos abfragen
- saubere Übergabe ans Team

Prüfe, ob Hero visuell zu voll ist. Wenn ja:

- Trust-Hinweis kurz halten
- weniger kleine Badges/Microcopy
- Visual nicht mit zu vielen Labels überladen

### 3. Beispiel-Vorgang als stärksten Proof behalten, aber verdichten

Die Sektion „So sieht eine vollständige Anfrage aus“ ist wichtig. Sie darf bleiben, aber bitte weniger voll wirken.

Prüfe:

- Muss jede Zeile sichtbar sein?
- Können 1–2 Felder zusammengelegt werden?
- Können Labels gekürzt werden?
- Braucht die Vorher/Nachher-Zeile weniger Text?

Wichtig: Der Output muss schnell erfassbar bleiben:

- Kontakt
- Einsatzort
- Anliegen
- Dringlichkeit
- nächster Schritt
- Übergabe

### 4. Problem-Sektion komprimieren

Problem-Sektion soll schneller scannbar werden.

Aktuell reicht je Problemkarte meist:

- 1 klare Headline
- 2 kurze Bulletpoints

Keine langen Erklärungen. Keine Wiederholung von Hero/Subline.

### 5. Praxisbeispiele komprimieren

Die drei Use Cases sind gut, aber dürfen kompakter werden.

Beibehalten:

- SHK / Kälte / Notdienst
- Kfz / Gutachter / Werkstatt
- Entrümpelung / Reinigung

Ziel pro Use Case:

- 1 kurzer Situationssatz
- 2 Vorher-Punkte max.
- 2 Mit-BaseModul-Punkte max.
- Ergebnis-Badge

Wenn Details-Accordions vorhanden sind: nur behalten, wenn sie echten Mehrwert liefern. Sonst raus oder stark kürzen.

### 6. Module-Sektion straffen

Die Modul-Sektion soll Baukasten erklären, aber nicht wie ein Feature-Katalog erschlagen.

Fokus:

> Starten Sie mit einem Modul. Kombinieren Sie, was Ihr Betrieb braucht.

Telefon-Modul darf der Einstieg bleiben. Weitere Module kurz halten.

Bitte keine langen verschachtelten Cards. Lieber kurze Module mit Ergebnis-Fokus.

### 7. Workflow-Sektion prüfen

Wenn Workflow und Beispiel-Vorgang dieselbe Aussage doppeln, Workflow stärker verdichten.

Aussage reicht:

> Eingang rein → Modul fragt nach → Dringlichkeit markiert → Vorgang ans Team

### 8. Pricing/Pilot-Sektion fokussieren

Pilot-Sektion ist richtig. Bitte so schärfen, dass „30 Minuten Check“ als niedrigschwelliger Einstieg klar ist.

Empfohlene Sprache:

> Erst 30 Minuten prüfen. Dann einen Eingangskanal testen.

oder:

> 30-Minuten-Check. Ein Eingangskanal. Ein sauberer Pilot.

Pakete nur so viel erklären wie nötig. Nicht wie eine komplizierte SaaS-Tabelle wirken lassen.

### 9. FAQ kürzen

FAQ darf viele Fragen haben, aber Antworten müssen kurz sein. Wenn Accordion-Antworten sehr lang sind, komprimieren.

Priorität der FAQ:

1. Ist BaseModul ein Callcenter oder Telefonbot?
2. Muss der Assistent so tun, als wäre er ein Mensch?
3. Wo landet die fertige Anfrage?
4. Bleibt unser Team in Kontrolle?
5. Was passiert bei Notfällen?
6. Wie schnell ist ein Pilot aktiv?
7. Datenschutz/AVV/Server in Frankfurt
8. Ist basemodul.de ein Produkt von AGENTEQ?

### 10. Foto-&-Datei-Sektion jetzt NICHT groß ausbauen

Wichtig: Die Foto-&-Datei-Sektion wird anschließend separat aufgebaut.

In diesem Prompt nur:

- bestehende Foto-&-Datei-Inhalte nicht verschlechtern
- falls nötig minimal kürzen
- keine neue große Foto-Datei-Sektion bauen
- keine Kfz/Gutachter-Unterseite starten

Dafür gibt es einen separaten Prompt.

## Design-Regeln

- Dark Premium beibehalten.
- Keine neue Designrichtung.
- Keine neuen Dependencies.
- Mehr Weißraum/Negativraum ist okay.
- Cards weniger überladen.
- Mobile Lesbarkeit prüfen.
- Keine horizontalen Overflow-Probleme.

## Technische Regeln

- Keine Backend-Reaktivierung.
- Keine API-Routes aus `_parked` zurückholen.
- Keine echten externen Sends.
- Keine Secrets.
- Keine destruktiven Git-Aktionen.
- TypeScript sauber halten.

## Verifikation

Nach Änderung:

```bash
cd web
npm run build
```

Optional, wenn sinnvoll:

```bash
cd web
npm run dev
```

Dann im Browser kurz prüfen:

- Hero ist sichtbar und nicht überladen
- CTA „30-Minuten-Check buchen“ ist dominant
- Beispiel-Vorgang ist schneller erfassbar
- Seite wirkt insgesamt kompakter
- keine Hausverwaltung
- keine Callfolio-Begriffe
- Footer/Trust: AGENTEQ korrekt nur als Trust-Layer

## Ergebnisbericht

Am Ende knapp berichten:

- welche Komponenten geändert wurden
- welche Sektionen gekürzt wurden
- ob `npm run build` grün war
- 2–3 offene Empfehlungen, falls noch etwas zu voll wirkt

Kein langer Roman. Operativ, kurz, ehrlich.
