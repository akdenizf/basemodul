"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { AmbientOrbs } from "./AmbientOrbs";

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 24 } },
};

const faqItems = [
  {
    question: "Müssen wir direkt alle Module nutzen?",
    answer:
      "Nein. Der beste Start ist ein einzelnes Modul: zum Beispiel Telefon, Chat, Termin oder Foto & Datei. Erst wenn der Pilot im Alltag hilft, wird erweitert.",
  },
  {
    question: "Wie schnell ist ein Pilot aktiv?",
    answer:
      "Ein erster Testflow ist je nach Umfang oft in wenigen Tagen möglich. Für echte Live-Nutzung prüfen wir vorher Nummern, Datenschutz, Übergabe und Eskalation.",
  },
  {
    question: "Was passiert bei einem echten Notfall?",
    answer:
      "Das Prioritäts-Modul fragt Pflichtinfos ab, erkennt hohe Dringlichkeit und informiert den festgelegten Menschen oder Übergabekanal. Verbindliche Entscheidungen bleiben beim Team.",
  },
  {
    question: "Kann ich meine bestehende Nummer behalten?",
    answer:
      "Ja. Für den Pilot kann eine Testnummer genutzt werden. Später kann eine bestehende Nummer weitergeleitet oder eine eigene Nummer eingerichtet werden.",
  },
  {
    question: "Was passiert mit WhatsApp und Fotos?",
    answer:
      "Das Chat- oder Foto-&-Datei-Modul sammelt fehlende Angaben ein und legt Anhang, Kontakt, Anliegen und Kontext strukturiert zusammen. Ihr Team bekommt keine lose Nachricht, sondern eine saubere Übergabe.",
  },
  {
    question: "Ist basemodul.de ein Produkt von AGENTEQ?",
    answer:
      "Ja. basemodul.de ist die Produktmarke für diese KI-Module. AGENTEQ bleibt der technische und organisatorische Anbieter im Hintergrund.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="relative bg-paper py-20">
      <AmbientOrbs />
      <div className="relative mx-auto max-w-[1200px] px-6 lg:px-12">
        <div className="mb-12 text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">FAQ</span>
          <h2 className="mt-3.5 text-[clamp(32px,4vw,52px)] font-bold leading-[1.08] tracking-[-0.025em] text-ink">
            Was Betriebe vor dem Start wissen wollen.
          </h2>
        </div>

        <div className="mx-auto grid max-w-[980px] grid-cols-1 gap-4 md:grid-cols-2">
          {faqItems.map((faq, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                variants={item}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                className="glass-surface h-fit overflow-hidden rounded-lg"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left text-[16px] font-semibold text-ink"
                >
                  {faq.question}
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-leafbright transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-[14.5px] leading-[1.6] text-inksoft">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
