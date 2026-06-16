import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { Resend } from "resend";

// ============================================================
// CALLFOLIO v5.3 - ASYNC TICKET PROCESSOR
// ============================================================
// Dieser Endpoint wird von einem Supabase Database Webhook
// aufgerufen, sobald ein neues Ticket erstellt wurde.
//
// Workflow:
// 1. Fuzzy Matching gegen tenants-Tabelle
// 2. Ticket mit korrekten Daten aktualisieren
// 3. E-Mail mit sauberen Daten versenden
// ============================================================

function mustEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env: ${key}`);
  return value;
}

const supabase = getSupabaseAdmin();
const resend = new Resend(mustEnv('RESEND_API_KEY'));

/**
 * Normalisiert eine Telefonnummer für den Vergleich:
 * - Entfernt alle Nicht-Ziffern
 * - Entfernt führende Ländervorwahlen (49, 0049, +49)
 * - Entfernt führende 0
 */
function normalizePhone(phone: string | null | undefined): string {
  if (!phone) return '';
  
  // Entferne alle Nicht-Ziffern
  let cleaned = phone.replace(/\D/g, '');
  
  // Entferne führende Ländervorwahl 49 (Deutschland)
  if (cleaned.startsWith('49') && cleaned.length > 10) {
    cleaned = cleaned.substring(2);
  }
  // Entferne führende 0049
  if (cleaned.startsWith('0049')) {
    cleaned = cleaned.substring(4);
  }
  // Entferne führende 0 (nationale Vorwahl)
  if (cleaned.startsWith('0') && cleaned.length > 9) {
    cleaned = cleaned.substring(1);
  }
  
  return cleaned;
}

/**
 * Extrahiert die letzten 10 Ziffern einer Telefonnummer
 */
function getLast10Digits(phone: string | null | undefined): string {
  return normalizePhone(phone).slice(-10);
}

export async function POST(req: Request) {
  // Entry breadcrumb fires BEFORE the auth check so we can prove the endpoint
  // was even reached (handy when a 401 is the symptom — see "diagnostic 401"
  // log below). Host + UA help spot domain mix-ups (e.g. www.callfolio.de
  // hitting an instance with a different VAPI_WEBHOOK_SECRET).
  const host = req.headers.get('host') ?? '<no host>';
  console.log(`[process-new] ▶ ENTRY host=${host} ua="${(req.headers.get('user-agent') ?? '').slice(0, 60)}"`);

  // Validate Supabase webhook secret — requires VAPI_WEBHOOK_SECRET to be set in env
  const webhookSecret = process.env.VAPI_WEBHOOK_SECRET;
  const authHeader = req.headers.get('authorization') ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!webhookSecret || token !== webhookSecret) {
    // Diagnostic 401: name which side is missing/mismatched without leaking the secret itself.
    const reason = !webhookSecret
      ? 'env VAPI_WEBHOOK_SECRET is NOT SET on this host'
      : !token
        ? 'missing/malformed Authorization header'
        : 'token does not match VAPI_WEBHOOK_SECRET';
    console.error(`[process-new] ❌ 401 Unauthorized — ${reason} (host=${host})`);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Supabase Webhook sendet: { type: "INSERT", table: "tickets", record: {...}, old_record: null }
    // Unterstütze beide Formate: Standard-Supabase und Custom
    const ticket_id = body.record?.id || body.ticket_id;

    if (!ticket_id) {
      console.error(`❌ Missing ticket_id in payload:`, JSON.stringify(body));
      return NextResponse.json({ error: "Missing ticket_id or record.id" }, { status: 400 });
    }

    console.log(`🔄 PROCESSING TICKET: ${ticket_id}`);

    // ========================================
    // SCHRITT 1: TICKET LADEN
    // ========================================
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', ticket_id)
      .single();

    if (ticketError || !ticket) {
      console.error(`❌ Ticket not found: ${ticket_id}`);
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    console.log(`📋 TICKET LOADED: ${ticket.ticket_code}`);
    console.log(`   Raw Name: ${ticket.raw_caller_name}`);
    console.log(`   Raw Address: ${ticket.raw_caller_address}`);
    console.log(`   Phone: ${ticket.caller_phone}`);
    console.log(`   Phone (normalized): ${normalizePhone(ticket.caller_phone)}`);

    // ── SMS-Pipeline breadcrumb ────────────────────────────────────────────
    // process-new itself does NOT send the registration SMS — that is the
    // responsibility of submit-ticket.ts (auto-SMS for photo categories) and
    // request-onboarding-link.ts (explicit onboarding link). This log only
    // confirms that the async chain reached this endpoint with a usable phone.
    console.log(`[process-new] Versuche Registrierungs-SMS an ${ticket.caller_phone ?? '∅'} zu senden (Pipeline-Breadcrumb — eigentlicher Versand in submit-ticket/request-onboarding-link).`);

    // ========================================
    // SCHRITT 2: PHONE MATCHING
    // ========================================
    let matchedTenant: any = null;
    let matchType: string = 'NONE';

    // Exakte Telefonnummer-Übereinstimmung — einzige Matching-Strategie.
    if (ticket.caller_phone) {
      const ticketPhoneNormalized = normalizePhone(ticket.caller_phone);
      const ticketLast10 = getLast10Digits(ticket.caller_phone);
      
      console.log(`🔍 PHONE SEARCH: normalized="${ticketPhoneNormalized}" last10="${ticketLast10}"`);
      
      if (ticketLast10.length >= 8) {
        const { data: tenants } = await supabase
          .from('tenants')
          .select('*')
          .eq('organization_id', ticket.organization_id)
          .not('phone', 'is', null);

        if (tenants && tenants.length > 0) {
          console.log(`   Checking ${tenants.length} tenants with phone numbers...`);
          
          for (const tenant of tenants) {
            const tenantPhoneNormalized = normalizePhone(tenant.phone);
            const tenantLast10 = getLast10Digits(tenant.phone);
            
            // Vergleiche sowohl normalisierte als auch Last-10
            if (tenantPhoneNormalized === ticketPhoneNormalized || tenantLast10 === ticketLast10) {
              matchedTenant = tenant;
              matchType = 'PHONE_EXACT';
              console.log(`✅ PHONE MATCH FOUND!`);
              console.log(`   Tenant: ${tenant.name}`);
              console.log(`   Tenant Phone: ${tenant.phone} -> normalized: ${tenantPhoneNormalized}`);
              console.log(`   DB-Name wird verwendet (KI-Transkription ignoriert)`);
              break;
            }
          }
          
          if (!matchedTenant) {
            console.log(`❌ NO PHONE MATCH in ${tenants.length} tenants`);
          }
        } else {
          console.log(`⚠️ No tenants with phone numbers found for org ${ticket.organization_id}`);
        }
      }
    } else {
      console.log(`⚠️ No caller_phone in ticket - skipping phone matching`);
    }


    // ========================================
    // SCHRITT 3: TICKET AKTUALISIEREN
    // ========================================
    const updates: any = {
      match_type: matchType,
      processed_at: new Date().toISOString()
    };

    // Bei PHONE_EXACT: DB-Wahrheit hat absoluten Vorrang über KI-Transkription.
    if (matchedTenant) {
      updates.caller_name = matchedTenant.name;
      updates.address = matchedTenant.address;
      updates.unit = matchedTenant.unit || '';
      updates.caller_phone = matchedTenant.phone;
      updates.matched_tenant_id = matchedTenant.id;
      updates.match_confidence = 1.0;
      updates.requires_manual_review = false;
      console.log(`📝 PHONE_EXACT UPDATE: caller_name="${matchedTenant.name}" address="${matchedTenant.address}"`);
    } else {
      console.log(`📝 NO PHONE MATCH — keeping ticket data as-is`);
    }

    const { error: updateError } = await supabase
      .from('tickets')
      .update(updates)
      .eq('id', ticket_id);

    if (updateError) {
      console.error(`❌ UPDATE FAILED: ${updateError.message}`);
    } else {
      console.log(`✅ TICKET UPDATED with match_type=${matchType}`);
    }

    // ========================================
    // SCHRITT 4: E-MAIL VERSENDEN
    // ========================================
    const { data: org } = await supabase
      .from('organizations')
      .select('name, notification_email')
      .eq('id', ticket.organization_id)
      .single();

    if (org?.notification_email) {
      const finalName = matchedTenant?.name || ticket.raw_caller_name || 'Unbekannt';
      const finalAddress = matchedTenant?.address || ticket.raw_caller_address || '-';
      const finalUnit = matchedTenant?.unit || ticket.unit || '';

      try {
        const categoryEmoji: Record<string, string> = {
          PLUMBING: '💧', HEATING: '🔥', ELECTRICAL: '⚡',
          LOCKSMITH: '🔑', BUILDING: '🏗️', STRUCTURAL: '🏗️',
          NOISE_COMPLAINT: '🔊', ADMIN: '📋', BILLING: '💶',
          COMMERCIAL: '🏪', UTILITIES: '🔌', OTHER: '📌',
        };
        const categoryLabel: Record<string, string> = {
          PLUMBING: 'Sanitär', HEATING: 'Heizung', ELECTRICAL: 'Elektrik',
          LOCKSMITH: 'Schlüsseldienst', BUILDING: 'Gebäude', STRUCTURAL: 'Gebäude',
          NOISE_COMPLAINT: 'Lärm', ADMIN: 'Verwaltung', BILLING: 'Abrechnung',
          COMMERCIAL: 'Gewerbe', UTILITIES: 'Versorgung', OTHER: 'Sonstiges',
        };
        const urgencyMap: Record<string, { label: string; color: string; bg: string }> = {
          EMERGENCY: { label: 'Notfall', color: '#b91c1c', bg: '#fef2f2' },
          HIGH:      { label: 'Hoch',    color: '#c2410c', bg: '#fff7ed' },
          MEDIUM:    { label: 'Mittel',  color: '#92400e', bg: '#fffbeb' },
          LOW:       { label: 'Niedrig', color: '#166534', bg: '#f0fdf4' },
        };
        const urg = urgencyMap[ticket.urgency] ?? urgencyMap.MEDIUM;
        const cat = ticket.category ?? 'OTHER';
        const catEmoji = categoryEmoji[cat] ?? '📌';
        const catLabel = categoryLabel[cat] ?? 'Sonstiges';

        const emailHtml = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Neues Ticket #${ticket.ticket_code}</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:32px 16px;">
    <tr>
      <td align="center">
        <!-- Outer Bezel -->
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#f1f5f9;border:1px solid #e2e8f0;border-radius:24px;padding:8px;">
          <tr>
            <td>
              <!-- Inner Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:18px;box-shadow:inset 0 1px 0 rgba(255,255,255,1);overflow:hidden;">

                <!-- Header -->
                <tr>
                  <td style="padding:32px 36px 24px;border-bottom:1px solid #f1f5f9;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <span style="font-size:22px;font-weight:800;letter-spacing:-0.5px;color:#0f172a;">Callfolio</span>
                          <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#94a3b8;display:block;margin-top:2px;">Support-Ticket System</span>
                        </td>
                        <td align="right" style="vertical-align:top;">
                          <span style="display:inline-block;background-color:#f1f5f9;border:1px solid #e2e8f0;border-radius:100px;padding:6px 14px;font-size:12px;font-weight:700;color:#64748b;letter-spacing:0.5px;">${org.name || 'Hausverwaltung'}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Ticket ID Hero -->
                <tr>
                  <td style="padding:32px 36px 24px;border-bottom:1px solid #f8fafc;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#94a3b8;">Neues Ticket eingegangen</p>
                    <h1 style="margin:0;font-size:42px;font-weight:800;letter-spacing:-2px;color:#0f172a;line-height:1;">#${ticket.ticket_code}</h1>
                    <p style="margin:8px 0 0;font-size:16px;font-weight:600;color:#475569;line-height:1.5;">${ticket.issue_summary}</p>
                  </td>
                </tr>

                <!-- Info Grid -->
                <tr>
                  <td style="padding:24px 36px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f1f5f9;border-radius:14px;overflow:hidden;">
                      <!-- Row 1: Mieter + Telefon -->
                      <tr style="background-color:#fafafa;">
                        <td style="padding:14px 18px;width:50%;border-bottom:1px solid #f1f5f9;border-right:1px solid #f1f5f9;vertical-align:top;">
                          <p style="margin:0 0 3px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#94a3b8;">Mieter</p>
                          <p style="margin:0;font-size:15px;font-weight:700;color:#0f172a;">${finalName}</p>
                        </td>
                        <td style="padding:14px 18px;width:50%;border-bottom:1px solid #f1f5f9;vertical-align:top;">
                          <p style="margin:0 0 3px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#94a3b8;">Telefon</p>
                          <p style="margin:0;font-size:15px;font-weight:700;color:#0f172a;">${ticket.caller_phone || '—'}</p>
                        </td>
                      </tr>
                      <!-- Row 2: Adresse + Einheit -->
                      <tr style="background-color:#ffffff;">
                        <td style="padding:14px 18px;border-bottom:1px solid #f1f5f9;border-right:1px solid #f1f5f9;vertical-align:top;">
                          <p style="margin:0 0 3px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#94a3b8;">Adresse</p>
                          <p style="margin:0;font-size:15px;font-weight:600;color:#334155;">${finalAddress}</p>
                        </td>
                        <td style="padding:14px 18px;border-bottom:1px solid #f1f5f9;vertical-align:top;">
                          <p style="margin:0 0 3px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#94a3b8;">Einheit</p>
                          <p style="margin:0;font-size:15px;font-weight:600;color:#334155;">${finalUnit || '—'}</p>
                        </td>
                      </tr>
                      <!-- Row 3: Kategorie + Dringlichkeit -->
                      <tr style="background-color:#fafafa;">
                        <td style="padding:14px 18px;border-right:1px solid #f1f5f9;vertical-align:middle;">
                          <p style="margin:0 0 3px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#94a3b8;">Kategorie</p>
                          <span style="display:inline-block;padding:4px 12px;border-radius:100px;background-color:#f1f5f9;border:1px solid #e2e8f0;font-size:13px;font-weight:700;color:#475569;">${catEmoji} ${catLabel}</span>
                        </td>
                        <td style="padding:14px 18px;vertical-align:middle;">
                          <p style="margin:0 0 3px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#94a3b8;">Dringlichkeit</p>
                          <span style="display:inline-block;padding:4px 12px;border-radius:100px;background-color:${urg.bg};border:1px solid ${urg.color}33;font-size:13px;font-weight:700;color:${urg.color};">${urg.label}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Problem Box -->
                <tr>
                  <td style="padding:0 36px 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;">
                      <tr>
                        <td style="padding:20px 22px;">
                          <p style="margin:0 0 8px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#94a3b8;">🤖 KI-Zusammenfassung</p>
                          <p style="margin:0;font-size:15px;font-weight:500;color:#334155;line-height:1.65;">${ticket.issue_details || ticket.issue_summary || 'Keine Details verfügbar.'}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>



                <!-- Footer -->
                <tr>
                  <td style="padding:20px 36px;border-top:1px solid #f1f5f9;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <p style="margin:0;font-size:12px;color:#94a3b8;">Anruf-ID: <span style="font-family:monospace;color:#64748b;">${ticket.call_id}</span></p>
                        </td>
                        <td align="right">
                          <p style="margin:0;font-size:12px;color:#94a3b8;">Callfolio KI-Telefonie</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
        const streetOnly = finalAddress !== '-' ? finalAddress.split(',').pop()?.trim() || '' : '';
        const addressSuffix = streetOnly ? ` – ${streetOnly}` : '';
        
        let subjectPrefix = '';
        if (ticket.urgency === 'EMERGENCY') {
          subjectPrefix = `🚨 NOTFALL [${catLabel}]: `;
        } else if (ticket.urgency === 'HIGH') {
          subjectPrefix = `⚠️ WICHTIG [${catLabel}]: `;
        } else {
          subjectPrefix = `🛠️ Neues Ticket [${catLabel}]: `;
        }
        
        const subjectLine = `${subjectPrefix}${ticket.issue_summary}${addressSuffix}`;

        await resend.emails.send({
          from: mustEnv('RESEND_FROM'),
          to: org.notification_email,
          reply_to: [org.notification_email],
          subject: subjectLine,
          html: emailHtml,
        });
        console.log(`📧 EMAIL SENT to ${org.notification_email}`);

        // E-Mail-Status im Ticket vermerken
        await supabase
          .from('tickets')
          .update({ email_sent_at: new Date().toISOString() })
          .eq('id', ticket_id);

      } catch (emailErr: any) {
        console.error(`❌ EMAIL FAILED: ${emailErr.message}`);
        return NextResponse.json({ 
          success: true, 
          ticket_id, 
          match_type: matchType,
          email_sent: false,
          error: emailErr.message 
        });
      }
    } else {
      console.log(`⚠️ NO NOTIFICATION EMAIL configured for org ${ticket.organization_id}`);
    }

    // ========================================
    // SCHRITT 5: ACTIVITY LOG
    // ========================================
    try {
      await supabase.from('ticket_activities').insert({
        ticket_id: ticket_id,
        activity_type: 'processed',
        description: `Ticket verarbeitet: Match-Typ ${matchType}`,
        metadata: { 
          match_type: matchType,
          matched_tenant_id: matchedTenant?.id || null,
          email_sent: true
        }
      });
    } catch (e) {
      // Nicht kritisch
    }

    return NextResponse.json({ 
      success: true, 
      ticket_id, 
      match_type: matchType,
      matched_tenant: matchedTenant?.name || null,
      email_sent: true
    });

  } catch (error: any) {
    console.error(`🔥 PROCESSOR CRASH: ${error.message}`);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
