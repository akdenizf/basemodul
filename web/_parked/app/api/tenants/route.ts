import { NextRequest, NextResponse } from "next/server";
import { requireUserWithOrganizationFromRequest } from "@/lib/auth-guard";
import { supabaseAdmin } from "@/lib/supabase";

// ============================================================
// CALLFOLIO - TENANTS API (with pagination + server-side search)
// ============================================================

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 50;

export async function GET(req: NextRequest) {
  const authResult = await requireUserWithOrganizationFromRequest(req);
  if (!authResult.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: authResult.status });
  }

  if (!authResult.organization_id) {
    return NextResponse.json({ error: "Organization not found" }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);

  // Pagination params
  const offset = Math.max(0, parseInt(searchParams.get("offset") || "0", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || String(PAGE_SIZE), 10)));
  const searchQuery = searchParams.get("search") || null;

  try {
    const orgId = authResult.organization_id;

    // Build query with count
    let query = supabaseAdmin
      .from("tenants")
      .select("*", { count: "exact" })
      .eq("organization_id", orgId);

    // Server-side search
    if (searchQuery && searchQuery.trim().length > 0) {
      const term = `%${searchQuery.trim()}%`;
      query = query.or(`name.ilike.${term},address.ilike.${term},email.ilike.${term}`);
    }

    // Order + paginate
    query = query
      .order("name", { ascending: true })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error("[tenants] Error fetching tenants:", error);
      return NextResponse.json({ error: "Failed to fetch tenants", details: error.message }, { status: 500 });
    }

    const totalCount = count ?? 0;
    const hasMore = offset + limit < totalCount;

    return NextResponse.json({
      tenants: data || [],
      totalCount,
      hasMore,
    });
  } catch (error) {
    console.error("[tenants] Server error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
