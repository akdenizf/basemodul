# BaseModul Hermes — Quality Gates

> **Geltung:** Jeder von Hermes vorbereitete Research-Eintrag, Erstkontaktentwurf, Reply-Entwurf, Discovery-Notiz oder Scope-Entwurf. Diese Gates berechtigen niemals zu Versand, Terminierung oder Vertrags-/Compliance-Zusagen.

## 1. Hard Blocks

| Hard Block | Warum blockiert | Sichere Alternative |
|---|---|---|
| `vollautomatisch`, `ersetzt Personal`, `ohne Personal` | Täuscht über menschliche Verantwortung und Fallbacks. | „nach den gemeinsam festgelegten Regeln strukturiert und übergeben“ |
| `nie verloren`, `garantiert`, `immer`, `jede Anfrage` | Absolute, unbelegte Wirkungsgarantie. | „für den vereinbarten Kanal im Pilot prüfen“ |
| `24/7`, `Notdienst automatisch`, verbindliche Termin-/Preis-/Leistungszusage | Betriebs-, Notdienst- und Vertragsregel ist kundenspezifisch. | „menschliche Fallback-Regel im Scope festlegen“ |
| `DSGVO-konform`, bestimmte Server-/Anbieter-/Speicherort-Behauptung | Rechtliche/technische Aussage ohne konkrete Architektur- und Vertragsprüfung. | „Daten- und Sicherheitsunterlagen vor Go-live prüfen“ |
| Preis, `750 €`, `1.250 €`, Rabatt oder Vertragsdetails im Erstkontakt | Angebot erst nach qualifiziertem Gespräch und menschlicher Freigabe. | Kein Preis; offene Discovery-Frage. |
| `einzig`, `Marktführer`, Wettbewerberabwertung | Nicht belegte Markt-/Wettbewerbsbehauptung. | Konkreten Kundennutzen ohne Vergleich beschreiben. |
| Erfundene Betriebsgröße, Verfügbarkeit, Notdienstregel oder Problem | Unzulässige Personalisierung ohne öffentliches, prüfbares Signal. | Fakt als Hypothese kennzeichnen oder weglassen. |
| CTA für Demo, Termin oder Kauf in Erstkontakt | Erstkontakt dient der offenen Relevanzfrage. | Eine kurze, offene Frage. |

## 2. Warnregeln

Ein Entwurf erhält den Status `needs_review`, wenn mindestens eine Warnregel erfüllt ist.

- Der erste Satz beschreibt BaseModul statt ein konkretes öffentliches Signal beim Empfänger.
- Der Text enthält mehr als 120 Wörter oder mehr als einen Use Case.
- Es fehlt die klare Trennung zwischen vermutetem Problem und belegtem Fakt.
- Er erwähnt einen Kanal, eine Integration, einen Foto-/Datei-Flow oder Notdienstlogik außerhalb des bestätigten Scopes.
- Er enthält ein PDF, einen Link oder eine Anlage ohne qualifiziertes Interesse und menschliche Freigabe.
- Er schlägt eine technische, rechtliche oder kaufmännische Entscheidung vor, die nur der menschliche Owner treffen kann.
- Er missachtet die aktuelle Send-/Inbox-Policy außerhalb dieses Repositories.

## 3. Sieben-Punkte-Check

1. **Signal:** Ist ein konkretes, öffentliches und überprüfbares Signal vorhanden?
2. **Hypothese:** Wird der Schmerz als Hypothese statt als behauptete Tatsache formuliert?
3. **Fokus:** Geht es um einen Eingangskanal und einen ersten Betriebsengpass?
4. **Produktwahrheit:** Ist jede Aussage in `PILOT_OFFER_KNOWLEDGE.md` und dem Claim-Register erlaubt?
5. **Ton:** Ist der Text sachlich, ohne Hype, Druck, Emoji oder Ausrufezeichen?
6. **CTA:** Endet die Erstansprache nur mit einer offenen Frage?
7. **Freigabe:** Ist klar, dass menschlicher Review und die zuständige Send-/Inbox-Policy erforderlich sind?

## 4. Eskalationsweg

`draft` → Hard-Block entfernen → erneut prüfen → Warnungen adressieren → `needs_review` → menschlicher Owner entscheidet über Überarbeitung, Freigabe oder Verwerfen.

Ein Entwurf erreicht **nie** selbst den Status `send_allowed`.
