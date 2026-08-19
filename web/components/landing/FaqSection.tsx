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
    question: "Ist BaseModul eine reine Voice-Agentur?",
    answer:
      "Nein. Telefonie ist ein häufiger Einstieg, wenn dort heute Anfragen verloren gehen. BaseModul beginnt aber immer beim Prozess: Telefon, WhatsApp, Website oder Fotos werden zu einer vollständigen Teamübergabe.",
  },
  {
    question: "Müssen wir direkt alle Module nutzen?",
    answer:
      "Nein. Wir starten mit genau einem Eingangskanal. Termin, Foto/Datei, Prioritätslogik oder ein weiterer Betriebs-Agent kommen erst dazu, wenn der erste Ablauf im Alltag nachweislich hilft.",
  },
  {
    question: "Wo landet die fertige Anfrage?",
    answer:
      "Dort, wo Ihr Team heute arbeitet: zum Beispiel per E-Mail, WhatsApp, Sheet, Kalender, Ticket oder in einem bestehenden System. Zum Start wird kein neues Komplettsystem vorausgesetzt.",
  },
  {
    question: "Bleibt unser Team in Kontrolle?",
    answer:
      "Ja. BaseModul sammelt, strukturiert und übergibt. Fachliche Entscheidungen, verbindliche Zusagen, Angebote und Verträge bleiben bei Ihrem Team und werden nicht autonom getroffen.",
  },
  {
    question: "Was passiert bei einem echten Notfall?",
    answer:
      "Der Ablauf arbeitet nach Ihren vorab vereinbarten Signalen, fragt die benötigten Informationen ab und informiert die zuständige menschliche Bereitschaft oder einen definierten Fallback. Die fachliche Entscheidung trifft Ihr Betrieb.",
  },
  {
    question: "Wie läuft der 30-Tage-Pilot ab?",
    answer:
      "Zuerst legen wir Kanal, Pflichtfelder, Zuständigkeiten, Eskalationsregeln und Baseline fest. Danach testen wir Übergabe und Fallback. Im produktiven Teil dokumentieren wir reale Fälle und entscheiden am Ende mit der Scorecard über Ausbau, Nachschärfung oder Pause.",
  },
  {
    question: "Was wird im Pilot gemessen?",
    answer:
      "Zum Beispiel relevante Eingänge, nicht angenommene oder unvollständige Anfragen, vollständige Übergaben, Zeit bis zur Teamübergabe, Rückruf- oder Terminquote, menschliche Korrekturen und Fallbacks. Nicht verfügbare Ausgangsdaten werden nicht geschätzt.",
  },
  {
    question: "Was passiert nach den 30 Tagen?",
    answer:
      "Wenn Übergaben vollständig sind und das Team den Ablauf akzeptiert, erweitern wir bewusst. Wenn einzelne Fragen oder Regeln schwach sind, schärfen wir nach. Fehlt der nachweisbare Nutzen, vereinfachen oder pausieren wir statt künstlich ein Komplettsystem zu verkaufen.",
  },
  {
    question: "Wie werden Datenschutz und Datenflüsse behandelt?",
    answer:
      "Vor dem Go-live dokumentieren wir Datenfluss, Speicherort, Löschfristen und Auftragsverarbeitung für den konkreten Pilot. Ohne geklärte Übergabe- und Datenschutzregeln geht kein Ablauf produktiv.",
  },
  {
    question: "Kann später auch ein weiterer Betriebs-Agent dazukommen?",
    answer:
      "Ja, wenn ein weiterer operativer Engpass klar beschrieben und messbar ist – etwa Angebotsvorbereitung, Disposition, internes Wissen oder Reporting. Das wird dann separat gescoped, statt ungeplant in den ersten Pilot zu rutschen.",
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
