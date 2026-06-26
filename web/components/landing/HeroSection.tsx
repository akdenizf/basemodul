"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Lock, PhoneIncoming, Check, Users } from "lucide-react";

export function HeroSection() {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex overflow-hidden bg-paper pb-6 pt-10 sm:pb-8 sm:pt-16 lg:pb-10 lg:pt-20">
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
      {/* untere Naht — weicher grüner Auslauf nach unten, fließt in die nächste Sektion */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{
          background:
            "radial-gradient(ellipse 60% 100% at 50% 120%, rgba(34,197,94,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1200px] grid-cols-1 items-center gap-6 px-6 sm:gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-12">
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
            BaseModul nimmt Anrufe entgegen, fragt fehlende Infos ab und übergibt
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

        {/* Right — minimal call mockup: phone as a quiet product symbol */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[260px] sm:max-w-[300px] lg:max-w-none lg:translate-x-6 lg:translate-y-6 lg:justify-self-end"
        >
          {/* ambient green glow behind the device */}
          <div
            className="pointer-events-none absolute -inset-12 -z-10"
            style={{
              background:
                "radial-gradient(ellipse 55% 50% at 55% 40%, rgba(34,197,94,0.12) 0%, transparent 70%)",
            }}
          />

          {/* floating: callback note — desktop only */}
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.0, duration: 0.5, ease: "easeOut" }}
            className="absolute -left-4 top-20 z-20 hidden lg:block"
          >
            <motion.div
              animate={reduce ? undefined : { y: [0, -6, 0] }}
              transition={reduce ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="w-[170px] rounded-xl border border-white/10 bg-[#141414]/85 p-3 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.85)] backdrop-blur-md"
            >
              <div className="mb-1.5 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-faint">
                <span className="h-1 w-1 rounded-full bg-leafbright" />
                Rückrufnotiz
              </div>
              <div className="text-[12px] font-semibold leading-snug text-ink">
                Heizungsausfall · Rückruf gewünscht
              </div>
              <div className="mt-1 font-mono text-[10px] text-inksoft">22:47 · Bereitschaft</div>
            </motion.div>
          </motion.div>

          {/* floating: status pill — desktop only */}
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.5, ease: "easeOut" }}
            className="absolute -right-2 bottom-28 z-20 hidden lg:block"
          >
            <motion.div
              animate={reduce ? undefined : { y: [0, 6, 0] }}
              transition={reduce ? undefined : { duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-[#141414]/85 px-2.5 py-1 text-[10px] font-semibold text-inksoft shadow-[0_12px_30px_-12px_rgba(0,0,0,0.8)] backdrop-blur-md"
            >
              <Users size={11} className="text-leafbright" strokeWidth={2} />
              Team informiert
            </motion.div>
          </motion.div>

          {/* device frame — real, tall iPhone proportions */}
          <div className="relative mx-auto w-[200px] sm:w-[240px] lg:w-[290px]">
            {/* side buttons for realism */}
            <div className="absolute -left-[2px] top-[110px] h-9 w-[3px] rounded-l-sm bg-[#0c0c0d]" />
            <div className="absolute -left-[2px] top-[156px] h-14 w-[3px] rounded-l-sm bg-[#0c0c0d]" />
            <div className="absolute -right-[2px] top-[132px] h-16 w-[3px] rounded-r-sm bg-[#0c0c0d]" />

            <div className="rounded-[46px] bg-gradient-to-b from-[#2b2b2f] via-[#161617] to-[#0b0b0c] p-[4px] shadow-[0_50px_110px_-34px_rgba(0,0,0,0.92)]">
              <div className="rounded-[43px] bg-[#070707] p-[7px] ring-1 ring-white/[0.05]">
                <div className="relative flex aspect-[9/19.5] flex-col overflow-hidden rounded-[36px] border border-white/[0.06] bg-paperdeep px-5 pb-7 pt-4">
                  {/* camera / notch pill */}
                  <div className="mx-auto flex h-[26px] w-[78px] items-center justify-center gap-2 rounded-full bg-black">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
                    <span className="h-1 w-7 rounded-full bg-white/10" />
                  </div>

                  {/* top label */}
                  <div className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                    Aktiver Anruf
                  </div>

                  {/* center · incoming call (1 · 2) */}
                  <div className="flex flex-1 flex-col items-center justify-center text-center">
                    <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full border border-leafdimline/50 bg-leafdim/40 text-leafbright">
                      <PhoneIncoming size={30} strokeWidth={1.7} />
                    </span>
                    <div className="mt-5 text-[16px] font-semibold text-ink">
                      Eingehender Anruf
                    </div>
                    <div className="mt-1 font-mono text-[12px] tracking-wide text-inksoft">
                      +49 176 24 •• •••
                    </div>

                    {/* 3 · status: KI nimmt an */}
                    <div className="mt-7 flex items-center gap-2 rounded-full border border-leafdimline/50 bg-leafdim/40 px-4 py-2 text-[13px] font-semibold text-leafbright">
                      <span className="relative flex h-1.5 w-1.5">
                        {!reduce && (
                          <motion.span
                            className="absolute inline-flex h-full w-full rounded-full bg-leafbright"
                            animate={{ scale: [1, 2.4], opacity: [0.5, 0] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                          />
                        )}
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-leafbright" />
                      </span>
                      KI nimmt an
                    </div>
                  </div>

                  {/* 4 · result: callback note ready */}
                  <div className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-paper2 py-3 text-[13px] font-medium text-label">
                    <Check size={15} className="text-leafbright" strokeWidth={2.5} />
                    Rückrufnotiz bereit
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
