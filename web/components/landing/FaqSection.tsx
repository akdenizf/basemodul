"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { AmbientOrbs } from "./AmbientOrbs";

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 24 } },
};

// Priorisiert: die 8 wichtigsten Kaufeinwände zuerst, Rest danach.
const faqItems = [
  {
    question: "Ist BaseModul ein Callcenter oder ein Telefonbot?",
    answer:
      "Weder noch. Ein Baukasten aus Modulen: nimmt Anfragen an, fragt fehlende Infos ab, übergibt einen vollständigen Vorgang ans Team.",
  },
  {
    question: "Muss der Assistent so tun, als wäre er ein Mensch?",
    answer:
      "Nein. Der Assistent sagt ehrlich, dass er ein digitaler Assistent ist — das schafft Vertrauen.",
  },
  {
    question: "Wo landet die fertige Anfrage?",
    answer:
      "Dort, wo Ihr Team heute arbeitet: E-Mail, WhatsApp, Sheet, Kalender oder CRM. Kein neues Tool.",
  },
  {
    question: "Bleibt unser Team in Kontrolle?",
    answer:
      "Ja. Der Assistent sammelt und sortiert, Ihr Team entscheidet — Zusagen und Angebote nur mit menschlicher Freigabe.",
  },
  {
    question: "Was passiert bei einem echten Notfall?",
    answer:
      "Das Prioritäts-Modul erkennt hohe Dringlichkeit und informiert die Bereitschaft. Entscheidungen bleiben beim Team.",
  },
  {
    question: "Wie schnell ist ein Pilot aktiv?",
    answer:
      "Ein erster Testflow ist oft in wenigen Tagen möglich. Für den Live-Betrieb prüfen wir vorher Datenschutz und Übergabe.",
  },
  {
    question: "Wie wird Datenschutz und AVV behandelt?",
    answer:
      "DSGVO-konform mit Servern in Frankfurt. Vor dem Live-Pilot klären wir AVV und Datenflüsse gemeinsam.",
  },
  {
    question: "Ist basemodul.de ein Produkt von AGENTEQ?",
    answer:
      "Ja. basemodul.de ist die Produktmarke für diese KI-Module. AGENTEQ bleibt der technische und organisatorische Anbieter im Hintergrund.",
  },
  {
    question: "Welche Infos fragt BaseModul ab?",
    answer:
      "Die Pflichtinfos fürs Weiterarbeiten: Kontakt, Einsatzort, Anliegen, Dringlichkeit, je nach Fall Fotos oder Dokumente.",
  },
  {
    question: "Müssen wir direkt alle Module nutzen?",
    answer:
      "Nein. Starten Sie mit einem Modul — erweitert wird erst, wenn der Pilot im Alltag hilft.",
  },
  {
    question: "Kann ich meine bestehende Nummer behalten?",
    answer:
      "Ja. Im Pilot reicht eine Testnummer. Später kann Ihre bestehende Nummer weitergeleitet werden.",
  },
  {
    question: "Was passiert mit WhatsApp und Fotos?",
    answer:
      "Das Chat- oder Foto-Modul sammelt fehlende Angaben ein und bündelt alles zu einer sauberen Übergabe.",
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
