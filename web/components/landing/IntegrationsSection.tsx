"use client";

import { motion, Variants } from "framer-motion";
import { Code2, Webhook, Mail, Download, Plug, ArrowUpRight } from "lucide-react";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 24 } },
};

const CHANNELS = [
  { icon: Code2, title: "API", description: "Tickets und Status in Echtzeit abrufen." },
  { icon: Webhook, title: "Webhooks", description: "Ereignisse automatisch an Ihre Systeme pushen." },
  { icon: Mail, title: "E-Mail / SMTP", description: "Strukturierte Ticket-Mails direkt ins Postfach." },
  { icon: Download, title: "CSV-Export", description: "Ihre Daten jederzeit exportieren." },
];

export function IntegrationsSection() {
  return (
    <motion.section
      id="integrationen"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="relative overflow-hidden bg-white py-28 lg:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">

          {/* ── LEFT: copy + CTA ──────────────────────────────────── */}
          <motion.div variants={item} className="flex flex-col gap-8">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#19e66f]">
                Integrationen · Auf Anfrage
              </p>
              <h2 className="font-display max-w-xl text-[38px] font-bold leading-[1.08] tracking-[-0.025em] text-slate-900 sm:text-[46px]">
                AGENTEQ fügt sich in Ihren Stack ein.
              </h2>
              <p className="mt-6 max-w-lg text-[18px] font-medium leading-[1.7] text-slate-500">
                Sie nutzen bereits eine Branchen-Software oder eigene Tools? Wir binden AGENTEQ
                auf Anfrage an Ihre Systeme an — über API, Webhooks oder ganz einfach per E-Mail.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-[#fafaf8] px-5 py-4 text-[14px] leading-relaxed text-slate-500">
              Keine eigene Schnittstelle vorhanden? Dann reicht eine einfache E-Mail-Weiterleitung —
              Sie nennen uns Ihr System, wir klären die Anbindung.
            </div>

            <div>
              <a
                href="#cta"
                className="group relative inline-flex items-center gap-2 rounded-full bg-[#0f1714] py-2 pl-8 pr-2 text-[15px] font-bold text-white shadow-[0_8px_30px_rgba(15,23,20,0.2)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[0.98] hover:shadow-[0_12px_40px_rgba(15,23,20,0.3)]"
              >
                <span>Anbindung anfragen</span>
                <div className="ml-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 group-hover:translate-x-1">
                  <ArrowUpRight size={18} />
                </div>
              </a>
            </div>
          </motion.div>

          {/* ── RIGHT: "Ihr Stack" channel card ───────────────────── */}
          <motion.div variants={item} className="relative mx-auto w-full max-w-[420px]">
            <div className="rounded-[2rem] border border-slate-200/60 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-7">

              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#19e66f]/20 bg-[#19e66f]/10 text-[#12b355]">
                    <Plug className="h-[18px] w-[18px]" />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-slate-900">Anbindung an Ihre Systeme</p>
                    <p className="text-[12px] font-medium text-slate-500">Flexibel kombinierbar</p>
                  </div>
                </div>
                <span className="rounded-full bg-[#19e66f]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#12b355]">
                  Auf Anfrage
                </span>
              </div>

              {/* Channels */}
              <div className="mt-5 flex flex-col gap-2.5">
                {CHANNELS.map((c, i) => (
                  <motion.div
                    key={c.title}
                    initial={{ opacity: 0, x: 8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.14, type: "spring", stiffness: 220, damping: 22 }}
                    className="flex items-center gap-3.5 rounded-xl border border-slate-100 bg-[#fafafa] px-3.5 py-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-slate-200 bg-white text-slate-600">
                      <c.icon className="h-[18px] w-[18px]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-slate-800">{c.title}</p>
                      <p className="truncate text-[12px] text-slate-500">{c.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.section>
  );
}
