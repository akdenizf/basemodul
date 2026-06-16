---
name: callfolio-database
description: Supabase schema for Callfolio — tables, RLS patterns, auth, migration conventions
---

# Callfolio Database Skill

## Haupt-Tabellen

| Tabelle | Zweck |
|---|---|
| `tickets` | Kern-Tabelle — caller_phone, status, issue_details, category, unit |
| `ticket_activities` | Audit-Log — activity_type: created, follow_up_call, photo_requested |
| `ticket_attachments` | Foto-Uploads (Supabase Storage) |
| `organizations` | Multi-Tenant — verknüpft via vapi_phone_id |
| `tenants` | Mieter — phone matching |
| `profiles` | Auth-User-Profil — verknüpft mit organizations |

## Auth Pattern

| Kontext | Methode |
|---|---|
| Dashboard-Routes | `requireUserWithOrganizationFromRequest()` aus `lib/auth-guard.ts` |
| Vapi-Endpoints | `x-vapi-secret` Header = `VAPI_WEBHOOK_SECRET` |
| Admin-Queries (bypass RLS) | `getSupabaseAdmin()` aus `lib/supabase/admin.ts` |

## Migrations-Konvention

- Dateien in `database/` — Format: `v[N]-[feature].sql`
- Aktuelle Version: v9 (phone-index)
- Neue Migrations immer als neue Datei; bestehende SQL niemals editieren

## Wichtige Indizes / RPCs

- `database/v9-phone-index.sql` — Phone-Index für schnelle Lookups
- Fuzzy Matching: `v4-fuzzy-matching.sql`
- Ticket-Activities-Log: `v5-audit-log.sql`
