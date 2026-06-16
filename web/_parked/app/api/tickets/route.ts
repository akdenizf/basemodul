import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireUserWithOrganizationFromRequest } from "@/lib/auth-guard";
import type { Ticket, MatchType } from "@/lib/types";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

export async function GET(req: NextRequest) {
  const authResult = await requireUserWithOrganizationFromRequest(req);
  if (!authResult.ok) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: authResult.status }
    );
  }

  if (!authResult.organization_id) {
    return NextResponse.json(
      { error: "Organization not found" },
      { status: 400 }
    );
  }

  const { searchParams } = new URL(req.url);
  const showArchived = searchParams.get("archived") === "true";

  // Pagination params
  const offset = Math.max(0, parseInt(searchParams.get("offset") || "0", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || String(PAGE_SIZE), 10)));

  // Server-side filters
  const statusFilter = searchParams.get("status") || null;   // e.g. "NEW"
  const urgencyFilter = searchParams.get("urgency") || null;  // e.g. "HIGH"
  const searchQuery = searchParams.get("search") || null;

  try {
    const supabase = getSupabaseAdmin();
    const orgId = authResult.organization_id;

    // Build query
    let query = supabase
      .from("tickets")
      .select("*", { count: "exact" })
      .eq("organization_id", orgId)
      .or(showArchived ? "is_archived.eq.true" : "is_archived.eq.false,is_archived.is.null");

    // Apply server-side filters
    if (statusFilter && statusFilter !== "ALL") {
      if (statusFilter === "OPEN") {
        // "Offen" = only NEW tickets (Beauftragt shows IN_PROGRESS)
        query = query.eq("status", "NEW");
      } else {
        query = query.eq("status", statusFilter);
      }
    }
    if (urgencyFilter && urgencyFilter !== "ALL") {
      query = query.eq("urgency", urgencyFilter);
    }
    if (searchQuery && searchQuery.trim().length > 0) {
      const term = `%${searchQuery.trim()}%`;
      query = query.or(
        `caller_name.ilike.${term},address.ilike.${term},issue_summary.ilike.${term},ticket_code.ilike.${term}`
      );
    }

    // Order + paginate
    query = query
      .order("updated_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Parallel: get status counts for sidebar (always unfiltered by status/urgency)
    const [mainResult, statusCountResult, urgencyCountResult] = await Promise.all([
      query,
      supabase
        .from("tickets")
        .select("status")
        .eq("organization_id", orgId)
        .or("is_archived.eq.false,is_archived.is.null"),
      supabase
        .from("tickets")
        .select("urgency")
        .eq("organization_id", orgId)
        .or("is_archived.eq.false,is_archived.is.null"),
    ]);

    const { data, error, count } = mainResult;

    if (error) {
      console.error("[TICKETS] DB error:", error.message);
      return NextResponse.json(
        { error: "Failed to fetch tickets", details: error.message },
        { status: 500 }
      );
    }

    const totalCount = count ?? 0;
    const hasMore = offset + limit < totalCount;

    // Fetch follow_up counts for the tickets
    const ticketIds = (data || []).map(t => t.id);
    let followUpCounts: Record<string, number> = {};
    let attachmentCounts: Record<string, number> = {};

    if (ticketIds.length > 0) {
      const [followUpResult, attachmentResult] = await Promise.all([
        supabase
          .from('ticket_activities')
          .select('ticket_id')
          .in('ticket_id', ticketIds)
          .eq('activity_type', 'follow_up_call'),
        supabase
          .from('ticket_attachments')
          .select('ticket_id')
          .in('ticket_id', ticketIds)
      ]);

      if (!followUpResult.error && followUpResult.data) {
        followUpCounts = followUpResult.data.reduce((acc: Record<string, number>, curr: any) => {
          acc[curr.ticket_id] = (acc[curr.ticket_id] || 0) + 1;
          return acc;
        }, {});
      }

      if (!attachmentResult.error && attachmentResult.data) {
        attachmentCounts = attachmentResult.data.reduce((acc: Record<string, number>, curr: any) => {
          acc[curr.ticket_id] = (acc[curr.ticket_id] || 0) + 1;
          return acc;
        }, {});
      }
    }

    const tickets: Ticket[] = (data || []).map((t) => {
      let uiMatchType: MatchType = "UNKNOWN";
      const dbMatchType = t.tenant_match_type || t.match_type;

      const isPhoneExact = dbMatchType === "PHONE_EXACT";
      const isFuzzyHigh = dbMatchType === "FUZZY_HIGH";
      const isMatch = dbMatchType === "MATCH";
      const isManualMatch = dbMatchType === "MANUAL_MATCH";

      if (isPhoneExact || isFuzzyHigh || isMatch) {
        uiMatchType = "MATCH";
      } else if (isManualMatch) {
        uiMatchType = "MANUAL_MATCH";
      } else if (dbMatchType === "FUZZY_LOW" || dbMatchType === "REVIEW") {
        uiMatchType = "REVIEW";
      }

      const confidence = isPhoneExact ? 1.0 : (t.match_confidence || 0.0);

      return {
        id: t.id,
        created_at: t.created_at,
        updated_at: t.updated_at,
        status: t.status || "NEW",
        urgency: t.urgency || "LOW",
        category: t.category || "OTHER",
        sentiment: t.sentiment || "CALM",
        tenant_id: t.tenant_id || "",
        call_id: t.call_id || t.id,
        ticket_id: t.ticket_id || t.id,
        caller_name: t.caller_name || "Unbekannt",
        caller_phone: t.caller_phone || null,
        address: t.address || null,
        unit: t.unit || null,
        issue_summary: t.issue_summary || "Kein Titel",
        issue_details: t.issue_details || null,
        escalation_is_emergency: t.escalation_is_emergency || false,
        escalation_reason: t.escalation_reason || null,
        vapi_cost: t.vapi_cost || null,
        ticket_json: t.ticket_json || null,
        raw_caller_name: t.raw_caller_name || null,
        raw_caller_address: t.raw_caller_address || null,
        match_type: uiMatchType,
        match_confidence: confidence,
        requires_manual_review:
          t.requires_manual_review || (uiMatchType !== "MATCH" && uiMatchType !== "MANUAL_MATCH"),
        matched_tenant_id: t.matched_tenant_id || null,
        ticket_code: t.ticket_code || null,
        is_archived: t.is_archived === true,
        contractor_id: t.contractor_id || null,
        follow_up_count: followUpCounts[t.id] || 0,
        attachment_count: attachmentCounts[t.id] || 0,
      };
    });

    // Build status & urgency counts for sidebar
    const statusCounts: Record<string, number> = {};
    const urgencyCounts: Record<string, number> = {};
    let allCount = 0;

    for (const row of statusCountResult.data || []) {
      statusCounts[row.status] = (statusCounts[row.status] || 0) + 1;
      allCount++;
    }
    statusCounts['ALL'] = allCount;

    for (const row of urgencyCountResult.data || []) {
      urgencyCounts[row.urgency] = (urgencyCounts[row.urgency] || 0) + 1;
    }
    urgencyCounts['ALL'] = allCount;

    const res = NextResponse.json({
      tickets,
      totalCount,
      hasMore,
      statusCounts,
      urgencyCounts,
      organization: {
        id: authResult.organization_id,
        name: authResult.organization_name,
        slug: authResult.organization_slug,
      },
    });
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return res;
  } catch (error) {
    console.error("[TICKETS] Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
