---
name: callfolio-vapi
description: Vapi Voice AI integration — active system prompt (v10.0) and tool config JSON for Callfolio
---

# Callfolio Vapi Skill

## Ressourcen

- `resources/vapi-system-prompt-v10.0.md` — Aktiver System Prompt (Ticket-First Engine v10.0)
- `resources/vapi-tools-config.json` — Tool-Schemas: get_active_tickets, add_ticket_note, submit_ticket

## API-Endpoints

| Endpoint | Zweck |
|---|---|
| `app/api/vapi/webhook` | assistant-request, submit_ticket, end_call |
| `app/api/vapi/get-tickets` | Proaktive Ticket-Suche (phone + address/unit fallback) |
| `app/api/vapi/add-ticket-note` | Note an bestehendes Ticket anhängen |

Shared Phone-Utils: `lib/_phone.ts` (normalizePhoneNumber, getLast10, phoneIlikePattern)

## Entscheidungs-Hierarchie

1. `get_active_tickets` — PFLICHT für PLUMBING / HEATING / ELECTRICAL / BUILDING
2. `add_ticket_note` — wenn selbe Kategorie + selber Raum
3. `submit_ticket` — nur als letzter Ausweg

## Weitere Regeln

- SMS-Ankündigung nur für Schadens-Kategorien; nicht für NOISE_COMPLAINT / BILLING
- SCHRITT 1.5 (Server-Dedup): merged nur wenn phone UND category übereinstimmen
- issue_details: append-only im Follow-up-Pfad
