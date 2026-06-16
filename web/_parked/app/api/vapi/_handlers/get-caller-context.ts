import { NextResponse } from "next/server";
import { getLast10, phoneIlikePattern, isSearchablePhone } from "../_phone";
import { ACTIVE_STATUSES } from "../_constants";
import type { ToolCtx } from "./_types";

/**
 * Handles the `get_caller_context` tool and its legacy alias `get_active_tickets`.
 *
 * Master lookup that the AI calls before any diagnosis:
 *  - Tenant lookup (phone OR phone_secondary, exact last-10 match)
 *  - Active tickets for this phone (status-filtered)
 *  - Eternal memory: newest non-Unbekannt ticket for name/address fallback
 *
 * Always succeeds. On error returns `{ isKnown: false, activeTickets: [] }`
 * (or `{ tickets: [] }` for the legacy alias) so the AI keeps the call alive.
 */
export async function handleGetCallerContext(ctx: ToolCtx): Promise<NextResponse> {
  const { message, body, supabase, toolCallId, functionName } = ctx;

  try {
    const realPhone = message.call?.customer?.number || body.call?.customer?.number || '';
    const vapiPhoneId = message.call?.phoneNumberId || body.call?.phoneNumberId;
    const t0 = Date.now();

    // 1. Org lookup — needed to scope tenant query to the right organisation
    let organizationId: string | null = null;
    let orgName = 'Ihre Hausverwaltung';

    if (vapiPhoneId) {
      const { data: org } = await supabase
        .from('organizations')
        .select('id, name')
        .eq('vapi_phone_id', vapiPhoneId)
        .eq('is_active', true)
        .maybeSingle();
      if (org) {
        organizationId = org.id;
        if (org.name?.trim()) orgName = org.name;
      }
    }

    // 2. Parallel: tenant lookup + active ticket lookup
    const phoneSearchable = isSearchablePhone(realPhone);
    const pattern = phoneIlikePattern(realPhone);

    const [tenantRes, ticketsRes, memoryRes] = await Promise.all([
      // Step A: Tenant lookup — check phone AND phone_secondary
      phoneSearchable && organizationId
        ? supabase
            .from('tenants')
            .select('name, address, unit, phone, phone_secondary')
            .eq('organization_id', organizationId)
        : Promise.resolve({ data: null, error: null }),

      // Active tickets for AI display (status-filtered, no name/address needed here)
      phoneSearchable
        ? supabase
            .from('tickets')
            .select('id, ticket_code, issue_summary, status, category, contractors(name)')
            .ilike('caller_phone', pattern)
            .in('status', ACTIVE_STATUSES)
            .order('created_at', { ascending: false })
            .limit(5)
        : Promise.resolve({ data: [], error: null }),

      // Step B: Eternal memory — newest ticket ever, status-blind (name+address only)
      // Excludes Unbekannt placeholders so we don't resurrect empty identity data.
      phoneSearchable
        ? supabase
            .from('tickets')
            .select('caller_name, address, unit')
            .ilike('caller_phone', pattern)
            .not('caller_name', 'ilike', '%Unbekannt%')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()
        : Promise.resolve({ data: null, error: null }),
    ]);

    // Step A: exact last-10 match on phone OR phone_secondary
    let tenant: { name: string; address: string; unit: string } | null = null;
    let contextSource: 'tenant' | 'ticket' | null = null;
    if (tenantRes.data) {
      const callerLast10 = getLast10(realPhone);
      const match = (tenantRes.data as any[]).find((t: any) =>
        getLast10(t.phone) === callerLast10 ||
        (t.phone_secondary && getLast10(t.phone_secondary) === callerLast10)
      );
      if (match) {
        tenant = { name: match.name, address: match.address, unit: match.unit };
        contextSource = 'tenant';
      }
    }

    // Step B: Eternal memory — statusblind fallback from newest non-Unbekannt ticket
    // Guard: reject phone-shaped caller_names so the AI doesn't greet by phone number
    const isPhoneLike = (v: string) => /^[+\d\s\-()]{7,}$/.test(v.trim());
    const ticketData = (ticketsRes.data as any[]) ?? [];
    if (!tenant) {
      const memory = (memoryRes as any).data;
      const memName = memory?.caller_name?.trim();
      const validName = memName && !isPhoneLike(memName) ? memName : '';
      if (validName || memory?.address?.trim()) {
        tenant = {
          name: validName,
          address: memory.address || '',
          unit: memory.unit || '',
        };
        contextSource = 'ticket';
      }
    }

    // Map active tickets for AI context display
    const activeTickets = ticketData.map((t: any) => ({
      id: t.id,
      ticketCode: t.ticket_code,
      status: t.status,
      category: t.category,
      summary: t.issue_summary,
      contractorName: (t.contractors as any)?.name ?? null,
    }));

    const elapsed = Date.now() - t0;
    console.log(`[get_caller_context] phone=${realPhone} isKnown=${!!tenant} contextSource=${contextSource} tickets=${activeTickets.length} elapsed=${elapsed}ms`);

    // ── Footprint: log inbound call on every active ticket found ──
    // Fire-and-forget — never blocks the AI response.
    // Creates a 'follow_up_call' activity so the Dashboard Timeline shows the call immediately.
    if (activeTickets.length > 0 && isSearchablePhone(realPhone)) {
      void (async () => {
        try {
          const inserts = activeTickets.map((t) => ({
            ticket_id: t.id,
            activity_type: 'follow_up_call' as const,
            description: 'Mieter hat erneut angerufen (Status-Abfrage via KI)',
            metadata: {
              caller_phone: realPhone,
              source: 'vapi_get_caller_context',
            },
          }));
          const { error } = await supabase.from('ticket_activities').insert(inserts);
          if (error) console.warn('[get_caller_context] footprint insert failed:', error.message);
          else console.log(`[get_caller_context] footprint logged for ${inserts.length} ticket(s)`);
        } catch (e: any) {
          console.warn('[get_caller_context] footprint insert exception:', e.message);
        }
      })();
    }


    // ── Format depends on which function was called ──────────────────
    // get_active_tickets: legacy format { tickets: [...] } for v14.4 compatibility
    // get_caller_context: rich format { isKnown, tenantName, address, activeTickets, orgName }
    if (functionName === 'get_active_tickets') {
      return NextResponse.json({
        results: [{
          toolCallId: toolCallId,
          result: {
            tickets: activeTickets.map(t => ({
              id: t.id,
              status: t.status,
              category: t.category,
              summary: t.summary,
              contractor_name: t.contractorName,
            }))
          }
        }]
      });
    }

    return NextResponse.json({
      results: [{
        toolCallId: toolCallId,
        result: {
          isKnown: !!tenant,
          contextSource,
          tenantName: tenant?.name || null,
          address: tenant
            ? { street: tenant.address || null, unit: tenant.unit || null }
            : null,
          activeTickets,
          orgName,
        }
      }]
    });

  } catch (err: any) {
    // Recovery: never block — return format-appropriate empty result
    console.error('[get_caller_context] failed, returning empty context:', err.message);
    if (functionName === 'get_active_tickets') {
      return NextResponse.json({
        results: [{ toolCallId: toolCallId, result: { tickets: [] } }]
      });
    }
    return NextResponse.json({
      results: [{
        toolCallId: toolCallId,
        result: {
          isKnown: false,
          tenantName: null,
          address: null,
          activeTickets: [],
          orgName: 'Ihre Hausverwaltung',
        }
      }]
    });
  }
}
