"use client";

import { motion } from "framer-motion";
import { ArrowRight, AlertTriangle, Car, Package } from "lucide-react";

// Ein Fall = eine Situation, ein Ergebnis. Kein Vorher/Nachher-Doppelblock:
// die Verwandlung selbst ist die Aussage.
const CASES = [
  {
    Icon: AlertTriangle,
    tag: "SHK / Kälte / Notdienst",
    situation: "Heizung fällt um 22:13 aus. Niemand im Büro.",
    result: "Bereitschaft weiß, wo, was und wie dringend.",
    amber: true,
  },
  {
    Icon: Car,
    tag: "Kfz / Gutachter / Werkstatt",
    situation: "Sieben Unfallfotos per WhatsApp, sonst nichts.",
    result: "Fahrzeugschein und Beschreibung liegen dabei.",
    amber: false,
  },
  {
    Icon: Package,
    tag: "Entrümpelung / Reinigung",
    situation: "Anfrage für eine Wohnungsauflösung im Formular.",
    result: "Stockwerk, Aufzug und Volumen sind geklärt.",
    amber: false,
  },
];

export function UseCasesSection() {
  return (
    <section className="relative bg-paperdeep py-16 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
        <div className="mb-10 max-w-[620px] lg:mb-14">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
            03 — Praxisbeispiele
          </span>
          <h2 className="mt-4 text-[clamp(28px,3.5vw,44px)] font-bold leading-[1.1] tracking-[-0.025em] text-ink">
            Drei Betriebe, dasselbe Ergebnis.
          </h2>
          <p className="mt-4 text-[16px] leading-[1.7] text-inksoft">
            Links steht, was reinkommt. Rechts, was Ihr Team daraus bekommt.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {CASES.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              className="flex flex-col rounded-2xl border border-line bg-paper2 p-6"
            >
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] ${
                    c.amber
                      ? "border border-priorityline bg-prioritydim text-priority"
                      : "border border-leafdimline/60 bg-leafdim/50 text-leaf"
                  }`}
                >
                  <c.Icon size={17} strokeWidth={1.8} />
                </span>
                <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-faint">
                  {c.tag}
                </span>
              </div>

              <p className="mt-5 text-[17px] font-bold leading-snug text-ink">
                {c.situation}
              </p>

              <div className="mt-auto flex items-start gap-2.5 pt-5">
                <ArrowRight size={17} strokeWidth={2.2} className="mt-[3px] shrink-0 text-leaf" />
                <p className="text-[16px] font-semibold leading-snug text-leaf">
                  {c.result}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
