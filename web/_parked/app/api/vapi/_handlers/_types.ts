/**
 * Shared context passed from the webhook router (route.ts) into each handler.
 * Keeps handlers pure: everything they need to do their work is on the context.
 */

import type { getSupabaseAdmin } from "@/lib/supabase/admin";

export type SupabaseAdmin = ReturnType<typeof getSupabaseAdmin>;

/** Context for system-event handlers (assistant-request, call-ended). */
export interface MessageCtx {
  message: any;
  body: any;
  supabase: SupabaseAdmin;
}

/** Context for tool-call handlers (submit_ticket, add_ticket_note, …). */
export interface ToolCtx extends MessageCtx {
  toolCallId: string;
  args: any;
  functionName: string;
  /** Origin of the inbound request — used for same-host fetches (process-new). */
  requestOrigin: string;
}
