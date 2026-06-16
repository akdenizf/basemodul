"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, CheckCircle2, Zap, Droplets, Thermometer, Info } from "lucide-react";
import { BarVisualizer, type VisualizerState } from "./BarVisualizer";

interface Scenario {
  id: string;
  title: string;
  category: "ELECTRICAL" | "PLUMBING" | "HEATING" | "GENERAL";
  urgency: "LOW" | "MEDIUM" | "HIGH";
  audioSrc: string;
  transcript: {
    time: number;
    speaker: "assistant" | "tenant";
    text: string;
  }[];
  finalResult: {
    ticketId: string;
    summary: string;
    action: string;
  };
}

const CATEGORY_ICONS = {
  ELECTRICAL: <Zap className="h-4 w-4" />,
  PLUMBING: <Droplets className="h-4 w-4" />,
  HEATING: <Thermometer className="h-4 w-4" />,
  GENERAL: <Info className="h-4 w-4" />
};

const CATEGORY_LABELS = {
  ELECTRICAL: "Elektro",
  PLUMBING: "Sanitär",
  HEATING: "Heizung",
  GENERAL: "Allgemein"
};

const URGENCY_COLORS = {
  LOW: "bg-blue-400",
  MEDIUM: "bg-amber-400",
  HIGH: "bg-red-500"
};

const SCENARIOS: Scenario[] = [
  {
    id: "siphon",
    title: "Tropfender Siphon",
    category: "PLUMBING",
    urgency: "MEDIUM",
    audioSrc: "/demo.mp3",
    transcript: [
      { time: 0.0, speaker: "assistant", text: "Guten Tag, hier ist der digitale Anfrage-Assistent. Ich nehme Ihr Anliegen auf. Wie kann ich Ihnen behilflich sein?" },
      { time: 7.1, speaker: "tenant", text: "Hallo, hier ist Müller aus der Hauptstraße 12. Bei mir tropft der Siphon im Bad." },
      { time: 13.4, speaker: "assistant", text: "Guten Tag Herr Müller. Ich habe Ihr Profil gefunden. Hauptstraße 12, Erdgeschoss. Steht schon ein Eimer darunter?" },
      { time: 20.5, speaker: "tenant", text: "Ja, Eimer steht drunter, aber es ist schon ziemlich nass." },
      { time: 23.9, speaker: "assistant", text: "Alles klar. Ich lege sofort ein Ticket für Sie an und informiere unseren Sanitär-Partner. Sie erhalten gleich eine SMS mit einem Link, um ein kurzes Foto hochzuladen." },
      { time: 36.1, speaker: "tenant", text: "Super, mache ich. Danke!" },
      { time: 36.9, speaker: "assistant", text: "Gern geschehen. Ein Handwerker wird sich in Kürze bei Ihnen zur Terminvereinbarung melden. Auf Wiederhören!" }
    ],
    finalResult: {
      ticketId: "#AQ-8421",
      summary: "Tropfender Siphon im Bad, Eimer untergestellt.",
      action: "Ticket erstellt in 0.4s • Handwerker informiert • SMS versandt"
    }
  },
  {
    id: "stromausfall",
    title: "Kompletter Stromausfall",
    category: "ELECTRICAL",
    urgency: "HIGH",
    audioSrc: "/demo-strom.mp3",
    transcript: [
      { time: 0.0, speaker: "assistant", text: "Guten Tag, hier ist der digitale Anfrage-Assistent. Ich nehme Ihr Anliegen auf. Wie kann ich Ihnen behilflich sein?" },
      { time: 7.8, speaker: "tenant", text: "Ja, hallo. Bei uns im gesamten Erdgeschoss ist der Strom weg." },
      { time: 12.4, speaker: "assistant", text: "Das verstehe ich. Haben Sie bereits den Sicherungskasten überprüft, ob der FI-Schalter herausgesprungen ist?" },
      { time: 19.5, speaker: "tenant", text: "Ja, habe ich probiert, aber er springt immer wieder sofort raus." },
      { time: 23.1, speaker: "assistant", text: "In Ordnung. Da der Kühlschrank betroffen ist, setze ich die Dringlichkeit auf Hoch. Ein Notfall-Elektriker wird umgehend benachrichtigt." },
      { time: 32.0, speaker: "tenant", text: "Vielen Dank, das ist super." },
      { time: 35.1, speaker: "assistant", text: "Gerne. Er wird sich in den nächsten 15 Minuten bei Ihnen melden. Auf Wiederhören!" }
    ],
    finalResult: {
      ticketId: "#AQ-9102",
      summary: "Stromausfall EG, FI-Schalter springt wieder raus.",
      action: "Ticket erstellt in 0.3s • Notfall-Elektriker priorisiert"
    }
  },
  {
    id: "status",
    title: "Status-Abfrage: Wann kommt der Handwerker?",
    category: "GENERAL",
    urgency: "LOW",
    audioSrc: "/demo-status.mp3",
    transcript: [
      { time: 0.0, speaker: "assistant", text: "Guten Tag, hier ist der digitale Anfrage-Assistent. Ich nehme Ihr Anliegen auf. Wie kann ich Ihnen behilflich sein?" },
      { time: 7.1, speaker: "tenant", text: "Ja, hallo, hier ist Müller, Hauptstraße 12. Ich wollte mal nachfragen, wann der Handwerker wegen meines Siphons kommt." },
      { time: 13.3, speaker: "assistant", text: "Guten Tag Herr Müller. Ich sehe hier Ihr Ticket vom Dienstag. Der Sanitärbetrieb Schulze ist bereits beauftragt und hat den Termin für morgen, Freitag den 6. Juni um 10:30 Uhr, eingetragen." },
      { time: 25.8, speaker: "tenant", text: "Super, das passt. Danke!" },
      { time: 26.5, speaker: "assistant", text: "Sehr gerne. Der Handwerker wird sich vorher noch kurz bei Ihnen melden. Auf Wiederhören!" }
    ],
    finalResult: {
      ticketId: "#AQ-8421",
      summary: "Ticket-Status abgerufen. Termin Fr. 06. Jun. 10:30 Uhr bestätigt.",
      action: "Ticket-Status in 0.2s geladen • Kein Mitarbeiter nötig"
    }
  },
  {
    id: "eskalation",
    title: "Eskalation: Es ist schlimmer geworden!",
    category: "PLUMBING",
    urgency: "HIGH",
    audioSrc: "/demo-eskalation.mp3",
    transcript: [
      { time: 0.0, speaker: "assistant", text: "Guten Tag, hier ist der digitale Anfrage-Assistent. Ich nehme Ihr Anliegen auf. Wie kann ich Ihnen behilflich sein?" },
      { time: 7.0, speaker: "tenant", text: "Hallo, hier ist Müller, Hauptstraße 12. Wegen dem Siphon im Bad — das Wasser spritzt jetzt richtig raus, der Flur steht schon unter Wasser!" },
      { time: 16.7, speaker: "assistant", text: "Herr Müller, ich sehe Ihr bestehendes Ticket. Ich stufe den Vorfall sofort als kritischen Notfall ein. Drehen Sie bitte sofort den Hauptwasserhahn ab, falls möglich. Ich alarmiere jetzt unseren Notdienst-Installateur." },
      { time: 30.6, speaker: "tenant", text: "Okay, ich drehe ihn ab. Danke!" },
      { time: 32.9, speaker: "assistant", text: "Er wird Sie in den nächsten fünf Minuten zurückrufen. Ihr Ticket ist auf Dringlichkeit Kritisch hochgestuft. Auf Wiederhören!" }
    ],
    finalResult: {
      ticketId: "#AQ-8421",
      summary: "Bestehendes Ticket auf KRITISCH hochgestuft. Kein Duplikat erstellt.",
      action: "Ticket eskaliert in 0.3s • Notdienst alarmiert • SMS versandt"
    }
  }
];

const FALLBACK_DURATIONS: Record<string, number> = {
  siphon: 44,
  stromausfall: 40,
  status: 32,
  eskalation: 41};

export function LiveDemoSection() {
  const [activeScenarioId, setActiveScenarioId] = useState<string>(SCENARIOS[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(FALLBACK_DURATIONS[SCENARIOS[0].id]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Animation framing ref for fallback timeline
  const rafRef = useRef<number | null>(null);

  const scenario = SCENARIOS.find((s) => s.id === activeScenarioId)!;

  // Cleanup on scenario change
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(FALLBACK_DURATIONS[scenario.id] || 30);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.load();
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
  }, [activeScenarioId, scenario.id]);

  // Enrich each line with its end time (= next line's start, or audio end for the last line)
  // so each line's words can be paced across its real spoken window.
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
        // Fallback simulate playback
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
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      setCurrentTime(audioRef.current.duration);
    }
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const progress = Math.min(100, (currentTime / duration) * 100);
  const isComplete = currentTime >= duration - 0.5;

  // ── Derive current speaker from transcript timestamps ──────────────────────
  const currentSpeaker = useMemo(() => {
    const active = [...scenario.transcript]
      .reverse()
      .find((msg) => msg.time <= currentTime);
    return active?.speaker ?? null;
  }, [currentTime, scenario.transcript]);

  const visualizerState = useMemo((): VisualizerState => {
    if (!isPlaying || isComplete) return "idle";
    if (currentSpeaker === "assistant") return "speaking";
    if (currentSpeaker === "tenant") return "listening";
    return "thinking";
  }, [isPlaying, isComplete, currentSpeaker]);

  return (
    <section id="livedemo" className="relative overflow-hidden bg-[#FAFAFA] py-24 sm:py-32 font-display">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-20">
          <h2 className="font-display tracking-tighter text-[42px] font-bold leading-[1.05] text-slate-900 sm:text-[52px]">
            So natürlich klingt <span className="text-[#19E66F]">echte Entlastung</span>.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-500 max-w-2xl mx-auto">
            Wählen Sie ein typisches Szenario aus dem Betriebsalltag. Hören Sie live, wie AGENTEQ Anrufe entgegennimmt, Störungen qualifiziert und als fertiges Ticket dokumentiert.
          </p>
        </div>

        {/* Dashboard Container */}
        <div className="mx-auto max-w-[1100px]">
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Scenario Navigation Sidebar */}
            <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-3">
              <div className="mb-2 px-1">
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Live Szenarien</span>
              </div>
              {SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveScenarioId(s.id)}
                  className={`relative flex flex-col items-start gap-3 rounded-[1.5rem] border p-5 text-left transition-all duration-300 ${
                    activeScenarioId === s.id
                      ? "border-slate-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
                      : "border-transparent hover:bg-white/60"
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-600`}>
                        {CATEGORY_ICONS[s.category]}
                      </div>
                      <span className="text-xs font-bold text-slate-500">{CATEGORY_LABELS[s.category]}</span>
                    </div>
                    <div className={`h-2 w-2 rounded-full ${URGENCY_COLORS[s.urgency]}`} />
                  </div>
                  <h3 className={`font-display text-[15px] font-bold tracking-tight ${activeScenarioId === s.id ? "text-slate-900" : "text-slate-600"}`}>
                    {s.title}
                  </h3>
                </button>
              ))}
            </div>

            {/* Main Interactive Stage */}
            <div className="flex-1 bg-white rounded-[2rem] border border-gray-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col relative h-[650px]">
              
              <audio
                ref={audioRef}
                src={scenario.audioSrc}
                preload="none"
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                onLoadedMetadata={handleLoadedMetadata}
              />

              {/* Top Control Bar */}
              <div className="flex items-center justify-between border-b border-gray-100 bg-white/50 px-8 py-4 backdrop-blur-md z-20">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-2.5 w-2.5">
                      {isPlaying && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#19E66F] opacity-60" />}
                      <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${isPlaying ? "bg-[#19E66F]" : "bg-slate-300"}`} />
                    </div>
                    <span className="text-[12px] font-bold tracking-widest text-slate-400 uppercase">Live Engine</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-5 flex-1 max-w-[420px] justify-end">
                  {/* Bar Visualizer — synced to speaker state */}
                  <div className="h-8 w-36 flex items-end justify-center">
                    <BarVisualizer
                      state={visualizerState}
                      barCount={32}
                      className="h-full w-full"
                    />
                  </div>

                  <span className="text-xs font-bold text-slate-400 font-mono w-10 text-right tabular-nums">
                    {formatTime(currentTime)}
                  </span>

                  <div className="relative ml-2">
                    {!isPlaying && (
                      <motion.div
                        animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-full bg-[#19E66F]"
                      />
                    )}
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={togglePlay}
                      className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full shadow-lg transition-colors ${
                        isPlaying 
                          ? "bg-slate-800 text-white hover:bg-slate-900" 
                          : "bg-[#19E66F] text-[#0f1714] shadow-[#19E66F]/30 hover:bg-[#15cc61]"
                      }`}
                    >
                      {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-1" />}
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Transcript Area */}
              <div 
                className="relative flex-1 overflow-hidden bg-[#FAFAFA]"
              >
                <div 
                  ref={scrollRef}
                  className="absolute inset-0 overflow-y-auto p-8 flex flex-col gap-6 scroll-smooth pb-40"
                >
                  <AnimatePresence mode="popLayout">
                    {visibleMessages.map((msg, idx) => (
                      <motion.div
                        key={`${scenario.id}-${idx}`}
                        initial={{ opacity: 0, y: 15, scale: 0.98 }}
                        animate={{ opacity: isComplete ? 0.4 : 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className={`flex ${msg.speaker === 'assistant' ? 'justify-start' : 'justify-end'}`}
                      >
                        <div 
                          className={`max-w-[75%] rounded-[1.25rem] px-6 py-4 text-[15px] leading-relaxed shadow-sm
                            ${msg.speaker === 'assistant' 
                              ? 'bg-white border border-gray-100 text-slate-800 rounded-tl-sm' 
                              : 'bg-slate-800 border border-slate-700 text-white rounded-tr-sm'
                            }
                            ${isPlaying && idx === visibleMessages.length - 1 && msg.speaker === 'assistant' ? 'ring-1 ring-[#19E66F] shadow-[0_0_20px_rgba(25,230,111,0.1)]' : ''}
                          `}
                        >
                          <span className={`block text-[10px] font-bold uppercase tracking-widest mb-1.5 ${msg.speaker === 'assistant' ? 'text-slate-400' : 'text-slate-400'}`}>
                            {msg.speaker === 'assistant' ? 'AGENTEQ KI' : 'Anrufer'}
                          </span>
                          {msg.text.length > 0 && (
                            <StreamingText text={msg.text} startTime={msg.time} endTime={msg.endTime} currentTime={currentTime} />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {/* Typing Indicator */}
                  <AnimatePresence>
                    {isPlaying && !isComplete && visibleMessages[visibleMessages.length - 1]?.speaker === 'tenant' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex justify-start"
                      >
                        <div className="bg-white border border-gray-100 rounded-[1.25rem] rounded-tl-sm px-5 py-4 flex gap-1.5 items-center h-[52px] shadow-sm">
                          <motion.span animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} className="h-1.5 w-1.5 bg-slate-300 rounded-full" />
                          <motion.span animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="h-1.5 w-1.5 bg-slate-300 rounded-full" />
                          <motion.span animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="h-1.5 w-1.5 bg-slate-300 rounded-full" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Final Magic Success Dashboard Widget */}
                <AnimatePresence>
                  {isComplete && (
                    <motion.div
                      initial={{ opacity: 0, y: 40, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.2 }}
                      className="absolute bottom-8 left-8 right-8 z-30"
                    >
                      <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]">
                        <div className="flex items-start gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#19E66F]/10">
                            <CheckCircle2 className="h-5 w-5 text-[#19E66F]" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-display text-[16px] font-bold text-slate-900">
                                Ticket {scenario.finalResult.ticketId} erstellt
                              </h4>
                              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                System-Log
                              </span>
                            </div>
                            <p className="text-[14px] text-slate-600 mb-4">{scenario.finalResult.summary}</p>
                            
                            <div className="flex items-center gap-2">
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#19E66F]"></span>
                              </span>
                              <span className="text-[12px] font-bold text-slate-500">{scenario.finalResult.action}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Fade Out Gradient at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAFAFA] to-transparent pointer-events-none z-20" />
              </div>

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

function StreamingText({ text, startTime, endTime, currentTime }: { text: string; startTime: number; endTime: number; currentTime: number }) {
  const words = useMemo(() => text.split(" "), [text]);

  // Reveal words evenly across the line's real spoken window [startTime, endTime],
  // so the rhythm tracks the actual audio instead of a fixed character rate.
  // LEAD_SECONDS makes the text run slightly ahead of the spoken audio.
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
        <span className="inline-block w-[3px] h-[1em] ml-[2px] align-middle bg-current opacity-40 animate-pulse" />
      )}
    </>
  );
}
