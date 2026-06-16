import { Resend } from "resend";

// Helper function to ensure environment variables are present
function mustEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    // Log the error but don't throw, to prevent cascading failures in the alert system itself.
    console.error(`ERROR: Missing required environment variable: ${name}`);
    return `MISSING_ENV_${name}`; // Return a placeholder
  }
  return v;
}

// Function to safely stringify objects, handling circular references
function safeJsonStringify(obj: any): string {
  try {
    const cache = new Set();
    return JSON.stringify(
      obj,
      (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (cache.has(value)) {
            // Circular reference found, discard key
            return;
          }
          // Store value in our collection
          cache.add(value);
        }
        return value;
      },
      2 // Indent for readability
    );
  } catch (e) {
    return `[UNABLE TO STRINGIFY: ${e instanceof Error ? e.message : String(e)}]`;
  }
}

/**
 * Sends a critical system error alert to the admin email.
 * This function should *not* throw errors itself.
 *
 * @param error The error object (can be any type)
 * @param context A string describing where the error occurred (e.g., "Vapi Webhook Processing")
 * @param payload Any relevant data that led to the error (e.g., request body)
 */
export async function sendAdminAlert(error: any, context: string, payload: any): Promise<void> {
  const adminEmail = mustEnv("ADMIN_EMAIL");
  const resendApiKey = mustEnv("RESEND_API_KEY");
  const fromEmail = process.env.RESEND_FROM;

  // Always log to console for Vercel/server logs
  console.error(`🚨 SYSTEM ERROR (${context}):`, error, `Payload:`, payload);

  // Only attempt to send email if we have credentials
  if (adminEmail === `MISSING_ENV_ADMIN_EMAIL` || resendApiKey === `MISSING_ENV_RESEND_API_KEY` || !fromEmail) {
    console.warn(`Skipping admin email alert due to missing environment variables.`);
    return;
  }

  try {
    const resend = new Resend(resendApiKey);

    const errorDetails = error instanceof Error ? `${error.message}\nStack: ${error.stack}` : String(error);

    const emailBody = `
Hallo Admin,

ein kritischer Systemfehler ist in Callfolio aufgetreten.

---
**Kontext:** ${context}
---
**Fehlermeldung:**
${errorDetails}
---
**Payload (Daten, die zum Fehler führten):**
${safeJsonStringify(payload)}
---

Bitte überprüfe die Logs für weitere Details.

Automatisch generierte Nachricht von Callfolio.
`;

    await resend.emails.send({
      from: fromEmail,
      to: [adminEmail],
      reply_to: [adminEmail], // Reply-To auf Admin-Email setzen
      subject: `🚨 SYSTEM ERROR: ${context}`,
      text: emailBody,
    });

    console.log(`Admin alert email successfully sent for context: ${context}`);
  } catch (emailError) {
    // Log any errors during email sending, but do not re-throw
    console.error(`🚨 FAILED TO SEND ADMIN ALERT EMAIL:`, emailError);
  }
}