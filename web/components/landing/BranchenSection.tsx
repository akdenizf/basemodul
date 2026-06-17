"use client";

import { motion, Variants } from "framer-motion";
import { Wrench, Building2, Sparkles, ArrowUpRight } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

const branchen = [
  {
    title: "Handwerk & SHK",
    Icon: Wrench,
    pitch: "Notdienst und Standardanfragen sauber getrennt — bevor Ihr Team zurückruft.",
    points: [
      "Objekt, Problem und Dringlichkeit werden abgefragt",
      "Notfall wird erkannt und priorisiert",
      "Strukturierte Zusammenfassung für die Disposition",
    ],
  },
  {
    title: "Hausverwaltung",
    Icon: Building2,
    pitch: "Schadenmeldungen und Mieteranfragen vorqualifiziert statt Telefonchaos.",
    points: [
      "Objekt, Mieter und Schadensart werden erfasst",
      "Foto-Upload per Link zum Vorgang",
      "Technische Meldungen vorsortiert an die Verwaltung",
    ],
  },
  {
    title: "Facility & Gebäudereinigung",
    Icon: Sparkles,
    pitch: "Kundenanfragen, Reklamationen und Sonderreinigungen sauber aufgenommen.",
    points: [
      "Standort, Leistung und Termin werden erfasst",
      "Reklamationen werden dokumentiert und zugeordnet",
      "Angebot oder Rückruf wird vorbereitet",
    ],
  },
];

export function BranchenSection() {
  return (
    <motion.section
      id="branchen"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="relative overflow-hidden py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div variants={itemVariants} className="mx-auto mb-20 max-w-3xl text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#0369A1]/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#0369A1]">
            Für Ihren Betrieb
          </span>
          <h2 className="text-balance text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            Ein Assistent, drei Branchen.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-500">
            Der gleiche Anfrage-Assistent — pro Branche auf die richtigen Fragen
            und Abläufe zugeschnitten.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {branchen.map((b) => (
            <motion.div
              key={b.title}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="group flex h-full flex-col rounded-2xl border border-slate-200/60 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:shadow-lg"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0369A1]/10 text-[#0369A1]">
                <b.Icon size={28} />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-slate-900">{b.title}</h3>
              <p className="mb-6 leading-relaxed text-slate-500">{b.pitch}</p>
              <ul className="flex flex-col gap-3">
                {b.points.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-[15px] text-slate-600">
                    <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#0369A1]/15">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#0369A1]" />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
              <a
                href="#cta"
                className="mt-8 inline-flex items-center gap-1.5 border-t border-slate-100 pt-6 text-sm font-bold text-slate-900 transition-colors group-hover:text-[#0369A1]"
              >
                Pilotplatz für diese Branche
                <ArrowUpRight size={16} />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
