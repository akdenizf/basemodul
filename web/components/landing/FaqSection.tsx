"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 24 } },
};

const faqItems = [
  {
    question: "Wie funktioniert der Foto-Upload?",
    answer:
      "Bei einer Schadensmeldung sendet die KI automatisch einen SMS-Link an das Smartphone des Kunden. Über diesen Link kann der Kunde ein Foto hochladen, das sofort dem Ticket zugeordnet wird.",
  },
  {
    question: "Wie schnell ist das System aktiv?",
    answer:
      "In der Regel innerhalb von 48 Stunden. Wir konfigurieren die KI passend zu Ihren Bestandsdaten und stellen eine Testphase bereit.",
  },
  {
    question: "Was passiert bei einem echten Notfall?",
    answer:
      "Dringende Fälle wie Wasserrohrbrüche werden sofort als kritisch eingestuft. Die KI kann automatisch Handwerker benachrichtigen oder an Ihre Notfallhotline weiterleiten.",
  },
  {
    question: "Kann ich meine bestehende Nummer behalten?",
    answer:
      "Ja. Sie können Ihre Festnetznummer einfach auf die AGENTEQ-Zentrale umleiten oder eine neue Nummer von uns erhalten.",
  },
  {
    question: "Erkennt die KI verschiedene Dialekte?",
    answer:
      "Ja. Unsere KI ist speziell auf deutsche Dialekte und Fachbegriffe aus der Immobilienwirtschaft trainiert und unterstützt über 30 Sprachen.",
  },
  {
    question: "Gibt es eine Mindestvertragslaufzeit?",
    answer:
      "Nein. Alle Tarife sind monatlich kündbar. Keine versteckten Kosten, kein Risiko.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="group cursor-pointer rounded-2xl border border-slate-200/60 bg-white p-6 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-lg"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#12b355] transition-colors sm:text-base">{q}</h3>
        <ChevronDown
          size={18}
          className={`shrink-0 text-slate-400 group-hover:text-[#12b355] transition-all duration-300 ${open ? "rotate-180 text-[#12b355]" : ""}`}
        />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="mt-4 text-sm leading-relaxed text-slate-600">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqSection() {
  return (
    <motion.section
      id="faq"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="relative overflow-hidden py-24 lg:py-32 xl:py-40"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div variants={item} className="mb-16 text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#19e66f]">
            FAQ
          </p>
          <h2 className="font-display mx-auto max-w-2xl text-[38px] font-bold leading-[1.08] tracking-[-0.025em] text-slate-900 sm:text-[46px]">
            Häufig gestellte Fragen
          </h2>
        </motion.div>

        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
          {faqItems.map((faq, i) => (
            <motion.div key={i} variants={item}>
              <FaqItem q={faq.question} a={faq.answer} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
