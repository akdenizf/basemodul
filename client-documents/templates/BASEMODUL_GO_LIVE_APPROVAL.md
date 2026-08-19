# BaseModule — Go-live-Freigabe für den Anfrage-Eingang Pilot

> **Arbeitsentwurf — vor verbindlicher Nutzung technisch, kaufmännisch und rechtlich prüfen.**

| Feld | Eintrag |
|---|---|
| **Kunde / Betrieb** | `{{Firmenname}}` |
| **Scope-ID** | `{{BM-PILOT-JJJJ-NNN}}` |
| **Erster Eingangskanal** | `{{Telefon / WhatsApp / Web / Foto-Datei}}` |
| **Geplanter Produktivstart** | `{{TT.MM.JJJJ, Uhrzeit}}` |
| **Kundenseitige Pilotverantwortung** | `{{Name, Rolle, Telefon, E-Mail}}` |
| **BaseModule Delivery Owner** | `{{Name, Telefon, E-Mail}}` |

## Freigabegrundsatz

Diese Checkliste bestätigt, dass der vereinbarte BaseModule-Pilot technisch und organisatorisch für den Produktivstart vorbereitet wurde. Sie ersetzt keine erforderlichen Angebots-, Vertrags- oder Datenschutzunterlagen. Ohne dokumentierte Freigabe wird der vereinbarte Eingang nicht produktiv aktiviert.

## A. Scope und Eingangskanal

| Prüfung | Kundenseite | BaseModule | Bemerkung |
|---|:---:|:---:|---|
| Pilotbereich, Use Case und erster Kanal stimmen mit dem aktuellen Scope überein. | ☐ | ☐ | `{{}}` |
| Eingangskanal, Trigger und Auslöse-/Erreichbarkeitsregel wurden geprüft. | ☐ | ☐ | `{{}}` |
| Pilotdauer, Preis, externe Nutzungskosten und Mehrvolumenregel sind dokumentiert. | ☐ | ☐ | `{{}}` |
| Kein nicht freigegebener weiterer Kanal oder eine zusätzliche Integration wird aktiviert. | ☐ | ☐ | `{{}}` |

## B. Anfrage und Übergabe

| Prüfung | Kundenseite | BaseModule | Bemerkung |
|---|:---:|:---:|---|
| Pflichtinformationen für vollständige Anfragen sind bestätigt. | ☐ | ☐ | `{{}}` |
| Kategorien, Priorität und gewünschter nächster Schritt sind dokumentiert. | ☐ | ☐ | `{{}}` |
| Übergabeempfänger, Zeitfenster und Übergabekanal sind benannt. | ☐ | ☐ | `{{}}` |
| Foto-/Datei-Flow ist entschieden und — falls aktiv — getestet. | ☐ | ☐ | `{{Ja / Nein / N. A.}}` |

## C. Menschlicher Fallback und kritische Fälle

| Prüfung | Kundenseite | BaseModule | Bemerkung |
|---|:---:|:---:|---|
| Eine verantwortliche Person für unklare Anfragen ist erreichbar benannt. | ☐ | ☐ | `{{Name / Team}}` |
| Kundenspezifische Regel für potenziell kritische Fälle ist schriftlich bestätigt. | ☐ | ☐ | `{{Regel / Verweis}}` |
| Alternative bei Nichterreichbarkeit des primären Empfängers ist benannt. | ☐ | ☐ | `{{Name / Team}}` |
| Menschlicher Fallback wurde anhand eines Testfalls geprüft. | ☐ | ☐ | `{{Testfall-ID}}` |

## D. Daten, Zugänge und Freigaben

| Prüfung | Kundenseite | BaseModule | Bemerkung |
|---|:---:|:---:|---|
| Datenquelle, Berechtigung und zulässiger Pilotzweck sind festgelegt. | ☐ | ☐ | `{{}}` |
| Erforderliche Angebots-, Vertrags- und Datenschutzunterlagen sind geprüft bzw. vereinbart. | ☐ | ☐ | `{{Verweis}}` |
| Zugänge und Empfänger sind nach der erforderlichen Berechtigung eingerichtet. | ☐ | ☐ | `{{}}` |
| Speicher-/Lösch- und Eskalationsfragen sind im vereinbarten Prozess adressiert. | ☐ | ☐ | `{{Verweis}}` |

## E. Testfälle

| Testfall | Ergebnis | Freigegeben von | Bemerkung |
|---|---|---|---|
| Standardanfrage mit vollständigen Angaben | ☐ bestanden | `{{}}` | `{{}}` |
| Unvollständige / nicht eindeutige Anfrage | ☐ bestanden | `{{}}` | `{{}}` |
| Potenziell kritischer Fall mit menschlichem Fallback | ☐ bestanden | `{{}}` | `{{}}` |
| Ausfall des Übergabewegs / alternative Regel | ☐ bestanden | `{{}}` | `{{}}` |

## F. Freigabeentscheidung

| Entscheidung | Auswahl |
|---|---|
| Produktivstart zum angegebenen Zeitpunkt freigegeben | ☐ |
| Produktivstart nur nach Behebung der unten genannten Punkte freigegeben | ☐ |
| Produktivstart nicht freigegeben; neuer Termin erforderlich | ☐ |

### Offene Punkte vor Go-live

| Nr. | Punkt | Verantwortlich | Fällig bis | Erledigt |
|---:|---|---|---|---|
| 1 | `{{}}` | `{{}}` | `{{}}` | ☐ |
| 2 | `{{}}` | `{{}}` | `{{}}` | ☐ |
| 3 | `{{}}` | `{{}}` | `{{}}` | ☐ |

## Bestätigung

| Rolle | Name | Datum | Bestätigung |
|---|---|---|---|
| Kundenseitige Pilotverantwortung | `{{}}` | `{{}}` | ☐ |
| Kundenseitige Fallback-/Bereitschaftsverantwortung | `{{}}` | `{{}}` | ☐ |
| BaseModule Delivery Owner | `{{}}` | `{{}}` | ☐ |
