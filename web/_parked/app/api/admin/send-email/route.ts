import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireUserWithOrganizationFromRequest } from "@/lib/auth-guard";
import { Resend } from "resend";
import { logEmailSent, logStatusChange, logContractorNotified } from "@/lib/audit-log";

export const dynamic = 'force-dynamic';

interface SendEmailRequest {
  ticket_id: string;
  recipient_type: 'admin' | 'tenant' | 'contractor';
  recipient_email: string;
  subject: string;
  body: string;
  html_body?: string;
  template_type: string;
  update_status?: boolean;
  new_status?: string;
  contractor_id?: string;
  contractor_name?: string;
  org_name?: string;
}

function mustEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export async function POST(req: NextRequest) {
  // Auth check
  const authResult = await requireUserWithOrganizationFromRequest(req);
  if (!authResult.ok) {
    console.warn('[API] send-email 401:', authResult.error);
    return NextResponse.json({
      error: 'Unauthorized',
      debug: { reason: authResult.error }
    }, { status: authResult.status || 401 });
  }

  const adminEmail = authResult.email || 'system@callfolio.io';

  try {
    const fromEmail = process.env.RESEND_FROM;
    if (!fromEmail) throw new Error("Missing RESEND_FROM in env");

    const supabase = getSupabaseAdmin();
    const resend = new Resend(mustEnv("RESEND_API_KEY"));

    const body: SendEmailRequest = await req.json();
    const {
      ticket_id,
      recipient_type,
      recipient_email,
      subject,
      body: emailBody,
      html_body: emailHtmlBody,
      template_type,
      update_status = false,
      new_status,
      org_name
    } = body;

    if (!ticket_id || !recipient_email || !subject || (!emailBody && !emailHtmlBody)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipient_email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Verify ticket exists
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .select('id, ticket_id, status, caller_name, issue_summary')
      .eq('id', ticket_id)
      .single();

    if (ticketError || !ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const dynamicOrgName = org_name || 'Hausverwaltung';

    // Fetch org logo for email branding
    let orgLogoUrl: string | null = null;
    if (authResult.organization_id) {
      const { data: orgData } = await supabase
        .from('organizations')
        .select('logo_url')
        .eq('id', authResult.organization_id)
        .maybeSingle();
      orgLogoUrl = orgData?.logo_url || null;
    }
    // Format: "OrgName - Ticketsystem <hello@domain.com>"
    // Extract the email part if fromEmail contains "Name <email@domain.com>"
    const baseEmailMatch = fromEmail.match(/<(.+)>/);
    const baseEmail = baseEmailMatch ? baseEmailMatch[1] : fromEmail;
    const dynamicFrom = `${dynamicOrgName} - Ticketsystem <${baseEmail}>`;

    // Send email — prefer HTML, fall back to plain text
    let emailSuccess = false;
    let emailError = null;

    try {
      const emailPayload: any = {
        from: dynamicFrom,
        to: [recipient_email],
        reply_to: [fromEmail],
        subject: subject,
        headers: {
          'X-Ticket-ID': ticket.ticket_id || ticket_id,
          'X-Template-Type': template_type,
          'X-Recipient-Type': recipient_type
        }
      };

      if (emailHtmlBody) {
        // Inject logo directly into the colored email template header
        const logoHeaderHtml = orgLogoUrl
          ? `<div style="margin-bottom:20px;"><img src="${orgLogoUrl}" alt="${dynamicOrgName}" style="max-height:80px;max-width:280px;background-color:#ffffff;padding:12px 24px;border-radius:12px;box-shadow:0 8px 16px -4px rgba(0,0,0,0.15);" /></div>`
          : '';
        emailPayload.html = emailHtmlBody.replace('{{ORG_LOGO_HEADER}}', logoHeaderHtml);
      } else {
        emailPayload.text = emailBody;
      }

      const emailResult = await resend.emails.send(emailPayload);

      if (emailResult.error) {
        emailError = emailResult.error;
        console.error('[API] Resend error:', emailResult.error);
      } else {
        emailSuccess = true;
        console.log('[API] Email sent:', emailResult.data?.id);
      }
    } catch (error) {
      emailError = error;
      console.error('[API] Email send error:', error);
    }

    // Log email activity
    try {
      // Use contractor_notified for contractor assignments, email_sent for others
      if (recipient_type === 'contractor' && body.contractor_id) {
        await logContractorNotified(ticket_id, adminEmail, {
          contractor_id: body.contractor_id,
          contractor_name: body.contractor_name || 'Unbekannt',
          contractor_email: recipient_email,
          success: emailSuccess
        });
      } else {
        await logEmailSent(ticket_id, adminEmail, {
          recipient: recipient_email,
          subject: subject,
          template_type: template_type,
          contractor_name: body.contractor_name,
          success: emailSuccess
        });
      }
    } catch (logError) {
      console.error('[API] Failed to log email activity:', logError);
    }

    // Update ticket status if requested
    console.log(`[API] Status update check: emailSuccess=${emailSuccess}, update_status=${update_status}, new_status=${new_status}, recipient_type=${recipient_type}`);
    if (emailSuccess && update_status && new_status) {
      try {
        const updatePayload: any = { status: new_status, updated_at: new Date().toISOString() };
        // Auto-assign contractor when sending contractor email
        if (recipient_type === 'contractor' && body.contractor_id) {
          updatePayload.contractor_id = body.contractor_id;
        }
        console.log(`[API] Updating ticket ${ticket_id} with payload:`, JSON.stringify(updatePayload));
        const { error: updateError, data: updateData, count } = await supabase
          .from('tickets')
          .update(updatePayload)
          .eq('id', ticket_id)
          .select('id, status');

        if (updateError) {
          console.error('[API] Failed to update ticket status:', updateError);
        } else {
          console.log(`[API] ✅ Ticket status updated successfully. Response:`, JSON.stringify(updateData), `count: ${count}`);
          // Verify the update persisted
          const { data: verify } = await supabase
            .from('tickets')
            .select('id, status')
            .eq('id', ticket_id)
            .single();
          console.log(`[API] 🔍 Verification read: status=${verify?.status}`);

          try {
            await logStatusChange(ticket_id, adminEmail, ticket.status, new_status,
              `Status automatisch geändert nach E-Mail-Versand an ${recipient_email}`
            );
          } catch (logErr) {
            console.warn('[API] logStatusChange failed (non-critical):', logErr);
          }
        }
      } catch (statusError) {
        console.error('[API] Status update error:', statusError);
      }
    } else {
      console.log(`[API] ⚠️ Skipping status update: conditions not met`);
    }

    if (emailSuccess) {
      return NextResponse.json({
        success: true,
        message: "E-Mail erfolgreich gesendet",
        ticket_id: ticket.ticket_id,
        recipient: recipient_email,
        template_type: template_type,
        status_updated: update_status && new_status ? new_status : null
      });
    } else {
      return NextResponse.json({
        error: "E-Mail konnte nicht gesendet werden",
        details: (emailError as any)?.message || "Unbekannter Fehler",
        ticket_id: ticket.ticket_id
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error("[API] send-email error:", error);
    return NextResponse.json({
      error: "Server error",
      message: error?.message || "Unbekannter Serverfehler"
    }, { status: 500 });
  }
}

// GET endpoint to retrieve email templates for a ticket
export async function GET(req: NextRequest) {
  const authResult = await requireUserWithOrganizationFromRequest(req);
  if (!authResult.ok) {
    return NextResponse.json({
      error: 'Unauthorized',
      debug: { reason: authResult.error }
    }, { status: authResult.status || 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const ticketId = searchParams.get('ticket_id');

    if (!ticketId) {
      return NextResponse.json({ error: "Missing ticket_id parameter" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', ticketId)
      .single();

    if (ticketError || !ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      ticket: ticket,
      available_templates: [
        { id: 'admin_notification', name: 'Admin Benachrichtigung', recipient_type: 'admin' },
        { id: 'tenant_confirmation', name: 'Mieter Bestätigung', recipient_type: 'tenant' },
        { id: 'contractor_assignment', name: 'Handwerker Beauftragung', recipient_type: 'contractor' }
      ]
    });
  } catch (error: any) {
    console.error("[API] get email templates error:", error);
    return NextResponse.json({
      error: "Server error",
      message: error?.message || "Unbekannter Serverfehler"
    }, { status: 500 });
  }
}
