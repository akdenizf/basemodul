# BaseModule — Kundenpaket für den ersten Pilot

Dieses Verzeichnis trennt kundenfähige Unterlagen von strategischen und rechtlich prüfpflichtigen Arbeitsentwürfen.

## Reihenfolge im echten SHK-Pilot

| Zeitpunkt | Dokument | Verwendung |
|---|---|---|
| Nach einem qualifizierten Gespräch | `rendered/BASEMODUL_SHK_PILOT_OFFER_ONE_PAGER.pdf` | Kurzer, kundenfähiger SHK-Pilotüberblick. Vor Versand Betriebsname, Ansprechpartner, Angebots-ID und Gültigkeit ergänzen. |
| Nach Scoping, vor Beauftragung | `../BASEMODUL_30_DAY_PILOT_SCOPE.md` | Ausgefüllter Scope mit Kanal, Rollen, Fallback, Scorecard, Preis und kaufmännischen Details. |
| Vor Produktivstart | `templates/BASEMODUL_GO_LIVE_APPROVAL.md` | Go-live erst nach dokumentierter Kunden- und BaseModule-Freigabe. |
| Vor Verarbeitung echter Kundendaten | `legal-review/BASEMODUL_DPA_AVV_DRAFT.md`, TOMs und Subprocessor-Liste | Ausschließlich nach Technik- und Rechtsprüfung als Vertrags-/Anlagenpaket verwenden. |
| Während des Piloten | `../PILOT_DELIVERY_PLAYBOOK.md` | Interner Wochenrhythmus, Scorecard und Tag-30-Entscheidung. |

## Wichtige Regeln

- Die strategischen Quellen im Repository bleiben die gepflegte Wahrheit; PDFs werden daraus für konkrete Kunden erzeugt.
- Das SHK-Angebot ist kein Vertrag und enthält keine pauschalen Datenschutz-, Verfügbarkeits- oder Wirkungsgarantien.
- Alle Felder im Format `{{...}}` sind vor Kundennutzung auszufüllen.
- Für Telefon-, WhatsApp-, Web- und Foto-/Dateipiloten gilt die gleiche Kernlogik; kanalbezogene Daten- und Technikregeln werden im konkreten Scope ergänzt.
- Die rechtlich markierten Entwürfe müssen vor verbindlicher Nutzung fachlich geprüft werden.

## Steuerung während und nach dem Pilot

| Zeitpunkt | Dokument | Verwendung |
|---|---|---|
| Wöchentlich während des Piloten | `templates/BASEMODUL_WEEKLY_PILOT_SCORECARD.md` | Gemeinsamer, faktischer Review von Prozessqualität, Fallbacks, Änderungen und nächsten Aufgaben. |
| Tag 30 | `templates/BASEMODUL_DAY_30_PILOT_OUTCOME_REPORT.md` | Ergebnis, offene Punkte und die bewusste Entscheidung über Dauerbetrieb, Nachschärfen, Erweiterung oder Pause. |
| Bei Fragen oder Störungen | `templates/BASEMODUL_SUPPORT_AND_ESCALATION_GUIDE.md` | Kontaktweg, Priorisierung, Fallback und Abgrenzung von Support gegenüber Erweiterungswünschen. |
