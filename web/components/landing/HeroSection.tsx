"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  MapPin,
  PhoneIncoming,
  ShieldCheck,
  User,
  Wrench,
} from "lucide-react";
import { BaseModulFlow } from "./BaseModulFlow";

const NOTE_FIELDS = [
  { Icon: User, label: "Kunde", value: "Familie Bauer · 0176 24•• •••" },
  { Icon: MapPin, label: "Einsatzort", value: "Lindwurmstraße 84, München" },
  { Icon: Wrench, label: "Anliegen", value: "Heizung kalt · kein Warmwasser" },
  { Icon: Clock3, label: "Rückruf", value: "Bereitschaft bis 23:00 Uhr" },
];

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
      <div className="relative mx-auto grid w-full max-w-[1200px] items-center gap-11 px-6 lg:grid-cols-[0.98fr_1.02fr] lg:gap-16 lg:px-12">
        <div className="max-w-[620px]">
          <div className="inline-flex items-center gap-2 border-l-[3px] border-leaf pl-3 text-[11px] font-bold uppercase tracking-[0.1em] text-leaf">
            Für lokale Servicebetriebe
          </div>
          <h1 className="mt-5 text-balance text-[clamp(40px,6vw,72px)] font-extrabold leading-[1.03] tracking-[-0.048em] text-ink">
            Wenn Ihr Team im Einsatz ist, darf keine Anfrage <span className="text-leaf">im Leeren landen.</span>
          </h1>
          <p className="mt-6 max-w-[575px] text-[17px] leading-[1.7] text-inksoft sm:text-[19px]">
            BaseModul bringt Anrufe, WhatsApp-Nachrichten, Formulare und Fotos in einen sauberen Vorgang – damit Ihr Team sofort weiß, wen es zurückruft, worum es geht und was als Nächstes zu tun ist.
          </p>
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href="#cta"
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-leafbtn px-7 py-3.5 text-[15px] font-bold text-white transition-all duration-200 hover:-translate-y-px hover:bg-leafbtnhover"
            >
              30-Minuten-Check buchen
              <ArrowUpRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
            <a
              href="#beispiel"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#BFC7BB] bg-white px-6 py-3.5 text-[15px] font-semibold text-ink transition-all duration-200 hover:border-leaf hover:bg-[#F7FAF5]"
            >
              Beispiel-Vorgang ansehen
            </a>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-inksoft">
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={15} className="text-leaf" /> Ein klarer Eingang statt fünf Kanäle</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck size={15} className="text-leaf" /> Menschliche Übergabe bleibt gesetzt</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[555px] lg:justify-self-end">
          {/* Scene: Eingang → BaseModul → Übergabe, als echte Pipeline statt einer einzelnen Karte */}
          <div className="rounded-[8px] border border-line bg-inkdeep px-5 py-6 shadow-[0_24px_50px_-30px_rgba(22,35,28,0.55)] sm:px-7">
            <p className="text-center font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-signaldim">
              Eingang → Verarbeitung → Übergabe
            </p>
            <div className="mt-4 flex justify-center overflow-x-auto">
              <BaseModulFlow size="full" orientation="horizontal" animated />
            </div>
          </div>

          {/* Tiefengestaffelte Rückrufnotiz, an die Szene oben angebunden */}
          <div className="relative mt-6">
            <div className="absolute -right-2 -top-2 h-full w-full rounded-[6px] border border-[#D9D8CF] bg-[#F1F0E8]" />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="work-paper relative rotate-[1deg] rounded-[6px] p-4 sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#D9D8CF] pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-leaf text-white"><PhoneIncoming size={20} strokeWidth={2} /></span>
                  <div>
                    <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-faint">
                      Neue Rückrufnotiz
                      <span className="font-mono normal-case tracking-normal text-faint/80">#BM-2417</span>
                    </p>
                    <p className="mt-0.5 text-[15px] font-bold text-ink">Heizung ausgefallen · Rückruf benötigt</p>
                  </div>
                </div>
                <span className="border border-[#E5C8AB] bg-[#FCF0E5] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#A75420]">Dringend</span>
              </div>

              <div className="mt-2">
                {NOTE_FIELDS.map(({ Icon, label, value }) => (
                  <div key={label} className="grid grid-cols-[104px_1fr] gap-3 border-b border-dashed border-[#D9D8CF] py-3.5 sm:grid-cols-[124px_1fr]">
                    <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.07em] text-faint"><Icon size={14} strokeWidth={1.9} /> {label}</span>
                    <span className="text-[14px] font-semibold leading-snug text-ink">{value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-col gap-3 rounded-[5px] border border-[#BED2C1] bg-[#EAF0E8] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-leaf">Nächster Schritt</p>
                  <p className="mt-1 text-[15px] font-bold text-ink">Bereitschaft informiert.</p>
                </div>
                <span className="inline-flex w-fit items-center gap-1.5 font-mono text-[12px] font-semibold text-leaf"><CheckCircle2 size={15} /> 22:49 · Übergabe bereit</span>
              </div>
            </motion.div>
          </div>
          <p className="mt-4 text-center text-[12px] font-medium text-inksoft">Nicht noch ein Tool. Ein Vorgang, mit dem Ihr Team arbeiten kann.</p>
        </div>
      </div>
    </section>
  );
}
