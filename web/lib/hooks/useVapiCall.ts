"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";

// Lifecycle of a single browser voice call.
export type CallStatus = "idle" | "connecting" | "active" | "ended" | "error";

export interface TranscriptEntry {
  role: "assistant" | "user";
  text: string;
}

// Derived from the SDK so it stays in sync with vapi.start(assistant, overrides).
type StartAssistant = Parameters<InstanceType<typeof Vapi>["start"]>[0];
type StartOverrides = Parameters<InstanceType<typeof Vapi>["start"]>[1];

interface StartOptions {
  assistant: StartAssistant;
  overrides?: StartOverrides;
  // Hard cap: the call auto-stops after this many seconds to limit cost/abuse on a public page.
  maxDurationSeconds?: number;
}

// The SDK types the `message` event payload as `any`; we narrow the only shape we read.
interface TranscriptMessage {
  type: string;
  role: "assistant" | "user";
  transcriptType: "partial" | "final";
  transcript: string;
}

function isTranscriptMessage(m: unknown): m is TranscriptMessage {
  if (typeof m !== "object" || m === null) return false;
  const msg = m as Record<string, unknown>;
  return msg.type === "transcript" && typeof msg.transcript === "string";
}

export function useVapiCall() {
  const vapiRef = useRef<Vapi | null>(null);
  const autoStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [status, setStatus] = useState<CallStatus>("idle");
  const [messages, setMessages] = useState<TranscriptEntry[]>([]);
  const [partial, setPartial] = useState<TranscriptEntry | null>(null);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [volume, setVolume] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Create the client (browser only) and wire up events exactly once.
  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    if (!publicKey) {
      setError("NEXT_PUBLIC_VAPI_PUBLIC_KEY fehlt.");
      setStatus("error");
      return;
    }

    const vapi = new Vapi(publicKey);
    vapiRef.current = vapi;

    vapi.on("call-start", () => setStatus("active"));
    vapi.on("call-end", () => {
      setStatus("ended");
      setIsAssistantSpeaking(false);
      setVolume(0);
      setPartial(null);
    });
    vapi.on("speech-start", () => setIsAssistantSpeaking(true));
    vapi.on("speech-end", () => setIsAssistantSpeaking(false));
    vapi.on("volume-level", (v) => setVolume(v));
    vapi.on("error", (e) => {
      setError(e instanceof Error ? e.message : "Verbindung zur Sprach-KI fehlgeschlagen.");
      setStatus("error");
    });
    vapi.on("message", (message) => {
      if (!isTranscriptMessage(message)) return;
      const entry: TranscriptEntry = { role: message.role, text: message.transcript };
      if (message.transcriptType === "final") {
        setMessages((prev) => [...prev, entry]);
        setPartial(null);
      } else {
        setPartial(entry);
      }
    });

    return () => {
      if (autoStopRef.current) clearTimeout(autoStopRef.current);
      vapi.stop();
      vapi.removeAllListeners();
      vapiRef.current = null;
    };
  }, []);

  const start = useCallback(
    (opts: StartOptions) => {
      const vapi = vapiRef.current;
      if (!vapi || status === "connecting" || status === "active") return;

      setMessages([]);
      setPartial(null);
      setError(null);
      setStatus("connecting");

      vapi.start(opts.assistant, opts.overrides).catch((e: unknown) => {
        setError(e instanceof Error ? e.message : "Anruf konnte nicht gestartet werden.");
        setStatus("error");
      });

      if (opts.maxDurationSeconds) {
        autoStopRef.current = setTimeout(() => vapi.stop(), opts.maxDurationSeconds * 1000);
      }
    },
    [status]
  );

  const stop = useCallback(() => {
    if (autoStopRef.current) clearTimeout(autoStopRef.current);
    vapiRef.current?.stop();
  }, []);

  return { status, messages, partial, isAssistantSpeaking, volume, error, start, stop };
}
