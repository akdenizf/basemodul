"use client";

import { motion } from "framer-motion";
import {
  PhoneIncoming,
  User,
  MapPin,
  Wrench,
  AlertTriangle,
  Paperclip,
  ArrowRight,
  Send,
  Check,
} from "lucide-react";

// Der Logo-Ersatz: statt Kundenlogos zeigt BaseModul den Output.
// Ein einziges, scanbares Vorgangs-Artefakt — keine Card-in-Card.
const FIELDS = [
  {
    Icon: PhoneIncoming,
    label: "Eingang",
    value: "Anruf · heute 22:47",
  },
  {
    Icon: User,
    label: "Kontakt",
    value: "Klaus M. · 0176 24 68 …",
  },
  {
    Icon: MapPin,
    label: "Einsatzort",
    value: "Bergstraße 12, 51063 Köln",
  },
  {
    Icon: Wrench,
    label: "Anliegen",
    value: "Heizung ausgefallen, kein Warmwasser",
  },
  {
    Icon: AlertTriangle,
    label: "Dringlichkeit",
    value: "Hoch · Notdienst",
    urgent: true,
  },
  {
    Icon: Paperclip,
    label: "Anhänge",
    value: "2 Fotos · per Upload-Link nachgereicht",
  },
  {
    Icon: ArrowRight,
    label: "Nächster Schritt",
    value: "Rückruf durch Bereitschaft — Team entscheidet",
  },
  {
    Icon: Send,
    label: "Übergabe",
    value: "E-Mail + WhatsApp an die Bereitschaft · 22:49",
    ok: true,
  },
];

export function RequestArtifactSection() {
  return (
    <section id="beispiel" className="relative bg-paper py-14 lg:py-20">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
        {/* Header */}
        <div className="mx-auto max-w-[640px] text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
            01 — Beispiel
          </span>
          <h2 className="mt-4 text-[clamp(28px,3.5vw,44px)] font-bold leading-[1.1] tracking-[-0.025em] text-ink">
            So sieht eine vollständige Anfrage aus.
          </h2>
          <p className="mt-4 text-[16px] leading-[1.7] text-inksoft">
            BaseModul sammelt die Pflichtinfos ein, markiert Dringlichkeit und
            übergibt den Vorgang dort, wo Ihr Team weiterarbeitet.
          </p>
        </div>

        {/* Das Artefakt */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="glass-surface mx-auto mt-10 max-w-[680px] rounded-2xl lg:mt-12"
        >
          {/* Artefakt-Kopf */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-7">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                Vollständiger Vorgang
              </span>
              <span className="font-mono text-[10px] text-faint">#BM-2417</span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-leafdimline bg-leafdim px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-leafbright">
              <Check size={11} strokeWidth={2.6} />
              Bereit zur Übergabe
            </span>
          </div>

          {/* Felder — gestapelt auf Mobile, Label-Spalte ab sm */}
          <div className="px-5 py-2 sm:px-7">
            {FIELDS.map((f) => (
              <div
                key={f.label}
                className="grid gap-1 border-t border-dashed border-line py-3.5 first:border-t-0 sm:grid-cols-[160px_1fr] sm:items-baseline sm:gap-4"
              >
                <span className="flex items-center gap-2 text-[12px] font-medium text-faint">
                  <f.Icon
                    size={13}
                    strokeWidth={1.9}
                    className={
                      f.urgent
                        ? "text-amber-400"
                        : f.ok
                        ? "text-leafbright"
                        : "text-faint"
                    }
                  />
                  {f.label}
                </span>
                {f.urgent ? (
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[12px] font-bold text-amber-300">
                    <AlertTriangle size={12} strokeWidth={2.2} />
                    {f.value}
                  </span>
                ) : f.ok ? (
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-leafdimline bg-leafdim px-2.5 py-1 text-[12px] font-semibold text-leafbright">
                    <Check size={12} strokeWidth={2.6} />
                    {f.value}
                  </span>
                ) : (
                  <span className="text-[14px] font-medium leading-snug text-ink">
                    {f.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Vorher / Nachher */}
        <div className="mx-auto mt-8 flex max-w-[680px] flex-col items-center gap-1.5 text-center sm:flex-row sm:justify-center sm:gap-3">
          <span className="text-[14px] text-faint">
            Vorher: 7 Nachrichten, 3 Rückfragen.
          </span>
          <ArrowRight size={14} className="hidden text-white/20 sm:block" />
          <span className="text-[14px] font-semibold text-leafbright">
            Nachher: ein sauberer Vorgang.
          </span>
        </div>

        {/* Weiter in die Demo */}
        <div className="mt-5 text-center">
          <a
            href="#livedemo"
            className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-inksoft transition-colors hover:text-ink"
          >
            Demo ansehen
            <ArrowRight
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
