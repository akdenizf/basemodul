import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireUserWithOrganizationFromRequest } from "@/lib/auth-guard";

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireUserWithOrganizationFromRequest(req);
    if (!authResult.ok || !authResult.organization_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ticket_id, new_status } = await req.json();

    if (!ticket_id || !new_status) {
      return NextResponse.json({ error: "ticket_id and new_status required" }, { status: 400 });
    }

    if (!["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"].includes(new_status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    console.log(`[FORCE-STATUS] Setting ${ticket_id} to ${new_status}`);

    const supabase = getSupabaseAdmin();

    // Step 1: Verify ticket belongs to org
    const { data: ticket, error: fetchError } = await supabase
      .from("tickets")
      .select("id, status, organization_id")
      .eq("id", ticket_id)
      .single();

    if (fetchError || !ticket) {
      console.error(`[FORCE-STATUS] Ticket not found:`, fetchError?.message);
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    if (ticket.organization_id !== authResult.organization_id) {
      return NextResponse.json({ error: "Wrong organization" }, { status: 403 });
    }

    console.log(`[FORCE-STATUS] Current status: ${ticket.status}`);

    // Step 2: Update with fresh client
    const { data: updated, error: updateError } = await supabase
      .from("tickets")
      .update({
        status: new_status,
        updated_at: new Date().toISOString()
      })
      .eq("id", ticket_id)
      .select("id, status")
      .single();

    if (updateError) {
      console.error(`[FORCE-STATUS] Update error:`, updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    console.log(`[FORCE-STATUS] Update returned: ${JSON.stringify(updated)}`);

    // Step 3: Verify
    const { data: verified } = await supabase
      .from("tickets")
      .select("id, status")
      .eq("id", ticket_id)
      .single();

    console.log(`[FORCE-STATUS] Verified: ${JSON.stringify(verified)}`);

    return NextResponse.json({
      success: true,
      before: ticket.status,
      after: updated?.status,
      verified: verified?.status,
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[FORCE-STATUS] Fatal:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
