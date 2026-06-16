import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireUserWithOrganizationFromRequest } from "@/lib/auth-guard";

// ============================================================
// CALLFOLIO v5.4 - Ticket Attachments API Route
// ============================================================
// Returns all photo attachments for a specific ticket.
// ============================================================

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const ticketId = params.id;

  // Authenticate
  const authResult = await requireUserWithOrganizationFromRequest(req);
  if (!authResult.ok) {
    return NextResponse.json(
      { error: authResult.error },
      { status: 401 }
    );
  }

  console.log(`[Storage] Fetching attachments for ticket ${ticketId}`);

  try {
    const supabase = getSupabaseAdmin();

    const { data: attachments, error } = await supabase
      .from("ticket_attachments")
      .select("id, file_url, storage_path, created_at")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(`[Storage] Query error: ${error.message}`);
      return NextResponse.json(
        { error: "Fehler beim Laden der Anhänge" },
        { status: 500 }
      );
    }

    console.log(`[Storage] Found ${attachments?.length || 0} attachments`);

    return NextResponse.json({
      attachments: attachments || [],
    });
  } catch (error: any) {
    console.error(`[Storage] Exception: ${error.message}`);
    return NextResponse.json(
      { error: "Ein unerwarteter Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
}
