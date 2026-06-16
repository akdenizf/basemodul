import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

// ============================================================
// CALLFOLIO v5.2 - CREATE ORGANIZATION (CLEAN ARCHITECTURE)
// ============================================================
// Erstellt eine ORGANISATION in der organizations-Tabelle
// NICHT in tenants! Tenants sind Mieter, nicht Kunden!
// ============================================================

const supabaseAdmin = getSupabaseAdmin()

export async function POST(request: Request) {
  try {
    // Auth prüfen
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Sitzung ungültig. Bitte erneut einloggen.' }, { status: 401 })
    }

    // Prüfen ob User bereits eine Organisation hat
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('organization_id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (existingProfile?.organization_id) {
      return NextResponse.json({ error: 'Du hast bereits eine Organisation' }, { status: 400 })
    }

    // Request Body
    const { name, vapi_phone_id, notification_email } = await request.json()

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name ist erforderlich' }, { status: 400 })
    }

    // Slug generieren (URL-freundlich)
    const baseSlug = name
      .toLowerCase()
      .replace(/[äÄ]/g, 'ae')
      .replace(/[öÖ]/g, 'oe')
      .replace(/[üÜ]/g, 'ue')
      .replace(/[ß]/g, 'ss')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 40)
    
    const uniqueSuffix = Math.floor(Math.random() * 10000)
    const slug = `${baseSlug}-${uniqueSuffix}`

    console.log(`🏢 Creating organization: ${name} (${slug})`)

    // Organisation in organizations-Tabelle erstellen (NICHT tenants!)
    const { data: organization, error: orgError } = await supabaseAdmin
      .from('organizations')
      .insert({
        name: name.trim(),
        slug: slug,
        vapi_phone_id: vapi_phone_id?.trim() || null,
        notification_email: notification_email?.trim() || user.email || null,
        is_active: true,
        subscription_tier: 'free'
      })
      .select()
      .single()

    if (orgError) {
      console.error('❌ Org creation error:', orgError)
      return NextResponse.json({ error: 'Fehler beim Erstellen der Organisation' }, { status: 500 })
    }

    console.log(`✅ Organization created: ${organization.id}`)

    // User mit Organisation verknüpfen
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ organization_id: organization.id })
      .eq('user_id', user.id)

    if (profileError) {
      console.error('❌ Profile link error:', profileError)
      // Rollback: Organisation löschen
      await supabaseAdmin.from('organizations').delete().eq('id', organization.id)
      return NextResponse.json({ error: 'Fehler beim Verknüpfen' }, { status: 500 })
    }

    console.log(`✅ Profile linked to organization`)

    return NextResponse.json({
      success: true,
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        vapi_phone_id: organization.vapi_phone_id,
        notification_email: organization.notification_email
      }
    })

  } catch (error: any) {
    console.error('❌ API Error:', error)
    return NextResponse.json({ error: error.message || 'Server-Fehler' }, { status: 500 })
  }
}
