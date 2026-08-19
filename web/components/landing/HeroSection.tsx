"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  PhoneMissed,
  PhoneIncoming,
  ShieldCheck,
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-paper py-14 sm:py-20 lg:py-24">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-52"
        style={{
          background:
            "radial-gradient(ellipse 60% 90% at 18% 0%, rgba(46,98,70,0.1) 0%, transparent 72%)",
        }}
      />
      <div className="relative mx-auto grid w-full max-w-[1200px] items-center gap-11 px-6 lg:grid-cols-[1fr_0.92fr] lg:gap-16 lg:px-12">
        <div className="max-w-[620px]">
          <div className="inline-flex items-center gap-2 border-l-[3px] border-leaf pl-3 text-[11px] font-bold uppercase tracking-[0.1em] text-leaf">
            KI-Telefonassistent für Handwerksbetriebe
          </div>
          <h1 className="mt-5 text-balance text-[clamp(40px,6vw,72px)] font-extrabold leading-[1.03] tracking-[-0.048em] text-ink">
            Jeder verpasste Anruf kann ein <span className="text-leaf">Auftrag</span> sein.
          </h1>
          <p className="mt-6 max-w-[540px] text-[17px] leading-[1.7] text-inksoft sm:text-[19px]">
            Ein KI-Programm nimmt den Anruf an, wenn Sie nicht rankönnen. Es
            fragt Name, Adresse und Problem ab und schickt Ihrem Team alles
            fertig aufs Handy.
          </p>
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href="#cta"
              className="group inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-leafbtn px-7 py-3.5 text-[15px] font-bold text-white transition-all duration-200 hover:-translate-y-px hover:bg-leafbtnhover"
            >
              30-Minuten-Check buchen
              <ArrowUpRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
            <a
              href="#beispiel"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-[#BFC7BB] bg-white px-6 py-3.5 text-[15px] font-semibold text-ink transition-all duration-200 hover:border-leaf hover:bg-[#F7FAF5]"
            >
              Beispiel-Vorgang ansehen
            </a>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-inksoft">
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={15} className="text-leaf" /> Ein klarer Eingang statt fünf Kanäle</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck size={15} className="text-leaf" /> Menschliche Übergabe bleibt gesetzt</span>
          </div>
        </div>

        {/* Derselbe Anruf, zweimal. Der Unterschied erklärt das Produkt. */}
        <div className="mx-auto w-full max-w-[420px] lg:justify-self-end">
          <p className="mb-2 text-center text-[11px] font-bold uppercase tracking-[0.1em] text-faint">
            Beispiel · so kommt ein Anruf bei Ihnen an
          </p>
          {/* Heute: was auf dem Handy landet, wenn niemand rangeht */}
          <div className="rounded-[10px] border border-line bg-paperdeep px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-inksoft">
                <PhoneMissed size={16} strokeWidth={2} className="text-faint" />
                Verpasster Anruf
              </span>
              <span className="font-mono text-[12px] text-faint">19:42</span>
            </div>
            <p className="mt-2.5 font-mono text-[15px] text-faint">+49 176 •• •• ••</p>
            <p className="mt-3 border-t border-dashed border-line pt-3 text-[13px] text-faint">
              Kein Name. Keine Adresse. Kein Anliegen.
            </p>
          </div>

          <div className="my-3 flex items-center gap-3 px-1">
            <span className="h-px flex-1 bg-line" />
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-leaf">
              Derselbe Anruf mit BaseModul
            </span>
            <span className="h-px flex-1 bg-line" />
          </div>

          {/* Mit BaseModul: was das Team stattdessen bekommt */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="work-paper rounded-[10px] px-5 py-4"
          >
            <div className="flex items-center justify-between gap-3 border-b border-[#D9D8CF] pb-3">
              <span className="inline-flex items-center gap-2 text-[13px] font-bold text-ink">
                <PhoneIncoming size={16} strokeWidth={2} className="text-leaf" />
                Anruf angenommen
              </span>
              <span className="font-mono text-[12px] text-faint">19:42</span>
            </div>

            <p className="mt-3.5 text-[17px] font-bold leading-snug text-ink">
              Heizung ausgefallen, kein Warmwasser
            </p>

            <dl className="mt-3 space-y-2 text-[14px]">
              <div className="flex gap-2">
                <dt className="w-[74px] shrink-0 text-faint">Kunde</dt>
                <dd className="font-semibold text-ink">Klaus Bauer</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-[74px] shrink-0 text-faint">Telefon</dt>
                <dd className="font-mono font-semibold text-ink">0176 24•• •••</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-[74px] shrink-0 text-faint">Adresse</dt>
                <dd className="font-semibold text-ink">Lindwurmstraße 84, München</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-[74px] shrink-0 text-faint">Dringend</dt>
                <dd className="font-semibold text-priority">Ja, Notdienst</dd>
              </div>
            </dl>

            <div className="mt-4 flex items-center justify-between gap-3 rounded-[6px] border border-leafdimline bg-leafdim px-3.5 py-2.5">
              <span className="inline-flex items-center gap-2 text-[13px] font-bold text-ink">
                <CheckCircle2 size={16} className="text-leaf" />
                An Bereitschaft übergeben
              </span>
              <span className="font-mono text-[12px] text-leaf">19:43</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
