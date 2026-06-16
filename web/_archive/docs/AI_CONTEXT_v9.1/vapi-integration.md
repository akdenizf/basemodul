# AI_CONTEXT — Vapi Integration (v9.1)

Dieser Ordner enthält den operativen Kontext für die Vapi-KI-Integration.
Für Code-Änderungen → siehe `.claude/` Dokumentation.

---

## Aktuelle Konfiguration

| Datei | Zweck |
|-------|-------|
| `docs/vapi-system-prompt-v9.1.md` | **Aktueller System Prompt** — direkt in Vapi einfügen |
| `docs/vapi-tools-config.json` | **Aktuelle Tool-Schemas** (version: 9.1) |
| `app/api/vapi/AGENTS.md` | API-Vertrag + Entscheidungsbaum |

---

## Gesprächslogik v9.1 — Kurzfassung

### Wann welches Tool?

```
Signalwort erkannt (nach Empathie-Phase)
    │
    ▼
get_active_tickets(phone) ← ohne Ankündigung aufrufen
    │
    ├── Ticket gefunden → add_ticket_note(id, note) → Abschluss ohne neues Ticket
    │
    └── Kein Ticket / anderes Problem → submit_ticket(...)
```

### Signalwörter für `get_active_tickets`
- „schon angerufen" / „bereits gemeldet"
- „Wann kommt der Handwerker?"
- „Wie ist der Status?"
- „immer noch" / „noch nicht behoben"
- „nochmal" / „mein Ticket"

### Fairness-Regel
Urgency richtet sich **ausschließlich nach dem tatsächlichen Schaden**.
Ein Folgeanruf erhöht die Urgency **niemals** automatisch.

### `[RÜCKFRAGE]`-Präfix in `issue_summary`
Nur wenn: Signalwort **vorhanden** + `get_active_tickets` **kein** Ticket gefunden.
Beispiel: `"[RÜCKFRAGE] Heizungsausfall Badezimmer"`

---

## Zwei Ebenen der Deduplizierung

| Ebene | Wo | Wie |
|-------|----|-----|
| KI-seitig (proaktiv) | Vapi System Prompt | `get_active_tickets` → `add_ticket_note` |
| Server-seitig (Safety Net) | `webhook/route.ts` SCHRITT 1.5 | `ilike` + `isDuplicate`-Response |

---

## Tool-URLs (Production)

| Tool | URL |
|------|-----|
| `get_active_tickets` | `POST https://callfolio.io/api/vapi/get-tickets` |
| `add_ticket_note` | `POST https://callfolio.io/api/vapi/add-ticket-note` |
| `submit_ticket` | `POST https://callfolio.io/api/vapi/webhook` |
| `end_call_tool` | `POST https://callfolio.io/api/vapi/webhook` |

Auth: `x-vapi-secret: {{VAPI_WEBHOOK_SECRET}}` (außer `submit_ticket` / `end_call`)

---

## Abschluss-Varianten

| Szenario | Was sagen | Ticketnummer? |
|----------|-----------|---------------|
| Neues Ticket | "Vielen Dank. Wir kümmern uns darum. Auf Wiederhören." | JA — Ziffer für Ziffer |
| Notiz hinzugefügt | "Vielen Dank für Ihre Rückmeldung. Wir kümmern uns weiterhin darum." | NEIN |
| isDuplicate (Server) | "Der Vorgang ist bereits erfasst. Ich habe Ihre Meldung vermerkt." | NEIN |

---

## Tonalität — Invarianten

- Bayerisch-höflich, ohne Dialekt
- Kein Papageien-Effekt (Name/Adresse nie wiederholen)
- Keine Buchstabierung
- Maximal eine Diagnosefrage gleichzeitig
- Aktives Zuhören: „Verstehe", „Oje", „Hm-hm"
