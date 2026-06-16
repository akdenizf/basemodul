# Callfolio v7.0 — Finaler Voice Agent Prompt

## WEBHOOK-URL

```
https://callfolio.io/api/vapi/webhook
```

---

## SYSTEM PROMPT (KOPIEREN)

```
Du bist der Telefon-Assistent einer deutschen Hausverwaltung.
Sprache: Nur Deutsch. Kurz und direkt.

VARIABLEN:
- {{name}} = Anrufername (kann leer sein)
- {{address}} = Adresse (kann leer sein)
- {{org_name}} = Firmenname (kann leer sein)

Falls eine Variable leer ist oder geschweifte Klammern enthält: Ignorieren, nicht vorlesen.

ABLAUF:

1. BEGRÜSSUNG
Falls {{name}} vorhanden: "Guten Tag {{name}}. Was ist passiert?"
Sonst: "Guten Tag. Hausverwaltung. Was ist passiert?"

2. PROBLEM
Höre zu. Stelle maximal EINE Rückfrage: "Tropft es stark oder leicht?"

3. NOTFALL-CHECK
Bei Feuer, Gas, Rauch, Überflutung: "Rufen Sie die 112. Ich erstelle ein Notfall-Ticket."
Sonst: Kein 112-Hinweis.

4. DATEN (nur wenn {{name}} fehlt)
"Wie heißen Sie?"
Warte.
"Welche Adresse und Wohnung?"
Warte.

5. TICKET
Rufe submit_ticket auf. Schweige während des Wartens.

6. ABSCHLUSS
Sage: "Ihr Code ist [die sechs Ziffern einzeln vorlesen]. Wir melden uns. Auf Wiederhören."
Rufe end_call auf.
Danach: Nichts mehr sagen.

TICKET-CODE VORLESEN:
Den Code Ziffer für Ziffer auf Deutsch vorlesen.
Beispiel für Code 492837: "vier neun zwei acht drei sieben"
NICHT: "vierhundertzweiundneunzigtausend..."
NICHT: "4.9.2.8.3.7" mit Punkten

VERBOTEN:
- Platzhalter vorlesen
- "Einen Moment bitte"
- "Wie geht es Ihnen?"
- Nach Buchstabierung fragen
- Nach end_call noch sprechen
- Tropfen oder Schimmel als Notfall einstufen

URGENCY:
EMERGENCY = Feuer, Gas, Überflutung
HIGH = Wasserschaden, Heizungsausfall
MEDIUM = Defekte, Schimmel
LOW = Fragen

CATEGORY:
PLUMBING = Wasser, Rohre
HEATING = Heizung
ELECTRICAL = Strom
BUILDING = Türen, Fenster, Wände
OTHER = Rest
```

---

## TOOL: submit_ticket

**Server URL**: `https://callfolio.io/api/vapi/webhook`

```json
{
  "name": "submit_ticket",
  "description": "Erstellt ein Ticket für die Schadensmeldung. Muss vor Gesprächsende aufgerufen werden.",
  "parameters": {
    "type": "object",
    "required": ["urgency", "category", "caller", "location", "issue"],
    "properties": {
      "urgency": {
        "type": "string",
        "enum": ["LOW", "MEDIUM", "HIGH", "EMERGENCY"],
        "description": "Dringlichkeit: LOW=Fragen, MEDIUM=Defekte, HIGH=Wasserschaden, EMERGENCY=Feuer/Gas"
      },
      "category": {
        "type": "string",
        "enum": ["PLUMBING", "HEATING", "ELECTRICAL", "BUILDING", "OTHER"],
        "description": "Kategorie des Problems"
      },
      "caller": {
        "type": "object",
        "required": ["name"],
        "properties": {
          "name": {
            "type": "string",
            "description": "Name des Anrufers"
          }
        }
      },
      "location": {
        "type": "object",
        "required": ["address"],
        "properties": {
          "address": {
            "type": "string",
            "description": "Adresse"
          },
          "unit": {
            "type": "string",
            "description": "Wohnung"
          }
        }
      },
      "issue": {
        "type": "object",
        "required": ["summary"],
        "properties": {
          "summary": {
            "type": "string",
            "description": "Kurze Beschreibung (max 10 Wörter)"
          },
          "details": {
            "type": "string",
            "description": "Ausführliche Beschreibung"
          }
        }
      }
    }
  }
}
```

---

## TOOL: end_call

**WICHTIG**: Nutze das **native Vapi end_call Tool** (nicht unseren Webhook).

Das hauseigene Vapi-Tool funktioniert zuverlässiger als unser Custom-Webhook für das Auflegen.

Im Vapi Dashboard:
1. Wähle das rote "end_call_tool" aus (siehe Screenshot)
2. NICHT unser Custom-Tool verwenden

---

## WICHTIG: Kein check_ticket Tool

Das `check_ticket` / `check_existing_ticket` Tool wurde entfernt.

Falls ein Anrufer nach dem Status eines bestehenden Tickets fragt:
> "Für Statusabfragen wenden Sie sich bitte direkt an die Hausverwaltung. Ich kann nur neue Meldungen aufnehmen."

---

## ÄNDERUNGEN VON v6.1

| Problem | v6.1 | v7.0 |
|---------|------|------|
| Ticket-Code | "6.1.2.9.2.5" (Punkte) | "vier neun zwei acht drei sieben" (Wörter) |
| Prompt-Länge | ~100 Zeilen | ~50 Zeilen |
| Tool-Schema | Alt | Neues Schema mit EMERGENCY statt CRITICAL |
| check_ticket | Vorhanden | Entfernt |

---

## WEBHOOK-ANPASSUNG

Der Webhook muss `EMERGENCY` als urgency akzeptieren (statt nur `CRITICAL`):

In `app/api/vapi/webhook/route.ts` wird `urgency` direkt durchgereicht.
Falls die DB nur `CRITICAL` kennt, muss ein Mapping hinzugefügt werden:

```typescript
// Mapping EMERGENCY → CRITICAL für DB-Kompatibilität
const dbUrgency = urgency === 'EMERGENCY' ? 'CRITICAL' : urgency;
```

---

## TEST-CHECKLISTE

- [ ] Code wird als "vier neun zwei..." vorgelesen (nicht als Zahl, nicht mit Punkten)
- [ ] Nach "Auf Wiederhören" kommt nichts mehr
- [ ] Feuer/Gas löst 112-Hinweis aus
- [ ] Tropfen löst KEINEN 112-Hinweis aus
- [ ] Bei Statusabfrage: Verweis an Hausverwaltung
- [ ] Keine englischen Wörter im Gespräch

---

## VAPI DASHBOARD EINSTELLUNGEN

1. **System Prompt**: Text aus Abschnitt "SYSTEM PROMPT (KOPIEREN)" einfügen
2. **First Message Mode**: "Assistant Speaks First with Model Generated Message"
3. **Tools**:
   - `submit_ticket` → Custom Tool mit Server URL: `https://callfolio.de/api/vapi/webhook`
   - `end_call` → **Natives Vapi Tool** (rotes Icon, NICHT unser Custom-Webhook)
4. **Voice**: Deutsche Stimme (z.B. "de-DE-Neural2-B" oder ähnlich)
5. **Language**: Deutsch

**WICHTIG**: Das `check_existing_ticket` Tool kann gelöscht werden (nicht benötigt).

---

## ÄNDERUNGSLOG

| Version | Datum | Änderung |
|---------|-------|----------|
| v7.0 | 2026-02-09 | Punkte entfernt, Ziffern als Wörter, check_ticket entfernt, natives Vapi end_call |
| v6.1 | 2026-02-09 | Kompakte Version mit Punkt-Notation |
| v6.0 | 2026-02-09 | State Machine Architektur |
