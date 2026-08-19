# BaseModule — Support und Eskalation im 30-Tage-Pilot

> Diese Vorlage beschreibt den Arbeitsweg für den konkreten Pilot. Sie begründet keine pauschale Service-Level-, Verfügbarkeits- oder Reaktionszeitgarantie.

| Kunde / Betrieb | `{{Betriebsname}}` |
|---|---|
| Scope-ID | `{{BM-PILOT-JJJJ-NNN}}` |
| Eingangskanal | `{{Telefon / WhatsApp / Web / Foto-Datei}}` |
| Produktivstart | `{{TT.MM.JJJJ}}` |
| Kundenseitige Pilotverantwortung | `{{Name, E-Mail, Telefon}}` |
| BaseModule Delivery Owner | `{{Name, E-Mail, Telefon}}` |
| Technischer Kontakt | `{{Name, E-Mail, Telefon}}` |

## 1. Wofür dieser Leitfaden gilt

Der Leitfaden gilt für den im Scope festgelegten Eingangskanal, die vereinbarten Anfragearten, die benannten Empfänger und die menschliche Fallback-Regel. Neue Kanäle, Integrationen, Kategorien oder Produktwünsche sind keine Supportfälle, sondern Scope- oder Erweiterungsentscheidungen.

## 2. Erster Kontaktweg

| Anliegen | Kontaktweg | Benötigte Angaben |
|---|---|---|
| Anfrage kommt nicht oder unvollständig an | `{{Support-E-Mail / Ticketweg}}` | Scope-ID, Zeitpunkt, Fallreferenz soweit zulässig, erwartete und tatsächliche Übergabe. |
| Eingangskanal / Erreichbarkeit auffällig | `{{Support-E-Mail / Telefon}}` | Zeitpunkt, Kanal, beobachtetes Verhalten, Rückrufkontakt. |
| Unklarer oder potenziell kritischer Fall | Zuerst kundenseitige Fallback-Regel. Danach BaseModule informieren. | Fallreferenz, angewandte Regel, erreichbare Verantwortliche. |
| Datenschutz-/Sicherheitsfrage | `{{Datenschutzkontakt}}` | Kurzbeschreibung, Scope-ID, sichere Rückkontaktmöglichkeit. |
| Wunsch nach neuer Funktion / Kanal | `{{Delivery Owner}}` | Gewünschter Nutzen, betroffener Prozess, Dringlichkeit. |

## 3. Priorisierung im Pilot

| Klasse | Beispiel | Erster Schritt | Ziel des Pilotprozesses |
|---|---|---|---|
| **A — Pilotablauf blockiert** | Vereinbarter Eingang oder Übergabeweg funktioniert nicht wie freigegeben. | Kundenseitigen Fallback aktivieren; Störung dokumentieren und melden. | Betrieb absichern und Fehler beheben. |
| **B — Anfragequalität beeinträchtigt** | Pflichtinformation oder Zuordnung fehlt wiederholt. | Fall im Weekly Review bzw. bei Häufung sofort melden. | Regel oder Rückfrage gezielt nachschärfen. |
| **C — Verständnis / Bedienung** | Team hat Frage zu Übergabe, Kategorie oder Scorecard. | Delivery Owner kontaktieren. | Klarheit schaffen, ohne Scope auszuweiten. |
| **D — Erweiterungswunsch** | Zweiter Kanal, Integration, neue Datenquelle oder automatisierte Folgeaktion. | Als Erweiterung dokumentieren. | Separat bewerten, nicht still im Pilot umsetzen. |

## 4. Fallback hat Vorrang

Bei unklaren oder potenziell kritischen Fällen gilt immer die im Scope dokumentierte kundenspezifische menschliche Fallback-Regel. BaseModule trifft keine fachliche, preisliche, vertragliche oder operative Sachentscheidung und ersetzt keinen kundenseitigen Bereitschafts- oder Notfallprozess.

| Fall | Kundenseitige Regel / Ansprechpartner |
|---|---|
| Unvollständige Anfrage | `{{}}` |
| Ort / Auftrag nicht zuordenbar | `{{}}` |
| Potenziell kritischer Fall | `{{}}` |
| Technischer Ausfall | `{{}}` |

## 5. Änderungsweg

| Art der Änderung | Beispiel | Umgang |
|---|---|---|
| Sofortige Fehlerkorrektur | Freigegebene Regel wurde technisch nicht wie vereinbart ausgeführt. | Dokumentieren, prüfen, korrigieren, mit Testfall bestätigen. |
| Begrenzte Pilotanpassung | Pflichtfrage, Prioritäts- oder Übergaberegel wird präzisiert. | Im Review freigeben, dokumentieren, gezielt testen. |
| Erweiterung | Zweiter Kanal, Foto-/Datei-Flow, Integration oder neue Datenquelle. | Separaten Scope, Aufwand, Preis und Daten-/Freigabecheck erstellen. |

## 6. Weekly Review und Transparenz

Der reguläre Steuerungspunkt ist der gemeinsame Weekly Review mit der `BASEMODUL_WEEKLY_PILOT_SCORECARD.md`. Dort werden Qualität, Fallbacks, offene Aufgaben und mögliche begrenzte Anpassungen dokumentiert.
