import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

// ============================================================
// CALLFOLIO - UPDATE TENANT API (Server-Side)
// Uses admin client to bypass RLS and ensure correct data
// ============================================================

export const dynamic = 'force-dynamic';

const supabaseAdmin = getSupabaseAdmin()

interface UpdateTenantBody {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    street?: string;
    houseNumber?: string;
    zip?: string;
    city?: string;
    unit?: string;
}

export async function PUT(request: NextRequest) {
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

        // 3. Parse request body
        const body: UpdateTenantBody = await request.json()

        if (!body.id || !body.firstName || !body.lastName || !body.phone) {
            return NextResponse.json({ error: 'ID, Vorname, Nachname und Telefonnummer sind erforderlich' }, { status: 400 })
        }

        // 4. Verify tenant belongs to user's organization
        const { data: existingTenant, error: tenantError } = await supabaseAdmin
            .from('tenants')
            .select('organization_id')
            .eq('id', body.id)
            .single()

        if (tenantError || !existingTenant) {
            return NextResponse.json({ error: 'Mieter nicht gefunden' }, { status: 404 })
        }

        if (existingTenant.organization_id !== profile.organization_id) {
            return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })
        }

        // 5. Transform data (same logic as create)
        const fullName = `${body.firstName} ${body.lastName}`.trim()

        // Address format: "PLZ Stadt, Straße Nr"
        const zipCity = (body.zip && body.city) ? `${body.zip} ${body.city}` : ''
        const streetNumber = (body.street && body.houseNumber)
            ? `${body.street} ${body.houseNumber}`
            : (body.street || '')

        const formattedAddress = [zipCity, streetNumber]
            .filter(part => part.trim().length > 0)
            .join(', ')

        // Canonical address: lowercase version for duplicate detection
        const canonicalBase = formattedAddress.toLowerCase()
        const canonicalUnit = body.unit?.toLowerCase() || ''
        const canonicalAddress = canonicalUnit
            ? `${canonicalBase}|${canonicalUnit}`
            : canonicalBase

        // Normalize phone
        const normalizedPhone = body.phone.replace(/[\s\-\(\)]/g, '')

        console.log('[update-tenant] Updating tenant:', {
            id: body.id,
            name: fullName,
            address: formattedAddress,
            canonical_address: canonicalAddress,
        })

        // 6. Update tenant with admin client.
        //    Discrete address columns (v19) are the SoT; `address` is rebuilt
        //    from them as a denormalized fallback.
        const { data: tenant, error: updateError } = await supabaseAdmin
            .from('tenants')
            .update({
                first_name: body.firstName.trim(),
                last_name: body.lastName.trim(),
                name: fullName,
                street: body.street?.trim() || null,
                house_number: body.houseNumber?.trim() || null,
                zip: body.zip?.trim() || null,
                city: body.city?.trim() || null,
                address: formattedAddress || null,
                unit: body.unit || null,
                phone: normalizedPhone,
                email: body.email || null,
                canonical_address: canonicalAddress || null,
                updated_at: new Date().toISOString(),
            })
            .eq('id', body.id)
            .select()
            .single()

        if (updateError) {
            console.error('[update-tenant] Update error:', updateError)
            return NextResponse.json({ error: `Fehler beim Aktualisieren: ${updateError.message}` }, { status: 500 })
        }

        console.log('[update-tenant] Tenant updated successfully:', tenant.id)

        return NextResponse.json({
            success: true,
            tenant,
        })

    } catch (error: any) {
        console.error('[update-tenant] Server error:', error)
        return NextResponse.json({ error: error.message || 'Server-Fehler' }, { status: 500 })
    }
}
