import { NextResponse } from "next/server";
import { ACTIVE_STATUSES, deTimestamp } from "../_constants";
import type { ToolCtx } from "./_types";

/**
 * Handles the `add_ticket_note` tool — appends a follow-up note to an existing
 * open ticket and logs the activity. Only operates on NEW/IN_PROGRESS tickets;
 * closed tickets return a "not found" message so the AI can take a different path.
 *
 * The ticket's issue_details is append-only — the original summary is never overwritten.
 */
export async function handleAddTicketNote(ctx: ToolCtx): Promise<NextResponse> {
  const { args, message, body, supabase, toolCallId } = ctx;

  try {
    const ticketId: string = args.ticket_id || '';
    const note: string = (args.note || '').trim();
    const callerPhone: string =
      message.call?.customer?.number || body.call?.customer?.number || args.caller_phone || '';

    console.log(`[add_ticket_note] ticket_id="${ticketId}" phone="${callerPhone}" note="${note.slice(0, 80)}"`);

    if (!ticketId || !note) {
      console.warn('[add_ticket_note] Missing ticket_id or note');
      return NextResponse.json({
        results: [{ toolCallId: toolCallId, result: { success: false, message: "Fehler: ticket_id und note sind erforderlich." } }]
      });
    }

    const { data: ticket, error: fetchError } = await supabase
      .from('tickets')
      .select('id, ticket_code, status, issue_details')
      .eq('id', ticketId)
      .in('status', ACTIVE_STATUSES)
      .maybeSingle();

    if (fetchError || !ticket) {
      console.warn(`[add_ticket_note] Ticket ${ticketId} not found or not active. error=${fetchError?.message}`);
      return NextResponse.json({
        results: [{ toolCallId: toolCallId, result: { success: false, message: "Ticket nicht gefunden oder bereits geschlossen." } }]
      });
    }

    const timestamp = deTimestamp();
    const appendedDetails = ticket.issue_details
      ? `${ticket.issue_details}\n\n--- Folgeanruf (${timestamp}) ---\n${note}`
      : `--- Folgeanruf (${timestamp}) ---\n${note}`;

    const [activityRes, updateRes] = await Promise.all([
      supabase.from('ticket_activities').insert({
        ticket_id: ticketId,
        activity_type: 'follow_up_call',
        description: 'Mieter hat erneut angerufen — Notiz gespeichert',
        metadata: {
          caller_phone: callerPhone || null,
          source: 'vapi_webhook',
          note_content: note,
        },
      }),
      supabase
        .from('tickets')
        .update({ issue_details: appendedDetails, updated_at: new Date().toISOString() })
        .eq('id', ticketId),
    ]);
    if (activityRes.error) throw new Error(`Activity log error: ${activityRes.error.message}`);
    if (updateRes.error) throw new Error(`Ticket update error: ${updateRes.error.message}`);

    console.log(`[add_ticket_note] ✅ Note saved to ${ticket.ticket_code}: "${note.slice(0, 60)}"`);

    return NextResponse.json({
      results: [{
        toolCallId: toolCallId,
        result: { success: true, message: `Notiz zu Ticket ${ticket.ticket_code} gespeichert.` }
      }]
    });

  } catch (noteError: any) {
    console.error(`[add_ticket_note] Error: ${noteError.message}`);
    return NextResponse.json({
      results: [{ toolCallId: toolCallId, result: { success: false, message: "Fehler beim Speichern der Notiz. Bitte manuell notieren." } }]
    });
  }
}
