import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

// ============================================================
// CALLFOLIO v5.2 - UPDATE ORGANIZATION (CLEAN ARCHITECTURE)
// ============================================================

const supabaseAdmin = getSupabaseAdmin()

export async function PUT(request: Request) {
  try {
    // Auth prüfen
    const authHeader = request.headers.get('Authorization')

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Sitzung ungültig' }, { status: 401 })
    }

    // User's Organisation holen
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('organization_id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!profile?.organization_id) {
      return NextResponse.json({ error: 'Keine Organisation gefunden' }, { status: 400 })
    }

    const { name, vapi_phone_id, notification_email, logo_url } = await request.json()

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name ist erforderlich' }, { status: 400 })
    }

    // Organisation in organizations-Tabelle updaten (NICHT tenants!)
    const { data: organization, error: updateError } = await supabaseAdmin
      .from('organizations')
      .update({
        name: name.trim(),
        vapi_phone_id: vapi_phone_id?.trim() || null,
        notification_email: notification_email?.trim() || null,
        logo_url: logo_url || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', profile.organization_id)
      .select()
      .single()

    if (updateError) {
      console.error('❌ Update error:', updateError)
      return NextResponse.json({ error: 'Fehler beim Speichern' }, { status: 500 })
    }

    console.log(`✅ Organization updated: ${organization.slug}`)

    return NextResponse.json({
      success: true,
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        vapi_phone_id: organization.vapi_phone_id,
        notification_email: organization.notification_email,
        logo_url: organization.logo_url,
      }
    })

  } catch (error: any) {
    console.error('❌ API Error:', error)
    return NextResponse.json({ error: error.message || 'Server-Fehler' }, { status: 500 })
  }
}
