# BaseModule — Hermes Outreach Template Infrastructure

**Stand:** 2026-08-19
**Zweck:** Vorlagen ausschließlich für menschlich zu prüfende Entwürfe. Diese Datei berechtigt nicht zu Recherche, Versand, Terminierung oder Follow-up-Ausführung.

## Verbindliche Quellen

1. `PILOT_OFFER_KNOWLEDGE.md`
2. `../QUALITY_GATES.md`
3. `../../BASEMODUL_CLAIMS_REGISTER.md`
4. `../../BASEMODUL_30_DAY_PILOT_SCOPE.md`

## Hook-Auswahl

| Öffentliches, überprüfbares Signal | Zulässiger Hook | Nicht zulässig |
|---|---|---|
| Notdienst-, Bereitschafts- oder Erreichbarkeitshinweis | Ein Kanal und vollständige Erstinformationen als offene Frage. | Pauschale 24/7-/Notdienstautomatisierung behaupten. |
| Mehrere sichtbare Kontaktwege | Nach Struktur des ersten Eingangs fragen. | Behaupten, dass Anfragen verloren gehen. |
| Foto-/Datei-Hinweis | Nach Vollständigkeit und Zuordnung im bestehenden Prozess fragen. | Foto-Flow oder Integration zusagen. |
| Stellenanzeige für Service/Dispo | Nach dem aufwendigsten Teil des Anfrage-Eingangs fragen. | Personalersatz oder konkrete Zeitersparnis behaupten. |
| Kein klares Signal | Kein Entwurf; Status `research_only`. | Generische KI-/Automationsmail. |

## Erstkontakt — Hook A: Erreichbarkeit

**Einsatz:** Ein konkreter öffentlicher Hinweis deutet auf Notdienst oder relevante Erreichbarkeitszeiten hin.

```text
Betreff: Eine kurze Frage zum Anfrage-Eingang bei {Firmenname}

Guten Tag {Anrede} {Nachname},

auf Ihrer Website ist {öffentliches_signal} sichtbar. Bei vielen Servicebetrieben wird es genau dann schwierig, wenn ein erster Kontakt zwar eingeht, aber wichtige Angaben für den Rückruf fehlen.

Wir prüfen mit einzelnen Betrieben, ob ein klar abgegrenzter Anfrage-Eingang für 30 Tage einen solchen Ablauf sichtbar verbessern kann — mit festgelegter menschlicher Übergabe.

Wie wird dieser Kanal bei {Firmenname} heute organisiert, wenn das Team gerade nicht direkt erreichbar ist?

Beste Grüße
{menschlicher_absender}
```

## Erstkontakt — Hook B: Vollständige Anfrage

**Einsatz:** Mehrere öffentliche Kontaktwege oder ein erkennbarer möglicher Medienbruch.

```text
Betreff: Kurze Frage zu Telefon und Nachrichten bei {Firmenname}

Guten Tag {Anrede} {Nachname},

bei {Firmenname} ist {öffentliches_signal} sichtbar. Ich frage mich deshalb: Kommen beim ersten Kontakt immer die Informationen an, die Ihr Team für Rückruf, Zuordnung und nächsten Schritt wirklich braucht?

BaseModule testet mit Betrieben einen klar abgegrenzten Anfrage-Eingang statt eines großen Systemprojekts.

Ist das bei Ihnen bereits sauber gelöst, oder gibt es dort noch manuelle Nacharbeit?

Beste Grüße
{menschlicher_absender}
```

## Erstkontakt — Hook C: Foto-/Dateikontext

**Einsatz:** Nur wenn ein öffentlicher Hinweis auf einen bestehenden Foto-/Dateiweg nachweisbar ist.

```text
Betreff: Eine kurze Frage zur vollständigen Schadenmeldung bei {Firmenname}

Guten Tag {Anrede} {Nachname},

auf Ihrer Website ist {öffentliches_signal} sichtbar. Bei solchen Eingängen stellt sich oft die einfache Frage, ob Bild, Kontakt und Kontext beim ersten Schritt zusammenkommen oder erst nachträglich ergänzt werden müssen.

Wir prüfen mit einzelnen Servicebetrieben einen klar begrenzten Anfrage-Eingang mit menschlicher Übergabe.

Wie läuft die erste Zuordnung solcher Meldungen bei Ihnen heute ab?

Beste Grüße
{menschlicher_absender}
```

## Follow-up — nur nach menschlicher Freigabe und gültiger Policy

```text
Betreff: Re: {original_subject}

Guten Tag {Anrede} {Nachname},

ich wollte nur einordnen, ob der Anfrage-Eingang bei {Firmenname} gerade kein Thema ist oder ob eine kurze Einordnung sinnvoll wäre.

Falls nicht: kein weiterer Aufwand von meiner Seite.

Beste Grüße
{menschlicher_absender}
```

## Qualifizierte Antwort — nur als Entwurf für menschlichen Owner

Bei signalisiertem Interesse fragt der Entwurf nur nach:

- dem relevanten Kanal und konkreten Engpass;
- Zuständigkeit sowie Informationen, die bei der Übergabe erforderlich sind;
- menschlichem Fallback für unklare oder kritische Fälle;
- ob ein klar begrenzter 30-Tage-Pilot grundsätzlich geprüft werden soll.

Kein Preis, keine Vertrags-/Datenschutzbehauptung und keine Go-live-Zusage. Das personalisierte Angebot und der Scope werden erst nach qualifiziertem Gespräch von einem menschlichen Owner freigegeben.

## Kurzverbote

Nicht verwenden: vollautomatisch, 24/7, nie verloren, DSGVO-konform, EU-Server, Notdienst automatisch, Preis/Tarif, Demo, Termin, Marktführer, günstigste, Konkurrenzvergleich, unbestätigte Betriebsfakten oder unbestätigte Foto-/Integrationszusagen.
