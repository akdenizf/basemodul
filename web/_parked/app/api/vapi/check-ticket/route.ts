import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { phoneIlikePattern, isSearchablePhone } from "../_phone";

function mustEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

type CheckTicketRequest = {
  tenant_id?: string;
  caller_phone: string;
  ticket_code?: string;
  address?: string;
  unit?: string;
};

type CheckTicketResponse = {
  has_existing: boolean;
  verified: boolean;
  match_type: 'none' | 'phone_only' | 'code_verified' | 'address_verified';
  ticket?: {
    ticket_id: string;
    ticket_code: string;
    summary: string;
    created_at: string;
    urgency: string;
    status: string;
    tenant_match_type?: string;
    match_confidence?: number;
  };
};

export async function POST(req: Request) {
  try {
    // Auth
    const secret = req.headers.get("x-vapi-secret");
    if (!secret || secret !== mustEnv("VAPI_WEBHOOK_SECRET")) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    // Use singleton admin client
    const supabase = getSupabaseAdmin();

    const body: CheckTicketRequest = await req.json();
    const { caller_phone, ticket_code, address, unit, tenant_id } = body;

    if (!caller_phone) {
      return NextResponse.json(
        { error: "caller_phone is required" },
        { status: 400 }
      );
    }

    // Base query for open tickets from this phone number
    if (!isSearchablePhone(caller_phone)) {
      return NextResponse.json({
        has_existing: false,
        verified: false,
        match_type: 'none'
      } as CheckTicketResponse);
    }

    let query = supabase
      .from("tickets")
      .select("id, ticket_code, issue_summary, created_at, urgency, status, address, unit, tenant_match_type, match_confidence")
      .ilike("caller_phone", phoneIlikePattern(caller_phone))
      .in("status", ["NEW", "IN_PROGRESS"])
      .order("created_at", { ascending: false });

    // Add tenant filter if provided
    if (tenant_id) {
      query = query.eq("tenant_id", tenant_id);
    }

    const { data: existingTickets, error } = await query.limit(5);

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { error: "database_error" },
        { status: 500 }
      );
    }

    if (!existingTickets || existingTickets.length === 0) {
      return NextResponse.json({
        has_existing: false,
        verified: false,
        match_type: 'none'
      } as CheckTicketResponse);
    }

    // Check for verification
    let verifiedTicket = null;
    let matchType: CheckTicketResponse['match_type'] = 'phone_only';

    // Priority 1: Exact ticket code match
    if (ticket_code) {
      verifiedTicket = existingTickets.find(t => t.ticket_code === ticket_code);
      if (verifiedTicket) {
        matchType = 'code_verified';
      }
    }

    // Priority 2: Address + Unit match (fuzzy)
    if (!verifiedTicket && address && unit) {
      verifiedTicket = existingTickets.find(t =>
        t.address && t.unit &&
        t.address.toLowerCase().includes(address.toLowerCase()) &&
        t.unit.toLowerCase().includes(unit.toLowerCase())
      );
      if (verifiedTicket) {
        matchType = 'address_verified';
      }
    }

    // Use most recent ticket if no verification
    const ticketToReturn = verifiedTicket || existingTickets[0];

    return NextResponse.json({
      has_existing: true,
      verified: matchType !== 'phone_only',
      match_type: matchType,
      ticket: {
        ticket_id: ticketToReturn.id,
        ticket_code: ticketToReturn.ticket_code,
        summary: ticketToReturn.issue_summary,
        created_at: ticketToReturn.created_at,
        urgency: ticketToReturn.urgency,
        status: ticketToReturn.status,
        tenant_match_type: ticketToReturn.tenant_match_type,
        match_confidence: ticketToReturn.match_confidence
      }
    } as CheckTicketResponse);

  } catch (e: any) {
    console.error("Check ticket error:", e);
    return NextResponse.json(
      { error: e?.message ?? "unknown" },
      { status: 500 }
    );
  }
}
