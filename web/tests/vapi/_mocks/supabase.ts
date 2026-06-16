/**
 * Supabase admin client mock for handler unit tests.
 *
 * The real client returns a query builder that is both chainable AND awaitable.
 * This mock replicates that surface with two configurable layers:
 *
 *   responses[table]  — what every query on `table` resolves to. If you pass an
 *                       array, the queries on that table consume responses FIFO.
 *   rpc[name]         — what supabase.rpc(name) resolves to.
 *
 * Tests can then inspect `_calls.inserts['tickets']` etc. to assert exactly
 * what payloads went into the DB.
 */
import { vi } from 'vitest';

export type MockResponse = { data: any; error: any | null; count?: number };

export interface MockOptions {
  responses?: Record<string, MockResponse | MockResponse[]>;
  rpc?: Record<string, MockResponse>;
}

interface CallLog {
  inserts: Record<string, any[]>;
  updates: Record<string, any[]>;
  rpc: Record<string, any[]>;
  selects: Record<string, number>;
}

export interface MockSupabase {
  from: ReturnType<typeof vi.fn>;
  rpc: ReturnType<typeof vi.fn>;
  _calls: CallLog;
}

const EMPTY: MockResponse = { data: null, error: null };

export function createMockSupabase(options: MockOptions = {}): MockSupabase {
  const responses = options.responses ?? {};
  const rpcResponses = options.rpc ?? {};
  const queueIdx: Record<string, number> = {};

  const calls: CallLog = {
    inserts: {},
    updates: {},
    rpc: {},
    selects: {},
  };

  function nextResponse(table: string): MockResponse {
    const cfg = responses[table];
    if (cfg === undefined) return EMPTY;
    if (Array.isArray(cfg)) {
      const idx = queueIdx[table] ?? 0;
      queueIdx[table] = idx + 1;
      return cfg[idx] ?? cfg[cfg.length - 1] ?? EMPTY;
    }
    return cfg;
  }

  function makeChain(table: string): any {
    // pendingResponse is set the first time a terminator-relevant op
    // (select/insert/update/delete) is called. This prevents double-consuming
    // a queued response when both insert() AND select()+single() are chained.
    let pendingResponse: MockResponse | null = null;

    const ensureResponse = () => {
      if (pendingResponse === null) pendingResponse = nextResponse(table);
      return pendingResponse;
    };

    const chain: any = {
      select: vi.fn(() => {
        calls.selects[table] = (calls.selects[table] ?? 0) + 1;
        ensureResponse();
        return chain;
      }),
      insert: vi.fn((payload: any) => {
        (calls.inserts[table] ||= []).push(payload);
        ensureResponse();
        return chain;
      }),
      update: vi.fn((payload: any) => {
        (calls.updates[table] ||= []).push(payload);
        ensureResponse();
        return chain;
      }),
      delete: vi.fn(() => {
        ensureResponse();
        return chain;
      }),
      // Filter / ordering chainables — all return self
      eq: vi.fn(() => chain),
      neq: vi.fn(() => chain),
      in: vi.fn(() => chain),
      ilike: vi.fn(() => chain),
      like: vi.fn(() => chain),
      not: vi.fn(() => chain),
      filter: vi.fn(() => chain),
      match: vi.fn(() => chain),
      gte: vi.fn(() => chain),
      gt: vi.fn(() => chain),
      lte: vi.fn(() => chain),
      lt: vi.fn(() => chain),
      is: vi.fn(() => chain),
      order: vi.fn(() => chain),
      limit: vi.fn(() => chain),
      range: vi.fn(() => chain),
      // Terminal methods — return native Promise
      single: vi.fn(() => Promise.resolve(ensureResponse())),
      maybeSingle: vi.fn(() => Promise.resolve(ensureResponse())),
      // Thenable: `await query` without an explicit terminator
      then: (onfulfilled: any, onrejected?: any) =>
        Promise.resolve(ensureResponse()).then(onfulfilled, onrejected),
    };
    return chain;
  }

  return {
    from: vi.fn((table: string) => makeChain(table)),
    rpc: vi.fn((name: string, args: any) => {
      (calls.rpc[name] ||= []).push(args);
      return Promise.resolve(rpcResponses[name] ?? EMPTY);
    }),
    _calls: calls,
  };
}
