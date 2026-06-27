"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Play,
  Pause,
  CheckCircle2,
  PhoneIncoming,
  Zap,
  MessageSquare,
  CalendarClock,
  Info,
} from "lucide-react";
import { BarVisualizer, type VisualizerState } from "./BarVisualizer";
import { AmbientOrbs, FlowGrid } from "./AmbientOrbs";

interface Scenario {
  id: string;
  title: string;
  category: "PRIORITY" | "CHAT" | "APPOINTMENT" | "GENERAL";
  urgency: "LOW" | "MEDIUM" | "HIGH";
  audioSrc: string;
  transcript: {
    time: number;
    speaker: "assistant" | "caller";
    text: string;
  }[];
  finalResult: {
    ticketId: string;
    summary: string;
    action: string;
  };
}

const CATEGORY_ICONS = {
  PRIORITY: <Zap className="h-4 w-4" />,
  CHAT: <MessageSquare className="h-4 w-4" />,
  APPOINTMENT: <CalendarClock className="h-4 w-4" />,
  GENERAL: <Info className="h-4 w-4" />,
};

const CATEGORY_LABELS = {
  PRIORITY: "Priorität",
  CHAT: "Chat",
  APPOINTMENT: "Termin",
  GENERAL: "Allgemein",
};

const URGENCY_COLORS = {
  LOW: "bg-blue-400",
  MEDIUM: "bg-amber-400",
  HIGH: "bg-red-500",
};

const SCENARIOS: Scenario[] = [
  {
    id: "rueckruf",
    title: "Rückruf zu Anfrage",
    category: "CHAT",
    urgency: "MEDIUM",
    audioSrc: "/demo.mp3",
    transcript: [
      { time: 0.0, speaker: "assistant", text: "Guten Tag, hier ist das Telefon-Modul von basemodul.de. Ich nehme Ihr Anliegen auf. Wie kann ich Ihnen helfen?" },
      { time: 7.3, speaker: "caller", text: "Hallo, hier ist Müller. Ich habe eine Anfrage geschickt und hätte gern einen Rückruf." },
      { time: 12.9, speaker: "assistant", text: "Guten Tag Herr Müller. Ich notiere Ihren Rückrufwunsch. Worum geht es grob, damit das Team die Anfrage richtig einordnen kann?" },
      { time: 21.5, speaker: "caller", text: "Es geht um einen neuen Auftrag. Ich kann auch gleich ein Foto oder Dokument mitschicken." },
      { time: 27.3, speaker: "assistant", text: "Alles klar. Ich erstelle eine Rückrufnotiz und sende Ihnen einen Upload-Link für den Anhang. Das Team bekommt alles strukturiert übergeben." },
      { time: 36.3, speaker: "caller", text: "Super, mache ich. Danke!" },
      { time: 38.1, speaker: "assistant", text: "Gern geschehen. Das Team bekommt Ihre Meldung strukturiert übergeben und meldet sich zur Terminabstimmung. Auf Wiederhören!" },
    ],
    finalResult: {
      ticketId: "#BM-8421",
      summary: "Rückrufwunsch mit Kontakt, Anliegen und optionalem Anhang.",
      action: "Rückrufnotiz erstellt • Team informiert • Upload-Link versandt",
    },
  },
  {
    id: "stromausfall",
    title: "Dringende Meldung",
    category: "PRIORITY",
    urgency: "HIGH",
    audioSrc: "/demo-strom.mp3",
    transcript: [
      { time: 0.0, speaker: "assistant", text: "Guten Tag, hier ist das Telefon-Modul von basemodul.de. Ich nehme Ihr Anliegen auf. Wie kann ich Ihnen helfen?" },
      { time: 7.8, speaker: "caller", text: "Ja, hallo. Es ist dringend, ich erreiche gerade niemanden im Büro." },
      { time: 12.9, speaker: "assistant", text: "Verstanden. Ich nehme die wichtigsten Angaben auf. Wen soll das Team zurückrufen und worum geht es kurz?" },
      { time: 20.4, speaker: "caller", text: "Bitte unter dieser Nummer. Es betrifft einen laufenden Auftrag und muss heute geklärt werden." },
      { time: 26.6, speaker: "assistant", text: "In Ordnung. Ich setze die Priorität auf Hoch und informiere den festgelegten Übergabekanal." },
      { time: 33.1, speaker: "caller", text: "Vielen Dank, das ist super." },
      { time: 36.0, speaker: "assistant", text: "Gerne. Das Team wird sich in Kürze bei Ihnen melden. Auf Wiederhören!" },
    ],
    finalResult: {
      ticketId: "#BM-9102",
      summary: "Dringende Kundenmeldung außerhalb der Bürozeit.",
      action: "Priorität hoch • Übergabekanal informiert • Rückruf vorbereitet",
    },
  },
  {
    id: "status",
    title: "Terminstatus abfragen",
    category: "APPOINTMENT",
    urgency: "LOW",
    audioSrc: "/demo-status.mp3",
    transcript: [
      { time: 0.0, speaker: "assistant", text: "Guten Tag, hier ist das Telefon-Modul von basemodul.de. Ich nehme Ihr Anliegen auf. Wie kann ich Ihnen helfen?" },
      { time: 7.5, speaker: "caller", text: "Ja, hallo, hier ist Müller. Ich wollte nachfragen, wann mein Termin stattfindet." },
      { time: 13.0, speaker: "assistant", text: "Guten Tag Herr Müller. Ich sehe die Anfrage vom Dienstag. Der Termin ist für morgen, Freitag den 6. Juni um 10:30 Uhr vorbereitet." },
      { time: 22.5, speaker: "caller", text: "Super, das passt. Danke!" },
      { time: 24.4, speaker: "assistant", text: "Sehr gerne. Das Team meldet sich bei Bedarf vorher noch einmal. Auf Wiederhören!" },
    ],
    finalResult: {
      ticketId: "#BM-8421",
      summary: "Terminstatus abgerufen. Fr. 06. Jun. 10:30 Uhr bestätigt.",
      action: "Status erkannt • Termin bestätigt • Team nicht unterbrochen",
    },
  },
  {
    id: "eskalation",
    title: "Foto & Datei einreichen",
    category: "GENERAL",
    urgency: "MEDIUM",
    audioSrc: "/demo-eskalation.mp3",
    transcript: [
      { time: 0.0, speaker: "assistant", text: "Guten Tag, hier ist das Telefon-Modul von basemodul.de. Ich nehme Ihr Anliegen auf. Wie kann ich Ihnen helfen?" },
      { time: 7.3, speaker: "caller", text: "Hallo, ich habe ein Problem bei mir im Betrieb — das ist schwer zu beschreiben, ich weiß nicht genau, woran es liegt." },
      { time: 15.9, speaker: "assistant", text: "Kein Problem. Am einfachsten geht das mit einem kurzen Foto oder Video. Ich schicke Ihnen gleich einen Upload-Link per SMS. Darf ich Ihre Handynummer kurz aufnehmen?" },
      { time: 26.3, speaker: "caller", text: "Ja, gerne. Sie können die 0151er nehmen." },
      { time: 29.5, speaker: "assistant", text: "Perfekt. Der Link ist unterwegs. Schicken Sie das Foto, sobald Sie können — das Team bekommt Ihre Meldung mit dem Bild direkt übergeben." },
      { time: 39.0, speaker: "caller", text: "Super, vielen Dank." },
      { time: 40.1, speaker: "assistant", text: "Sehr gerne. Auf Wiederhören!" },
    ],
    finalResult: {
      ticketId: "#BM-7033",
      summary: "Unklares Anliegen per Foto-Upload strukturiert übergeben.",
      action: "Upload-Link versandt • Foto-Eingang erwartet • Team vorbereitet",
    },
  },
];

const FALLBACK_DURATIONS: Record<string, number> = {
  rueckruf: 47,
  stromausfall: 40,
  status: 30,
  eskalation: 42,
};

export function LiveDemoSection() {
  const [activeScenarioId, setActiveScenarioId] = useState<string>(SCENARIOS[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(FALLBACK_DURATIONS[SCENARIOS[0].id]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const rafRef = useRef<number | null>(null);

  const scenario = SCENARIOS.find((s) => s.id === activeScenarioId)!;

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(FALLBACK_DURATIONS[scenario.id] || 30);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.load();
    }
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, [activeScenarioId, scenario.id]);

  const visibleMessages = useMemo(() => {
    return scenario.transcript
      .map((msg, i) => ({
        ...msg,
        endTime: scenario.transcript[i + 1]?.time ?? duration,
      }))
      .filter((msg) => msg.time <= currentTime);
  }, [scenario.transcript, currentTime, duration]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    } else {
      setIsPlaying(true);
      audioRef.current.play().catch(() => {
        let startTime = performance.now() - currentTime * 1000;
        const simulatePlayback = () => {
          const now = performance.now();
          const newTime = (now - startTime) / 1000;
          if (newTime >= duration) {
            setCurrentTime(duration);
            setIsPlaying(false);
          } else {
            setCurrentTime(newTime);
            rafRef.current = requestAnimationFrame(simulatePlayback);
          }
        };
        rafRef.current = requestAnimationFrame(simulatePlayback);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (audioRef.current) setCurrentTime(audioRef.current.duration);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const progress = Math.min(100, (currentTime / duration) * 100);
  const isComplete = currentTime >= duration - 0.5;

  const currentSpeaker = useMemo(() => {
    const active = [...scenario.transcript].reverse().find((msg) => msg.time <= currentTime);
    return active?.speaker ?? null;
  }, [currentTime, scenario.transcript]);

  const visualizerState = useMemo((): VisualizerState => {
    if (!isPlaying || isComplete) return "idle";
    if (currentSpeaker === "assistant") return "speaking";
    if (currentSpeaker === "caller") return "listening";
    return "thinking";
  }, [isPlaying, isComplete, currentSpeaker]);

  const currentMessage = visibleMessages[visibleMessages.length - 1] ?? null;

  return (
    <section id="livedemo" className="relative bg-paper pb-12 pt-10 lg:pb-14 lg:pt-12">
      <FlowGrid />
      <AmbientOrbs />
      <div className="relative mx-auto max-w-[1200px] px-6 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          {/* Left — copy + scenario picker */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
              05 — Demo · Beispielanruf
            </span>
            <h2 className="mt-4 text-[clamp(32px,4vw,52px)] font-bold leading-[1.08] tracking-[-0.025em] text-ink">
              Hören Sie einen <span className="text-leafaccent">echten Ablauf</span>.
            </h2>
            <p className="mt-5 max-w-[460px] text-[16px] leading-[1.7] text-inksoft">
              Drücken Sie Play und hören Sie, wie BaseModul einen Anruf annimmt,
              gezielt nachfragt und den Fall ans Team übergibt.
            </p>

            {/* Scenario picker — calm, compact */}
            <div className="mt-8">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
                Szenario wählen
              </span>
              <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {SCENARIOS.map((s) => {
                  const active = activeScenarioId === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setActiveScenarioId(s.id)}
                      className={`group flex items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 ${
                        active
                          ? "border-leaf/40 bg-white/[0.06]"
                          : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] border border-line bg-paperdeep transition-colors duration-200 ${
                          active ? "text-leafbright" : "text-inksoft group-hover:text-ink"
                        }`}
                      >
                        {CATEGORY_ICONS[s.category]}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={`block truncate text-[13px] font-semibold ${active ? "text-ink" : "text-inksoft"}`}>
                          {s.title}
                        </span>
                        <span className="text-[11px] text-faint">{CATEGORY_LABELS[s.category]}</span>
                      </span>
                      <span className={`h-2 w-2 shrink-0 rounded-full ${URGENCY_COLORS[s.urgency]}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right — phone call player */}
          <div className="lg:justify-self-end">
            <audio
              ref={audioRef}
              src={scenario.audioSrc}
              preload="none"
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
              onLoadedMetadata={handleLoadedMetadata}
            />
            <DemoPhone
              scenario={scenario}
              isPlaying={isPlaying}
              isComplete={isComplete}
              currentTime={currentTime}
              duration={duration}
              progress={progress}
              visualizerState={visualizerState}
              togglePlay={togglePlay}
              currentMessage={currentMessage}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Phone call-player (same device language as the hero) ────────────────── */

function DemoPhone({
  scenario,
  isPlaying,
  isComplete,
  currentTime,
  duration,
  progress,
  visualizerState,
  togglePlay,
  currentMessage,
}: {
  scenario: Scenario;
  isPlaying: boolean;
  isComplete: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  visualizerState: VisualizerState;
  togglePlay: () => void;
  currentMessage: (Scenario["transcript"][number] & { endTime: number }) | null;
}) {
  const reduce = useReducedMotion();
  const status = isComplete ? "Rückrufnotiz bereit" : isPlaying ? "KI nimmt an" : "Beispielanruf";

  return (
    <div className="relative mx-auto w-full max-w-[320px]">
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute -inset-12 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 50% 42%, rgba(34,197,94,0.14) 0%, rgba(34,211,238,0.06) 50%, transparent 72%)",
        }}
      />

      <div className="relative mx-auto w-[270px] sm:w-[290px] lg:w-[310px]">
        {/* side buttons */}
        <div className="absolute -left-[2px] top-[20%] h-[7%] w-[3px] rounded-l-sm bg-black/50" />
        <div className="absolute -left-[2px] top-[30%] h-[11%] w-[3px] rounded-l-sm bg-black/50" />
        <div className="absolute -right-[2px] top-[26%] h-[13%] w-[3px] rounded-r-sm bg-black/50" />

        <div
          className="rounded-[46px] p-[4px] shadow-[0_50px_110px_-34px_rgba(0,0,0,0.6)]"
          style={{ background: "linear-gradient(160deg,#2b2b2f,#161617 55%,#0b0b0c)" }}
        >
          <div className="rounded-[43px] bg-[#070707] p-[7px] ring-1 ring-white/[0.05]">
            <div className="relative flex aspect-[9/19.5] flex-col overflow-hidden rounded-[36px] border border-white/[0.06] bg-paperdeep px-4 pb-5 pt-4">
              {/* glass sheen */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-1/3"
                style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.10), transparent)" }}
              />

              {/* notch */}
              <div className="mx-auto flex h-[24px] w-[72px] items-center justify-center gap-2 rounded-full bg-black">
                <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
                <span className="h-1 w-6 rounded-full bg-white/15" />
              </div>

              {/* header: Live-Demo + status */}
              <div className="relative mt-4 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">Live-Demo</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-leafdimline/60 bg-leafdim/50 px-2 py-[3px] text-[10px] font-semibold text-leafbright">
                  <span className="relative flex h-1.5 w-1.5">
                    {isPlaying && !reduce && (
                      <motion.span
                        className="absolute inline-flex h-full w-full rounded-full bg-leafbright"
                        animate={{ scale: [1, 2.4], opacity: [0.5, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                      />
                    )}
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-leafbright" />
                  </span>
                  {status}
                </span>
              </div>

              {/* caller identity */}
              <div className="relative mt-4 flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-3.5 py-3 backdrop-blur-md">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-leafdimline/50 bg-leafdim/40 text-leafbright">
                  <PhoneIncoming size={18} strokeWidth={1.8} />
                </span>
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-semibold text-ink">{scenario.title}</div>
                  <div className="text-[11px] text-faint">{CATEGORY_LABELS[scenario.category]} · Beispielanruf</div>
                </div>
              </div>

              {/* live bubble / result */}
              <div className="relative mt-4 min-h-0 flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  {isComplete ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="flex h-full flex-col justify-center"
                    >
                      <div className="rounded-2xl border border-leafbright/30 bg-gradient-to-b from-leaf/15 to-leaf/[0.04] p-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={18} className="text-leafbright" strokeWidth={1.9} />
                          <span className="text-[13px] font-bold text-ink">Rückrufnotiz bereit</span>
                        </div>
                        <p className="mt-2 text-[12px] leading-snug text-inksoft">{scenario.finalResult.summary}</p>
                        <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-2.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-leafbright" />
                          <span className="font-mono text-[10px] text-faint">{scenario.finalResult.ticketId} · Team informiert</span>
                        </div>
                      </div>
                    </motion.div>
                  ) : currentMessage ? (
                    <motion.div
                      key={`${scenario.id}-${currentMessage.time}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ type: "spring", stiffness: 420, damping: 30 }}
                      className={`flex h-full items-end ${currentMessage.speaker === "assistant" ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[90%] rounded-2xl px-3.5 py-3 text-[12.5px] leading-relaxed ${
                          currentMessage.speaker === "assistant"
                            ? "rounded-bl-[4px] border border-white/10 bg-white/[0.05] text-ink"
                            : "rounded-br-[4px] border border-leaf/25 bg-leaf/[0.10] text-ink"
                        }`}
                      >
                        <span className="mb-1 block font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
                          {currentMessage.speaker === "assistant" ? "basemodul KI" : "Anrufer"}
                        </span>
                        <StreamingText
                          text={currentMessage.text}
                          startTime={currentMessage.time}
                          endTime={currentMessage.endTime}
                          currentTime={currentTime}
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex h-full flex-col items-center justify-center text-center"
                    >
                      <BarVisualizer state="idle" barCount={20} className="h-7 w-28 opacity-50" />
                      <p className="mt-3 max-w-[180px] text-[12px] leading-snug text-faint">
                        Tippen Sie auf Play und hören Sie den Anruf.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* visualizer while playing */}
              <div className="relative mt-3 h-6">
                <BarVisualizer state={visualizerState} barCount={24} className="h-full w-full" />
              </div>

              {/* play control + progress */}
              <div className="relative mt-3 flex items-center gap-3">
                <div className="relative shrink-0">
                  {!isPlaying && !isComplete && (
                    <motion.span
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 rounded-full bg-leaf"
                    />
                  )}
                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    onClick={togglePlay}
                    aria-label={isPlaying ? "Pause" : "Play"}
                    className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                      isPlaying ? "bg-white/10 text-ink hover:bg-white/20" : "bg-leafbtn text-white hover:bg-leafbtnhover"
                    }`}
                    style={
                      !isPlaying
                        ? { boxShadow: "0 0 0 1px rgba(22,163,74,0.3), 0 10px 24px -8px rgba(22,163,74,0.6)" }
                        : {}
                    }
                  >
                    {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="ml-0.5 h-5 w-5 fill-current" />}
                  </motion.button>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-leafbright transition-[width] duration-150" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="mt-1.5 flex justify-between font-mono text-[10px] text-faint tabular-nums">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function StreamingText({
  text,
  startTime,
  endTime,
  currentTime,
}: {
  text: string;
  startTime: number;
  endTime: number;
  currentTime: number;
}) {
  const words = useMemo(() => text.split(" "), [text]);
  const LEAD_SECONDS = 1.3;
  const span = Math.max(0.5, endTime - startTime);
  const progress = (currentTime - startTime + LEAD_SECONDS) / span;
  const wordsToShow = Math.min(words.length, Math.max(0, Math.ceil(progress * words.length)));
  const isDone = wordsToShow >= words.length;

  return (
    <>
      {words.slice(0, Math.max(0, wordsToShow - 1)).join(" ")}
      {wordsToShow > 1 ? " " : ""}
      {wordsToShow > 0 && (
        <motion.span
          key={wordsToShow}
          initial={{ opacity: 0.25 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          {words[wordsToShow - 1]}
        </motion.span>
      )}
      {!isDone && (
        <span className="ml-[2px] inline-block h-[1em] w-[3px] animate-pulse bg-current align-middle opacity-40" />
      )}
    </>
  );
}
