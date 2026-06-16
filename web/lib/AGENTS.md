# Callfolio v5.4 – Lib Contract (Fractal Context Pattern)

## Strategic Guardrail (v5.4 Quality Freeze)
**SCOPE CHECK**: The system is in a **Quality Freeze**. No new utilities or features.
- **Allowed**: Critical bugfixes, documentation, and performance tuning of existing v5.4 logic.
- **Question**: "Is this change essential for the stability of v5.4?"
- **If NO**: Defer.
- **If YES**: Proceed with strict typing and singleton integrity.

## Supabase Client Architecture (v5.4)
- **Browser Client (`lib/supabase/client.ts`)**: `getSupabaseBrowserClient()` (Singleton)
- **Admin Client (`lib/supabase/admin.ts`)**: `getSupabaseAdmin()` (Service Role, Singleton)
- **SSR Client (`lib/supabase/server.ts`)**: `createClient()` (Server Components) or `createClientFromRequest(req)` (API Routes)
- **Typed Access**: All queries must use interfaces from `lib/types.ts`
- **Security**: Admin client is separated from `server.ts` to avoid `next/headers` build errors in client components.

## V5.4 Visual Context (`lib/twilio.ts`)
- **sendPhotoRequestSMS(to, ticketId):** Sends SMS with upload link. Requires `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_MESSAGING_SERVICE_SID`.
- **isTwilioConfigured():** Returns true if Twilio env vars are set.

## V5.1 Onboarding Engine (`lib/import-utils.ts`)
- **canonical_address**: Always generate a canonical key for address matching.
- **E.164**: Strict phone normalization for all tenant imports.
