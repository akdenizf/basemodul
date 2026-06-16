# Callfolio Project Journal

**Purpose:** Chronological log of major milestones, architectural decisions, and significant changes to maintain project history and strategic context.

---

## 2026-04-22 | v9.2 "Architecture Refinement & Vapi v12.0" 🏗️

**Status:** Vapi Prompt v12.0 | Refactoring started | Enhanced Task Handling

**What:** Upgrade des Vapi System Prompts auf v12.0 (Empathie, Struktur) und Initiierung eines umfassenden Refactorings des monolithischen Webhooks.
**Where:** `app/api/vapi/webhook/route.ts`, `docs/vapi-system-prompt-v12.0.md`.
**Why:** Der Webhook ist auf ~700 Zeilen angewachsen und dupliziert Logik. Die neue Architektur trennt Request-Dispatching von Geschäftslogik und Tools. Prompt v12.0 verbessert die Gesprächsführung und Fehlertoleranz.

**Impact:**
- **Vapi Prompt v12.0:** Einführung von "Active Empathy" Patterns, klarerer Task-Trennung und optimiertem Tooling-Verständnis (z.B. Folgeanruf-Erkennung).
- **Architecture Refactor (In Progress):** Separation of Concerns durch Extraktion von Datenbank-Diensten (`_vapi-service.ts`) und Tool-Handlern (`_vapi-tools.ts`).
- **Enhanced Task Handling:** Optimierte Logik für `add_ticket_note` und `get_active_tickets` zur Vermeidung von Dubletten.

---

## 2026-02-25 | v8.1 "Cinematic B2B Landing Page" 🎬

**Status:** V0 1:1 Integration | B2B Localization | Dynamic Pricing & Onboarding UI

**What:** Vollständiger Austausch der rudimentären Landingpage durch ein neues, 1:1 pixelperfektes V0-Design, das exakt auf deutsche traditionelle Hausverwaltungen zugeschnitten ist.
**Where:** `components/landing/*`, `app/page.tsx`, `tailwind.config.ts`, `task.md`
**Why:** Der erste Eindruck (Trust) ist bei B2B-Kunden entscheidend. Die alte Seite war zu generisch, die neue vermittelt "German Engineering" und Premium-SaaS-Qualität.

**Impact:**
- **Cinematic Integration:** Exakte 1:1 Umsetzung der V0 "Stitch"-Exporte in die App Router Struktur mit alternierendem Hell/Dunkel Kontrast-Rhythmus.
- **Tailwind OKLCH Fix:** Skript-basierte Konvertierung von V4 OKLCH CSS Variablen zu nativen Tailwind V3 Klassen, um Kontrastfehler in Dark-Sections zu beheben.
- **B2B Localization (Denglisch Cleanup):** Eliminierung von "Tech-Buzzwords". "Visual Context" wurde zu "Automatischer Foto-Upload", "Deep Insights" zu "Erweiterte KI-Analysen", "Live Workflow" zu "Ticket-Ablauf".
- **Dynamic Pricing & Onboarding:** React-State Logik für monatliche/jährliche Preise (mit durchgestrichenen psychologischen Rabatten). Komplett-Redesign der Onboarding-Box zu einem aufgeräumten, 2-spaltigen B2B-Grid (500€ -> 250€ einmalig), Entfernung von verspielten AI-Badges.

---

## 2026-02-24 | v8.0 "Commercial Expansion" 📊

**Status:** Kaufmännische Kategorien | Priority Mapping | System Prompt v2.0

**What:** Erweiterung des Voice-Intake-Systems um kaufmännische Anliegen (Nebenkostenabrechnungen, Ruhestörungen) und Implementierung eines intelligenten Priority-Mappings für Vapi-Payloads.
**Where:** `lib/types.ts`, `app/api/vapi/webhook/route.ts`, `lib/email-templates.ts`, `lib/utils/template-parser.ts`, `AGENTS.md`, `PROJECT_CONTEXT.md`
**Why:** Hausverwaltungen erhalten nicht nur technische Schadensmeldungen — kaufmännische Anfragen (Nebenkostenabrechnung, Mietzahlungen) machen ~40% des Anrufvolumens aus und müssen korrekt kategorisiert werden.

**Impact:**
- **Neue Kategorien:** COMMERCIAL (Kaufmännisch), BILLING (Abrechnung), UTILITIES (Nebenkosten), NOISE_COMPLAINT (Ruhestörung) als Kern-Features.
- **Priority Mapping:** Webhook akzeptiert sowohl `urgency` als auch `priority` aus dem Vapi-Payload. URGENT→HIGH, EMERGENCY→CRITICAL. Fallback: MEDIUM.
- **Absturzsicherheit:** Unbekannte Kategorien werden als Raw-String gespeichert — der Webhook crasht nie.
- **System Prompt v2.0:** Aktive Empathie, Mieter/Eigentümer-Qualifizierung, Erste-Hilfe-Triage, kaufmännische Deeskalation ("Keine Zahlen erfinden!"), Visual Context SMS-Erklärung.
- **Keine DB-Migration:** `category` und `urgency` Spalten sind `text` (kein Postgres Enum).

**Feature Freeze Ausnahme:** Kaufmännische Kategorien wurden bewusst als Erweiterung des Kernprodukts nachgezogen (siehe `docs/FEATURE_FREEZE_v5.1.md` Addendum).

---

## 2026-02-18 | v7.0 "Automation & Scaling" 🚀

**Status:** Communication Templates | Tenant CRUD | Dashboard Command Center

**What:** Einführung von anpassbaren Kommunikations-Vorlagen und vollständiger Mieter-Verwaltung direkt im Dashboard.
**Where:** `app/api/communication-templates/`, `app/api/tenants/update/`, `components/tenants/EditTenantDialog.tsx`, `database/v7-settings-upgrade.sql`
**Why:** Skalierung der Backoffice-Prozesse durch Automatisierung der Mieter- und Handwerker-Kommunikation.

**Impact:**
- **Template Engine:** Dynamische Platzhalter wie `{{tenant_name}}` werden beim E-Mail-Versand automatisch befüllt.
- **Tenant CRUD:** Admins können Mieterdaten korrigieren oder löschen, ohne die Datenbank direkt zu bearbeiten.
- **Settings Upgrade:** Neue Tabellen für Vorlagen und globale Organisationseinstellungen.

## 2026-02-17 | v6.0 "Contractor CRM" 🔧

**Status:** Handwerker-Datenbank | Ticket-Assign | Contractor Email

**What:** Integration eines Handwerker-Verzeichnisses (Contractor CRM) zur direkten Zuweisung und Beauftragung aus der Ticket-Detailansicht.
**Where:** `database/v8-contractor-ticket.sql`, `app/api/contractors/`, `components/EmailPreviewModal.tsx`.
**Why:** Schließt den Kreis von der Schadensmeldung zur tatsächlichen Behebung durch externe Partner.

**Impact:**
- **Contractor Database:** Speicherung von Gewerken, Kontaktpersonen und E-Mail-Adressen.
- **Direct Assignment:** Tickets können einem spezifischen Handwerker zugewiesen werden (FK `contractor_id`).
- **One-Click-Beauftragung:** Automatisierter E-Mail-Versand an Handwerker inkl. aller Ticket-Details und Mieter-Kontaktdaten.

---

## 2026-02-13 | v5.4 "Scale & Quality" – Visual Context 📸

**Status:** SMS photo upload | Twilio integration | Photo gallery in dashboard

**What:** SMS-triggered photo upload for damage documentation (PLUMBING, WATER_DAMAGE, HEATING). Tenants receive an SMS with a link to /upload/[ticketId] to upload photos.
**Where:** `lib/twilio.ts`, `app/api/upload/route.ts`, `app/upload/[id]/page.tsx`, `app/api/vapi/webhook/route.ts`, `app/api/admin/tickets/[id]/attachments/`, `components/TicketAttachments.tsx`, `database/v6-visual-context.sql`
**Why:** Enable visual evidence collection for damage categories without requiring tenant authentication.

**Impact:**
- **Twilio SMS Integration:** `sendPhotoRequestSMS()` sends link to mobile upload page for qualifying categories.
- **ticket_attachments Table:** New table for photo metadata; files stored in Supabase Storage bucket "ticket-evidence".
- **Photo Gallery:** Admin dashboard displays attachments with lightbox view.
- **Unauthenticated Upload:** Tenants upload via ticketId-only validation (no login required).

## 2026-02-12 | v5.3 "Stability & Consolidation" 🛡️

**Status:** Supabase SSR konsolidiert | Auth standardisiert | Domain-Routing aktiv

**What:** Vollständige Konsolidierung der Supabase-Clients auf ein Singleton-Pattern und Standardisierung des Authentifizierungs-Flows über alle API-Routen hinweg.
**Where:** `lib/supabase/`, `middleware.ts`, `lib/auth-guard.ts`, `app/api/admin/**`.
**Why:** Behebung von 401-Fehlern (Unauthorized), Eliminierung der "Multiple GoTrueClient instances" Warnung und Vorbereitung auf den produktiven Einsatz unter `www.callfolio.io`.

**Impact:**
- **Supabase Singleton Pattern:** Einführung von `getSupabaseBrowserClient()` und `getSupabaseAdmin()`. Verhindert Speicherlecks und Inkonsistenzen bei der Authentifizierung.
- **Unified Auth Guard:** Alle Admin-API-Routen nutzen nun `requireUserWithOrganizationFromRequest`. Konsistente Fehlerbehandlung und Debug-Informationen bei Auth-Problemen.
- **Domain & Cookie Sync:** Die Middleware erzwingt nun `www.callfolio.io` für alle App-Pfade und sorgt für einen zuverlässigen Session-Refresh (Cookie-Synchronisation).
- **UI Reliability:** Fix des "0% Match" Bugs im Dashboard. Mieterzuordnungen werden nun korrekt mit 100% Confidence angezeigt, wenn sie verifiziert sind.

**Strategische Entscheidungen (Logbuch):**

| Entscheidung | Grund | Konsequenz |
| --- | --- | --- |
| Singleton Clients | "Multiple GoTrueClient instances" Warnung | Stabile Auth-Sessions im Browser und auf dem Server. |
| Strict Domain Routing | Cookie-Isolation & SEO | Klare Trennung zwischen Landingpage (.de) und App (.io). |
| SSR Client Trennung | Build-Fehler (next/headers) | `admin.ts` ohne `next/headers` ermöglicht Nutzung in transitiven Client-Abhängigkeiten. |
| Structured Logging | Debugging-Effizienz | Schnelle Identifikation von Auth- vs. DB- vs. API-Fehlern durch Prefixe wie [Auth]. |

---

## 2026-02-07 | v5.1 "The SaaS Foundation" 🏗️

**Status:** Feature Freeze erreicht | Kernlogik stabil

**What:** Transformation von einer Single-Admin-Lösung zu einer echten Multi-Tenant SaaS-Architektur mit intelligenter Identitätsauflösung.
**Where:** Datenbank-Schema (profiles, tenants), Auth-System, API-Routes, Dashboard UI, Vapi Webhook.
**Why:** Skalierbarkeit für unendlich viele Hausverwaltungen und präzise Anrufer-Identifizierung trotz KI-Unschärfe.

**Impact:**
- **Multi-Tenant Transformation:** Vollständige Datenisolation. Jeder User sieht nur seine eigenen Daten; Vapi-IDs werden dynamisch in der DB gemappt.
- **Secure CSV Onboarding Engine:** Hausverwalter können Rohdaten ohne technische IDs hochladen. Höchste Sicherheit durch erzwungenes serverseitiges "Data-Stamping" aus der Session.
- **Identity Resolution & Dashboard UX:** Einführung der `AssignmentBox` und des Confidence-Systems (MATCH, REVIEW, UNKNOWN). Überbrückt die Lücke zwischen KI-Akustik und Stammdaten.
- **Caller Identification (Pre-Call Magic):** Implementierung des `assistant-request` Handlers zur Echtzeit-Identifizierung. Mieter werden namentlich begrüßt; Tickets starten mit 100% Confidence.

**Strategische Entscheidungen (Logbuch):**

| Entscheidung | Grund | Konsequenz |
| --- | --- | --- |
| No-Recording Policy | DSGVO-Konformität & Haftung | Höheres Vertrauen bei Kunden, geringere Speicherkosten. |
| Bearer-Token Auth | API-Stabilität | 401-Fehler bei Cross-Origin-Requests (Webhooks) eliminiert. |
| Server-Side Stamping | Sicherheits-Guardrail | Nutzer können keine fremden IDs via CSV einschleusen. |
| Human-in-the-loop | Datenqualität | Admins behalten die finale Kontrolle über kritische Mieterzuordnungen. |

---

## 2026-01-29 | v5.2 Stabilization & Vapi Optimization

**What:** Comprehensive stabilization of database schema, CSV import hardening, and Vapi system prompt optimization.
**Where:** `database/BULLETPROOF_SETUP.sql`, `lib/audit-log.ts`, `docs/vapi-system-prompt-v5.md`, `app/api/admin/import/*`
**Why:** Resolve critical schema-code mismatches and improve conversational flow for better UX and reliability.
**Impact:** 
- **Reliable Onboarding:** CSV Import now uses `canonical_address` for accurate deduplication.
- **Consistent Schema:** Standardized `match_type` and nullable `admin_email` for system logs.
- **Superior UX:** Vapi assistant now follows "Proactive Leadership" and "Silent Error Handling" principles.
- **Compliance:** Full EU AI Act compliance with immediate AI disclosure.

**Technical Details:**
- Added `canonical_address` column and unique index to `tenants` table.
- Renamed `tenant_match_type` to `match_type` across all SQL and TypeScript files.
- Made `admin_email` nullable in `ticket_activities` to support system-generated audit logs.
- Updated Vapi prompt to v5.2 with optimized conversation flow and minimal summaries.
- Synchronized TypeScript interfaces with database schema updates.

---

## 2025-01-27 | Ghost Tickets Implementation

**What:** Extended Vapi webhook handler to create "Ghost Tickets" for aborted calls
**Where:** `app/api/vapi/webhook/route.ts`
**Why:** Ensure complete audit trail - no calls should be lost, even if they don't result in full tickets
**Impact:** 
- 100% call accountability for compliance and analysis
- Non-intrusive tracking (Ghost Tickets don't require manual review)
- Improved system reliability with comprehensive error handling

**Technical Details:**
- Added `VapiEndOfCallReportMessage` type for end-of-call-report events
- Conditional message handling for both tool-calls and end-of-call-report
- Ghost Tickets created with CLOSED status and OTHER category
- Full Vapi report stored in ticket_json for auditing

---

## 2025-01-27 | Professional Email Templates

**What:** Redesigned admin email notifications for Outlook power-users
**Where:** `lib/email-templates.ts`
**Why:** Property managers need CRM-style emails that are filterable and actionable
**Impact:**
- Outlook-optimized subject format: `[STATUS] [PRIO] Ticket #CODE | KATEGORIE - Mieter`
- Structured body with header table, action bridge, AI summary, and raw transcript
- Professional appearance increases admin adoption and efficiency

**Technical Details:**
- Added status and priority badge functions
- CRM-style body structure with clear sections
- Action Bridge link to dashboard for immediate ticket access
- Standardized footer with generation timestamp

---

## 2025-01-27 | Admin Error Alerting System

**What:** Robust error notification system for critical failures
**Where:** `lib/admin-alert.ts`, integrated into webhook handler
**Why:** Silent failures are unacceptable in production - admins must know when the system fails
**Impact:**
- Immediate admin notification for system errors via email
- Comprehensive error context including payloads and stack traces
- Fault-tolerant design that doesn't cascade failures

**Technical Details:**
- `sendAdminAlert` function with structured error reporting
- Safe JSON stringification handling circular references
- Console logging for server logs + email alerts for immediate action
- Integrated into all critical database operations

---

## 2025-01-27 | v5.1 Feature Freeze Implementation

**What:** Strategic guardrails to prevent feature creep during MVP phase
**Where:** Root `AGENTS.md`, local `AGENTS.md` files, `.cursor/prompts/callfolio-structure.md`
**Why:** Focus on core value proposition - property managers with 500-3000 units buying NOW
**Impact:**
- Clear scope boundaries for AI agents and development decisions
- Efficient context processing without parsing full freeze document
- Maintained development velocity on core features

**Technical Details:**
- Created `docs/FEATURE_FREEZE_v5.1.md` as definitive source
- Injected concise scope checks into all AGENTS.md files
- Updated cursor prompts with mandatory v5.1 scope validation

---

## 2025-01-27 | Dashboard Redesign (3-Column Command Center)

**What:** Complete redesign of admin dashboard with modern UX
**Where:** `components/TicketDashboard.tsx`, `components/TicketCard.tsx`, `app/admin/page.tsx`
**Why:** Property managers need efficient ticket triage and management interface
**Impact:**
- Intuitive 3-column layout: Status-Zentrale, Ticket-Liste, Detail-Ansicht
- Real-time Supabase integration with live updates
- Professional appearance matching property management workflows

**Technical Details:**
- Dynamic imports to prevent SSR issues
- Supabase real-time subscriptions for live dashboard updates
- Fuzzy matching editor for manual tenant assignment
- Comprehensive error handling for missing environment variables

---

## 2025-01-27 | Product Readiness Audit

**What:** Comprehensive analysis of system readiness for market launch
**Where:** `PRODUCT_READINESS_AUDIT.md`
**Why:** Identify critical gaps before customer deployment
**Impact:**
- Identified silent failure risks and missing error handling
- Defined clear test scenarios for manual validation
- Established offline/fallback requirements

**Key Findings:**
- Need for admin alerting system (subsequently implemented)
- Ghost ticket requirement for call auditing (subsequently implemented)
- Email template professionalization needs (subsequently implemented)

---

## 2026-04-30 | v11.0 "Account Security & Control" 🔐

**Status:** Danger Zone Implementation | Cascading Deletes | Admin Safeguards

**What:** Einführung eines "Danger Zone" Bereichs in den Einstellungen zur vollständigen und rechtssicheren Löschung von Konten und Daten.
**Where:** `app/(app)/settings/page.tsx`, `app/api/user/delete/route.ts`.
**Why:** DSGVO-Konformität und Nutzerkontrolle. Eine manuelle Löschung durch den Admin war zu fehleranfällig; die neue API garantiert eine saubere Löschung aller verknüpften Daten in der korrekten Reihenfolge.

**Impact:**
- **Danger Zone Modal:** Mehrstufiger Bestätigungsprozess (Tippen von "LÖSCHEN") zur Vermeidung versehentlicher Datenverluste.
- **Cascading Backend Deletion:** Die API löscht Tickets, Mieter, Handwerker, Vapi-Verknüpfungen und den Auth-User in einem geschützten Admin-Context.
- **Security Safeguards:** Integration von Auth-Guards, die sicherstellen, dass Nutzer nur ihre eigene Organisation löschen können.

---

## 2026-04-29 | v10.0 "Full Light Theme & Design System" 🎨

**Status:** Double Bezel Migration | German Localization | Branding Cleanup

**What:** Vollständige Migration der gesamten Plattform auf ein exklusives Light-Mode Design-System ("Full Light Theme") und finale deutsche Lokalisierung.
**Where:** `components/TicketDashboard.tsx`, `components/layout/AppSidebar.tsx`, `app/layout.tsx`, `docs/KOSTENPLANUNG.md`.
**Why:** Ein einheitliches, helles "Editorial Design" wirkt im B2B-Bereich hochwertiger und vertrauenswürdiger. Dunkle Segmente wurden entfernt, um visuelle Brüche zu vermeiden.

**Impact:**
- **Double Bezel Architecture:** Einführung von mehrschichtigen Karten-Layouts mit weichen Schatten und hochwertigen Slate/White Kontrasten.
- **Branding Cleanup:** Konsistente Nutzung der `icon.svg` (Vapi-Logo) statt statischer Platzhalter. Favicon-Cache-Busting (`?v=2`) für Chrome-Konsistenz.
- **German Localization:** Alle Dashboards, Filter, Statusmeldungen und Modals sind nun vollständig in professionellem Deutsch (Property-Management Terminologie).
- **Strategy Alignment:** Erstellung der `KOSTENPLANUNG.md` zur Festlegung von USPs und Margen gegenüber Wettbewerbern.

---

## 2026-05-04 | v12.9 "Technischer Durchbruch (Connectivity & Security)" 🚀

**Status:** Security Stabilized | DB Joins Fixed | System Prompt v12.9

**What:** Erfolgreicher Testlauf #4 bestätigt die vollständige Funktion der Vapi-Schnittstelle inklusive Authorization-Headern und komplexem Multi-Ticket-Handling.
**Where:** `app/api/vapi/webhook/route.ts`, `docs/vapi-system-prompt-v12.9.md`, `database/v8-contractor-ticket.sql`.
**Why:** Sicherheit und Datenkonsistenz im Voice-Backend waren essentiell für den Launch. Die Kombination aus `x-vapi-secret` und präzisen Datenbank-Joins garantiert nun sichere, fehlertolerante Anrufe.

**Impact:**
- **Security & Webhooks:** 100% stabile Authentifizierung. 401-Fehler eliminiert.
- **Datenbank-Schnittstelle:** SQL-Schema-Fix für den Join zwischen `tickets` und `contractors` erfolgreich (`PGRST200` eliminiert). KI erkennt nun beauftragte Dienstleister namentlich.
- **Multi-Ticket-Handling:** Autonome Unterscheidung zwischen `add_ticket_note` (Folgeanliegen) und `submit_ticket` (neues Problem) funktioniert zuverlässig.
- **Vorbereitung Sprint 5:** Action Items (Strict Prompt Enforcement, Null-Value Handling für Placeholder, End-Call Delay 2.5s, Legacy-Data Patch) wurden aus der Fehleranalyse abgeleitet und im Prompt vorbereitet.

---

## Project Evolution Notes

**Architecture Philosophy:** 
- Fractal Context Pattern for AI agent guidance
- 3-Tier Matching Engine (Phone-Exact → Fuzzy → Manual Review)
- Security-first approach with server-side database operations

**Quality Standards:**
- TypeScript strict mode throughout
- Comprehensive error handling with admin alerts
- Real-time capabilities with Supabase subscriptions
- GDPR/EU AI Act compliance (no recordings, AI transparency)

**Next Major Milestones:**
- Full Production Readiness Audit & Performance Tests
- Multi-Language Support Expansion (optional)
- Automated Billing Integration (Stripe/Supabase Billing)
- Advanced Analytics Dashboard for Call Trends

---

## 2026-05-07 | v15.2 "Master-Lookup & Persistence Guard" 🛡️

**Status:** get_caller_context active | secondary_phone support | SMS-Protection

**What:** Umstellung auf ein Master-Lookup-System zur Reduzierung der Tool-Aufrufe und Erhöhung der Identifikationsrate. Einführung eines SMS-Schutzes gegen doppelte Anfragen.
**Where:** `app/api/vapi/webhook/route.ts`, `database/v14-tenant-phone-secondary.sql`, `docs/vapi-system-prompt-v15.2.md`.
**Why:** Die KI muss Mieter zuverlässig erkennen, auch wenn sie von einer Zweitnummer anrufen. Gleichzeitig soll verhindert werden, dass bei jedem Folgeanruf erneut eine Foto-SMS gesendet wird (Kostenersparnis & UX).

**Impact:**
- **Master-Lookup (`get_caller_context`):** Vereint Mieterstamm, aktive Tickets und Organisations-Daten in einem Request. Latenz um ~1.5s reduziert.
- **`phone_secondary` Support:** Mieter können nun mit zwei Nummern im System hinterlegt werden.
- **SMS-Guard:** Server prüft vor jedem SMS-Versand (`photo_requested`), ob für das Ticket bereits eine SMS gesendet wurde.
- **Identity Fallback:** Wenn kein Mieter gefunden wird, zieht das System die Identität aus dem neuesten aktiven Ticket (Ticket-Persistence).
- **RESEND_FROM Fix:** Alle ausgehenden Benachrichtigungen nutzen nun die verifizierte System-Email.

---

*This journal is updated after each major milestone or architectural decision. For detailed technical documentation, see `PROJECT_CONTEXT.md`.*