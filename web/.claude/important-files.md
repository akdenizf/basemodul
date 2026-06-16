# Important Files — Callfolio MVP

## Konfigurationsdateien

| Datei | Zweck |
|-------|-------|
| `.env.local` | Alle Secrets + URLs (nicht committen!) |
| `env.example` | Template für .env.local |
| `next.config.mjs` | Next.js Config (typedRoutes, Image-Hosts) |
| `tailwind.config.ts` | Tailwind-Theme-Erweiterungen |
| `tsconfig.json` | TypeScript strict mode, path aliases (`@/*`) |
| `.eslintrc.json` | ESLint-Regeln (next/core-web-vitals) |
| `middleware.ts` | Multi-Domain-Routing — NICHT anfassen |
| `.vercel/project.json` | Vercel-Projekt-ID + Org-ID |

---

## Environment Variables

### Pflicht (App startet nicht ohne diese)
```bash
NEXT_PUBLIC_SUPABASE_URL=        # Supabase-Projekt-URL (public)
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Supabase Anon Key (public)
SUPABASE_SERVICE_ROLE_KEY=       # Service Role Key (nur Server-seitig!)
SUPABASE_URL=                    # = NEXT_PUBLIC_SUPABASE_URL (für Admin-Client)
```

### Vapi
```bash
VAPI_WEBHOOK_SECRET=             # Secret für x-vapi-secret Header
```

### Twilio (SMS-Foto-Requests)
```bash
TWILIO_ACCOUNT_SID=              # AC...
TWILIO_AUTH_TOKEN=
TWILIO_MESSAGING_SERVICE_SID=    # MG...
```

### E-Mail (Resend)
```bash
RESEND_API_KEY=                  # re_...
RESEND_FROM=                     # tickets@callfolio.io
NEXT_PUBLIC_ADMIN_EMAIL=         # Empfänger für System-Alerts
```

### App URLs
```bash
NEXT_PUBLIC_APP_URL=             # https://www.callfolio.io
NEXT_PUBLIC_SITE_URL=            # https://www.callfolio.io
```

---

## Kritische Quellcode-Dateien

### Entrypoints
| Datei | Funktion |
|-------|---------|
| `app/layout.tsx` | Root-Layout (ThemeProvider) |
| `app/page.tsx` | Landing Page |
| `app/(app)/layout.tsx` | App-Shell mit Sidebar |
| `app/(app)/tickets/page.tsx` | Ticket-Dashboard (Haupt-View) |
| `middleware.ts` | Domain-Routing |

### Backend-Kern
| Datei | Funktion |
|-------|---------|
| `app/api/vapi/webhook/route.ts` | Vapi-Haupt-Handler (submit_ticket, assistant-request) |
| `app/api/vapi/get-tickets/route.ts` | get_active_tickets Tool |
| `app/api/vapi/add-ticket-note/route.ts` | add_ticket_note Tool |
| `app/api/tickets/route.ts` | Dashboard Ticket-List API (pagination, filters) |
| `app/api/admin/send-email/route.ts` | E-Mail-Dispatch + Activity-Log |

### Shared Libraries
| Datei | Funktion |
|-------|---------|
| `lib/types.ts` | ALLE TypeScript-Interfaces |
| `lib/auth-guard.ts` | `requireUserWithOrganizationFromRequest()` |
| `lib/supabase/admin.ts` | `getSupabaseAdmin()` Singleton |
| `lib/supabase/client.ts` | Browser-Client Singleton |
| `lib/supabase/server.ts` | SSR-Client |
| `lib/fuzzy-match.ts` | 3-Tier Tenant-Matching |
| `lib/twilio.ts` | SMS-Foto-Request |
| `lib/email-templates.ts` | Resend HTML-Templates |

### Haupt-Komponenten
| Datei | Funktion |
|-------|---------|
| `components/TicketDashboard.tsx` | Haupt-Dashboard-Komponente (Filter, Pagination, State) |
| `components/dashboard/TicketListItem.tsx` | Einzelne Ticket-Karte (expandierbar) |
| `components/ActivityTimeline.tsx` | Ticket-Aktivitäts-Log |
| `components/EmailPreviewModal.tsx` | E-Mail-Compose + Template-Auswahl |
| `components/AuthGuard.tsx` | Client-seitiger Auth-Guard |
| `components/layout/AppSidebar.tsx` | App-Navigation |

---

## Vapi-Konfigurationsdateien

| Datei | Funktion |
|-------|---------|
| `docs/vapi-system-prompt-v9.1.md` | **Aktuellster** System Prompt (in Vapi einfügen) |
| `docs/vapi-tools-config.json` | **Aktuelles** Tool-Schema v9.1 (get_active_tickets, add_ticket_note, submit_ticket) |
| `app/api/vapi/AGENTS.md` | API-Vertrag + Entscheidungsbaum |
| `AI_CONTEXT/vapi-integration.md` | Operative Kurzreferenz für KI-Konfiguration |

---

## Datenbankmigrationen

Reihenfolge für frische Datenbank:
1. `database/saas-multi-tenant-setup.sql` — Kern-Schema
2. `database/BULLETPROOF_SETUP.sql` — Stabilisierte Version
3. `database/create_ticket_activities.sql` — Activity-Log-Tabelle
4. `database/v6-visual-context.sql` — Foto-Attachments
5. `database/v7-settings-upgrade.sql` — Org-Settings
6. `database/v8-contractor-ticket.sql` — Handwerker + Contractor-Feld

Aktuelle Validierungsabfragen: `database/VALIDATION_QUERIES.sql`

---

## Docs-Übersicht (welche ist relevant)

| Datei | Relevant für |
|-------|-------------|
| `docs/API_REFERENCE.md` | Alle API-Route-Signaturen |
| `docs/DEPLOYMENT_GUIDE.md` | Vercel + Supabase-Setup |
| `docs/TROUBLESHOOTING.md` | Häufige Fehler + Lösungen |
| `docs/DATA_PRIVACY_COMPLIANCE.md` | DSGVO / EU AI Act |
| `docs/DUPLICATE_PREVENTION_SETUP.md` | Anti-Duplicate-System |
| `IMPLEMENTATION_STATUS.md` | Feature-Status-Übersicht |
| `PROJECT_CONTEXT.md` | Mermaid-Datenfluss, SQL-Schema |
