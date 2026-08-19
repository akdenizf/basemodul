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

const FIELDS = [
  { Icon: User, label: "Wer ruft an", value: "Klaus M. · 0176 24 68 …" },
  { Icon: MapPin, label: "Wohin", value: "Bergstraße 12, 51063 Köln" },
  { Icon: Wrench, label: "Was ist los", value: "Heizung ausgefallen, kein Warmwasser" },
  { Icon: AlertTriangle, label: "Wie dringend", value: "Hoch · Notdienst", urgent: true },
  { Icon: Paperclip, label: "Anhänge", value: "2 Fotos · per Upload-Link nachgereicht" },
  { Icon: ArrowRight, label: "Was zu tun ist", value: "Rückruf durch Bereitschaft. Ihr Team entscheidet." },
  { Icon: Send, label: "Schon rausgeschickt", value: "E-Mail + WhatsApp an die Bereitschaft", time: "22:49", ok: true },
];

export function RequestArtifactSection() {
  return (
    <section id="beispiel" className="relative bg-paper2 py-16 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
        <div className="mx-auto max-w-[690px] text-center">
          <span className="border-l-[3px] border-leaf pl-3 text-[11px] font-bold uppercase tracking-[0.1em] text-leaf">01 — Beispiel aus dem Alltag</span>
          <h2 className="mt-5 text-[clamp(30px,3.6vw,47px)] font-bold leading-[1.08] tracking-[-0.035em] text-ink">
            Ein Anruf um 22:47. Zwei Minuten später weiß die Bereitschaft alles.
          </h2>
          <p className="mt-4 text-[16px] leading-[1.7] text-inksoft">
            Niemand musste rangehen, nachfragen oder etwas notieren. Genau das lag um
            22:49 bei der Bereitschaft.
          </p>
        </div>

        <div className="relative mx-auto mt-10 max-w-[720px] lg:mt-12">
          <div className="absolute -right-2.5 -top-2.5 h-full w-full rounded-[6px] border border-[#D9D8CF] bg-[#F1F0E8]" />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="work-paper relative rounded-[6px]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9D8CF] px-5 py-4 sm:px-7">
              <div className="flex items-center gap-2.5">
                <PhoneIncoming size={17} strokeWidth={2} className="text-leaf" />
                <span className="text-[15px] font-bold text-ink">Anruf angenommen</span>
                <span className="font-mono text-[12px] text-faint">22:47</span>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-leafdimline bg-leafdim px-2.5 py-1 text-[11px] font-bold text-leaf">
                <Check size={11} strokeWidth={2.6} />
                Nichts fehlt
              </span>
            </div>

            <div className="px-5 py-2 sm:px-7">
              {FIELDS.map((f) => (
                <div key={f.label} className="grid gap-1 border-t border-dashed border-[#D9D8CF] py-3.5 first:border-t-0 sm:grid-cols-[178px_1fr] sm:items-baseline sm:gap-4">
                  <span className="flex items-center gap-2 text-[13px] text-faint">
                    <f.Icon size={13} strokeWidth={1.9} className={f.urgent ? "text-priority" : f.ok ? "text-leaf" : "text-faint"} />
                    {f.label}
                  </span>
                  {f.urgent ? (
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-priorityline bg-prioritydim px-2.5 py-1 text-[13px] font-bold text-priority">
                      <AlertTriangle size={12} strokeWidth={2.2} /> {f.value}
                    </span>
                  ) : f.ok ? (
                    <span className="inline-flex w-fit flex-wrap items-center gap-1.5 rounded-full border border-leafdimline bg-leafdim px-2.5 py-1 text-[13px] font-semibold text-leaf">
                      <Check size={12} strokeWidth={2.6} /> {f.value}
                      {f.time && <span className="font-mono text-[12px] font-semibold opacity-80">· {f.time}</span>}
                    </span>
                  ) : (
                    <span className="text-[15px] font-semibold leading-snug text-ink">{f.value}</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mx-auto mt-8 flex max-w-[720px] flex-col items-center gap-1.5 text-center sm:flex-row sm:justify-center sm:gap-3">
          <span className="text-[14px] text-inksoft">Ohne BaseModul: verpasster Anruf, Rückruf am nächsten Morgen.</span>
          <ArrowRight size={14} className="hidden text-faint sm:block" />
          <span className="text-[14px] font-bold text-leaf">Mit BaseModul: Bereitschaft ist informiert.</span>
        </div>

        <div className="mt-5 text-center">
          <a href="#livedemo" className="group inline-flex min-h-[44px] items-center gap-1.5 text-[14px] font-bold text-leaf transition-colors hover:text-leafbtnhover">
            Hören, wie so ein Anruf abläuft
            <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
