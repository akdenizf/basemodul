"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, CheckCircle2, Zap, MessageSquare, CalendarClock, Info } from "lucide-react";
import { BarVisualizer, type VisualizerState } from "./BarVisualizer";
import { AmbientOrbs } from "./AmbientOrbs";

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
  GENERAL: <Info className="h-4 w-4" />
};

const CATEGORY_LABELS = {
  PRIORITY: "Priorität",
  CHAT: "Chat",
  APPOINTMENT: "Termin",
  GENERAL: "Allgemein"
};

const URGENCY_COLORS = {
  LOW: "bg-blue-400",
  MEDIUM: "bg-amber-400",
  HIGH: "bg-red-500"
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
      { time: 38.1, speaker: "assistant", text: "Gern geschehen. Das Team bekommt Ihre Meldung strukturiert übergeben und meldet sich zur Terminabstimmung. Auf Wiederhören!" }
    ],
    finalResult: {
      ticketId: "#BM-8421",
      summary: "Rückrufwunsch mit Kontakt, Anliegen und optionalem Anhang.",
      action: "Rückrufnotiz erstellt • Team informiert • Upload-Link versandt"
    }
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
      { time: 36.0, speaker: "assistant", text: "Gerne. Das Team wird sich in Kürze bei Ihnen melden. Auf Wiederhören!" }
    ],
    finalResult: {
      ticketId: "#BM-9102",
      summary: "Dringende Kundenmeldung außerhalb der Bürozeit.",
      action: "Priorität hoch • Übergabekanal informiert • Rückruf vorbereitet"
    }
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
      { time: 24.4, speaker: "assistant", text: "Sehr gerne. Das Team meldet sich bei Bedarf vorher noch einmal. Auf Wiederhören!" }
    ],
    finalResult: {
      ticketId: "#BM-8421",
      summary: "Terminstatus abgerufen. Fr. 06. Jun. 10:30 Uhr bestätigt.",
      action: "Status erkannt • Termin bestätigt • Team nicht unterbrochen"
    }
  },
  {
    id: "eskalation",
    title: "Foto & Datei einreichen",
    category: "GENERAL",
    urgency: "MEDIUM",
    audioSrc: "/demo-eskalation.mp3",
    transcript: [
      { time: 0.0,  speaker: "assistant", text: "Guten Tag, hier ist das Telefon-Modul von basemodul.de. Ich nehme Ihr Anliegen auf. Wie kann ich Ihnen helfen?" },
      { time: 7.3,  speaker: "caller",    text: "Hallo, ich habe ein Problem bei mir im Betrieb — das ist schwer zu beschreiben, ich weiß nicht genau, woran es liegt." },
      { time: 15.9, speaker: "assistant", text: "Kein Problem. Am einfachsten geht das mit einem kurzen Foto oder Video. Ich schicke Ihnen gleich einen Upload-Link per SMS. Darf ich Ihre Handynummer kurz aufnehmen?" },
      { time: 26.3, speaker: "caller",    text: "Ja, gerne. Sie können die 0151er nehmen." },
      { time: 29.5, speaker: "assistant", text: "Perfekt. Der Link ist unterwegs. Schicken Sie das Foto, sobald Sie können — das Team bekommt Ihre Meldung mit dem Bild direkt übergeben." },
      { time: 39.0, speaker: "caller",    text: "Super, vielen Dank." },
      { time: 40.1, speaker: "assistant", text: "Sehr gerne. Auf Wiederhören!" }
    ],
    finalResult: {
      ticketId: "#BM-7033",
      summary: "Unklares Anliegen per Foto-Upload strukturiert übergeben.",
      action: "Upload-Link versandt • Foto-Eingang erwartet • Team vorbereitet"
    }
  }
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
  const scrollRef = useRef<HTMLDivElement>(null);
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
        endTime: scenario.transcript[i + 1]?.time ?? duration
      }))
      .filter((msg) => msg.time <= currentTime);
  }, [scenario.transcript, currentTime, duration]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleMessages.length]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    } else {
      setIsPlaying(true);
      audioRef.current.play().catch(() => {
        let startTime = performance.now() - (currentTime * 1000);
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

  return (
    <section id="livedemo" className="relative bg-paper py-20">
      <AmbientOrbs />
      <div className="relative mx-auto max-w-[1200px] px-6 lg:px-12">

        {/* Header */}
        <div className="mb-14 max-w-2xl">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
            Demo Lab — Beispielablauf
          </span>
          <h2 className="mt-4 text-[clamp(32px,4vw,52px)] font-bold leading-[1.08] tracking-[-0.025em] text-ink">
            Hören Sie einen <span className="text-leafaccent">echten Ablauf</span>.
          </h2>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-inksoft">
            Dieselbe Logik wie oben — diesmal zum Anhören. Wählen Sie ein Szenario
            und verfolgen Sie, wie das Modul nachfragt, Dringlichkeit erkennt und
            einen Fall übergibt.
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">

          {/* Scenario sidebar */}
          <div className="flex w-full shrink-0 flex-col gap-3 lg:w-[300px]">
            <div className="mb-1 px-1">
              <span className="font-mono text-[10px] uppercase tracking-widest text-faint">
                Szenarien
              </span>
            </div>
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveScenarioId(s.id)}
                className={`relative flex flex-col items-start gap-3 rounded-[12px] border p-4 text-left transition-all duration-200 ${
                  activeScenarioId === s.id
                    ? "border-[rgba(22,163,74,0.35)] bg-surface2"
                    : "border-line bg-paper2 hover:bg-surface2"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-paper text-inksoft">
                      {CATEGORY_ICONS[s.category]}
                    </div>
                    <span className="text-[12px] font-medium text-inksoft">
                      {CATEGORY_LABELS[s.category]}
                    </span>
                  </div>
                  <div className={`h-2 w-2 rounded-full ${URGENCY_COLORS[s.urgency]}`} />
                </div>
                <h3
                  className={`text-[15px] font-bold tracking-tight ${
                    activeScenarioId === s.id ? "text-ink" : "text-inksoft"
                  }`}
                >
                  {s.title}
                </h3>
              </button>
            ))}
          </div>

          {/* Main stage */}
          <div className="glass-surface relative flex h-[620px] flex-1 flex-col overflow-hidden rounded-[14px]">
            <audio
              ref={audioRef}
              src={scenario.audioSrc}
              preload="none"
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
              onLoadedMetadata={handleLoadedMetadata}
            />

            {/* Control bar */}
            <div className="z-20 flex items-center justify-between border-b border-line bg-paper2/80 px-6 py-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="relative flex h-2.5 w-2.5">
                  {isPlaying && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-leaf opacity-60" />
                  )}
                  <span
                    className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                      isPlaying ? "bg-leaf" : "bg-white/20"
                    }`}
                  />
                </div>
                <span className="font-mono text-[11px] uppercase tracking-widest text-faint">
                  Modul-Demo
                </span>
              </div>

              <div className="flex flex-1 max-w-[400px] items-center justify-end gap-5">
                <div className="h-8 w-32 flex items-end justify-center">
                  <BarVisualizer state={visualizerState} barCount={28} className="h-full w-full" />
                </div>
                <span className="w-10 text-right font-mono text-[12px] text-faint tabular-nums">
                  {formatTime(currentTime)}
                </span>
                <div className="relative">
                  {!isPlaying && (
                    <motion.div
                      animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 rounded-full bg-leaf"
                    />
                  )}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={togglePlay}
                    className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors ${
                      isPlaying
                        ? "bg-white/10 text-ink hover:bg-white/20"
                        : "bg-leafbtn text-white hover:bg-leafbtnhover"
                    }`}
                    style={
                      !isPlaying
                        ? { boxShadow: "0 0 0 1px rgba(22,163,74,0.3), 0 8px 20px -8px rgba(22,163,74,0.5)" }
                        : {}
                    }
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5 fill-current" />
                    ) : (
                      <Play className="h-5 w-5 fill-current ml-0.5" />
                    )}
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Transcript area */}
            <div className="relative flex-1 overflow-hidden bg-paper">
              <div
                ref={scrollRef}
                className="absolute inset-0 flex flex-col gap-5 overflow-y-auto p-6 pb-36 scroll-smooth"
              >
                <AnimatePresence mode="popLayout">
                  {visibleMessages.map((msg, idx) => (
                    <motion.div
                      key={`${scenario.id}-${idx}`}
                      initial={{ opacity: 0, y: 15, scale: 0.98 }}
                      animate={{ opacity: isComplete ? 0.4 : 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className={`flex ${msg.speaker === "assistant" ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[78%] rounded-[14px] px-5 py-3.5 text-[14.5px] leading-relaxed ${
                          msg.speaker === "assistant"
                            ? "rounded-tl-[4px] border border-line bg-paper2 text-ink"
                            : "rounded-tr-[4px] border border-[rgba(22,163,74,0.25)] bg-[rgba(22,163,74,0.08)] text-ink"
                        } ${
                          isPlaying && idx === visibleMessages.length - 1 && msg.speaker === "assistant"
                            ? "ring-1 ring-leaf/30"
                            : ""
                        }`}
                      >
                        <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-faint">
                          {msg.speaker === "assistant" ? "basemodul KI" : "Anrufer"}
                        </span>
                        {msg.text.length > 0 && (
                          <StreamingText
                            text={msg.text}
                            startTime={msg.time}
                            endTime={msg.endTime}
                            currentTime={currentTime}
                          />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing indicator */}
                <AnimatePresence>
                  {isPlaying &&
                    !isComplete &&
                    visibleMessages[visibleMessages.length - 1]?.speaker === "caller" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex justify-start"
                      >
                        <div className="flex h-[48px] items-center gap-1.5 rounded-[14px] rounded-tl-[4px] border border-line bg-paper2 px-5 py-4">
                          <motion.span
                            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                            className="h-1.5 w-1.5 rounded-full bg-faint"
                          />
                          <motion.span
                            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                            className="h-1.5 w-1.5 rounded-full bg-faint"
                          />
                          <motion.span
                            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                            className="h-1.5 w-1.5 rounded-full bg-faint"
                          />
                        </div>
                      </motion.div>
                    )}
                </AnimatePresence>
              </div>

              {/* Success result overlay */}
              <AnimatePresence>
                {isComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.2 }}
                    className="absolute bottom-6 left-6 right-6 z-30"
                  >
                    <div
                      className="rounded-[14px] border border-[rgba(22,163,74,0.35)] bg-paper2 p-5"
                      style={{ boxShadow: "0 20px 50px -15px rgba(0,0,0,0.5)" }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(22,163,74,0.35)] bg-[rgba(22,163,74,0.08)]">
                          <CheckCircle2 className="h-5 w-5 text-leaf" />
                        </div>
                        <div>
                          <div className="mb-1 flex items-center gap-3">
                            <h4 className="text-[16px] font-bold text-ink">
                              Fall {scenario.finalResult.ticketId} erstellt
                            </h4>
                            <span className="rounded-[6px] border border-line bg-paper px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-faint">
                              Übergabe
                            </span>
                          </div>
                          <p className="mb-4 text-[14px] text-inksoft">
                            {scenario.finalResult.summary}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[rgba(22,163,74,0.35)] bg-[rgba(22,163,74,0.08)]">
                              <span className="h-1.5 w-1.5 rounded-full bg-leaf" />
                            </span>
                            <span className="text-[12px] font-medium text-inksoft">
                              {scenario.finalResult.action}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom fade */}
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-28 bg-gradient-to-t from-paper to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
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
