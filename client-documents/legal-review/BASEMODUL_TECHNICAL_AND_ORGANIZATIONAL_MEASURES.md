# BaseModul — Technische und organisatorische Maßnahmen (TOMs)

> **Arbeitsentwurf vor Technik- und Rechtsprüfung.** Diese Anlage ist nur nach Abgleich mit der tatsächlichen Pilotarchitektur, den eingesetzten Dienstleistern, Zugriffskonzepten und dem konkreten Kundenscope als Vertragsanlage zu verwenden.

| Geltung | BaseModul Anfrage-Eingang Pilot |
|---|---|
| Scope-ID | `{{BM-PILOT-JJJJ-NNN}}` |
| Kanal | `{{Telefon / WhatsApp / Web / Foto-Datei}}` |
| Version / Stand | `{{Version, Datum}}` |
| Technische Freigabe | `{{Name, Datum}}` |
| Datenschutz-/Rechtsfreigabe | `{{Name, Datum}}` |

## 1. Prüfprinzip

Eine Maßnahme gilt erst als **bestätigt**, wenn ihre tatsächliche Umsetzung, ihr Nachweis und ihr Geltungsbereich für den jeweiligen Pilot geprüft wurden. Felder mit `{{}}` oder dem Status **offen** sind vor Produktivstart zu schließen.

| Status | Bedeutung |
|---|---|
| **Bestätigt** | Umsetzung und Nachweis sind für den konkreten Pilot geprüft. |
| **Teilweise** | Maßnahme besteht, aber Geltung, Nachweis oder Grenze brauchen Ergänzung. |
| **Offen** | Vor Go-live klären; kein pauschales Sicherheitsversprechen daraus ableiten. |
| **Nicht anwendbar** | Für den vereinbarten Kanal nicht eingesetzt; Begründung dokumentieren. |

## 2. Maßnahmenübersicht

| Schutzziel / Bereich | Vorgesehene Maßnahme | Status | Nachweis / konkrete Pilotfestlegung |
|---|---|---|---|
| **Zutrittskontrolle** | Betrieb in durch eingesetzte Infrastrukturpartner gesicherten Rechenzentrumsumgebungen; physische Sicherheit wird über deren Unterlagen geprüft. | `{{offen}}` | `{{Provider, Region, Nachweis}}` |
| **Zugangskontrolle** | Individuelle Benutzerkonten, angemessene Passwort-/MFA-Regeln und zeitnahe Deaktivierung nicht benötigter Zugänge. | `{{offen}}` | `{{Zugriffskonzept}}` |
| **Berechtigungskontrolle** | Rollen, Zugriff nur für erforderliche Kunden-, Delivery- und technische Supportrollen. | `{{offen}}` | `{{Rollen / Mandantenprüfung}}` |
| **Übertragungsschutz** | Verschlüsselte Transportwege für administrative Oberflächen, API-, Webhook- und Systemkommunikation, soweit technisch unterstützt und eingesetzt. | `{{offen}}` | `{{TLS-/Verbindungsnachweis}}` |
| **Speicherschutz** | Schutz ruhender Daten gemäß der tatsächlich genutzten Plattform- und Konfigurationsnachweise. | `{{offen}}` | `{{Provider-/Konfigurationsnachweis}}` |
| **Eingabekontrolle** | Relevante administrative und Prozessereignisse werden im vereinbarten Umfang nachvollziehbar gemacht. | `{{offen}}` | `{{Logtypen, Retention, Zugriff}}` |
| **Trennung** | Kundendaten, Testdaten und interne Entwicklung werden nach dokumentiertem Mandanten-/Umgebungskonzept getrennt. | `{{offen}}` | `{{Architekturskizze, Test}}` |
| **Verfügbarkeitskontrolle** | Störungs- und Fallback-Regel für den vereinbarten Eingang, Übergabekanal und menschlichen Betrieb. | `{{offen}}` | `{{Fallback, Kontaktweg, Testfall}}` |
| **Wiederherstellbarkeit** | Backup-/Wiederherstellungs- oder dokumentierte Rebuild-Strategie gemäß Produktionsarchitektur. | `{{offen}}` | `{{Nachweis, RPO/RTO falls vereinbart}}` |
| **Änderungsmanagement** | Scope-, Prompt-, Workflow- und Regeländerungen werden dokumentiert, getestet und nach Freigabe produktiv gestellt. | `{{offen}}` | `{{Änderungslog / Freigabeweg}}` |
| **Incident-Management** | Benannter Kontaktweg für Sicherheits-/Datenschutzvorfälle, Eskalationsprozess und dokumentierte Erstbewertung. | `{{offen}}` | `{{Kontakt, Prozess, Test}}` |
| **Löschung / Rückgabe** | Prozess für Rückgabe oder Löschung zum Pilotende nach Weisung und vereinbarter Frist. | `{{offen}}` | `{{Frist, Verantwortliche, Bestätigung}}` |

## 3. Besondere Kontrollen nach Eingangskanal

| Kanal | Prüfung vor Go-live |
|---|---|
| **Telefon** | Weiterleitung, Ausfallverhalten, Begrüßung/Transparenz, Gesprächsaufzeichnung/Transkript-Konfiguration und menschlicher Fallback mit Testfall prüfen. |
| **WhatsApp / Chat** | Freigegebener Messaging-Dienst, Empfänger-/Opt-in-Regel, Datenfluss, Versand-/Antwortlogik und Fallback prüfen. |
| **Web-Anfrage** | Eingabefelder, Übertragung, Spam-/Missbrauchsschutz, Übergabe und Datenminimierung prüfen. |
| **Foto / Datei** | Uploadweg, Dateitypen, Größen-/Zugriffsregel, Speicherung, Zuordnung und Löschregel prüfen. |

## 4. Rollen und Zugriff

| Rolle | Zulässiger Zweck | Zugriffsumfang | Benennung / Freigabe |
|---|---|---|---|
| Kundenseitige Pilotverantwortung | Scope, Übergabe, Fallback und Scorecard steuern. | Kundeneigene Pilotdaten gemäß Rollenmodell. | `{{}}` |
| Kundenseitige Bearbeitungsrolle | Anfragen bearbeiten und Rückmeldung geben. | Nur erforderliche Anfragen-/Kontextdaten. | `{{}}` |
| BaseModul Delivery Owner | Konfiguration, Test, Go-live und qualitätsbezogene Pilotbetreuung. | Nur notwendiger kundenbezogener Pilotzugriff. | `{{}}` |
| BaseModul technische Rolle | Störung, Sicherheit und technisch notwendige Wartung. | Zeitlich und fachlich begrenzter Adminzugriff. | `{{}}` |
| Externer Dienstleister | Nur gemäß geprüfter Unterauftragsverarbeitungsvereinbarung. | Nur technisch erforderlicher Umfang. | `{{}}` |

## 5. Pflege

- Vor jedem Produktivstart wird diese Anlage mit der Go-live-Freigabe abgeglichen.
- Änderungen an Kanal, Datenquelle, Integration, Unterauftragsverarbeiter oder Speicherprozess lösen eine erneute technische und gegebenenfalls rechtliche Prüfung aus.
- Diese Anlage begründet keine pauschale Garantie. Sie dokumentiert den für den konkreten Pilot überprüften Stand.

## References

[1]: https://eur-lex.europa.eu/eli/reg/2016/679/oj "Verordnung (EU) 2016/679 / DSGVO, EUR-Lex"
