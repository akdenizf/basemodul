import { defineConfig } from 'vitest/config';
import path from 'node:path';

/**
 * Vitest config for Callfolio.
 *
 * - environment 'node': Node 18+ provides Request/Response globally, which is
 *   what NextResponse.json() builds on. No need for jsdom or edge-runtime VM
 *   since handlers are pure functions that return Response objects.
 * - alias '@/*' mirrors tsconfig so test files can import project modules
 *   with the same path the production code uses.
 * - include pattern keeps the legacy tests/duplicate-prevention.test.ts out of
 *   the suite (it's a scenario doc, not an executable test).
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/vapi/**/*.test.ts'],
    globals: false,
    clearMocks: true,
  },
});
