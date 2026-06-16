# Development Workflow — Callfolio MVP

## Lokale Entwicklung starten

```bash
# 1. Dependencies installieren
npm install

# 2. .env.local anlegen (aus env.example)
cp env.example .env.local
# Dann .env.local mit echten Werten füllen

# 3. Dev-Server starten
npm run dev
# → http://localhost:3000 (Landing + App gleichzeitig)
```

**Lokaler Routing-Hinweis:** Im Dev-Modus (`localhost`) ist sowohl Landing als auch App zugänglich. `callfolio.de` / `callfolio.io` Trennung greift nur in Production.

---

## Feature hinzufügen

### 1. Neue API-Route (Auth-geschützt)
```typescript
// app/api/mein-feature/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { requireUserWithOrganizationFromRequest } from '@/lib/auth-guard'

export async function GET(req: NextRequest) {
  const authResult = await requireUserWithOrganizationFromRequest(req)
  if (!authResult.ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: authResult.status || 401 })
  }
  const supabase = getSupabaseAdmin()
  // ... DB-Abfrage immer mit .eq('organization_id', authResult.organization_id)
}
```

### 2. Neue Vapi-Tool-Route
```typescript
// app/api/vapi/mein-tool/route.ts
export async function POST(req: Request) {
  const secret = req.headers.get('x-vapi-secret')
  if (!secret || secret !== process.env.VAPI_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  // ...
}
```
→ Danach Tool-Schema in `docs/vapi-tools-config.json` ergänzen
→ `app/api/vapi/AGENTS.md` aktualisieren

### 3. Neue Dashboard-Seite
```typescript
// app/(app)/meine-seite/page.tsx
import AuthGuard from '@/components/AuthGuard'
import MeineKomponente from '@/components/MeineKomponente'

export default function MeinePage() {
  return (
    <AuthGuard>
      <MeineKomponente />
    </AuthGuard>
  )
}
```

### 4. Neue DB-Spalte / Migration
1. SQL-Migration in `database/` erstellen (z.B. `v9-meine-feature.sql`)
2. In Supabase Studio manuell ausführen
3. Interface in `lib/types.ts` aktualisieren

---

## Testen

**Kein automatisches Test-Framework.** Validierung erfolgt durch:

```bash
npm run build   # TypeScript-Kompilierung + Build-Fehler (PFLICHT vor Commit)
npm run lint    # ESLint
```

### Manuelle End-to-End-Tests
- Vapi-Endpoints: `tests/duplicate-prevention.test.ts` enthält curl/Postman-Beispiele
- Docs: `END_TO_END_TEST_GUIDE.md` im Root
- Webhook-Test mit `x-vapi-secret` Header:

```bash
curl -X POST http://localhost:3000/api/vapi/get-tickets \
  -H "Content-Type: application/json" \
  -H "x-vapi-secret: DEIN_SECRET" \
  -d '{"phone_number": "+491701234567"}'
```

---

## Debugging

### Ticket kommt nicht an
1. Vapi-Webhook-Logs in Vapi-Dashboard prüfen
2. Supabase → Table Editor → `tickets` + `ticket_activities` prüfen
3. Vercel-Logs für `/api/vapi/webhook` prüfen

### Auth-Fehler (401 im Dashboard)
1. Supabase Auth Session prüfen (DevTools → Application → Cookies → `sb-*`)
2. `lib/supabase/server.ts` `getUser()` vs `getSession()` — immer `getUser()` nutzen

### Supabase-Query schlägt fehl
1. `SUPABASE_URL` vs `NEXT_PUBLIC_SUPABASE_URL` — Vapi-Endpoints nutzen `SUPABASE_URL` (ohne PUBLIC)
2. RLS-Policy prüfen: Admin-Client bypassed RLS, Browser-Client unterliegt ihr

### Build-Fehler
```bash
npm run build 2>&1 | grep "Error"
```
Häufigste Ursache: `next/headers` in einem Modul importiert, das von Client-Komponenten geladen wird → Admin-Client-Import in `lib/supabase/admin.ts` isoliert.

---

## Deployment

- **Platform:** Vercel (automatisch via Git push auf `main`)
- **Branch-Strategie:** `feature/*` → PR → `main` → Auto-Deploy
- **ENV-Vars:** In Vercel-Dashboard gesetzt, nicht in `.env.local` committen

### Vor dem Deploy prüfen
```bash
npm run build   # Muss ohne Fehler durchlaufen
npm run lint    # Keine ESLint-Fehler
```

Konfig: `.vercel/project.json` + Vercel-Dashboard (nicht committen sensible Werte).
