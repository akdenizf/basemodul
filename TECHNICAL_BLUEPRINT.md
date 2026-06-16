# Technical Blueprint

## Ziel

Schnell einen funktionierenden Demo- und Pilot-Stack bauen, ohne direkt eine schwere Plattform zu entwickeln.

## Wahrscheinlicher Stack

- Voice: Twilio oder vergleichbarer Anbieter
- WhatsApp/SMS: WAPI oder Twilio Messaging
- Speech-to-text: OpenAI / Whisper-kompatibel
- Reasoning: LLM mit festem Intake-Schema
- Storage: lokale JSON / Supabase spaeter
- UI: kleines Dashboard aus bestehendem AGENTEQ/Callfolio-Muster
- Delivery: E-Mail, WhatsApp oder Dashboard-Queue

## Kernflow

1. Kunde ruft an oder schreibt.
2. Assistent erkennt Branche/Intent.
3. Assistent fragt fehlende Pflichtfelder ab.
4. Assistent erkennt Dringlichkeit.
5. Assistent erstellt strukturierte Zusammenfassung.
6. Team bekommt Meldung und entscheidet.

## Minimaler Datenvertrag

```json
{
  "customer_name": "",
  "phone": "",
  "company_or_object": "",
  "request_type": "",
  "urgency": "low | normal | high | emergency",
  "description": "",
  "missing_info": [],
  "recommended_next_step": "",
  "human_handoff_required": true
}
```

## Guardrails

- Kein Assistent macht verbindliche Zusagen ohne Freigabe.
- Notfall wird immer an Mensch weitergeleitet.
- Keine sensiblen medizinischen Entscheidungen.
- DSGVO-Texte und Auftragsverarbeitung muessen vor echten Kundendaten sauber sein.
- Zuerst Pilotdaten klein halten.

