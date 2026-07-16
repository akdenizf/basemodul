# _parked/ — geparkter Callfolio-SaaS-Unterbau

[↑ web/](../CLAUDE.md)

Vollständiger Multi-Tenant-SaaS aus dem Callfolio-Template. **Inaktiv**:
vom Typecheck ausgeschlossen (`tsconfig.json` → `exclude: ["_parked"]`),
nicht von der Landing importiert. Nicht löschen — Basis für den echten Piloten.

## Was hier liegt

| Pfad | Inhalt |
|---|---|
| `app/(app)/` | Dashboard, Tickets, Tenants, Settings, History, Import, Help |
| `app/(auth)/` | Login, Onboarding |
| `app/api/` | alle Backend-Routes (Vapi, Twilio, Resend, Supabase, Admin) |
| `app/t · app/upload · app/order` | öffentliche Ticket-/Upload-Flows |
| `components/` | Dashboard-/Admin-/Tenant-Komponenten + `ui/` (shadcn) |
| `components/landing/` | ungenutzte Landing-Teile (Vapi-`LiveCallExperience` u.a.; `ScrollStorySection` seit der Choreografie 2026-07-16 geparkt — telefon-only Sticky-Story, wiederverwendbar für eine spätere SHK/Notdienst-Branchen-Landing) |

## Reaktivieren (für echten Piloten)

1. Benötigte Routen aus `_parked/app/` zurück nach `app/` schieben.
2. `middleware.ts` wiederherstellen (Auth/Supabase-Refresh) — aktuell Pass-through.
3. **Eigene, neue Keys** in `.env.local` (Vorlage: `.env.example`).
   **Niemals** Callfolio-Production-Keys.
4. `tsconfig.json`-Exclude für die reaktivierten Pfade anpassen.
5. DSGVO/AVV prüfen, bevor echte Kundendaten fließen.

⚠️ Code hier erwartet Live-Backends (Supabase/Vapi/Twilio/Resend) und läuft
ohne Keys nicht. Deshalb ist er bewusst geparkt.
