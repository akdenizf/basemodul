# Callfolio Deployment Guide (v5.4)

This guide covers the steps required to deploy and configure a production instance of Callfolio on `www.callfolio.io`.

## 1. Prerequisites

- **Supabase Account**: For database, authentication, and edge functions.
- **Vercel Account**: For hosting the Next.js application.
- **Vapi Account**: For the AI voice assistant.
- **Resend Account**: For sending emails.
- **Twilio Account**: For the phone number (connected to Vapi).

---

## 2. Environment Variables

Configure the following variables in your Vercel project settings:

### Supabase
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key.
- `SUPABASE_URL`: Same as `NEXT_PUBLIC_SUPABASE_URL`.
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (keep this secret!).

### Vapi Integration
- `VAPI_WEBHOOK_SECRET`: A secure string used to authenticate webhooks from Vapi (`x-vapi-secret`).

### Email (Resend)
- `RESEND_API_KEY`: Your Resend API key.
- `RESEND_FROM`: The email address emails will be sent from (e.g., `noreply@callfolio.io`).
- `NEXT_PUBLIC_ADMIN_EMAIL`: Default recipient for administrative notifications.

### App Configuration
- `NEXT_PUBLIC_APP_URL`: The canonical URL of your deployment (e.g., `https://www.callfolio.io`).

---

## 3. Database Setup (Supabase)

1. **Run Migrations**: Execute the SQL scripts in the `database/` folder in order:
   - `enhanced-schema.sql`
   - `v4-rpc-function.sql` (for fuzzy matching)
   - `v5-audit-log.sql`
   - `STABILIZATION_MIGRATION.sql`
2. **Enable Extensions**: Ensure `uuid-ossp` and `pg_trgm` are enabled.
3. **Configure Webhook**:
   - In Supabase Dashboard, go to **Database** -> **Webhooks**.
   - Create a new webhook for the `tickets` table on `INSERT`.
   - Set the URL to `https://www.callfolio.io/api/tickets/process-new`.
   - Add an `Authorization` header with your service role key or a custom secret if implemented.

---

## 4. Vapi Configuration

1. **Assistant Setup**: Create a new assistant in Vapi.
2. **System Prompt**: Use the content from `docs/vapi-system-prompt-v5.md`.
3. **Tools**: Configure the `submit_ticket` and `end_call` tools as defined in `docs/vapi-tools-enhanced.json`.
4. **Webhook**:
   - Set the Webhook URL to `https://www.callfolio.io/api/vapi/webhook`.
   - Add a custom header: `x-vapi-secret` with the value of your `VAPI_WEBHOOK_SECRET`.

---

## 5. Domain & Middleware

Callfolio enforces a canonical domain for security and cookie integrity.
- Ensure your Vercel project is linked to `www.callfolio.io`.
- The `middleware.ts` will automatically redirect any traffic from other domains (like `.de` or Vercel preview URLs) to the canonical domain for protected routes.

---

## 6. Verification

After deployment, verify the following:
1. **Login**: Can you log in at `/login`?
2. **Call Test**: Does a call to your Vapi number create a ticket in the dashboard?
3. **Email Test**: Does the "Action Bridge" in the dashboard successfully send emails via Resend?
4. **Import Test**: Can you upload a sample CSV in the "Mieterstamm" section?
