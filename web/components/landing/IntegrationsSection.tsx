"use client";

import { motion, Variants } from "framer-motion";
import { CalendarDays, MessageSquare, Mail, PhoneCall, ArrowUpRight } from "lucide-react";
import { AmbientOrbs } from "./AmbientOrbs";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 26 } },
};

const CHANNELS = [
  { icon: PhoneCall, title: "Telefonie", description: "Nummer weiterleiten oder Testnummer einrichten." },
  { icon: MessageSquare, title: "WhatsApp", description: "Rückfragen, Foto-Links, Bestätigungen." },
  { icon: CalendarDays, title: "Google Calendar", description: "Slots prüfen, Termine vorbereiten." },
  { icon: Mail, title: "E-Mail / Sheet", description: "Übergabe an Postfach oder Tabelle." },
];

export function IntegrationsSection() {
  return (
    <section id="integrationen" className="relative bg-paper py-20">
      <AmbientOrbs />
      <div className="relative mx-auto max-w-[1200px] px-6 lg:px-12">
        <div className="mb-12 flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-[560px]">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
              05 — Anbindung
            </span>
            <h2 className="mt-4 text-[clamp(32px,4vw,52px)] font-bold leading-[1.08] tracking-[-0.025em] text-ink">
              Es hängt sich an Ihren Alltag — nicht umgekehrt.
            </h2>
          </div>
          <a
            href="#cta"
            className="group inline-flex shrink-0 items-center gap-2 rounded-lg border border-[#333] px-7 py-3.5 text-[15px] font-semibold text-ink transition-all hover:border-[#555] hover:bg-white/[0.03]"
          >
            Anbindung anfragen
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {CHANNELS.map((c) => (
            <motion.div
              key={c.title}
              variants={item}
              className="glass-surface rounded-[10px] p-6 transition-colors hover:border-leafdimline"
            >
              <c.icon size={24} className="mb-4 text-leaf" strokeWidth={1.8} />
              <h4 className="text-[16px] font-bold text-ink">{c.title}</h4>
              <p className="mt-1.5 text-[13.5px] leading-[1.5] text-inksoft">{c.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <p className="mt-7 max-w-[720px] text-[14px] leading-[1.7] text-faint">
          Keine eigene Schnittstelle? Zum Start reicht oft eine E-Mail, ein Google
          Sheet oder eine WhatsApp-Übergabe ans Team. CRM, Webhooks oder n8n kommen
          später dazu, wenn ein Modul zieht.
        </p>
      </div>
    </section>
  );
}
