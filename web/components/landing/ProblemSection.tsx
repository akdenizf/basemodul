"use client";

import { motion } from "framer-motion";
import { Phone, MessageSquare, AlertTriangle } from "lucide-react";

const PROBLEMS = [
  {
    Icon: Phone,
    title: "Das Telefon klingelt endlos",
    body: "Anrufe nach Feierabend oder wenn alle im Einsatz sind, gehen ins Leere.",
    amber: false,
  },
  {
    Icon: MessageSquare,
    title: "WhatsApp-Chaos",
    body: "Kunden schicken Bilder von Schäden, aber vergessen Adresse und Kontext.",
    amber: false,
  },
  {
    Icon: AlertTriangle,
    title: "Unklare Dringlichkeit",
    body: "Notfälle gehen in allgemeinen Anfragen unter, weil die Vorqualifizierung fehlt.",
    amber: true,
  },
];

export function ProblemSection() {
  return (
    <section className="relative bg-paper py-14 lg:py-20">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
        <div className="mx-auto max-w-[600px] text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
            01 — Problem
          </span>
          <h2 className="mt-4 text-[clamp(24px,3.2vw,38px)] font-bold leading-[1.12] tracking-[-0.025em] text-ink">
            Ihr Team verliert Stunden mit unvollständigen Anfragen.
          </h2>
          <p className="mt-4 text-[16px] leading-[1.7] text-inksoft">
            Der Alltag in lokalen Betrieben besteht oft aus Nachfassen und Sortieren.
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
              <p className="mt-2 text-[14px] leading-[1.6] text-inksoft">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
