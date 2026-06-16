import { NextRequest, NextResponse } from "next/server";
import { requireUserWithOrganizationFromRequest } from "@/lib/auth-guard";
import { supabaseAdmin } from "@/lib/supabase";
import { getSupabaseSecretKey, getSupabaseUrl } from "@/lib/supabase/env";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  // Auth check
  const authResult = await requireUserWithOrganizationFromRequest(req);
  if (!authResult.ok) {
    const sbCookies = req.cookies.getAll().filter(c => c.name.includes('sb-'));
    return NextResponse.json({
      error: 'Unauthorized',
      debug: {
        reason: authResult.error,
        cookiesReceived: req.cookies.getAll().map(c => c.name),
        sbCookies: sbCookies.map(c => c.name),
        hasBearer: !!req.headers.get('authorization'),
      }
    }, { status: authResult.status || 401 });
  }

  try {
    console.log('[API] debug-tickets for org:', authResult.organization_name);

    const { count, error: countError } = await supabaseAdmin
      .from("tickets")
      .select("*", { count: 'exact', head: true })
      .eq("organization_id", authResult.organization_id!);

    if (countError) {
      console.error('[API] debug-tickets count error:', countError);
      return NextResponse.json({ error: 'Count failed', details: countError.message }, { status: 500 });
    }

    const { data, error } = await supabaseAdmin
      .from("tickets")
      .select("id, created_at, status, caller_name, issue_summary")
      .eq("organization_id", authResult.organization_id!)
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      console.error('[API] debug-tickets select error:', error);
      return NextResponse.json({ error: 'Select failed', details: error.message }, { status: 500 });
    }

    return NextResponse.json({
      totalCount: count,
      sampleTickets: data,
      organization: authResult.organization_name,
      supabaseUrl: getSupabaseUrl() ? 'SET' : 'MISSING',
      supabaseSecretKey: getSupabaseSecretKey() ? 'SET' : 'MISSING'
    });

  } catch (error: any) {
    console.error('[API] debug-tickets error:', error);
    return NextResponse.json({ error: 'Unexpected error', details: error.message }, { status: 500 });
  }
}
