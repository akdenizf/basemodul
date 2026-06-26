"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import { AmbientOrbs } from "./AmbientOrbs";

type Stage = { kind: string; text: string; accent?: boolean };

type Flow = {
  tag: string;
  title: string;
  module: string;
  stages: Stage[];
};

const FLOWS: Flow[] = [
  {
    tag: "Inbound-Anruf · Notdienst",
    title: "Wasserschaden um 22:40 — niemand am Telefon.",
    module: "Telefon + Notdienst",
    stages: [
      { kind: "Eingang", text: "Anruf außerhalb der Bürozeit" },
      { kind: "Modul fragt", text: "Kontakt, Ort, kurze Beschreibung" },
      { kind: "Erkennt", text: "Dringlichkeit: hoch" },
      { kind: "Aktion", text: "Zuständige Person informiert", accent: true },
    ],
  },
  {
    tag: "Inbound-Anruf · Terminwunsch",
    title: "Terminwunsch am Telefon — Kalender noch offen.",
    module: "Telefon + Kalender",
    stages: [
      { kind: "Eingang", text: "Anrufer möchte einen Wartungstermin" },
      { kind: "Modul fragt", text: "Adresse, Anlage, Zeitfenster" },
      { kind: "Bündelt", text: "Terminwunsch und Kontaktdaten" },
      { kind: "Aktion", text: "Rückruf mit Terminvorschlag", accent: true },
    ],
  },
];

const fade: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 26 } },
};

export function WorkflowSection() {
  return (
    <section id="workflow" className="relative bg-paperdeep py-20">
      <AmbientOrbs />
      <div className="relative mx-auto max-w-[1200px] px-6 lg:px-12">
        <div className="mb-14 max-w-[640px]">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
            02 — Praxisbeispiele
          </span>
          <h2 className="mb-[18px] mt-4 text-[clamp(32px,4vw,52px)] font-bold leading-[1.08] tracking-[-0.025em] text-ink">
            Eingang rein. Modul fragt nach. Aktion raus.
          </h2>
          <p className="text-[16px] leading-[1.7] text-inksoft">
            Kein Anrufbeantworter, kein halbes Ticket. Zwei echte Abläufe aus dem
            Betriebsalltag — vom Eingang bis zur fertigen Übergabe.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {FLOWS.map((flow) => (
            <motion.div
              key={flow.tag}
              variants={fade}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="glass-surface rounded-xl p-6"
            >
              {/* Flow header */}
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
                    {flow.tag}
                  </span>
                  <h3 className="mt-1.5 text-[19px] font-bold leading-tight tracking-[-0.01em] text-ink">
                    {flow.title}
                  </h3>
                </div>
                <span className="shrink-0 self-start rounded-[7px] border border-line bg-paper px-3 py-1.5 text-[12px] text-inksoft">
                  {flow.module}
                </span>
              </div>

              {/* Steps */}
              <div className="flex flex-col items-stretch sm:flex-row">
                {flow.stages.map((s, si) => (
                  <div key={s.kind} className="contents">
                    <div
                      className={`flex-1 rounded-[9px] border p-4 ${
                        s.accent
                          ? "border-leafbtn bg-leafdim"
                          : "border-linesoft bg-paper"
                      }`}
                    >
                      <div
                        className={`text-[10px] font-semibold uppercase tracking-[0.08em] ${
                          s.accent ? "text-leafbright" : "text-faint"
                        }`}
                      >
                        {s.kind}
                      </div>
                      <p
                        className={`mt-2 text-[14px] font-medium leading-[1.45] ${
                          s.accent ? "font-semibold text-leafbright" : "text-ink"
                        }`}
                      >
                        {s.text}
                      </p>
                    </div>

                    {si < flow.stages.length - 1 && (
                      <div className="flex items-center justify-center px-3 text-faint">
                        <ArrowDown size={20} className="sm:hidden" />
                        <ArrowRight size={20} className="hidden sm:block" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
