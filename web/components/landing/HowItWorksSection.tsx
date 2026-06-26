"use client";

import { motion, Variants } from "framer-motion";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.14 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 24 } },
};

const STEPS = [
  {
    number: "01",
    icon: "search",
    title: "Eingangskanal finden",
    description: "Wir schauen, wo aktuell am meisten Zeit verloren geht: Telefon, Chat, Termine, Fotos, Dateien oder Priorisierung.",
  },
  {
    number: "02",
    icon: "extension",
    title: "Erstes Modul wählen",
    description: "Ein Modul wird als Pilot sauber zugeschnitten. Kein Komplettsystem, bevor der Nutzen klar ist.",
  },
  {
    number: "03",
    icon: "rule",
    title: "Flow testen",
    description: "Das Modul fragt fehlende Infos ab, erkennt Dringlichkeit und übergibt Rückruf, Termin oder Anfrage an Ihr Team.",
  },
  {
    number: "04",
    icon: "assignment_turned_in",
    title: "Ausbauen oder stoppen",
    description: "Nach wenigen Tagen sieht man, ob es im Alltag hilft. Dann wird angepasst, erweitert oder bewusst geparkt.",
  },
];

export function HowItWorksSection() {
  return (
    <motion.section
      id="how-it-works"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="relative overflow-hidden bg-white py-28 lg:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div variants={item} className="mb-20 text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#15604A]">
            Der Prozess
          </p>
          <h2
            className="font-display mx-auto max-w-2xl text-[38px] font-bold leading-[1.08] tracking-[-0.025em] text-slate-900 sm:text-[46px]"
          >
            So läuft der erste Pilot
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {/* Connecting line */}
          <div className="pointer-events-none absolute left-0 right-0 top-[52px] hidden h-px lg:block">
            <div className="mx-auto h-full" style={{ background: "linear-gradient(90deg, transparent 0%, #e2e8f0 10%, #e2e8f0 90%, transparent 100%)" }} />
          </div>

          {STEPS.map((step) => (
            <motion.div
              key={step.number}
              variants={item}
              className="group relative flex flex-col gap-5"
            >
              {/* Icon circle */}
              <div className="relative z-10 flex h-[104px] w-[104px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all duration-300 group-hover:border-[#15604A]/40 group-hover:shadow-[0_4px_24px_rgba(21, 96, 74,0.15)]">
                <span
                  className="font-display text-xs font-bold tracking-widest text-[#15604A]"
                >
                  {step.number}
                </span>
                <span className="material-symbols-outlined mt-1 text-[28px] text-slate-400 transition-colors duration-300 group-hover:text-slate-700">
                  {step.icon}
                </span>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-bold tracking-tight text-slate-900">{step.title}</h3>
                <p className="text-[14px] leading-relaxed text-slate-500">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
