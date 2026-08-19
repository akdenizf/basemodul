# Claude Code Prompt — BaseModule Hermes Dry Run v1

## Rolle und Ziel

Du führst **ausschließlich einen lokalen, synthetischen Hermes-Dry-Run** im BaseModule-Repository aus. Ziel ist die technische und inhaltliche Prüfung der Hermes-Wissensquellen für einen späteren menschlich geführten SHK-Pilot-Discovery-Prozess.

> **Dies ist kein Outreach-Job.** Du recherchierst keine echten Unternehmen, legst keine Leads an, generierst keine tatsächlich zu verwendenden Pitches und versendest oder terminierst nichts.

## Harte Verbote

Du darfst niemals:

- `outreach/data/leads.json`, `campaigns.json`, Versandlogs, InboxOutboundRecords oder vergleichbare Produktionsdaten lesen, ändern oder erzeugen;
- eine echte Person, Firma, E-Mail-Adresse oder Telefonnummer recherchieren oder verwenden;
- Browser-, E-Mail-, CRM-, Kalender-, Messaging-, Netzwerk- oder API-Aktionen ausführen;
- einen Preis, Vertrag, Datenschutz-/Hosting-/DSGVO-Zusage, Notdienstzusage oder Go-live-Freigabe erzeugen;
- Dateien außerhalb der in diesem Prompt genannten Dry-Run-Dateien ändern.

Wenn eine Aufgabe eine dieser Handlungen erfordern würde: **sofort stoppen** und im Bericht `BLOCKED_BY_SCOPE` nennen.

## Pflichtquellen — in dieser Reihenfolge lesen

1. `outreach/HERMES_DRY_RUN_PROTOCOL.md`
2. `outreach/OUTREACH_SPECIALIST.md`
3. `outreach/knowledge-base/PILOT_OFFER_KNOWLEDGE.md`
4. `outreach/QUALITY_GATES.md`
5. `BASEMODUL_CLAIMS_REGISTER.md`
6. `outreach/fixtures/hermes_dry_run_shk_fixture.json`

## Ausführung

1. Prüfe zuerst den Repository-Status. Ändere keine bereits vorhandenen Arbeitsdateien.
2. Führe aus dem Repository-Root aus:

   ```bash
   node outreach/scripts/validate_hermes_dry_run.mjs
   ```

3. Wenn die Prüfung fehlschlägt, ändere ausschließlich eine der folgenden Dateien, wenn die Ursache eindeutig darin liegt:

   - `outreach/HERMES_DRY_RUN_PROTOCOL.md`
   - `outreach/OUTREACH_SPECIALIST.md`
   - `outreach/knowledge-base/PILOT_OFFER_KNOWLEDGE.md`
   - `outreach/QUALITY_GATES.md`
   - `outreach/fixtures/hermes_dry_run_shk_fixture.json`
   - `outreach/scripts/validate_hermes_dry_run.mjs`

   Danach erneut lokal prüfen. Keine andere Datei anfassen.

4. Bei erfolgreicher statischer Prüfung erstelle **nur** folgenden synthetischen Bericht:

   `outreach/reports/HERMES_DRY_RUN_BASEMODUL_v1.md`

   Der Bericht enthält exakt diese Abschnitte:

   - `Testmodus und Grenzen`
   - `Verwendete Quellen`
   - `Synthetisches Signal`
   - `Offene Hypothese`
   - `Sicherer Erstkontakt-Entwurf` (maximal 120 Wörter, genau eine offene Frage, kein Preis, kein Link, kein Dokument, kein Demo-/Termin-CTA)
   - `Discovery-Fragen`
   - `Quality-Gate-Ergebnis`
   - `Pflichtstatus: human_review_required`
   - `Was bewusst NICHT getan wurde`

   Nutze ausschließlich die fiktive Firma aus der Fixture. Markiere sie deutlich als synthetisch. Der Erstkontakt-Entwurf ist nur ein Testartefakt und darf nicht versendet werden.

5. Führe den Validator nach Erstellung des Berichts erneut aus. Der Bericht selbst darf die Gates nicht verletzen.

## Abnahmebedingungen

Der Dry Run ist nur erfolgreich, wenn:

- der Validator mit `DRY_RUN_READY` endet;
- keine echten Daten oder Produktionsdateien berührt wurden;
- der Bericht eindeutig `human_review_required` enthält;
- kein Preis, keine Garantie, kein Link, kein Versand-/Demo-/Termin-CTA und keine Datenschutz-/Hostingzusage vorkommen;
- Git-Diff ausschließlich die erlaubten Dry-Run-Dateien und gegebenenfalls den einen synthetischen Bericht zeigt.

## Abschlussbericht in der Konsole

Gib knapp aus:

1. ausgeführter Validator-Befehl und Ergebnis;
2. geänderte Dateien;
3. Bestätigung: `KEIN_VERSAND`, `KEINE_LEADS`, `KEINE_EXTERNEN_AKTIONEN`;
4. Pfad zum synthetischen Bericht;
5. verbleibender menschlicher Freigabeschritt.
