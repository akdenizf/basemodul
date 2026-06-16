import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockSupabase } from './_mocks/supabase';

// Twilio mocked — isTwilioConfigured() must return true so we get past the
// early-bail check. sendPhotoRequestSMS is a spy to verify NO SMS goes out
// when rate-limit/duplicate-guard kicks in.
vi.mock('@/lib/twilio', () => ({
  isTwilioConfigured: vi.fn(() => true),
  sendPhotoRequestSMS: vi.fn().mockResolvedValue({ success: true, messageSid: 'SM_test' }),
}));

const { handleRequestOnboardingLink } = await import('@/app/api/vapi/_handlers/request-onboarding-link');
const twilio = await import('@/lib/twilio');

const CALLER_PHONE = '+491701234567';

function makeCtx(supabase: any) {
  return {
    message: {
      type: 'tool-calls',
      call: {
        customer: { number: CALLER_PHONE },
        phoneNumberId: 'vapi-phone-1',
        id: 'call-link-1',
      },
    },
    body: {},
    supabase,
    toolCallId: 'tool-call-1',
    args: {},
    functionName: 'request_onboarding_link',
    requestOrigin: 'https://test.local',
  };
}

beforeEach(() => {
  vi.mocked(twilio.sendPhotoRequestSMS).mockClear();
});

describe('handleRequestOnboardingLink', () => {
  it('blocks the request when rate limit is hit (≥3 sends in last hour)', async () => {
    const supabase = createMockSupabase({
      responses: {
        ticket_activities: { data: null, error: null, count: 3 }, // rate-limit query returns 3
      },
    });

    const response = await handleRequestOnboardingLink(makeCtx(supabase) as any);
    const json = await response.json();

    expect(json.results[0].result.success).toBe(false);
    expect(json.results[0].result.message).toMatch(/in etwa einer Stunde/i);

    // No SMS sent
    expect(twilio.sendPhotoRequestSMS).not.toHaveBeenCalled();
    // No ticket created
    expect(supabase._calls.inserts.tickets ?? []).toHaveLength(0);
  });

  it('returns idempotent success when a recent SMS exists (duplicate guard)', async () => {
    const recentTimestamp = new Date(Date.now() - 60 * 1000).toISOString(); // 1 minute ago
    const supabase = createMockSupabase({
      responses: {
        ticket_activities: [
          { data: null, error: null, count: 1 },                                       // rate-limit — passes
          { data: { id: 'act-1', created_at: recentTimestamp, activity_type: 'photo_requested' }, error: null }, // duplicate found
        ],
      },
    });

    const response = await handleRequestOnboardingLink(makeCtx(supabase) as any);
    const json = await response.json();

    expect(json.results[0].result.success).toBe(true);
    expect(json.results[0].result.message).toMatch(/bereits per SMS gesendet/i);

    // No SMS — duplicate guard skipped the send
    expect(twilio.sendPhotoRequestSMS).not.toHaveBeenCalled();
    // No new ticket — we returned before the ticket-reuse / create path
    expect(supabase._calls.inserts.tickets ?? []).toHaveLength(0);
  });

  it('passes both guards and sends an SMS when neither limit applies', async () => {
    const supabase = createMockSupabase({
      responses: {
        ticket_activities: [
          { data: null, error: null, count: 0 },  // rate-limit — passes
          { data: null, error: null },             // no recent duplicate
          { data: null, error: null },             // activity log insert response
        ],
        organizations: { data: { id: 'org-1', name: 'Hausverwaltung Beispiel', slug: 'beispiel' }, error: null },
        tenants: { data: [], error: null },         // unregistered caller
        tickets: [
          { data: null, error: null },              // history lookup — caller not in past tickets
          { data: null, error: null },              // INTERN reuse — no recent silent ticket
          { data: { id: 'tic-link-1' }, error: null }, // INSERT new silent ticket
        ],
      },
    });

    const response = await handleRequestOnboardingLink(makeCtx(supabase) as any);
    const json = await response.json();

    expect(json.results[0].result.success).toBe(true);
    expect(json.results[0].result.message).toMatch(/Registrierungs-Link/i);

    expect(twilio.sendPhotoRequestSMS).toHaveBeenCalledTimes(1);
    // unregistered caller → register mode
    const [, , , context] = vi.mocked(twilio.sendPhotoRequestSMS).mock.calls[0];
    expect(context?.isKnown).toBe(false);
  });
});
