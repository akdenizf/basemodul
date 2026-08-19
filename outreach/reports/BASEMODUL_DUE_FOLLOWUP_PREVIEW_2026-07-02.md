# BaseModul — Due Follow-up Preview 2026-07-02

Zeit: 2026-07-02 18:11 CEST  
Scope: Follow-up-Preview für fällige ältere BaseModul-Outreach-Leads. **Kein Versand**, kein Auto-Follow-up.

## Send Timing Check

- heutiger Tag: Thursday
- Policy: allowed
- Guard geprüft: yes
- Fatih-Go vorhanden: no
- Ergebnis: prepare_only

## Live-Guard Ergebnis

Gmail Sync / Guard geprüft am `2026-07-02T15:49:19.707Z`.

Für diese 5 Leads:

- `replyStatus=no_reply`
- `blockFollowup=false`
- `nextAction=follow_up_due`
- keine neuen Replies/Bounces/OOO erkannt

| Lead | Email | Original Subject | Guard |
|---|---|---|---|
| SAM Klimatechnik | kundendienst@sam-klimatechnik.de | Frage zu Klimaanfragen | follow_up_due |
| Arktika GmbH | info@arktika-gmbh.de | Frage zu Notdienstanfragen | follow_up_due |
| ATU Logistik GmbH | firmenkunden@atu-logistik.de | Frage zu Besichtigungsanfragen | follow_up_due |
| LOOGO Umzüge | office@loogo.at | Frage zur Anfrageverteilung | follow_up_due |
| Umzugsritter | office@umzugsritter.at | Frage zum Inventartool | follow_up_due |

---

## 1) SAM Klimatechnik

**To:** `kundendienst@sam-klimatechnik.de`  
**Subject:** `Re: Frage zu Klimaanfragen`

Hallo zusammen,

ich wollte meine Frage kurz nach vorne holen.

Mir ging es konkret um den Einstieg bei neuen Klimaanfragen: Wenn Anlagentyp, Einsatzort oder Dringlichkeit noch fehlen, könnte ein kleiner Intake-Flow diese Infos vor dem Rückruf einsammeln und sauber ans Team übergeben.

Falls das gerade kein Thema ist, passt das natürlich auch. Wäre sonst ein kurzer 20-Minuten-Blick auf Ihren Anfrageweg interessant?

Viele Grüße  
Fatih Akdeniz  
AGENTEQ / basemodul.de

---

## 2) Arktika GmbH

**To:** `info@arktika-gmbh.de`  
**Subject:** `Re: Frage zu Notdienstanfragen`

Hallo zusammen,

ich wollte hierzu kurz nachfassen.

Bei 24/7-Notdienst und Wartung geht es mir nicht um ein großes System, sondern um einen schlanken Schritt davor: Anfrage annehmen, Standort, Anlage, Problem und Dringlichkeit abfragen und als klare Notiz ans Team geben.

Wäre es sinnvoll, sich einmal kurz anzuschauen, ob das bei Ihrem Notdienst-/Wartungsprozess Rückfragen spart?

Viele Grüße  
Fatih Akdeniz  
AGENTEQ / basemodul.de

---

## 3) ATU Logistik GmbH

**To:** `firmenkunden@atu-logistik.de`  
**Subject:** `Re: Frage zu Besichtigungsanfragen`

Hallo zusammen,

ich wollte meine Frage kurz nachfassen.

Bei Besichtigungs- oder Angebotsanfragen fehlen vorab oft noch Angaben zu Umfang, Fotos, Zugang oder besonderen Anforderungen. Genau dafür bauen wir kleine Vorqualifizierungs-Flows, die vor Rückruf oder Termin eine vollständige Übergabe vorbereiten.

Wäre ein kurzer Blick darauf interessant, ob sich dadurch manuelle Rückfragen reduzieren lassen?

Viele Grüße  
Fatih Akdeniz  
AGENTEQ / basemodul.de

---

## 4) LOOGO Umzüge

**To:** `office@loogo.at`  
**Subject:** `Re: Frage zur Anfrageverteilung`

Hallo zusammen,

ich wollte hierzu kurz nachfragen.

Bei mehreren Standorten ist oft schon die erste Sortierung entscheidend: welcher Standort, welche Leistung, welche Dringlichkeit, welche nächsten Infos fehlen. Ein kleiner Intake-Flow könnte neue Anfragen vorsortieren und direkt an das passende Team übergeben.

Ist das Thema Anfrageverteilung bei LOOGO aktuell relevant genug für einen kurzen Austausch?

Viele Grüße  
Fatih Akdeniz  
AGENTEQ / basemodul.de

---

## 5) Umzugsritter

**To:** `office@umzugsritter.at`  
**Subject:** `Re: Frage zum Inventartool`

Hallo zusammen,

ich wollte meine Frage zum Inventartool kurz nach vorne holen.

Der spannende Punkt ist aus meiner Sicht der Übergang nach der Erfassung: Werden die Daten direkt für Angebot oder Disposition nutzbar, oder gibt es noch manuelle Zwischenschritte?

Falls dort noch Arbeit hängen bleibt, könnte ein kleiner Workflow helfen, Inventardaten sauberer zu übergeben.

Wäre ein kurzer Austausch dazu interessant?

Viele Grüße  
Fatih Akdeniz  
AGENTEQ / basemodul.de

---

## Empfehlung

Wenn gesendet werden soll, würde ich heute maximal alle 5 als Mini-Follow-up-Batch senden. Timing ist Donnerstag/allowed, Guard ist grün — aber echter Versand braucht noch explizites Fatih-Go.

Vor echtem Versand nochmal direkt live prüfen:

```txt
GET http://localhost:4550/api/outreach-status?department=base-modul-outreach&email=<leadEmail>
```
