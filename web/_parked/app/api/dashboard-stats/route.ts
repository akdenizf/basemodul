import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireUserWithOrganizationFromRequest } from "@/lib/auth-guard";

/**
 * CALLFOLIO – Dashboard Stats API (v2)
 *
 * Returns:
 *  - KPI counts (open, emergency, resolvedToday, productivity)
 *  - Last 10 recent activities (slim projection + follow-up flags)
 *  - Category distribution for donut chart
 *  - 7-day activity for bar chart
 *  - AI status (last call timestamp)
 */

export const dynamic = "force-dynamic";

// Category label mapping (DB → German)
const CATEGORY_LABELS: Record<string, string> = {
    PLUMBING: "Wasser/Sanitär",
    HEATING: "Heizung",
    ELECTRICAL: "Elektro",
    BUILDING: "Gebäude",
    NOISE_COMPLAINT: "Lärm",
    ADMIN: "Sonstiges",
    COMMERCIAL: "Sonstiges",
    BILLING: "Sonstiges",
    UTILITIES: "Sonstiges",
    OTHER: "Sonstiges",
};

// Color mapping per category label
const CATEGORY_COLORS: Record<string, string> = {
    "Wasser/Sanitär": "#4F8CF7",
    "Heizung": "#F59E42",
    "Elektro": "#FBBF24",
    "Gebäude": "#8B5CF6",
    "Lärm": "#EF4444",
    "Sonstiges": "#94A3B8",
};

// German day abbreviations
const DAY_NAMES = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

export async function GET(req: NextRequest) {
    const authResult = await requireUserWithOrganizationFromRequest(req);
    if (!authResult.ok) {
        return NextResponse.json({ error: "Unauthorized" }, { status: authResult.status });
    }

    if (!authResult.organization_id) {
        return NextResponse.json({ error: "Organization not found" }, { status: 400 });
    }

    try {
        const supabase = getSupabaseAdmin();
        const orgId = authResult.organization_id;
        console.log(`[DASHBOARD-STATS] orgId=${orgId}`);

        // Date helpers
        const todayStart = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        const sevenDaysAgoIso = sevenDaysAgo.toISOString();

        // First month of the current month
        const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

        // ── Parallel queries ──
        const [
            openRes,
            emergencyRes,
            resolvedTodayRes,
            recentRes,
            categoryRes,
            weeklyRes,
            weeklyResolvedRes,
            lastCallRes,
            billingRes,
        ] = await Promise.all([
            // 1. Open tickets count
            supabase
                .from("tickets")
                .select("id", { count: "exact", head: true })
                .eq("organization_id", orgId)
                .or("is_archived.eq.false,is_archived.is.null")
                .in("status", ["NEW", "IN_PROGRESS"]),

            // 2. Emergency / High-prio count
            supabase
                .from("tickets")
                .select("id", { count: "exact", head: true })
                .eq("organization_id", orgId)
                .or("is_archived.eq.false,is_archived.is.null")
                .in("status", ["NEW", "IN_PROGRESS"])
                .or("urgency.eq.EMERGENCY,escalation_is_emergency.eq.true"),

            // 3. Resolved today count
            supabase
                .from("tickets")
                .select("id", { count: "exact", head: true })
                .eq("organization_id", orgId)
                .in("status", ["RESOLVED", "CLOSED"])
                .gte("updated_at", todayStart),

            // 4. Last 10 recent tickets (enhanced projection)
            supabase
                .from("tickets")
                .select("id, created_at, status, urgency, caller_name, issue_summary, ticket_code, category, priority:urgency, appointment_date, contractor_confirmed_at")
                .eq("organization_id", orgId)
                .or("is_archived.eq.false,is_archived.is.null")
                .order("created_at", { ascending: false })
                .limit(10),

            // 5. Category distribution (this month)
            supabase
                .from("tickets")
                .select("category")
                .eq("organization_id", orgId)
                .or("is_archived.eq.false,is_archived.is.null")
                .gte("created_at", monthStart),

            // 6. Weekly incoming tickets (last 7 days)
            supabase
                .from("tickets")
                .select("created_at")
                .eq("organization_id", orgId)
                .gte("created_at", sevenDaysAgoIso)
                .order("created_at", { ascending: true }),

            // 7. Weekly resolved tickets (last 7 days)
            supabase
                .from("tickets")
                .select("updated_at")
                .eq("organization_id", orgId)
                .in("status", ["RESOLVED", "CLOSED"])
                .gte("updated_at", sevenDaysAgoIso)
                .order("updated_at", { ascending: true }),

            // 8. Last call/ticket creation (for AI status)
            supabase
                .from("tickets")
                .select("created_at, caller_name")
                .eq("organization_id", orgId)
                .order("created_at", { ascending: false })
                .limit(1),

            // 9. Billing status from view
            supabase
                .from("organization_billing_status")
                .select("plan_tier, call_limit, current_month_calls, overage_amount_eur, billing_cycle_start")
                .eq("id", orgId)
                .maybeSingle(),
        ]);

        // ── KPI Stats ──
        console.log(`[DASHBOARD-STATS] openRes: count=${openRes.count}, error=${openRes.error?.message}`);
        console.log(`[DASHBOARD-STATS] emergencyRes: count=${emergencyRes.count}, error=${emergencyRes.error?.message}`);
        console.log(`[DASHBOARD-STATS] resolvedTodayRes: count=${resolvedTodayRes.count}, error=${resolvedTodayRes.error?.message}`);
        console.log(`[DASHBOARD-STATS] recentRes: rows=${recentRes.data?.length}, error=${recentRes.error?.message}`);
        const openCount = openRes.count ?? 0;
        const emergencyCount = emergencyRes.count ?? 0;
        const resolvedTodayCount = resolvedTodayRes.count ?? 0;
        const totalPool = openCount + resolvedTodayCount;
        const productivity = totalPool > 0
            ? Math.round((resolvedTodayCount / totalPool) * 100)
            : 0;

        // ── Category Distribution (aggregate into German labels) ──
        const categoryCounts: Record<string, number> = {};
        for (const row of categoryRes.data || []) {
            const label = CATEGORY_LABELS[row.category] || "Sonstiges";
            categoryCounts[label] = (categoryCounts[label] || 0) + 1;
        }
        const totalCategoryTickets = Object.values(categoryCounts).reduce((a, b) => a + b, 0);
        const categoryDistribution = Object.entries(categoryCounts)
            .map(([name, count]) => ({
                name,
                value: totalCategoryTickets > 0 ? Math.round((count / totalCategoryTickets) * 100) : 0,
                color: CATEGORY_COLORS[name] || "#94A3B8",
            }))
            .sort((a, b) => b.value - a.value);

        // ── 7-Day Activity (group by day) ──
        const dayMap: Record<string, { eingegangen: number; geloest: number }> = {};
        // Initialize the last 7 days
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split("T")[0]; // YYYY-MM-DD
            dayMap[key] = { eingegangen: 0, geloest: 0 };
        }
        // Count incoming
        for (const row of weeklyRes.data || []) {
            const key = new Date(row.created_at).toISOString().split("T")[0];
            if (dayMap[key]) dayMap[key].eingegangen++;
        }
        // Count resolved
        for (const row of weeklyResolvedRes.data || []) {
            const key = new Date(row.updated_at).toISOString().split("T")[0];
            if (dayMap[key]) dayMap[key].geloest++;
        }
        const activityByDay = Object.entries(dayMap).map(([dateStr, counts]) => ({
            day: DAY_NAMES[new Date(dateStr).getDay()],
            eingegangen: counts.eingegangen,
            geloest: counts.geloest,
        }));

        // ── AI Status ──
        const lastCall = lastCallRes.data?.[0];
        let aiStatusText = "Bereit für eingehende Anrufe";
        let aiStatusActive = false;
        if (lastCall) {
            const lastCallTime = new Date(lastCall.created_at);
            const minutesAgo = Math.round((Date.now() - lastCallTime.getTime()) / 60000);
            if (minutesAgo < 5) {
                aiStatusText = `Analysiere Anruf von ${lastCall.caller_name || "Unbekannt"}...`;
                aiStatusActive = true;
            } else if (minutesAgo < 30) {
                aiStatusText = `Letzter Anruf vor ${minutesAgo} Min. — Alles läuft reibungslos.`;
                aiStatusActive = false;
            }
        }

        // ── Follow-up flags for recent tickets ──
        const recentTicketIds = (recentRes.data || []).map((t: any) => t.id);
        let followUpMap: Record<string, boolean> = {};
        if (recentTicketIds.length > 0) {
            const { data: followUps } = await supabase
                .from("ticket_activities")
                .select("ticket_id")
                .in("ticket_id", recentTicketIds)
                .eq("activity_type", "follow_up_call");
            for (const fu of followUps || []) {
                followUpMap[fu.ticket_id] = true;
            }
        }

        const recentTickets = (recentRes.data || []).map((t: any) => ({
            ...t,
            has_follow_up: !!followUpMap[t.id],
        }));

        // ── Billing Status Mapping ──
        const rawBilling = billingRes.data as any;
        const billingStatus = rawBilling ? {
            plan_tier: rawBilling.plan_tier,
            call_limit: rawBilling.call_limit,
            current_month_calls: rawBilling.current_month_calls,
            current_month_duration_seconds: 0, // Fallback since it's not in the view yet
            overage_amount_eur: rawBilling.overage_amount_eur || 0,
            billing_cycle_start: rawBilling.billing_cycle_start,
        } : null;

        // ── Response ──
        const res = NextResponse.json({
            stats: {
                open: openCount,
                emergency: emergencyCount,
                resolvedToday: resolvedTodayCount,
                productivity,
            },
            recentTickets,
            categoryDistribution,
            activityByDay,
            aiStatus: {
                text: aiStatusText,
                active: aiStatusActive,
                connected: !!authResult.vapi_phone_id,
            },
            orgName: authResult.organization_name || null,
            orgLogoUrl: (authResult as any).organization_logo_url || null,
            billingStatus,
        });

        res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
        return res;
    } catch (error) {
        console.error("[DASHBOARD-STATS] Server error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
