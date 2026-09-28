# Hermes Dry Run — BaseModule v1

> **SYNTHETISCH / TESTLAUF.** Dieser Bericht enthält ausschließlich fiktive Testdaten aus
> `outreach/fixtures/hermes_dry_run_shk_fixture.json`. Kein Bezug zu einem realen Unternehmen,
> keine reale Kontaktperson, keine reale Kontaktaufnahme. Nichts in diesem Dokument darf
> versendet, terminiert oder als Kundenscope verwendet werden.

## Testmodus und Grenzen

Dies ist ein lokaler, statischer Infrastruktur-Dry-Run gemäß
`prompts/claude-code-hermes-dry-run-v1.md` und `outreach/HERMES_DRY_RUN_PROTOCOL.md`. Es wurden
keine echten Unternehmen recherchiert, keine Leads angelegt, keine Browser-, E-Mail-, CRM-,
Kalender-, Messaging-, Netzwerk- oder API-Aktionen ausgeführt und keine Produktionsdateien
(`outreach/data/leads.json`, `campaigns.json`, Versandlogs) gelesen oder verändert. Die
verwendete Firma ist vollständig fiktiv (siehe Fixture).

## Verwendete Quellen

1. `outreach/HERMES_DRY_RUN_PROTOCOL.md`
2. `outreach/OUTREACH_SPECIALIST.md`
3. `outreach/knowledge-base/PILOT_OFFER_KNOWLEDGE.md`
4. `outreach/QUALITY_GATES.md`
5. `BASEMODUL_CLAIMS_REGISTER.md`
6. `outreach/fixtures/hermes_dry_run_shk_fixture.json`

## Synthetisches Signal

- **Betrieb (fiktiv):** Muster Heiztechnik GmbH — SHK-Servicebetrieb, laut Fixture vollständig
  synthetisch.
- **Öffentliches Signal (fiktiv):** Website-Hinweis „Störung? Rufen Sie uns an.“
- Dieses Signal ist testkonstruiert und nicht überprüfbar in der realen Welt — es dient nur der
  Prüfung des Ablaufs Signal → Hypothese → Discovery.

## Offene Hypothese

Bei hoher Auslastung könnten erste Angaben für Rückruf und Zuständigkeit unvollständig beim Team
ankommen. Dies wird ausdrücklich als **Hypothese**, nicht als belegte Kundentatsache behandelt —
sie müsste im echten Gespräch verifiziert werden.

## Sicherer Erstkontakt-Entwurf

> **TESTARTEFAKT — NICHT VERSENDEN.**
>
> Auf Ihrer Website steht der Hinweis, dass man bei einer Störung direkt anrufen soll. Bei
> Betrieben mit hoher Auslastung am Telefon kann es passieren, dass beim ersten Anruf nicht alle
> Angaben zu Anliegen, Einsatzort und Rückrufwunsch vollständig ankommen, bevor jemand zurückruft
> oder disponiert. Wie stellen Sie heute sicher, dass diese Angaben beim ersten Kontakt vollständig
> beim zuständigen Team landen?

(38 Wörter, eine offene Frage, kein Preis, kein Link, kein Dokument, kein Demo-/Termin-CTA.)

## Discovery-Fragen

1. Was passiert heute, wenn auf dem Telefonkanal niemand direkt erreichbar ist?
2. Welche Informationen fehlen dem Team häufig, bevor es zurückruft oder disponiert?
3. Welche Fälle müssen bewusst direkt bei einem Menschen landen?
4. Wer nutzt die Übergabe im Alltag, und woran würden Sie erkennen, dass sie funktioniert?
5. Wäre ein Kanal (Telefon) und ein Use Case (Störungs-/Serviceanfrage) für 30 Tage ein sinnvoller,
   begrenzter Test?

## Quality-Gate-Ergebnis

- Statischer Validator (`node outreach/scripts/validate_hermes_dry_run.mjs`): **DRY_RUN_READY**.
- Sieben-Punkte-Check (`outreach/QUALITY_GATES.md`) auf den Erstkontakt-Entwurf angewendet:
  - Signal: vorhanden (fiktiver Website-Hinweis).
  - Hypothese statt Tatsache: erfüllt.
  - Fokus auf einen Kanal/ein Anliegen: erfüllt (Telefon, Störungs-/Serviceanfrage).
  - Produktwahrheit gemäß Claim-Register: kein Hard-Block-Begriff verwendet (kein
    „vollautomatisch“, kein „24/7“, kein Preis, keine DSGVO-Zusage, keine Garantie).
  - Ton: sachlich, ohne Hype/Druck/Emoji/Ausrufezeichen.
  - CTA: endet ausschließlich mit einer offenen Frage.
  - Freigabe: menschlicher Review zwingend markiert.
- Ergebnis: kein Hard Block ausgelöst, keine Warnregel verletzt.

## Pflichtstatus: human_review_required

Dieser gesamte Bericht — Signal, Hypothese, Erstkontakt-Entwurf und Discovery-Fragen — bleibt im
Status `human_review_required`. Kein Inhalt ist ohne menschliche Prüfung und Freigabe nutzbar.

## Was bewusst NICHT getan wurde

- Kein reales Unternehmen, keine reale Kontaktperson, keine reale E-Mail-Adresse oder
  Telefonnummer recherchiert oder verwendet.
- Keine Lead-, Kampagnen- oder Versanddatei gelesen, erzeugt oder verändert.
- Keine Browser-, E-Mail-, CRM-, Kalender-, Messaging-, Netzwerk- oder API-Aktion ausgeführt.
- Kein Versand, keine Terminierung, keine Demo-Vereinbarung.
- Kein Preis, keine Vertrags-, Datenschutz-/Hosting- oder Notdienstzusage erzeugt.
- Kein Kundenscope (`BASEMODUL_30_DAY_PILOT_SCOPE.md`) ausgefüllt.
- Keine andere Datei außerhalb der in `prompts/claude-code-hermes-dry-run-v1.md` erlaubten
  Dry-Run-Dateien und dieses Berichts geändert.
