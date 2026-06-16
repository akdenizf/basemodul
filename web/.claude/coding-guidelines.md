# Coding Guidelines — Callfolio MVP

## Sprache & Lokalisierung
- **User-facing Text:** Immer Deutsch (Fehlermeldungen, Labels, Toasts, KI-Sprachausgabe)
- **Code / Variablen / Kommentare:** Englisch
- **Status-Enums:** Englisch (NEW, IN_PROGRESS, RESOLVED, CLOSED)
- **UI-Übersetzungen:** `lib/translations.ts` für Enum-Darstellungen

---

## TypeScript
- Strict mode — kein `any` ohne Kommentar-Begründung
- Alle Interfaces in `lib/types.ts` definieren und von dort importieren
- Zod v4 (`zod/v4`) für externe Payload-Validierung
- Vapi-Payloads: `.safeParse()` als non-blocking Observability, nicht als Blocker

```typescript
// ✅ Richtig
import type { Ticket, TicketStatus } from '@/lib/types'
const status: TicketStatus = 'NEW'

// ❌ Falsch
const ticket: any = data
const status = 'NEW'  // untyped string
```

---

## Supabase-Client — welcher wann?

```typescript
// Server-side API Route (bypasses RLS, Service Role):
import { getSupabaseAdmin } from '@/lib/supabase/admin'
const supabase = getSupabaseAdmin()  // Singleton, immer wiederverwenden

// Browser / Client-Component:
import { createClient } from '@/lib/supabase/client'
const supabase = useMemo(() => createClient(), [])  // Singleton via useMemo

// Server-Component:
import { createClient } from '@/lib/supabase/server'
const supabase = createClient()

// NIEMALS: getSupabaseAdmin() in Browser-Code oder Landing-Komponenten
```

---

## API-Route Patterns

### Dashboard-APIs (Auth required)
```typescript
import { requireUserWithOrganizationFromRequest } from '@/lib/auth-guard'

export async function GET(req: NextRequest) {
  const authResult = await requireUserWithOrganizationFromRequest(req)
  if (!authResult.ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: authResult.status || 401 })
  }
  // authResult.organization_id ist garantiert vorhanden
  const supabase = getSupabaseAdmin()
  const { data } = await supabase
    .from('tickets')
    .eq('organization_id', authResult.organization_id)  // IMMER filtern!
    // ...
}
```

### Vapi-Tool-Endpoints (Secret-Auth)
```typescript
export async function POST(req: Request) {
  const secret = req.headers.get('x-vapi-secret')
  if (!secret || secret !== process.env.VAPI_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  // ...
}
```

### Vapi-Response-Format (PFLICHT)
```typescript
// Normaler Tool-Response:
return NextResponse.json({
  results: [{ toolCallId: toolCallId, result: 'Ticket erstellt. Code: HV-001' }]
})

// End-Call-Response:
return NextResponse.json({
  results: [{ toolCallId: toolCallId, result: 'success' }],
  endCall: true
})
```

### DB-Fehlerbehandlung
- Kritische Fehler: loggen + strukturierte Error-Response zurückgeben
- Nicht-kritische (Activity-Log, SMS): `try/catch` + `console.warn`, Hauptflow fortsetzen
- Timeouts in Vapi-Webhooks: `Promise.race()` mit 8s-Timeout

---

## Komponenten-Patterns

### Wann `'use client'`?
Nur wenn nötig: `useState`, `useEffect`, Event-Handler, Browser-APIs, `framer-motion`

### Landing vs. App — strikte Trennung
```typescript
// ✅ Landing-Komponente — KEIN Supabase
export function HeroSection() { return <div>...</div> }

// ✅ App-Komponente — AuthGuard PFLICHT
export default function TicketsPage() {
  return <AuthGuard><TicketDashboard /></AuthGuard>
}

// ❌ Landing mit Supabase = Build-Fehler auf .de!
import { createClient } from '@/lib/supabase/client'  // NICHT in Landing
```

### Styling-Konventionen
- Tailwind CSS — keine Inline-Styles, keine CSS-Module
- Dark Mode via `dark:` Präfix
- Primärfarbe: `indigo-600` / Hover: `indigo-700`
- Cards: `bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800`
- Badges: kleine spans mit `text-[10px] font-bold px-1.5 py-0.5 rounded-md border`
- Animationen: Framer Motion `motion` + `AnimatePresence` für Overlays/Modals

---

## Datenbankabfragen — Regeln

```typescript
// ✅ Immer organization_id filtern
const { data } = await supabase
  .from('tickets')
  .select('id, ticket_code, status')
  .eq('organization_id', orgId)
  .order('created_at', { ascending: false })

// ✅ Timeout für Vapi-Webhooks (Vercel 10s Limit)
const result = await Promise.race([
  supabase.from('tickets').insert(payload).select().single(),
  new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('[TIMEOUT]')), 8000)
  )
])

// ✅ Phone-Matching: letzten 10 Ziffern
.ilike('caller_phone', `%${last10}`)

// ❌ Kein org-Filter
const { data } = await supabase.from('tickets').select('*')  // NIEMALS
```

---

## Naming Conventions

| Was | Konvention | Beispiel |
|-----|-----------|---------|
| React-Komponenten | PascalCase | `TicketListItem` |
| Hooks | camelCase mit `use` | `useTickets` |
| API-Routes | `route.ts` in Verzeichnis | `app/api/tickets/route.ts` |
| Utility-Funktionen | camelCase | `getLast10Digits()` |
| DB-Spalten | snake_case | `organization_id` |
| TypeScript-Interfaces | PascalCase | `AuthGuardResult` |
| Enum-Werte | UPPER_SNAKE | `IN_PROGRESS`, `EMERGENCY` |
| Vapi-Tool-Namen | snake_case | `get_active_tickets` |

---

## Commit-Konventionen

```
feat:       Neues Feature
fix:        Bugfix
refactor:   Umbau ohne Funktionsänderung
docs:       Dokumentation
security:   Sicherheits-Patch (Input-Sanitizing, Auth)
resilience: Timeout / Error-Handling
```

---

## Anti-Patterns — NIEMALS

| Anti-Pattern | Warum |
|-------------|-------|
| `getSupabaseAdmin()` im Browser | Service-Role-Key würde leaken |
| `lib/supabase/*.ts` modifizieren | Singleton-Integrität |
| `middleware.ts` anfassen | Multi-Domain-Routing bricht |
| Neue npm-Pakete ohne Absprache | Bundle-Size, Konflikte |
| `--no-verify` bei git commit | Hooks umgehen |
| `git push` ohne explizite Anfrage | Ungewollte Deploys |
| Supabase-Imports in `app/page.tsx` oder `components/landing/` | Build-Fehler auf .de |
| `console.log` in Produktions-Code | Nur `console.warn` / `console.error` |
