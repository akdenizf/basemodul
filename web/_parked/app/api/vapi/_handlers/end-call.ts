import { NextResponse } from "next/server";
import type { ToolCtx } from "./_types";

/**
 * Handles the `end_call` / `end_call_tool` tool invocation.
 * Returns a flat success response plus the `endCall: true` flag that tells
 * Vapi to terminate the call.
 */
export async function handleEndCall(ctx: ToolCtx): Promise<NextResponse> {
  const { toolCallId } = ctx;

  console.log(`📴 END_CALL`);

  // Absolut flache Response für Vapi
  return NextResponse.json({
    results: [{ toolCallId: toolCallId, result: "success" }],
    endCall: true
  });
}
