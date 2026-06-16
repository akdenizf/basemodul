import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { logActivity } from "@/lib/audit-log";
import { Resend } from "resend";
import { sendAppointmentConfirmationSMS } from "@/lib/twilio";
import { getLast10, normalizePhoneNumber } from "@/app/api/vapi/_phone";

// ============================================================
// CALLFOLIO MVP – Public Ticket Update API (Magic Link / Contractor Portal)
// Supports: resolve | confirm | set_appointment
// ============================================================

const resend = new Resend(process.env.RESEND_API_KEY);

async function notifyAdmin(opts: {
    orgId: string;
    subject: string;
    html: string;
    supabase: ReturnType<typeof getSupabaseAdmin>;
}) {
    try {
        // 1. Prefer organizations.notification_email (configurable in Settings)
        let to: string | null | undefined;
        const { data: org } = await opts.supabase
            .from("organizations")
            .select("notification_email")
            .eq("id", opts.orgId)
            .maybeSingle();
        to = org?.notification_email;

        // 2. Fallback: first profile email for this organization
        if (!to) {
            const { data: profile } = await opts.supabase
                .from("profiles")
                .select("email")
                .eq("organization_id", opts.orgId)
                .order("created_at", { ascending: true })
                .limit(1)
                .maybeSingle();
            to = profile?.email;
        }

        if (!to || !process.env.RESEND_API_KEY) return;

        await resend.emails.send({
            from: process.env.RESEND_FROM || "Callfolio <noreply@callfolio.io>",
            to,
            subject: opts.subject,
            html: opts.html,
        });
        console.log(`[PublicAPI] ✅ Notification sent to ${to}`);
    } catch (err) {
        console.warn("[PublicAPI] notifyAdmin failed (non-critical):", err);
    }
}

// ─────────────────────────────────────────────────────────────
// Premium admin-notification renderer (Impeccable design system)
// ─────────────────────────────────────────────────────────────
type AdminEmailKind = 'confirmed' | 'scheduled' | 'completed';

function renderAdminActionEmail(opts: {
    kind: AdminEmailKind;
    ticketLabel: string;
    ticketId: string;
    location: string;
    issueSummary: string | null;
    tenantName: string | null;
    contractorName: string;
    contractorPhone: string | null;
    appointmentDate?: Date;
    orgName: string;
}): string {
    const {
        kind, ticketLabel, ticketId, location, issueSummary,
        tenantName, contractorName, contractorPhone, appointmentDate, orgName,
    } = opts;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://callfolio.vercel.app';
    const supportUrl = `${appUrl}/help`;
    const dashboardUrl = `${appUrl}/admin?ticketId=${ticketId}`;

    // — Status badge (top right) —
    const badge = (() => {
        switch (kind) {
            case 'confirmed':
                return { text: 'Auftrag bestätigt', bg: '#ECFDF5', fg: '#047857', border: '#A7F3D0' };
            case 'scheduled':
                return { text: 'Termin fixiert', bg: '#EFF6FF', fg: '#1D4ED8', border: '#BFDBFE' };
            case 'completed':
                return { text: 'Erledigt', bg: '#ECFDF5', fg: '#047857', border: '#A7F3D0' };
        }
    })();

    // — Hero copy —
    const hero = (() => {
        switch (kind) {
            case 'confirmed':
                return {
                    title: 'Auftrag wurde angenommen.',
                    sub: 'Der Handwerker hat den Auftrag bestätigt. Der Termin wird in Kürze im Portal eingetragen.',
                };
            case 'scheduled':
                return {
                    title: 'Termin steht fest.',
                    sub: 'Der Handwerker hat einen Termin eingetragen. Der Mieter wurde automatisch per SMS informiert.',
                };
            case 'completed':
                return {
                    title: 'Auftrag wurde abgeschlossen.',
                    sub: 'Der Handwerker hat die Ausführung als erledigt gemeldet. Das Ticket steht jetzt auf RESOLVED.',
                };
        }
    })();

    // — Optional date box (scheduled only) —
    const appointmentBox = (() => {
        if (kind !== 'scheduled' || !appointmentDate) return '';
        const day = appointmentDate.toLocaleDateString('de-DE', { day: '2-digit' });
        const month = appointmentDate.toLocaleDateString('de-DE', { month: 'short' }).replace('.', '').toUpperCase();
        const weekday = appointmentDate.toLocaleDateString('de-DE', { weekday: 'long' });
        const time = appointmentDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
        return `
        <tr><td style="padding:24px 28px 0;">
          <div style="border:1px solid #E2E8F0;border-radius:14px;overflow:hidden;background:#FFFFFF;">
            <div style="background:#0F172A;padding:10px 16px;text-align:center;">
              <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:1.6px;color:#19E66F;">${month}</p>
            </div>
            <div style="padding:20px 16px 22px;text-align:center;">
              <p style="margin:0;font-size:52px;font-weight:800;line-height:1;color:#0F172A;letter-spacing:-2px;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">${day}</p>
              <p style="margin:10px 0 0;font-size:13px;font-weight:600;color:#475569;letter-spacing:0.2px;">${weekday} · ${time} Uhr</p>
            </div>
          </div>
        </td></tr>`;
    })();

    // — Contractor phone row —
    const phoneRow = contractorPhone
        ? `<p style="margin:4px 0 0;font-size:13px;color:#475569;"><a href="tel:${contractorPhone}" style="color:#0F172A;text-decoration:none;border-bottom:1px solid #CBD5E1;">${contractorPhone}</a></p>`
        : `<p style="margin:4px 0 0;font-size:13px;color:#94A3B8;">Telefonnummer auf Anfrage</p>`;

    // — Timeline (3 steps) —
    const stepStates: Array<'done' | 'active' | 'pending'> = (() => {
        switch (kind) {
            case 'confirmed': return ['done', 'active', 'pending'];
            case 'scheduled': return ['done', 'done', 'active'];
            case 'completed': return ['done', 'done', 'done'];
        }
    })();
    const stepLabels = ['Bestätigt', 'Termin', 'Erledigt'];

    const renderStep = (label: string, state: 'done' | 'active' | 'pending', idx: number) => {
        const dot = state === 'done'
            ? `<div style="width:32px;height:32px;line-height:32px;border-radius:50%;background:#19E66F;color:#0F172A;font-size:15px;font-weight:800;display:inline-block;">✓</div>`
            : state === 'active'
                ? `<div style="width:32px;height:32px;line-height:30px;border-radius:50%;background:#0F172A;color:#FFFFFF;font-size:13px;font-weight:700;display:inline-block;">${idx + 1}</div>`
                : `<div style="width:32px;height:32px;line-height:28px;border-radius:50%;background:#FFFFFF;color:#94A3B8;font-size:13px;font-weight:700;display:inline-block;border:1px solid #E2E8F0;">${idx + 1}</div>`;
        const textColor = state === 'pending' ? '#94A3B8' : '#0F172A';
        return `
          <td align="center" style="width:33.33%;vertical-align:top;">
            ${dot}
            <p style="margin:8px 0 0;font-size:12px;font-weight:600;color:${textColor};letter-spacing:0.2px;">${label}</p>
          </td>`;
    };

    const connector = (left: 'done' | 'active' | 'pending') => `
          <td style="width:0.5%;vertical-align:top;padding-top:15px;">
            <div style="height:2px;background:${left === 'done' ? '#19E66F' : '#E2E8F0'};"></div>
          </td>`;

    const timelineHtml = `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            ${renderStep(stepLabels[0], stepStates[0], 0)}
            ${connector(stepStates[0])}
            ${renderStep(stepLabels[1], stepStates[1], 1)}
            ${connector(stepStates[1])}
            ${renderStep(stepLabels[2], stepStates[2], 2)}
          </tr>
        </table>`;

    // — Feedback block (completed only) —
    const feedbackBlock = kind === 'completed' ? `
        <tr><td style="padding:0 28px 24px;">
          <div style="border:1px solid #E2E8F0;border-radius:12px;padding:18px;background:#FAFBFC;">
            <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#0F172A;letter-spacing:-0.1px;">Probleme mit der Ausführung?</p>
            <p style="margin:0 0 12px;font-size:13px;color:#475569;line-height:1.55;">
              Falls etwas nicht in Ordnung ist, können Sie das Ticket erneut öffnen oder dem Handwerker direkt Feedback geben.
            </p>
            <p style="margin:0;font-size:13px;">
              <a href="${dashboardUrl}" style="color:#0F172A;text-decoration:none;font-weight:600;border-bottom:1px solid #19E66F;">Ticket im Dashboard öffnen →</a>
            </p>
          </div>
        </td></tr>` : '';

    const escapedIssue = (issueSummary || '–').replace(/\n/g, '<br/>');

    return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <meta name="color-scheme" content="light"/>
  <meta name="supported-color-schemes" content="light"/>
  <title>${badge.text} – Ticket ${ticketLabel}</title>
</head>
<body style="margin:0;padding:0;background-color:#F8FAFC;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#0F172A;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8FAFC;padding:40px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;overflow:hidden;">

        <!-- Header: Brand + Status Badge -->
        <tr><td style="padding:22px 28px;border-bottom:1px solid #F1F5F9;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="vertical-align:middle;">
              <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                <td style="vertical-align:middle;padding-right:8px;">
                  <span style="display:inline-block;width:10px;height:10px;background:#19E66F;border-radius:50%;"></span>
                </td>
                <td style="vertical-align:middle;">
                  <span style="font-size:15px;font-weight:700;color:#0F172A;letter-spacing:-0.2px;">Callfolio</span>
                </td>
              </tr></table>
            </td>
            <td style="vertical-align:middle;text-align:right;">
              <span style="display:inline-block;padding:6px 12px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;background:${badge.bg};color:${badge.fg};border:1px solid ${badge.border};">${badge.text}</span>
            </td>
          </tr></table>
        </td></tr>

        <!-- Hero -->
        <tr><td style="padding:32px 28px 4px;">
          <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#94A3B8;">Ticket ${ticketLabel}</p>
          <h1 style="margin:0;font-size:24px;font-weight:700;color:#0F172A;letter-spacing:-0.5px;line-height:1.25;">${hero.title}</h1>
          <p style="margin:10px 0 0;font-size:14px;color:#475569;line-height:1.6;">${hero.sub}</p>
        </td></tr>

        ${appointmentBox}

        <!-- Ticket Details -->
        <tr><td style="padding:28px 28px 4px;">
          <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#94A3B8;">Auftragsdetails</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E2E8F0;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:14px 16px;border-bottom:1px solid #F1F5F9;vertical-align:top;">
                <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                  <td style="padding-right:12px;font-size:18px;line-height:1;vertical-align:top;width:24px;">🏠</td>
                  <td style="vertical-align:top;">
                    <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.4px;text-transform:uppercase;color:#94A3B8;">Einsatzort</p>
                    <p style="margin:3px 0 0;font-size:14px;font-weight:600;color:#0F172A;">${location}</p>
                  </td>
                </tr></table>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 16px;border-bottom:1px solid #F1F5F9;vertical-align:top;">
                <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                  <td style="padding-right:12px;font-size:18px;line-height:1;vertical-align:top;width:24px;">🛠️</td>
                  <td style="vertical-align:top;">
                    <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.4px;text-transform:uppercase;color:#94A3B8;">Anliegen</p>
                    <p style="margin:3px 0 0;font-size:14px;color:#0F172A;line-height:1.5;">${escapedIssue}</p>
                  </td>
                </tr></table>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 16px;vertical-align:top;">
                <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                  <td style="padding-right:12px;font-size:18px;line-height:1;vertical-align:top;width:24px;">👤</td>
                  <td style="vertical-align:top;">
                    <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.4px;text-transform:uppercase;color:#94A3B8;">Mieter</p>
                    <p style="margin:3px 0 0;font-size:14px;color:#0F172A;">${tenantName || 'Unbekannt'}</p>
                  </td>
                </tr></table>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Contractor focus block -->
        <tr><td style="padding:20px 28px 4px;">
          <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#94A3B8;">Ausführende Firma</p>
          <div style="border:1px solid #E2E8F0;border-radius:12px;padding:16px 18px;background:#FAFBFC;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
              <td style="vertical-align:middle;">
                <p style="margin:0;font-size:16px;font-weight:700;color:#0F172A;letter-spacing:-0.2px;">${contractorName}</p>
                ${phoneRow}
              </td>
              <td style="vertical-align:middle;text-align:right;">
                <span style="display:inline-block;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600;background:#F1F5F9;color:#475569;">Handwerker</span>
              </td>
            </tr></table>
          </div>
        </td></tr>

        <!-- Timeline -->
        <tr><td style="padding:28px 28px 28px;">
          <p style="margin:0 0 16px;font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#94A3B8;">Status</p>
          ${timelineHtml}
        </td></tr>

        ${feedbackBlock}

        <!-- Footer -->
        <tr><td style="padding:22px 28px 26px;border-top:1px solid #F1F5F9;background:#FAFBFC;">
          <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#0F172A;letter-spacing:-0.1px;">${orgName || 'Ihre Hausverwaltung'}</p>
          <p style="margin:0 0 12px;font-size:12px;color:#64748B;line-height:1.55;">
            Automatisch erstellt durch <span style="color:#0F172A;font-weight:600;">Callfolio</span> – Ihr digitaler Assistent.
          </p>
          <p style="margin:0;font-size:12px;">
            <a href="${supportUrl}" style="color:#0F172A;text-decoration:none;border-bottom:1px solid #CBD5E1;">Support kontaktieren</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { ticket_id, action, appointment_date } = body;

        if (!ticket_id || !action) {
            return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
        }

        const supabase = getSupabaseAdmin();

        const { data: ticket, error: ticketError } = await supabase
            .from("tickets")
            .select("id, status, ticket_code, organization_id, issue_summary, address, unit, caller_name, caller_phone, contractor_confirmed_at, contractors(name, phone)")
            .eq("id", ticket_id)
            .single();

        if (ticketError || !ticket) {
            return NextResponse.json({ error: "Ticket nicht gefunden" }, { status: 404 });
        }

        const ticketLabel = `#${ticket.ticket_code || ticket_id.slice(0, 8)}`;
        const location = [ticket.address, ticket.unit].filter(Boolean).join(", ") || "Unbekannter Einsatzort";

        // ── ACTION: confirm (Handwerker bestätigt den Auftrag) ──────────
        if (action === 'confirm') {
            // Atomic guard: only update if not yet confirmed — prevents double-confirmation
            // when multiple contractors receive the same portal link.
            const { data: updated, error } = await supabase
                .from("tickets")
                .update({
                    status: 'IN_PROGRESS',
                    contractor_confirmed_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq("id", ticket_id)
                .is("contractor_confirmed_at", null)
                .select("id")
                .maybeSingle();

            if (error) throw error;

            if (!updated) {
                return NextResponse.json(
                    { error: "Dieser Auftrag wurde bereits von einem anderen Handwerker angenommen." },
                    { status: 409 }
                );
            }

            try {
                await logActivity({
                    ticket_id,
                    admin_email: "contractor-portal@callfolio.io",
                    activity_type: 'contractor_notified',
                    description: "Auftrag durch Handwerker bestätigt",
                    metadata: { source: 'contractor-portal', timestamp: new Date().toISOString() }
                });
            } catch { /* non-critical */ }

            // 📧 Benachrichtigung an Hausverwaltung
            if (ticket.organization_id) {
                const { data: org } = await supabase
                    .from("organizations").select("name").eq("id", ticket.organization_id).maybeSingle();
                const contractor = ticket.contractors as any;
                await notifyAdmin({
                    orgId: ticket.organization_id,
                    subject: `✅ Auftrag bestätigt – Ticket ${ticketLabel}`,
                    html: renderAdminActionEmail({
                        kind: 'confirmed',
                        ticketLabel,
                        ticketId: ticket.id,
                        location,
                        issueSummary: ticket.issue_summary,
                        tenantName: ticket.caller_name,
                        contractorName: contractor?.name || 'Handwerker',
                        contractorPhone: contractor?.phone || null,
                        orgName: org?.name || '',
                    }),
                    supabase,
                });
            }

            return NextResponse.json({ success: true });
        }

        // ── ACTION: set_appointment (Handwerker trägt Termin ein) ────────
        if (action === 'set_appointment') {
            if (!appointment_date) {
                return NextResponse.json({ error: "Kein Datum angegeben" }, { status: 400 });
            }

            const parsedDate = new Date(appointment_date);
            if (isNaN(parsedDate.getTime())) {
                return NextResponse.json({ error: "Ungültiges Datum" }, { status: 400 });
            }

            const { error } = await supabase
                .from("tickets")
                .update({
                    appointment_date: parsedDate.toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq("id", ticket_id);

            if (error) throw error;

            const formattedDate = parsedDate.toLocaleDateString('de-DE', {
                weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });

            try {
                await logActivity({
                    ticket_id: ticket_id,
                    admin_email: "contractor-portal@callfolio.io",
                    activity_type: "updated",
                    description: `Handwerker hat Termin eingetragen: ${formattedDate}`
                });
            } catch { /* non-critical */ }

            const contractor = ticket.contractors as any;
            const orgRow = ticket.organization_id
                ? (await supabase.from("organizations").select("name").eq("id", ticket.organization_id).maybeSingle()).data
                : null;

            // 📱 SMS-Terminbestätigung an Mieter (non-blocking)
            if (ticket.caller_phone && ticket.organization_id) {
                sendAppointmentConfirmationSMS({
                    to: ticket.caller_phone,
                    orgName: orgRow?.name ?? undefined,
                    ticketCode: ticket.ticket_code ?? undefined,
                    appointmentDate: parsedDate.toISOString(),
                    contractorName: contractor?.name ?? undefined,
                    tenantName: ticket.caller_name ?? undefined,
                }).catch(err => console.error("[PublicAPI] appointment SMS failed (non-critical):", err));
            }

            // 📧 Benachrichtigung an Hausverwaltung
            if (ticket.organization_id) {
                await notifyAdmin({
                    orgId: ticket.organization_id,
                    subject: `📅 Termin festgelegt – Ticket ${ticketLabel}`,
                    html: renderAdminActionEmail({
                        kind: 'scheduled',
                        ticketLabel,
                        ticketId: ticket.id,
                        location,
                        issueSummary: ticket.issue_summary,
                        tenantName: ticket.caller_name,
                        contractorName: contractor?.name || 'Handwerker',
                        contractorPhone: contractor?.phone || null,
                        appointmentDate: parsedDate,
                        orgName: orgRow?.name || '',
                    }),
                    supabase,
                });
            }

            return NextResponse.json({ success: true });
        }

        // ── ACTION: resolve (Auftrag erledigt) ──────────────────────────
        if (action === 'resolve') {
            const { error } = await supabase
                .from("tickets")
                .update({ status: 'RESOLVED', updated_at: new Date().toISOString() })
                .eq("id", ticket_id);

            if (error) throw error;

            try {
                await logActivity({
                    ticket_id,
                    admin_email: "contractor-portal@callfolio.io",
                    activity_type: 'status_changed',
                    description: "Auftrag durch Handwerker als erledigt gemeldet",
                    old_value: { status: ticket.status },
                    new_value: { status: 'RESOLVED' },
                    metadata: { source: 'contractor-portal', timestamp: new Date().toISOString() }
                });
            } catch { /* non-critical */ }

            // 📧 Benachrichtigung an Hausverwaltung
            if (ticket.organization_id) {
                const { data: org } = await supabase
                    .from("organizations").select("name").eq("id", ticket.organization_id).maybeSingle();
                const contractor = ticket.contractors as any;
                await notifyAdmin({
                    orgId: ticket.organization_id,
                    subject: `🎉 Auftrag erledigt – Ticket ${ticketLabel}`,
                    html: renderAdminActionEmail({
                        kind: 'completed',
                        ticketLabel,
                        ticketId: ticket.id,
                        location,
                        issueSummary: ticket.issue_summary,
                        tenantName: ticket.caller_name,
                        contractorName: contractor?.name || 'Handwerker',
                        contractorPhone: contractor?.phone || null,
                        orgName: org?.name || '',
                    }),
                    supabase,
                });
            }

            return NextResponse.json({ success: true });
        }

        // ── ACTION: patch_data (Mieter vervollständigt fehlende Daten via SMS-Link) ──
        if (action === 'patch_data') {
            const { caller_name, first_name, last_name, address, street, house_number, zip, city, unit, tenant_note, email } = body;
            const normalizedEmail = typeof email === 'string' && email.trim()
                ? email.trim().toLowerCase()
                : null;

            // ── Name handling ─────────────────────────────────────────────
            // SoT is first_name + last_name from the portal. We construct the
            // full name once and use it everywhere downstream.
            // Backwards-compat: legacy clients (or admin tooling) can still
            // send a single caller_name field. We treat it as a full name and
            // split it heuristically for the master record.
            const trimmedFirst = typeof first_name === 'string' ? first_name.trim() : '';
            const trimmedLast  = typeof last_name  === 'string' ? last_name.trim()  : '';
            let derivedFirst   = trimmedFirst;
            let derivedLast    = trimmedLast;
            let portalFullName = [trimmedFirst, trimmedLast].filter(Boolean).join(' ');

            if (!portalFullName && typeof caller_name === 'string' && caller_name.trim()) {
                portalFullName = caller_name.trim();
                const parts = portalFullName.split(/\s+/);
                derivedFirst = parts[0] ?? '';
                derivedLast  = parts.slice(1).join(' ') ?? '';
            }

            // ── Address handling ──────────────────────────────────────────
            // Discrete fields (street/house_number/zip/city) are the SoT —
            // matches DB v19. We build the legacy concatenation "PLZ Stadt,
            // Straße Nr" for the ticket and the denormalized tenants.address.
            // Backwards-compat: old portal clients sent a single `address` string.
            const trimmedStreet  = typeof street       === 'string' ? street.trim()       : '';
            const trimmedHouseNr = typeof house_number === 'string' ? house_number.trim() : '';
            const trimmedZip     = typeof zip          === 'string' ? zip.trim()          : '';
            const trimmedCity    = typeof city         === 'string' ? city.trim()         : '';
            const zipCity  = (trimmedZip && trimmedCity) ? `${trimmedZip} ${trimmedCity}` : (trimmedCity || trimmedZip);
            const streetNr = (trimmedStreet && trimmedHouseNr) ? `${trimmedStreet} ${trimmedHouseNr}` : trimmedStreet;
            let formattedAddress = [zipCity, streetNr].filter(p => p.trim().length > 0).join(', ');
            if (!formattedAddress && typeof address === 'string' && address.trim()) {
                formattedAddress = address.trim(); // legacy single-field client
            }

            // Build ticket updates from whichever identity fields the tenant supplied.
            const updates: Record<string, string> = { updated_at: new Date().toISOString() };
            if (portalFullName) {
                updates.caller_name = portalFullName;
                // The dashboard (TicketCard) only renders caller_name when match_type
                // is a match value — otherwise it falls back to the phone number.
                // A tenant who completed their identity via the portal IS a verified
                // match, so flip match_type so the name actually shows up.
                updates.match_type = 'MANUAL_MATCH';
            }
            if (formattedAddress) updates.address = formattedAddress;
            if (unit?.trim()) updates.unit = unit.trim();

            // photo-mode submissions may carry ONLY a tenant_note — append it to the
            // ticket's issue_details so the contractor sees it on the dashboard.
            const trimmedNote = tenant_note?.trim() || '';
            if (trimmedNote) {
                const stamp = new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' });
                const noteBlock = `--- Notiz vom Mieter (${stamp}) ---\n${trimmedNote}`;
                const { data: current } = await supabase
                    .from('tickets').select('issue_details').eq('id', ticket_id).maybeSingle();
                const merged = current?.issue_details
                    ? `${current.issue_details}\n\n${noteBlock}`
                    : noteBlock;
                updates.issue_details = merged;
            }

            const updatedFields = Object.keys(updates).filter(k => k !== 'updated_at');
            if (updatedFields.length === 0) {
                return NextResponse.json({ error: "Keine Daten zum Aktualisieren" }, { status: 400 });
            }

            // 1. Update the original ticket
            const { error } = await supabase
                .from("tickets")
                .update(updates)
                .eq("id", ticket_id);

            if (error) throw error;

            // 2. Tenant UPSERT into the master tenants table — runs only when the
            //    tenant supplied a name (identity-recovery flow). Photo-mode submissions
            //    skip this since the tenant already exists in the DB by definition.
            //
            //    Phone is stored in normalized E.164 format so every later lookup
            //    (assistant-request, get_caller_context, submit_ticket) matches reliably.
            //    Errors are surfaced (error level + returned in response) so silent
            //    failures stop hiding behind the upload pipeline.
            const callerPhone = ticket.caller_phone;
            const orgId = ticket.organization_id;
            let tenantResult: 'created' | 'updated' | 'skipped' | 'failed' = 'skipped';
            let tenantError: string | null = null;

            if (callerPhone && orgId && portalFullName) {
                const callerLast10 = getLast10(callerPhone);
                const normalizedPhone = normalizePhoneNumber(callerPhone);

                try {
                    // Find existing tenant for this org by last-10 phone (format-agnostic)
                    const { data: existingTenants, error: lookupErr } = await supabase
                        .from('tenants')
                        .select('id, phone, name, address, unit')
                        .eq('organization_id', orgId)
                        .not('phone', 'is', null);

                    if (lookupErr) throw new Error(`tenant lookup: ${lookupErr.message}`);

                    const existingTenant = existingTenants?.find(
                        (t: any) => getLast10(t.phone) === callerLast10
                    );

                    if (existingTenant) {
                        // Update existing tenant — only set fields the tenant supplied.
                        // registration_source is always set to SMS_PORTAL: a self-service
                        // patch through the portal makes this record portal-managed from
                        // now on, regardless of how it was originally seeded.
                        // first_name/last_name are the SoT; `name` is kept in sync as
                        // a denormalized fallback for legacy reads.
                        const tenantUpdates: Record<string, string | null> = {
                            name: portalFullName,
                            // Always normalize the stored phone so we converge to E.164
                            phone: normalizedPhone,
                            registration_source: 'SMS_PORTAL',
                        };
                        tenantUpdates.first_name = derivedFirst || null;
                        tenantUpdates.last_name  = derivedLast  || null;
                        if (trimmedStreet)  tenantUpdates.street       = trimmedStreet;
                        if (trimmedHouseNr) tenantUpdates.house_number = trimmedHouseNr;
                        if (trimmedZip)     tenantUpdates.zip          = trimmedZip;
                        if (trimmedCity)    tenantUpdates.city         = trimmedCity;
                        if (formattedAddress) tenantUpdates.address = formattedAddress;
                        if (unit?.trim()) tenantUpdates.unit = unit.trim();
                        if (normalizedEmail) tenantUpdates.email = normalizedEmail;

                        const { error: updErr } = await supabase
                            .from('tenants')
                            .update(tenantUpdates)
                            .eq('id', existingTenant.id);
                        if (updErr) throw new Error(`tenant update: ${updErr.message}`);

                        tenantResult = 'updated';
                        console.log(`[patch_data] ✅ Tenant updated: id=${existingTenant.id} first="${derivedFirst}" last="${derivedLast}" phone=${normalizedPhone} email=${normalizedEmail ?? '∅'}`);
                    } else {
                        // Create new tenant — full payload from the portal form.
                        // tenant_id is INTENTIONALLY omitted: v17 migration gave that
                        // legacy NOT NULL column a gen_random_uuid()::text default,
                        // so the DB fills it in for us. Supplying it here would
                        // collide with the org-slug convention and is unnecessary.
                        const { data: newTenant, error: insertErr } = await supabase
                            .from('tenants')
                            .insert({
                                organization_id: orgId,
                                first_name: derivedFirst || null,
                                last_name:  derivedLast  || null,
                                name: portalFullName,
                                phone: normalizedPhone,
                                street: trimmedStreet || null,
                                house_number: trimmedHouseNr || null,
                                zip: trimmedZip || null,
                                city: trimmedCity || null,
                                address: formattedAddress || null,
                                unit: unit?.trim() || null,
                                email: normalizedEmail,
                                registration_source: 'SMS_PORTAL',
                            })
                            .select('id')
                            .single();
                        if (insertErr) throw new Error(`tenant insert: ${insertErr.message}`);

                        tenantResult = 'created';
                        console.log(`[patch_data] ✅ Tenant created: id=${newTenant?.id} first="${derivedFirst}" last="${derivedLast}" phone=${normalizedPhone} email=${normalizedEmail ?? '∅'}`);
                    }
                } catch (tenantErr: any) {
                    tenantResult = 'failed';
                    tenantError = tenantErr.message ?? String(tenantErr);
                    console.error(`[patch_data] ❌ Tenant upsert FAILED: ${tenantError}`);
                }
            }

            // 3. Propagate name + address to ALL other open tickets from the same phone
            //    (best-effort — never blocks the response, but errors logged loudly).
            if (callerPhone && orgId && (portalFullName || formattedAddress || unit?.trim())) {
                try {
                    const propagateUpdates: Record<string, string> = {};
                    if (portalFullName) {
                        propagateUpdates.caller_name = portalFullName;
                        // Same dashboard gating as the current ticket — every open
                        // ticket from this phone must display the verified name.
                        propagateUpdates.match_type = 'MANUAL_MATCH';
                    }
                    if (formattedAddress) propagateUpdates.address = formattedAddress;
                    if (unit?.trim()) propagateUpdates.unit = unit.trim();

                    const last10Pattern = `%${getLast10(callerPhone)}`;
                    const { data: otherTickets, error: propErr } = await supabase
                        .from('tickets')
                        .update({ ...propagateUpdates, updated_at: new Date().toISOString() })
                        .eq('organization_id', orgId)
                        .ilike('caller_phone', last10Pattern)
                        .neq('id', ticket_id)
                        .in('status', ['NEW', 'IN_PROGRESS'])
                        .select('id');

                    if (propErr) {
                        console.error(`[patch_data] ❌ Propagation failed: ${propErr.message}`);
                    } else {
                        console.log(`[patch_data] ✅ Propagated to ${otherTickets?.length ?? 0} other open tickets`);
                    }
                } catch (propErr: any) {
                    console.error(`[patch_data] ❌ Propagation exception: ${propErr.message}`);
                }
            }

            try {
                await logActivity({
                    ticket_id,
                    admin_email: "tenant-portal@callfolio.io",
                    activity_type: 'updated',
                    description: trimmedNote
                        ? "Mieter hat Daten / Notiz via SMS-Link vervollständigt"
                        : "Mieter hat Daten via SMS-Link vervollständigt",
                    metadata: {
                        fields: updatedFields,
                        source: 'upload-portal',
                        tenant_upsert: tenantResult,
                        has_note: trimmedNote.length > 0,
                    },
                });
            } catch { /* non-critical */ }

            return NextResponse.json({
                success: true,
                tenant: tenantResult,
                tenant_error: tenantError,
            });
        }

        return NextResponse.json({ error: "Unbekannte Aktion" }, { status: 400 });

    } catch (error: any) {
        console.error("[PublicAPI] ticket-update error:", error);
        return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
    }
}
