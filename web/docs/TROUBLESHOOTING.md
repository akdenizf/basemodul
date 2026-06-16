# Callfolio Troubleshooting Guide (v5.4)

This guide helps resolve common technical issues encountered during development or production.

## 1. Authentication Issues

### Symptom: "401 Unauthorized" on API requests
- **Cause 1: Missing Cookies**: Ensure you are accessing the app via `www.callfolio.io`. Cookies are origin-bound.
- **Cause 2: Expired Session**: Log out and log back in to refresh the Supabase session.
- **Cause 3: Middleware Redirect**: If you are on a preview domain (e.g., `*.vercel.app`), the middleware might not be passing cookies correctly to the API. Use the canonical domain.
- **Debug**: Check the server logs. Callfolio logs detailed cookie information for 401 errors: `[Auth] Request auth check: { hasBearer: false, totalCookies: X, sbCookies: [...] }`.

---

## 2. Vapi & Webhook Issues

### Symptom: Calls are not creating tickets
- **Cause 1: Webhook Secret Mismatch**: Verify that `VAPI_WEBHOOK_SECRET` in Vercel matches the `x-vapi-secret` header in the Vapi dashboard.
- **Cause 2: Database Webhook Failure**: Check Supabase Dashboard -> Database -> Webhooks -> History. If the `process-new` webhook fails, the ticket will be created but not processed (no matching, no email).
- **Cause 3: Vapi Tool Configuration**: Ensure the `submit_ticket` tool is correctly named and its parameters match the expected schema in `app/api/vapi/webhook/route.ts`.

---

## 3. Matching & Data Issues

### Symptom: Ticket shows "0% Match" or "UNKNOWN" incorrectly
- **Cause 1: Missing Tenant Data**: Ensure tenants are imported with correct phone numbers in E.164 format (e.g., `+49123456789`).
- **Cause 2: RPC `match_tenant` missing**: Ensure the `v4-rpc-function.sql` migration has been applied to Supabase.
- **Cause 3: Address Normalization**: If fuzzy matching fails, check if the `canonical_address` in the `tenants` table is populated.

---

## 4. Email Issues

### Symptom: Emails are not being sent
- **Cause 1: Resend API Key**: Verify `RESEND_API_KEY` is valid and not expired.
- **Cause 2: Domain Verification**: Ensure the domain in `RESEND_FROM` is verified in your Resend dashboard.
- **Cause 3: Notification Email missing**: Check if the organization has a `notification_email` set in the `organizations` table.

---

## 5. Development Errors

### Symptom: "Multiple GoTrueClient instances" warning
- **Fix**: Always use the singleton getters:
  - Frontend: `getSupabaseBrowserClient()` from `@/lib/supabase/client`
  - Backend (Admin): `getSupabaseAdmin()` from `@/lib/supabase/admin`
  - Backend (SSR): `createClient()` from `@/lib/supabase/server`

### Symptom: Build error regarding `next/headers` in Client Components
- **Fix**: Ensure you are not importing `lib/supabase/server.ts` in a client component. Use `lib/supabase/admin.ts` for service-role operations instead, as it is isolated from Next.js server-only headers.
