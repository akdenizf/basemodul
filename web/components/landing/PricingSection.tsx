"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Check, Rocket } from "lucide-react";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 24 } },
};

const tiers = [
  {
    name: "Starter",
    monthly: "89",
    annual: "74",
    description: "Ideal für kleinere Bestände und den Einstieg.",
    features: [
      "100 Anrufe / Monat (Keine Minutentaktung)",
      "24/7 KI-Telefonassistent",
      "Automatisches Ticket-System",
      "Zuverlässiger E-Mail Support",
    ],
    cta: "Live-Demo buchen",
    highlighted: false,
  },
  {
    name: "Pro",
    monthly: "199",
    annual: "166",
    description: "Für wachsende Betriebe mit hohem Aufkommen.",
    features: [
      "300 Anrufe / Monat (Keine Minutentaktung)",
      "Automatischer Foto-Request via SMS",
      "Tiefgehende KI-Analytik & Reports",
      "Bevorzugter Premium-Support",
      "Alle Vorteile des Starter-Pakets",
    ],
    cta: "Live-Demo buchen",
    highlighted: true,
  },
  {
    name: "Individuell",
    monthly: null,
    annual: null,
    description: "Für Betriebe mit eigenen Prozessen, Nummern oder Tools.",
    features: [
      "Individuelles Anfrage-Schema",
      "Eigene Eskalationsregeln",
      "API, Webhooks oder E-Mail-Weiterleitung",
      "Persönliche Pilot-Begleitung",
    ],
    cta: "Kontakt aufnehmen",
    highlighted: false,
  },
];

export function PricingSection() {
  const [annual, setAnnual] = useState(true);

  return (
    <motion.section
      id="pricing"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="relative overflow-hidden py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div variants={item} className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-display text-[38px] font-bold leading-[1.08] tracking-[-0.025em] text-slate-900 sm:text-[46px]">
            Transparente Preise
          </h2>
          <p className="mt-4 text-lg font-medium text-slate-500">
            Monatlich kündbar. Einsatzbereit in 48 Stunden.
          </p>
        </motion.div>

        {/* Toggle */}
        <motion.div variants={item} className="mb-12 flex items-center justify-center gap-4">
          <span className={`text-[15px] font-bold ${!annual ? "text-slate-900" : "text-slate-400"}`}>
            Monatlich
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            aria-checked={annual}
            role="switch"
            className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ${
              annual ? "bg-[#19e66f]" : "bg-slate-200"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-7 w-7 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                annual ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-[15px] font-bold ${annual ? "text-slate-900" : "text-slate-400"}`}>
              Jährlich
            </span>
            <span className="rounded-full bg-[#19e66f]/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#12b355]">
              2 Monate gespart
            </span>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {tiers.map((tier) => (
            <motion.div
              key={tier.name}
              variants={item}
              className={`relative flex flex-col justify-between rounded-[2.5rem] p-2 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                tier.highlighted
                  ? "z-10 border border-[#19e66f]/40 bg-[#19e66f]/5 shadow-[0_20px_60px_rgba(25,230,111,0.15)] lg:-translate-y-2"
                  : "border border-slate-100 bg-slate-50 shadow-sm"
              }`}
            >
              <div className={`relative flex h-full flex-col justify-between overflow-hidden rounded-[calc(2.5rem-0.5rem)] px-8 py-10 shadow-[inset_0_1px_0_rgba(255,255,255,1)] ${
                tier.highlighted ? "bg-white" : "bg-white"
              }`}>
                
                {tier.highlighted && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                    <span className="rounded-b-xl bg-[#19e66f] px-5 py-2 text-[11px] font-bold uppercase tracking-wider text-[#0f1714] shadow-sm">
                      Beliebteste Wahl
                    </span>
                  </div>
                )}

                <div>
                  <h3 className="font-display text-2xl font-bold text-slate-900">{tier.name}</h3>
                  <p className="mt-2 text-[14px] font-medium leading-relaxed text-slate-500">{tier.description}</p>

                  <div className="mt-8 flex items-baseline gap-1">
                    {tier.annual ? (
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-1">
                          <span className="font-display text-5xl font-bold tracking-tight text-slate-900">
                            {annual ? tier.annual : tier.monthly}€
                          </span>
                          <span className="text-[15px] font-bold text-slate-400">/Monat</span>
                        </div>
                        {annual && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-[13px] font-bold text-slate-300 line-through">
                              {tier.monthly}€
                            </span>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#12b355]">
                              (jährliche Zahlung)
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="font-display text-4xl font-bold tracking-tight text-slate-900">
                        Auf Anfrage
                      </span>
                    )}
                  </div>

                  <ul className="mt-10 flex flex-col gap-4">
                    {tier.features.map((feat, j) => (
                      <li key={j} className="flex items-start gap-3 text-[14px] font-medium text-slate-600">
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#19e66f]/15">
                          <Check size={12} strokeWidth={3} className="text-[#12b355]" />
                        </div>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="#cta"
                  className={`mt-12 block w-full rounded-full px-6 py-4 text-center text-[15px] font-bold transition-all duration-300 ${
                    tier.highlighted
                      ? "bg-[#19e66f] text-[#0f1714] shadow-[0_8px_30px_rgba(25,230,111,0.25)] hover:bg-[#15d163] hover:scale-[0.98] hover:shadow-[0_12px_40px_rgba(25,230,111,0.35)]"
                      : "bg-slate-100 text-slate-900 shadow-sm hover:scale-[0.98] hover:bg-slate-200"
                  }`}
                >
                  {tier.cta}
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Setup & Onboarding Modules (Double Bezel Card) */}
        <div className="mt-24">
          <motion.div
            variants={item}
            className="group relative mx-auto max-w-4xl rounded-[3rem] border border-slate-100 bg-slate-50 p-2 shadow-sm"
          >
            <div className="relative flex flex-col items-center gap-12 overflow-hidden rounded-[calc(3rem-0.5rem)] bg-white px-8 py-12 shadow-[0_30px_80px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)] md:p-12 lg:flex-row">

              {/* Background Accent */}
              <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#19e66f] to-emerald-300 opacity-80" />
              <div className="pointer-events-none absolute -mr-16 -mt-16 right-0 top-0 h-80 w-80 rounded-full bg-[#19e66f]/5 blur-[100px] transition-colors group-hover:bg-[#19e66f]/10" />

              {/* Left Column: Content */}
              <div className="relative z-10 w-full flex-1">
                <div className="mb-8 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#19e66f]/20 bg-[#19e66f]/10 text-[#12b355] shadow-sm">
                    <Rocket size={26} strokeWidth={2} />
                  </div>
                  <h3 className="font-display text-3xl font-bold tracking-tight text-slate-900">
                    KI-Onboarding
                  </h3>
                </div>

                <p className="mb-10 max-w-xl text-[16px] font-medium leading-relaxed text-slate-500">
                  Kein generisches Setup - unser Team konfiguriert das System auf Ihre Anfragen, Prozesse und Sprache. Ihre KI kennt die wichtigsten Abläufe vom ersten Anruf an.
                </p>

                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                  {[
                    "Individuelle KI-Konfiguration",
                    "Sicherer Daten-Import",
                    "Persönlicher Onboarding-Call",
                    "30 Tage Priority-Support",
                  ].map((text) => (
                    <div key={text} className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100">
                        <span className="h-2 w-2 rounded-full bg-[#19e66f] shadow-sm"></span>
                      </span>
                      <span className="text-[14px] font-bold text-slate-700">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Pricing */}
              <div className="relative z-10 flex w-full shrink-0 flex-col items-center justify-center border-t border-slate-100 pt-10 lg:w-auto lg:items-start lg:border-l lg:border-t-0 lg:pl-16 lg:pt-0">
                <p className="mb-3 text-[12px] font-bold uppercase tracking-widest text-slate-400">
                  Einmalige Einrichtungsgebühr
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-5xl font-bold tracking-tight text-slate-900 md:text-6xl">
                    990 €
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    einmalig
                  </span>
                </div>
                <p className="mt-3 text-[13px] font-medium text-slate-400">
                  Einsatzbereit in 48 Stunden.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.p variants={item} className="relative z-10 mt-12 text-center text-[13px] font-bold text-slate-400">
          Alle Preise zzgl. gesetzl. MwSt.
        </motion.p>
      </div>
    </motion.section>
  );
}
