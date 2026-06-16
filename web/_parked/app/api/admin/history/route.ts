import { NextRequest, NextResponse } from "next/server";
import { requireUserWithOrganizationFromRequest } from "@/lib/auth-guard";
import { getAllActivities } from "@/lib/audit-log";

// ============================================================
// CALLFOLIO v5.5 – GLOBAL HISTORY API
// ============================================================
// GET /api/admin/history?type=…&search=…&limit=100
// Returns the most recent ticket_activities across all tickets
// for the authenticated user's organisation.
// ============================================================

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const authResult = await requireUserWithOrganizationFromRequest(req);
    if (!authResult.ok) {
        const sbCookies = req.cookies.getAll().filter(c => c.name.includes('sb-'));
        console.warn('[API] admin/history 401:', {
            reason: authResult.error,
            sbCookies: sbCookies.map(c => c.name),
            hasBearer: !!req.headers.get('authorization'),
        });
        return NextResponse.json({
            error: 'Unauthorized',
            debug: {
                reason: authResult.error,
                cookiesReceived: req.cookies.getAll().map(c => c.name),
                sbCookies: sbCookies.map(c => c.name),
            }
        }, { status: authResult.status || 401 });
    }

    if (!authResult.organization_id) {
        return NextResponse.json({ error: "Organization not found" }, { status: 400 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type') || undefined;
        const search = searchParams.get('search') || undefined;
        const limit = parseInt(searchParams.get('limit') || '100', 10);

        console.log(`[API] admin/history: Fetching for org=${authResult.organization_name} type=${type || 'all'} search=${search || 'none'}`);

        const activities = await getAllActivities(authResult.organization_id, {
            type,
            search,
            limit: Math.min(limit, 500),
        });

        return NextResponse.json({ activities });
    } catch (error) {
        console.error("[API] admin/history server error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
