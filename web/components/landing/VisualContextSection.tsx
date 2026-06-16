"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.14 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 24 } },
};

export function VisualContextSection() {
  return (
    <motion.section
      id="features"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="relative overflow-hidden bg-[#fafaf8] py-28 lg:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">

          {/* Left: copy */}
          <div className="flex flex-col gap-8">
            <motion.div variants={item}>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#19e66f]">
                Visueller Kontext
              </p>
              <h2
                className="font-display text-[38px] font-bold leading-[1.08] tracking-[-0.025em] text-slate-900 sm:text-[46px]"
              >
                Das Telefon ist blind.
                <br />
                <span className="text-slate-400">AGENTEQ sieht hin.</span>
              </h2>
            </motion.div>

            <motion.p variants={item} className="max-w-md text-[16px] leading-[1.7] text-slate-500">
              Der Kunde beschreibt das Problem am Telefon. AGENTEQ schickt sofort
              einen SMS-Link für den Foto-Upload. Sekunden später sehen Sie das Problem
              live in Ihrem Dashboard — noch während das Gespräch läuft.
            </motion.p>

            <motion.ul variants={item} className="flex flex-col gap-4">
              {[
                { icon: "sms", text: "Automatischer SMS-Link nach dem Anruf" },
                { icon: "photo_camera", text: "Foto direkt im Ticket verknüpft" },
                { icon: "verified", text: "Rechtssichere Dokumentation" },
              ].map((point) => (
                <li key={point.text} className="flex items-center gap-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#19e66f]/10">
                    <span className="material-symbols-outlined text-[17px] text-[#19e66f]">{point.icon}</span>
                  </span>
                  <span className="text-[15px] font-medium text-slate-700">{point.text}</span>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Right: Dashboard mockup with rohrbruch.png */}
          <motion.div variants={item} className="relative">
            {/* Double Bezel Card — the "dashboard" frame */}
            <div className="relative rounded-[2.5rem] bg-slate-50 p-2 border border-slate-100 shadow-[0_0_0_1px_rgba(0,0,0,0.02)]">
              <div className="overflow-hidden rounded-[calc(2.5rem-0.5rem)] border border-slate-200/50 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,1)]">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-300" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                </div>
                <div className="mx-auto flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1">
                  <span className="material-symbols-outlined text-[12px] text-slate-400">lock</span>
                  <span className="font-mono text-[11px] text-slate-400">app.agenteq.de/tickets/8421</span>
                </div>
              </div>

              {/* Ticket header */}
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-blue-600">
                    Neu
                  </span>
                  <span className="font-mono text-xs text-slate-400">#AQ-8421</span>
                </div>
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#19e66f] opacity-60" />
                    <span className="relative h-2 w-2 rounded-full bg-[#19e66f]" />
                  </span>
                  Live
                </span>
              </div>

              <div className="grid gap-0 sm:grid-cols-2">
                {/* Ticket details */}
                <div className="border-r border-slate-100 p-5">
                  <h4 className="mb-1 text-[14px] font-bold text-slate-900">Undichter Siphon – Hauptstraße 12</h4>
                  <p className="mb-4 text-[12px] text-slate-500">Anrufer: Thomas M. · EG · Badezimmer</p>

                  <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                    <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      KI-Zusammenfassung
                    </p>
                    <p className="text-[12px] leading-relaxed text-slate-600">
                      Kunde meldet tropfenden Siphon unter dem Waschbecken im Badezimmer.
                      Eimer wurde bereits untergestellt, Boden leicht feucht.
                    </p>
                  </div>

                  <div className="mt-4 flex flex-col gap-2">
                    {[
                      { label: "Kategorie", value: "SANITÄR", color: "text-blue-600 bg-blue-50" },
                      { label: "Dringlichkeit", value: "MITTEL", color: "text-amber-600 bg-amber-50" },
                    ].map((tag) => (
                      <div key={tag.label} className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">{tag.label}</span>
                        <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${tag.color}`}>
                          {tag.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Photo */}
                <div className="flex flex-col gap-0 p-5">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Foto-Upload · vom Kunden
                  </p>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-100">
                    <Image
                      src="/siphon.png"
                      alt="Foto eines undichten Siphons"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
                      loading="lazy"
                    />
                    {/* Overlay badge */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                      <span className="rounded-lg bg-black/50 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                        Vor 2 Min. hochgeladen
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

            {/* Floating response-time badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-8 hidden rounded-[1.25rem] border border-slate-100 bg-white p-1.5 shadow-[0_20px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl lg:block"
            >
              <div className="rounded-[1rem] bg-slate-50 px-5 py-3 border border-slate-100 flex items-center gap-3">
                <span className="material-symbols-outlined text-[16px] text-[#19e66f]">bolt</span>
                <div>
                  <p className="text-[12px] font-bold text-slate-900">Ø 241ms</p>
                  <p className="text-[10px] text-slate-400">Antwortzeit</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
