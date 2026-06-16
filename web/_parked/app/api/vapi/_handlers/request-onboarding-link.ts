import { NextResponse } from "next/server";
import { sendPhotoRequestSMS, isTwilioConfigured } from "@/lib/twilio";
import { getLast10, phoneIlikePattern, isSearchablePhone } from "../_phone";
import type { ToolCtx } from "./_types";

/**
 * Handles the `request_onboarding_link` tool — sends an SMS to the caller with
 * either a photo-upload link (known tenant) or a registration link (unknown).
 *
 * Protections:
 *  - Rate limit: max 3 onboarding_link_sent events per phone per hour.
 *  - Duplicate guard: if submit_ticket's auto-SMS already fired in the last
 *    5 minutes, returns success without sending — prevents double SMS.
 *  - Ticket reuse: an existing 'INTERN: Registrierung' ticket created within
 *    the last 10 minutes for the same phone is reused instead of creating a new one.
 *
 * Mode decision is robust: 'photo' only when the caller has both a verified
 * non-placeholder name AND a verified address. Otherwise 'register'.
 */
export async function handleRequestOnboardingLink(ctx: ToolCtx): Promise<NextResponse> {
  const { message, body, supabase, toolCallId } = ctx;

  try {
    const realPhone = message.call?.customer?.number || body.call?.customer?.number || '';
    const vapiPhoneId = message.call?.phoneNumberId || body.call?.phoneNumberId;
    const callId = message.call?.id || body.call?.id || `link_${Date.now()}`;

    console.log(`[request_onboarding_link] phone=${realPhone}`);

    if (!realPhone || !isTwilioConfigured()) {
      return NextResponse.json({
        results: [{ toolCallId: toolCallId, result: { success: false, message: 'SMS-Versand nicht möglich.' } }]
      });
    }

    // ── Rate limit: max 3 onboarding_link_sent events per phone per hour ───
    // Uses a dedicated event type so photo-upload spam doesn't block
    // legitimate registration resend requests (and vice versa).
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count: recentCount } = await supabase
      .from('ticket_activities')
      .select('id', { count: 'exact', head: true })
      .eq('activity_type', 'onboarding_link_sent')
      .filter('metadata->>phone', 'eq', realPhone)
      .gte('created_at', oneHourAgo);

    if ((recentCount ?? 0) >= 3) {
      console.warn(`[request_onboarding_link] Rate limit hit for ${realPhone} (${recentCount}/3 this hour)`);
      return NextResponse.json({
        results: [{ toolCallId: toolCallId, result: {
          success: false,
          message: 'Ich kann Ihnen gerade keinen weiteren Link senden, da wir bereits mehrere Anfragen von dieser Nummer erhalten haben. Bitte versuchen Sie es in etwa einer Stunde noch einmal.'
        }}]
      });
    }

    // ── Duplicate-Guard: wenn submit_ticket's Auto-SMS in den letzten 5 Minuten ─
    // bereits eine SMS an diese Nummer geschickt hat, idempotent skippen.
    // Verhindert dass die KI nach submit_ticket nochmal request_onboarding_link aufruft
    // und der Mieter zwei SMS bekommt.
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: recentSms } = await supabase
      .from('ticket_activities')
      .select('id, created_at, activity_type')
      .in('activity_type', ['photo_requested', 'onboarding_link_sent'])
      .filter('metadata->>phone', 'eq', realPhone)
      .gte('created_at', fiveMinutesAgo)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (recentSms) {
      console.log(`[request_onboarding_link] Recent SMS (${recentSms.activity_type} @ ${recentSms.created_at}) — skipping duplicate send`);
      return NextResponse.json({
        results: [{ toolCallId: toolCallId, result: {
          success: true,
          message: 'Der Link wurde dem Mieter bereits per SMS gesendet.'
        }}]
      });
    }

    // ── Org lookup ────────────────────────────────────────────────────────
    let organizationId: string | null = null;
    let organizationSlug: string | null = null;
    let organizationName = 'Ihrer Hausverwaltung';
    if (vapiPhoneId) {
      const { data: org } = await supabase
        .from('organizations')
        .select('id, name, slug')
        .eq('vapi_phone_id', vapiPhoneId)
        .eq('is_active', true)
        .maybeSingle();
      if (org) {
        organizationId = org.id;
        organizationSlug = org.slug;
        if (org.name?.trim()) organizationName = org.name;
      }
    }

    // ── Caller context: tenant lookup + ticket history (parallel) ─────────
    let isKnown = false;
    let tenantName: string | null = null;
    let callerAddress: string | null = null;
    if (isSearchablePhone(realPhone) && organizationId) {
      const pattern = phoneIlikePattern(realPhone);
      const callerLast10 = getLast10(realPhone);

      const [tenantRes, historyRes] = await Promise.all([
        supabase
          .from('tenants')
          .select('name, address, phone, phone_secondary')
          .eq('organization_id', organizationId)
          .not('phone', 'is', null),
        supabase
          .from('tickets')
          .select('caller_name, address')
          .ilike('caller_phone', pattern)
          .not('caller_name', 'ilike', '%Unbekannt%')
          .not('issue_summary', 'eq', 'INTERN: Registrierung')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

      // Priority A: registered tenant
      const tenantMatch = (tenantRes.data as any[])?.find((t: any) =>
        getLast10(t.phone) === callerLast10 ||
        (t.phone_secondary && getLast10(t.phone_secondary) === callerLast10)
      );
      if (tenantMatch) {
        isKnown = true;
        tenantName = tenantMatch.name;
        callerAddress = tenantMatch.address || null;
      }

      // Priority B: ticket history (known name + address)
      if (!isKnown) {
        const hist = (historyRes as any).data;
        if (hist?.caller_name?.trim() && hist?.address?.trim()) {
          isKnown = true;
          tenantName = hist.caller_name;
          callerAddress = hist.address;
        }
      }
    }

    // Robust mode decision: photo ONLY when name and address are genuinely verified.
    // isKnown=true via ticket history can still carry placeholder values —
    // those callers still need the registration flow.
    const PLACEHOLDER_NAMES = ['Unbekannt', 'Unbekannt (SMS angefordert)', 'Unbekannter Mieter'];
    const hasVerifiedName =
      !!tenantName &&
      tenantName.trim().length >= 3 &&
      !PLACEHOLDER_NAMES.some(p => tenantName!.toLowerCase().includes(p.toLowerCase()));
    const hasVerifiedAddress =
      !!callerAddress &&
      callerAddress.trim().length >= 8 &&
      callerAddress !== 'Adresse folgt via SMS-Portal';

    const mode: 'photo' | 'register' = (hasVerifiedName && hasVerifiedAddress) ? 'photo' : 'register';
    console.log(`[request_onboarding_link] isKnown=${isKnown} mode=${mode} name="${tenantName ?? '—'}" addr="${callerAddress ?? '—'}"`);

    // ── Idempotency: reuse silent ticket created within last 10 minutes ───
    let ticketId: string | null = null;
    if (isSearchablePhone(realPhone)) {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      const { data: existing } = await supabase
        .from('tickets')
        .select('id')
        .ilike('caller_phone', phoneIlikePattern(realPhone))
        .eq('issue_summary', 'INTERN: Registrierung')
        .gte('created_at', tenMinutesAgo)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existing) {
        ticketId = existing.id;
        console.log(`[request_onboarding_link] Reusing existing ticket ${ticketId}`);
      }
    }

    // ── Create silent ticket if no recent one found ────────────────────────
    // ticket_id='internal' + category='ADMIN' signals this is internal-only.
    // Dashboard queries should exclude issue_summary='INTERN: Registrierung'.
    if (!ticketId) {
      const { data: newTicket, error: insertError } = await supabase
        .from('tickets')
        .insert({
          organization_id: organizationId,
          tenant_id: 'internal',
          call_id: callId,
          status: 'NEW',
          urgency: 'LOW',
          category: 'ADMIN',
          sentiment: 'UNKNOWN',
          issue_summary: 'INTERN: Registrierung',
          issue_details: `Automatischer Link-Versand via Vapi. Modus: ${mode}.`,
          caller_name: tenantName || 'Unbekannter Mieter',
          caller_phone: realPhone,
          raw_caller_name: '',
          raw_caller_address: '',
          address: '',
          unit: '',
        })
        .select('id')
        .single();

      if (insertError || !newTicket) {
        console.error(`[request_onboarding_link] Insert failed: ${insertError?.message}`);
        return NextResponse.json({
          results: [{ toolCallId: toolCallId, result: { success: false, message: 'Fehler beim Erstellen des Links.' } }]
        });
      }
      ticketId = newTicket.id;
      console.log(`[request_onboarding_link] Created silent ticket ${ticketId}`);
    }

    // ── Guard: ticketId must be set (DB error or timeout could leave it null) ─
    if (!ticketId) {
      console.error(`[request_onboarding_link] ticketId is null after insert — DB error or timeout`);
      return NextResponse.json({
        results: [{ toolCallId: toolCallId, result: {
          success: false,
          message: 'Konnte keinen Ticket-Kontext erzeugen. Bitte später erneut versuchen.'
        }}]
      });
    }

    // ── Send SMS ──────────────────────────────────────────────────────────
    console.log(`[request_onboarding_link] Versuche Registrierungs-SMS an ${realPhone} zu senden (ticket=${ticketId}, isKnown=${isKnown})`);
    const smsResult = await sendPhotoRequestSMS(realPhone, ticketId, 'ADMIN', {
      orgName: organizationName,
      isKnown,
      tenantName,
    });

    if (!smsResult.success) {
      console.error(`[request_onboarding_link] SMS failed: ${smsResult.error}`);
      return NextResponse.json({
        results: [{ toolCallId: toolCallId, result: {
          success: false,
          message: 'SMS-Versand fehlgeschlagen. Bitte den Link manuell weitergeben.'
        }}]
      });
    }

    // ── Log activity ──────────────────────────────────────────────────────
    await supabase.from('ticket_activities').insert({
      ticket_id: ticketId,
      admin_email: null,
      activity_type: 'onboarding_link_sent',
      description: `Onboarding-Link gesendet (${mode})`,
      metadata: { sms_sid: smsResult.messageSid, phone: realPhone, mode },
    });

    const modeLabel = mode === 'photo' ? 'Foto-Link' : 'Registrierungs-Link';
    console.log(`[request_onboarding_link] ✅ ${modeLabel} sent to ${realPhone} | ticket=${ticketId}`);

    return NextResponse.json({
      results: [{ toolCallId: toolCallId, result: {
        success: true,
        message: `${modeLabel} wurde per SMS gesendet.`
      }}]
    });

  } catch (linkError: any) {
    console.error(`[request_onboarding_link] Error: ${linkError.message}`);
    return NextResponse.json({
      results: [{ toolCallId: toolCallId, result: { success: false, message: 'Interner Fehler beim Link-Versand.' } }]
    });
  }
}
