import { NextRequest, NextResponse } from "next/server";
import { requireUserWithOrganizationFromRequest } from "@/lib/auth-guard";
import { supabaseAdmin } from "@/lib/supabase";
import { STATUS_LABELS } from "@/lib/audit-log";

// ============================================================
// CALLFOLIO - TICKET STATUS UPDATE API
// ============================================================

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await requireUserWithOrganizationFromRequest(req);
  if (!authResult.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: authResult.status });
  }

  const ticketId = params.id;
  if (!ticketId) {
    return NextResponse.json({ error: "Missing ticket ID" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { status } = body;

    if (!status || !['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    console.log(`[tickets/${ticketId}/status] Updating status to: ${status}`);

    // Verify ticket belongs to user's organization
    const { data: ticket, error: fetchError } = await supabaseAdmin
      .from("tickets")
      .select("id, organization_id, status")
      .eq("id", ticketId)
      .single();

    if (fetchError || !ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    if (ticket.organization_id !== authResult.organization_id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Update status
    const { error: updateError } = await supabaseAdmin
      .from("tickets")
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq("id", ticketId);

    if (updateError) {
      console.error("[tickets/status] Update error:", updateError);
      return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
    }

    // Log activity
    try {
      await supabaseAdmin.from("ticket_activities").insert({
        ticket_id: ticketId,
        activity_type: 'status_changed',
        description: `Status auf „${STATUS_LABELS[status] ?? status}" gesetzt`,
        admin_email: authResult.email,
        metadata: { old_status: ticket.status, new_status: status }
      });
    } catch (e) {
      // Non-critical
    }

    console.log(`[tickets/${ticketId}/status] Status updated successfully`);
    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error("[tickets/status] Server error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
