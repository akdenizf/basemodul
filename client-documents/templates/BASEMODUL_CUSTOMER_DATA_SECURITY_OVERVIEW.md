# BaseModul — Daten- und Sicherheitsübersicht für den Pilot

> **Arbeitsentwurf vor Technik- und Rechtsprüfung.** Diese Übersicht erklärt den vorgesehenen Pilotablauf. Sie ersetzt keine Auftragsverarbeitungsvereinbarung, individuelle Datenschutzberatung oder technische Vertragsanlage.

| Pilot | `{{BM-PILOT-JJJJ-NNN}}` |
|---|---|
| Kunde | `{{Betrieb}}` |
| Kanal | `{{Telefon / WhatsApp / Web / Foto-Datei}}` |
| Produktivstart | `{{TT.MM.JJJJ}}` |
| Technische Kontaktperson | `{{Name, E-Mail}}` |
| Datenschutzkontakt Kunde | `{{Name, E-Mail}}` |

## 1. Wofür Daten im Pilot verwendet werden

BaseModul unterstützt ausschließlich den vereinbarten Anfrage-Eingang. Die Datenverarbeitung soll sich auf Aufnahme, Strukturierung, Übergabe und die gemeinsame Pilot-Scorecard beschränken.

| Verarbeitungsschritt | Zweck | Beispieldaten | Kundenspezifische Festlegung vor Go-live |
|---|---|---|---|
| Anfrage-Eingang | Anfrage aufnehmen und nach vereinbarten Regeln strukturieren. | Kontakt, Anliegen, Rückruf-/Antwortwunsch, freiwillig genannter Ort. | `{{}}` |
| Zuordnung | Anfrage dem richtigen Team, Prozess oder nächsten Schritt zuordnen. | Kategorie, Einsatzort, Zuständigkeit, Dringlichkeit. | `{{}}` |
| Übergabe | Vollständige Anfrage an vereinbarte Empfänger übermitteln. | Strukturierte Übergabenachricht, vereinbarte Pflichtinformationen. | `{{}}` |
| Foto-/Dateikontext | Nur falls ausdrücklich im Scope aktiviert. | Bild/Datei und notwendiger Kontext. | `{{Ja / Nein / Details}}` |
| Scorecard | Ablauf und Qualität des Piloten gemeinsam bewerten. | Aggregierte Kennzahlen, Korrekturen, Fallbacks. | `{{}}` |

## 2. Was der Kunde vor Go-live entscheidet

Der Kunde bleibt für die fachlichen Betriebsregeln und die rechtliche Grundlage seines Prozesses verantwortlich. Vor Produktivstart werden mindestens diese Punkte gemeinsam dokumentiert:

- welcher Eingangskanal und welcher Pilotbereich genutzt werden;
- welche Pflichtinformationen bei einer Anfrage erforderlich sind;
- welches Team die Übergabe erhält und in welchem Zeitfenster;
- wie unklare und potenziell kritische Fälle menschlich übernommen werden;
- welche Datenquelle der Kunde bereitstellt und welche Nutzung dafür freigegeben ist;
- welche Speicher-, Lösch- und Zugriffsregeln für den konkreten Pilot gelten;
- welche Angebots-, Vertrags- und Datenschutzunterlagen vorliegen müssen.

## 3. Transparenz und menschliche Verantwortung

Wenn der vereinbarte Kanal einen KI-gestützten Assistenten nutzt, wird dessen Rolle im Kundenkontakt transparent gestaltet. BaseModul bereitet Anfragen nach den vereinbarten Regeln vor und übergibt sie. Fachliche Diagnosen, verbindliche Preise, Verträge, Termine oder kritische operative Entscheidungen bleiben beim Kunden und seinen benannten Verantwortlichen.

## 4. Datenminimierung und Zugriff

| Grundsatz | Pilotregel |
|---|---|
| **Datenminimierung** | Nur Informationen erfassen, die für den vereinbarten Eingang, die Übergabe und die Scorecard erforderlich sind. |
| **Zweckbindung** | Pilotdaten nur zur vereinbarten Anfragebearbeitung und Pilotbewertung verwenden. |
| **Zugriff** | Zugriffe auf kundenseitig benannte Rollen und für Delivery notwendige BaseModul-Rollen begrenzen. |
| **Menschlicher Fallback** | Unklare oder kritische Fälle folgen einer kundenspezifischen menschlichen Regel. |
| **Scope-Änderung** | Neue Kanäle, Integrationen, Kategorien oder Datenquellen erst nach dokumentierter Prüfung und Freigabe. |

## 5. Technische und organisatorische Prüfung

Konkrete technische und organisatorische Maßnahmen sowie tatsächlich eingesetzte Unterauftragsverarbeiter werden vor Go-live gegen die reale Pilotarchitektur geprüft. Sie werden nicht pauschal für alle Kunden oder alle Kanäle zugesagt.

| Prüffeld | Vor Go-live bestätigen |
|---|---|
| Tatsächliche Datenflüsse und Systeme | `{{ja / nein / offen}}` |
| Speicherort und Zugriffskonzept | `{{ja / nein / offen}}` |
| Unterauftragsverarbeiter und erforderliche Verträge | `{{ja / nein / offen}}` |
| Lösch-/Rückgabeprozess bei Pilotende | `{{ja / nein / offen}}` |
| Kontaktweg für Sicherheits- oder Datenschutzvorfälle | `{{ja / nein / offen}}` |

## 6. Ansprechpartner bei Fragen

| Thema | Kundenseite | BaseModul / AGENTEQ |
|---|---|---|
| Pilotablauf und Scope | `{{Name, E-Mail}}` | `{{Name, E-Mail}}` |
| Anfragequalität und Fallback | `{{Name, E-Mail}}` | `{{Name, E-Mail}}` |
| Technische Rückfragen | `{{Name, E-Mail}}` | `{{Name, E-Mail}}` |
| Datenschutz / Verträge | `{{Name, E-Mail}}` | `{{Name, E-Mail}}` |

## References

[1]: https://eur-lex.europa.eu/eli/reg/2016/679/oj "Verordnung (EU) 2016/679 / DSGVO, EUR-Lex"
[2]: https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng "Verordnung (EU) 2024/1689 / AI Act, EUR-Lex"
