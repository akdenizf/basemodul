import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireUserWithOrganizationFromRequest } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const authResult = await requireUserWithOrganizationFromRequest(req);
    if (!authResult.ok) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: authResult.status || 401 });
    }

    const supabase = getSupabaseAdmin();

    // Get the actual enum values from PostgreSQL
    const { data: enumValues, error: enumError } = await supabase.rpc('get_enum_values', {}).maybeSingle();

    // Alternative: query pg_enum directly
    const { data: pgEnum, error: pgError } = await supabase
        .from("tickets")
        .select("status")
        .limit(50);

    // Get ALL tickets
    const { data: allTickets } = await supabase
        .from("tickets")
        .select("id, status, urgency, is_archived, organization_id, ticket_code")
        .order("created_at", { ascending: false })
        .limit(10);

    // Test each status value individually
    const statusTests: Record<string, any> = {};
    for (const testStatus of ["NEW", "ASSIGNED", "DONE", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "new", "open", "assigned", "in_progress", "done", "resolved", "closed"]) {
        try {
            const { count, error } = await supabase
                .from("tickets")
                .select("id", { count: "exact", head: true })
                .eq("status", testStatus);
            statusTests[testStatus] = { count, error: error?.message };
        } catch (e: any) {
            statusTests[testStatus] = { error: e.message };
        }
    }

    return NextResponse.json({
        allTickets: allTickets?.map(t => ({
            id: t.id?.slice(0, 8),
            status: t.status,
            urgency: t.urgency,
            is_archived: t.is_archived,
            org_id: t.organization_id?.slice(0, 8),
            code: t.ticket_code,
        })),
        statusTests,
        distinctStatuses: Array.from(new Set((pgEnum || []).map(r => r.status))),
        errors: { enum: enumError?.message, pg: pgError?.message },
    });
}
