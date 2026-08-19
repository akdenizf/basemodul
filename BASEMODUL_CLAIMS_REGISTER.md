# BaseModule Claims Register

**Zweck:** Freigabegrundlage für Website, Landingpages, Demo, Angebot, Sales, Outreach und Case Studies.
**Regel:** Extern wird nur genutzt, was den Status **Freigegeben** oder **Bedingt freigegeben** mit der angegebenen Einschränkung hat.

> Dieses Register ersetzt keine Rechtsprüfung. Bei Datenverarbeitung, Telefonie/Messaging, Hosting, Verfügbarkeit, Integrationen und Vertrags-/Preisaussagen sind technische, vertragliche und gegebenenfalls rechtliche Prüfungen vor konkreter Kundennutzung erforderlich.

## 1. Statuslogik

| Status | Bedeutung | Externe Verwendung |
|---|---|---|
| **Freigegeben** | Aussage ist produktstrategisch klar und mit Produkt-/Prozessbeleg hinterlegt. | Ja, in der vorgegebenen Form. |
| **Bedingt freigegeben** | Aussage ist richtig, benötigt aber Kunden-, Kanal- oder Scope-Kontext. | Ja, nur mit der Einschränkung. |
| **Pilotbeleg erforderlich** | Wirkung soll erst nach realer Messung behauptet werden. | Nein, bis Scorecard/Case vorliegt. |
| **Technik-/Rechtsprüfung offen** | Tatsächliche Architektur, Vertrag, Datenfluss oder rechtliche Voraussetzung ist noch zu prüfen. | Nein; neutrale Prozesssprache verwenden. |
| **Nicht verwenden** | Zu absolut, nicht belegbar oder außerhalb der Produktgrenzen. | Nein. |

## 2. Freigegebene Kernbotschaften

| ID | Aussage | Status | Zulässige Formulierung | Beleg / Prüfquelle | Grenze |
|---|---|---|---|---|---|
| BM-01 | Kernversprechen | **Freigegeben** | „BaseModule sorgt dafür, dass aus jeder relevanten Kundenanfrage ein sauberer nächster Schritt wird.“ | `PRODUCT_ARCHITECTURE.md`. | Kein Umsatz-, Zeit- oder Erreichbarkeitsversprechen implizieren. |
| BM-02 | Ein klarer Eingangskanal | **Freigegeben** | „Wir beginnen mit einem Eingangskanal, an dem heute Anfragen oder Zeit verloren gehen.“ | Produktarchitektur, Pilot-Scope. | Kanal ist im Einzelfall Telefon, WhatsApp, Web oder Foto/Datei — nicht automatisch alle. |
| BM-03 | Strukturierte Übergabe | **Bedingt freigegeben** | „BaseModule nimmt die vereinbarten Informationen auf und übergibt Ihrem Team einen klaren nächsten Schritt mit Kontext.“ | Pilot-Scope, Testfälle. | Vollständigkeit hängt von vereinbarten Pflichtfeldern und den Angaben der anfragenden Person ab. |
| BM-04 | Priorisierung | **Bedingt freigegeben** | „Anfragen werden nach den mit Ihrem Betrieb abgestimmten Regeln eingeordnet und übergeben.“ | Konfiguration, Testfälle, Scope. | Keine fachlich verbindliche Endentscheidung durch das System behaupten. |
| BM-05 | Menschlicher Fallback | **Freigegeben** | „Unklare oder kritische Fälle folgen einer klaren menschlichen Übergabe.“ | Produktarchitektur, Pilot-Scope. | Erreichbarkeit und konkrete Notfallregel sind kundenspezifisch. |
| BM-06 | Modulare Erweiterung | **Freigegeben** | „Wir erweitern erst, wenn der erste Ablauf im Alltag nachweislich funktioniert.“ | Produktarchitektur, Delivery Playbook. | Kein Versprechen, dass jedes Zusatzmodul für jeden Betrieb sinnvoll ist. |
| BM-07 | Foto-/Dateikontext | **Bedingt freigegeben** | „Bei passenden Fällen kann BaseModule Fotos oder Unterlagen mit dem richtigen Kontext anfordern und zuordnen.“ | Produktarchitektur, kundenfreigegebener Testfall. | Nur bei vereinbartem Kanal, Zweck und Datenfluss. |

## 3. Angebots- und Pilotaussagen

| ID | Aussage | Status | Zulässige Formulierung | Beleg / Prüfquelle | Grenze |
|---|---|---|---|---|---|
| BM-10 | 30-Tage-Pilot | **Freigegeben** | „Wir testen einen klar begrenzten Anfrage-Eingang 30 Tage lang mit einer gemeinsamen Scorecard.“ | `PILOT_DELIVERY_PLAYBOOK.md`, Pilot-Scope. | Produktivstart erst nach Go-live-Freigabe. |
| BM-11 | SHK-Founding-Pilot | **Bedingt freigegeben** | „Der SHK-Anfrage-Eingang Pilot startet bei 1.250 € einmalig, zuzüglich externer Nutzungs-/Messagingkosten nach tatsächlichem Verbrauch.“ | `outreach/playbooks/SHK_PILOT_PLAYBOOK.md`, individueller Scope. | Nur bei bestätigtem SHK-Standardumfang; Angebot und Steuerangaben prüfen. |
| BM-12 | Allgemeiner Anfrage-Eingang | **Bedingt freigegeben** | „Ein einfacher Anfrage-Eingang startet ab 750 € Setup.“ | Aktuelle Landing-Pricing-Section. | Kein Pauschalpreis: Kanal, Daten, Regeln und Nutzungskosten vorher klären. |
| BM-13 | Dauerbetrieb | **Bedingt freigegeben** | „Nach einem erfolgreichen Pilot wird der passende Betriebsumfang separat vereinbart.“ | Offer-Architektur, individueller Scope. | Monatspreis nur mit aktueller Angebotsfreigabe nennen; SHK-Playbook zeigt derzeit 299–499 €/Monat als Orientierung. |
| BM-14 | Pilot-Scorecard | **Freigegeben** | „Wir messen echte Eingänge, vollständige Übergaben, Zeit bis zur Team-Übergabe, Korrekturen und Fallbacks.“ | Delivery Playbook. | Keine Kennzahl schätzen oder ohne Zeitraum/Datenquelle interpretieren. |

## 4. Aussagen mit Pilotbeleg

| ID | Gewünschte Aussage | Status | Wann freigeben | Bis dahin zulässige Alternative |
|---|---|---|---|---|
| BM-20 | „Kein qualifizierter Anruf und keine relevante Anfrage geht verloren.“ | **Pilotbeleg erforderlich** | Nach klarer Baseline und Messung im konkreten Kanal. | „Wir starten dort, wo Anfragen oder Zeit verloren gehen, und prüfen die Wirkung mit einer Scorecard.“ |
| BM-21 | „X % weniger verpasste Anfragen.“ | **Pilotbeleg erforderlich** | Nach Vorher-/Nachher-Vergleich mit gleicher Definition und Zeitraum. | „Der Pilot macht sichtbar, welche Anfragen vollständig übernommen werden.“ |
| BM-22 | „X Stunden weniger Aufwand.“ | **Pilotbeleg erforderlich** | Nach nachvollziehbarer Zeitmessung und Kundenfreigabe. | „Wir prüfen, ob wiederkehrende Aufnahme- und Rückfragearbeit im Team sinkt.“ |
| BM-23 | „Mehr Termine / mehr Umsatz.“ | **Pilotbeleg erforderlich** | Nach eindeutiger Zuordnung von Eingang zu Termin/Auftrag und Kundenfreigabe. | „Termin- und Rückrufquote werden im Pilot als nächster Schritt betrachtet.“ |
| BM-24 | Kundenlogo, Testimonial oder Case Study | **Pilotbeleg erforderlich** | Nach schriftlicher Freigabe des Kunden und dokumentierter Wirkung. | Anonymisierte interne Learnings ohne externe Zuordnung. |

## 5. Technik-, Daten- und Rechtsaussagen

| ID | Aussage | Status | Warum offen | Bis zur Freigabe zulässige Sprache |
|---|---|---|---|---|
| BM-30 | „DSGVO-konform“ | **Technik-/Rechtsprüfung offen** | Abhängig von konkretem Datenfluss, Diensten, Rollen, Auftragsverarbeitung, TOMs und Kundenkonfiguration. | „Datenverarbeitung, Zuständigkeiten und erforderliche Freigaben werden vor Go-live pro Pilot geklärt.“ |
| BM-31 | „24/7 erreichbar“ | **Bedingt freigegeben** | Kanalverfügbarkeit, Weiterleitung, menschliche Bereitschaft und Servicezeit sind zu unterscheiden. | „Der Eingangskanal folgt der im Scope vereinbarten Erreichbarkeits- und Übergaberegel.“ |
| BM-32 | „Notdienst wird automatisch gelöst“ | **Nicht verwenden** | BaseModule darf keine autonome fachliche/operative Notfallentscheidung suggerieren. | „Kritische Fälle werden nach einer klaren kundenspezifischen Regel an Menschen eskaliert.“ |
| BM-33 | „Integration mit {{System}}“ | **Technik-/Rechtsprüfung offen** | Tiefe, Datenfluss, Aufwand und Freigabe sind systemspezifisch. | „Bestehende Übergabewege werden im Pilot geprüft; Integrationen werden separat gescopt.“ |
| BM-34 | „WhatsApp-Integration“ | **Technik-/Rechtsprüfung offen** | Kanal, Opt-in, Template-/Messaging-Regeln und Datenfluss sind vor Go-live zu prüfen. | „WhatsApp kann bei passendem Use Case als separater Eingangskanal geprüft werden.“ |
| BM-35 | „Antwort in Sekunden“ | **Technikprüfung offen** | Mess- und Verfügbarkeitsbedingungen müssen präzise definiert sein. | „Anfragen werden nach der vereinbarten Logik erfasst und übergeben.“ |

## 6. Nicht verwenden

| ID | Nicht zulässige Aussage | Grund | Erlaubte Alternative |
|---|---|---|---|
| BM-40 | „Wir ersetzen Ihre Mitarbeiter.“ | Falsche, risikoreiche und nicht produktkonforme Positionierung. | „Wir entlasten Ihr Team bei Aufnahme, Strukturierung und Übergabe wiederkehrender Anfragen.“ |
| BM-41 | „Wir bauen autonome KI-Agenten für alles.“ | Zu breit, nicht überprüfbar und außerhalb der produktisierten Angebotslogik. | „Wir beginnen mit einem klaren operativen Eingang und erweitern nur bei belegtem Wert.“ |
| BM-42 | „Garantiert mehr Umsatz / ROI.“ | Kundenspezifische Wirkung kann nicht vorab garantiert werden. | „Wirkung wird im Pilot mit echten Daten gemessen.“ |
| BM-43 | „Komplettsystem in wenigen Tagen.“ | Übersieht Scoping, Daten, Fallback, Tests und Freigaben. | „Produktivstart erfolgt nach gemeinsamem Scope, Testfällen und Go-live-Freigabe.“ |
| BM-44 | „Rechtssichere Dokumentation.“ | Rechtliche Wirkung entsteht nicht allein durch eine Produktfunktion. | „Nachvollziehbare, strukturierte Übergabe.“ |
| BM-45 | „Vollautomatisch.“ | Verschleiert menschliche Verantwortung und definierte Grenzen. | „Nach abgestimmten Regeln vorbereitet und an Ihr Team übergeben.“ |

## 7. Freigabeprozess

| Schritt | Verantwortlich | Ergebnis |
|---|---|---|
| Produktverantwortung prüft Funktionsumfang und Grenze. | BaseModule Product Owner. | Statusvorschlag mit Produktbeleg. |
| Technik prüft Kanal, Integration und tatsächliche Betriebsbedingung. | BaseModule Technical Owner. | Technischer Beleg oder Einschränkung. |
| Bei Daten/Vertrag prüft die zuständige Stelle. | BaseModule bzw. Kunde je Kontext. | Dokumentierte Freigabe oder neutrale Prozessformulierung. |
| Sales, Landing und Demo übernehmen nur freigegebene Formulierungen. | BaseModule Go-to-Market. | Einheitliche Angebotskommunikation. |
| Pilotwerte werden nach Abschluss mit Zeitraum, Methode und Kundenfreigabe bewertet. | Delivery Owner + Kunde. | Freigegebene Case-Study- oder Wirkungsclaims. |

## 8. Pflege

- Vor jeder Änderung von Preis, Paket, Landing oder Demo dieses Register gegen `PRODUCT_ARCHITECTURE.md`, `OFFER.md` und die aktuelle Website prüfen.
- Jede neue Integration und jeder neue Kanal startet mit Status **Technik-/Rechtsprüfung offen**.
- Jede Wirkungsbehauptung startet mit Status **Pilotbeleg erforderlich**.
- Im Zweifel immer die weniger absolute, prozessbezogene Formulierung verwenden.
