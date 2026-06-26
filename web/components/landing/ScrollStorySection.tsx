"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
  MotionValue,
} from "framer-motion";
import {
  PhoneIncoming,
  PhoneMissed,
  HelpCircle,
  AlertTriangle,
  ClipboardList,
  CheckCircle2,
  Check,
  ArrowRight,
  Mail,
  MessageCircle,
  Sheet,
  type LucideIcon,
} from "lucide-react";

/* ── Step definitions ──────────────────────────────────────────────────── */

interface Step {
  id: number;
  label: string;
  heading: string;
  body: string;
}

const STEPS: Step[] = [
  {
    id: 1,
    label: "Anruf kommt rein",
    heading: "Das Telefon klingelt — niemand ist da.",
    body: "BaseModul nimmt den Anruf an, begrüßt den Anrufer und erkennt das Anliegen. Kein Anrufbeantworter, keine Warteschleife.",
  },
  {
    id: 2,
    label: "Modul fragt nach",
    heading: "Fehlende Infos werden gezielt abgefragt.",
    body: "Name, Adresse, Anliegen, Dringlichkeit — das Modul fragt nur, was wirklich fehlt. Kein unnötiges Hin und Her.",
  },
  {
    id: 3,
    label: "Dringlichkeit erkannt",
    heading: "Normaler Fall oder Notfall — das Modul unterscheidet.",
    body: "Bei hoher Dringlichkeit eskaliert das Modul sofort an die Bereitschaft. Sonst landet alles ruhig in der strukturierten Übergabe.",
  },
  {
    id: 4,
    label: "Übergabe vorbereitet",
    heading: "Alles strukturiert für das Team bereit.",
    body: "Rückrufnotiz, Terminslot oder Fallkarte — je nach Anliegen die passende Übergabe. Kein halbes Ticket.",
  },
  {
    id: 5,
    label: "Team informiert",
    heading: "Das Team sieht alles — kein Anruf verpasst.",
    body: "Per E-Mail, Sheet oder WhatsApp: die Übergabe landet dort, wo das Team bereits arbeitet. Sofort einsatzbereit.",
  },
];

/* ── Phone screen states (max 3 UI elements: icon · title · status) ──────── */

type Screen = {
  icon: LucideIcon;
  title: string;
  status: string;
  tone: "green" | "amber";
  pulse?: boolean;
};

const SCREENS: Screen[] = [
  { icon: PhoneIncoming, title: "Eingehender Anruf", status: "KI nimmt an", tone: "green", pulse: true },
  { icon: HelpCircle, title: "Fehlende Infos", status: "Ort + Anliegen?", tone: "green" },
  { icon: AlertTriangle, title: "Notdienst erkannt", status: "Dringlichkeit: hoch", tone: "amber" },
  { icon: ClipboardList, title: "Rückrufnotiz bereit", status: "Übergabe vorbereitet", tone: "green" },
  { icon: CheckCircle2, title: "Team informiert", status: "kein Anruf verpasst", tone: "green" },
];

/* ── The shared phone mockup (same language as the hero) ─────────────────── */

function StoryPhone({ step, compact = false }: { step: number; compact?: boolean }) {
  const reduce = useReducedMotion();
  const s = SCREENS[step] ?? SCREENS[0];
  const Icon = s.icon;
  const amber = s.tone === "amber";

  const iconColor = amber ? "#FBBF24" : "#4ADE80";
  const callBg = amber
    ? "linear-gradient(160deg,rgba(251,191,36,0.18),rgba(251,191,36,0.06))"
    : "linear-gradient(160deg,rgba(20,83,45,0.5),rgba(20,83,45,0.22))";
  const callRing = amber ? "rgba(251,191,36,0.4)" : "rgba(22,101,52,0.6)";
  const statusBg = amber ? "rgba(251,191,36,0.12)" : "rgba(20,83,45,0.4)";
  const statusBorder = amber ? "rgba(251,191,36,0.35)" : "rgba(22,101,52,0.5)";
  const statusText = amber ? "#FCD34D" : "#4ADE80";

  return (
    <div className={`relative mx-auto ${compact ? "w-[160px] sm:w-[180px]" : "w-[240px] lg:w-[268px]"}`}>
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute -inset-12 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 50% 42%, rgba(34,197,94,0.14) 0%, rgba(34,211,238,0.06) 50%, transparent 72%)",
        }}
      />

      {/* side buttons */}
      <div className="absolute -left-[2px] top-[20%] h-[7%] w-[3px] rounded-l-sm bg-black/50" />
      <div className="absolute -left-[2px] top-[30%] h-[11%] w-[3px] rounded-l-sm bg-black/50" />
      <div className="absolute -right-[2px] top-[26%] h-[13%] w-[3px] rounded-r-sm bg-black/50" />

      <div
        className="rounded-[46px] p-[4px] shadow-[0_50px_110px_-34px_rgba(0,0,0,0.6)]"
        style={{ background: "linear-gradient(160deg,#2b2b2f,#161617 55%,#0b0b0c)" }}
      >
        <div className="rounded-[43px] bg-[#070707] p-[7px] ring-1 ring-white/[0.05]">
          <div className="relative flex aspect-[9/19.5] flex-col overflow-hidden rounded-[36px] border border-white/[0.06] bg-paperdeep px-5 pb-7 pt-4">
            {/* glass sheen */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
              style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.12), transparent)" }}
            />

            {/* notch */}
            <div className="mx-auto flex h-[24px] w-[72px] items-center justify-center gap-2 rounded-full bg-black">
              <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
              <span className="h-1 w-6 rounded-full bg-white/15" />
            </div>

            <div className="relative mt-5 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
              Aktiver Anruf
            </div>

            {/* state that crossfades between steps */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative flex flex-1 flex-col items-center justify-center text-center"
              >
                <span
                  className="flex h-[64px] w-[64px] items-center justify-center rounded-full"
                  style={{ background: callBg, border: `1px solid ${callRing}`, color: iconColor }}
                >
                  <Icon size={26} strokeWidth={1.7} />
                </span>
                <div className="mt-4 text-[15px] font-semibold text-ink">{s.title}</div>

                <div
                  className="mt-5 flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] font-semibold"
                  style={{ background: statusBg, border: `1px solid ${statusBorder}`, color: statusText }}
                >
                  <span className="relative flex h-1.5 w-1.5">
                    {s.pulse && !reduce && (
                      <motion.span
                        className="absolute inline-flex h-full w-full rounded-full"
                        style={{ background: statusText }}
                        animate={{ scale: [1, 2.4], opacity: [0.5, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                      />
                    )}
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: statusText }} />
                  </span>
                  {s.status}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Klingel-Ringe (nur Step 1) ─────────────────────────────────────────── */

function KlingelRings({ reduce }: { reduce: boolean | null }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2"
      aria-hidden
    >
      {(reduce ? [0] : [0, 1, 2]).map((i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-leafbright/20"
          animate={reduce ? { opacity: 0.18 } : { scale: [0.6, 1.5], opacity: [0.35, 0] }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 3.2, repeat: Infinity, delay: i * 1.05, ease: "easeOut" }
          }
        />
      ))}
    </motion.div>
  );
}

/* ── Schwebende Kontext-Artefakte pro Step ──────────────────────────────── */

function floatProps(reduce: boolean | null, dy = 6, dur = 6) {
  return reduce
    ? {}
    : { animate: { y: [0, dy, 0] }, transition: { duration: dur, repeat: Infinity, ease: "easeInOut" as const } };
}

const chip =
  "rounded-xl border border-white/10 bg-[#141414]/85 backdrop-blur-md shadow-[0_18px_40px_-16px_rgba(0,0,0,0.8)]";
const pill =
  "inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.05] px-2 py-0.5 text-[11px] text-ink";

function SceneArtifacts({ step, reduce }: { step: number; reduce: boolean | null }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={step}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="pointer-events-none absolute inset-0 z-20"
        aria-hidden
      >
        {/* Step 1 — verpasste Anrufe, die BaseModul rettet */}
        {step === 0 && (
          <div className="absolute -left-32 top-[30%]">
            <motion.div {...floatProps(reduce, -5, 7)} className={`w-[176px] p-3 ${chip}`}>
              <div className="flex items-center gap-2 text-[11px] text-faint line-through opacity-60">
                <PhoneMissed size={12} className="text-red-400/60" /> Anruf verpasst · 22:38
              </div>
              <div className="mt-1.5 flex items-center gap-2 text-[11px] text-faint line-through opacity-40">
                <PhoneMissed size={12} className="text-red-400/40" /> Kunde aufgelegt · 22:39
              </div>
              <div className="mt-2.5 flex items-center gap-1.5 border-t border-white/10 pt-2 text-[10px] font-semibold text-leafbright">
                <Check size={11} strokeWidth={2.6} /> BaseModul übernimmt
              </div>
            </motion.div>
          </div>
        )}

        {/* Step 2 — fehlende Infos / Rückfragen */}
        {step === 1 && (
          <div className="absolute -left-32 top-[33%]">
            <motion.div {...floatProps(reduce, 6, 6.5)} className={`w-[168px] p-3 ${chip}`}>
              <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-faint">
                <HelpCircle size={11} className="text-leafbright" /> Infos fehlen
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className={pill}>Ort?</span>
                <span className={pill}>Anliegen?</span>
              </div>
            </motion.div>
          </div>
        )}

        {/* Step 3 — Dringlichkeit */}
        {step === 2 && (
          <>
            <div className="absolute -right-3 top-[25%]">
              <motion.div
                {...floatProps(reduce, -5, 5.5)}
                className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-amber-300 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.8)] backdrop-blur-md"
              >
                <AlertTriangle size={12} strokeWidth={2.2} /> Dringend
              </motion.div>
            </div>
            <div className="absolute -left-28 bottom-[30%]">
              <motion.div
                {...floatProps(reduce, 6, 6.5)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-inksoft ${chip} !rounded-full`}
              >
                <ArrowRight size={12} className="text-leafbright" /> an Bereitschaft
              </motion.div>
            </div>
          </>
        )}

        {/* Step 4 — Rückrufnotiz */}
        {step === 3 && (
          <div className="absolute -left-32 top-[31%]">
            <motion.div {...floatProps(reduce, 6, 6.5)} className={`w-[182px] p-3.5 ${chip}`}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-faint">Rückrufnotiz</span>
                <span className="font-mono text-[10px] text-faint">22:47</span>
              </div>
              <div className="text-[13px] font-semibold text-ink">Klaus M.</div>
              <div className="mt-0.5 text-[11px] text-inksoft">Heizung ausgefallen</div>
            </motion.div>
          </div>
        )}

        {/* Step 5 — Team informiert / Output-Kanäle */}
        {step === 4 && (
          <div className="absolute -left-32 top-[33%]">
            <motion.div
              {...floatProps(reduce, 6, 6.5)}
              className="w-[182px] rounded-xl border border-leafbright/25 bg-gradient-to-b from-leaf/15 to-leaf/[0.04] p-3.5 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.8)] backdrop-blur-md"
            >
              <div className="mb-2.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-leafbright">
                <Check size={11} strokeWidth={2.6} /> Übergabe gesendet
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className={pill}><Mail size={11} className="text-leafbright" /> E-Mail</span>
                <span className={pill}><MessageCircle size={11} className="text-leafbright" /> WhatsApp</span>
                <span className={pill}><Sheet size={11} className="text-leafbright" /> Sheet</span>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Mobile: kompakter Artefakt-Hinweis pro Step ───────────────────────── */

const miniPill =
  "inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] text-ink";

function MobileArtifact({ step }: { step: number }) {
  switch (step) {
    case 0:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-leafbright/25 bg-leaf/10 px-2.5 py-1 text-[11px] font-semibold text-leafbright">
          <Check size={11} strokeWidth={2.6} /> verpasst → angenommen
        </span>
      );
    case 1:
      return (
        <div className="flex flex-wrap gap-1.5">
          <span className={miniPill}>Ort?</span>
          <span className={miniPill}>Anliegen?</span>
        </div>
      );
    case 2:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-300">
          <AlertTriangle size={11} strokeWidth={2.2} /> Dringend · Bereitschaft
        </span>
      );
    case 3:
      return (
        <div className="flex flex-wrap gap-1.5">
          <span className={miniPill}>Klaus M.</span>
          <span className={miniPill}>Heizung ausgefallen</span>
          <span className={`${miniPill} font-mono`}>22:47</span>
        </div>
      );
    case 4:
      return (
        <div className="flex flex-wrap gap-1.5">
          <span className={miniPill}><Mail size={11} className="text-leafbright" /> E-Mail</span>
          <span className={miniPill}><MessageCircle size={11} className="text-leafbright" /> WhatsApp</span>
          <span className={miniPill}><Sheet size={11} className="text-leafbright" /> Sheet</span>
        </div>
      );
    default:
      return null;
  }
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
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Maps 0→1 scroll to 0→(N-1) step index
  const rawIndex = useTransform(scrollYProgress, [0, 1], [0, STEPS.length - 1]);
  const activeIndex = useActiveIndex(rawIndex);

  return (
    <section
      ref={containerRef}
      id="how-it-works"
      aria-label="Wie BaseModul arbeitet"
      style={{ minHeight: `${STEPS.length * 58}dvh` }}
      className="relative bg-paper"
    >
      {/* ── Desktop: sticky two-column layout ── */}
      <div className="sticky top-0 hidden h-screen lg:flex">
        {/* Left — sticky call scene */}
        <div className="relative flex h-full w-1/2 items-center justify-center overflow-hidden border-r border-line">
          {/* Eyebrow — absolute top left */}
          <div className="absolute left-10 top-10 z-10">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
              03 — Wie es funktioniert
            </span>
          </div>

          {/* scene: phone anchor + ringing + per-step artifacts */}
          <div className="relative w-[268px]">
            <AnimatePresence>
              {activeIndex === 0 && <KlingelRings key="rings" reduce={reduce} />}
            </AnimatePresence>
            <div className="relative z-10">
              <StoryPhone step={activeIndex} />
            </div>
            <SceneArtifacts step={activeIndex} reduce={reduce} />
          </div>

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

      {/* ── Mobile: phone anchor + compact step timeline ── */}
      <div className="px-6 pb-12 pt-8 lg:hidden">
        <div className="mb-6 text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
            03 — Wie es funktioniert
          </span>
          <h2 className="mt-4 text-[clamp(28px,7.5vw,38px)] font-bold leading-[1.1] tracking-[-0.025em] text-ink">
            Ein Anruf. Fünf Schritte.
            <br />
            <span className="text-inksoft">Nichts geht verloren.</span>
          </h2>
        </div>

        {/* anchor phone */}
        <div className="mb-8 flex justify-center">
          <StoryPhone step={0} compact />
        </div>

        {/* timeline */}
        <ol className="mx-auto max-w-[420px] space-y-5">
          {STEPS.map((step, i) => {
            const sc = SCREENS[i];
            const amber = sc.tone === "amber";
            const accentColor = amber ? "#FBBF24" : "#4ADE80";
            const accentBg = amber ? "rgba(251,191,36,0.12)" : "rgba(20,83,45,0.4)";
            const accentBorder = amber ? "rgba(251,191,36,0.35)" : "rgba(22,101,52,0.55)";
            return (
              <li key={step.id} className="relative flex gap-4">
                {/* badge + connector */}
                <div className="relative flex flex-col items-center">
                  <span
                    className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                    style={{ background: accentBg, border: `1px solid ${accentBorder}`, color: accentColor }}
                  >
                    <sc.icon size={17} strokeWidth={1.8} />
                  </span>
                  {i < STEPS.length - 1 && (
                    <span className="mt-1 w-px flex-1 bg-gradient-to-b from-linesoft to-transparent" />
                  )}
                </div>

                {/* content card */}
                <div className="flex-1 pb-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-faint">
                    {String(step.id).padStart(2, "0")} — {step.label}
                  </span>
                  <h3 className="mt-1.5 text-[17px] font-bold leading-snug text-ink">{step.heading}</h3>
                  <p className="mt-1.5 text-[14px] leading-[1.6] text-inksoft">{step.body}</p>
                  <div className="mt-3">
                    <MobileArtifact step={i} />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
