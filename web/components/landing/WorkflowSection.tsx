"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight, ArrowDown, Check, AlertTriangle } from "lucide-react";

// Ein einziger, kompakter Ablauf — in 5 Sekunden lesbar, kanal-agnostisch.
// Amber = Dringend-Signal, Grün = erledigt/normal (durchgängig auf der ganzen Seite).
const STEPS = [
  { text: "Anfrage kommt rein" },
  { text: "Fehlende Infos werden geklärt" },
  { text: "Nach Regeln priorisieren", urgent: true },
  { text: "Team erhält nächsten Schritt", accent: true },
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
      <div className="relative mx-auto max-w-[960px] px-6 lg:px-12">
        {/* Header */}
        <div className="mb-8 max-w-[600px] lg:mb-14">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
            05 — Der Ablauf
          </span>
          <h2 className="mb-[14px] mt-4 text-[clamp(30px,3.6vw,46px)] font-bold leading-[1.08] tracking-[-0.025em] text-ink">
            Eingang rein. Fehlende Infos klären. Team handlungsfähig machen.
          </h2>
          <p className="text-[16px] leading-[1.7] text-inksoft">
            BaseModul arbeitet nach vereinbarten Fragen, Zuständigkeiten und Eskalationsregeln. Fachliche Entscheidungen und kritische Fälle bleiben bei Ihrem Team.
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
                className={`group relative flex-1 rounded-2xl border px-5 py-5 text-center shadow-[0_12px_30px_-26px_rgba(31,42,35,0.38)] ${
                  s.accent
                    ? "border-leafdimline bg-leafdim"
                    : s.urgent
                    ? "border-priorityline bg-prioritydim"
                    : "border-line bg-paper2"
                }`}
              >
                <span className="relative flex items-center justify-center gap-2">
                  {s.accent && <Check size={15} className="text-leaf" strokeWidth={2.6} />}
                  {s.urgent && <AlertTriangle size={15} className="text-priority" strokeWidth={2.4} />}
                  <span
                    className={`text-[14px] font-semibold leading-snug ${
                      s.accent ? "text-leaf" : s.urgent ? "text-priority" : "text-ink"
                    }`}
                  >
                    {s.text}
                  </span>
                </span>
              </motion.div>

              {/* very subtle connector */}
              {i < STEPS.length - 1 && (
                <div className="flex items-center justify-center py-1.5 text-faint sm:px-2 sm:py-0">
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
          Funktioniert für Anrufe, WhatsApp, Formulare, Fotos und Terminwünsche – immer mit einem definierten menschlichen Fallback.
        </motion.p>
      </div>
    </section>
  );
}
