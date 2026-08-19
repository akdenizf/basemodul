"use client";

import { motion } from "framer-motion";
import { Phone, MessageSquare, AlertTriangle, ArrowRight, Image as ImageIcon } from "lucide-react";
import { BaseModulFlow } from "./BaseModulFlow";

// Konkrete Momente aus dem Betriebsalltag statt abstrakter Schlagworte.
const PROBLEMS = [
  {
    Icon: Phone,
    title: "Anruf verpasst",
    points: ["Niemand konnte rangehen.", "Der Kunde ruft beim Nächsten an."],
    amber: false,
  },
  {
    Icon: MessageSquare,
    title: "Fotos per WhatsApp",
    points: ["Sechs Bilder, keine Adresse.", "Das Büro muss hinterhertelefonieren."],
    amber: false,
  },
  {
    Icon: AlertTriangle,
    title: "Notfall übersehen",
    points: ["Steht zwischen fünf normalen Anfragen.", "Fällt erst Stunden später auf."],
    amber: true,
  },
];

export function ProblemSection() {
  return (
    <section className="relative bg-paper py-14 lg:py-20">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
        <div className="mx-auto max-w-[600px] text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
            02 — Problem
          </span>
          <h2 className="mt-4 text-[clamp(24px,3.2vw,38px)] font-bold leading-[1.12] tracking-[-0.025em] text-ink">
            Halbe Anfragen kosten Zeit, Rückrufe und manchmal Aufträge.
          </h2>
          <p className="mt-4 text-[16px] leading-[1.7] text-inksoft">
            Der Alltag: viel Nachfassen, wenig Struktur.
          </p>
        </div>

        <div className="mt-12 grid items-center gap-6 lg:grid-cols-[1fr_auto_340px] lg:gap-8">
          {/* Vorher: verstreute, unvollständige Fragmente statt gleichförmigem Karten-Grid */}
          <div className="relative mx-auto flex w-full max-w-[440px] flex-col gap-5 py-2 lg:min-h-[320px] lg:max-w-none lg:block">
            {/* Fragment 1 — verpasster Anruf */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="w-full rotate-[-1.5deg] rounded-[6px] border border-line bg-paper2 p-4 shadow-[0_14px_30px_-26px_rgba(31,42,35,0.4)] lg:absolute lg:left-0 lg:top-0 lg:w-[280px]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-[15px] font-bold text-ink">
                  <Phone size={16} strokeWidth={1.9} className="text-faint" /> {PROBLEMS[0].title}
                </span>
                <span className="font-mono text-[12px] text-faint">19:42</span>
              </div>
              <p className="mt-2 text-[14px] leading-snug text-inksoft">{PROBLEMS[0].points[0]}</p>
              <p className="mt-1 text-[14px] font-semibold leading-snug text-priority">{PROBLEMS[0].points[1]}</p>
            </motion.div>

            {/* Fragment 2 — WhatsApp-Chaos */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: 0.08, ease: "easeOut" }}
              className="w-full rotate-[1deg] rounded-[6px] border border-line bg-paper2 p-4 shadow-[0_14px_30px_-26px_rgba(31,42,35,0.4)] lg:absolute lg:left-[36%] lg:top-[112px] lg:w-[280px]"
            >
              <span className="flex items-center gap-2 text-[15px] font-bold text-ink">
                <MessageSquare size={16} strokeWidth={1.9} className="text-faint" /> {PROBLEMS[1].title}
              </span>
              <div className="mt-2.5 flex items-center gap-2.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[5px] border border-line bg-paperdeep text-faint">
                  <ImageIcon size={17} strokeWidth={1.7} />
                </span>
                <p className="text-[14px] leading-snug text-inksoft">{PROBLEMS[1].points[0]}</p>
              </div>
              <p className="mt-2 text-[14px] font-semibold leading-snug text-ink">{PROBLEMS[1].points[1]}</p>
            </motion.div>

            {/* Fragment 3 — unklare Dringlichkeit */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: 0.16, ease: "easeOut" }}
              className="w-full rotate-[-1deg] rounded-[6px] border border-priorityline bg-prioritydim p-4 shadow-[0_14px_30px_-26px_rgba(31,42,35,0.4)] lg:absolute lg:left-[8%] lg:top-[224px] lg:w-[280px]"
            >
              <span className="flex items-center gap-2 text-[15px] font-bold text-priority">
                <AlertTriangle size={16} strokeWidth={1.9} /> {PROBLEMS[2].title}
              </span>
              <p className="mt-2 text-[14px] leading-snug text-priority">{PROBLEMS[2].points[0]}</p>
              <p className="mt-1 text-[14px] font-semibold leading-snug text-priority">{PROBLEMS[2].points[1]}</p>
            </motion.div>
          </div>

          {/* Transformation */}
          <div className="flex items-center justify-center gap-2 py-2 lg:flex-col lg:py-0">
            <ArrowRight size={20} className="text-faint lg:hidden" />
            <ArrowRight size={22} className="hidden text-faint lg:block" />
            <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-faint lg:hidden">wird zu</span>
          </div>

          {/* Nachher: ein sauberer Vorgang */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full max-w-[400px] rounded-[8px] border border-line bg-inkdeep px-5 py-6 shadow-[0_24px_50px_-30px_rgba(22,35,28,0.55)] lg:mx-0 lg:max-w-none"
          >
            <p className="text-center text-[15px] font-bold leading-snug text-white">
              Egal wie es reinkommt:<br />
              <span className="text-signaldim">Ihr Team bekommt einen fertigen Vorgang.</span>
            </p>
            <div className="mt-4 flex justify-center">
              <BaseModulFlow size="full" orientation="vertical" animated={false} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
