# QA-Nachweis – SHK-Einstiegsseite

**Route:** `/ki-telefonassistent-shk`

**Prüfdatum:** 19. August 2026

**Geprüfter Stand:** lokale Entwicklungsinstanz nach erfolgreichem Produktions-Build

## Technische Prüfung

| Prüfkriterium | Ergebnis |
|---|---|
| `npm run build` | Bestanden: Kompilierung, Typprüfung, Linting, statische Seitengenerierung und Build-Finalisierung erfolgreich. |
| Route | `/ki-telefonassistent-shk` wird als statische Route generiert. |
| Primärer CTA | Header- und Hero-CTA führen zum Kontaktbereich `#check`; der dortige CTA erzeugt eine E-Mail-Anfrage mit dem Betreff „30-Minuten-Check SHK“. |
| Externe Dienste | Keine Backend-Routen, keine echten Sends und keine reaktivierten geparkten Komponenten. |

## Visuelle Prüfung

Die Desktop-Ansicht wurde über die lokale Entwicklungsinstanz geprüft. Das Ergebnis erfüllt den geplanten Hauptpfad: Branchenspezifischer SHK-Hero, sofort sichtbare Anfrage-Karte, verständlicher Pilot-Ablauf, messbare Scorecard und klarer Kontakt-CTA.

| Bereich | Befund |
|---|---|
| Hero | SHK-Fokus, Problem und Nutzen sind oberhalb der Falz klar erkennbar. |
| Anfrage-Karte | Wirkt wie eine fertige, für das Team nutzbare Übergabe; der nächste Schritt „Bereitschaft ruft zurück“ ist visuell dominant. |
| Produktlogik | Telefon ist klarer Einstieg, WhatsApp/Fotos und weitere Module sind als Erweiterung verständlich gemacht. |
| Pilot | Der 30-Tage-Pilot und die Scorecard zeigen einen überprüfbaren Prozess statt einer unspezifischen KI-Demo. |
| Conversion | Der primäre Check-CTA ist im Header, Hero und Kontaktbereich einheitlich. |
| Design | Bestehende Dark-Premium-Identität, Kontrast und grüne Akzentfarbe sind konsistent. |

## Restpunkt

Eine separate mobile Screenshot-Prüfung erfordert eine mobil emulierte Browser-Ansicht. Die Route verwendet durchgehend responsive Tailwind-Breakpoints und der Produktions-Build ist erfolgreich; eine zusätzliche Geräteprüfung sollte vor einem externen Kampagnenstart dennoch erfolgen.
