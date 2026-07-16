"use client";

import { motion } from "framer-motion";
import { Phone, MessageSquare, AlertTriangle } from "lucide-react";

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

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {PROBLEMS.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" }}
              className="rounded-2xl border border-white/[0.07] bg-paper2 p-6"
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-[10px] ${
                  p.amber
                    ? "border border-amber-400/30 bg-amber-400/10 text-amber-400"
                    : "border border-line bg-paperdeep text-faint"
                }`}
              >
                <p.Icon size={18} strokeWidth={1.7} />
              </span>
              <h3 className="mt-4 text-[15px] font-semibold leading-snug text-ink">{p.title}</h3>
              <ul className="mt-2.5 space-y-1.5">
                {p.points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-[14px] leading-[1.5] text-inksoft">
                    <span
                      className={`mt-[8px] h-1 w-1 shrink-0 rounded-full ${
                        p.amber ? "bg-amber-400/70" : "bg-faint/60"
                      }`}
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
