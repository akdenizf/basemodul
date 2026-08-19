# BaseModule Landing-Refactor: Ausführungsplan

## Zielbild

Die bestehende Seite wird **nicht neu gestaltet**. Ihr dunkler, hochwertiger Look, die große Hero-Headline, das Telefon-Visual, die grüne Akzentfarbe und die besten anwendungsnahen Visuals bleiben erhalten. Der Refactor soll die Seite jedoch von einer ausführlichen Produktpräsentation zu einer klaren Verkaufsseite für lokale Servicebetriebe machen.

> Die Seite muss nach dem ersten Scrollen nicht wie ein Ticket-System, eine Integrationsplattform oder eine technische Produktdokumentation wirken. Sie soll sich wie eine praktische Arbeitserleichterung anfühlen: „Anfragen kommen vollständig bei meinem Team an.“

## Leitentscheidungen

| Entscheidung | Umsetzen | Nicht umsetzen |
|---|---|---|
| Visuelle Richtung | Dark Premium, Inter, Grün als Akzent und bestehende Kartenästhetik beibehalten. | Kein helles Redesign, kein neues Branding und kein Template-Look. |
| Hero | Headline und Telefon-Visual behalten; Microcopy im Visual reduzieren. | Keine neue Hero-Idee oder generische KI-Botschaft. |
| Produktmodell | Ein leichter Einstieg über **einen Kanal zuerst**. | Nicht alle Module, Integrationen und Sonderfälle oberhalb des Piloten erklären. |
| Beispiel-Anfrage | Ergebnisorientierte Karte als primären Beweis zeigen. | Kein Ticket-Dashboard, keine Ticketnummer und keine Feldwand im oberen Seitenbereich. |
| Tiefe | Detail-Module, Audio-Demo und Integrationen als optionale Vertiefung bewahren. | Gute Komponenten nicht einfach löschen, nur weil sie nicht in den Hauptpfad gehören. |

## Neue Seitenreihenfolge

| Reihenfolge | Bestehende Quelle | Refactor-Aufgabe | Ziel |
|---:|---|---|---|
| 1 | `HeroSection` | Beibehalten, nur kleine Labels und technische Statussprache reduzieren. | Sofortiger Wiedererkennungswert ohne KI-/System-Overload. |
| 2 | `ProblemSection` + Teile von `UseCasesSection` | Kompakter Problem-Beweis: drei typische Brüche im Alltag und ein kurzes Branchenbeispiel. | Besucher erkennt sich vor dem Produktdetail wieder. |
| 3 | `WorkflowSection` | Auf drei klar erkennbare Schritte reduzieren. | Das Produkt entmystifizieren. |
| 4 | `RequestArtifactSection` | Karte radikal vereinfachen und als Ergebnis zeigen. | „Fertige Anfrage für mein Team“ statt „Ticket-System“. |
| 5 | `PricingSection` | Pilot nach oben ziehen und auf „ein Kanal zuerst“ ausrichten. | Niedrigschwellige Kontaktentscheidung. |
| 6 | `TrustSection`/`FaqSection` | Teamkontrolle, Datenschutz und Notfallverhalten sichtbar machen. | Risiko und Einwände reduzieren. |
| 7 | `ModulesSection`, `LiveDemoSection`, `VisualContextSection`, `IntegrationsSection` | Als nachgelagerte Vertiefung beibehalten; technisch kürzen und bei Bedarf einklappbar machen. | Interessierte erhalten Tiefe, Erstbesucher bleiben nicht hängen. |
| 8 | `LetsWorkTogether` + `Footer` | Abschluss klar auf den 30-Minuten-Check ausrichten. | Ein durchgängiger Kontaktpfad. |

## Konkrete Eingriffe pro Komponente

| Komponente | Änderung | Bewusst behalten |
|---|---|---|
| `HeroSection.tsx` | Status „KI nimmt an“ in eine wirkungsorientierte Formulierung ändern; schwebende Mikro-Labels auf ein bis zwei reduzieren. | Headline, Telefon-Visual, zwei CTAs, Trust-Hinweis. |
| `ProblemSection.tsx` | Aus neun Einzelpunkten drei gruppierte Problemkarten machen. | Realitätsnahe Schmerzpunkte. |
| `UseCasesSection.tsx` | Nicht als eigener langer Block vor dem Pilot; nur ein starkes Beispiel im Hauptpfad. Rest als spätere Auswahl. | SHK, Kfz und Entrümpelung als Branchenbeweise. |
| `WorkflowSection.tsx` | Vier technische Schritte auf drei Ergebnis-Schritte verdichten. | Die klare Ablaufidee. |
| `RequestArtifactSection.tsx` | Ticketnummer, Metadaten und die Tabellenwirkung entfernen; höchstens vier Informationsblöcke plus „Nächster Schritt“. | Der sichtbare Beweis einer vollständigen Anfrage. |
| `PricingSection.tsx` | Pilot als dominanten Startpunkt zeigen; technische Custom-Details nachrangig behandeln. | Transparenz mit „ab 750 €“ und ein klarer CTA. |
| `ModulesSection.tsx` | In „Wenn es bei X hakt, starte mit Y“ übersetzen; keine Feature-Katalog-Anmutung. | Telefon-Modul als stärkster erster Einstieg. |
| `LiveDemoSection.tsx` | Nach Pilot/FAQ platzieren oder in einen optionalen Detailbereich legen. | Die aufwändige Demo-Substanz und vorhandene Interaktion. |
| `VisualContextSection.tsx` | Nicht als zweiter großer Product-Proof vor dem Pilot; als späterer Spezialfall für Fotos verwenden. | Die schöne Bild-/Datei-Story. |
| `IntegrationsSection.tsx` | „Postfach/WhatsApp reicht zum Start“ sichtbar machen; technische Integrationen nur sekundär. | Glaubwürdigkeit der Anschlussfähigkeit. |
| `Navbar.tsx` | Auf „So funktioniert’s“, „Für wen“, „Pilot“, „Fragen“ plus CTA reduzieren. | Sticky Verhalten, Logo und dominanter CTA. |

## Akzeptanzkriterien

Die Umsetzung ist erst fertig, wenn die folgenden Aussagen bei einem kurzen visuellen Durchgang erfüllt sind.

| Kriterium | Prüffrage |
|---|---|
| Klarheit | Versteht man im ersten Viewport für wen BaseModule ist, welches Problem es löst und was als Nächstes passiert? |
| Leichtigkeit | Kann man den Nutzen verstehen, ohne „Modul“, „Vorgang“, „Eskalationslogik“, „Webhook“ oder „n8n“ gelesen zu haben? |
| Keine Ticket-Anmutung | Wirkt die erste Ergebnisdarstellung wie eine hilfreiche Anfrage für das Team statt wie ein System-Dashboard? |
| Visuelle Kontinuität | Wirkt die Seite noch eindeutig wie die vorhandene Premium-Landing, nicht wie ein neues Theme? |
| Fokus | Erscheint der Pilot vor tiefen Modul-, Integrations- und Demo-Erklärungen? |
| Conversion | Ist „30-Minuten-Check buchen“ der klare primäre CTA und im Ablauf konsistent? |
| Qualität | Bestehen Build, mobile Layout und horizontale Overflow-Prüfung? |

## Empfohlene Arbeitsweise mit Claude Code

Der nächste Schritt ist ein **einziger kontrollierter Refactor-Commit**. Claude Code soll zunächst alle relevanten Anweisungsdateien lesen, dann einen knappen Änderungsplan nennen und erst anschließend implementieren. Vor dem Abschluss muss der Build laufen und das Ergebnis in einer lokalen Browser-Session visuell gegengeprüft werden.

Eine separate, zweite Iteration ist sinnvoll, wenn nach dem ersten Build noch einzelne Visuals zu technisch wirken. Dann werden nur diese Komponenten nachjustiert — ohne die Informationsarchitektur erneut aufzureißen.

## Grenzen des Refactors

Es werden keine Backend-Routen reaktiviert, keine neuen externen Dienste oder Abhängigkeiten eingeführt, keine realen Nachrichten versendet und keine Produktclaims erfunden. AGENTEQ bleibt Vertrauens-/Anbieter-Layer; BaseModule bleibt die sichtbare Marke.
