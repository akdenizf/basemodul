"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

// Scanability: pro Card 1 dominantes Emoji als Kategorie-Marker (dekorativ,
// aria-hidden — das Textlabel daneben trägt die Information). Max. 2
// Vorher-/Mit-BaseModul-Bullets — die Guard-Aussage ("Team entscheidet")
// steckt direkt in den Bullets, kein zusätzliches Accordion nötig.
const CASES = [
  {
    emoji: "🚨",
    tag: "SHK / Kälte / Notdienst",
    scenario: "Heizungsausfall um 22:13 Uhr.",
    before: ["Mailbox statt Antwort", "Adresse & Dringlichkeit unklar"],
    after: ["fragt Pflichtinfos ab", "informiert Bereitschaft — Team entscheidet"],
    artifact: "Notfallkarte",
    amber: true,
  },
  {
    emoji: "🚗",
    tag: "Kfz / Gutachter / Werkstatt",
    scenario: "7 Fotos eines Unfallschadens per WhatsApp.",
    before: ["Bilder ohne Kontext", "Büro fragt telefonisch nach"],
    after: ["fragt Fahrzeugschein + Kurzbeschreibung ab", "bündelt zu einem Fall"],
    artifact: "Schadenfall",
    amber: false,
  },
  {
    emoji: "📦",
    tag: "Entrümpelung / Reinigung",
    scenario: "Wohnungsauflösung über das Kontaktformular.",
    before: ["Stockwerk, Aufzug, Volumen fehlen", "Angebot nicht kalkulierbar"],
    after: ["sammelt Eckdaten per Chat", "Team erhält Angebotsgrundlage"],
    artifact: "Angebotsgrundlage",
    amber: false,
  },
];

export function UseCasesSection() {
  return (
    <section className="relative bg-paperdeep py-16 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
        <div className="mb-10 lg:mb-14">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
            03 — Praxisbeispiele
          </span>
          <h2 className="mt-4 text-[clamp(28px,3.5vw,44px)] font-bold leading-[1.1] tracking-[-0.025em] text-ink">
            So sieht BaseModul im Betriebsalltag aus.
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {CASES.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              className="flex flex-col rounded-2xl border border-white/[0.07] bg-paper2 p-6"
            >
              {/* Header: Emoji-Marker + Branche + Szenario */}
              <div className="mb-5 flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] text-[20px] leading-none ${
                    c.amber
                      ? "border border-amber-400/30 bg-amber-400/10"
                      : "border border-leafdimline/60 bg-leafdim/50"
                  }`}
                >
                  {c.emoji}
                </span>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-faint">
                    {c.tag}
                  </div>
                  <div className="mt-1 text-[14px] font-semibold leading-snug text-ink">
                    {c.scenario}
                  </div>
                </div>
              </div>

              {/* Vorher / Mit BaseModul — kurze Bullets statt Prosa */}
              <div className="mt-auto space-y-3">
                <div className="rounded-xl border border-white/[0.06] bg-paperdeep p-3.5">
                  <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-faint">
                    <X size={10} strokeWidth={2.5} className="text-red-400/70" />
                    Vorher
                  </div>
                  <ul className="space-y-1.5">
                    {c.before.map((line) => (
                      <li
                        key={line}
                        className="flex items-start gap-2 text-[13px] leading-[1.45] text-inksoft"
                      >
                        <X
                          size={11}
                          strokeWidth={2.5}
                          className="mt-[3px] shrink-0 text-red-400/50"
                        />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-leafdimline/40 bg-leaf/[0.06] p-3.5">
                  <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-leafbright">
                    <Check size={10} strokeWidth={2.5} />
                    Mit BaseModul
                  </div>
                  <ul className="space-y-1.5">
                    {c.after.map((line) => (
                      <li
                        key={line}
                        className="flex items-start gap-2 text-[13px] leading-[1.45] text-inksoft"
                      >
                        <Check
                          size={11}
                          strokeWidth={2.5}
                          className="mt-[3px] shrink-0 text-leafbright"
                        />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-2 pt-0.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
                    Ergebnis
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-leafdimline bg-leafdim px-2.5 py-[3px] text-[11px] font-semibold text-leafbright">
                    <Check size={10} strokeWidth={2.6} />
                    {c.artifact}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
