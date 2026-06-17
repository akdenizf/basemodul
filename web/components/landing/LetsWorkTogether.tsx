"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, Calendar } from "lucide-react";

const CAL_LINK = "https://app.cal.eu/agenteq/30min?user=agenteq&overlayCalendar=true";

export function LetsWorkTogether() {
  const [hovered, setHovered] = useState(false);

  return (
    <section id="cta" className="relative overflow-hidden bg-white py-32 lg:py-40">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Double Bezel Container */}
        <div className="relative rounded-[3rem] border border-slate-100 bg-slate-50 p-3 shadow-sm sm:p-4">
          <div className="relative overflow-hidden rounded-[calc(3rem-1rem)] border border-slate-200/50 bg-[#F8FAFC] px-6 py-20 shadow-[inset_0_1px_1px_rgba(255,255,255,1)] sm:px-12 sm:py-24 lg:px-20">
            
            {/* Background Glow inside the card */}
            <div className="absolute right-0 top-0 h-[400px] w-[400px] -translate-y-1/2 translate-x-1/3 rounded-full bg-[#0369A1]/10 blur-[100px]" />
            <div className="absolute bottom-0 left-0 h-[300px] w-[300px] -translate-x-1/3 translate-y-1/3 rounded-full bg-blue-100/40 blur-[80px]" />

            <div className="relative z-10 grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
              
              {/* Left: Copy + CTA */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                className="flex flex-col gap-10"
              >
                <div>
                  <div className="mb-6 inline-flex rounded-full border border-slate-200 bg-slate-100 px-4 py-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                      Persönliche Demo
                    </span>
                  </div>
                  <h2 className="font-display text-[46px] font-bold leading-[1.05] tracking-[-0.03em] text-slate-900 sm:text-[56px] lg:text-[64px]">
                    Wollen wir Ihren
                    <br />
                    <span> Anfragefluss testen?</span>
                  </h2>
                </div>

                <blockquote className="border-l-4 border-[#0369A1] pl-6">
                  <p className="text-[18px] font-medium italic leading-[1.6] text-slate-600 md:text-[20px]">
                    &bdquo;Wir schauen uns kurz an, wo bei Ihnen Anfragen verloren gehen - und ob ein schlanker Pilot mit AGENTEQ Sinn ergibt.&ldquo;
                  </p>
                </blockquote>

                <div className="flex flex-col gap-5">
                  <button
                    onClick={() => window.open(CAL_LINK, "_blank")}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    className="group relative inline-flex w-fit items-center gap-2 rounded-full bg-[#0369A1] py-2 pl-8 pr-2 text-[16px] font-bold text-white shadow-[0_8px_30px_rgba(3, 105, 161,0.25)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[0.98] hover:shadow-[0_12px_40px_rgba(3, 105, 161,0.35)]"
                  >
                    <span>Termin buchen</span>
                    <div className="ml-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/30 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 group-hover:translate-x-1">
                      <Calendar size={18} className="absolute transition-opacity group-hover:opacity-0" />
                      <ArrowUpRight size={18} className="absolute opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  </button>
                  <p className="text-[13px] font-bold text-slate-400">
                    30 Min. Erstgespräch · Kein Setup-Zwang
                  </p>
                </div>
              </motion.div>

              {/* Right: Profile */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: 0.2 }}
                className="relative mx-auto w-full max-w-[380px] lg:max-w-none"
              >
                {/* Photo frame */}
                <div
                  className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.08)]"
                >
                  <div className="relative aspect-[4/5]">
                    <Image
                      src="/profile.png"
                      alt="Fatih Akdeniz – CEO AGENTEQ"
                      fill
                      className="object-cover object-[center_10%]"
                      sizes="(max-width: 1024px) 380px, 448px"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-900/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <p className="font-display text-2xl font-bold text-white">Fatih Akdeniz</p>
                      <p className="mt-1 text-sm font-medium text-[#0369A1]">CEO & Gründer, AGENTEQ</p>
                    </div>
                  </div>
                </div>

                {/* Floating Trust Card */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -left-10 top-12 hidden rounded-[1.25rem] border border-slate-100 bg-white p-1.5 shadow-[0_20px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl md:block"
                  style={{ transform: "rotate(-2deg)" }}
                >
                  <div className="flex items-center gap-3 rounded-[1rem] border border-slate-100 bg-slate-50 px-5 py-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0369A1]/15 text-[#0369A1]">
                      <span className="material-symbols-outlined text-[20px]">bolt</span>
                    </span>
                    <div>
                      <p className="text-[13px] font-bold text-slate-900">Einsatzbereit</p>
                      <p className="text-[11px] font-medium text-slate-500">in 48 Stunden</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
