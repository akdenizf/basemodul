import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

/**
 * Contractors (Handwerker) CRUD API
 * GET    → list all contractors for the user's org
 * POST   → create a new contractor
 * PUT    → update an existing contractor
 * DELETE → delete a contractor by id query param
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
        const { data: contractors, error } = await supabase
            .from('contractors')
            .select('*')
            .eq('organization_id', orgId)
            .order('name', { ascending: true })

        if (error) throw error

        return NextResponse.json({ success: true, contractors: contractors || [] })
    } catch (err: any) {
        console.error('❌ GET /api/contractors error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const orgId = await getOrgId(request)
        if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { name, email, phone, trade } = await request.json()

        if (!name || !email || !trade) {
            return NextResponse.json({ error: 'name, email, and trade are required' }, { status: 400 })
        }

        const supabase = getSupabaseAdmin()
        const { data: contractor, error } = await supabase
            .from('contractors')
            .insert({
                organization_id: orgId,
                name,
                email,
                phone: phone || '',
                trade,
                updated_at: new Date().toISOString(),
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ success: true, contractor })
    } catch (err: any) {
        console.error('❌ POST /api/contractors error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const orgId = await getOrgId(request)
        if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { id, name, email, phone, trade } = await request.json()

        if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

        const supabase = getSupabaseAdmin()
        const { data: contractor, error } = await supabase
            .from('contractors')
            .update({
                name,
                email,
                phone: phone || '',
                trade,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .eq('organization_id', orgId) // ensure ownership
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ success: true, contractor })
    } catch (err: any) {
        console.error('❌ PUT /api/contractors error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const orgId = await getOrgId(request)
        if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        if (!id) return NextResponse.json({ error: 'id query param is required' }, { status: 400 })

        const supabase = getSupabaseAdmin()
        const { error } = await supabase
            .from('contractors')
            .delete()
            .eq('id', id)
            .eq('organization_id', orgId) // ensure ownership

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (err: any) {
        console.error('❌ DELETE /api/contractors error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
