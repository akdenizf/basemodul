"use client";

import { motion, Variants } from "framer-motion";
import { Plus, Check, ChevronDown } from "lucide-react";
import { AmbientOrbs, FlowGrid } from "./AmbientOrbs";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const rowV: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 26 } },
};

/* ── Telefon-Artefakt: kompakte Mini-Notiz ─────────────────────────────── */

function Field({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-dashed border-line pt-2 first:border-t-0 first:pt-0">
      <span className="text-[11px] text-faint">{label}</span>
      <span className={`text-[12px] font-medium text-ink ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}

// Kompakte Mini-Notiz — das große, vollständige Artefakt zeigt die
// RequestArtifactSection (#beispiel); hier nur der Vorgeschmack.
function MiniVorgang() {
  return (
    <div className="rounded-[12px] border border-line bg-paperdeep p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-faint">Vorgang</span>
        <span className="font-mono text-[10px] text-faint">22:47</span>
      </div>
      <div className="space-y-2">
        <Field label="Name" value="Klaus M." />
        <Field label="Telefon" value="0176 24 …" mono />
        <Field label="Anliegen" value="Rückruf gewünscht" />
      </div>
    </div>
  );
}

/* ── Weitere Module — scanbare Kacheln, Details nur bei Interesse ───────── */
// Emoji als Kategorie-Marker (dekorativ, aria-hidden — der Name daneben
// trägt die Information). Max. 1 Emoji pro Modul.

const extensions: { emoji: string; name: string; hint: string; details: string[] }[] = [
  {
    emoji: "🚨",
    name: "Notdienst-Modul",
    hint: "Dringendes sofort zur Bereitschaft",
    details: ["erkennt hohe Dringlichkeit", "fragt Pflichtinfos ab", "informiert die Bereitschaft"],
  },
  {
    emoji: "📅",
    name: "Termin-Modul",
    hint: "Wunschzeit im Vorfeld klären",
    details: ["klärt Leistung + Wunschzeit", "bereitet Termin oder Rückruf vor", "weniger Hin und Her"],
  },
  {
    emoji: "💬",
    name: "WhatsApp-Modul",
    hint: "Chat-Anfragen sortieren",
    details: ["stellt Rückfragen im Chat", "erkennt fehlende Angaben", "bündelt zu einem Vorgang"],
  },
  {
    emoji: "📎",
    name: "Foto- & Datei-Modul",
    hint: "Bilder gezielt anfordern",
    details: ["sendet Upload-Link", "fragt Kontext zum Bild ab", "erstellt strukturierten Fall"],
  },
];

export function ModulesSection() {
  return (
    <section id="modules" className="relative bg-paper pb-12 pt-8 lg:pb-16 lg:pt-10">
      <FlowGrid />
      <AmbientOrbs />
      <div className="relative mx-auto max-w-[1200px] px-6 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1fr] lg:items-center lg:gap-16">
          {/* Left — intro */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
              04 — Die Module
            </span>
            <h2 className="mt-4 mb-5 text-[clamp(32px,4vw,52px)] font-bold leading-[1.08] tracking-[-0.025em] text-ink">
              Ein Baukasten für<br />Ihre Anfragen.
            </h2>
            <p className="max-w-[360px] text-[16px] leading-[1.7] text-inksoft">
              Starten Sie mit dem Eingangskanal, der gerade am meisten Zeit kostet.
            </p>
            <span className="mt-7 inline-flex items-center gap-[7px] rounded-full border border-leafdimline bg-leafdim px-3 py-[5px] text-[11px] font-semibold uppercase tracking-[0.06em] text-leafbright">
              <span className="h-1.5 w-1.5 rounded-full bg-leafbright" />
              Eingang → Modul → Übergabe
            </span>
          </div>

          {/* Right — one core module + extension tiles */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
            {/* Telefon-Modul — der häufigste erste Einstieg, nicht "der Kern" */}
            <motion.div variants={rowV} className="glass-surface rounded-2xl p-6">
              <div className="mb-5 flex items-center gap-3.5">
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border border-leafdimline/60 bg-leafdim/50 text-[21px] leading-none"
                >
                  ☎️
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-[18px] font-bold text-ink">Telefon-Modul</h3>
                    <span className="rounded-full border border-leafdimline bg-leafdim px-2 py-[3px] text-[10px] font-semibold uppercase tracking-[0.06em] text-leafbright">
                      Häufigster Einstieg
                    </span>
                  </div>
                  <p className="mt-1 text-[13px] leading-snug text-inksoft">
                    Nimmt Anrufe an, erkennt das Anliegen und sichert Kontakt + Standort.
                  </p>
                </div>
              </div>

              <p className="mb-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
                <span className="h-1 w-1 rounded-full bg-leafbright" /> Ergebnis
              </p>
              <MiniVorgang />
            </motion.div>

            {/* Erweiterungen — kompakte Kacheln, Details aufklappbar */}
            <motion.div variants={rowV} className="mt-5">
              <p className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
                <Plus size={12} strokeWidth={2} className="text-leafbright" />
                Weitere Module · flexibel kombinierbar
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {extensions.map((e) => (
                  <div
                    key={e.name}
                    className="group/tile flex flex-col rounded-xl border border-white/10 bg-white/[0.04] p-3.5 backdrop-blur-md transition-colors duration-200 hover:border-leaf/40 hover:bg-white/[0.06]"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 items-center justify-center rounded-[9px] border border-line bg-paperdeep text-[15px] leading-none"
                    >
                      {e.emoji}
                    </span>
                    <div className="mt-2.5 text-[13px] font-semibold text-ink">{e.name}</div>
                    <div className="mt-0.5 text-[11px] text-faint">{e.hint}</div>

                    <details className="group mt-2">
                      <summary className="flex cursor-pointer list-none items-center gap-1 text-[11px] font-medium text-faint transition-colors hover:text-ink [&::-webkit-details-marker]:hidden">
                        Mehr Details
                        <ChevronDown
                          size={12}
                          className="transition-transform duration-200 group-open:rotate-180"
                        />
                      </summary>
                      <ul className="mt-1.5 space-y-1">
                        {e.details.map((d) => (
                          <li key={d} className="flex items-start gap-1.5 text-[11px] leading-[1.4] text-inksoft">
                            <Check size={10} strokeWidth={2.5} className="mt-[2px] shrink-0 text-leafbright" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </details>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[13px] text-faint">
                Alle Module führen zum selben Ergebnis: ein vollständiger Vorgang für Ihr Team.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
