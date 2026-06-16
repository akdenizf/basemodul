import { NextRequest, NextResponse } from "next/server";
import { requireUserWithOrganizationFromRequest } from "@/lib/auth-guard";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const supabaseAdmin = getSupabaseAdmin();

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Standardized auth check
  const authResult = await requireUserWithOrganizationFromRequest(req);
  if (!authResult.ok) {
    const sbCookies = req.cookies.getAll().filter(c => c.name.includes('sb-'));
    console.warn('[API] assign 401:', {
      reason: authResult.error,
      sbCookies: sbCookies.map(c => c.name),
      hasBearer: !!req.headers.get('authorization'),
    });
    return NextResponse.json({
      error: 'Unauthorized',
      debug: { reason: authResult.error }
    }, { status: authResult.status || 401 });
  }

  const ticketId = params.id;
  const body = await req.json();
  const { tenant_id, action } = body;
  const adminEmail = authResult.email || 'unknown';

  try {
    // Action: "dismiss" - Keep as guest, clear review flag
    if (action === 'dismiss') {
      const { error: updateError } = await supabaseAdmin
        .from("tickets")
        .update({
          match_type: 'UNKNOWN',
          requires_manual_review: false,
          final_caller_name: 'Gast'
        })
        .eq("id", ticketId);

      if (updateError) {
        console.error("[API] Dismiss error:", updateError);
        return NextResponse.json({ error: "Fehler beim Aktualisieren" }, { status: 500 });
      }

      await supabaseAdmin.from("ticket_activities").insert({
        ticket_id: ticketId,
        activity_type: 'assigned',
        admin_email: adminEmail,
        description: 'Anrufer als Gast behalten',
        metadata: { method: 'dismiss' }
      });

      return NextResponse.json({ success: true });
    }

    // Action: "confirm" or "manual" - Assign to a tenant
    if (!tenant_id) {
      return NextResponse.json({ error: "tenant_id fehlt" }, { status: 400 });
    }

    const { data: tenant, error: tenantError } = await supabaseAdmin
      .from("tenants")
      .select("*")
      .eq("id", tenant_id)
      .single();

    if (tenantError || !tenant) {
      return NextResponse.json({ error: "Mieter nicht gefunden" }, { status: 404 });
    }

    const { error: updateError } = await supabaseAdmin
      .from("tickets")
      .update({
        matched_tenant_id: tenant.id,
        final_caller_name: tenant.name,
        caller_name: tenant.name,
        address: tenant.address,
        unit: tenant.unit,
        match_type: 'MANUAL_MATCH',
        match_confidence: 1.0,
        requires_manual_review: false
      })
      .eq("id", ticketId);

    if (updateError) {
      console.error("[API] Assignment error:", updateError);
      return NextResponse.json({ error: "Fehler beim Zuordnen" }, { status: 500 });
    }

    await supabaseAdmin.from("ticket_activities").insert({
      ticket_id: ticketId,
      activity_type: 'assigned',
      admin_email: adminEmail,
      description: `Mieter manuell zugeordnet: ${tenant.name}`,
      new_value: { tenant_id: tenant.id, name: tenant.name },
      metadata: { method: action || 'manual_dashboard' }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] Server error in ticket assignment:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
