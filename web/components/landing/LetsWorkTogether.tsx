"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const CAL_LINK = "https://app.cal.eu/agenteq/30min?user=agenteq&overlayCalendar=true";

export function LetsWorkTogether() {
  return (
    <section id="cta" className="relative bg-paper py-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="glass-surface relative overflow-hidden rounded-2xl p-8 sm:p-16"
        >
          {/* Green glow — top right */}
          <div
            className="pointer-events-none absolute -right-[120px] -top-[160px] h-[500px] w-[500px]"
            style={{ background: "radial-gradient(circle, rgba(22,163,74,0.10), transparent 60%)" }}
          />

          {/* meta row */}
          <div className="relative z-10 mb-8 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">09 — Start</span>
            <span className="inline-flex w-fit items-center gap-[7px] rounded-full border border-leafdimline bg-leafdim px-3 py-[5px] text-[11px] font-semibold uppercase tracking-[0.06em] text-leafbright">
              <span className="h-1.5 w-1.5 rounded-full bg-leafbright" />
              ein Modul zuerst
            </span>
          </div>

          <div className="relative z-10 grid items-center gap-9 lg:grid-cols-[1.5fr_0.5fr] lg:gap-14">
            {/* Left — copy + CTA */}
            <div>
              <h2 className="text-[clamp(30px,3.5vw,46px)] font-bold leading-[1.1] tracking-[-0.025em] text-ink">
                Bereit für saubere Anfragen?
              </h2>
              <p className="mt-[18px] max-w-[520px] text-[16px] leading-[1.7] text-inksoft">
                Lassen Sie uns in 30 Minuten prüfen, welches Modul Ihrem Betrieb
                sofort Zeit spart. Kein Komplettsystem, kein Vertrag im
                Erstgespräch.
              </p>

              <button
                onClick={() => window.open(CAL_LINK, "_blank")}
                className="group mt-[30px] inline-flex items-center gap-2 rounded-lg bg-leafbtn px-7 py-3.5 text-[15px] font-bold text-white transition-all duration-200 hover:-translate-y-px hover:bg-leafbtnhover"
              >
                Termin vereinbaren
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </button>
            </div>

            {/* Right — host */}
            <div className="flex flex-col items-start gap-5 border-t border-linesoft pt-7 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl border border-[#3A3A3A] sm:h-36 sm:w-36">
                <Image
                  src="/profile.png"
                  alt="Fatih Akdeniz, AGENTEQ"
                  fill
                  className="object-cover object-[center_10%]"
                  sizes="(min-width: 640px) 144px, 128px"
                  loading="lazy"
                />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.08em] text-faint">Ihr Ansprechpartner</div>
                <div className="mt-1 text-[16px] font-bold text-ink">Fatih Akdeniz</div>
                <div className="mt-0.5 text-[13px] text-faint">AGENTEQ · basemodul.de</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
