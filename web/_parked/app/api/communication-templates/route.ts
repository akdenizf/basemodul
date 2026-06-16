import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

/**
 * Communication Templates API
 * GET  → fetch all templates for the user's organization
 * PUT  → update a single template by slug
 */

async function getOrgId(request: NextRequest) {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) return null

    const token = authHeader.replace('Bearer ', '')
    const supabase = getSupabaseAdmin()
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return null

    const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('user_id', user.id)
        .maybeSingle()

    return profile?.organization_id || null
}

export async function GET(request: NextRequest) {
    try {
        const orgId = await getOrgId(request)
        if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const supabase = getSupabaseAdmin()
        const { data: templates, error } = await supabase
            .from('communication_templates')
            .select('*')
            .eq('organization_id', orgId)
            .order('slug')

        if (error) throw error

        if (!templates || templates.length === 0) {
            // Auto-initialize default templates for new orgs
            const defaultTemplates = [
                {
                    organization_id: orgId,
                    slug: 'tenant_confirmation',
                    label: 'Mieter-Bestätigung',
                    subject: 'Ihre Meldung wurde erfasst – Ticket #{{ticket_code}}',
                    content: 'Hallo {{tenant_name}},\n\nvielen Dank für Ihre Meldung. Wir haben Ihr Anliegen erfasst und kümmern uns schnellstmöglich darum.\n\n📋 IHRE MELDUNG:\nTicket-Code: {{ticket_code}}\nProblem: {{issue}}\nDringlichkeit: {{urgency}}\n\n📍 ADRESSE:\n{{address}}\n\n⏱️ VORAUSSICHTLICHE BEARBEITUNGSZEIT:\n{{estimated_time}}\n\nBei Rückfragen können Sie uns jederzeit unter der Ticket-Nummer {{ticket_code}} kontaktieren.\n\n{{signature}}'
                },
                {
                    organization_id: orgId,
                    slug: 'contractor_assignment',
                    label: 'Handwerker-Beauftragung',
                    subject: 'Auftrag: {{category}} – Ticket #{{ticket_code}}',
                    content: 'Guten Tag,\n\nhiermit beauftragen wir Sie mit folgendem Auftrag:\n\n📋 AUFTRAGSDATEN:\nTicket: {{ticket_code}}\nKategorie: {{category}}\nDringlichkeit: {{urgency}}\n\n📍 EINSATZORT:\n{{address}}\n\n👤 ANSPRECHPARTNER VOR ORT:\n{{tenant_name}}\nTelefon: {{phone}}\n\n🔧 PROBLEMBESCHREIBUNG:\n{{issue}}\n{{issue_details}}\n\nBitte bestätigen Sie den Erhalt dieses Auftrags und teilen Sie uns den voraussichtlichen Ausführungstermin mit.\n\n{{signature}}'
                },
                {
                    organization_id: orgId,
                    slug: 'sms_photo_request',
                    label: 'SMS Foto-Anfrage',
                    subject: '',
                    content: 'Guten Tag {{tenant_name}}, für Ihr Anliegen (Ticket {{ticket_code}}) benötigen wir ein Foto des Schadens. Bitte laden Sie es hier hoch: {{upload_url}}'
                }
            ];

            const { data: inserted, error: insertError } = await supabase
                .from('communication_templates')
                .insert(defaultTemplates)
                .select('*')
                .order('slug');
                
            if (insertError) {
                console.error('❌ Failed to insert default templates:', insertError);
            } else if (inserted) {
                return NextResponse.json({ success: true, templates: inserted })
            }
        }

        return NextResponse.json({ success: true, templates: templates || [] })
    } catch (err: any) {
        console.error('❌ GET /api/communication-templates error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const orgId = await getOrgId(request)
        if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { slug, subject, content } = await request.json()

        if (!slug || content === undefined) {
            return NextResponse.json({ error: 'slug and content are required' }, { status: 400 })
        }

        const supabase = getSupabaseAdmin()
        const { data: template, error } = await supabase
            .from('communication_templates')
            .update({
                subject: subject ?? '',
                content,
                updated_at: new Date().toISOString(),
            })
            .eq('organization_id', orgId)
            .eq('slug', slug)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ success: true, template })
    } catch (err: any) {
        console.error('❌ PUT /api/communication-templates error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
