import { describe, it, expect } from 'vitest';
import { handleGetCallerContext } from '@/app/api/vapi/_handlers/get-caller-context';
import { createMockSupabase } from './_mocks/supabase';

const ORG = { id: 'org-1', name: 'Hausverwaltung Beispiel' };
const KNOWN_PHONE = '+491701234567';
const UNKNOWN_PHONE = '+491709999999';

function makeCtx(phone: string, supabase: any, functionName = 'get_caller_context') {
  return {
    message: {
      type: 'tool-calls',
      call: {
        customer: { number: phone },
        phoneNumberId: 'vapi-phone-1',
      },
    },
    body: {},
    supabase,
    toolCallId: 'tool-call-1',
    args: {},
    functionName,
    requestOrigin: 'https://test.local',
  };
}

describe('handleGetCallerContext', () => {
  it('marks a phone-matched tenant as known with contextSource=tenant', async () => {
    const supabase = createMockSupabase({
      responses: {
        organizations: { data: ORG, error: null },
        // 3 parallel queries against `tenants` and `tickets`:
        //   1st tenants — tenant lookup (returns array)
        //   1st tickets — active tickets (returns array)
        //   2nd tickets — eternal memory (maybeSingle, returns object or null)
        tenants: {
          data: [
            { name: 'Anna Schmidt', address: 'Beispielstr. 12', unit: '4', phone: KNOWN_PHONE, phone_secondary: null },
          ],
          error: null,
        },
        tickets: [
          // active tickets
          {
            data: [
              { id: 'tic-1', ticket_code: 'TIC001', issue_summary: 'Heizung defekt', status: 'NEW', category: 'HEATING', contractors: null },
            ],
            error: null,
          },
          // eternal memory — newest non-Unbekannt ticket
          { data: null, error: null },
        ],
      },
    });

    const response = await handleGetCallerContext(makeCtx(KNOWN_PHONE, supabase) as any);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json.results[0].result.isKnown).toBe(true);
    expect(json.results[0].result.contextSource).toBe('tenant');
    expect(json.results[0].result.tenantName).toBe('Anna Schmidt');
    expect(json.results[0].result.address).toEqual({ street: 'Beispielstr. 12', unit: '4' });
    expect(json.results[0].result.activeTickets).toHaveLength(1);
    expect(json.results[0].result.activeTickets[0].ticketCode).toBe('TIC001');
  });

  it('returns isKnown=false when caller has no tenant + no ticket history', async () => {
    const supabase = createMockSupabase({
      responses: {
        organizations: { data: ORG, error: null },
        tenants: { data: [], error: null },
        tickets: [
          { data: [], error: null },           // active tickets — none
          { data: null, error: null },         // eternal memory — none
        ],
      },
    });

    const response = await handleGetCallerContext(makeCtx(UNKNOWN_PHONE, supabase) as any);
    const json = await response.json();

    expect(json.results[0].result.isKnown).toBe(false);
    expect(json.results[0].result.tenantName).toBeNull();
    expect(json.results[0].result.address).toBeNull();
    expect(json.results[0].result.activeTickets).toEqual([]);
  });

  it('legacy get_active_tickets alias returns { tickets: [...] } format', async () => {
    const supabase = createMockSupabase({
      responses: {
        organizations: { data: ORG, error: null },
        tenants: { data: [], error: null },
        tickets: [
          {
            data: [
              { id: 'tic-9', ticket_code: 'TIC009', issue_summary: 'Wasserschaden', status: 'NEW', category: 'PLUMBING', contractors: { name: 'Klempner GmbH' } },
            ],
            error: null,
          },
          { data: null, error: null },
        ],
      },
    });

    const response = await handleGetCallerContext(makeCtx(KNOWN_PHONE, supabase, 'get_active_tickets') as any);
    const json = await response.json();

    // Legacy format: only tickets array, no isKnown/tenantName etc.
    expect(json.results[0].result).toHaveProperty('tickets');
    expect(json.results[0].result).not.toHaveProperty('isKnown');
    expect(json.results[0].result.tickets).toHaveLength(1);
    expect(json.results[0].result.tickets[0]).toEqual({
      id: 'tic-9',
      status: 'NEW',
      category: 'PLUMBING',
      summary: 'Wasserschaden',
      contractor_name: 'Klempner GmbH',
    });
  });
});
