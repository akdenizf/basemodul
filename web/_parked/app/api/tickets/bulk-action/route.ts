import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireUserWithOrganizationFromRequest } from "@/lib/auth-guard";

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireUserWithOrganizationFromRequest(req);
    if (!authResult.ok || !authResult.organization_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ticket_ids, action } = await req.json();

    if (!Array.isArray(ticket_ids) || ticket_ids.length === 0) {
      return NextResponse.json(
        { error: "ticket_ids required" },
        { status: 400 }
      );
    }
    if (!["archive", "unarchive", "delete", "mark_read"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    console.log(`[BULK] ${action} for ${ticket_ids.length} tickets`);

    const supabase = getSupabaseAdmin();
    let successCount = 0;
    let errorCount = 0;

    for (const ticketId of ticket_ids) {
      try {
        // Verify ticket belongs to this org
        const { data: ticket, error: fetchError } = await supabase
          .from("tickets")
          .select("id, status, is_archived, organization_id")
          .eq("id", ticketId)
          .single();

        if (fetchError || !ticket) {
          console.error(`[BULK] Ticket ${ticketId} not found`);
          errorCount++;
          continue;
        }

        if (ticket.organization_id !== authResult.organization_id) {
          console.error(`[BULK] Ticket ${ticketId} wrong org`);
          errorCount++;
          continue;
        }

        // DELETE
        if (action === "delete") {
          await supabase
            .from("ticket_activities")
            .delete()
            .eq("ticket_id", ticketId);
          const { error: delErr } = await supabase
            .from("tickets")
            .delete()
            .eq("id", ticketId);
          if (delErr) {
            console.error(
              `[BULK] Delete failed for ${ticketId}:`,
              delErr.message
            );
            errorCount++;
            continue;
          }
          console.log(`[BULK] Deleted ${ticketId}`);
          successCount++;
          continue;
        }

        // MARK_READ
        if (action === "mark_read") {
          if (ticket.status === "NEW") {
            const { error: mrErr } = await supabase
              .from("tickets")
              .update({
                status: "IN_PROGRESS",
                updated_at: new Date().toISOString(),
              })
              .eq("id", ticketId);
            if (mrErr) {
              console.error(
                `[BULK] Mark read failed for ${ticketId}:`,
                mrErr.message
              );
              errorCount++;
              continue;
            }
          }
          successCount++;
          continue;
        }

        // ARCHIVE: Only set is_archived = true. Do NOT change status.
        if (action === "archive") {
          console.log(
            `[BULK] Archiving ${ticketId}: is_archived=${ticket.is_archived} -> true`
          );

          const { data: updated, error: archiveErr } = await supabase
            .from("tickets")
            .update({
              is_archived: true,
              updated_at: new Date().toISOString(),
            })
            .eq("id", ticketId)
            .select("id, is_archived")
            .single();

          if (archiveErr) {
            console.error(
              `[BULK] Archive FAILED ${ticketId}:`,
              archiveErr.message
            );
            errorCount++;
            continue;
          }

          console.log(
            `[BULK] Archive response: is_archived=${updated?.is_archived}`
          );

          // Verify
          const { data: check } = await supabase
            .from("tickets")
            .select("id, is_archived")
            .eq("id", ticketId)
            .single();

          console.log(
            `[BULK] Archive VERIFY: is_archived=${check?.is_archived}`
          );

          if (check?.is_archived !== true) {
            console.error(
              `[BULK] CRITICAL: is_archived NOT persisted for ${ticketId}! Got ${check?.is_archived}`
            );
            errorCount++;
          } else {
            successCount++;
          }
          continue;
        }

        // UNARCHIVE: Only set is_archived = false. Do NOT change status.
        if (action === "unarchive") {
          console.log(
            `[BULK] Unarchiving ${ticketId}: is_archived=${ticket.is_archived} -> false`
          );

          const { data: updated, error: unarchiveErr } = await supabase
            .from("tickets")
            .update({
              is_archived: false,
              updated_at: new Date().toISOString(),
            })
            .eq("id", ticketId)
            .select("id, is_archived")
            .single();

          if (unarchiveErr) {
            console.error(
              `[BULK] Unarchive FAILED ${ticketId}:`,
              unarchiveErr.message
            );
            errorCount++;
            continue;
          }

          console.log(
            `[BULK] Unarchive response: is_archived=${updated?.is_archived}`
          );

          // Verify
          const { data: check } = await supabase
            .from("tickets")
            .select("id, is_archived")
            .eq("id", ticketId)
            .single();

          console.log(
            `[BULK] Unarchive VERIFY: is_archived=${check?.is_archived}`
          );

          if (check?.is_archived !== false) {
            console.error(
              `[BULK] CRITICAL: is_archived NOT persisted for ${ticketId}! Got ${check?.is_archived}`
            );
            errorCount++;
          } else {
            successCount++;
          }
          continue;
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error(`[BULK] Error ${ticketId}:`, message);
        errorCount++;
      }
    }

    console.log(`[BULK] Done: ${successCount} success, ${errorCount} errors`);

    return NextResponse.json({
      success: successCount > 0,
      action,
      affected_count: successCount,
      error_count: errorCount,
      total_requested: ticket_ids.length,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[BULK] Fatal:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
