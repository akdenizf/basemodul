"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight, ArrowDown, Check } from "lucide-react";
import { AmbientOrbs, FlowGrid } from "./AmbientOrbs";

// Ein einziger, kompakter Ablauf — in 5 Sekunden lesbar.
const STEPS = [
  { text: "Anruf um 22:40" },
  { text: "KI fragt Ort + Problem ab" },
  { text: "Notdienst erkannt" },
  { text: "Bereitschaft informiert", accent: true },
];

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 26 } },
};

export function WorkflowSection() {
  return (
    <section id="workflow" className="relative bg-paper pb-12 pt-10 lg:pb-14 lg:pt-12">
      {/* sanfter Tiefen-Verlauf statt harter paperdeep-Block — recessed, aber ohne Naht */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 45%, transparent 100%)",
        }}
      />
      <FlowGrid />
      <AmbientOrbs />
      <div className="relative mx-auto max-w-[960px] px-6 lg:px-12">
        {/* Header */}
        <div className="mb-8 max-w-[600px] lg:mb-14">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
            Praxisbeispiel — Ablauf in 5 Sekunden
          </span>
          <h2 className="mb-[14px] mt-4 text-[clamp(30px,3.6vw,46px)] font-bold leading-[1.08] tracking-[-0.025em] text-ink">
            Eingang rein. Modul fragt nach. Aktion raus.
          </h2>
          <p className="text-[16px] leading-[1.7] text-inksoft">
            Ein echter Ablauf aus dem Betriebsalltag — vom Anruf bis zur Übergabe.
          </p>
        </div>

        {/* Compact horizontal process line */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col items-stretch sm:flex-row sm:items-center"
        >
          {STEPS.map((s, i) => (
            <div key={s.text} className="contents">
              <motion.div
                variants={item}
                className={`group relative flex-1 overflow-hidden rounded-2xl px-5 py-5 text-center backdrop-blur-md ${
                  s.accent
                    ? "border border-leafbright/40 bg-gradient-to-b from-leaf/20 to-leaf/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_18px_40px_-16px_rgba(34,197,94,0.45)]"
                    : "border border-white/10 bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_40px_-20px_rgba(0,0,0,0.7)]"
                }`}
              >
                {/* soft top sheen */}
                <span
                  className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
                  style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.08), transparent)" }}
                />
                <span className="relative flex items-center justify-center gap-2">
                  {s.accent && <Check size={15} className="text-leafbright" strokeWidth={2.6} />}
                  <span
                    className={`text-[14px] font-semibold leading-snug ${
                      s.accent ? "text-leafbright" : "text-ink"
                    }`}
                  >
                    {s.text}
                  </span>
                </span>
              </motion.div>

              {/* very subtle connector */}
              {i < STEPS.length - 1 && (
                <div className="flex items-center justify-center py-1.5 text-white/15 sm:px-2 sm:py-0">
                  <ArrowDown size={16} className="sm:hidden" />
                  <ArrowRight size={16} className="hidden sm:block" />
                </div>
              )}
            </div>
          ))}
        </motion.div>

        {/* Caption */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-7 text-center text-[13px] text-faint"
        >
          Auch für Terminwünsche, Rückrufe und Foto-Nachreichungen.
        </motion.p>
      </div>
    </section>
  );
}
