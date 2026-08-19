"use client";

import { motion } from "framer-motion";
import { Phone, MessageSquare, AlertTriangle, ArrowRight, Image as ImageIcon } from "lucide-react";
import { BaseModulFlow } from "./BaseModulFlow";

// Kurze Symptom-Bullets statt Erklärtexten — in 2 Sekunden erfassbar.
const PROBLEMS = [
  {
    Icon: Phone,
    title: "Das Telefon klingelt endlos",
    points: ["Anrufe laufen abends ins Leere", "Zettel ohne Rückrufnummer"],
    amber: false,
  },
  {
    Icon: MessageSquare,
    title: "WhatsApp- und Formular-Chaos",
    points: ["Fotos ohne Kontext", "Formulare ohne Adresse"],
    amber: false,
  },
  {
    Icon: AlertTriangle,
    title: "Unklare Dringlichkeit",
    points: ["Notfälle gehen in Anfragen unter", "Vorqualifizierung fehlt"],
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

        <div className="mt-12 grid items-center gap-6 lg:grid-cols-[1fr_auto_300px] lg:gap-8">
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
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-faint">
                  <Phone size={13} strokeWidth={1.9} /> {PROBLEMS[0].title}
                </span>
                <span className="font-mono text-[10px] text-faint/80">19:42</span>
              </div>
              <p className="mt-2 text-[13px] leading-snug text-inksoft">{PROBLEMS[0].points[0]}</p>
              <p className="mt-1 text-[13px] font-semibold leading-snug text-[#A75420]">{PROBLEMS[0].points[1]}</p>
            </motion.div>

            {/* Fragment 2 — WhatsApp-Chaos */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: 0.08, ease: "easeOut" }}
              className="w-full rotate-[1deg] rounded-[6px] border border-line bg-paper2 p-4 shadow-[0_14px_30px_-26px_rgba(31,42,35,0.4)] lg:absolute lg:left-[36%] lg:top-[112px] lg:w-[280px]"
            >
              <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-faint">
                <MessageSquare size={13} strokeWidth={1.9} /> {PROBLEMS[1].title}
              </span>
              <div className="mt-2 flex items-center gap-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] border border-line bg-paperdeep text-faint">
                  <ImageIcon size={15} strokeWidth={1.7} />
                </span>
                <p className="text-[13px] leading-snug text-inksoft">{PROBLEMS[1].points[0]}</p>
              </div>
              <p className="mt-2 text-[13px] font-semibold leading-snug text-ink">{PROBLEMS[1].points[1]}</p>
            </motion.div>

            {/* Fragment 3 — unklare Dringlichkeit */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: 0.16, ease: "easeOut" }}
              className="w-full rotate-[-1deg] rounded-[6px] border border-[#E5C8AB] bg-[#FCF0E5] p-4 shadow-[0_14px_30px_-26px_rgba(31,42,35,0.4)] lg:absolute lg:left-[8%] lg:top-[224px] lg:w-[280px]"
            >
              <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-[#A75420]">
                <AlertTriangle size={13} strokeWidth={1.9} /> {PROBLEMS[2].title}
              </span>
              <p className="mt-2 text-[13px] leading-snug text-[#A75420]">{PROBLEMS[2].points[0]}</p>
              <p className="mt-1 text-[13px] font-semibold leading-snug text-[#A75420]">{PROBLEMS[2].points[1]}</p>
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
            <p className="text-center font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-signaldim">
              Ein sauberer Vorgang.
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
