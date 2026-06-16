import { NextRequest, NextResponse } from "next/server";
import { requireUserWithOrganizationFromRequest } from "@/lib/auth-guard";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { logActivity } from "@/lib/audit-log";

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/tickets/[id]/contractor
 * Sets or removes a contractor assignment on a ticket.
 * Body: { contractor_id: string | null }
 */
export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const authResult = await requireUserWithOrganizationFromRequest(req);
    if (!authResult.ok) {
        return NextResponse.json({ error: "Unauthorized" }, { status: authResult.status || 401 });
    }

    const ticketId = params.id;
    const { contractor_id } = await req.json();
    const adminEmail = authResult.email || "system@callfolio.io";

    try {
        const supabase = getSupabaseAdmin();

        // If assigning, verify the contractor exists and belongs to the same org
        let contractorName = null;
        if (contractor_id) {
            const { data: contractor, error: cErr } = await supabase
                .from("contractors")
                .select("id, name, organization_id")
                .eq("id", contractor_id)
                .single();

            if (cErr || !contractor) {
                return NextResponse.json({ error: "Dienstleister nicht gefunden" }, { status: 404 });
            }

            if (contractor.organization_id !== authResult.organization_id) {
                return NextResponse.json({ error: "Zugriff verweigert" }, { status: 403 });
            }

            contractorName = contractor.name;
        }

        // Update ticket
        const { error: updateError } = await supabase
            .from("tickets")
            .update({
                contractor_id: contractor_id || null,
                updated_at: new Date().toISOString(),
            })
            .eq("id", ticketId);

        if (updateError) {
            console.error("[API] contractor assignment error:", updateError);
            return NextResponse.json({ error: "Fehler beim Speichern" }, { status: 500 });
        }

        // Log activity
        await logActivity({
            ticket_id: ticketId,
            admin_email: adminEmail,
            activity_type: contractor_id ? "assigned" : "updated",
            description: contractor_id
                ? `🔧 Dienstleister zugewiesen: ${contractorName}`
                : "🔧 Dienstleister-Zuweisung entfernt",
            new_value: contractor_id ? { contractor_id, contractor_name: contractorName } : null,
            metadata: { action: "contractor_assignment" },
        });

        return NextResponse.json({ success: true, contractor_name: contractorName });
    } catch (error) {
        console.error("[API] contractor assignment server error:", error);
        return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
    }
}
