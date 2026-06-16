import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

/**
 * Organization Settings API (signature + basic config)
 * GET   → fetch settings for the user's org
 * PATCH → upsert settings
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
        const { data: settings, error } = await supabase
            .from('organization_settings')
            .select('*')
            .eq('organization_id', orgId)
            .maybeSingle()

        if (error) throw error

        return NextResponse.json({
            success: true,
            settings: settings || {
                organization_id: orgId,
                sender_signature: 'Mit freundlichen Grüßen\nIhre Hausverwaltung',
            },
        })
    } catch (err: any) {
        console.error('❌ GET /api/settings/org-extra error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const orgId = await getOrgId(request)
        if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { sender_signature } = await request.json()

        const supabase = getSupabaseAdmin()
        const { data: settings, error } = await supabase
            .from('organization_settings')
            .upsert({
                organization_id: orgId,
                sender_signature: sender_signature ?? 'Mit freundlichen Grüßen\nIhre Hausverwaltung',
                updated_at: new Date().toISOString(),
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ success: true, settings })
    } catch (err: any) {
        console.error('❌ PATCH /api/settings/org-extra error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
