# BaseModul — Pilot-Scorecard & Delivery-Matrix

> **Verbindliche Referenz für Angebot, Scoping, Umsetzung, Reporting und Upsell-Entscheidungen.**
>
> Stand: 19. August 2026

## 1. Ziel des Pilotmodells

BaseModul verkauft im ersten Schritt keinen abstrakten KI-Agenten. Es löst innerhalb eines klaren Zeitraums ein konkretes Anfrageleck und macht die Wirkung sichtbar.

> **Pilot-Out­come:** Verpasste oder unvollständige Anfragen werden in vollständige Rückrufe, Termine oder priorisierte Team-Übergaben verwandelt.

Jeder Pilot startet mit **einem definierten Eingangskanal**. Das kann Telefon, WhatsApp, Webformular oder ein Foto-/Dokumenteneingang sein. Mehrere Kanäle und zusätzliche Betriebs-Agenten werden erst ergänzt, wenn der erste Ablauf nachweislich funktioniert.

## 2. Der feste 30-Tage-Pilot

| Phase | Zeitraum | Ergebnis | Verantwortung |
|---|---:|---|---|
| **Scoping & Baseline** | Tag 0–5 | Eingangskanal, Fragen, Zuständigkeiten, Eskalationsregeln, Datenfluss und verfügbare Ausgangsdaten festgelegt | BaseModul + Kundenverantwortliche Person |
| **Konfiguration & Test** | Tag 6–12 | Testflow, Beispielanfragen, menschliche Übergabe und Fallback geprüft | BaseModul, Kundenfreigabe vor Go-live |
| **Produktiver Pilot** | Tag 13–30 | Reale Anfragen werden nach den definierten Regeln strukturiert aufgenommen und dokumentiert | Betrieb, BaseModul-Monitoring |
| **Auswertung & Entscheidung** | Tag 30 | Scorecard, Fehlerbild, Wirkung und nächster sinnvoller Schritt besprochen | BaseModul + Entscheider |

Der konkrete Startzeitpunkt kann variieren. Entscheidend ist: Ohne dokumentierte Ausgangslage und Freigabe der Übergaberegeln geht kein Pilot produktiv.

## 3. Pilot-Scorecard

Die Scorecard verwendet echte Betriebsdaten des Kunden. Wenn eine Kennzahl vorab nicht erhoben wird, wird sie als **nicht verfügbar** gekennzeichnet – sie wird niemals geschätzt oder künstlich ergänzt.

| Kennzahl | Definition | Baseline | Pilot | Interpretation |
|---|---|---|---|---|
| **Relevante Eingänge** | Anzahl der Anfragen im gewählten Kanal, die potenziell einen Auftrag, Termin oder Rückruf auslösen | Vor Pilot, gleicher Zeitraum | Während Pilot | Bezugsgröße; keine Erfolgsmessung ohne Volumen |
| **Nicht angenommene Eingänge** | Telefon: nicht vom Team beantwortete Anrufe; andere Kanäle: nicht fristgerecht bearbeitete Erstkontakte | Vor Pilot | Während Pilot | Kernindikator für das geschlossene Anfrageleck |
| **Vollständige Übergaben** | Anfrage enthält Kontakt, Anliegen und die vorher festgelegten Pflichtfelder | Vor Pilot, falls messbar | Während Pilot | Qualitätsmaß des Moduls |
| **Zeit bis Team-Übergabe** | Zeit zwischen Eingang und dokumentierter Zustellung an das zuständige Team | Vor Pilot, falls verfügbar | Während Pilot | Operative Geschwindigkeit; Median plus Ausreißer beachten |
| **Termin-/Rückrufquote** | Anteil qualifizierter Anfragen mit verbindlichem nächstem Schritt gemäß Kundenprozess | Vor Pilot, falls verfügbar | Während Pilot | Conversion-nahe Wirkung ohne Umsatzgarantie |
| **Terminshow-Rate** | Anteil wahrgenommener Termine, wenn Terminierung Teil des Pilots ist | Vor Pilot, falls verfügbar | Während Pilot | Relevant für Reminder- und Übergabequalität |
| **Menschliche Korrekturen** | Fälle, in denen Team Daten, Priorität oder nächsten Schritt korrigieren musste | Nicht anwendbar | Während Pilot | Sicherheits- und Reifeindikator; sinkender Wert ist wünschenswert |
| **Eskalationen / Fallbacks** | Übergaben an Menschen, weil Regeln, Vertrauen oder Kontext eine Automatisierung begrenzen | Nicht anwendbar | Während Pilot | Kein Fehler an sich; zeigt, ob Guardrails passend gesetzt sind |

### Reporting-Regeln

- Die Scorecard wird **wöchentlich** aktualisiert, inklusive kurzer qualitativer Beobachtungen.
- Zahlen sind immer mit Zeitraum, Datenquelle und Definition versehen.
- Eine höhere Zahl an erfassten Eingängen kann positiv sein, wenn zuvor Anfragen unsichtbar verloren gingen. Sie wird deshalb nie isoliert als „Erfolg“ oder „Misserfolg“ gedeutet.
- Umsatz wird nur berichtet, wenn der Kunde eine nachvollziehbare Zuordnung von Anfrage zu Auftrag zulässt. BaseModul verspricht keinen Umsatz oder ROI.
- Kritische Fehler, falsche Priorisierungen oder Datenschutz-/Sicherheitsbedenken werden sofort als Go-live-Blocker behandelt, nicht bis zum Abschlussbericht gesammelt.

## 4. Das wöchentliche Pilot-Review

| Frage | Zweck | Mögliche Folgeaktion |
|---|---|---|
| Welche Anfragen waren vollständig und hilfreich? | Nutzen sichtbar machen | Fragen/Flow beibehalten |
| Wo fehlte Kontext oder entstand Rückfrageaufwand? | Prompt, Pflichtfelder und Übergabe verbessern | Eine zusätzliche Rückfrage oder ein Pflichtfeld ergänzen |
| Welche Übergaben gingen an die falsche Stelle? | Zuständigkeitslogik prüfen | Routing-Regel nachschärfen |
| Welche Fälle mussten Menschen übernehmen? | Guardrails statt Autonomie ausbauen | Fallback früher auslösen |
| Welcher Schritt kostet das Team weiterhin Zeit? | Potenzielles Erweiterungsmodul erkennen | Erst nach Pilot als Modulvorschlag formulieren |

## 5. Delivery-Matrix

Die Matrix verhindert, dass jeder Kundenwunsch als individuelles Sonderprojekt in den Pilot rutscht. Sie bestimmt Angebot, Lieferzeit, Preislogik, Testtiefe und Freigabe.

| Klasse | Definition | Beispiele | Delivery-Regel | Verkauf / Preislogik |
|---|---|---|---|---|
| **A – Standardisiert** | Wiederholbarer Ablauf mit festem Fragenkatalog, klarer Übergabe und geringem Integrationsrisiko | Telefonannahme mit Rückrufnotiz, WhatsApp-Vorqualifizierung, Webformular mit Pflichtfeldern, Foto-Nachforderung | Vorkonfigurierter Pilot; wenige kundenspezifische Regeln; manueller Fallback | Anfrage-Eingang / Pilot |
| **B – Konfigurierbar** | Bekannte Module, aber kundenspezifische Regeln, mehrere Kanäle oder bestehende Tools | Terminlogik, Notdienst-Routing, Kalenderanbindung, E-Mail-/WhatsApp-Übergabe, Ticketing, mehrere Standorte | Discovery, Testfälle, definierte Schnittstellen, Abnahme-Checkliste | Anfrage-Flow / Modul |
| **C – Custom** | Geschäftsprozess ist individuell, integrativ oder risikoreicher; sauberer Projektzuschnitt nötig | CRM-Workflow, Angebotsvorbereitung, Disposition, internes Wissen, individuelles Reporting | Separates Scoping, Architektur, Daten-/Rollenmodell, Freigabe-Gates und Projektplan | Betriebs-Agenten / Custom |
| **D – Nicht im Angebot** | Hohe regulatorische Risiken, autonome verbindliche Entscheidung oder kein klarer Prozesswert | Medizinische/rechtliche Entscheidungen, autonome Preis-/Vertragszusage, ungeprüfte Reaktivierung, generisches „KI für alles“ | Ablehnen, vereinfachen oder auf menschlich freigegebenen Teilprozess zurückführen | Kein Angebot im BaseModul-Standard |

### Klare Kategorisierungsfragen

Vor jedem Angebot beantwortet BaseModul diese Fragen schriftlich:

1. **Welcher Eingang oder Prozess verliert heute nachweislich Zeit oder Anfragen?**
2. **Welche Pflichtinformationen muss das Team vor dem ersten Rückruf oder Termin haben?**
3. **Was ist der sichere Standard-Fallback, wenn der Agent den Fall nicht eindeutig einordnen kann?**
4. **Ist das Ergebnis eine unverbindliche Vorbereitung oder eine verbindliche Entscheidung?**
5. **Wie wird Wirkung in 30 Tagen gemessen?**

Kann eine dieser Fragen nicht beantwortet werden, wird kein produktiver Pilot zugesagt. Dann folgt zuerst Discovery oder eine engere Problemdefinition.

## 6. Entscheidungslogik nach dem Pilot

| Scorecard-Bild | Entscheidung | Nächster Schritt |
|---|---|---|
| Vollständige Übergaben und gute Teamakzeptanz; wenige Korrekturen | **Ausbauen** | Passendes Modul ergänzen, etwa Termin, Foto/Datei oder Ticketing |
| Wirkung sichtbar, aber einzelne Fragen/Regeln schwach | **Nachschärfen** | Flow für einen begrenzten Zeitraum stabilisieren; kein zweites Modul voreilig hinzufügen |
| Hoher manueller Aufwand oder fehlende Datenbasis | **Vereinfachen** | Eingang enger definieren oder auf einen human-in-the-loop-Prozess zurückbauen |
| Kein relevanter Eingangsdruck oder kein messbarer Nutzen | **Pausieren** | Nicht romantisieren; Hypothese, Segment oder Kanal überprüfen |
| Neuer klarer Backoffice-Engpass nachweisbar | **Custom prüfen** | Betriebs-Agenten als eigenes Scoping behandeln, nicht still in den Bestandspilot aufnehmen |

## 7. Verbindliche Mindestartefakte je Kunde

Vor Go-live liegen mindestens diese Artefakte vor:

- einseitiger Pilot-Scope mit Ziel, Kanal, Pflichtfeldern, Zuständigkeiten und Fallback;
- Testfall-Liste mit Normalfall, unvollständiger Anfrage, kritischem Fall und menschlicher Übergabe;
- freigegebene Übergabenachricht bzw. Ticketstruktur;
- Scorecard mit Datenquellen und Ausgangslage;
- Dokumentation der Datenverarbeitung, Speicherorte und Löschfristen;
- Go-live-Freigabe durch eine benannte Person auf Kundenseite.

## 8. Angebotsformulierung

> Wir starten mit einem Eingangskanal und machen sichtbar, ob aus verpassten oder unvollständigen Anfragen vollständige nächste Schritte werden. Erst wenn der Ablauf im Alltag funktioniert, erweitern wir ihn um weitere Module.

Diese Formulierung schützt den Fokus, stellt den Nutzen vor die Technik und schafft eine ehrliche Erweiterungslogik.
