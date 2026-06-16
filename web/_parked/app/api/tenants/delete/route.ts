import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

// ============================================================
// CALLFOLIO - DELETE TENANT API (Server-Side)
// Uses admin client to bypass RLS and ensure correct permissions
// ============================================================

export const dynamic = 'force-dynamic';

const supabaseAdmin = getSupabaseAdmin()

export async function DELETE(request: NextRequest) {
    try {
        // 1. Authenticate user
        const authHeader = request.headers.get('Authorization')
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })
        }

        const token = authHeader.replace('Bearer ', '')
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

        if (authError || !user) {
            return NextResponse.json({ error: 'Sitzung ungültig' }, { status: 401 })
        }

        // 2. Get organization_id from DB
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('organization_id')
            .eq('user_id', user.id)
            .maybeSingle()

        if (profileError || !profile?.organization_id) {
            return NextResponse.json({ error: 'Keine Organisation gefunden' }, { status: 404 })
        }

        // 3. Get tenant ID from query params
        const { searchParams } = new URL(request.url)
        const tenantId = searchParams.get('id')

        if (!tenantId) {
            return NextResponse.json({ error: 'Mieter-ID fehlt' }, { status: 400 })
        }

        // 4. Verify tenant belongs to user's organization
        const { data: existingTenant, error: tenantError } = await supabaseAdmin
            .from('tenants')
            .select('organization_id, name')
            .eq('id', tenantId)
            .single()

        if (tenantError || !existingTenant) {
            return NextResponse.json({ error: 'Mieter nicht gefunden' }, { status: 404 })
        }

        if (existingTenant.organization_id !== profile.organization_id) {
            return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })
        }

        console.log('[delete-tenant] Deleting tenant:', {
            id: tenantId,
            name: existingTenant.name,
        })

        // 5. Delete tenant with admin client
        const { error: deleteError } = await supabaseAdmin
            .from('tenants')
            .delete()
            .eq('id', tenantId)

        if (deleteError) {
            console.error('[delete-tenant] Delete error:', deleteError)
            return NextResponse.json({ error: `Fehler beim Löschen: ${deleteError.message}` }, { status: 500 })
        }

        console.log('[delete-tenant] Tenant deleted successfully:', tenantId)

        return NextResponse.json({
            success: true,
            message: 'Mieter erfolgreich gelöscht',
        })

    } catch (error: any) {
        console.error('[delete-tenant] Server error:', error)
        return NextResponse.json({ error: error.message || 'Server-Fehler' }, { status: 500 })
    }
}
