"use client";

import { motion, Variants } from "framer-motion";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 24 } },
};

const PAINS = [
  {
    num: "01",
    title: "Anrufe kommen im falschen Moment.",
    body: "Auf Baustelle, in der Werkstatt oder beim Kunden kann niemand sauber mitschreiben. Der nächste Rückruf passiert oft erst, wenn der Auftrag schon woanders gelandet ist.",
    tag: "Aufträge gehen verloren",
  },
  {
    num: "02",
    title: "WhatsApp und Fotos bleiben ohne Kontext.",
    body: "Kunden schicken Bilder, Sprachnachrichten und halbe Infos. Ihr Team muss nachfragen, sortieren und alles wieder in eine brauchbare Form bringen.",
    tag: "Zu viele Rückfragen",
  },
  {
    num: "03",
    title: "Dringendes landet zwischen Routinefällen.",
    body: "Terminwünsche, Statusfragen und echte Notfälle laufen über dieselben Kanäle. Ohne Vorsortierung sieht Ihr Team zu spät, was wirklich brennt.",
    tag: "Priorität fehlt",
  },
];

export function PainSection() {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="relative overflow-hidden bg-[#F4F3EE] py-28 lg:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div variants={item} className="mb-20 grid gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#15604A]">
              Das Problem
            </p>
            <h2
              className="font-display max-w-xl text-[38px] font-bold leading-[1.08] tracking-[-0.025em] text-slate-900 sm:text-[46px] lg:text-[52px]"
            >
              Das Problem ist selten die Arbeit. Es ist der Eingang davor.
            </h2>
          </div>
          <div className="hidden items-end pb-1 lg:flex">
            <p className="max-w-[280px] text-sm leading-relaxed text-slate-400">
              Kleine Betriebe verlieren täglich Zeit, Übersicht und Chancen, weil Eingänge nicht sauber vorsortiert sind.
            </p>
          </div>
        </motion.div>

        {/* Pain items */}
        <div className="grid gap-0 divide-y divide-slate-200/60">
          {PAINS.map((pain) => (
            <motion.div
              key={pain.num}
              variants={item}
              className="group grid grid-cols-[auto_1fr] gap-8 py-10 lg:grid-cols-[80px_1fr_auto] lg:gap-12 lg:py-12"
            >
              {/* Number */}
              <span
                className="font-display text-[42px] font-bold leading-none tracking-tight text-slate-200 transition-colors duration-300 group-hover:text-[#15604A]/40 lg:text-[48px]"
              >
                {pain.num}
              </span>

              {/* Content */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xl font-bold tracking-tight text-slate-900 lg:text-2xl">
                  {pain.title}
                </h3>
                <p className="max-w-[600px] text-[15px] leading-relaxed text-slate-500">
                  {pain.body}
                </p>
              </div>

              {/* Tag */}
              <div className="hidden items-center lg:flex">
                <span className="rounded-full border border-red-100 bg-red-50 px-3.5 py-1.5 text-xs font-semibold text-red-500">
                  {pain.tag}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
