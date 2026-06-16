import { NextRequest, NextResponse } from "next/server";
import { requireUserWithOrganizationFromRequest } from "@/lib/auth-guard";
import { supabaseAdmin } from "@/lib/supabase";
import type { Ticket, MatchType } from "@/lib/types";

// ============================================================
// CALLFOLIO v5.2 - ADMIN TICKETS API (CLEAN ARCHITECTURE)
// ============================================================

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authResult = await requireUserWithOrganizationFromRequest(req);
  if (!authResult.ok) {
    const sbCookies = req.cookies.getAll().filter(c => c.name.includes('sb-'));
    console.warn('[API] admin/tickets 401:', {
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

  // v5.2: Use organization_id (UUID) for queries
  if (!authResult.organization_id) {
    return NextResponse.json({ error: "Organization not found" }, { status: 400 });
  }

  try {
    console.log(`[API] admin/tickets: Fetching for org=${authResult.organization_name} (${authResult.organization_id})`);
    
    // Query tickets by organization_id (UUID) - this is the primary filter
    const { data, error } = await supabaseAdmin
      .from("tickets")
      .select("*")
      .eq("organization_id", authResult.organization_id)
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error("[API] admin/tickets DB error:", error.message);
      return NextResponse.json({ error: "Failed to fetch tickets", details: error.message }, { status: 500 });
    }

    // Map data to Ticket interface
    const tickets: Ticket[] = (data || []).map((t) => {
      let uiMatchType: MatchType = 'UNKNOWN';
      const dbMatchType = t.tenant_match_type || t.match_type;
      
      // Determine UI match type from DB match type
      const isPhoneExact = dbMatchType === 'PHONE_EXACT';
      const isFuzzyHigh = dbMatchType === 'FUZZY_HIGH';
      const isMatch = dbMatchType === 'MATCH';
      const isManualMatch = dbMatchType === 'MANUAL_MATCH';
      
      if (isPhoneExact || isFuzzyHigh || isMatch) {
        uiMatchType = 'MATCH';
      } else if (isManualMatch) {
        uiMatchType = 'MANUAL_MATCH';
      } else if (dbMatchType === 'FUZZY_LOW' || dbMatchType === 'REVIEW') {
        uiMatchType = 'REVIEW';
      }
      
      // PHONE_EXACT always = 100% confidence (even if DB has 0 or null)
      const confidence = isPhoneExact ? 1.0 : (t.match_confidence || 0.0);

      return {
        id: t.id,
        created_at: t.created_at,
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
        requires_manual_review: t.requires_manual_review || (uiMatchType !== 'MATCH' && uiMatchType !== 'MANUAL_MATCH'),
        matched_tenant_id: t.matched_tenant_id || null,
        ticket_code: t.ticket_code || null,
      };
    });

    console.log(`[API] admin/tickets: Returning ${tickets.length} tickets`);
    return NextResponse.json({ 
      tickets,
      organization: {
        id: authResult.organization_id,
        name: authResult.organization_name,
        slug: authResult.organization_slug
      }
    });
  } catch (error) {
    console.error("[API] admin/tickets server error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
