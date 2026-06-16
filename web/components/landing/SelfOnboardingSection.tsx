"use client";

import { motion, Variants } from "framer-motion";
import { MessageSquare, UserCheck, ShieldCheck, Check, PhoneIncoming } from "lucide-react";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 24 } },
};

const BENEFITS = [
  {
    icon: MessageSquare,
    title: "Automatische SMS",
    description: "Die KI erkennt eine unbekannte Nummer und sendet sofort einen Registrierungs-Link per SMS.",
  },
  {
    icon: UserCheck,
    title: "Selbst-Eintragung",
    description: "Der Kunde bestätigt Name und Adresse selbst und lädt optional direkt ein Foto des Schadens hoch.",
  },
  {
    icon: ShieldCheck,
    title: "Sauber erfasst",
    description: "Kein Anrufer bleibt anonym — inklusive Doppel-SMS-Schutz und Rate-Limit gegen Missbrauch.",
  },
];

const FIELDS = [
  { label: "Name", value: "Max Mustermann" },
  { label: "Adresse", value: "Hauptstraße 12, München" },
  { label: "Foto", value: "Schaden_Bad.jpg" },
];

export function SelfOnboardingSection() {
  return (
    <motion.section
      id="self-onboarding"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="relative overflow-hidden bg-[#fafaf8] py-28 lg:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">

          {/* ── LEFT: copy + benefits ─────────────────────────────── */}
          <motion.div variants={item} className="flex flex-col gap-8">
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#19e66f]">
                Self-Onboarding
              </p>
              <h2 className="font-display max-w-xl text-[38px] font-bold leading-[1.08] tracking-[-0.025em] text-slate-900 sm:text-[46px]">
                Auch unbekannte Anrufer werden vollständig erfasst.
              </h2>
              <p className="mt-6 max-w-lg text-[18px] font-medium leading-[1.7] text-slate-500">
                Ruft jemand an, den Sie noch nicht im System haben, erkennt die KI das sofort — und
                lässt den Kunden sich per SMS selbst registrieren. Ganz ohne Zutun Ihres Teams.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              {BENEFITS.map((b) => (
                <div key={b.title} className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-slate-200 bg-white text-[#12b355] shadow-sm">
                    <b.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold tracking-tight text-slate-900">{b.title}</h3>
                    <p className="mt-1 text-[14px] leading-relaxed text-slate-500">{b.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT: SMS + registration mockup ──────────────────── */}
          <motion.div variants={item} className="relative mx-auto w-full max-w-[420px]">
            <div className="rounded-[2rem] border border-slate-200/60 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-7">

              {/* Incoming-call header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#19e66f]/20 bg-[#19e66f]/10 text-[#12b355]">
                    <PhoneIncoming className="h-[18px] w-[18px]" />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-slate-900">Eingehender Anruf</p>
                    <p className="text-[12px] font-medium text-slate-500">Unbekannte Nummer</p>
                  </div>
                </div>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-600">
                  Nicht im System
                </span>
              </div>

              {/* Outgoing SMS bubble */}
              <div className="mt-5 flex justify-end">
                <div className="max-w-[85%] rounded-[1.25rem] rounded-tr-sm bg-[#19e66f] px-4 py-3 text-[13px] font-medium leading-relaxed text-[#0f1714] shadow-sm">
                  Guten Tag! Damit wir Ihr Anliegen zuordnen können, bestätigen Sie bitte kurz Ihre Daten:
                  <span className="mt-2 block font-mono text-[12px] font-bold underline underline-offset-2">
                    agenteq.de/r/8f2a
                  </span>
                </div>
              </div>

              {/* Self-registration card filling in */}
              <div className="mt-5 rounded-2xl border border-slate-100 bg-[#fafafa] p-4">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Selbst-Registrierung
                </p>
                <div className="flex flex-col gap-2.5">
                  {FIELDS.map((f, i) => (
                    <motion.div
                      key={f.label}
                      initial={{ opacity: 0, x: 8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.18, type: "spring", stiffness: 220, damping: 22 }}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-3.5 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{f.label}</p>
                        <p className="truncate text-[13px] font-semibold text-slate-700">{f.value}</p>
                      </div>
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#19e66f]/15">
                        <Check className="h-3 w-3 text-[#12b355]" strokeWidth={3} />
                      </span>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.1, type: "spring", stiffness: 220, damping: 22 }}
                  className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-[#0f1714] py-2.5 text-[12px] font-bold text-white"
                >
                  <ShieldCheck className="h-4 w-4 text-[#19e66f]" />
                  Verifiziert &amp; im Dashboard erfasst
                </motion.div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.section>
  );
}
