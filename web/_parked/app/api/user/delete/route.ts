import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { requireUserWithOrganizationFromRequest } from '@/lib/auth-guard'

// ============================================================
// CALLFOLIO v11.0 — ACCOUNT DELETION (Danger Zone)
// ============================================================
// Cascading delete in strict order to avoid FK violations.
// Most child tables have ON DELETE CASCADE, but we delete
// explicitly so failures surface row-by-row in the logs.
// NEVER uses TRUNCATE CASCADE.
// ============================================================

const supabase = getSupabaseAdmin()

export async function POST(request: NextRequest) {
  const auth = await requireUserWithOrganizationFromRequest(request)

  if (!auth.ok || !auth.user_id || !auth.organization_id) {
    return NextResponse.json(
      { error: auth.error || 'Nicht autorisiert' },
      { status: auth.status || 401 }
    )
  }

  const userId = auth.user_id
  const orgId = auth.organization_id
  const orgName = auth.organization_name || '(unbenannt)'

  console.log(`[Account-Delete] 🗑️  Starting deletion: user=${userId}, org=${orgId} (${orgName})`)

  try {
    // ---------- 1. Collect ticket IDs (needed for activities/attachments) ----------
    const { data: tickets, error: ticketLookupErr } = await supabase
      .from('tickets')
      .select('id')
      .eq('organization_id', orgId)

    if (ticketLookupErr) throw new Error(`ticket-lookup: ${ticketLookupErr.message}`)
    const ticketIds = (tickets || []).map(t => t.id)
    console.log(`[Account-Delete] Found ${ticketIds.length} tickets to delete`)

    // ---------- 2. Delete ticket_activities (cascades, but explicit) ----------
    if (ticketIds.length > 0) {
      const { error: actErr } = await supabase
        .from('ticket_activities')
        .delete()
        .in('ticket_id', ticketIds)
      if (actErr) console.warn(`[Account-Delete] ticket_activities: ${actErr.message}`)
    }

    // ---------- 3. Delete ticket_attachments (cascades, but explicit) ----------
    if (ticketIds.length > 0) {
      const { error: attErr } = await supabase
        .from('ticket_attachments')
        .delete()
        .in('ticket_id', ticketIds)
      if (attErr) console.warn(`[Account-Delete] ticket_attachments: ${attErr.message}`)
    }

    // ---------- 4. Delete tickets ----------
    const { error: ticketErr } = await supabase
      .from('tickets')
      .delete()
      .eq('organization_id', orgId)
    if (ticketErr) throw new Error(`tickets: ${ticketErr.message}`)
    console.log(`[Account-Delete] ✅ Tickets deleted`)

    // ---------- 5. Delete tenants ----------
    const { error: tenantErr } = await supabase
      .from('tenants')
      .delete()
      .eq('organization_id', orgId)
    if (tenantErr) throw new Error(`tenants: ${tenantErr.message}`)
    console.log(`[Account-Delete] ✅ Tenants deleted`)

    // ---------- 6. Delete contractors ----------
    const { error: contErr } = await supabase
      .from('contractors')
      .delete()
      .eq('organization_id', orgId)
    if (contErr) console.warn(`[Account-Delete] contractors: ${contErr.message}`)

    // ---------- 7. Delete communication_templates ----------
    const { error: tmplErr } = await supabase
      .from('communication_templates')
      .delete()
      .eq('organization_id', orgId)
    if (tmplErr) console.warn(`[Account-Delete] communication_templates: ${tmplErr.message}`)

    // ---------- 8. Delete organization_settings ----------
    const { error: settErr } = await supabase
      .from('organization_settings')
      .delete()
      .eq('organization_id', orgId)
    if (settErr) console.warn(`[Account-Delete] organization_settings: ${settErr.message}`)

    // ---------- 9. Sever Vapi link (clear vapi_phone_id before org delete) ----------
    // No dedicated `assistants` table — Vapi pairing is `organizations.vapi_phone_id`.
    // Clearing it explicitly logs the unlink for audit purposes.
    const { error: vapiErr } = await supabase
      .from('organizations')
      .update({ vapi_phone_id: null, is_active: false })
      .eq('id', orgId)
    if (vapiErr) console.warn(`[Account-Delete] vapi-unlink: ${vapiErr.message}`)
    else console.log(`[Account-Delete] ✅ Vapi phone unlinked`)

    // ---------- 10. Delete organization ----------
    // profiles.organization_id cascades automatically (ON DELETE CASCADE)
    const { error: orgErr } = await supabase
      .from('organizations')
      .delete()
      .eq('id', orgId)
    if (orgErr) throw new Error(`organizations: ${orgErr.message}`)
    console.log(`[Account-Delete] ✅ Organization ${orgId} deleted`)

    // ---------- 11. Delete auth.user (cascades profiles) ----------
    const { error: authErr } = await supabase.auth.admin.deleteUser(userId)
    if (authErr) throw new Error(`auth.deleteUser: ${authErr.message}`)
    console.log(`[Account-Delete] ✅ Auth user ${userId} deleted`)

    console.log(`[Account-Delete] 🎉 Account fully deleted: user=${userId}, org=${orgId}`)

    return NextResponse.json({
      success: true,
      message: 'Konto und alle zugehörigen Daten wurden vollständig gelöscht.'
    })
  } catch (err: any) {
    console.error(`[Account-Delete] ❌ Failed: ${err.message}`, err)
    return NextResponse.json(
      { error: err.message || 'Löschen fehlgeschlagen' },
      { status: 500 }
    )
  }
}
