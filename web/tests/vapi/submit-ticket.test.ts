import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockSupabase } from './_mocks/supabase';

// Twilio is mocked module-wide. Default isTwilioConfigured()=false keeps the
// synchronous-path tests focused; per-test overrides via vi.mocked() enable
// the fire-and-forget SMS branch when we need to assert on it.
vi.mock('@/lib/twilio', () => ({
  isTwilioConfigured: vi.fn(() => false),
  sendPhotoRequestSMS: vi.fn().mockResolvedValue({ success: true, messageSid: 'SM_test' }),
}));

// Import after vi.mock so the handler sees the mocked module.
const { handleSubmitTicket } = await import('@/app/api/vapi/_handlers/submit-ticket');
const twilio = await import('@/lib/twilio');

const ORG = { id: 'org-1', name: 'Hausverwaltung Beispiel', slug: 'beispiel' };
const CALLER_PHONE = '+491701234567';

function makeCtx(args: any, supabase: any) {
  return {
    message: {
      type: 'tool-calls',
      call: {
        customer: { number: CALLER_PHONE },
        phoneNumberId: 'vapi-phone-1',
        id: 'call-test-1',
      },
    },
    body: {},
    supabase,
    toolCallId: 'tool-call-1',
    args,
    functionName: 'submit_ticket',
    requestOrigin: 'https://test.local',
  };
}

beforeEach(() => {
  // Defensive — keep VAPI_WEBHOOK_SECRET unset so submit-ticket's fire-and-forget
  // fetch to /api/tickets/process-new is skipped (it's gated on the secret).
  delete process.env.VAPI_WEBHOOK_SECRET;
  // Reset Twilio mocks: default (configured=false) skips the SMS branch entirely.
  vi.mocked(twilio.isTwilioConfigured).mockReturnValue(false);
  vi.mocked(twilio.sendPhotoRequestSMS).mockClear();
  vi.mocked(twilio.sendPhotoRequestSMS).mockResolvedValue({ success: true, messageSid: 'SM_test' });
});

describe('handleSubmitTicket', () => {
  it('creates a new ticket with status=created when no follow-up match exists', async () => {
    const supabase = createMockSupabase({
      responses: {
        organizations: [
          { data: ORG, error: null },                                                    // primary lookup
          { data: { call_limit: null, current_month_calls: 0, plan_tier: 'starter' }, error: null }, // billing fields
        ],
        tickets: [
          { data: [], error: null },                                                     // follow-up check — no open tickets
          { data: { id: 'tic-new-1', ticket_code: 'TIC-NEW-1' }, error: null },          // INSERT response
        ],
        tenants: { data: [], error: null },                                              // unregistered caller
      },
    });

    const response = await handleSubmitTicket(makeCtx({
      caller: { name: 'Anna Schmidt', phone: CALLER_PHONE },
      issue: { summary: 'Heizung im Wohnzimmer kalt', details: 'Seit gestern Abend', category: 'HEATING', urgency: 'HIGH' },
      location: { address: 'Beispielstr. 12', unit: '4' },
    }, supabase) as any);

    expect(response.status).toBe(200);
    const json = await response.json();

    expect(json.results[0].result.success).toBe(true);
    expect(json.results[0].result.status).toBe('created');
    expect(json.results[0].result.ticket_id).toBe('tic-new-1');

    // Exactly one ticket inserted, with the right shape
    expect(supabase._calls.inserts.tickets).toHaveLength(1);
    const inserted = supabase._calls.inserts.tickets[0];
    expect(inserted).toMatchObject({
      organization_id: 'org-1',
      tenant_id: 'beispiel',
      status: 'NEW',
      urgency: 'HIGH',
      category: 'HEATING',
      caller_name: 'Anna Schmidt',
      caller_phone: CALLER_PHONE,
      issue_summary: 'Heizung im Wohnzimmer kalt',
    });
  });

  it('normalizes invented category NOISE_COMPLAINT to OTHER before insert', async () => {
    const supabase = createMockSupabase({
      responses: {
        organizations: [
          { data: ORG, error: null },
          { data: null, error: null },
        ],
        tickets: [
          { data: [], error: null },                                                     // no follow-up
          { data: { id: 'tic-noise-1', ticket_code: 'TIC-NOISE-1' }, error: null },      // INSERT
        ],
        tenants: { data: [], error: null },
      },
    });

    const response = await handleSubmitTicket(makeCtx({
      caller: { name: 'Anna Schmidt', phone: CALLER_PHONE },
      issue: { summary: 'Laute Musik aus Nachbarwohnung', category: 'NOISE_COMPLAINT', urgency: 'MEDIUM' },
    }, supabase) as any);

    const json = await response.json();
    expect(json.results[0].result.status).toBe('created');

    // The DB never sees NOISE_COMPLAINT — it must arrive as OTHER (DB enum value)
    const inserted = supabase._calls.inserts.tickets[0];
    expect(inserted.category).toBe('OTHER');
  });

  it('merges as already_exists when an open ticket with same category + shared topic tokens exists', async () => {
    const supabase = createMockSupabase({
      responses: {
        organizations: [
          { data: ORG, error: null },
          { data: null, error: null },
        ],
        tickets: [
          // follow-up check — open ticket with overlapping content tokens
          {
            data: [
              {
                id: 'tic-existing-1',
                ticket_code: 'TIC042',
                status: 'NEW',
                category: 'PLUMBING',
                issue_summary: 'Wasserrohr leckt im Badezimmer',
                issue_details: 'Originale Details',
              },
            ],
            error: null,
          },
          // update response
          { data: null, error: null },
        ],
        ticket_activities: { data: null, error: null },
      },
    });

    const response = await handleSubmitTicket(makeCtx({
      caller: { name: 'Anna Schmidt', phone: CALLER_PHONE },
      // Same category + shared tokens (wasserrohr, leckt, badezimmer) → must merge
      issue: { summary: 'Wasserrohr leckt jetzt stärker badezimmer', details: 'Tropft jede Sekunde', category: 'PLUMBING', urgency: 'HIGH' },
    }, supabase) as any);

    const json = await response.json();
    expect(json.results[0].result.success).toBe(true);
    expect(json.results[0].result.status).toBe('already_exists');
    expect(json.results[0].result.ticket_id).toBe('tic-existing-1');

    // No new ticket inserted on the merge path
    expect(supabase._calls.inserts.tickets ?? []).toHaveLength(0);

    // Activity log records the follow-up
    expect(supabase._calls.inserts.ticket_activities).toBeDefined();
    expect(supabase._calls.inserts.ticket_activities[0]).toMatchObject({
      ticket_id: 'tic-existing-1',
      activity_type: 'follow_up_call',
    });

    // Existing ticket's issue_details got an append (update on tickets fired)
    expect(supabase._calls.updates.tickets).toHaveLength(1);
    expect(supabase._calls.updates.tickets[0].issue_details).toContain('Originale Details');
    expect(supabase._calls.updates.tickets[0].issue_details).toContain('Folgeanruf');
  });

  it('does NOT merge when category matches but issue_summary has no shared content tokens', async () => {
    const supabase = createMockSupabase({
      responses: {
        organizations: [
          { data: ORG, error: null },
          { data: null, error: null },
        ],
        tickets: [
          // Open BUILDING ticket — same category, completely different topic
          {
            data: [
              {
                id: 'tic-window',
                ticket_code: 'TIC-W1',
                status: 'NEW',
                category: 'BUILDING',
                issue_summary: 'Fenster klemmt im Schlafzimmer',
                issue_details: null,
              },
            ],
            error: null,
          },
          { data: { id: 'tic-door-new', ticket_code: 'TIC-D1' }, error: null }, // INSERT for the new problem
        ],
        tenants: { data: [], error: null },
      },
    });

    const response = await handleSubmitTicket(makeCtx({
      caller: { name: 'Anna Schmidt', phone: CALLER_PHONE },
      // Same BUILDING category — but different topic (Tür/Schloss vs Fenster/Schlafzimmer)
      issue: { summary: 'Wohnungstür Schloss defekt eingangstür', category: 'BUILDING', urgency: 'MEDIUM' },
    }, supabase) as any);

    const json = await response.json();
    expect(json.results[0].result.status).toBe('created');
    expect(json.results[0].result.ticket_id).toBe('tic-door-new');
    // A fresh ticket — INSERT happened on the new payload
    expect(supabase._calls.inserts.tickets).toHaveLength(1);
  });

  it('sends a new SMS for a different ticket even when caller is registered (per-ticket SMS-Guard)', async () => {
    // Enable Twilio so the fire-and-forget SMS branch actually runs
    vi.mocked(twilio.isTwilioConfigured).mockReturnValue(true);

    const supabase = createMockSupabase({
      responses: {
        organizations: [
          { data: ORG, error: null },
          { data: null, error: null },
        ],
        tickets: [
          { data: [], error: null },                                              // no follow-up
          { data: { id: 'tic-new-99', ticket_code: 'TIC99' }, error: null },      // INSERT new ticket
        ],
        // Registered caller — dbTenantName lookup succeeds.
        // Phone last-10 of CALLER_PHONE (+491701234567) is 1701234567.
        tenants: { data: [{ name: 'Anna Schmidt', phone: CALLER_PHONE }], error: null },
        ticket_activities: [
          { data: null, error: null },                                            // 'created' activity insert
          // SMS-Guard lookup: previous photo_requested was for a DIFFERENT ticket
          {
            data: {
              id: 'act-old',
              created_at: new Date(Date.now() - 60 * 1000).toISOString(),         // 1 minute ago
              ticket_id: 'tic-old-DIFFERENT',
            },
            error: null,
          },
          { data: null, error: null },                                            // 'photo_requested' activity insert after SMS
        ],
      },
    });

    const response = await handleSubmitTicket(makeCtx({
      caller: { name: 'Anna Schmidt', phone: CALLER_PHONE },
      issue: { summary: 'Heizung kalt im Schlafzimmer', category: 'HEATING', urgency: 'HIGH' },
    }, supabase) as any);

    expect(response.status).toBe(200);

    // Synchronous return is independent of the fire-and-forget SMS — wait for the SMS call.
    await vi.waitFor(
      () => expect(twilio.sendPhotoRequestSMS).toHaveBeenCalledTimes(1),
      { timeout: 500 },
    );

    // Confirm the SMS was for the NEW ticket, not the recent (different) one
    const [, ticketArg] = vi.mocked(twilio.sendPhotoRequestSMS).mock.calls[0];
    expect(ticketArg).toBe('tic-new-99');
  });

  it('SKIPS SMS when the same ticket already received one and caller has uploaded', async () => {
    vi.mocked(twilio.isTwilioConfigured).mockReturnValue(true);

    const supabase = createMockSupabase({
      responses: {
        organizations: [
          { data: ORG, error: null },
          { data: null, error: null },
        ],
        tickets: [
          { data: [], error: null },
          { data: { id: 'tic-same-1', ticket_code: 'TIC-SAME' }, error: null },
        ],
        tenants: { data: [{ name: 'Anna Schmidt', phone: CALLER_PHONE }], error: null },
        ticket_activities: [
          { data: null, error: null },
          // Recent photo_requested for the SAME ticket-id that submit-ticket just created.
          // In practice impossible (new id), but proves the guard fires when ids match.
          {
            data: {
              id: 'act-same',
              created_at: new Date(Date.now() - 60 * 1000).toISOString(),
              ticket_id: 'tic-same-1',
            },
            error: null,
          },
        ],
      },
    });

    const response = await handleSubmitTicket(makeCtx({
      caller: { name: 'Anna Schmidt', phone: CALLER_PHONE },
      issue: { summary: 'Heizung kalt', category: 'HEATING', urgency: 'HIGH' },
    }, supabase) as any);

    expect(response.status).toBe(200);

    // Give the fire-and-forget block a moment to run the guard check
    await new Promise(r => setTimeout(r, 50));
    expect(twilio.sendPhotoRequestSMS).not.toHaveBeenCalled();
  });
});
