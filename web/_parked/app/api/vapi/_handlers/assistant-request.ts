import { NextResponse } from "next/server";
import { getLast10 } from "../_phone";
import type { MessageCtx } from "./_types";

/**
 * Handles Vapi `assistant-request` events.
 * - Looks up the organisation via the inbound vapi_phone_id.
 * - Tries to match the caller against the tenants table for personalised greeting.
 * - Returns the dynamic first message + variable values for the assistant.
 *
 * NEVER blocks: org lookup has a 500ms timeout, tenant lookup wrapped in try/catch.
 * On any failure the assistant still receives a generic greeting.
 */
export async function handleAssistantRequest(ctx: MessageCtx): Promise<NextResponse> {
  const { message, supabase } = ctx;

  const rawNumber = message.call?.customer?.number;
  const vapiPhoneId = message.call?.phoneNumberId;
  const last10 = getLast10(rawNumber);

  console.log(`📞 CALLER: Raw="${rawNumber}" Last10="${last10}" VapiPhone="${vapiPhoneId}"`);

  let resident: { name: string; address: string; unit: string } | null = null;
  let organizationId: string | null = null;

  // WICHTIG: finalOrgName ist IMMER ein sauberer String - NIEMALS Platzhalter!
  let finalOrgName: string = "Ihrer Hausverwaltung";

  // 1. Organisation über Vapi Phone ID finden (mit Timeout)
  if (vapiPhoneId) {
    try {
      const orgPromise = supabase
        .from('organizations')
        .select('id, name, slug')
        .eq('vapi_phone_id', vapiPhoneId)
        .eq('is_active', true)
        .maybeSingle();

      // Timeout nach 500ms - lieber generischer Name als Verzögerung
      const timeoutPromise = new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), 500)
      );

      const result = await Promise.race([orgPromise, timeoutPromise]);

      if (result && 'data' in result && result.data) {
        const org = result.data;
        organizationId = org.id;
        // NUR wenn org.name ein echter String ist (nicht leer, nicht undefined)
        if (org.name && org.name.trim().length > 0) {
          finalOrgName = org.name;
        }
        console.log(`🏢 ORG: ${org.name} (${org.slug}) -> finalOrgName="${finalOrgName}"`);
      } else {
        console.log(`⚠️ NO ORG found or timeout for Vapi Phone ID: ${vapiPhoneId}`);
      }
    } catch (err) {
      console.error(`❌ ORG LOOKUP ERROR: ${err}`);
      // finalOrgName bleibt "Ihrer Hausverwaltung"
    }
  }

  // 2. Mieter in dieser Organisation suchen
  if (last10.length >= 8) {
    try {
      let query = supabase
        .from('tenants')
        .select('name, address, unit, phone, organization_id')
        .not('phone', 'is', null);

      if (organizationId) {
        query = query.eq('organization_id', organizationId);
      }

      const { data: tenants } = await query;

      if (tenants) {
        const match = tenants.find(t => getLast10(t.phone) === last10);
        if (match) {
          resident = match;
          organizationId = match.organization_id;
          console.log(`👤 MATCH: ${match.name} (${match.address})`);
        } else {
          console.log(`❌ NO MATCH for ${last10}`);
        }
      }
    } catch (err) {
      console.error(`❌ TENANT LOOKUP ERROR: ${err}`);
    }
  }

  // Dynamische First Message generieren - NUR mit finalOrgName (KEIN Platzhalter!)
  const firstMessage = resident
    ? `Guten Tag, ${resident.name}. Hier ist der digitale Assistent ${finalOrgName}. Ich sehe, Sie wohnen in der ${resident.address}${resident.unit ? `, ${resident.unit}` : ''}. Wie kann ich Ihnen helfen?`
    : `Guten Tag. Hier ist der digitale KI-Assistent ${finalOrgName}. Ich nehme Ihr Anliegen für die Hausverwaltung auf. Wie kann ich Ihnen helfen?`;

  // WICHTIG: org_name ist IMMER ein fertiger String - NIEMALS {{org_name}}!
  const response = {
    assistant: {
      firstMessage: firstMessage,
      variableValues: {
        name: resident?.name || "",
        address: resident?.address || "",
        unit: resident?.unit || "",
        org_name: finalOrgName,  // Fertiger String, keine Platzhalter!
        caller_phone: rawNumber || ""
      }
    }
  };

  console.log(`📤 FIRST: "${firstMessage.substring(0, 60)}..."`);
  console.log(`📤 ORG_NAME: "${finalOrgName}"`);
  return NextResponse.json(response);
}
