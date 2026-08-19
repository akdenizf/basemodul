"use client";

import { motion, Variants } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 24 } },
};

const offers = [
  {
    name: "Anfrage-Eingang",
    price: "ab 750 €",
    note: "Setup",
    features: [
      "ein definierter Eingangskanal: Telefon, WhatsApp, Formular oder Foto",
      "Pflichtfelder, Zuständigkeit und sichere Teamübergabe",
      "Testfälle und Freigabe vor dem Go-live",
      "30-Tage-Pilot mit wöchentlicher Scorecard",
    ],
    cta: "30-Minuten-Check buchen",
    highlighted: true,
  },
  {
    name: "Anfrage-Flow",
    price: "ab 1.500 €",
    note: "Setup",
    features: [
      "erprobten Eingang um passende Regeln oder Anschlussmodule erweitern",
      "Telefon, WhatsApp, Kalender oder Foto-Upload",
      "Eskalations-, Rückfrage- und Übergabelogik",
      "Betreuung nach klar definiertem Umfang",
    ],
    cta: "30-Minuten-Check buchen",
    highlighted: false,
  },
  {
    name: "Betriebs-Agenten",
    price: "auf Anfrage",
    note: "nach Scoping",
    features: [
      "einen belegten Folgeengpass gezielt lösen",
      "Integration mit CRM, Kalender, Webhooks oder n8n",
      "individuelle Regeln, Reporting und Freigabe-Gates",
      "separates Scoping statt ungeplanter Sonderentwicklung",
    ],
    cta: "30-Minuten-Check buchen",
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <motion.section
      id="pricing"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="relative bg-paperdeep py-20"
    >
      <div className="relative mx-auto max-w-[1200px] px-6 lg:px-12">
        <motion.div variants={item} className="mb-14 max-w-[620px]">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
            09 — Pilot
          </span>
          <h2 className="mb-[18px] mt-4 text-[clamp(32px,4vw,52px)] font-bold leading-[1.08] tracking-[-0.025em] text-ink">
            30 Tage. Ein Eingang. Eine klare Entscheidung.
          </h2>
          <p className="text-[16px] leading-[1.7] text-inksoft">
            Kein Komplettsystem im Erstgespräch. Wir grenzen einen Kanal, die benötigten Informationen, Zuständigkeiten und eine sichere Übergabe ab – dann prüfen wir reale Fälle mit einer Scorecard.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {offers.map((offer) => (
            <motion.div
              key={offer.name}
              variants={item}
              className={`glass-surface relative flex h-full flex-col rounded-[14px] p-[30px] ${
                offer.highlighted ? "glass-accent" : ""
              }`}
            >
              {offer.highlighted && (
                <span className="absolute right-6 top-6 rounded-md bg-leafbtn px-3.5 py-1.5 text-[13px] font-bold uppercase tracking-[0.06em] text-white">
                  Erster Schritt
                </span>
              )}

              <div className="text-[15px] font-semibold tracking-[0.02em] text-label">{offer.name}</div>

              <div className="mb-6 mt-[18px] flex items-baseline gap-2.5">
                <span className="text-[38px] font-extrabold tracking-[-0.03em] text-ink">{offer.price}</span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">{offer.note}</span>
              </div>

              <ul className="mb-[26px] flex flex-1 flex-col gap-3.5">
                {offer.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-[11px] text-[14px] leading-[1.45] text-inksoft">
                    <Check size={16} strokeWidth={2.5} className="mt-0.5 shrink-0 text-leafbright" />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#cta"
                className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3.5 text-[15px] font-bold transition-all ${
                  offer.highlighted
                    ? "bg-leafbtn text-white hover:-translate-y-px hover:bg-leafbtnhover"
                    : "border border-line font-semibold text-ink hover:border-leaf/50 hover:bg-leafdim/30"
                }`}
              >
                {offer.cta}
                <ArrowUpRight size={16} />
              </a>
            </motion.div>
          ))}
        </div>

        <motion.p
          variants={item}
          className="mt-8 text-[11px] font-semibold uppercase tracking-[0.08em] text-faint"
        >
          Alle Preise zzgl. MwSt · laufende Kosten für Telefonie, WhatsApp, Betreuung oder zusätzliche Infrastruktur werden vor dem Go-live transparent festgelegt
        </motion.p>
      </div>
    </motion.section>
  );
}
