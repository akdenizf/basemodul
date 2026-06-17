// ============================================================
// AGENTEQ — Twilio SMS Integration
// ============================================================

import Twilio from 'twilio';

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_MESSAGING_SERVICE_SID = process.env.TWILIO_MESSAGING_SERVICE_SID;

// Canonical app domain for upload + portal pages.
const UPLOAD_BASE_URL = process.env.NEXT_PUBLIC_UPLOAD_BASE_URL || 'https://agenteq.de';
// Short-link base for SMS (keeps payloads under 160 chars). /t/[id] → /upload/[id]
const SHORT_BASE_URL = process.env.NEXT_PUBLIC_SHORT_BASE_URL || 'https://agenteq.de';

export interface SMSOptions {
  to: string;
  orgName?: string;
  ticketCode?: string;
  link?: string;
}

export interface SendSMSResult {
  success: boolean;
  messageSid?: string;
  error?: string;
  code?: number;
}

export function isTwilioConfigured(): boolean {
  return !!(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_MESSAGING_SERVICE_SID);
}

// Internal: validates config + phone, then sends via Twilio Messaging Service.
async function _sendViaTwilio(to: string, body: string): Promise<SendSMSResult> {
  if (!isTwilioConfigured()) {
    console.error('[SMS] Missing Twilio credentials. Check TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_MESSAGING_SERVICE_SID.');
    return { success: false, error: 'Twilio credentials not configured' };
  }

  if (!to || !to.startsWith('+')) {
    console.error(`[SMS] Invalid phone number format: "${to}". Must be E.164 format (+49...).`);
    return { success: false, error: 'Invalid phone number format' };
  }

  try {
    const client = Twilio(TWILIO_ACCOUNT_SID!, TWILIO_AUTH_TOKEN!);
    const message = await client.messages.create({
      to,
      messagingServiceSid: TWILIO_MESSAGING_SERVICE_SID!,
      body,
    });
    console.log(`[SMS] ✅ Sent to ${to} | SID: ${message.sid}`);
    return { success: true, messageSid: message.sid };
  } catch (error: any) {
    const errMsg = error?.message || error?.toString?.() || 'Unknown Twilio error';
    const errCode = error?.code ?? error?.status;
    console.error(`[SMS] ❌ Exception sending to ${to}: ${errMsg}${errCode ? ` (code: ${errCode})` : ''}`);
    return { success: false, error: errMsg, code: errCode };
  }
}

// Categories where a generic "Problem" upload is appropriate (not damage-specific)
const GENERIC_UPLOAD_CATEGORIES = ['BUILDING', 'ADMIN', 'OTHER'];

export interface PhotoSMSContext extends Pick<SMSOptions, 'orgName' | 'ticketCode'> {
  isKnown?: boolean;
  tenantName?: string | null;
}

/**
 * Sends a conditional SMS to the caller:
 * - Template A (mode=register): unknown caller → asks for name + address first, photo optional.
 * - Template B (mode=photo):   known caller   → skips identity, asks only for damage photo.
 * Both templates are kept under 160 characters per SMS segment.
 */
export async function sendPhotoRequestSMS(
  to: string,
  ticketId: string,
  _category?: string,
  context?: PhotoSMSContext
): Promise<SendSMSResult> {
  const org = context?.orgName || 'Ihrem Betrieb';
  const isKnown = context?.isKnown ?? false;
  const tenantName = context?.tenantName?.trim() || null;
  // Prefer the short numeric ticket_code (e.g. "708066") over the full UUID to
  // keep the SMS payload under 160 chars. The /t/ redirect resolves either.
  const shortId = context?.ticketCode ?? ticketId;
  const baseUrl = `${SHORT_BASE_URL}/t/${shortId}`;

  let body: string;

  if (!isKnown) {
    // ── Template A: Registration mode ────────────────────────────────────────
    // Caller is unregistered. Ask them to confirm identity first.
    // URL appends ?mode=register so the portal shows identity fields prominently.
    const portalUrl = `${baseUrl}?mode=register`;
    body = [
      `Herzlich willkommen! Damit wir Ihr Anliegen korrekt zuordnen können,`,
      `bestätigen Sie bitte kurz Ihren Namen und Ihre Adresse:`,
      portalUrl,
      `Sie können dort auch optional ein Foto des Problems hochladen.`,
    ].join('\n');
  } else {
    // ── Template B: Service mode ──────────────────────────────────────────────
    // Caller is already identified. Jump straight to photo upload.
    const greeting = tenantName ? `Hallo ${tenantName},` : 'Hallo,';
    const portalUrl = `${baseUrl}?mode=photo`;
    body = [
      `${greeting} Ihr Anliegen wurde aufgenommen.`,
      `Damit unser Fachbetrieb direkt das richtige Material mitbringen kann,`,
      `laden Sie bitte hier ein kurzes Foto des Schadens hoch:`,
      portalUrl,
    ].join('\n');
  }

  console.log(
    `[SMS] Sending ${isKnown ? 'Template-B (photo)' : 'Template-A (register)'} to ${to} | ticket=${ticketId}`
  );
  return _sendViaTwilio(to, body);
}

/**
 * Sends a new service order notification SMS to a contractor.
 * Tone: Professional B2B — sachlich, handlungsorientiert.
 */
export async function sendContractorAssignmentSMS(opts: SMSOptions): Promise<SendSMSResult> {
  const org = opts.orgName || 'AGENTEQ-Kunde';
  const ref = opts.ticketCode ? `#${opts.ticketCode}` : 'neuer Auftrag';
  const portalLink = opts.link || UPLOAD_BASE_URL;

  const body = [
    `Guten Tag,`,
    `im Auftrag der ${org} liegt ein neuer Service-Auftrag (${ref}) für Sie vor.`,
    ``,
    `Details & Terminbestätigung:`,
    portalLink,
    ``,
    `Bitte bestätigen Sie den Erhalt kurzfristig über das Portal.`,
    `Ihr AGENTEQ-System.`,
  ].join('\n');

  console.log(`[SMS] Sending contractor assignment to ${opts.to} | ref=${ref}`);
  return _sendViaTwilio(opts.to, body);
}

/**
 * Sends an appointment confirmation SMS to the caller.
 * Triggered when the contractor sets an appointment date via the portal.
 * Tone: Premium concierge — förmlich, verbindlich.
 */
export async function sendAppointmentConfirmationSMS(opts: {
  to: string;
  orgName?: string;
  ticketCode?: string;
  appointmentDate: string;
  contractorName?: string;
  tenantName?: string;
}): Promise<SendSMSResult> {
  const org = opts.orgName || 'Ihrem Betrieb';
  const ref = opts.ticketCode ? `#${opts.ticketCode}` : 'Ihrem Anliegen';
  const contractor = opts.contractorName?.trim() || 'Ihr zuständiger Fachbetrieb';

  const date = new Date(opts.appointmentDate);
  const formatted = new Intl.DateTimeFormat('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Berlin',
  }).format(date);

  const greeting = opts.tenantName ? `Hallo ${opts.tenantName},` : `Guten Tag,`;

  const body = [
    greeting,
    `für Ihr Anliegen ${ref} bei ${org} wurde soeben der Termin bestätigt.`,
    ``,
    `Die Firma ${contractor} wird am ${formatted} Uhr bei Ihnen vor Ort sein.`,
    ``,
    `Ihr AGENTEQ-Team.`,
  ].join('\n');

  console.log(`[SMS] Sending appointment confirmation to ${opts.to} | ref=${ref} | date=${opts.appointmentDate}`);
  return _sendViaTwilio(opts.to, body);
}

/**
 * Sends a completion notification SMS to the caller.
 * Tone: Warm, reassuring — Abschluss-Kommunikation.
 */
export async function sendCompletionSMS(
  to: string,
  context?: Pick<SMSOptions, 'orgName' | 'ticketCode'> & { tenantName?: string }
): Promise<SendSMSResult> {
  const org = context?.orgName || 'Ihrem Betrieb';
  const ref = context?.ticketCode ? ` (Referenz #${context.ticketCode})` : '';

  const greeting = context?.tenantName ? `Hallo ${context.tenantName},` : `Guten Tag,`;

  const body = [
    greeting,
    `Ihr Anliegen bei der ${org}${ref} wurde erfolgreich abgeschlossen.`,
    ``,
    `Vielen Dank für Ihre Geduld. Ihr Team der ${org}.`,
  ].join('\n');

  console.log(`[SMS] Sending completion notice to ${to} | ref=${context?.ticketCode ?? 'n/a'}`);
  return _sendViaTwilio(to, body);
}
