# BaseModul Wave 1 Research — 2026-06-27

Scope: read-only Research für BaseModul Outreach. Kein Versand, kein Follow-up, keine InboxOutboundRecords. Guard bewusst nicht geprüft, weil keine Send-/Follow-up-Vorbereitung stattgefunden hat.

## Ergebnis

- Zielsegment: SHK, Kälte/Klima, technischer Service in München + Umland.
- Leads recherchiert und in `outreach/data/leads.json` gespeichert: **16**.
- Status aller Leads: `researched`.
- Departments: `current_department=base-modul-outreach`.
- Quellen: offizielle Websites/Kontakt-/Impressumsseiten plus OSM als öffentlicher Seed/Telefon-Querverweis, wo vorhanden.
- Callfolio/Hausverwaltung: nicht verwendet.

## Top-Priorität nach Score

| Score | Lead | stärkstes öffentliches Signal | Angle |
|---:|---|---|---|
| 89 | Hühnchen Heiztechnik GmbH | Heizungswartung + Notdienst, 365 Tage | Notdienst-/Telefon-Modul |
| 88 | allwartung GmbH | Kundendienst beauftragen + Notdienst + mehrere Gewerke | Kundendienst-/Prioritäts-Modul |
| 87 | J. Baumgartner GmbH | Service & Notdienst + Telefon/Mail/Formular/WhatsApp | WhatsApp-/Telefon-Modul |
| 86 | Achatz Wärmetechnik GmbH | Wochenend-/Feiertags-Notdienst + Formular nach Anfrageart | Notdienst-/Telefon-Modul |
| 85 | Herrlinger Dienstleistungen | SOS-Notdienst + Kontaktformular | Prioritäts-/Notdienst-Modul |
| 84 | MH Münchner Heizungsbau / Hirt | Kundendienst + umfassender Notdienst | Heizungsstörung-Intake |
| 84 | Anton Ostler GmbH & Co. KG | Kundendienst + Notdienst + Gewerbekunden/Wartung | Prioritätsrouting |
| 82 | Lengauer GmbH | Telefon/Mail/Formular/WhatsApp + Kundendienst | Multi-Channel-Intake |
| 80 | Karl Greiner GmbH | Formular trennt Angebot/Reparatur/Wartung/Rückfrage | Intake-Kategorien |

## Restliche gute Kandidaten

- Kusche GmbH — Wartung/Reparatur/Modernisierung mit konkretem Formular-Use-Case, Score 79.
- Memminger Heizungsbau GmbH — Kundendienst bei Heizungsausfall/WC-Spülung, Score 78.
- Josef Wagner GmbH — Sanitär/Heizung/Klima/Kältetechnik + Kundendienst/Wartung/Service, Score 76.
- Christian Harb GmbH — rund 20 MA, mehrere Leistungsfelder, Anfrage-CTA, Score 75.
- Pertler Gebäudetechnik — Kundendienst und mehrere Anfragewege, Score 73.
- Kröll GmbH — Wartung/Kundendienst + freies Kontaktformular, Score 74.
- Heinz Kiesel & Söhne GmbH — technische Gewerke inkl. Klima/Kanalbau/Service, Score 74.

## Scoring-Hinweis

Ich habe Scores nicht künstlich hochgezogen. Kein Lead liegt über 90, weil keine Quelle einen akut belegten Kapazitätsschmerz wie aktuelle Dispo-/Kundenservice-Stellenanzeige oder explizite Überlastung gezeigt hat. Hohe 80er kommen nur bei öffentlich belegtem Notdienst/365-Tage/SOS- oder starkem Multi-Channel-Prozesssignal.

## Nächste sinnvolle Schritte, noch ohne Send

1. Optional Wave-1 Copy-Preview für Top 5 erstellen — weiterhin ohne Versand.
2. Vor jeglicher Send-/Follow-up-Vorbereitung: Live-Guard mit `department=base-modul-outreach` auf `http://localhost:4550` prüfen.
3. Kontakte bei Leads mit `phone=null` optional manuell im Browser verifizieren, wenn Telefon für spätere Priorisierung relevant wird.
