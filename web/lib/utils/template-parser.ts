/**
 * CALLFOLIO – Shared Template Parser
 *
 * Takes a string containing {{variable}} placeholders and a Ticket object,
 * returns the string with all placeholders replaced by real data.
 *
 * Every variable resolves to a **meaningful German fallback** when the ticket
 * field is null, undefined, or empty — no blank gaps in generated messages.
 *
 * Used by:
 *  - EmailPreviewModal (client-side preview)
 *  - VAPI webhook (server-side SMS body)
 *  - Any future notification channel
 */

import type { Ticket } from '@/lib/types'

// ---------------------------------------------------------------------------
// Localisation helpers
// ---------------------------------------------------------------------------

const URGENCY_DE: Record<string, string> = {
    EMERGENCY: 'Notfall',
    CRITICAL: 'Kritisch',
    URGENT: 'Dringend',
    HIGH: 'Hoch',
    MEDIUM: 'Mittel',
    LOW: 'Niedrig',
}

const CATEGORY_DE: Record<string, string> = {
    PLUMBING: 'Sanitär',
    HEATING: 'Heizung',
    ELECTRICAL: 'Elektrik',
    WATER_DAMAGE: 'Wasserschaden',
    BUILDING: 'Gebäude',
    STRUCTURAL: 'Gebäude',
    ADMIN: 'Verwaltung',
    COMMERCIAL: 'Kaufmännisch',
    BILLING: 'Abrechnung',
    UTILITIES: 'Nebenkosten',
    NOISE_COMPLAINT: 'Ruhestörung',
    OTHER: 'Sonstiges',
}

function estimatedTime(urgency: string | undefined | null): string {
    switch (urgency) {
        case 'EMERGENCY':
        case 'CRITICAL':
            return 'Sofort (Notfall)'
        case 'HIGH':
            return 'Innerhalb von 24 Stunden'
        case 'MEDIUM':
            return 'Innerhalb von 2–3 Werktagen'
        case 'LOW':
            return 'Innerhalb einer Woche'
        default:
            return 'Wird zeitnah bearbeitet'
    }
}

/** Safe string: returns fallback when value is null, undefined, or empty-after-trim */
function safe(value: string | null | undefined, fallback: string): string {
    const trimmed = (value ?? '').trim()
    return trimmed.length > 0 ? trimmed : fallback
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface ParseOptions {
    /** Organisation sender signature – appended when {{signature}} is used */
    signature?: string
    /** Override upload URL base (defaults to NEXT_PUBLIC_APP_URL) */
    appUrl?: string
    /** Contractor name for assignment emails */
    contractor_name?: string
    /** Direct link to the first ticket attachment (photo) */
    photo_url?: string
}

/**
 * Replace all `{{variable}}` placeholders in `template` with values derived
 * from `ticket`.  Unknown variables are left as-is so the user can see them.
 *
 * Every known variable has a **German fallback** so the output never has blank
 * gaps – even when ticket data is incomplete.
 */
export function parseTemplate(
    template: string,
    ticket: Partial<Ticket>,
    options: ParseOptions = {},
): string {
    const appUrl =
        options.appUrl ||
        (typeof process !== 'undefined'
            ? process.env?.NEXT_PUBLIC_APP_URL || 'https://www.callfolio.io'
            : 'https://www.callfolio.io')

    const uploadUrl = ticket.id ? `${appUrl}/upload/${ticket.id}` : appUrl

    // Build address with unit fallback
    const addressParts = [ticket.address, ticket.unit].filter(Boolean)
    const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : ''

    const vars: Record<string, string> = {
        // ── Ticket identifiers ──
        ticket_code: safe(ticket.ticket_code ?? ticket.id?.substring(0, 8), 'N/A'),
        ticket_id: safe(ticket.id, 'Nicht verfügbar'),

        // ── Caller / tenant ──
        tenant_name: safe(ticket.caller_name, 'Mieter/in'),
        caller_name: safe(ticket.caller_name, 'Mieter/in'),
        phone: safe(ticket.caller_phone, 'Keine Nummer hinterlegt'),
        caller_phone: safe(ticket.caller_phone, 'Keine Nummer hinterlegt'),

        // ── Issue ──
        issue: safe(ticket.issue_summary, 'Keine Beschreibung vorhanden'),
        issue_summary: safe(ticket.issue_summary, 'Keine Beschreibung vorhanden'),
        issue_details: safe(ticket.issue_details, ''),
        photo_url: safe(options.photo_url, '(Kein Foto vorhanden)'),

        // ── Location ──
        address: safe(fullAddress, 'Adresse nicht bekannt'),
        unit: safe(ticket.unit, ''),

        // ── Categorisation (localised) ──
        category: CATEGORY_DE[ticket.category || ''] || safe(ticket.category, 'Sonstiges'),
        urgency: URGENCY_DE[ticket.urgency || ''] || safe(ticket.urgency, 'Unbekannt'),
        estimated_time: estimatedTime(ticket.urgency),

        // ── Assignment ──
        contractor_name: safe(options.contractor_name, 'Dienstleister'),

        // ── Dates ──
        created_at: ticket.created_at
            ? new Date(ticket.created_at).toLocaleString('de-DE')
            : new Date().toLocaleString('de-DE'),

        // ── Links ──
        upload_url: uploadUrl,

        // ── Branding ──
        signature: options.signature || '',
    }

    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return key in vars ? vars[key] : match
    })
}

/**
 * List of all supported variables with human-readable labels + fallback docs.
 * Used in the Settings UI to show available placeholders.
 */
export const TEMPLATE_VARIABLES = [
    { key: 'ticket_code', label: 'Ticket-Code', example: 'TK-00042', fallback: 'N/A' },
    { key: 'tenant_name', label: 'Mieter-Name', example: 'Max Mustermann', fallback: 'Mieter/in' },
    { key: 'phone', label: 'Telefonnummer', example: '+4917612345678', fallback: 'Keine Nummer hinterlegt' },
    { key: 'issue', label: 'Problembeschreibung', example: 'Heizung fällt aus', fallback: 'Keine Beschreibung vorhanden' },
    { key: 'issue_details', label: 'Weitere Details', example: 'Seit gestern Abend…', fallback: '(leer)' },
    { key: 'photo_url', label: 'Link zum Foto (Anhang)', example: 'https://supa.../image.jpg', fallback: '(Kein Foto vorhanden)' },
    { key: 'address', label: 'Adresse', example: 'Musterstr. 12, EG links', fallback: 'Adresse nicht bekannt' },
    { key: 'category', label: 'Kategorie', example: 'Heizung', fallback: 'Sonstiges' },
    { key: 'urgency', label: 'Dringlichkeit', example: 'Hoch', fallback: 'Unbekannt' },
    { key: 'estimated_time', label: 'Geschätzte Bearbeitung', example: 'Innerhalb von 24 Stunden', fallback: 'Wird zeitnah bearbeitet' },
    { key: 'contractor_name', label: 'Name des Handwerkers', example: 'Sanitär Meier GmbH', fallback: 'Dienstleister' },
    { key: 'created_at', label: 'Erstellt am', example: '17.02.2026, 22:00', fallback: '(aktueller Zeitstempel)' },
    { key: 'upload_url', label: 'Foto-Upload Link', example: 'https://callfolio.io/upload/…', fallback: '(App-URL)' },
    { key: 'signature', label: 'E-Mail Signatur', example: 'Mit freundlichen Grüßen…', fallback: '(leer)' },
] as const
