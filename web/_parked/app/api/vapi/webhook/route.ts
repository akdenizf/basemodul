import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { handleAssistantRequest } from "../_handlers/assistant-request";
import { handleCallEnded } from "../_handlers/call-ended";
import { handleEndCall } from "../_handlers/end-call";
import { handleGetCallerContext } from "../_handlers/get-caller-context";
import { handleAddTicketNote } from "../_handlers/add-ticket-note";
import { handleRequestOnboardingLink } from "../_handlers/request-onboarding-link";
import { handleSubmitTicket } from "../_handlers/submit-ticket";

// ============================================================
// CALLFOLIO v5.4 - ASYNC ARCHITECTURE VAPI WEBHOOK
// ============================================================
// Thin router. All handler logic lives in app/api/vapi/_handlers/.
// Responsibilities here:
//  - Verify x-vapi-secret
//  - Parse body + derive requestOrigin
//  - Dispatch to the correct handler by message.type / tool functionName
//  - Translate any uncaught exception into a valid Vapi response so the
//    agent never hangs the call.
// ============================================================

const supabase = getSupabaseAdmin();

export async function POST(req: Request) {
  // Derive origin from the incoming request so internal fetches hit the same host.
  // UPLOAD_BASE_URL may point to a different domain (e.g. callfolio.de vs callfolio.io).
  const requestOrigin = new URL(req.url).origin;

  // Verify Vapi webhook secret to reject unauthenticated callers
  const webhookSecret = process.env.VAPI_WEBHOOK_SECRET;
  if (webhookSecret && req.headers.get('x-vapi-secret') !== webhookSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const message = body.message || body;

    console.log(`📨 VAPI [${message.type}]`);

    const messageCtx = { message, body, supabase };

    // ── System events ───────────────────────────────────────────────────
    if (message.type === 'assistant-request') {
      return handleAssistantRequest(messageCtx);
    }
    if (message.type === 'call-ended') {
      return handleCallEnded(messageCtx);
    }

    // ── Tool calls ──────────────────────────────────────────────────────
    if (message.type !== 'tool-calls' && message.type !== 'function-call') {
      return NextResponse.json({ message: "OK" });
    }

    const toolCall = message.toolCalls?.[0] || message.functionCall;
    if (!toolCall) return NextResponse.json({ message: "OK" });

    const functionName: string = toolCall.function?.name ?? '';
    const toolCallId: string = toolCall.id ?? '';

    let args: any = {};
    try {
      args = typeof toolCall.function?.arguments === 'string'
        ? JSON.parse(toolCall.function.arguments)
        : (toolCall.function?.arguments || {});
    } catch { /* ignore */ }

    console.log(`🔧 TOOL: ${functionName}`);

    const toolCtx = { ...messageCtx, toolCallId, args, functionName, requestOrigin };

    switch (functionName) {
      case 'end_call':
      case 'end_call_tool':
        return handleEndCall(toolCtx);
      case 'get_caller_context':
      case 'get_active_tickets':
        return handleGetCallerContext(toolCtx);
      case 'add_ticket_note':
        return handleAddTicketNote(toolCtx);
      case 'request_onboarding_link':
        return handleRequestOnboardingLink(toolCtx);
      case 'submit_ticket':
        return handleSubmitTicket(toolCtx);
      default:
        // Unbekanntes Tool
        return NextResponse.json({
          results: [{ toolCallId: toolCallId, result: "OK" }]
        });
    }

  } catch (error: any) {
    console.error(`🔥 CRASH: ${error.message}`);
    // Return a valid Vapi response even on crash — agent must never hang
    return NextResponse.json({
      results: [{
        toolCallId: "unknown",
        result: "Systemfehler. Bitte Anliegen manuell aufnehmen."
      }]
    });
  }
}
