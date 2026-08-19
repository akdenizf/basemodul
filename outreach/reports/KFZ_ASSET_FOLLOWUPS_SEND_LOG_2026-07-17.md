# BaseModul Kfz Asset Follow-ups — Send Log 2026-07-17

Scope: 5 freigegebene Kfz/Gutachter-Follow-ups mit Beispiel-schicken CTA. Kein Auto-Follow-up.

## Send Timing Check

- heutiger Tag: Friday
- Policy: allowed_friday_conscious
- Guard geprüft: yes
- Fatih-Go vorhanden: yes — „ja bitte machen“
- Ergebnis: send_allowed

## Guardrails

- Department: `base-modul-outreach`
- Gmail Sync + Live-Guard pro Empfänger direkt vor Versand geprüft.
- Alle 5 Ziel-Leads waren `nextAction=follow_up_due`, ohne Reply/Bounce/OOO/uncertain/blockFollowup.
- Campaign-Dedupe geprüft: keine Treffer.
- Kein Callfolio, keine SHK-Batch, keine Mission-Control-Writes.

## Real Send

| # | Lead | Recipient | Subject | Send Result | Resend ID | Resend Last Event | Next Action |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 1 | Heidari Ingenieur-Sachverständigenbüro | `info@heidari-gutachten.de` | `Re: Frage zu Schadenbildern und Gutachtenanfragen` | sent via Resend | `4c2885c5-a574-4d8b-8b75-ffb749e2872d` | `delivered` | Inbox manuell prüfen; kein weiteres Follow-up ohne neue Freigabe. |
| 2 | ETH Kfz-Werkstatt GmbH | `info@ethwerkstatt.de` | `Re: Frage zu Unfall- und Reparaturanfragen` | sent via Resend | `84c17504-7458-43f6-85ef-ec635e3dced0` | `delivered` | Inbox manuell prüfen; kein weiteres Follow-up ohne neue Freigabe. |
| 3 | Auto Münch | `service@automuench.de` | `Re: Kurze Frage zu Unfallschaden-Anfragen` | sent via Resend | `bc6686c1-e74b-4bd9-b6de-0f62de10b7fd` | `delivered` | Inbox manuell prüfen; kein weiteres Follow-up ohne neue Freigabe. |
| 4 | B&G Fahrzeugtechnik | `info@bg-automotive.de` | `Re: Frage zu Reparatur- und Unfallanfragen` | sent via Resend | `996d3b4a-da89-467b-b1f3-cc67c1f59ade` | `delivered` | Inbox manuell prüfen; kein weiteres Follow-up ohne neue Freigabe. |
| 5 | Aigner Kfz-Service GmbH & Co. KG | `info@aigner-kfz-service.de` | `Re: Frage zu Karosserie- und Reparaturanfragen` | sent via Resend | `8d93d4a7-3cca-47b3-89e9-80167de2f224` | `delivered` | Inbox manuell prüfen; kein weiteres Follow-up ohne neue Freigabe. |

## Operational Notes

- Sender: `Fatih von AGENTEQ <go@agenteq.de>`
- Reply-To: `Fatih Akdeniz <akdenizfatih@agenteq.de>`
- Report JSON: `outreach/reports/kfz-asset-followups-send-2026-07-17.json`
- InboxOutboundRecords: `/Users/user/Desktop/Projects/Outreach-Agent/data/inbox-outbound.json`
- Local BaseModul lead store updated/upserted for successful sends: followup_count/last_followup_at/kfz_asset_followup_resend_message_id/next_followup_at.
- Keine Mission-Control-Pflicht / kein TODAY.md geschrieben.

## Follow-up Rule

Frühestens nach menschlichem Review der Inbox und nur mit neuer Live-Guard-Prüfung. Kein Auto-Follow-up.

## Delivery Recheck

- Resend Recheck nach kurzem Wait: alle 5 Messages `delivered`.
