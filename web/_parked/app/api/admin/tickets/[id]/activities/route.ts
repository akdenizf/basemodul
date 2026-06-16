import { NextRequest, NextResponse } from "next/server";
import { requireUserWithOrganizationFromRequest } from "@/lib/auth-guard";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await requireUserWithOrganizationFromRequest(req);
  if (!authResult.ok) {
    const sbCookies = req.cookies.getAll().filter(c => c.name.includes('sb-'));
    console.warn('[API] activities 401:', {
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

  const ticketId = params.id;
  if (!ticketId) {
    return NextResponse.json({ error: "Missing ticketId" }, { status: 400 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("ticket_activities")
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[API] Error fetching activities:", error);
      return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
    }

    return NextResponse.json({ activities: data || [] });
  } catch (error) {
    console.error("[API] Server error in activities:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
