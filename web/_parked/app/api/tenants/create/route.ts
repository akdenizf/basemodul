import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

// ============================================================
// CALLFOLIO - CREATE TENANT API (Server-Side)
// Uses admin client to bypass RLS and ensure correct data
// ============================================================

export const dynamic = 'force-dynamic';

const supabaseAdmin = getSupabaseAdmin()

interface CreateTenantBody {
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

export async function POST(request: NextRequest) {
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

        // 2. Get organization_id and slug from DB (server-side, bypasses RLS)
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('organization_id')
            .eq('user_id', user.id)
            .maybeSingle()

        if (profileError || !profile?.organization_id) {
            return NextResponse.json({ error: 'Keine Organisation gefunden' }, { status: 404 })
        }

        const { data: organization, error: orgError } = await supabaseAdmin
            .from('organizations')
            .select('id, slug')
            .eq('id', profile.organization_id)
            .single()

        if (orgError || !organization?.slug) {
            return NextResponse.json({ error: 'Organisation-Slug nicht gefunden' }, { status: 404 })
        }

        // 3. Parse request body
        const body: CreateTenantBody = await request.json()

        if (!body.firstName || !body.lastName || !body.phone) {
            return NextResponse.json({ error: 'Vorname, Nachname und Telefonnummer sind erforderlich' }, { status: 400 })
        }

        // 4. Transform data
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

        console.log('[create-tenant] Inserting tenant:', {
            tenant_id: organization.slug,
            organization_id: organization.id,
            name: fullName,
            address: formattedAddress,
            canonical_address: canonicalAddress,
            phone: normalizedPhone,
        })

        // 5. Insert tenant with admin client (bypasses RLS)
        //    first_name/last_name and street/house_number/zip/city are the SoT
        //    (v17 + v19); name + address stay in sync as denormalized fallbacks.
        const { data: tenant, error: insertError } = await supabaseAdmin
            .from('tenants')
            .insert({
                tenant_id: organization.slug,
                organization_id: organization.id,
                first_name: body.firstName.trim(),
                last_name: body.lastName.trim(),
                name: fullName,
                street: body.street?.trim() || null,
                house_number: body.houseNumber?.trim() || null,
                zip: body.zip?.trim() || null,
                city: body.city?.trim() || null,
                address: formattedAddress || null,
                unit: body.unit?.trim() || null,
                phone: normalizedPhone,
                email: body.email || null,
                canonical_address: canonicalAddress || null,
                notes: null,
            })
            .select()
            .single()

        if (insertError) {
            console.error('[create-tenant] Insert error:', insertError)
            return NextResponse.json({ error: `Fehler beim Anlegen: ${insertError.message}` }, { status: 500 })
        }

        console.log('[create-tenant] Tenant created successfully:', tenant.id)

        return NextResponse.json({
            success: true,
            tenant,
        })

    } catch (error: any) {
        console.error('[create-tenant] Server error:', error)
        return NextResponse.json({ error: error.message || 'Server-Fehler' }, { status: 500 })
    }
}
