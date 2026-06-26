"use client";

import { motion } from "framer-motion";
import {
  PhoneMissed,
  Wrench,
  CalendarClock,
  ArrowRight,
  ArrowUpRight,
  Lock,
} from "lucide-react";

// Static live-feed: [Eingang] → [Modul] → [Ergebnis] — keine Animation, kein Scrolling
const FEED = [
  {
    icon: PhoneMissed,
    input: "Anruf verpasst",
    mod: "Telefon-Modul",
    result: "Rückrufnotiz bereit",
    time: "vor 2 Min.",
  },
  {
    icon: Wrench,
    input: "Störung gemeldet",
    mod: "Notdienst-Modul",
    result: "Techniker alarmiert",
    time: "vor 6 Min.",
  },
  {
    icon: CalendarClock,
    input: "Terminwunsch",
    mod: "Kalender-Modul",
    result: "Rückruf vorbereitet",
    time: "vor 14 Min.",
  },
];

export function HeroSection() {
  return (
    <section className="relative flex overflow-hidden bg-paper pb-10 pt-10 sm:pb-14 sm:pt-16 lg:pb-20 lg:pt-20">
      {/* subtle operations grid — fades out at edges */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 70% at 50% 28%, #000 0%, transparent 76%)",
          maskImage:
            "radial-gradient(ellipse 90% 70% at 50% 28%, #000 0%, transparent 76%)",
        }}
      />
      {/* faint green wash — top center, no orb */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% -10%, rgba(22,163,74,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1200px] grid-cols-1 items-center gap-10 px-6 sm:gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-12">
        {/* Left — copy */}
        <div>
          {/* Pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-[7px] rounded-full border border-leafdimline bg-leafdim px-3 py-[5px] text-[11px] font-semibold uppercase tracking-[0.06em] text-leafbright"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-leafbright" />
            Für Handwerk, Notdienste &amp; Servicebetriebe
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.05 }}
            className="mt-5 text-[clamp(36px,10.2vw,68px)] font-extrabold leading-[1.06] tracking-[-0.035em] text-ink sm:mt-6"
          >
            <span className="block">Der KI-Telefonassistent</span>
            <span className="block text-green-400">für Servicebetriebe.</span>
          </motion.h1>

          {/* Lead */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12 }}
            className="mt-5 max-w-[520px] text-[16px] leading-[1.62] text-[#A1A1AA] sm:mt-6 sm:text-[18px] sm:leading-[1.7]"
          >
            BASEMODULE nimmt Anrufe entgegen, fragt fehlende Infos ab und übergibt
            Rückrufnotizen, Termine oder Notfälle direkt ans Team.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.16 }}
            className="mt-3 text-[14px] font-medium leading-relaxed text-[#52525B]"
          >
            Für SHK-Betriebe, Kältetechnik, Facility und technischen Service.
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="mt-7 flex flex-col items-stretch gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3.5"
          >
            <a
              href="#cta"
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-leafbtn px-7 py-3.5 text-[15px] font-bold text-white transition-all duration-200 hover:bg-leafbtnhover hover:-translate-y-px"
            >
              Demo anfragen
              <ArrowUpRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
            <a
              href="#modules"
              className="inline-flex items-center justify-center rounded-lg border border-[#444] px-7 py-3.5 text-[15px] font-semibold text-[#D4D4D8] transition-all duration-200 hover:border-[#666] hover:text-white hover:bg-white/[0.04]"
            >
              Module ansehen
            </a>
            <span className="flex items-center gap-[7px] text-[12px] text-faint">
              <Lock size={14} strokeWidth={2} />
              DSGVO · Server in Frankfurt
            </span>
          </motion.div>
        </div>

        {/* Right — live operations feed (static) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28 }}
          className="w-full lg:max-w-[440px] lg:justify-self-end"
        >
          <div className="glass-surface overflow-hidden rounded-2xl">
            {/* header */}
            <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-leafbright shadow-[0_0_0_3px_rgba(74,222,128,0.18)]" />
                <span className="text-[13px] font-semibold text-ink">Live-Betrieb</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
                <span>Heute</span>
                <span className="h-1 w-1 rounded-full bg-faint" />
                <span>3 Eingänge</span>
              </div>
            </div>

            {/* rows */}
            <div>
              {FEED.map((f) => (
                <div
                  key={f.input}
                  className="flex items-start gap-3.5 border-b border-linesoft px-5 py-[18px] last:border-b-0"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-line bg-paperdeep text-label">
                    <f.icon size={16} strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-[14px] font-semibold text-ink">{f.input}</span>
                      <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.06em] text-faint">
                        {f.time}
                      </span>
                    </div>
                    <div className="mt-[5px] flex flex-wrap items-center gap-1.5 text-[12px]">
                      <span className="text-inksoft">{f.mod}</span>
                      <ArrowRight size={12} className="shrink-0 text-faint" />
                      <span className="font-semibold text-leafbright">{f.result}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* footer */}
            <div className="flex items-center gap-2 border-t border-line bg-paperdeep px-5 py-3">
              <Lock size={12} className="text-faint" strokeWidth={2} />
              <span className="text-[11px] text-faint">
                Teamübergabe erstellt · 1 Rückruf offen
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
