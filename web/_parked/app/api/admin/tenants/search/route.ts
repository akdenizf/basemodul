import { NextRequest, NextResponse } from "next/server";
import { requireUserWithOrganizationFromRequest } from "@/lib/auth-guard";
import { supabaseAdmin } from "@/lib/supabase";

// ============================================================
// CALLFOLIO v5.2 - TENANT SEARCH API (CLEAN ARCHITECTURE)
// ============================================================

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authResult = await requireUserWithOrganizationFromRequest(req);
  if (!authResult.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: authResult.status });
  }

  if (!authResult.organization_id) {
    return NextResponse.json({ error: "Organization not found" }, { status: 400 });
  }

  const query = req.nextUrl.searchParams.get('q') || '';
  
  if (query.length < 2) {
    return NextResponse.json({ tenants: [] });
  }

  try {
    // Search tenants within the user's organization
    const { data, error } = await supabaseAdmin
      .from("tenants")
      .select("id, name, address, unit, phone, email")
      .eq("organization_id", authResult.organization_id)
      .or(`name.ilike.%${query}%,address.ilike.%${query}%,phone.ilike.%${query}%`)
      .limit(10);

    if (error) {
      console.error("Tenant search error:", error);
      return NextResponse.json({ error: "Search failed" }, { status: 500 });
    }

    return NextResponse.json({ tenants: data || [] });
  } catch (error) {
    console.error("Server error in tenant search:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
