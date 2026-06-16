import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { requireUserWithOrganizationFromRequest } from "@/lib/auth-guard";

export async function POST(req: NextRequest) {
  try {
    // Auth check: Only authenticated admins can send test emails
    const authResult = await requireUserWithOrganizationFromRequest(req);
    if (!authResult.ok || !authResult.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(`[TEST-EMAIL] Request from: ${authResult.email}`);

    // Environment variables
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM;
    const testEmailTo = process.env.TICKETS_EMAIL_TO || authResult.email;

    if (!resendApiKey || !fromEmail) {
      const missing = [];

      if (!resendApiKey) missing.push("RESEND_API_KEY");
      if (!fromEmail) missing.push("RESEND_FROM");

      console.error("[TEST-EMAIL] Missing environment variables:", missing.join(", "));
      return NextResponse.json(
        { error: "Email configuration missing", details: `Fehlend: ${missing.join(", ")}` },
        { status: 500 }
      );
    }

    if (!testEmailTo) {
      console.error("[TEST-EMAIL] No recipient: TICKETS_EMAIL_TO and auth email both empty");
      return NextResponse.json(
        { error: "Keine Empfängeradresse (TICKETS_EMAIL_TO in Vercel setzen?)" },
        { status: 500 }
      );
    }

    const resend = new Resend(resendApiKey);

    // HTML Email Template
    const htmlContent = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Callfolio System-Test</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; border-radius: 8px 8px 0 0; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                ✅ System-Test erfolgreich
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 20px; font-weight: 600;">
                E-Mail-Versand funktioniert!
              </h2>
              
              <p style="margin: 0 0 16px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Diese Test-E-Mail bestätigt, dass der E-Mail-Versand über die neue Domain <strong>callfolio.io</strong> korrekt konfiguriert ist.
              </p>
              
              <div style="background-color: #f9fafb; border-left: 4px solid #667eea; padding: 16px; margin: 24px 0; border-radius: 4px;">
                <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px; font-weight: 600;">
                  📧 Konfiguration:
                </p>
                <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #6b7280; font-size: 14px; line-height: 1.8;">
                  <li><strong>Absender:</strong> ${fromEmail}</li>
                  <li><strong>Antwort-Adresse:</strong> ${testEmailTo}</li>
                  <li><strong>Domain:</strong> callfolio.io</li>
                  <li><strong>Zeitstempel:</strong> ${new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" })}</li>
                </ul>
              </div>
              
              <p style="margin: 24px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                <strong>Nächste Schritte:</strong>
              </p>
              <ol style="margin: 8px 0 0 0; padding-left: 20px; color: #6b7280; font-size: 14px; line-height: 1.8;">
                <li>Prüfe, ob die "Antworten"-Funktion deines E-Mail-Clients die korrekte Reply-To-Adresse verwendet</li>
                <li>Teste einen echten Ticket-Workflow (Anruf → E-Mail)</li>
                <li>Überwache die Vercel-Logs für weitere E-Mail-Sendungen</li>
              </ol>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 30px; border-radius: 0 0 8px 8px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                Automatisch generierte Test-E-Mail von <strong>Callfolio</strong>
              </p>
              <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 12px;">
                Angefordert von: ${authResult.email}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Plain text fallback
    const textContent = `
CALLFOLIO SYSTEM-TEST

✅ E-Mail-Versand funktioniert!

Diese Test-E-Mail bestätigt, dass der E-Mail-Versand über die neue Domain callfolio.io korrekt konfiguriert ist.

KONFIGURATION:
- Absender: ${fromEmail}
- Antwort-Adresse: ${testEmailTo}
- Domain: callfolio.io
- Zeitstempel: ${new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" })}

NÄCHSTE SCHRITTE:
1. Prüfe, ob die "Antworten"-Funktion deines E-Mail-Clients die korrekte Reply-To-Adresse verwendet
2. Teste einen echten Ticket-Workflow (Anruf → E-Mail)
3. Überwache die Vercel-Logs für weitere E-Mail-Sendungen

---
Automatisch generierte Test-E-Mail von Callfolio
Angefordert von: ${authResult.email}
    `;

    // Send email with reply_to
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [testEmailTo],
      reply_to: [testEmailTo], // WICHTIG: Reply-To auf Test-Email setzen
      subject: "✅ Callfolio System-Test: E-Mail-Versand funktioniert",
      html: htmlContent,
      text: textContent,
    });

    if (error) {
      console.error("[TEST-EMAIL] Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email", details: error },
        { status: 500 }
      );
    }

    console.log("[TEST-EMAIL] Email sent successfully:", data);

    return NextResponse.json({
      success: true,
      message: "Test-E-Mail erfolgreich versendet",
      email_id: data?.id,
      sent_to: testEmailTo,
      sent_from: fromEmail,
      reply_to: testEmailTo,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[TEST-EMAIL] Fatal error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
