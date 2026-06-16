# Commands — Callfolio MVP

## Entwicklung

```bash
npm run dev          # Dev-Server starten → http://localhost:3000
npm run build        # Production-Build (TypeScript-Check + Compile)
npm run start        # Production-Build lokal starten
npm run lint         # ESLint prüfen
```

---

## Build & Validierung

```bash
# TypeScript + Build — IMMER vor Commit ausführen
npm run build

# Nur Linter
npm run lint

# Build-Fehler filtern
npm run build 2>&1 | grep -E "Error|error TS"
```

---

## Git Workflow

```bash
# Status prüfen
git status
git log --oneline -10

# Feature-Branch erstellen
git checkout -b feature/mein-feature

# Commit (niemals --no-verify!)
git add app/api/mein-route/route.ts lib/types.ts
git commit -m "feat: kurze Beschreibung was & warum"

# KEIN Push ohne explizite Anforderung
```

**Commit-Konventionen:**
- `feat:` neues Feature
- `fix:` Bugfix
- `refactor:` Umbau ohne Funktionsänderung
- `docs:` Dokumentation
- `security:` Sicherheits-Patch
- `resilience:` Timeout / Error-Handling

---

## Manuelle API-Tests (curl)

```bash
# Vapi get-tickets testen
curl -X POST http://localhost:3000/api/vapi/get-tickets \
  -H "Content-Type: application/json" \
  -H "x-vapi-secret: $VAPI_WEBHOOK_SECRET" \
  -d '{"phone_number": "+491701234567"}'

# Vapi add-ticket-note testen
curl -X POST http://localhost:3000/api/vapi/add-ticket-note \
  -H "Content-Type: application/json" \
  -H "x-vapi-secret: $VAPI_WEBHOOK_SECRET" \
  -d '{"ticket_id": "UUID-HIER", "note": "Mieter meldet Verschlimmerung"}'

# Check-Ticket testen
curl -X POST http://localhost:3000/api/vapi/check-ticket \
  -H "Content-Type: application/json" \
  -H "x-vapi-secret: $VAPI_WEBHOOK_SECRET" \
  -d '{"caller_phone": "+491701234567"}'

# Webhook submit_ticket testen (Vapi-Format)
curl -X POST http://localhost:3000/api/vapi/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "type": "tool-calls",
      "toolCalls": [{
        "id": "test_001",
        "function": {
          "name": "submit_ticket",
          "arguments": "{\"urgency\":\"HIGH\",\"category\":\"PLUMBING\",\"caller\":{\"name\":\"Max\"},\"location\":{\"address\":\"Musterstr. 1\",\"unit\":\"EG\"},\"issue\":{\"summary\":\"Wasserrohrbruch\"}}"
        }
      }],
      "call": {"id": "call_test_001", "customer": {"number": "+491701234567"}}
    }
  }'

# Dashboard Ticket-Liste (mit Bearer Token)
SESSION_TOKEN="dein-supabase-access-token"
curl http://localhost:3000/api/tickets?limit=10 \
  -H "Authorization: Bearer $SESSION_TOKEN"
```

---

## Supabase (Datenbank)

```bash
# Supabase CLI (falls installiert)
supabase status          # Lokaler Status
supabase db diff         # Schema-Diff

# Migrations manuell ausführen:
# → Supabase Studio → SQL Editor → SQL aus database/*.sql einfügen
```

---

## Deployment

```bash
# Vercel CLI (falls installiert)
vercel                   # Deploy auf Preview-URL
vercel --prod            # Deploy auf Production (main)

# Logs ansehen
vercel logs              # Letzte Deployment-Logs
```

---

## Debug-Hilfsbefehle

```bash
# Nächste Build-Artefakte löschen (bei Cache-Problemen)
rm -rf .next

# Node-Modules neu installieren
rm -rf node_modules && npm install

# Typescript-Typen prüfen ohne Build
npx tsc --noEmit
```
