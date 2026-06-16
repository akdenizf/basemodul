import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import OrderPortalClient from './OrderPortalClient'
import type { Ticket } from '@/lib/types'

interface Props {
    params: {
        ticketId: string
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    return {
        title: `Auftrags-Portal | Callfolio`,
        description: 'Verwalten Sie Ihren Auftrag ohne Login.',
        robots: 'noindex, nofollow',
    }
}

export default async function OrderPortalPage({ params }: Props) {
    const { ticketId } = params

    if (!ticketId) {
        return notFound()
    }

    const supabase = getSupabaseAdmin()

    // Fetch ticket details with the admin client since this is a public magic-link
    const { data: ticket, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', ticketId)
        .single()

    if (error || !ticket) {
        console.error('[OrderPortal] Ticket not found or error:', ticketId, error)
        return notFound()
    }

    // Fetch organization branding
    let orgLogoUrl: string | null = null
    let orgName: string | null = null
    if (ticket.organization_id) {
        const { data: org } = await supabase
            .from('organizations')
            .select('logo_url, name')
            .eq('id', ticket.organization_id)
            .maybeSingle()
        if (org) {
            orgLogoUrl = org.logo_url || null
            orgName = org.name || null
        }
    }

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
            <OrderPortalClient ticket={ticket as Ticket} orgLogoUrl={orgLogoUrl} orgName={orgName} />
        </div>
    )
}
