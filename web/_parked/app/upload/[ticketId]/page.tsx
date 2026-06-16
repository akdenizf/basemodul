import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import UploadClient from './UploadClient'

interface Props {
    params: { ticketId: string }
    searchParams?: { mode?: string }
}

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Foto & Daten senden | Callfolio',
        description: 'Ergänzen Sie Ihre Angaben für eine schnellere Bearbeitung.',
        robots: 'noindex, nofollow',
    }
}

function isBlankOrUnknown(v: string | null | undefined): boolean {
    if (!v?.trim()) return true;
    const lower = v.toLowerCase().trim();
    return lower === 'unbekannt' || lower === 'unbekannte adresse' || lower === 'unknown' || lower === 'unbekannter mieter';
}

// Vapi sometimes stores the caller_phone as caller_name when no name was
// captured. We must NOT seed the upload form with such garbage — otherwise
// the tenant ends up keeping the phone string as their "name".
function isPhoneLikeName(v: string | null | undefined): boolean {
    if (!v?.trim()) return false;
    return /^[+\d\s\-()­]{7,}$/.test(v.trim());
}

export default async function UploadPage({ params, searchParams }: Props) {
    const { ticketId } = params
    // mode=register → identity form prominent (unknown tenant)
    // mode=photo    → identity fields hidden, photo-only (known tenant)
    const mode = (searchParams?.mode === 'register' || searchParams?.mode === 'photo')
        ? searchParams.mode
        : undefined;

    if (!ticketId) return notFound()

    const supabase = getSupabaseAdmin()

    const { data: ticket, error } = await supabase
        .from('tickets')
        .select('id, ticket_code, caller_name, caller_phone, address, unit, issue_summary, organization_id')
        .eq('id', ticketId)
        .single()

    if (error || !ticket) {
        console.error('[UploadPage] Ticket not found:', ticketId, error)
        return notFound()
    }

    let orgName: string | null = null
    let orgLogoUrl: string | null = null
    if (ticket.organization_id) {
        const { data: org } = await supabase
            .from('organizations')
            .select('name, logo_url')
            .eq('id', ticket.organization_id)
            .maybeSingle()
        if (org) {
            orgName = org.name || null
            orgLogoUrl = org.logo_url || null
        }
    }

    const needsRecovery = isBlankOrUnknown(ticket.caller_name) || isBlankOrUnknown(ticket.address)

    // Split caller_name into first/last for the new portal UI.
    // Skip if it's blank, unknown, or phone-shaped (Vapi fallback when no name was captured).
    const seedName = (!isBlankOrUnknown(ticket.caller_name) && !isPhoneLikeName(ticket.caller_name))
        ? (ticket.caller_name ?? '').trim()
        : ''
    const nameParts = seedName ? seedName.split(/\s+/) : []
    const initialFirstName = nameParts[0] ?? ''
    const initialLastName  = nameParts.slice(1).join(' ')

    return (
        <UploadClient
            ticketId={ticketId}
            ticketCode={ticket.ticket_code ?? null}
            initialFirstName={initialFirstName}
            initialLastName={initialLastName}
            initialUnit={ticket.unit ?? ''}
            issueSummary={ticket.issue_summary ?? null}
            orgName={orgName}
            orgLogoUrl={orgLogoUrl}
            needsRecovery={needsRecovery}
            mode={mode}
        />
    )
}
