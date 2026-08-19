"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 24 } },
};

const faqItems = [
  {
    question: "Ist das ein Callcenter mit echten Menschen?",
    answer:
      "Nein, ein KI-Programm nimmt ab. Es klingt wie ein Mensch am Telefon, entscheidet aber nichts selbst — es sammelt nur, was Ihr Team braucht.",
  },
  {
    question: "Müssen wir gleich alles nutzen?",
    answer:
      "Nein. Sie starten mit einem Kanal, meistens dem Telefon. WhatsApp, Termine oder Fotos kommen erst dazu, wenn Sie das wollen.",
  },
  {
    question: "Wo kommt die fertige Anfrage bei uns an?",
    answer:
      "Da, wo Sie heute schon arbeiten — E-Mail, WhatsApp oder eine Tabelle. Sie brauchen kein neues System.",
  },
  {
    question: "Entscheidet die KI irgendwas selbst?",
    answer:
      "Nein. Sie sammelt Infos und gibt sie weiter. Zusagen, Angebote und Termine entscheidet immer Ihr Team.",
  },
  {
    question: "Was passiert bei einem echten Notfall?",
    answer:
      "Die KI fragt das Nötigste ab und ruft sofort Ihre Bereitschaft an. Die Entscheidung, was zu tun ist, trifft Ihr Betrieb.",
  },
  {
    question: "Was kostet der Einstieg?",
    answer:
      "Ab 750 € einmalig für einen Kanal, plus 30 Tage testen. Details unten bei den Preisen.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="relative bg-paper py-20">
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
