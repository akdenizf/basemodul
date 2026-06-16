import { NextRequest, NextResponse } from "next/server";
import { requireUserWithOrganizationFromRequest } from "@/lib/auth-guard";
import { supabaseAdmin } from "@/lib/supabase";

// ============================================================
// CALLFOLIO - MANUAL TENANT MATCH API
// ============================================================

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await requireUserWithOrganizationFromRequest(req);
  if (!authResult.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: authResult.status });
  }

  const ticketId = params.id;
  if (!ticketId) {
    return NextResponse.json({ error: "Missing ticket ID" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { tenant_id } = body;

    if (!tenant_id) {
      return NextResponse.json({ error: "Missing tenant_id" }, { status: 400 });
    }

    console.log(`[tickets/${ticketId}/match] Matching to tenant: ${tenant_id}`);

    // Verify ticket belongs to user's organization
    const { data: ticket, error: fetchError } = await supabaseAdmin
      .from("tickets")
      .select("id, organization_id, caller_name, address, caller_phone")
      .eq("id", ticketId)
      .single();

    if (fetchError || !ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    if (ticket.organization_id !== authResult.organization_id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Get tenant data
    const { data: tenant, error: tenantError } = await supabaseAdmin
      .from("tenants")
      .select("*")
      .eq("id", tenant_id)
      .single();

    if (tenantError || !tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // Verify tenant belongs to same organization
    if (tenant.organization_id !== authResult.organization_id) {
      return NextResponse.json({ error: "Tenant access denied" }, { status: 403 });
    }

    // Update ticket with tenant data
    const updates = {
      matched_tenant_id: tenant.id,
      caller_name: tenant.name,
      address: tenant.address,
      unit: tenant.unit || '',
      caller_phone: tenant.phone || ticket.caller_phone,
      match_type: 'MANUAL_MATCH',
      match_confidence: 1.0,
      requires_manual_review: false,
      updated_at: new Date().toISOString()
    };

    const { error: updateError } = await supabaseAdmin
      .from("tickets")
      .update(updates)
      .eq("id", ticketId);

    if (updateError) {
      console.error("[tickets/match] Update error:", updateError);
      return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
    }

    // Log activity
    try {
      await supabaseAdmin.from("ticket_activities").insert({
        ticket_id: ticketId,
        activity_type: 'tenant_matched',
        description: `Manuell zugeordnet zu: ${tenant.name}`,
        admin_email: authResult.email,
        metadata: { 
          tenant_id: tenant.id,
          tenant_name: tenant.name,
          previous_name: ticket.caller_name,
          previous_address: ticket.address
        }
      });
    } catch (e) {
      // Non-critical
    }

    console.log(`[tickets/${ticketId}/match] Successfully matched to ${tenant.name}`);
    
    return NextResponse.json({ 
      success: true, 
      ticket: {
        ...ticket,
        ...updates,
        match_type: 'MANUAL_MATCH'
      }
    });
  } catch (error) {
    console.error("[tickets/match] Server error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
