import type { Ticket, MatchType, TicketUrgency } from '@/lib/types';

export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  recipient_type: 'admin' | 'tenant' | 'contractor';
  generate: (ticket: Ticket, orgName?: string) => { subject: string; body: string };
  /** Optional: generate rich HTML version (with photo URLs) */
  generateHtml?: (ticket: Ticket, photoUrls?: string[], orgName?: string) => { subject: string; html: string };
}

/**
 * Generate urgency text in German
 */
function getUrgencyText(urgency: string): string {
  switch (urgency) {
    case 'EMERGENCY': return 'Notfall';
    case 'URGENT': return 'Dringend';
    case 'HIGH': return 'Hoch';
    case 'MEDIUM': return 'Mittel';
    case 'LOW': return 'Niedrig';
    default: return urgency;
  }
}

/**
 * Generate category text in German
 */
function getCategoryText(category: string): string {
  switch (category) {
    case 'PLUMBING': return 'Sanitär';
    case 'HEATING': return 'Heizung';
    case 'ELECTRICAL': return 'Elektrik';
    case 'BUILDING': return 'Gebäude';
    case 'ADMIN': return 'Verwaltung';
    case 'COMMERCIAL': return 'Kaufmännisch';
    case 'BILLING': return 'Abrechnung';
    case 'UTILITIES': return 'Nebenkosten';
    case 'NOISE_COMPLAINT': return 'Ruhestörung';
    case 'OTHER': return 'Sonstiges';
    default: return category;
  }
}

/**
 * Generate expected resolution time based on urgency
 */
function getExpectedResolutionTime(urgency: string): string {
  switch (urgency) {
    case 'EMERGENCY': return 'Sofort (Notfall)';
    case 'HIGH': return 'Innerhalb von 24 Stunden';
    case 'MEDIUM': return 'Innerhalb von 2-3 Werktagen';
    case 'LOW': return 'Innerhalb einer Woche';
    default: return 'Wird zeitnah bearbeitet';
  }
}

/**
 * Generate status badge for Outlook filtering
 */
function getStatusBadge(matchType: MatchType | undefined): string {
  switch (matchType) {
    case 'MATCH':
      return '[✅ VERIFIZIERT]';
    case 'REVIEW':
      return '[🟡 PRÜFUNG]';
    default:
      return '[❓ UNBEKANNT]';
  }
}

/**
 * Generate priority badge for Outlook filtering
 */
function getPriorityBadge(urgency: TicketUrgency | undefined): string {
  switch (urgency) {
    case 'EMERGENCY':
      return '[🔥 NOTFALL]';
    case 'HIGH':
      return '[🔴 HOCH]';
    case 'MEDIUM':
      return '[🟡 MITTEL]';
    case 'LOW':
      return '[🟢 NIEDRIG]';
    default:
      return '[⚪ UNBEKANNT]';
  }
}

/**
 * Admin notification template - internal notification for property management
 */
export const adminNotificationTemplate: EmailTemplate = {
  id: 'admin_notification',
  name: 'Admin Benachrichtigung',
  description: 'Interne Benachrichtigung für die Verwaltung',
  recipient_type: 'admin',
  generate: (ticket: Ticket, orgName?: string) => {
    const statusBadge = getStatusBadge(ticket.match_type);
    const priorityBadge = getPriorityBadge(ticket.urgency);
    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://callfolio.vercel.app'}/admin?ticketId=${ticket.id}`;

    return {
      subject: `${statusBadge} ${priorityBadge} Ticket #${ticket.ticket_code || 'N/A'} | ${getCategoryText(ticket.category || 'OTHER')} - ${ticket.caller_name || 'Unbekannt'}`,
      body: `Hallo Admin,

ein neues Ticket ist eingegangen.

---
📋 WICHTIGSTE INFORMATIONEN
---
Ticket-Code:   ${ticket.ticket_code || 'N/A'}
Status:        ${ticket.status || 'NEW'}
Dringlichkeit: ${getUrgencyText(ticket.urgency || 'LOW')}
Kategorie:     ${getCategoryText(ticket.category || 'OTHER')}
Mieter:        ${ticket.caller_name || 'Unbekannt'}
Adresse:       ${ticket.address || 'Unbekannt'}${ticket.unit ? `, Einheit: ${ticket.unit}` : ''}
Telefon:       ${ticket.caller_phone || 'Keine Nummer'}

---
🔗 AKTION ERFORDERLICH
---
Ticket im Dashboard öffnen: ${dashboardUrl}

---
🧠 KI-ZUSAMMENFASSUNG DES PROBLEMS
---
${ticket.issue_summary || 'Keine Zusammenfassung'}
${ticket.issue_details ? `\nDetails: ${ticket.issue_details}` : ''}

${ticket.raw_caller_name || ticket.raw_caller_address ? `---
🎤 ORIGINAL-TRANSKRIPT (zur Prüfung)
---
Anrufer sagte Name:    ${ticket.raw_caller_name || 'N/A'}
Anrufer sagte Adresse: ${ticket.raw_caller_address || 'N/A'}
` : ''}
${ticket.escalation_is_emergency ? `---
🚨 NOTFALL-HINWEIS
---
${ticket.escalation_reason || 'Automatische Notfall-Erkennung'}
` : ''}
---
Ticketsystem Voice Intelligence • Generiert am ${new Date().toLocaleString('de-DE')}`
    };
  }
};

/**
 * Tenant confirmation template - confirmation for the tenant about ticket creation
 */
export const tenantConfirmationTemplate: EmailTemplate = {
  id: 'tenant_confirmation',
  name: 'Mieter Bestätigung',
  description: 'Bestätigung für den Mieter über die Ticketerfassung',
  recipient_type: 'tenant',

  // ── Plain-text fallback ──────────────────────────────────────
  generate: (ticket: Ticket, orgName?: string) => ({
    subject: `Ihre Meldung wurde erfasst - Ticket ${ticket.ticket_code || 'N/A'}`,
    body: `Keine Sorge, ${ticket.caller_name || 'lieber Mieter'}, wir haben alles aufgenommen.

Vielen Dank für Ihre Meldung über unser automatisches Telefonsystem. Wir haben Ihr Anliegen erfasst und werden uns schnellstmöglich darum kümmern.

📋 IHRE MELDUNG IM ÜBERBLICK:
Ticket-Nummer: #${ticket.ticket_code}
Status: In Bearbeitung
Rückmeldung: Innerhalb von 24h
Zusammenfassung: ${ticket.issue_summary} an ${ticket.address || 'Ihrer Adresse'} ${ticket.unit || ''}

${ticket.escalation_is_emergency ? `🚨 NOTFALL: Ihr Anliegen wurde als Notfall eingestuft und wird mit höchster Priorität bearbeitet.\n\n` : ''}Lehnen Sie sich zurück – wir melden uns, sobald es Neuigkeiten gibt oder ein Handwerker beauftragt wurde.

Mit freundlichen Grüßen
Ihre Hausverwaltung${orgName ? ` ${orgName}` : ''}

---
Ticket erstellt: ${new Date().toLocaleString('de-DE')}
Diese E-Mail wurde automatisch generiert.`
  }),

  // ── Premium HTML "Chill-Layout" with green branding ──────────
  generateHtml: (ticket: Ticket, photoUrls?: string[], orgName?: string) => {
    const isEmergency = ticket.escalation_is_emergency;

    const html = `<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"></head>
<body style="margin:0;padding:0;background-color:#F8FAFC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8FAFC;padding:40px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#FFFFFF;border-radius:24px;overflow:hidden;box-shadow:0 10px 40px -10px rgba(0,0,0,0.08);border:1px solid #F1F5F9;">

        <!-- Header -->
        <tr><td style="padding:40px 32px 24px;text-align:center;">
          <h1 style="margin:0;font-size:24px;font-weight:800;color:#0F172A;letter-spacing:-0.5px;">${orgName || 'Ticketsystem'}</h1>
        </td></tr>

        ${isEmergency ? `
        <!-- Emergency Banner -->
        <tr><td style="padding:0;">
          <div style="background-color:#FEF2F2;border-bottom:2px solid #DC2626;padding:12px 32px;text-align:center;">
            <p style="margin:0;font-size:14px;font-weight:700;color:#DC2626;">🚨 Ihr Anliegen wurde als Notfall eingestuft und priorisiert.</p>
          </div>
        </td></tr>` : ''}

        <!-- Hero Copy -->
        <tr><td style="padding:16px 40px 24px;text-align:center;">
          <h2 style="margin:0 0 12px;font-size:20px;font-weight:700;color:#1E293B;line-height:1.4;">
            Keine Sorge, ${ticket.caller_name ? ticket.caller_name.split(' ')[0] : 'lieber Mieter'},<br/>wir haben alles aufgenommen.
          </h2>
          <p style="margin:0;font-size:15px;color:#64748B;line-height:1.6;">
            Wir haben Ihr Anliegen erfolgreich erfasst und unser Team kümmert sich bereits darum. Sie müssen sich um nichts weiter kümmern.
          </p>
        </td></tr>

        <!-- Status Box -->
        <tr><td style="padding:0 32px 32px;">
          <div style="background-color:#F8FAFC;border-radius:16px;border:1px solid #E2E8F0;padding:24px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-bottom:16px;font-size:13px;font-weight:600;color:#64748B;width:40%;">Ticket-ID</td>
                <td style="padding-bottom:16px;font-size:14px;font-weight:700;color:#10B981;">#${ticket.ticket_code || '---'}</td>
              </tr>
              <tr>
                <td style="padding-bottom:16px;font-size:13px;font-weight:600;color:#64748B;">Status</td>
                <td style="padding-bottom:16px;font-size:14px;font-weight:600;color:#1E293B;">
                  <span style="display:inline-block;width:8px;height:8px;background-color:#10B981;border-radius:50%;margin-right:6px;"></span>
                  In Bearbeitung
                </td>
              </tr>
              <tr>
                <td style="padding-bottom:16px;font-size:13px;font-weight:600;color:#64748B;">Zusammenfassung</td>
                <td style="padding-bottom:16px;font-size:14px;color:#334155;line-height:1.5;">
                  ${ticket.issue_summary}<br/>
                  <span style="color:#94A3B8;font-size:13px;">📍 ${ticket.address || 'Ihre Adresse'}</span>
                </td>
              </tr>
              <tr>
                <td style="font-size:13px;font-weight:600;color:#64748B;">Rückmeldung</td>
                <td style="font-size:14px;font-weight:600;color:#1E293B;">Innerhalb von 24h</td>
              </tr>
            </table>
          </div>
        </td></tr>

        <!-- Peace of Mind Timeline -->
        <tr><td style="padding:0 32px 40px;">
          <h3 style="margin:0 0 24px;font-size:14px;font-weight:700;color:#1E293B;text-align:center;text-transform:uppercase;letter-spacing:1px;">Der weitere Ablauf</h3>
          
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <!-- Step 1: DONE -->
              <td align="center" style="width:33.3%;vertical-align:top;">
                <div style="background-color:#D1FAE5;width:32px;height:32px;border-radius:50%;line-height:32px;display:inline-block;margin-bottom:12px;color:#10B981;font-weight:bold;font-size:16px;">
                  ✓
                </div>
                <div style="font-size:13px;color:#10B981;font-weight:700;">Aufnahme</div>
              </td>
              <!-- Divider -->
              
              <!-- Step 2: IN PROGRESS -->
              <td align="center" style="width:33.3%;vertical-align:top;">
                <div style="background-color:#FFFFFF;width:28px;height:28px;border-radius:50%;line-height:28px;display:inline-block;margin-bottom:12px;color:#64748B;font-weight:bold;font-size:13px;border:2px solid #E2E8F0;">
                  2
                </div>
                <div style="font-size:13px;color:#64748B;font-weight:600;">Prüfung</div>
              </td>
              
              <!-- Step 3: PENDING -->
              <td align="center" style="width:33.3%;vertical-align:top;">
                <div style="background-color:#FFFFFF;width:28px;height:28px;border-radius:50%;line-height:28px;display:inline-block;margin-bottom:12px;color:#94A3B8;font-weight:bold;font-size:13px;border:2px solid #F1F5F9;">
                  3
                </div>
                <div style="font-size:13px;color:#94A3B8;font-weight:500;">Beauftragung</div>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Footer Note -->
        <tr><td style="background-color:#F8FAFC;padding:32px;text-align:center;border-top:1px solid #F1F5F9;">
          <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#334155;">
            Lehnen Sie sich zurück – wir melden uns, sobald es Neuigkeiten gibt oder ein Handwerker beauftragt wurde.
          </p>
          <p style="margin:0;font-size:12px;color:#94A3B8;">Ihre Hausverwaltung${orgName ? ` ${orgName}` : ''}</p>
        </td></tr>

      </table>
      
      <!-- Real Footer -->
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td style="padding:24px 0;text-align:center;">
            <p style="margin:0;font-size:12px;color:#94A3B8;">Automatische Eingangsbestätigung · ${new Date().toLocaleString('de-DE')}</p>
        </td></tr>
      </table>
      
    </td></tr>
  </table>
</body>
</html>`;

    return {
      subject: `Ihre Meldung wurde erfasst – Ticket #${ticket.ticket_code || 'N/A'}`,
      html
    };
  }
};

/**
 * Contractor assignment template - assignment to a craftsperson or service provider
 * Now includes a premium HTML variant with photo embedding.
 */
export const contractorAssignmentTemplate: EmailTemplate = {
  id: 'contractor_assignment',
  name: 'Handwerker Beauftragung',
  description: 'Auftrag an einen Handwerker oder Dienstleister',
  recipient_type: 'contractor',

  // ── Plain-text fallback (unchanged) ──────────────────────────
  generate: (ticket: Ticket, orgName?: string) => ({
    subject: `${ticket.escalation_is_emergency ? '🚨 EILAUFTRAG: ' : ''}${getCategoryText(ticket.category || 'OTHER')} - Ticket ${ticket.ticket_code || 'N/A'}`,
    body: `Guten Tag,

hiermit beauftragen wir Sie mit folgendem ${ticket.escalation_is_emergency ? 'EILAUFTRAG' : 'Auftrag'}:

📋 AUFTRAGSDATEN:
Ticket: ${ticket.ticket_code}
Kategorie: ${getCategoryText(ticket.category || 'OTHER')}
Dringlichkeit: ${getUrgencyText(ticket.urgency || 'LOW')}
${ticket.escalation_is_emergency ? 'NOTFALL: Sofortige Bearbeitung erforderlich!' : ''}

📍 EINSATZORT:
${ticket.address || 'Adresse wird nachgereicht'}, ${ticket.unit || ''}

👤 ANSPRECHPARTNER VOR ORT:
Name: ${ticket.caller_name || 'Wird mitgeteilt'}
Telefon: ${ticket.caller_phone || 'Wird mitgeteilt'}

🔧 PROBLEMBESCHREIBUNG:
${ticket.issue_summary}
${ticket.issue_details ? `\nDetaillierte Beschreibung: ${ticket.issue_details}` : ''}

${ticket.escalation_reason ? `⚠️ Besondere Hinweise: ${ticket.escalation_reason}\n` : ''}

⏱️ AUSFÜHRUNGSFRIST:
${ticket.escalation_is_emergency ?
        '🚨 SOFORT - Bitte umgehend kontaktieren und binnen 2 Stunden vor Ort sein!' :
        getExpectedResolutionTime(ticket.urgency || 'LOW')
      }

📋 NÄCHSTE SCHRITTE:
1. Bitte bestätigen Sie den Erhalt dieses Auftrags
2. Teilen Sie uns den voraussichtlichen Ausführungstermin mit
3. Kontaktieren Sie bei Rückfragen den Ansprechpartner vor Ort
4. Melden Sie die Fertigstellung zurück

💰 ABRECHNUNG:
Die Abrechnung erfolgt nach unseren vereinbarten Konditionen.
Bitte verwenden Sie die Ticket-Nummer ${ticket.ticket_code} in allen Belegen.

Mit freundlichen Grüßen
Ihre Hausverwaltung${orgName ? ` ${orgName}` : ''}

---
Auftrag erstellt: ${new Date().toLocaleString('de-DE')}
System: Ticketsystem
Ticket-ID: ${ticket.ticket_id}

Bei technischen Fragen zu diesem Auftrag wenden Sie sich bitte an:
E-Mail: ${process.env.ADMIN_EMAIL}
Ticket-Code: ${ticket.ticket_code}`
  }),

  // ── Premium HTML version with photo embedding ────────────────
  generateHtml: (ticket: Ticket, photoUrls?: string[], orgName?: string) => {
    const isEmergency = ticket.escalation_is_emergency;
    const category = getCategoryText(ticket.category || 'OTHER');
    const urgency = getUrgencyText(ticket.urgency || 'LOW');
    const resolution = isEmergency
      ? 'SOFORT – Bitte umgehend vor Ort!'
      : getExpectedResolutionTime(ticket.urgency || 'LOW');

    const urgencyColor = (() => {
      switch (ticket.urgency) {
        case 'EMERGENCY': return '#DC2626';
        case 'HIGH': return '#EA580C';
        case 'MEDIUM': return '#D97706';
        case 'LOW': return '#16A34A';
        default: return '#6B7280';
      }
    })();

    const photosHtml = photoUrls && photoUrls.length > 0
      ? `
        <tr><td style="padding:24px 32px 8px;">
          <h2 style="margin:0 0 16px;font-size:16px;font-weight:700;color:#1E293B;">📸 Fotos vom Mieter</h2>
          ${photoUrls.map(url => `
            <div style="margin-bottom:16px;border-radius:12px;overflow:hidden;border:1px solid #E2E8F0;">
              <img src="${url}" alt="Schadensfoto" style="display:block;width:100%;max-width:100%;height:auto;" />
            </div>
          `).join('')}
        </td></tr>`
      : '';

    const html = `<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"></head>
<body style="margin:0;padding:0;background-color:#F1F5F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F1F5F9;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">

        <!-- Header -->
        <tr><td style="padding:40px 32px 24px;text-align:center;border-bottom:1px solid #F1F5F9;">
          {{ORG_LOGO_HEADER}}
          <h1 style="margin:0 0 4px;font-size:22px;font-weight:800;color:#0F172A;letter-spacing:-0.3px;">${orgName || 'Ticketsystem'}</h1>
          <p style="margin:0;font-size:13px;color:#64748B;font-weight:500;">Reparaturauftrag</p>
        </td></tr>

        ${isEmergency ? `
        <!-- Emergency Banner -->
        <tr><td style="padding:0;">
          <div style="background-color:#FEF2F2;border-bottom:2px solid #DC2626;padding:12px 32px;text-align:center;">
            <p style="margin:0;font-size:14px;font-weight:700;color:#DC2626;">🚨 EILAUFTRAG – Sofortige Bearbeitung erforderlich!</p>
          </div>
        </td></tr>` : ''}

        <!-- Ticket Info Bar -->
        <tr><td style="padding:24px 32px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:12px 16px;background-color:#F8FAFC;border-radius:10px;border:1px solid #E2E8F0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
                  <td style="font-size:13px;color:#64748B;">Ticket</td>
                  <td style="font-size:13px;color:#64748B;text-align:center;">Kategorie</td>
                  <td style="font-size:13px;color:#64748B;text-align:right;">Dringlichkeit</td>
                </tr><tr>
                  <td style="font-size:15px;font-weight:700;color:#1E293B;padding-top:4px;">${ticket.ticket_code || '—'}</td>
                  <td style="font-size:15px;font-weight:700;color:#1E293B;padding-top:4px;text-align:center;">${category}</td>
                  <td style="padding-top:4px;text-align:right;">
                    <span style="display:inline-block;padding:3px 10px;border-radius:6px;font-size:12px;font-weight:700;color:#FFFFFF;background-color:${urgencyColor};">${urgency}</span>
                  </td>
                </tr></table>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Location & Contact -->
        <tr><td style="padding:24px 32px 0;">
          <h2 style="margin:0 0 12px;font-size:16px;font-weight:700;color:#1E293B;">📍 Einsatzort & Ansprechpartner</h2>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E2E8F0;border-radius:10px;overflow:hidden;">
            <tr>
              <td style="padding:14px 16px;border-bottom:1px solid #F1F5F9;width:140px;font-size:13px;font-weight:600;color:#64748B;background-color:#F8FAFC;">Adresse</td>
              <td style="padding:14px 16px;border-bottom:1px solid #F1F5F9;font-size:14px;color:#1E293B;font-weight:600;">${ticket.address || 'Wird nachgereicht'}${ticket.unit ? `, ${ticket.unit}` : ''}</td>
            </tr>
            <tr>
              <td style="padding:14px 16px;border-bottom:1px solid #F1F5F9;font-size:13px;font-weight:600;color:#64748B;background-color:#F8FAFC;">Mieter</td>
              <td style="padding:14px 16px;border-bottom:1px solid #F1F5F9;font-size:14px;color:#1E293B;">${ticket.caller_name || 'Wird mitgeteilt'}</td>
            </tr>
            <tr>
              <td style="padding:14px 16px;font-size:13px;font-weight:600;color:#64748B;background-color:#F8FAFC;">Telefon</td>
              <td style="padding:14px 16px;font-size:14px;color:#1E293B;">
                ${ticket.caller_phone
        ? `<a href="tel:${ticket.caller_phone}" style="color:#4F46E5;text-decoration:none;font-weight:600;">${ticket.caller_phone}</a>`
        : 'Wird mitgeteilt'}
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Damage Description -->
        <tr><td style="padding:24px 32px 0;">
          <h2 style="margin:0 0 12px;font-size:16px;font-weight:700;color:#1E293B;">🔧 Schadensbeschreibung</h2>
          <div style="padding:16px;background-color:#F8FAFC;border-radius:10px;border:1px solid #E2E8F0;">
            <p style="margin:0 0 8px;font-size:15px;font-weight:700;color:#1E293B;">${ticket.issue_summary || 'Keine Zusammenfassung'}</p>
            ${ticket.issue_details ? `<p style="margin:0;font-size:13px;line-height:1.6;color:#475569;">${ticket.issue_details.replace(/\n/g, '<br />')}</p>` : ''}
          </div>
          ${ticket.escalation_reason ? `
          <div style="margin-top:12px;padding:12px 16px;background-color:#FEF2F2;border-radius:8px;border:1px solid #FECACA;">
            <p style="margin:0;font-size:13px;color:#991B1B;"><strong>⚠️ Besondere Hinweise:</strong> ${ticket.escalation_reason}</p>
          </div>` : ''}
        </td></tr>

        <!-- Photos -->
        ${photosHtml}

        <!-- Deadline -->
        <tr><td style="padding:24px 32px 0;">
          <h2 style="margin:0 0 12px;font-size:16px;font-weight:700;color:#1E293B;">⏱️ Ausführungsfrist</h2>
          <div style="padding:14px 16px;background-color:${isEmergency ? '#FEF2F2' : '#F0FDF4'};border-radius:10px;border:1px solid ${isEmergency ? '#FECACA' : '#BBF7D0'};">
            <p style="margin:0;font-size:14px;font-weight:700;color:${isEmergency ? '#991B1B' : '#166534'};">${resolution}</p>
          </div>
        </td></tr>

        <!-- Next Steps -->
        <tr><td style="padding:24px 32px;">
          <h2 style="margin:0 0 12px;font-size:16px;font-weight:700;color:#1E293B;">📋 Nächste Schritte</h2>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${['Bestätigen Sie den Erhalt dieses Auftrags', 'Teilen Sie den voraussichtlichen Termin mit', 'Kontaktieren Sie den Ansprechpartner vor Ort', 'Melden Sie die Fertigstellung zurück'].map((step, i) => `
            <tr>
              <td style="padding:6px 0;vertical-align:top;width:28px;">
                <div style="width:22px;height:22px;border-radius:50%;background-color:#4F46E5;color:#FFFFFF;font-size:11px;font-weight:700;text-align:center;line-height:22px;">${i + 1}</div>
              </td>
              <td style="padding:6px 0 6px 8px;font-size:13px;color:#334155;">${step}</td>
            </tr>`).join('')}
          </table>
        </td></tr>

        <!-- Magic Link CTA -->
        <tr><td style="padding:0 32px 32px;text-align:center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://callfolio.io'}/order/${ticket.id}" 
             style="display:inline-block;background-color:#10B981;color:#FFFFFF;padding:22px 56px;border-radius:14px;text-decoration:none;font-weight:800;font-size:16px;letter-spacing:0.5px;box-shadow:0 10px 20px -4px rgba(16,185,129,0.35);">
            ZUM AUFTRAGS-PORTAL
          </a>
          <p style="margin:16px 0 0;font-size:12px;color:#64748B;">
            Klicken Sie auf den Button, um den Auftrag zu bestätigen oder den Status zu aktualisieren.
          </p>
        </td></tr>

        <!-- Billing Note -->
        <tr><td style="padding:0 32px 24px;">
          <div style="padding:14px 16px;background-color:#F8FAFC;border-radius:10px;border:1px solid #E2E8F0;">
            <p style="margin:0;font-size:12px;color:#64748B;">
              💰 Die Abrechnung erfolgt nach vereinbarten Konditionen. Bitte verwenden Sie die Ticket-Nr. <strong style="color:#1E293B;">${ticket.ticket_code}</strong> in allen Belegen.
            </p>
          </div>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background-color:#F8FAFC;padding:24px 32px;border-top:1px solid #E2E8F0;text-align:center;">
          <p style="margin:0 0 4px;font-size:12px;color:#94A3B8;">Gesendet via Ticketsystem · ${new Date().toLocaleString('de-DE')}</p>
          <p style="margin:0;font-size:11px;color:#CBD5E1;">Bei Rückfragen antworten Sie direkt auf diese E-Mail.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    return {
      subject: `${isEmergency ? '🚨 EILAUFTRAG: ' : 'Reparaturauftrag: '}${category} – ${ticket.address || 'Adresse offen'} – Ticket #${ticket.ticket_code || 'N/A'}`,
      html,
    };
  },
};

/**
 * Follow-up template for status updates
 */
export const statusUpdateTemplate: EmailTemplate = {
  id: 'status_update',
  name: 'Status Update',
  description: 'Benachrichtigung über Statusänderungen',
  recipient_type: 'tenant',
  generate: (ticket: Ticket, orgName?: string) => ({
    subject: `Update zu Ihrem Ticket ${ticket.ticket_code || 'N/A'} - ${ticket.issue_summary}`,
    body: `Hallo ${ticket.caller_name || 'Mieter/in'},

wir möchten Sie über den aktuellen Stand Ihres Tickets informieren:

📋 TICKET-INFORMATION:
Nummer: ${ticket.ticket_code}
Problem: ${ticket.issue_summary}
Aktueller Status: ${ticket.status || 'In Bearbeitung'}

📍 ADRESSE:
${ticket.address || 'Ihre Adresse'}, ${ticket.unit || ''}

📅 LETZTES UPDATE:
${new Date().toLocaleString('de-DE')}

${ticket.status === 'IN_PROGRESS' ?
        '🔧 Ihr Anliegen wird derzeit bearbeitet. Wir halten Sie über weitere Entwicklungen auf dem Laufenden.' :
        ticket.status === 'RESOLVED' ?
          '✅ Ihr Anliegen wurde erfolgreich bearbeitet. Falls Sie weitere Fragen haben, können Sie sich gerne bei uns melden.' :
          '📋 Wir arbeiten an Ihrem Anliegen und werden Sie über weitere Schritte informieren.'
      }

Bei Fragen können Sie uns jederzeit unter der Ticket-Nummer ${ticket.ticket_code} kontaktieren.

Mit freundlichen Grüßen
Ihre Hausverwaltung${orgName ? ` ${orgName}` : ''}

---
Diese E-Mail wurde automatisch generiert.`
  })
};

/**
 * Emergency escalation template
 */
export const emergencyEscalationTemplate: EmailTemplate = {
  id: 'emergency_escalation',
  name: 'Notfall Eskalation',
  description: 'Sofortige Benachrichtigung bei Notfällen',
  recipient_type: 'admin',
  generate: (ticket: Ticket, orgName?: string) => ({
    subject: `🚨 NOTFALL - Sofortige Bearbeitung erforderlich - Ticket ${ticket.ticket_code || 'N/A'}`,
    body: `🚨 NOTFALL-MELDUNG 🚨

Ein Ticket wurde automatisch als Notfall eingestuft und erfordert SOFORTIGE Bearbeitung:

📋 NOTFALL-DETAILS:
Ticket: ${ticket.ticket_code} (${ticket.ticket_id})
Problem: ${ticket.issue_summary}
Kategorie: ${getCategoryText(ticket.category || 'OTHER')}

👤 BETROFFENE PERSON:
Name: ${ticket.caller_name || 'Unbekannt'}
Telefon: ${ticket.caller_phone || 'Keine Nummer'}
Adresse: ${ticket.address || 'Unbekannt'}, ${ticket.unit || ''}

🔧 PROBLEMBESCHREIBUNG:
${ticket.issue_summary}
${ticket.issue_details ? `Details: ${ticket.issue_details}` : ''}

⚠️ ESKALATIONSGRUND:
${ticket.escalation_reason || 'Automatische Notfall-Erkennung durch Keywords'}

⏱️ EINGEGANGEN:
${new Date().toLocaleString('de-DE')}

🎯 SOFORT-MASSNAHMEN ERFORDERLICH:
1. Betroffene Person umgehend kontaktieren
2. Geeigneten Notdienst beauftragen
3. Ggf. Sicherheitsmaßnahmen einleiten
4. Ticket-Status auf "ASSIGNED" setzen

---
WICHTIG: Diese Meldung wurde automatisch generiert.
Bei lebensbedrohlichen Situationen wurde der Anrufer bereits an die 112 verwiesen.

System: Emergency Protocol
Call-ID: ${ticket.call_id || 'Unbekannt'}`
  })
};

/**
 * Get all available email templates
 */
export const emailTemplates: EmailTemplate[] = [
  adminNotificationTemplate,
  tenantConfirmationTemplate,
  contractorAssignmentTemplate,
  statusUpdateTemplate,
  emergencyEscalationTemplate
];

/**
 * Get template by ID
 */
export function getTemplateById(id: string): EmailTemplate | undefined {
  return emailTemplates.find(template => template.id === id);
}

/**
 * Get templates by recipient type
 */
export function getTemplatesByRecipientType(recipientType: 'admin' | 'tenant' | 'contractor'): EmailTemplate[] {
  return emailTemplates.filter(template => template.recipient_type === recipientType);
}

/**
 * Generate email content for a specific template and ticket
 */
export function generateEmailContent(templateId: string, ticket: Ticket, orgName?: string): { subject: string; body: string } | null {
  const template = getTemplateById(templateId);
  if (!template) {
    return null;
  }

  return template.generate(ticket, orgName);
}