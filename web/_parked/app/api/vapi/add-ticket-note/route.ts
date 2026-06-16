import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { ACTIVE_STATUSES, deTimestamp } from "../_constants";

export async function POST(req: Request) {
  try {
    const secret = req.headers.get("x-vapi-secret");

    if (!secret || secret !== process.env.VAPI_WEBHOOK_SECRET) {
      console.error(
        `[Note-Auth] 401 — secret ${secret ? "present but WRONG" : "not sent"}. ` +
        `Expected VAPI_WEBHOOK_SECRET (${process.env.VAPI_WEBHOOK_SECRET ? "set" : "NOT SET in env"}).`
      );
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { ticket_id, note, caller_phone, caller_name, verified_address } = body;

    if (!ticket_id || !note?.trim()) {
      return NextResponse.json(
        { error: "ticket_id and note are required" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: ticket, error: fetchError } = await supabase
      .from("tickets")
      .select("id, ticket_code, status, issue_details")
      .eq("id", ticket_id)
      .in("status", ACTIVE_STATUSES)
      .maybeSingle();

    if (fetchError || !ticket) {
      console.warn(`[add-ticket-note] Ticket ${ticket_id} not found or not active`);
      return NextResponse.json({ error: "ticket_not_found" }, { status: 404 });
    }

    // Store the tenant's exact words — no paraphrasing
    const exactNote = note.trim();
    const timestamp = deTimestamp();
    const appendedDetails = ticket.issue_details
      ? `${ticket.issue_details}\n\n--- Folgeanruf (${timestamp}) ---\n${exactNote}`
      : `--- Folgeanruf (${timestamp}) ---\n${exactNote}`;

    const ticketUpdate: Record<string, string> = {
      issue_details: appendedDetails,
      updated_at: new Date().toISOString(),
    };

    const cleanName = caller_name?.trim();
    const cleanAddress = verified_address?.trim();
    if (cleanName) ticketUpdate.caller_name = cleanName;
    if (cleanAddress) ticketUpdate.address = cleanAddress;

    if (cleanName || cleanAddress) {
      console.log(`[Identity-Update] Syncing Name: ${cleanName ?? "(none)"} and Address: ${cleanAddress ?? "(none)"} to Ticket: ${ticket_id}`);
    }

    const [activityResult, ticketUpdateResult] = await Promise.all([
      supabase.from("ticket_activities").insert({
        ticket_id: ticket_id,
        activity_type: "follow_up_call",
        description: exactNote,
        metadata: { caller_phone: caller_phone || null, source: "vapi_ai" },
      }),
      supabase
        .from("tickets")
        .update(ticketUpdate)
        .eq("id", ticket_id),
    ]);

    if (activityResult.error) throw new Error(`Activity insert failed: ${activityResult.error.message}`);
    if (ticketUpdateResult.error) throw new Error(`Ticket update failed: ${ticketUpdateResult.error.message}`);

    console.log(`[add-ticket-note] Note added to ticket ${ticket.ticket_code}: "${exactNote.slice(0, 60)}"`);

    return NextResponse.json({
      success: true,
      ticket_code: ticket.ticket_code,
      message: `Notiz zu Ticket ${ticket.ticket_code} hinzugefügt`,
    });
  } catch (e: any) {
    console.error("[add-ticket-note] Error:", e);
    return NextResponse.json({ error: e?.message ?? "unknown" }, { status: 500 });
  }
}
