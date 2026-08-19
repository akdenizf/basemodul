# BaseModul Wave 2 Research Prep — Kfz / Gutachter / Werkstätten

Datum: 2026-07-03  
Scope: Vorbereitung für BaseModul Wave 2. **Read-only Prep**, kein Versand, kein Follow-up, keine InboxOutboundRecords.  
Department: `base-modul-outreach`

## Ziel

Wave 2 testet die Kfz-/Gutachter-/Werkstatt-Linse für das **Foto-&-Datei-/Schaden-Modul**:

> Fotos rein, strukturierter Fall raus: Schadenbilder, Fahrzeugschein, Kontaktdaten, Standort/Hergang und Dringlichkeit werden sauber vorqualifiziert, bevor Team/Gutachter/Werkstatt zurückruft.

## Segment

Primär:

- Kfz-Sachverständige / Gutachter
- Unfall-/Schadenservice
- Karosserie & Lack
- freie Kfz-Werkstätten mit Reparatur-/Service-Fokus

Sekundär / nur wenn starkes Signal:

- Wohnmobil-/Spezialwerkstätten
- Reifen-/Autoservice mit starkem Termin-/Servicevolumen

Ausschließen / niedriger priorisieren:

- große Ketten ohne lokalen Entscheider: ATU, Carglass, Pitstop, Euromaster, TÜV/ADAC, Hersteller-/Konzernfilialen
- reine Händler ohne Service-/Schadenaufnahme
- nicht-auto false positives aus OSM-Suche

## Quellenstatus

Seed-Sourcing wurde über OpenStreetMap Overpass gemacht:

- Region: München Kernstadt + direktes Umland
- Query: `shop=car_repair`, `craft=car_repair`, `amenity=vehicle_inspection`, Name-Signale für `Gutachter`, `Sachverständ`, `Schaden`, `Karosserie`, `Lack`
- Ergebnis: **146 Seed-Kandidaten**
- Roh-/Seed-Datei: `outreach/reports/WAVE_2_KFZ_OSM_SEEDS_2026-07-03.json`

Wichtig: OSM ist nur öffentlicher Seed. Vor Aufnahme in `leads.json` müssen Website, Kontakt und Signale auf offiziellen Unternehmensseiten verifiziert werden.

## Bewertungskriterien Wave 2

Score-Komponenten wie bisher vorsichtig:

1. **Signal-Stärke** — Schadenaufnahme, Gutachten, Unfallservice, Fotos, Online-Anfrage, Karosserie/Lack, Termin-/Serviceprozess.
2. **Schmerz/Dringlichkeit** — Unfall-/Schadensfälle, kurzfristige Begutachtung, Versicherungs-/Dokumentenbedarf, viele Rückfragen.
3. **BaseModul-Fit** — Foto-&-Datei-Modul, WhatsApp-/Chat-Modul, Telefon-/Rückrufnotiz.
4. **Kontaktqualität** — offizielle E-Mail auf Website/Impressum/Kontakt oder klares Kontaktformular.
5. **First-Touch-Qualität** — ein konkretes öffentliches Signal, vorsichtige Hypothese, eine klare Frage.

Keine Scores >90 ohne akut öffentlich belegten Pain wie offene Stelle, sehr klare Prozessnot oder starkes Schaden-/Gutachten-Signal mit digitalem Engpass.

## Top Seed-Kandidaten zur offiziellen Verifizierung

| Prio | Seed | Typ | Warum interessant | Nächster Check |
|---:|---|---|---|---|
| 1 | 089 Gutachten Kfz Sachverständigenbüro Zwez | Kfz-Gutachter | Sehr nah am Foto-/Schaden-Modul; Gutachten-Fall braucht Bilder/Daten/Hergang. | Website/Impressum, E-Mail, Schadenaufnahme-Signal prüfen. |
| 2 | Unfallhelden | Unfall-/Schadenservice | Name/Positionierung direkt auf Unfallschaden; potenziell starker Dokumenten-/Foto-Flow. | Offizielle Kontaktquelle + Prozesssignale prüfen. |
| 3 | KFZ-Sachverständigenbüro Dietrich / Sedlmayer | Kfz-Sachverständige | Gutachter-Linse, sehr passender Intake für Fotos + Fahrzeugschein. | Website finden/verifizieren; Kontakt nicht aus OSM übernehmen. |
| 4 | Manlik Karosseriebau & Kraftfahrzeugmechanik GmbH | Karosserie/Lack/Werkstatt | Karosserie = Schadenbilder/Fotos naheliegend; guter Foto-Modul-Fit. | Website + Kontakt + Unfall-/Karosserie-Prozess prüfen. |
| 5 | Zeilinger Karosseriebau | Karosserie | Guter Schaden-/Bildaufnahme-Fit. | Offizielle Website/Kontakt verifizieren. |
| 6 | Autokühler Schneider | Spezialwerkstatt | Spezialfall + technische Erstaufnahme, ggf. Fotos/Beschreibung vor Rückruf. | Website/Kontakt + Serviceprozess prüfen. |
| 7 | Auto Münch | Werkstatt/Service | Lokaler Betrieb mit Service-Mail im Seed; guter Anfrage-/Termin-Fit. | Offizielle Kontaktseite verifizieren. |
| 8 | KFZ Werkstatt Rudolf Fischer | Werkstatt | Lokaler Betrieb, offizieller Website-Seed, potenzieller Reparatur-/Foto-Fit. | Website/Kontakt/Leistungen prüfen. |
| 9 | Aigner Kfz-Service GmbH & Co. KG | Werkstatt | Freie Werkstatt, lokaler KMU-Fit. | Offizielle Kontaktseite + Leistungs-/Schaden-Signal prüfen. |
| 10 | B&G Fahrzeugtechnik | Werkstatt | Lokaler Service-Fit; ggf. technische Rückfragen/Fotoaufnahme. | Offizielle Website/Kontakt prüfen. |
| 11 | ETH Kfz-Werkstatt GmbH | Werkstatt | Lokaler Werkstatt-Fit; mögliches Termin-/Reparaturmodul. | Kontakt/Leistungssignale prüfen. |
| 12 | Autohaus Gehrhardt Kfz-Meisterwerkstatt | Werkstatt | Lokaler Meisterbetrieb, Service-/Reparatur-Fit. | Website/Kontakt/Impressum prüfen. |
| 13 | Auto Riedl | Werkstatt | Lokaler Betrieb in Neuried, Service-Fit. | Offizielle Kontaktquelle prüfen. |
| 14 | Autohaus Feicht | Autohaus/Werkstatt | Größerer lokaler Betrieb; ggf. weniger ideal, aber Servicevolumen. | Entscheider-/Kontaktqualität prüfen. |
| 15 | Kfz-Team Bogenhausen | Werkstatt | Lokaler Betrieb; guter Stadtteil-Fit. | Website/Kontakt verifizieren. |

## Outreach-Angle Draft

### Gutachter / Sachverständige

**Hook:**

> Wenn Kunden Schadenbilder, Fahrzeugschein und Kontaktdaten per Mail oder WhatsApp schicken: Kommt daraus direkt ein vollständiger Fall — oder muss Ihr Team nachfragen?

**Modul-Fit:** Foto-&-Datei-/Schaden-Modul.

### Karosserie / Unfallservice

**Hook:**

> Bei Unfallschäden fehlen vor dem Rückruf oft Bilder, Standort, Fahrzeugdaten oder Versicherungsinfos. Genau diese Infos könnte BaseModul strukturiert einsammeln.

**Modul-Fit:** Foto-&-Datei-Modul + Telefon-/Rückrufnotiz.

### Werkstätten

**Hook:**

> Reparatur-, Termin- und Rückruffragen landen oft mit wenig Kontext. BaseModul könnte Anliegen, Fahrzeugdaten, Fotos und Dringlichkeit vor dem Rückruf sortieren.

**Modul-Fit:** Telefon-/Chat-Modul + Termin-/Foto-Modul.

## Nächster operativer Schritt

1. Top 15 Seed-Kandidaten offiziell verifizieren:
   - Website
   - Impressum/Kontakt
   - E-Mail oder Kontaktformular
   - öffentliches Prozesssignal
2. 10–15 echte Wave-2-Leads in `outreach/data/leads.json` ergänzen mit Status `researched`.
3. Research-Report schreiben: `WAVE_2_RESEARCH_2026-07-03.md`.
4. Danach erst Copy-Preview bauen. Kein Send ohne Guard + Fatih-Go.

## Status

Wave 2 ist vorbereitet, aber noch **nicht send-ready** und noch nicht als verifizierte Lead-Liste gespeichert.
