import { describe, it, expect } from 'vitest';
import { handleAssistantRequest } from '@/app/api/vapi/_handlers/assistant-request';
import { createMockSupabase } from './_mocks/supabase';

const ORG = { id: 'org-1', name: 'Hausverwaltung Beispiel', slug: 'beispiel' };
const KNOWN_PHONE = '+491701234567';

describe('handleAssistantRequest', () => {
  it('greets a registered tenant by name and address', async () => {
    const supabase = createMockSupabase({
      responses: {
        organizations: { data: ORG, error: null },
        tenants: {
          data: [
            {
              name: 'Anna Schmidt',
              address: 'Beispielstr. 12',
              unit: '4',
              phone: KNOWN_PHONE,
              organization_id: 'org-1',
            },
          ],
          error: null,
        },
      },
    });

    const message = {
      type: 'assistant-request',
      call: {
        customer: { number: KNOWN_PHONE },
        phoneNumberId: 'vapi-phone-1',
      },
    };

    const response = await handleAssistantRequest({
      message,
      body: {},
      supabase: supabase as any,
    });

    expect(response.status).toBe(200);
    const json = await response.json();

    expect(json.assistant.firstMessage).toContain('Anna Schmidt');
    expect(json.assistant.firstMessage).toContain('Beispielstr. 12');
    expect(json.assistant.firstMessage).toContain('Hausverwaltung Beispiel');
    expect(json.assistant.variableValues).toEqual({
      name: 'Anna Schmidt',
      address: 'Beispielstr. 12',
      unit: '4',
      org_name: 'Hausverwaltung Beispiel',
      caller_phone: KNOWN_PHONE,
    });
  });

  it('returns generic greeting when caller is not in the tenants table', async () => {
    const supabase = createMockSupabase({
      responses: {
        organizations: { data: ORG, error: null },
        tenants: { data: [], error: null },
      },
    });

    const message = {
      type: 'assistant-request',
      call: {
        customer: { number: '+491709999999' },
        phoneNumberId: 'vapi-phone-1',
      },
    };

    const response = await handleAssistantRequest({
      message,
      body: {},
      supabase: supabase as any,
    });

    const json = await response.json();

    expect(json.assistant.firstMessage).toContain('digitale KI-Assistent');
    expect(json.assistant.firstMessage).toContain('Hausverwaltung Beispiel');
    expect(json.assistant.firstMessage).not.toContain('Anna');
    expect(json.assistant.variableValues.name).toBe('');
    expect(json.assistant.variableValues.address).toBe('');
    expect(json.assistant.variableValues.org_name).toBe('Hausverwaltung Beispiel');
  });

  it('falls back to "Ihrer Hausverwaltung" when no organization is found', async () => {
    const supabase = createMockSupabase({
      responses: {
        organizations: { data: null, error: null },
        tenants: { data: [], error: null },
      },
    });

    const message = {
      type: 'assistant-request',
      call: {
        customer: { number: '+491709999999' },
        phoneNumberId: 'vapi-phone-unknown',
      },
    };

    const response = await handleAssistantRequest({
      message,
      body: {},
      supabase: supabase as any,
    });

    const json = await response.json();
    expect(json.assistant.variableValues.org_name).toBe('Ihrer Hausverwaltung');
  });
});
