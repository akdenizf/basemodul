"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneOff, X, Loader2, AlertCircle, RotateCcw } from "lucide-react";
import { useVapiCall } from "@/lib/hooks/useVapiCall";
import { demoAssistant, DEMO_MAX_DURATION_SECONDS } from "@/lib/vapi/demoAssistant";
import { BarVisualizer, type VisualizerState } from "./BarVisualizer";

interface LiveCallExperienceProps {
  // Lets a placement style the trigger differently. Falls back to a green pill.
  label?: string;
  className?: string;
  // Full control over trigger content (e.g. to match the Hero's pill structure). Falls back to icon + label.
  children?: ReactNode;
}

const DEFAULT_TRIGGER =
  "inline-flex items-center gap-2.5 rounded-full bg-[#19E66F] px-7 py-3.5 text-[15px] font-bold text-[#0f1714] shadow-lg shadow-[#19E66F]/30 transition-colors hover:bg-[#15cc61]";

function formatRemaining(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function LiveCallExperience({ label = "Live-Gespräch starten", className, children }: LiveCallExperienceProps) {
  const { status, messages, partial, isAssistantSpeaking, error, start, stop } = useVapiCall();
  const [open, setOpen] = useState(false);
  const [remaining, setRemaining] = useState(DEMO_MAX_DURATION_SECONDS);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Portal target is only available after mount (SSR-safe).
  useEffect(() => setMounted(true), []);

  const handleStart = () => {
    setOpen(true);
    setRemaining(DEMO_MAX_DURATION_SECONDS);
    start({ assistant: demoAssistant, maxDurationSeconds: DEMO_MAX_DURATION_SECONDS });
  };

  const handleClose = () => {
    stop();
    setOpen(false);
  };

  // Countdown while the call is live.
  useEffect(() => {
    if (status !== "active") return;
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, [status]);

  // Keep the transcript pinned to the latest line.
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages.length, partial?.text]);

  const visualizerState: VisualizerState =
    status !== "active" ? "idle" : isAssistantSpeaking ? "speaking" : "listening";

  const liveTranscript = partial ? [...messages, partial] : messages;

  const overlay = (
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-md font-display"
            onClick={handleClose}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex h-[600px] w-full max-w-[460px] flex-col overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25)]"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-2.5 w-2.5">
                    {status === "active" && (
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#19E66F] opacity-60" />
                    )}
                    <span
                      className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                        status === "active" ? "bg-[#19E66F]" : "bg-slate-300"
                      }`}
                    />
                  </div>
                  <span className="text-[12px] font-bold uppercase tracking-widest text-slate-400">
                    Live-Gespräch
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {status === "active" && (
                    <span className="font-mono text-xs font-bold tabular-nums text-slate-400">
                      {formatRemaining(remaining)}
                    </span>
                  )}
                  <button onClick={handleClose} className="text-slate-400 transition-colors hover:text-slate-700">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Visualizer */}
              <div className="flex h-28 shrink-0 items-end justify-center border-b border-gray-50 bg-[#FAFAFA] px-6 pb-5 pt-6">
                <BarVisualizer state={visualizerState} barCount={40} className="h-full w-full max-w-[280px]" />
              </div>

              {/* Body — switches by status */}
              <div className="relative flex-1 overflow-hidden bg-[#FAFAFA]">
                {status === "connecting" && (
                  <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
                    <Loader2 className="h-7 w-7 animate-spin text-slate-300" />
                    <p className="text-sm font-medium text-slate-500">Mikrofon wird verbunden…</p>
                    <p className="text-xs text-slate-400">Bitte erlauben Sie den Mikrofonzugriff im Browser.</p>
                  </div>
                )}

                {status === "error" && (
                  <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
                    <AlertCircle className="h-7 w-7 text-red-400" />
                    <p className="text-sm font-medium text-slate-600">Verbindung nicht möglich.</p>
                    <p className="text-xs text-slate-400">{error ?? "Bitte erneut versuchen."}</p>
                    <button
                      onClick={handleStart}
                      className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-800 px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-slate-900"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Erneut versuchen
                    </button>
                  </div>
                )}

                {(status === "active" || status === "ended") && (
                  <div ref={scrollRef} className="absolute inset-0 flex flex-col gap-4 overflow-y-auto p-6">
                    {liveTranscript.length === 0 && status === "active" && (
                      <p className="m-auto text-center text-sm text-slate-400">
                        Sagen Sie etwas — z.&nbsp;B. „Bei mir tropft der Siphon im Bad.“
                      </p>
                    )}
                    {liveTranscript.map((msg, idx) => {
                      const isPartialLine = partial !== null && idx === liveTranscript.length - 1;
                      return (
                        <div
                          key={idx}
                          className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-[1.25rem] px-4 py-2.5 text-[14px] leading-relaxed shadow-sm ${
                              msg.role === "assistant"
                                ? "rounded-tl-sm border border-gray-100 bg-white text-slate-800"
                                : "rounded-tr-sm bg-slate-800 text-white"
                            } ${isPartialLine ? "opacity-60" : ""}`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      );
                    })}
                    {status === "ended" && (
                      <div className="mt-auto flex flex-col items-center gap-3 pt-4">
                        <p className="text-sm font-medium text-slate-500">Gespräch beendet.</p>
                        <button
                          onClick={handleStart}
                          className="inline-flex items-center gap-2 rounded-full bg-[#19E66F] px-5 py-2 text-xs font-bold text-[#0f1714] transition-colors hover:bg-[#15cc61]"
                        >
                          <RotateCcw className="h-3.5 w-3.5" /> Nochmal sprechen
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer — hang up */}
              {status === "active" && (
                <div className="flex shrink-0 items-center justify-center border-t border-gray-100 bg-white py-4">
                  <button
                    onClick={handleClose}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-red-600"
                  >
                    <PhoneOff className="h-4 w-4" /> Auflegen
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
  );

  return (
    <>
      <button onClick={handleStart} className={className ?? DEFAULT_TRIGGER}>
        {children ?? (
          <>
            <Phone className="h-5 w-5" />
            {label}
          </>
        )}
      </button>
      {mounted && createPortal(overlay, document.body)}
    </>
  );
}
