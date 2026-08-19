# BaseModul SHK Asset Follow-ups — Send Log 2026-07-14

Scope: 5 freigegebene SHK/Notdienst-Follow-ups mit Beispiel-Rückrufnotiz. Kein Auto-Follow-up.

## Send Timing Check

- heutiger Tag: Tuesday
- Policy: allowed
- Guard geprüft: yes
- Fatih-Go vorhanden: yes — „Ja man, mach das mal bitte“
- Ergebnis: send_allowed

## Recovery Note

Das Send-Script hat die 5 Sends und lokalen Records geschrieben, ist danach aber beim Post-Send-Guard ausgestiegen, weil der Guard nach dem neuen Outbound korrekt auf `wait` gewechselt ist. Dieser Log wurde read-only aus InboxOutboundRecords, Lead Store und Resend Details rekonstruiert. Kein zweiter Send wurde ausgelöst.

## Real Send

| # | Lead | Recipient | Subject | Send Result | Resend ID | Resend Last Event | Next Action |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 1 | Hühnchen Heiztechnik GmbH | `info@heiztechnik-gmbh.de` | `Re: Kurze Frage zu Ihrem 365-Tage-Notdienst` | sent via Resend | `15c08dc8-c771-486a-a046-3159857d4748` | `unknown` | Inbox manuell prüfen; kein weiteres Follow-up ohne neue Freigabe. |
| 2 | allwartung GmbH | `info@allwartung.de` | `Re: Kurze Frage zu Kundendienst und Notdienst` | sent via Resend | `34c5eb12-d692-4649-b136-ddc84ed4607e` | `unknown` | Inbox manuell prüfen; kein weiteres Follow-up ohne neue Freigabe. |
| 3 | J. Baumgartner GmbH | `info@j-baumgartner.de` | `Re: Telefon, Formular und WhatsApp — kurze Frage` | sent via Resend | `62bad9f0-bf87-47b9-9353-8447c745acf9` | `unknown` | Inbox manuell prüfen; kein weiteres Follow-up ohne neue Freigabe. |
| 4 | Achatz Wärmetechnik GmbH | `info@achatz-heizung.de` | `Re: Kurze Frage zu Notdienst-Anfragen` | sent via Resend | `ea96f04f-f5b7-497e-a32e-9772d203c270` | `unknown` | Inbox manuell prüfen; kein weiteres Follow-up ohne neue Freigabe. |
| 5 | Herrlinger Dienstleistungen | `info@herrlinger.eu` | `Re: SOS-Notdienst — kurze Frage zur Erstaufnahme` | sent via Resend | `f0f5d8f4-d53b-48e1-8ad1-47933f3ad5d2` | `unknown` | Inbox manuell prüfen; kein weiteres Follow-up ohne neue Freigabe. |

## Operational Notes

- Report JSON: `outreach/reports/shk-asset-followups-send-2026-07-14.json`
- InboxOutboundRecords: `/Users/user/Desktop/Projects/Outreach-Agent/data/inbox-outbound.json`
- Asset als Inline-Beispiel in der E-Mail, keine Datei-Anhänge.
- Local BaseModul lead store updated: followup_count/last_followup_at/asset_followup_resend_message_id/next_followup_at.
- Keine Mission-Control-Pflicht / kein TODAY.md geschrieben.

## Follow-up Rule

Frühestens nach menschlichem Review der Inbox und nur mit neuer Live-Guard-Prüfung. Kein Auto-Follow-up.
