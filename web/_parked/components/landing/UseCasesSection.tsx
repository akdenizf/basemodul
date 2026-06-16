"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Play, Droplets, Flame, VolumeX } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const useCases = [
  {
    title: "Wasserschaden",
    description:
      "Sofortige Eskalation & Foto-Anforderung per SMS ohne Wartezeit.",
    Icon: Droplets,
  },
  {
    title: "Heizungsausfall",
    description:
      "Standard-Troubleshooting und direkte Zuordnung an externe Handwerker.",
    Icon: Flame,
  },
  {
    title: "Ruhestörung",
    description:
      "Deeskalation des Mieters & DSGVO-konforme Dokumentation für die Akte.",
    Icon: VolumeX,
  },
];

export function UseCasesSection() {
  return (
    <motion.section
      id="use-cases"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="py-24 lg:py-32 xl:py-40 relative overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          variants={itemVariants}
          className="mb-20 text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 text-balance">
            Für jeden Fall die richtige Reaktion.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-500">
            Die KI lernt aus Tausenden von Mietergesprächen und reagiert
            situationsgerecht mit Empathie und Effizienz.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {useCases.map((useCase, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              transition={{ ease: [0.25, 0.46, 0.45, 0.94] }}
              className="group rounded-2xl border border-slate-200/60 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between h-full transition-all duration-300 hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mb-6">
                  <useCase.Icon size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {useCase.title}
                </h3>
                <p className="text-slate-500 leading-relaxed">
                  {useCase.description}
                </p>
              </div>
              <div className="mt-10 pt-6 border-t border-slate-100">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  transition={{ ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-bold text-sm transition-colors cursor-pointer bg-blue-50 text-blue-600 hover:bg-blue-100"
                >
                  <Play size={16} className="fill-current" />
                  Beispiel anhören
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
