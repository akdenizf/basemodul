import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockSupabase, type MockSupabase } from './_mocks/supabase';

// The router captures `const supabase = getSupabaseAdmin()` at module-load
// time. To let each test swap the response set, we hand the router a stable
// proxy that delegates every call to whichever `activeMock` is current.
const ORG = { id: 'org-1', name: 'Hausverwaltung Beispiel', slug: 'beispiel' };

let activeMock: MockSupabase = createMockSupabase();

const liveProxy = {
  from: (...args: any[]) => activeMock.from(...args),
  rpc: (...args: any[]) => activeMock.rpc(...args),
};

vi.mock('@/lib/supabase/admin', () => ({
  getSupabaseAdmin: () => liveProxy,
}));

vi.mock('@/lib/twilio', () => ({
  isTwilioConfigured: vi.fn(() => false),
  sendPhotoRequestSMS: vi.fn().mockResolvedValue({ success: true }),
}));

const { POST } = await import('@/app/api/vapi/webhook/route');

function makeRequest(body: any, headers: Record<string, string> = {}) {
  return new Request('https://test.local/api/vapi/webhook', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  delete process.env.VAPI_WEBHOOK_SECRET;
  // Hand each test a fresh response queue
  activeMock = createMockSupabase({
    responses: {
      organizations: { data: ORG, error: null },
      tenants: { data: [], error: null },
    },
  });
});

describe('webhook router', () => {
  it('returns 401 when x-vapi-secret is missing and a secret is configured', async () => {
    process.env.VAPI_WEBHOOK_SECRET = 'expected-secret';

    const res = await POST(makeRequest({ message: { type: 'assistant-request' } }));
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe('Unauthorized');
  });

  it('returns 401 when x-vapi-secret does not match', async () => {
    process.env.VAPI_WEBHOOK_SECRET = 'expected-secret';

    const res = await POST(makeRequest(
      { message: { type: 'assistant-request' } },
      { 'x-vapi-secret': 'wrong-secret' }
    ));
    expect(res.status).toBe(401);
  });

  it('dispatches assistant-request to the correct handler', async () => {
    const res = await POST(makeRequest({
      message: {
        type: 'assistant-request',
        call: {
          customer: { number: '+491709999999' },
          phoneNumberId: 'vapi-phone-1',
        },
      },
    }));

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.assistant?.firstMessage).toBeDefined();
    expect(json.assistant.variableValues.org_name).toBe('Hausverwaltung Beispiel');
  });

  it('returns OK for unknown tool function names', async () => {
    const res = await POST(makeRequest({
      message: {
        type: 'tool-calls',
        toolCalls: [{
          id: 'tc-1',
          function: { name: 'totally_made_up_tool', arguments: '{}' },
        }],
      },
    }));

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.results[0].toolCallId).toBe('tc-1');
    expect(json.results[0].result).toBe('OK');
  });

  it('routes end_call_tool to the end-call handler with endCall:true', async () => {
    const res = await POST(makeRequest({
      message: {
        type: 'tool-calls',
        toolCalls: [{
          id: 'tc-end',
          function: { name: 'end_call_tool', arguments: '{}' },
        }],
      },
    }));

    const json = await res.json();
    expect(json.endCall).toBe(true);
    expect(json.results[0].toolCallId).toBe('tc-end');
    expect(json.results[0].result).toBe('success');
  });
});
