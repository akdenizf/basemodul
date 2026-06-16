import { NextResponse } from "next/server";
import type { MessageCtx } from "./_types";

/**
 * Handles Vapi `call-ended` events.
 * Fire-and-forget: writes the call duration onto the ticket (if it exists) and
 * increments the organisation's monthly duration counter via the
 * `add_call_duration` RPC. Returns immediately so Vapi isn't kept waiting.
 *
 * Fallback path: if no ticket was created during the call (e.g. caller hung up
 * before submit_ticket), looks up the org via vapiPhoneId instead.
 */
export async function handleCallEnded(ctx: MessageCtx): Promise<NextResponse> {
  const { message, supabase } = ctx;

  const callId = message.call?.id;
  const duration = Math.round(message.call?.duration || 0); // in seconds
  const vapiPhoneId = message.call?.phoneNumberId;

  console.log(`📊 CALL-ENDED: id=${callId} duration=${duration}s`);

  if (callId && duration > 0) {
    // Fire-and-forget duration updates
    ;(async () => {
      try {
        // 1. Update duration in tickets table (if ticket exists)
        const { data: ticket } = await supabase
          .from('tickets')
          .update({ duration_seconds: duration })
          .eq('call_id', callId)
          .select('organization_id')
          .maybeSingle();

        // 2. Update organization duration limits
        let organizationId = ticket?.organization_id;

        // Fallback: look up org by vapiPhoneId if ticket doesn't exist (e.g. hung up before submit)
        if (!organizationId && vapiPhoneId) {
          const { data: org } = await supabase
            .from('organizations')
            .select('id')
            .eq('vapi_phone_id', vapiPhoneId)
            .maybeSingle();
          organizationId = org?.id;
        }

        if (organizationId) {
          await supabase.rpc('add_call_duration', {
            org_id: organizationId,
            seconds: duration
          });
          console.log(`[Billing] ✅ Recorded ${duration}s for org ${organizationId}`);
        }
      } catch (e: any) {
        console.error(`[Billing] Duration update failed: ${e.message}`);
      }
    })();
  }

  return NextResponse.json({ message: "OK" });
}
