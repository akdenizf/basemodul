"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import {
  PhoneIncoming,
  AlertTriangle,
  ClipboardList,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

/* ── Step definitions ──────────────────────────────────────────────────── */

interface Step {
  id: number;
  label: string;
  heading: string;
  body: string;
  Visual: React.ComponentType;
}

const STEPS: Step[] = [
  {
    id: 1,
    label: "Anruf kommt rein",
    heading: "Das Telefon klingelt — niemand ist da.",
    body: "BASEMODULE nimmt den Anruf an, begrüßt den Anrufer und erkennt das Anliegen. Kein Anrufbeantworter, keine Warteschleife.",
    Visual: PhoneVisual,
  },
  {
    id: 2,
    label: "Modul fragt nach",
    heading: "Fehlende Infos werden gezielt abgefragt.",
    body: "Name, Adresse, Anliegen, Dringlichkeit — das Modul fragt nur, was wirklich fehlt. Kein unnötiges Hin und Her.",
    Visual: ChatVisual,
  },
  {
    id: 3,
    label: "Dringlichkeit erkannt",
    heading: "Normaler Fall oder Notfall — das Modul unterscheidet.",
    body: "Bei hoher Dringlichkeit eskaliert das Modul sofort an die Bereitschaft. Sonst landet alles ruhig in der strukturierten Übergabe.",
    Visual: UrgencyVisual,
  },
  {
    id: 4,
    label: "Übergabe vorbereitet",
    heading: "Alles strukturiert für das Team bereit.",
    body: "Rückrufnotiz, Terminslot oder Fallkarte — je nach Anliegen die passende Übergabe. Kein halbes Ticket.",
    Visual: HandoffVisual,
  },
  {
    id: 5,
    label: "Team informiert",
    heading: "Das Team sieht alles — kein Anruf verpasst.",
    body: "Per E-Mail, Sheet oder WhatsApp: die Übergabe landet dort, wo das Team bereits arbeitet. Sofort einsatzbereit.",
    Visual: DoneVisual,
  },
];

/* ── Visual components (dark-premium, Tailwind only) ───────────────────── */

function VisualShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center p-10 lg:p-14">
      {/* Ambient light orbs — refracted by the card's backdrop-blur for depth */}
      <div className="pointer-events-none absolute left-[30%] top-[28%] h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.22),transparent_70%)] blur-2xl" />
      <div className="pointer-events-none absolute bottom-[26%] right-[28%] h-52 w-52 translate-x-1/2 translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.15),transparent_70%)] blur-2xl" />
      <div className="relative w-full max-w-[340px] lg:max-w-[380px]">{children}</div>
    </div>
  );
}

/* Glassy premium card shell — soft form, green/cyan light edge, gloss, depth */
function GlassCard({
  children,
  accent = false,
  className = "",
}: {
  children: React.ReactNode;
  accent?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[22px] border backdrop-blur-xl ${
        accent ? "border-[rgba(34,197,94,0.40)]" : "border-white/10"
      } ${className}`}
      style={{
        background: "linear-gradient(160deg, rgba(28,28,32,0.72), rgba(18,18,20,0.66))",
        boxShadow: accent
          ? "0 26px 60px -22px rgba(0,0,0,0.78), 0 0 52px -16px rgba(34,197,94,0.34), inset 0 1px 0 rgba(255,255,255,0.10)"
          : "0 26px 60px -22px rgba(0,0,0,0.78), 0 0 42px -18px rgba(34,211,238,0.20), inset 0 1px 0 rgba(255,255,255,0.10)",
      }}
    >
      {/* top gloss line */}
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      {/* soft sheen from the top */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.06] via-transparent to-transparent" />
      {/* content */}
      <div className="relative">{children}</div>
    </div>
  );
}

function PhoneVisual() {
  return (
    <VisualShell>
      <GlassCard className="p-6">
        <div className="mb-5 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-faint">Eingehend</span>
          <span className="font-mono text-[10px] text-faint">jetzt</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/10 bg-gradient-to-b from-white/[0.10] to-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
            <div className="absolute inset-0 animate-ping rounded-full border border-leaf/30" style={{ animationIterationCount: 3 }} />
            <PhoneIncoming size={22} className="text-leafbright" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-[16px] font-bold text-ink">Eingehender Anruf</p>
            <p className="mt-0.5 font-mono text-[12px] text-faint">+49 176 24 …</p>
          </div>
        </div>
        <div className="mt-5 rounded-[10px] border border-leafdimline bg-leafdim px-4 py-3">
          <p className="text-[12px] font-medium text-leafbright">
            BASEMODULE nimmt den Anruf entgegen…
          </p>
        </div>
      </GlassCard>
    </VisualShell>
  );
}

function ChatVisual() {
  const bubbles = [
    { speaker: "assistant", text: "Guten Tag, wie kann ich Ihnen helfen?" },
    { speaker: "caller", text: "Ich brauche einen Wartungstermin." },
    { speaker: "assistant", text: "Kein Problem. Welche Anlage und welcher Standort?" },
  ];
  return (
    <VisualShell>
      <GlassCard className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-leafbright shadow-[0_0_0_3px_rgba(74,222,128,0.18)]" />
          <span className="text-[12px] font-semibold text-ink">BASEMODULE</span>
          <span className="ml-auto font-mono text-[10px] text-faint">live</span>
        </div>
        <div className="flex flex-col gap-3">
          {bubbles.map((b, i) => (
            <div key={i} className={`flex ${b.speaker === "assistant" ? "justify-start" : "justify-end"}`}>
              <div
                className={`max-w-[82%] rounded-[12px] px-3.5 py-2.5 text-[12px] leading-snug ${
                  b.speaker === "assistant"
                    ? "rounded-tl-[3px] border border-line bg-paperdeep text-ink"
                    : "rounded-tr-[3px] border border-[rgba(22,163,74,0.25)] bg-[rgba(22,163,74,0.08)] text-ink"
                }`}
              >
                {b.text}
              </div>
            </div>
          ))}
          <div className="flex justify-start">
            <div className="max-w-[82%] rounded-[12px] rounded-tl-[3px] border border-line bg-paperdeep px-3.5 py-2.5 text-[12px] leading-snug text-ink">
              Notiert — ich bereite die Übergabe vor.
            </div>
          </div>
        </div>
      </GlassCard>
    </VisualShell>
  );
}

function UrgencyVisual() {
  return (
    <VisualShell>
      <GlassCard className="p-6">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.12em] text-faint">Klassifizierung</p>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between rounded-[9px] border border-linesoft bg-paper px-4 py-3 opacity-40">
            <span className="text-[13px] text-inksoft">Standardfall</span>
            <span className="rounded-md border border-line px-2 py-0.5 text-[10px] text-faint">Normal</span>
          </div>
          <div className="flex items-center justify-between rounded-[9px] border border-linesoft bg-paper px-4 py-3 opacity-40">
            <span className="text-[13px] text-inksoft">Rückrufwunsch</span>
            <span className="rounded-md border border-line px-2 py-0.5 text-[10px] text-amber-400">Mittel</span>
          </div>
          <div className="flex items-center justify-between rounded-[9px] border border-[rgba(220,38,38,0.4)] bg-[rgba(220,38,38,0.06)] px-4 py-3 ring-1 ring-[rgba(220,38,38,0.3)]">
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-[#FCA5A5]" strokeWidth={2} />
              <span className="text-[13px] font-semibold text-ink">Notfall erkannt</span>
            </div>
            <span className="rounded-md border border-[rgba(248,113,113,0.4)] bg-[rgba(220,38,38,0.14)] px-2 py-0.5 text-[10px] font-bold text-[#FCA5A5]">
              Hoch
            </span>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-[9px] border border-leafdimline bg-leafdim px-4 py-2.5">
          <ArrowRight size={13} className="text-leafbright" />
          <span className="text-[12px] font-medium text-leafbright">Bereitschaft wird alarmiert</span>
        </div>
      </GlassCard>
    </VisualShell>
  );
}

function HandoffVisual() {
  return (
    <VisualShell>
      <GlassCard>
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <div className="flex items-center gap-2">
            <ClipboardList size={14} className="text-leaf" strokeWidth={2} />
            <span className="text-[13px] font-bold text-ink">Rückrufnotiz</span>
          </div>
          <span className="rounded border border-[rgba(22,163,74,0.35)] bg-[rgba(22,163,74,0.08)] px-2 py-0.5 font-mono text-[10px] text-leaf">
            Bereit
          </span>
        </div>
        <div className="space-y-0 divide-y divide-dashed divide-line px-5 py-4">
          {[
            { label: "Name", value: "Klaus M." },
            { label: "Telefon", value: "0176 24 …" },
            { label: "Anliegen", value: "Wartung · Heizung" },
            { label: "Wunschzeit", value: "Di–Do, 14–17 Uhr" },
          ].map((r) => (
            <div key={r.label} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
              <span className="text-[11px] text-faint">{r.label}</span>
              <span className="text-[12px] font-medium text-ink">{r.value}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 border-t border-line bg-paperdeep px-5 py-3">
          <ArrowRight size={13} className="text-leaf" />
          <span className="text-[11px] text-inksoft">Nächster Schritt: <span className="font-bold text-ink">Rückruf einplanen</span></span>
        </div>
      </GlassCard>
    </VisualShell>
  );
}

function DoneVisual() {
  const channels = ["E-Mail", "Google Sheet", "WhatsApp"];
  return (
    <VisualShell>
      <GlassCard accent className="p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(34,197,94,0.45)] bg-gradient-to-b from-[rgba(34,197,94,0.18)] to-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_0_18px_-6px_rgba(34,197,94,0.5)]">
            <CheckCircle2 size={22} className="text-leaf" strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-[15px] font-bold text-ink">Übergabe erstellt</p>
            <p className="text-[11px] text-faint">#BM-8421 · kein Anruf verpasst</p>
          </div>
        </div>
        <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.06em] text-faint">
          Übergabe an
        </p>
        <div className="space-y-2">
          {channels.map((c) => (
            <div key={c} className="flex items-center gap-3 rounded-[9px] border border-linesoft bg-paper px-3.5 py-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-leafbright" />
              <span className="text-[13px] text-ink">{c}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </VisualShell>
  );
}

/* ── Scroll-driven active index hook ───────────────────────────────────── */

function useActiveIndex(rawIndex: MotionValue<number>) {
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    return rawIndex.on("change", (v) => {
      setActiveIndex(Math.min(STEPS.length - 1, Math.max(0, Math.round(v))));
    });
  }, [rawIndex]);
  return activeIndex;
}

/* ── Main component ─────────────────────────────────────────────────────── */

export function ScrollStorySection() {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Maps 0→1 scroll to 0→(N-1) step index
  const rawIndex = useTransform(scrollYProgress, [0, 1], [0, STEPS.length - 1]);
  const activeIndex = useActiveIndex(rawIndex);

  const ActiveVisual = STEPS[activeIndex].Visual;

  return (
    <section
      ref={containerRef}
      id="how-it-works"
      aria-label="Wie BASEMODULE arbeitet"
      style={{ minHeight: `${STEPS.length * 58}dvh` }}
      className="relative bg-paperdeep"
    >
      {/* ── Desktop: sticky two-column layout ── */}
      <div className="sticky top-0 hidden h-screen lg:flex">
        {/* Left — sticky visual */}
        <div className="relative flex h-full w-1/2 items-center justify-center border-r border-line">
          {/* Eyebrow — absolute top left */}
          <div className="absolute left-10 top-10 z-10">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
              03 — Wie es funktioniert
            </span>
          </div>
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex w-full items-center justify-center"
          >
            <ActiveVisual />
          </motion.div>

          {/* Step counter — bottom left */}
          <div className="absolute bottom-10 left-10 z-10 flex items-center gap-2">
            <span className="font-mono text-[22px] font-bold text-ink tabular-nums">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <span className="font-mono text-[14px] text-faint">/ {String(STEPS.length).padStart(2, "0")}</span>
          </div>

          {/* Progress dots */}
          <div className="absolute bottom-10 right-10 z-10 flex flex-col gap-1.5">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex ? "w-5 bg-leafbright" : "w-1.5 bg-faint/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right — step callouts */}
        <div className="flex h-full w-1/2 flex-col justify-center gap-0 overflow-hidden px-12 py-20">
          <h2 className="mb-10 text-[clamp(28px,2.8vw,38px)] font-bold leading-[1.1] tracking-[-0.025em] text-ink">
            Ein Anruf. Fünf Schritte.
            <br />
            <span className="text-inksoft">Nichts geht verloren.</span>
          </h2>
          {STEPS.map((step, i) => (
            <motion.div
              key={step.id}
              animate={{
                opacity: i === activeIndex ? 1 : 0.28,
                x: i === activeIndex ? 0 : -6,
              }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="border-b border-linesoft py-6 last:border-b-0"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-faint">
                {String(step.id).padStart(2, "0")} — {step.label}
              </span>
              <h3 className="mt-2 text-[18px] font-bold leading-snug text-ink">
                {step.heading}
              </h3>
              <p className="mt-2 text-[14px] leading-[1.6] text-inksoft">{step.body}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Mobile: simple vertical list (no sticky) ── */}
      <div className="px-6 py-16 lg:hidden">
        <div className="mb-10">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
            03 — Wie es funktioniert
          </span>
          <h2 className="mt-4 text-[clamp(28px,7vw,38px)] font-bold leading-[1.1] tracking-[-0.025em] text-ink">
            Ein Anruf. Fünf Schritte.
            <br />
            <span className="text-inksoft">Nichts geht verloren.</span>
          </h2>
        </div>
        <div className="flex flex-col gap-10">
          {STEPS.map((step) => {
            const StepVisual = step.Visual;
            return (
              <div key={step.id} className="flex flex-col gap-5">
                {/* Visual mini */}
                <div className="h-[240px] overflow-hidden rounded-xl border border-line bg-paper2">
                  <StepVisual />
                </div>
                {/* Text */}
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-faint">
                    {String(step.id).padStart(2, "0")} — {step.label}
                  </span>
                  <h3 className="mt-2 text-[20px] font-bold leading-snug text-ink">{step.heading}</h3>
                  <p className="mt-2 text-[15px] leading-[1.65] text-inksoft">{step.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
