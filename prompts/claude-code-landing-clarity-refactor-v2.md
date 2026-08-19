# Claude Code Prompt: BaseModul Landing — Klarheit statt Ticket-System

Du arbeitest **im Root des BaseModul-Repositories**. Setze einen kontrollierten Refactor der bestehenden Next.js-Landing-Page um. Arbeite nicht an Backend, Telefonie oder API-Routen.

## Deine Aufgabe

Die Landing-Page von BaseModul soll leichter, klarer und weniger technisch wirken — **ohne die bestehende visuelle Premium-Richtung zu verlieren**.

BaseModul ist keine neue Ticket-Software und keine Integrationsplattform, die zuerst erklärt werden muss. Das Kernversprechen lautet:

> BaseModul nimmt unvollständige Anfragen entgegen, klärt die wichtigen Details und gibt dem Team alles gesammelt weiter.

Die Seite soll sich für einen lokalen Servicebetrieb nach einer praktischen Entlastung anfühlen, nicht nach einem komplexen Tool, das zusätzlich gepflegt werden muss.

## Zuerst lesen

Lies vor jeder Änderung diese Dateien in dieser Reihenfolge:

1. `CLAUDE.md`
2. `web/CLAUDE.md`
3. `web/components/landing/CLAUDE.md`
4. `DESIGN_BRIEF.md`
5. `BASEMODUL_LANDING_REFACTOR_PLAN.md`
6. `prompts/claude-code-landing-compression-and-cta.md`
7. `web/app/page.tsx`

Lies anschließend nur die Landing-Komponenten, die du tatsächlich ändern musst.

## Nicht verhandelbare Design- und Produktregeln

| Beibehalten | Nicht tun |
|---|---|
| Bestehende dunkle Premium-Ästhetik, Inter, viel Negativraum und Grün als einzige Akzentfarbe | Kein vollständiges Redesign, kein helles Theme und kein generischer SaaS-Template-Look |
| Hero-Headline: **„Weniger Telefonchaos. Mehr vollständige Anfragen.“** | Keine generische KI-/Automations-Headline |
| Telefon-Visual im Hero sowie dessen hohe visuelle Qualität | Hero nicht durch einen Screenshot, Terminal oder ein Dashboard ersetzen |
| Marke BaseModul im Vordergrund; AGENTEQ nur als Trust-/Anbieter-Layer | Kein AGENTEQ-Rebranding und kein Callfolio-Framing |
| Haupt-CTA: **„30-Minuten-Check buchen“** | Keine Vielzahl austauschbarer CTA-Texte für dieselbe Handlung |
| Fokus auf lokale Servicebetriebe | Keine Hausverwaltung, keine erfundenen Kundenlogos, Testimonials oder Kennzahlen |
| Bestehende gute Detailsektionen als spätere Vertiefung | Nicht einfach schöne Sektionen löschen, nur weil sie nicht in den ersten Scroll gehören |

## Ziel nach der Überarbeitung

Nach maximal zwei Scrollbewegungen muss klar sein:

1. **Für wen:** lokale Servicebetriebe mit Anruf-, WhatsApp-, Formular- oder Fotoanfragen.
2. **Welches Problem:** fehlende Angaben, Rückfragen, verlorene Anfragen und unklare Dringlichkeit.
3. **Was BaseModul macht:** wichtige Informationen werden abgefragt und gesammelt ans Team weitergegeben.
4. **Warum es leicht ist:** Start mit einem Eingangskanal im Pilot; das Team bleibt in Kontrolle.
5. **Was der nächste Schritt ist:** 30-Minuten-Check buchen.

Der Interessent darf diese Punkte verstehen, ohne oben auf der Seite Begriffe wie **„Vorgang“**, **„Modul“**, **„Eskalationslogik“**, **„Webhook“**, **„n8n“** oder eine Ticketnummer sehen zu müssen.

## Verbindliche Informationsarchitektur

Ordne die Landing in `web/app/page.tsx` in diesen Hauptpfad. Du darfst bestehende Komponenten umpositionieren, zusammenführen oder mit optionalen Detailzuständen versehen; vermeide eine unnötig große neue Komponentenarchitektur.

| Neue Reihenfolge | Bestehende Komponenten | Umsetzung |
|---:|---|---|
| 1 | `HeroSection` | Beibehalten und nur sparsam entschärfen. |
| 2 | `ProblemSection` plus ein kompaktes Element aus `UseCasesSection` | Problem vor Produktdetail: maximal drei klare Alltagsprobleme und ein belastbares Beispiel. |
| 3 | `WorkflowSection` | Genau drei einfache Schritte: Anfrage kommt rein → wichtige Details werden geklärt → Team erhält alles gesammelt. |
| 4 | `RequestArtifactSection` | Als leicht erfassbare Ergebnis-Karte, **nicht** als Ticket-/Dashboard-Ansicht. |
| 5 | `PricingSection` | Pilot früh und klar: ein Eingangskanal, echte Fälle, dann entscheiden. |
| 6 | `FaqSection` und vorhandene Trust-Elemente | Kontrolle, Datenschutz, Notfälle und Start beantworten. |
| 7 | `ModulesSection`, restliche Use Cases, `LiveDemoSection`, `VisualContextSection`, `IntegrationsSection` | Als optionale Vertiefung nach dem Hauptpfad; maximal so technisch, wie für interessierte Besucher nötig. |
| 8 | `LetsWorkTogether`, `Footer` | Abschluss-CTA und klare nächste Aktion. |

Wenn du aufgrund des bestehenden Scroll-/Anchor-Verhaltens eine leicht andere Reihenfolge wählst, begründe das kurz im Abschlussbericht. Der Hauptpfad muss jedoch vor allen umfangreichen Modul-, Demo- und Integrationsdetails stehen.

## Konkrete Änderungen

### 1. Hero nur enttechnisieren, nicht neu erfinden

Behalte die Headline, die zwei CTA-Stufen und das Telefon-Visual. Prüfe alle kleinen Badges, schwebenden Labels und Status-Texte. Der Status **„KI nimmt an“** soll wirkungsorientiert werden, zum Beispiel **„Anfrage wird aufgenommen“** oder **„Details werden geklärt“**. Reduziere zusätzliche Mikrocopy, wenn sie das Visual unruhig macht.

Die Subline soll kurz bleiben und in einfacher Sprache erklären, dass BaseModul Anfragen annimmt, fehlende wichtige Informationen nachfragt und dem Team alles gesammelt weitergibt. Keine technische Kanalliste als Hauptbotschaft.

### 2. Problem zuerst, kompakt und branchennah

Die heutige Problem-Sektion darf nicht wie eine lange Liste von Defiziten wirken. Fasse sie zu höchstens drei gut scannbaren Problemkarten zusammen. Nutze nur echte, bereits vorhandene Situationen wie Anrufe nach Feierabend, Fotos ohne Kontext und Formulare ohne Adresse.

Zeige danach **ein** kurzes, starkes Branchenbeispiel. Die weiteren Branchenfälle dürfen später bleiben oder als sehr kompakte Auswahl erscheinen.

### 3. Ablauf auf drei Ergebnis-Schritte reduzieren

Überarbeite `WorkflowSection` so, dass die visuelle Erklärung in fünf Sekunden lesbar ist:

> **Anfrage kommt rein → wichtige Details werden geklärt → Ihr Team erhält alles gesammelt.**

Die technische Kategorie „Dringlichkeit markieren“ kann innerhalb der Erklärung oder der Ergebnis-Karte vorkommen, aber kein gleichwertiger komplexer Zwischenschritt sein.

### 4. Die Beispiel-Anfrage von Ticket zu Ergebnis umbauen

Dies ist der wichtigste Eingriff. `RequestArtifactSection` soll beweisen, dass das Team eine brauchbare Anfrage bekommt, aber nicht wie eine Ticket-Oberfläche aussehen.

Im oberhalb des Piloten sichtbaren Zustand gelten diese Regeln:

- Entferne die Ticketnummer `#BM-2417`.
- Keine tabellenartige Liste mit acht Datenreihen.
- Kein dominanter Fachbegriff „Vorgang“ im Titel.
- Verwende zum Beispiel „Neue Anfrage für Ihr Team“.
- Zeige höchstens vier Informationsblöcke: **Kontakt/Ort**, **Anliegen**, **Dringlichkeit/Anhänge**, **nächster Schritt**.
- „Nächster Schritt: Bereitschaft ruft zurück“ muss die prominenteste Ergebniszeile sein.
- Die Info zur tatsächlichen Weitergabe (E-Mail und WhatsApp) darf als kleiner Glaubwürdigkeitsbeweis darunter stehen.
- Bewahre die starke visuelle Kartenqualität, aber reduziere Status-Chips, Metadaten und kleine Zeilen.

Wenn die frühere Detailansicht geschäftlich wichtig ist, biete sie nur weiter unten als Detailzustand oder innerhalb der späteren Vertiefung an.

### 5. Pilot als leichten Einstieg vor die Tiefe setzen

Ziehe die Pilot-Logik vor lange Moduldarstellungen, Live-Demo und technische Integrationen. Der Bereich muss in erster Linie verständlich machen:

> **Ein Eingangskanal. Ein sauberer Pilot. Echte Fälle. Dann entscheiden.**

`ab 750 €` darf transparent bleiben. Die beiden größeren Angebote sollen visuell klar nachrangig sein. CRM, Webhooks, n8n, individuelle Regeln und Eskalationslogik dürfen nicht die erste Preisentscheidung dominieren; verschiebe sie in Details oder eine zurückhaltende „später erweiterbar“-Zeile.

### 6. Tiefe behalten, aber deutlich nachrangig machen

Die vorhandenen visuellen Highlights sind wertvoll. Behalte sie, aber lagere sie hinter den Hauptpfad:

- `ModulesSection`: aus Feature-Katalog eine Auswahlhilfe machen: „Wenn es bei Telefon / WhatsApp / Fotos hakt, starten Sie dort.“
- `LiveDemoSection`: erst nach Pilot und FAQ oder klar als optionale Vertiefung.
- `VisualContextSection`: als schöner Spezialfall für Foto-/Dateianfragen weiter unten.
- `IntegrationsSection`: ganz einfach beginnen mit „Zum Start reicht Ihr Postfach oder WhatsApp“; technische Erweiterungen sekundär.

### 7. Navigation und CTA konsolidieren

Reduziere die Desktop-Navigation auf vier verständliche Orientierungspunkte, z. B. **So funktioniert’s**, **Für wen**, **Pilot**, **Fragen**, plus den CTA **„30-Minuten-Check buchen“**.

Vereinheitliche alle primären CTAs auf exakt **„30-Minuten-Check buchen“**. Sekundäre CTAs dürfen bewusst Details öffnen, etwa „Beispiel ansehen“ oder „Demo ansehen“, aber sie dürfen nicht mit dem primären Kontaktziel konkurrieren.

## Technische Leitplanken

- Nutze die vorhandene Next.js-/Tailwind-/Framer-Motion-Struktur und füge keine neuen Dependencies hinzu.
- Schreibe sauberes TypeScript und erhalte bestehende Interaktionen, sofern sie nicht dem neuen Hauptpfad widersprechen.
- Prüfe Desktop **und Mobile**. Kein horizontaler Overflow, keine abgeschnittenen CTA-Texte, keine unlesbaren Karten.
- Berücksichtige `prefers-reduced-motion` weiterhin.
- Keine Backend-Routen, API-Routen oder `_parked`-Bereiche reaktivieren.
- Keine Secrets, keine echten externen Sends, keine destruktiven Git-Aktionen und kein Commit ohne ausdrückliche Aufforderung.

## Arbeitsablauf

1. Lies die genannten Dateien.
2. Prüfe die relevante Komponentenhierarchie und beschreibe kurz deinen konkreten Änderungsplan in maximal zehn Zeilen.
3. Setze den Refactor anschließend vollständig um, ohne auf eine zusätzliche Bestätigung zu warten, sofern keine fachliche Kollision besteht.
4. Führe die Verifikation durch.
5. Berichte knapp und ehrlich über Ergebnis, Änderungen und Restpunkte.

## Verifikation

Führe mindestens aus:

```bash
cd web
npm run build
```

Starte anschließend die Website lokal und prüfe den Hauptpfad visuell auf Desktop und Mobile. Kontrolliere dabei insbesondere:

| Prüfkriterium | Muss erfüllt sein |
|---|---|
| Erstkontakt | Hero bleibt hochwertig, klar und nicht mit Mikrocopy überladen. |
| Verständlichkeit | Die drei Kernfragen — Problem, Wirkung, Einstieg — sind ohne Technikverständnis beantwortet. |
| Ticket-Eindruck | Die erste Ergebnis-Karte wirkt wie eine fertige Team-Anfrage, nicht wie ein Dashboard. |
| Reihenfolge | Pilot steht vor detaillierten Modulen, Audio-Demo und Integrationen. |
| Conversion | „30-Minuten-Check buchen“ ist durchgehend primär und führt sauber zum CTA-Ziel. |
| Responsivität | Keine Overflow-, Kontrast- oder Touch-Target-Probleme auf Mobile. |
| Qualität | `npm run build` läuft erfolgreich durch. |

## Abschlussbericht

Antworte am Ende kurz und operativ mit:

1. Den geänderten Dateien und ihrer Funktion.
2. Den Bereichen, die bewusst beibehalten und nur verschoben wurden.
3. Dem Ergebnis von `npm run build` und der visuellen Prüfung.
4. Höchstens drei offenen Empfehlungen.

Kein langer Roman. Keine Behauptungen über Conversion-Zahlen ohne Daten.
