"use client";

import { motion, Variants } from "framer-motion";
import { Layers, Rocket, ShieldCheck, Headphones } from "lucide-react";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 24 } },
};

const stats = [
  { value: "5", label: "Module – einzeln startbar", icon: Layers },
  { value: "1", label: "Pilot zuerst, kein Komplettsystem", icon: Rocket },
  { value: "DE/EU", label: "Hosting · DSGVO-ready", icon: ShieldCheck },
  { value: "Klar", label: "Übergabe statt halber Infos", icon: Headphones },
];

const withoutItems = [
  "verpasste Anrufe",
  "halbe WhatsApp-Nachrichten",
  "Fotos ohne Kontext",
];

const withItems = [
  "vorsortierte Rückrufe",
  "saubere Fallkarten",
  "klare Prioritäts-Übergabe",
];

export function RoiSection() {
  return (
    <motion.section
      id="roi"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="relative overflow-hidden py-24 lg:py-32 xl:py-40"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div variants={item} className="mb-16 text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#15604A]">
            Der Unterschied
          </p>
          <h2 className="font-display mx-auto max-w-2xl text-[38px] font-bold leading-[1.08] tracking-[-0.025em] text-slate-900 sm:text-[46px]">
            Spürbar weniger Aufwand.
          </h2>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={item}
              className="rounded-2xl border border-slate-200/60 bg-white p-6 md:p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-[#15604A]/20 bg-[#15604A]/10 text-[#15604A]">
                <stat.icon size={26} />
              </div>
              <p className="font-display text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
                {stat.value}
              </p>
              <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Comparison Block */}
        <motion.div
          variants={item}
          className="mt-16 grid gap-8 lg:grid-cols-2"
        >
          {/* Without */}
          <div className="rounded-2xl border border-rose-100/60 bg-white p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h3 className="mb-6 text-xl font-bold tracking-tight text-slate-900 border-b border-slate-100 pb-4">
              Ohne basemodul.de
            </h3>
            <ul className="flex flex-col gap-5">
              {withoutItems.map((text, i) => (
                <li key={i} className="flex items-center gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </span>
                  <span className="text-base font-medium text-slate-600">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* With */}
          <div className="rounded-2xl border border-[#15604A]/25 bg-white p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h3 className="mb-6 text-xl font-bold tracking-tight text-slate-900 border-b border-slate-100 pb-4">
              Mit basemodul.de
            </h3>
            <ul className="flex flex-col gap-5">
              {withItems.map((text, i) => (
                <li key={i} className="flex items-center gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#15604A]/10 text-[#15604A]">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </span>
                  <span className="text-base font-medium text-slate-600">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
