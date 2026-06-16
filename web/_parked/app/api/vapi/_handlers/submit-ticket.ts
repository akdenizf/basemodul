import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { sendPhotoRequestSMS, isTwilioConfigured } from "@/lib/twilio";
import { getLast10, phoneIlikePattern, isSearchablePhone } from "../_phone";
import { deTimestamp } from "../_constants";
import type { ToolCtx } from "./_types";

// ============================================================
// Submit-ticket private helpers
// All helpers below are used exclusively by handleSubmitTicket.
// ============================================================

// Zod schema for submit_ticket payload validation
const submitTicketSchema = z.object({
  caller: z.object({
    name: z.string().nullish(),
    phone: z.string().nullish(),
    address: z.string().nullish(),
    unit: z.string().nullish(),
  }).nullish(),
  issue: z.object({
    summary: z.string().nullish(),
    details: z.string().nullish(),
    category: z.string().nullish(),
    urgency: z.string().nullish(),
    sentiment: z.string().nullish(),
  }).nullish(),
  location: z.object({
    address: z.string().nullish(),
    unit: z.string().nullish(),
  }).nullish(),
  // Flat alternatives (Vapi sometimes sends these instead of nested)
  caller_name: z.string().nullish(),
  name: z.string().nullish(),
  issue_summary: z.string().nullish(),
  summary: z.string().nullish(),
  issue_details: z.string().nullish(),
  details: z.string().nullish(),
  category: z.string().nullish(),
  urgency: z.string().nullish(),
  priority: z.string().nullish(),
  sentiment: z.string().nullish(),
  address: z.string().nullish(),
  unit: z.string().nullish(),
  phone: z.string().nullish(),
}).passthrough();

// All valid technical DB categories trigger SMS — must match ticket_category enum exactly
// DB enum: PLUMBING, HEATING, ELECTRICAL, BUILDING, ADMIN, OTHER
const PHOTO_REQUEST_CATEGORIES = ['PLUMBING', 'HEATING', 'ELECTRICAL', 'BUILDING'];

// Whitelist of valid DB enum values for ticket_category.
const VALID_CATEGORIES = new Set(['PLUMBING', 'HEATING', 'ELECTRICAL', 'BUILDING', 'ADMIN', 'OTHER']);

// Maps AI-supplied synonyms / legacy values onto valid enum members.
// Keeps inserts from failing with Postgres 22P02 when the model invents categories.
const CATEGORY_ALIASES: Record<string, string> = {
  NOISE_COMPLAINT: 'OTHER',
  NOISE: 'OTHER',
  LOCKSMITH: 'BUILDING',
  STRUCTURAL: 'BUILDING',
  BILLING: 'ADMIN',
  COMMERCIAL: 'OTHER',
  UTILITIES: 'ELECTRICAL',
  WATER: 'PLUMBING',
  GAS: 'HEATING',
  POWER: 'ELECTRICAL',
};

// Normalises any incoming category string to a valid DB enum value.
// Unknown values fall back to 'OTHER' — never crashes the insert.
function normalizeCategory(raw: string | null | undefined): string {
  if (!raw) return 'OTHER';
  const upper = raw.trim().toUpperCase();
  if (VALID_CATEGORIES.has(upper)) return upper;
  if (CATEGORY_ALIASES[upper]) return CATEGORY_ALIASES[upper];
  return 'OTHER';
}

// Strips unresolved Vapi template placeholders before DB writes.
// Vapi passes {{address}} verbatim when the variable wasn't resolved during the call.
const sanitizePlaceholder = (v: string): string =>
  /\{\{.*?\}\}/.test(v) ? '' : v;

// German stopwords excluded from topic-matching tokens (lowercase).
// Kept short — only words that would otherwise produce false-positive matches.
const TOPIC_STOPWORDS = new Set([
  'der', 'die', 'das', 'den', 'dem', 'des',
  'ein', 'eine', 'einen', 'einer', 'eines',
  'und', 'oder', 'aber', 'doch',
  'ist', 'sind', 'war', 'waren', 'wird', 'werden',
  'hat', 'haben', 'hatte', 'hatten',
  'mein', 'meine', 'mir', 'mich',
  'sein', 'seine', 'ihr', 'ihre',
  'für', 'mit', 'ohne', 'vor', 'nach', 'bei', 'auf', 'unter', 'über',
  'noch', 'immer', 'auch', 'sehr', 'mehr', 'schon',
  'kann', 'können', 'muss', 'müssen', 'soll', 'sollte',
  'nicht', 'kein', 'keine',
]);

// Extracts unique content tokens (≥4 chars, non-stopword) for thematic comparison.
function contentTokens(text: string | null | undefined): string[] {
  if (!text) return [];
  const seen = new Set<string>();
  const tokens = text
    .toLowerCase()
    .replace(/[^a-zäöüß0-9\s]/gi, ' ')
    .split(/\s+/)
    .filter(t => t.length >= 4 && !TOPIC_STOPWORDS.has(t));
  const unique: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    if (!seen.has(tokens[i])) { seen.add(tokens[i]); unique.push(tokens[i]); }
  }
  return unique;
}

// True only when two summaries share ≥2 content tokens — i.e. the same noun + verb /
// noun + noun likely refer to the same physical problem.
// "Fenster klemmt" vs "Tür schließt nicht" → 0 shared → false (different problems).
// "Wasserrohr leckt" vs "Wasserrohr leckt immer noch" → 2 shared → true (same problem).
function summariesShareTopic(a: string | null | undefined, b: string | null | undefined): boolean {
  const tokensA = contentTokens(a);
  const tokensB = contentTokens(b);
  if (tokensA.length === 0 || tokensB.length === 0) return false;
  const setB = new Set(tokensB);
  let shared = 0;
  for (let i = 0; i < tokensA.length; i++) {
    if (setB.has(tokensA[i])) shared++;
  }
  return shared >= 2;
}

// ============================================================
// 🎫 SUBMIT_TICKET - Vereinfacht
// ============================================================
export async function handleSubmitTicket(ctx: ToolCtx): Promise<NextResponse> {
  const { args, message, body, supabase, toolCallId, requestOrigin } = ctx;

  // Support both nested (caller.name, issue.summary) and flat (caller_name, issue_summary) structures
  const caller = args.caller || {};
  const issue = args.issue || {};
  const location = args.location || {};
  const vapiPhoneId = message.call?.phoneNumberId || body.call?.phoneNumberId;
  const callId = message.call?.id || body.call?.id || `call_${Date.now()}`;

  // WICHTIG: Die ECHTE Anrufer-Telefonnummer aus Vapi (nicht was die KI gehört hat!)
  const realCallerPhone = message.call?.customer?.number || body.call?.customer?.number || '';

  console.log(`🎫 TICKET: call=${callId}`);
  console.log(`📞 REAL CALLER PHONE: ${realCallerPhone}`);

  // Zod validation for observability (non-blocking)
  const validation = submitTicketSchema.safeParse(args);
  if (!validation.success) {
    console.warn(`[WEBHOOK] ⚠️ Payload validation issues:`, JSON.stringify(validation.error.issues, null, 2));
    console.warn(`[WEBHOOK] Raw args:`, JSON.stringify(args, null, 2));
  } else {
    console.log(`[WEBHOOK] ✅ Payload validated successfully`);
  }

  // ========================================
  // SCHRITT 1: ORGANISATION IDENTIFIZIEREN
  // ========================================
  let organizationId: string | null = null;
  let organizationSlug: string | null = null;
  let organizationName: string = 'Ihre Hausverwaltung';
  let orgCallLimit: number | null = null;
  let orgCurrentCalls: number = 0;
  let orgPlanTier: string = 'starter';

  // Minimal SELECT — only base columns guaranteed to exist.
  // Billing columns (call_limit etc.) fetched separately after org is confirmed.
  const ORG_ID_SELECT = 'id, name, slug';

  if (vapiPhoneId) {
    const { data: org, error: orgErr } = await supabase
      .from('organizations')
      .select(ORG_ID_SELECT)
      .eq('vapi_phone_id', vapiPhoneId)
      .eq('is_active', true)
      .maybeSingle();

    if (orgErr) {
      console.error(`❌ ORG LOOKUP ERROR (vapi_phone_id): code=${orgErr.code} msg=${orgErr.message}`);
    } else if (org) {
      organizationId = org.id;
      organizationSlug = org.slug;
      if (org.name) organizationName = org.name;
      console.log(`🏢 ORG FOUND: ${org.name} (${org.slug})`);
    } else {
      console.warn(`⚠️ No org for vapi_phone_id="${vapiPhoneId}"`);
    }
  }

  // Fallback zur ersten aktiven Organisation
  if (!organizationId) {
    const { data: fallback, error: fallbackErr } = await supabase
      .from('organizations')
      .select(ORG_ID_SELECT)
      .eq('is_active', true)
      .limit(1)
      .maybeSingle();

    if (fallbackErr) {
      console.error(`❌ ORG FALLBACK ERROR: code=${fallbackErr.code} msg=${fallbackErr.message}`);
    } else if (fallback) {
      organizationId = fallback.id;
      organizationSlug = fallback.slug;
      if (fallback.name) organizationName = fallback.name;
      console.log(`🏢 ORG FALLBACK: ${fallback.name} (${fallback.slug})`);
    }
  }

  // Billing fields — separate query, non-blocking if migration not yet applied
  if (organizationId) {
    const { data: billing, error: billingErr } = await supabase
      .from('organizations')
      .select('call_limit, current_month_calls, plan_tier')
      .eq('id', organizationId)
      .maybeSingle();

    if (billingErr) {
      console.warn(`[Billing] Could not fetch billing fields (migration pending?): ${billingErr.message}`);
    } else if (billing) {
      orgCallLimit = billing.call_limit ?? null;
      orgCurrentCalls = billing.current_month_calls ?? 0;
      orgPlanTier = billing.plan_tier ?? 'starter';
      console.log(`💳 BILLING: plan=${orgPlanTier} calls=${orgCurrentCalls}/${orgCallLimit ?? '∞'}`);
    }
  }

  if (!organizationId) {
    console.error(`❌ CRITICAL: No organization found!`);
    return NextResponse.json({
      results: [{ toolCallId: toolCallId, result: "Fehler beim Speichern. Bitte rufen Sie später an." }]
    });
  }

  // ========================================
  // CALL LIMIT CHECK (soft enforcement)
  // ========================================
  // Soft = still create the ticket (never block a tenant call), but log + TODO: Stripe overage
  if (orgCallLimit !== null && orgCurrentCalls >= orgCallLimit) {
    console.warn(`[Call-Limit] ⚠️ Org ${organizationId} over monthly limit: ${orgCurrentCalls}/${orgCallLimit} (plan: ${orgPlanTier})`);
    // TODO: Trigger Stripe overage charge at 0.80€/call when Stripe integration is wired
  }

  // ========================================
  // KATEGORIE + URGENCY — früh extrahieren (vor SCHRITT 1.5 benötigt)
  // ========================================
  const rawUrgency = args.urgency || issue?.urgency || args.priority || 'MEDIUM';
  // DB enum: LOW, MEDIUM, HIGH, EMERGENCY — map legacy alias only
  const urgencyMap: Record<string, string> = { URGENT: 'HIGH' };
  const dbUrgency = urgencyMap[rawUrgency] || rawUrgency;

  // DB enum: PLUMBING, HEATING, ELECTRICAL, BUILDING, ADMIN, OTHER.
  // KI-Werte wie "NOISE_COMPLAINT" werden via normalizeCategory() auf einen
  // gültigen Enum-Wert gemappt — verhindert Postgres 22P02 beim Insert.
  const rawCategory = args.category || issue?.category;
  const dbCategory = normalizeCategory(rawCategory);
  if (rawCategory && rawCategory !== dbCategory) {
    console.warn(`🏷️ CATEGORY-NORMALIZED: "${rawCategory}" → "${dbCategory}"`);
  }

  console.log(`🏷️ INCOMING: category="${dbCategory}" urgency="${dbUrgency}"`);

  // Flexible extraction — support both nested (issue.details) and flat (args.issue_details) Vapi payloads.
  // Defined here so SCHRITT 1.5 (follow-up append) and SCHRITT 2 (new ticket insert) both use the same values.
  const extractedSummary = issue?.summary || args.issue_summary || args.summary || '';
  const extractedDetails = issue?.details || args.issue_details || args.details || '';

  // ========================================
  // SCHRITT 1.5: FOLLOW-UP CALL CHECK (v9.2)
  // ========================================
  // Merge-Bedingung (v16.5): Telefon UND Kategorie UND thematische Überschneidung.
  // Reine Kategorie-Gleichheit (z.B. zwei BUILDING-Tickets: "Fenster klemmt" + "Tür defekt")
  // ist NICHT ausreichend — die Issue-Summaries müssen ≥2 inhaltliche Tokens teilen.
  if (isSearchablePhone(realCallerPhone)) {
    try {
      // Alle offenen Tickets dieser Nummer laden (bis 5), Kategorie + Topic-Check im Code
      const { data: openByPhone } = await supabase
        .from('tickets')
        .select('id, ticket_code, status, category, issue_summary, issue_details')
        .eq('organization_id', organizationId)
        .in('status', ['NEW', 'IN_PROGRESS'])
        .ilike('caller_phone', phoneIlikePattern(realCallerPhone))
        .order('created_at', { ascending: false })
        .limit(5);

      if (openByPhone && openByPhone.length > 0) {
        // Topic-Lock: Kategorie MUSS gleich sein UND issue_summary muss thematisch überlappen.
        // Unterschiedliches Thema (auch innerhalb derselben Kategorie) = neues Ticket.
        const matchingTicket = openByPhone.find(t =>
          t.category === dbCategory &&
          summariesShareTopic(t.issue_summary, extractedSummary)
        );

        if (matchingTicket) {
          console.log(`🔁 FOLLOW-UP MATCH: ticket=${matchingTicket.ticket_code} category="${matchingTicket.category}" summary≈"${matchingTicket.issue_summary?.slice(0, 40)}"`);

          // 1. Activity Log — Folgeanruf dokumentieren
          try {
            const { error: activityError } = await supabase.from('ticket_activities').insert({
              ticket_id: matchingTicket.id,
              activity_type: 'follow_up_call',
              description: `Folgeanruf – ${issue?.summary || 'Rückfrage zum bestehenden Ticket'}`,
              metadata: {
                call_id: callId,
                new_urgency: dbUrgency,
                new_category: dbCategory,
                new_details: issue?.details || null,
                caller_phone: realCallerPhone
              }
            });
            if (activityError) throw new Error(activityError.message);
          } catch (e: any) {
            console.warn(`⚠️ Follow-up activity log failed (non-critical): ${e.message}`);
          }

          // 2. issue_details APPENDEN (nie ersetzen) — issue_summary NICHT anfassen
          const timestamp = deTimestamp();
          // Use pre-extracted values (support both nested + flat Vapi payloads)
          const noteContent = extractedDetails || extractedSummary;
          const newNote = noteContent
            ? `--- Folgeanruf (${timestamp}) ---\n${noteContent}`
            : `--- Folgeanruf (${timestamp}) ---`;

          const updatedDetails = matchingTicket.issue_details
            ? `${matchingTicket.issue_details}\n\n${newNote}`
            : newNote;

          const { error: updateError } = await supabase
            .from('tickets')
            .update({ issue_details: updatedDetails, updated_at: new Date().toISOString() })
            .eq('id', matchingTicket.id);
          if (updateError) {
            console.warn(`⚠️ Failed to update ticket ${matchingTicket.ticket_code}: ${updateError.message}`);
          }

          console.log(`✅ FOLLOW-UP: Notiz angehängt an ${matchingTicket.ticket_code} (${matchingTicket.issue_summary?.slice(0, 40)})`);

          // Ticket-Code nicht vorlesen — nur SMS enthält die Referenz.
          console.log(`[Submit-Success] Returning Ticket-ID to Vapi: ${matchingTicket.id} (status: already_exists)`);
          return NextResponse.json({
            results: [{
              toolCallId: toolCallId,
              result: { success: true, ticket_id: matchingTicket.id, status: 'already_exists', message: "Ihr Anliegen ist bereits in Bearbeitung. Wir haben Ihren erneuten Anruf dokumentiert." }
            }]
          });

        } else {
          // Offene Tickets vorhanden, aber Kategorie ODER Thema weicht ab → neues Ticket
          const existingInfo = openByPhone.map(t => `${t.ticket_code}:${t.category}:"${t.issue_summary?.slice(0, 30)}"`).join(' | ');
          console.log(`🆕 NO-MERGE: offen=[${existingInfo}] ≠ eingehend="${dbCategory}":"${extractedSummary?.slice(0, 30)}" → neues Ticket`);
          // Kein return — fällt durch zu SCHRITT 2 (neues Ticket)
        }
      }
    } catch (dupCheckError: any) {
      console.warn(`⚠️ Follow-up check failed (non-critical): ${dupCheckError.message}`);
    }
  }

  // ========================================
  // SCHRITT 2: IDENTITÄT — Caller vs. Mieter (v14.0)
  // ========================================
  // Two-source priority: AI-provided name (person speaking) takes precedence
  // over the registered tenant in the DB. Mismatch is documented transparently.

  const isPhoneLike = (v: string) => /^[+\d\s\-()]{7,}$/.test(v.trim());

  // Source A — AI-provided name (the person who actually spoke during the call)
  const rawName = sanitizePlaceholder(caller?.name || args.caller_name || args.name || '');
  const aiName = (rawName && !isPhoneLike(rawName)) ? rawName : null;
  if (rawName && isPhoneLike(rawName)) {
    console.warn(`[Name-Guard] Rejected phone-shaped caller name: "${rawName}"`);
  }

  // Source B — registered tenant name in the DB for this phone number
  let dbTenantName: string | null = null;
  if (isSearchablePhone(realCallerPhone) && organizationId) {
    try {
      const { data: tenants } = await supabase
        .from('tenants')
        .select('name, phone')
        .eq('organization_id', organizationId)
        .not('phone', 'is', null);
      const tenantMatch = tenants?.find(
        (t: any) => getLast10(t.phone) === getLast10(realCallerPhone)
      );
      if (tenantMatch) dbTenantName = tenantMatch.name;
    } catch { /* non-critical — never block ticket creation */ }
  }

  // Source C — ticket history fallback: unregistered callers who have called before
  // Only runs when both AI name and DB tenant name are unavailable.
  let historyName: string | null = null;
  if (!aiName && !dbTenantName && isSearchablePhone(realCallerPhone)) {
    try {
      const { data: histTicket } = await supabase
        .from('tickets')
        .select('caller_name')
        .ilike('caller_phone', phoneIlikePattern(realCallerPhone))
        .not('caller_name', 'ilike', '%Unbekannt%')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      // Guard: reject phone-shaped names — only accept real human names from history
      if (histTicket?.caller_name?.trim() && !isPhoneLike(histTicket.caller_name)) {
        historyName = histTicket.caller_name;
      }
    } catch { /* non-critical — never block ticket creation */ }
  }

  // Priority: AI name > DB tenant name > ticket history > fallback
  const finalCallerName = aiName || dbTenantName || historyName || 'Unbekannter Mieter';
  console.log(`👤 IDENTITY: ai="${aiName ?? '—'}" db="${dbTenantName ?? '—'}" history="${historyName ?? '—'}" → "${finalCallerName}"`);

  // System note when the caller identifies with a different name than the registered tenant
  let identityNote: string | null = null;
  if (aiName && dbTenantName && aiName.trim().toLowerCase() !== dbTenantName.trim().toLowerCase()) {
    identityNote = `[SYSTEM] Anrufer identifiziert sich als ${aiName}. Vertragspartner laut Nummer: ${dbTenantName}.`;
    console.log(`[Identity] Mismatch — ${identityNote}`);
  }

  const extractedAddress = sanitizePlaceholder(location?.address || args.address || caller?.address || '');
  const extractedUnit = sanitizePlaceholder(location?.unit || args.unit || caller?.unit || '');
  const extractedSentiment = args.sentiment || issue?.sentiment || 'UNKNOWN';

  // Append identity note after original details (never overwrite)
  const finalDetails = identityNote
    ? (extractedDetails ? `${extractedDetails}\n\n${identityNote}` : identityNote)
    : extractedDetails;

  // Smart fallback for issue_summary: use first 80 chars of details if no summary
  const finalSummary = extractedSummary
    || (extractedDetails.length > 0 ? extractedDetails.substring(0, 80) : '')
    || 'Neue Meldung';

  const insertPayload = {
    organization_id: organizationId,
    tenant_id: organizationSlug || 'unknown',
    call_id: callId,
    status: 'NEW',
    urgency: dbUrgency,
    category: dbCategory,
    sentiment: extractedSentiment,
    issue_summary: finalSummary,
    issue_details: finalDetails,
    caller_name: finalCallerName,
    // WICHTIG: Nutze die ECHTE Telefonnummer aus Vapi, nicht was die KI gehört hat!
    caller_phone: realCallerPhone || caller?.phone || args.phone || '',
    raw_caller_name: aiName || '',        // raw AI-provided name for audit trail
    raw_caller_address: extractedAddress,
    address: extractedAddress,
    unit: extractedUnit
  };

  const t0submit = Date.now();
  console.log(`📝 INSERT START: call_id=${callId} category="${dbCategory}" urgency="${dbUrgency}"`);

  // ── SCHRITT 2: DB INSERT ────────────────────────────────
  let ticketCode: string;
  let ticketId: string | null = null;

  try {
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .insert(insertPayload)
      .select('id, ticket_code')
      .single();

    if (ticketError) {
      console.error(`❌ INSERT FAILED: ${ticketError.message} | code=${ticketError.code} | hint=${ticketError.hint}`);
      return NextResponse.json({
        results: [{ toolCallId: toolCallId, result: "Es gab ein Problem beim Speichern. Bitte rufen Sie später erneut an." }]
      });
    }

    if (!ticket) {
      console.error(`❌ INSERT: No data returned`);
      return NextResponse.json({
        results: [{ toolCallId: toolCallId, result: "Es gab ein Problem beim Speichern. Bitte rufen Sie später erneut an." }]
      });
    }

    ticketCode = ticket.ticket_code;
    ticketId = ticket.id;
    const insertMs = Date.now() - t0submit;
    console.log(`✅ INSERT SUCCESS: id=${ticketId} code=${ticketCode} | [Speed-Check] submit_ticket insert took: ${insertMs}ms`);

  } catch (dbException: any) {
    console.error(`❌ INSERT EXCEPTION: ${dbException.message}`);
    return NextResponse.json({
      results: [{ toolCallId: toolCallId, result: "Es gab ein Problem beim Speichern. Bitte rufen Sie später erneut an." }]
    });
  }

  // ── SCHRITT 3: RESPOND TO VAPI IMMEDIATELY ─────────────
  // Activity log + SMS run fire-and-forget — never block the response.
  const totalMs = Date.now() - t0submit;
  console.log(`📤 RESPONSE sent after ${totalMs}ms (insert done, async work follows)`);

  const capturedTicketId = ticketId;
  const capturedTicketCode = ticketCode;
  const capturedOrgId = organizationId;

  // Fire-and-forget: activity log + call counter + SMS (non-blocking)
  ;(async () => {
    // Increment monthly call counter (atomic RPC — avoids read-then-write races)
    try {
      await supabase.rpc('increment_monthly_calls', { org_id: capturedOrgId });
      console.log(`[Call-Counter] ✅ Incremented for org ${capturedOrgId}`);
    } catch (e: any) {
      console.warn(`[Call-Counter] Increment failed (non-critical): ${e.message}`);
    }

    try {
      const { error: activityError } = await supabase.from('ticket_activities').insert({
        ticket_id: capturedTicketId,
        activity_type: 'created',
        description: `Ticket erstellt via Anruf`,
        metadata: {
          call_id: callId,
          urgency: dbUrgency,
          category: dbCategory,
          caller_phone: realCallerPhone || null,
          caller_name: finalCallerName,
          identity_mismatch: !!identityNote,
        }
      });
      if (activityError) throw new Error(activityError.message);
      console.log(`📋 [async] Activity logged for ${capturedTicketCode}`);
    } catch (e: any) {
      console.warn(`⚠️ [async] Activity log failed: ${e.message}`);
    }

    // Auto-SMS GARANTIEREN für:
    //  - unregistrierte Anrufer (immer — sie brauchen den Registrierungslink, unabhängig von der Kategorie)
    //  - registrierte Anrufer bei technischer Kategorie (Foto-Link für den Handwerker)
    // Damit ist die SMS-Pipeline auch für OTHER/ADMIN-Kategorien (z.B. NOISE_COMPLAINT → OTHER) gesichert,
    // sobald der Anrufer nicht in der Mieterdatenbank ist.
    const callerIsUnregistered = !dbTenantName;
    const isTechnicalCategory = PHOTO_REQUEST_CATEGORIES.includes(dbCategory);
    const shouldSendAutoSMS = capturedTicketId && realCallerPhone && isTwilioConfigured() &&
      (callerIsUnregistered || isTechnicalCategory);

    if (shouldSendAutoSMS) {
      try {
        // Per-ticket SMS-Guard:
        //  Each newly-created ticket gets its own SMS. We only skip when the most
        //  recent photo_requested was for THIS SAME ticket AND the tenant has
        //  already uploaded (caller_name no longer 'Unbekannt'). In practice
        //  capturedTicketId is brand-new, so different-ticket recent SMS never
        //  blocks — every distinct ticket is entitled to its own link.
        const { data: lastSmsActivity } = await supabase
          .from('ticket_activities')
          .select('id, created_at, ticket_id')
          .eq('activity_type', 'photo_requested')
          .filter('metadata->>phone', 'eq', realCallerPhone)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        let skipSms = false;
        if (lastSmsActivity) {
          const ageMs = Date.now() - new Date(lastSmsActivity.created_at).getTime();
          const isRecent = ageMs < 24 * 60 * 60 * 1000;
          const callerStillUnknown = finalCallerName.includes('Unbekannt');
          const isSameTicket = lastSmsActivity.ticket_id === capturedTicketId;

          if (isRecent && !callerStillUnknown && isSameTicket) {
            skipSms = true;
            console.log(`[SMS-Guard] Skipping — same ticket already received SMS ${Math.round(ageMs / 60000)}min ago and tenant has uploaded`);
          } else {
            const reason = !isSameTicket
              ? `different ticket (last SMS was for ${lastSmsActivity.ticket_id}, this is ${capturedTicketId})`
              : !isRecent
                ? 'last SMS >24h ago'
                : 'caller_name still contains Unbekannt';
            console.log(`[SMS-Guard] Allowing send — ${reason}`);
          }
        }

        if (skipSms) {
          // no-op
        } else {
          // isKnown=true only when caller is in the tenants table.
          // Callers with ticket history (historyName) are not registered — send register mode.
          const isKnownTenant = !!dbTenantName;
          console.log(`[SMS-Trigger] Sending for Ticket: ${capturedTicketId} | category=${dbCategory} | phone=${realCallerPhone} | isKnown=${isKnownTenant}`);
          console.log(`[SMS-Trigger] Versuche Registrierungs-SMS an ${realCallerPhone} zu senden (mode=${isKnownTenant ? 'photo' : 'register'})`);
          const smsResult = await sendPhotoRequestSMS(realCallerPhone, capturedTicketId, dbCategory, {
            orgName: organizationName,
            ticketCode: capturedTicketCode,
            isKnown: isKnownTenant,
            tenantName: isKnownTenant ? finalCallerName : null,
          });
          if (smsResult.success) {
            console.log(`[async][SMS] Sent: ${smsResult.messageSid}`);
            const { error: smsActivityError } = await supabase.from('ticket_activities').insert({
              ticket_id: capturedTicketId,
              admin_email: null,
              activity_type: 'photo_requested',
              description: 'SMS-Anfrage für Foto gesendet',
              metadata: { sms_sid: smsResult.messageSid, phone: realCallerPhone }
            });
            if (smsActivityError) throw new Error(smsActivityError.message);
          } else {
            console.warn(`[async][SMS] Failed: ${smsResult.error}`);
          }
        }
      } catch (smsError: any) {
        console.error(`[async][SMS] Exception: ${smsError.message}`);
      }
    }

    // Trigger async ticket processing: fuzzy matching + org notification email.
    // This mirrors the Supabase DB webhook but fires reliably with the correct auth header.
    //
    // Base URL preference: NEXT_PUBLIC_APP_URL > requestOrigin.
    // Vapi may call us via a non-canonical host (e.g. callfolio.de instead of
    // www.callfolio.io). requestOrigin would inherit that host and 401 if the
    // alternate domain runs on a separate Vercel project / has a different
    // VAPI_WEBHOOK_SECRET. Forcing the canonical app URL fixes that.
    const processSecret = process.env.VAPI_WEBHOOK_SECRET;
    const processBaseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || requestOrigin;
    if (processSecret) {
      try {
        const processUrl = `${processBaseUrl}/api/tickets/process-new`;
        const processResp = await fetch(processUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${processSecret}`,
          },
          body: JSON.stringify({ ticket_id: capturedTicketId }),
        });
        if (!processResp.ok) {
          const errBody = await processResp.text().catch(() => '<no body>');
          console.error(`[async][process-new] HTTP ${processResp.status} for ${capturedTicketId} @ ${processUrl} — body: ${errBody.slice(0, 240)}`);
        } else {
          console.log(`[async][process-new] HTTP ${processResp.status} for ${capturedTicketId} @ ${processUrl}`);
        }
      } catch (e: any) {
        console.error(`[async][process-new] Failed: ${e.message}`);
      }
    }
  })();

  // Tell Vapi whether the caller needs a registration link so it calls the right tool.
  // dbTenantName=null means caller is not in the tenants table → needs request_onboarding_link.
  const callerNeedsRegistration = !dbTenantName;
  // result.message-Strings sind so gewählt, dass der System-Prompt (Section 10) sie eindeutig matcht:
  //  - "nicht registriert" → Registrierungs-Ansage
  //  - "Foto-SMS" → Foto-Ansage
  // Die SMS selbst wird server-seitig im Async-Block (oben) gesendet — keine weiteren Tool-Calls nötig.
  const submitResultMessage = callerNeedsRegistration
    ? `Anliegen gespeichert (${capturedTicketCode}). Anrufer ist nicht registriert — Registrierungs-SMS wird automatisch versendet. Keine weiteren Tool-Calls nötig.`
    : `Anliegen gespeichert (${capturedTicketCode}). Eine Foto-SMS wird an den Mieter gesendet.`;

  console.log(`[Submit-Success] Returning Ticket-ID to Vapi: ${capturedTicketId} | needsRegistration=${callerNeedsRegistration}`);
  return NextResponse.json({
    results: [{
      toolCallId: toolCallId,
      result: { success: true, ticket_id: capturedTicketId, status: 'created', message: submitResultMessage }
    }]
  });
}
