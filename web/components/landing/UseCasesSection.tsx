"use client";

import { motion } from "framer-motion";
import { Siren, Car, Trash2, X, Check } from "lucide-react";

const CASES = [
  {
    Icon: Siren,
    tag: "SHK / Kälte / Notdienst",
    scenario: "Heizungsausfall um 22:13 Uhr.",
    before: "Anruf geht auf die Mailbox, Kunde ist frustriert.",
    after: "Das Telefon-Modul nimmt ab, erkennt den Notfall, fragt die Adresse ab und meldet sofort an die Bereitschaft — z. B. per SMS, Telegram oder E-Mail.",
    amber: true,
  },
  {
    Icon: Car,
    tag: "Kfz / Gutachter / Werkstatt",
    scenario: "Kunde schickt 7 Fotos eines Unfallschadens per WhatsApp.",
    before: "Bilder ohne Kontext. Das Büro muss nachfragen, um welches Auto es geht.",
    after: "Das WhatsApp-Modul bedankt sich für die Bilder, fragt automatisch nach dem Fahrzeugschein und einer kurzen Beschreibung und übergibt einen fertigen Fall.",
    amber: false,
  },
  {
    Icon: Trash2,
    tag: "Entrümpelung / Reinigung",
    scenario: "Anfrage für eine Wohnungsauflösung über das Kontaktformular.",
    before: "Es fehlen Angaben zu Stockwerk, Aufzug und Volumen für ein Angebot.",
    after: "Das Modul sendet automatisch einen Link, über den der Kunde die fehlenden Eckdaten per Chat ergänzt. Das Team erhält die fertige Angebotsgrundlage.",
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
              {/* Header */}
              <div className="mb-5 flex items-start gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] ${
                    c.amber
                      ? "border border-amber-400/30 bg-amber-400/10 text-amber-400"
                      : "border border-leafdimline/60 bg-leafdim/50 text-leafbright"
                  }`}
                >
                  <c.Icon size={16} strokeWidth={1.8} />
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

              {/* Before / After */}
              <div className="mt-auto space-y-3">
                <div className="rounded-xl border border-white/[0.06] bg-paperdeep p-3.5">
                  <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-faint">
                    <X size={10} strokeWidth={2.5} className="text-red-400/70" />
                    Vorher
                  </div>
                  <p className="text-[13px] leading-[1.55] text-inksoft">{c.before}</p>
                </div>
                <div className="rounded-xl border border-leafdimline/40 bg-leaf/[0.06] p-3.5">
                  <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-leafbright">
                    <Check size={10} strokeWidth={2.5} />
                    Mit BaseModul
                  </div>
                  <p className="text-[13px] leading-[1.55] text-inksoft">{c.after}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
