"use client";

import { motion, Variants } from "framer-motion";
import {
  CalendarCheck2,
  Camera,
  MessageSquare,
  PhoneCall,
  Siren,
  Plus,
  type LucideIcon,
} from "lucide-react";
import { AmbientOrbs, FlowGrid } from "./AmbientOrbs";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const rowV: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 26 } },
};

/* ── Telefon-Artefakt: Rückrufnotiz ────────────────────────────────────── */

function Field({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-dashed border-line pt-2 first:border-t-0 first:pt-0">
      <span className="text-[11px] text-faint">{label}</span>
      <span className={`text-[12px] font-medium text-ink ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}

function RueckrufNotiz() {
  return (
    <div className="rounded-[12px] border border-line bg-paperdeep p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-faint">Rückrufnotiz</span>
        <span className="font-mono text-[10px] text-faint">22:47</span>
      </div>
      <div className="space-y-2">
        <Field label="Name" value="Klaus M." />
        <Field label="Telefon" value="0176 24 …" mono />
        <Field label="Anliegen" value="Rückruf gewünscht" />
      </div>
    </div>
  );
}

/* ── Erweiterungen — nur kompakte Pills ────────────────────────────────── */

const extensions: { Icon: LucideIcon; name: string; hint: string }[] = [
  { Icon: Siren, name: "Notdienst-Modul", hint: "Hohe Dringlichkeit → Bereitschaft alarmieren" },
  { Icon: CalendarCheck2, name: "Termin-Modul", hint: "Leistung & Wunschzeit im Vorfeld klären" },
  { Icon: MessageSquare, name: "WhatsApp-Modul", hint: "Chat-Anfragen sortieren & bündeln" },
  { Icon: Camera, name: "Foto- & Datei-Modul", hint: "Bilder & Dokumente gezielt anfordern" },
];

export function ModulesSection() {
  return (
    <section id="modules" className="relative bg-paper pb-12 pt-8 lg:pb-16 lg:pt-10">
      <FlowGrid />
      <AmbientOrbs />
      <div className="relative mx-auto max-w-[1200px] px-6 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1fr] lg:items-center lg:gap-16">
          {/* Left — intro */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
              02 — Die Module
            </span>
            <h2 className="mt-4 mb-5 text-[clamp(32px,4vw,52px)] font-bold leading-[1.08] tracking-[-0.025em] text-ink">
              Ein Baukasten für<br />Ihre Anfragen.
            </h2>
            <p className="max-w-[360px] text-[16px] leading-[1.7] text-inksoft">
              Starten Sie mit einem Modul. Kombinieren Sie, was Ihr Betrieb braucht.
            </p>
            <span className="mt-7 inline-flex items-center gap-[7px] rounded-full border border-leafdimline bg-leafdim px-3 py-[5px] text-[11px] font-semibold uppercase tracking-[0.06em] text-leafbright">
              <span className="h-1.5 w-1.5 rounded-full bg-leafbright" />
              Eingang → Modul → Übergabe
            </span>
          </div>

          {/* Right — one core module + small extension pills */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
            {/* Telefon-Modul — der Kern */}
            <motion.div variants={rowV} className="glass-surface rounded-2xl p-6">
              <div className="mb-5 flex items-center gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border border-leafdimline/60 bg-leafdim/50 text-leafbright">
                  <PhoneCall size={20} strokeWidth={1.8} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-[18px] font-bold text-ink">Telefon-Modul</h3>
                  </div>
                  <p className="mt-1 text-[13px] leading-snug text-inksoft">
                    Nimmt Anrufe an, erkennt das Anliegen und sichert Kontaktdaten sowie den Standort.
                  </p>
                </div>
              </div>

              <p className="mb-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
                <span className="h-1 w-1 rounded-full bg-leafbright" /> Ergebnis
              </p>
              <RueckrufNotiz />
            </motion.div>

            {/* Erweiterungen — kompakte Pills */}
            <motion.div variants={rowV} className="mt-5">
              <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
                <Plus size={12} strokeWidth={2} className="text-leafbright" />
                Weitere Module · flexibel kombinierbar
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {extensions.map((e) => (
                  <div
                    key={e.name}
                    className="group rounded-xl border border-white/10 bg-white/[0.04] p-3.5 backdrop-blur-md transition-colors duration-200 hover:border-leaf/40 hover:bg-white/[0.06]"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-[9px] border border-line bg-paperdeep text-inksoft transition-colors duration-200 group-hover:text-leafbright">
                      <e.Icon size={15} strokeWidth={1.8} />
                    </span>
                    <div className="mt-2.5 text-[13px] font-semibold text-ink">{e.name}</div>
                    <div className="mt-0.5 text-[11px] text-faint">{e.hint}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
