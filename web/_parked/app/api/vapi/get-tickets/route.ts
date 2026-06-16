import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { normalizePhoneNumber, phoneIlikePattern, isSearchablePhone } from "../_phone";
import { ACTIVE_STATUSES } from "../_constants";

export const dynamic = "force-dynamic";

// Module-level client — reused across warm invocations (avoids re-init overhead)
const supabase = getSupabaseAdmin();

const TICKET_SELECT = "id, issue_summary, status, category, address, unit" as const;

/** Strip unsubstituted Vapi template placeholders (e.g. "{{address}}"). */
const cleanArg = (v: string | undefined): string =>
  v && !v.startsWith("{{") ? v : "";

type RawTicket = {
  id: string;
  issue_summary: string;
  status: string;
  category: string;
  address: string | null;
  unit: string | null;
};

export async function POST(req: Request) {
  try {
    const secret = req.headers.get("x-vapi-secret");
    if (!secret || secret !== process.env.VAPI_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Verified E.164 from Vapi call object (Priority 1); AI arg fallback (Priority 2)
    const rawPhone =
      body.message?.call?.customer?.number ??
      body.call?.customer?.number ??
      (body.phone_number as string | undefined) ??
      null;

    const normalized = normalizePhoneNumber(rawPhone);
    const phoneSearchable = isSearchablePhone(rawPhone);
    const address: string = cleanArg(body.address);
    const unit: string = cleanArg(body.unit);

    console.log(`[get-tickets] phone="${rawPhone ?? "—"}" searchable=${phoneSearchable}`);

    let rawTickets: RawTicket[] = [];
    let matchSource = "none";
    const t0 = Date.now();

    // ─── PRIMARY: phone lookup — return immediately if results found ──────────
    if (phoneSearchable) {
      const pattern = phoneIlikePattern(normalized || rawPhone || "");
      console.log(`[get-tickets] Phone query: ilike="${pattern}"`);

      const { data: byPhone, error: phoneError } = await supabase
        .from("tickets")
        .select(TICKET_SELECT)
        .ilike("caller_phone", pattern)
        .in("status", ACTIVE_STATUSES)
        .order("created_at", { ascending: false })
        .limit(5);

      if (phoneError) {
        console.error(`[get-tickets] DB error (phone): ${phoneError.message} | code=${phoneError.code} | hint=${phoneError.hint}`);
        return NextResponse.json({ error: true, tickets: [], message: "Datenbankfehler" });
      } else {
        rawTickets = (byPhone as unknown as RawTicket[]) ?? [];
        if (rawTickets.length > 0) matchSource = "phone";
        console.log(`[get-tickets] Phone → ${rawTickets.length} ticket(s)`);
      }
    }

    // ─── SECONDARY: address fallback (only when phone found nothing) ─────────
    if (rawTickets.length === 0 && address.trim().length >= 5) {
      const safeAddr = address.trim().slice(0, 40).replace(/[%_]/g, "\\$&");
      const addrPattern = `%${safeAddr}%`;
      console.log(`[get-tickets] Address fallback: ilike="${addrPattern}"`);

      const { data: byAddress, error: addrError } = await supabase
        .from("tickets")
        .select(TICKET_SELECT)
        .ilike("address", addrPattern)
        .in("status", ACTIVE_STATUSES)
        .order("created_at", { ascending: false })
        .limit(5);

      if (addrError) {
        console.error("[get-tickets] DB error (address):", addrError.message);
      } else if (byAddress && byAddress.length > 0) {
        const byAddr = byAddress as unknown as RawTicket[];
        if (unit.trim()) {
          const unitStr = unit.trim().toLowerCase();
          const unitMatched = byAddr.filter((t) => t.unit?.toLowerCase().includes(unitStr));
          rawTickets = unitMatched.length > 0 ? unitMatched : byAddr;
        } else {
          rawTickets = byAddr;
        }
        matchSource = "address";
        console.log(`[get-tickets] Address fallback → ${rawTickets.length} ticket(s)`);
      }
    }

    const elapsed = Date.now() - t0;
    console.log(`[Speed-Check] Lookup took: ${elapsed}ms`);

    const result = rawTickets.map((t) => ({
      id: t.id,
      status: t.status,
      category: t.category,
      summary: t.issue_summary,
    }));

    console.log(`[get-tickets]`, { phone: rawPhone ?? null, matchSource, ticketsFound: result.length });

    return NextResponse.json({ tickets: result });
  } catch (e: any) {
    console.error("[get-tickets] Unhandled error:", e?.message ?? e);
    return NextResponse.json({ tickets: [] });
  }
}
