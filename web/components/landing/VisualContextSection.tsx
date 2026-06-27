"use client";

import { motion, Variants } from "framer-motion";
import { FileText, ArrowRight, CheckCircle2 } from "lucide-react";
import { AmbientOrbs, FlowGrid } from "./AmbientOrbs";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.14 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 24 } },
};

const BULLETS = [
  "Upload-Link per SMS oder Chat nach dem Anruf versandt",
  "Foto, Kontakt und Kontext zusammengeführt",
  "Strukturierte Übergabe für die Bearbeitung",
];

export function VisualContextSection() {
  return (
    <motion.section
      id="features"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="relative bg-paper pb-12 pt-10 lg:pb-14 lg:pt-12"
    >
      {/* sanfter Tiefen-Verlauf statt harter paperdeep-Block */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 45%, transparent 100%)",
        }}
      />
      <FlowGrid />
      <AmbientOrbs />
      <div className="relative mx-auto max-w-[1200px] px-6 lg:px-12">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">

          {/* Left: copy */}
          <div className="flex flex-col gap-8">
            <motion.div variants={item}>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
                06 — Foto & Datei
              </p>
              <h2 className="text-[38px] font-bold leading-[1.08] tracking-[-0.025em] text-ink sm:text-[46px]">
                Wenn nach dem Anruf ein Foto fehlt,{" "}
                <span className="text-inksoft">fragt das Modul nach.</span>
              </h2>
            </motion.div>

            <motion.p variants={item} className="max-w-md text-[16px] leading-[1.7] text-inksoft">
              Oft fehlt nach dem Anruf noch ein Bild oder Dokument. Das Modul
              sendet einen Upload-Link, verbindet Foto, Kontakt und Kontext und
              legt alles als klare Übergabe für das Team bereit.
            </motion.p>

            <motion.ul variants={item} className="flex flex-col gap-4">
              {BULLETS.map((text) => (
                <li key={text} className="flex items-center gap-3.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border border-[rgba(22,163,74,0.35)] bg-[rgba(22,163,74,0.08)]">
                    <CheckCircle2 size={15} className="text-leaf" strokeWidth={2} />
                  </span>
                  <span className="text-[15px] font-medium text-inksoft">{text}</span>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Right: Übergabekarte */}
          <motion.div variants={item} className="relative">
            <div className="glass-surface overflow-hidden rounded-[16px]">

              {/* Card header */}
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-leaf">
                    <FileText size={14} className="text-white" strokeWidth={2} />
                  </span>
                  <div className="leading-tight">
                    <p className="text-[13px] font-bold text-ink">Übergabekarte</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
                      Foto & Datei
                    </p>
                  </div>
                </div>
                <span className="rounded-[7px] border border-[rgba(22,163,74,0.35)] bg-[rgba(22,163,74,0.08)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-leaf">
                  Bereit zur Übergabe
                </span>
              </div>

              {/* Dashed separator */}
              <div className="border-b border-dashed border-line" />

              <div className="grid sm:grid-cols-2">
                {/* Left col — details */}
                <div className="border-b border-line p-5 sm:border-b-0 sm:border-r">
                  <h4 className="mb-1 text-[14px] font-bold text-ink">Anfrage mit Anhang</h4>
                  <p className="mb-4 text-[12px] text-inksoft">
                    Thomas M. · Rückruf gewünscht · heute 14:30
                  </p>

                  <div className="rounded-[8px] border-l-2 border-leaf/40 bg-paper pl-3 pr-2 py-3">
                    <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
                      Notiz vom Modul
                    </p>
                    <p className="text-[12px] leading-relaxed text-inksoft">
                      Kunde sendet einen Anhang mit kurzer Nachricht. Modul fragt
                      fehlende Angaben ab und bündelt alles für die Bearbeitung.
                    </p>
                  </div>

                  <div className="mt-4 flex flex-col gap-2.5">
                    {[
                      { label: "Typ", value: "Rückfrage", tone: "neutral" },
                      // Amber bleibt dem Dringend-Fall vorbehalten; "Normal" ruhig in Grün.
                      { label: "Priorität", value: "Normal", tone: "ok" },
                    ].map((tag) => (
                      <div
                        key={tag.label}
                        className="flex items-center justify-between border-t border-dashed border-line pt-2.5 first:border-t-0 first:pt-0"
                      >
                        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-faint">
                          {tag.label}
                        </span>
                        <span
                          className={`text-[12px] font-bold ${
                            tag.tone === "urgent"
                              ? "text-amber-400"
                              : tag.tone === "ok"
                              ? "text-leaf"
                              : "text-ink"
                          }`}
                        >
                          {tag.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right col — attachment */}
                <div className="flex flex-col p-5">
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
                    Anhang · vom Kunden
                  </p>
                  <div className="relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-[10px] border border-line bg-paper p-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-line bg-paperdeep text-leaf">
                        <FileText size={17} strokeWidth={2} />
                      </span>
                      <div>
                        <p className="text-[12px] font-bold text-ink">Anhang_Foto.jpg</p>
                        <p className="mt-0.5 text-[10px] text-faint">vom Kunden hochgeladen</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="h-14 rounded bg-surface2" />
                      <span className="h-14 rounded bg-surface2" />
                      <span className="h-14 rounded bg-surface2" />
                    </div>
                    <span className="w-fit rounded bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white">
                      vor 2 Min.
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center gap-2.5 border-t border-line bg-paper px-5 py-3">
                <ArrowRight size={15} className="text-leaf" />
                <p className="text-[12px] font-medium text-inksoft">
                  Nächster Schritt:{" "}
                  <span className="font-bold text-ink">Rückrufnotiz ans Team</span>
                </p>
              </div>
            </div>

            {/* Floating badge — static, ruhig */}
            <div
              className="glass-surface absolute -bottom-5 -left-5 hidden items-center gap-3 rounded-[12px] px-4 py-2.5 lg:flex"
              style={{ boxShadow: "0 12px 30px -10px rgba(0,0,0,0.5)" }}
            >
              <CheckCircle2 size={18} className="text-leaf" strokeWidth={2} />
              <div>
                <p className="text-[12px] font-bold text-ink">Strukturiert</p>
                <p className="text-[10px] text-faint">statt halber Infos</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
