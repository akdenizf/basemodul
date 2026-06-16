import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseSecretKey, getSupabaseUrl } from '@/lib/supabase/env';

// ============================================================
// CALLFOLIO — Short-URL Redirect: /t/[id]
// ============================================================
// SMS links use the compact form: callfolio.io/t/708066
// This route resolves the short ticket_code to the full upload
// portal URL. Handles two cases:
//   1. Numeric ticket_code (e.g. "708066")  → DB lookup for UUID
//   2. Full UUID fallback                   → redirect directly
//
// Both ?mode=register and ?mode=photo query params are forwarded.
// Uses 302 (not 301) so browsers never cache stale redirects.
// ============================================================

const UPLOAD_BASE_URL =
  process.env.NEXT_PUBLIC_UPLOAD_BASE_URL || 'https://www.callfolio.io';

const SUPABASE_URL = getSupabaseUrl()!;
const SUPABASE_SECRET_KEY = getSupabaseSecretKey()!;

// Simple UUID pattern
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const { id } = params;
  const searchParams = req.nextUrl.searchParams;
  const qs = searchParams.toString();

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  let ticketUUID = id;

  // If it's not already a UUID, resolve the numeric ticket_code → UUID
  if (!UUID_RE.test(id)) {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
      auth: { persistSession: false },
    });

    const { data, error } = await supabase
      .from('tickets')
      .select('id')
      .eq('ticket_code', id)
      .maybeSingle();

    if (error || !data) {
      console.error(`[/t/${id}] Ticket not found or DB error:`, error?.message);
      // Soft fallback: send to landing page rather than a broken upload page
      return NextResponse.redirect(`${UPLOAD_BASE_URL}?ref=not-found`, { status: 302 });
    }

    ticketUUID = data.id;
  }

  const destination = `${UPLOAD_BASE_URL}/upload/${ticketUUID}${qs ? `?${qs}` : ''}`;
  return NextResponse.redirect(destination, { status: 302 });
}
