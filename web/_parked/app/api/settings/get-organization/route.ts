import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

// ============================================================
// CALLFOLIO v5.2 - GET ORGANIZATION (CLEAN ARCHITECTURE)
// ============================================================

export const dynamic = 'force-dynamic';

const supabaseAdmin = getSupabaseAdmin()

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Sitzung ungültig' }, { status: 401 })
    }

    // Get user's profile with organization
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('organization_id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (profileError || !profile?.organization_id) {
      return NextResponse.json({ error: 'Keine Organisation gefunden' }, { status: 404 })
    }

    // Get organization details
    const { data: organization, error: orgError } = await supabaseAdmin
      .from('organizations')
      .select('id, name, slug, vapi_phone_id, notification_email, is_active, subscription_tier, logo_url')
      .eq('id', profile.organization_id)
      .single()

    if (orgError || !organization) {
      return NextResponse.json({ error: 'Organisation nicht gefunden' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      organization
    })

  } catch (error: any) {
    console.error('❌ API Error:', error)
    return NextResponse.json({ error: error.message || 'Server-Fehler' }, { status: 500 })
  }
}
