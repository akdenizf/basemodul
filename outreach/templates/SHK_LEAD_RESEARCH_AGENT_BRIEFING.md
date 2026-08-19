# BaseModul – Briefing für die SHK-Lead-Research

## Auftrag

Erstelle eine **manuell belegte Longlist von 25 SHK-Betrieben** in München und Umgebung, die einen klaren ersten BaseModul-Pilot prüfen könnten. Arbeite ausschließlich in der BaseModul-/AGENTEQ-Spur; Hausverwaltungen und Callfolio-Artefakte bleiben ausgeschlossen.

> BaseModul verkauft keinen allgemeinen „KI-Agenten“. Der relevante Einstieg ist ein klar abgegrenzter Anfrage-Eingang: Telefon, WhatsApp oder Web-Anfrage wird so aufgenommen, dass das Team Kontakt, Ort, Anliegen, Dringlichkeit und einen nächsten Schritt erhält.

## Ergebnisformat

Nutze zwingend die Datei `BaseModul_SHK_Research_Card_Template.csv`. Jede Zeile steht für genau einen Betrieb. Leere Pflichtfelder oder unbelegte Behauptungen führen zu `research_status = unvollständig` und werden nicht priorisiert.

## Zielprofil

| Merkmal | Positives Signal | Punkte |
|---|---|---:|
| Serviceversprechen | Notdienst, schnelle Erreichbarkeit, Kundendienst oder Wartung öffentlich sichtbar | +30 |
| Betriebsrealität | Mehrere Monteure/Teams, aber keine erkennbare feste Rezeption | +25 |
| Passender Eingang | Telefon, WhatsApp oder Freitextformular als erkennbarer Kundenkontakt | +20 |
| Komplexität | Mehrere Standorte, Bereitschaft oder verschiedene Einsatzgebiete | +15 |
| Entscheidungsweg | Inhaber, Geschäftsführung oder sinnvoller warmer Intro-Weg öffentlich erkennbar | +10 |

Nur Betriebe mit **mindestens 60 von 100 Punkten** können den Status `qualifiziert` erhalten. Die Begründung muss sich aus den dokumentierten Quellen ergeben.

## Zulässige Recherchebasis

Nutze vorrangig die **eigene Website** des Betriebs, dessen Impressum, freiwillig veröffentlichte Kontakt-/Teamseiten und zulässige Branchenverzeichnisse. Dokumentiere für jedes relevante Signal die konkrete URL und einen wörtlichen Nachweis oder eine präzise Seitenbeschreibung.

**Nicht verwenden:** automatisiertes Google-Maps-Scraping, massenhaftes Kopieren von Plattformdaten, verdeckte Datenerhebung, gekaufte Listen oder nicht belegte personenbezogene Kontaktdaten.

## Pflichtfelder pro Betrieb

| Feld | Erwartung |
|---|---|
| `company_name`, `website`, `city` | Eindeutige Identifikation des Betriebs |
| `public_source_url` | Konkrete URL, die das wichtigste Signal belegt |
| `public_signal` und `signal_evidence` | Nachvollziehbare Beobachtung, keine Vermutung |
| `primary_problem_hypothesis` | Ein Satz, der Signal und mögliche Anfrage-Lücke verbindet |
| `recommended_pilot_channel` | Genau ein Einstieg: Telefon, WhatsApp oder Web-Anfrage |
| `fit_score_100` und `score_rationale` | Wert und punktgenaue Begründung |
| `intro_or_contact_path` | Nur warmer Intro-Weg oder eine menschliche, individuell zu prüfende Anspracheoption |
| `contact_permission_status` | Zu Beginn immer `nicht kontaktiert` |
| `do_not_contact` | Standardmäßig `nein`; auf `ja`, wenn ein ausdrücklicher Ausschlusswunsch sichtbar ist |

## Qualitätsregeln

1. **Recherche ist nicht Ansprache.** Kein Versand von E-Mails, Nachrichten oder Kontaktformularen; keine Telefonate auslösen. Kein Lead wird als send-ready markiert.
2. **Keine generischen Hypothesen.** „Der Betrieb hat sicher viele Anfragen“ ist keine Beobachtung.
3. **Ein Betrieb, ein plausibler Pilot.** Keine Liste von fünf Modulen; ein klarer erster Eingangskanal.
4. **Keine Erfindungen.** Unklare oder fehlende Informationen werden als unbekannt markiert.
5. **Keine Wiederholung.** Dubletten mit gleichem Betrieb, Standort oder Konzernbezug ausschließen.
6. **Keine automatische Reihenfolge ohne Begründung.** Top-5 nur aufgrund des dokumentierten Scores und des klarsten Gesprächswegs auswählen.

## Abschlusslieferung

Liefere die ausgefüllte CSV sowie eine kurze Top-5-Zusammenfassung nach diesem Schema:

| Rang | Betrieb | Öffentliches Signal | Pilot-Hypothese | Empfohlener nächster Schritt |
|---:|---|---|---|---|
| 1 | [Name] | [Signal + URL] | [Telefon/WhatsApp/Web] | [warmes Intro oder menschliche Prüfung] |

Die Ergebnisse werden anschließend **von einem Menschen geprüft**, bevor irgendeine Kontaktaufnahme oder Unterlagenfreigabe erfolgt. Für jede spätere Ansprache gelten die vorhandenen BaseModul-Guardrails: korrekter Outreach-Bereich, Live-Guard und ein ausdrückliches Fatih-Go vor einem echten Versand.
