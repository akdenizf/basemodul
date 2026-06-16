"use client";

import { motion, Variants } from "framer-motion";
import { Mail } from "lucide-react";
import Image from "next/image";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 24 } },
};

export function FinalCtaSection() {
  return (
    <motion.section
      id="cta"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="relative overflow-hidden py-24 lg:py-32"
    >
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Linke Seite: CTA Text */}
          <div className="text-left">
            <motion.h2
              variants={item}
              className="text-balance text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
            >
              Bereit für 24/7 Erreichbarkeit?
            </motion.h2>

            <motion.p
              variants={item}
              className="mt-6 text-lg text-slate-600"
            >
              Lassen Sie uns persönlich darüber sprechen, wie AGENTEQ Ihren Arbeitsalltag entlastet.
            </motion.p>

            <motion.div variants={item} className="mt-10">
              <a
                href="https://calendly.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-xl bg-slate-900 px-10 py-4 text-base font-bold text-white shadow-sm transition-all hover:bg-slate-800 focus:ring-slate-500"
              >
                Kostenlose Demo buchen
              </a>
            </motion.div>
          </div>

          {/* Rechte Seite: Founder Card */}
          <motion.div variants={item} className="flex justify-center lg:justify-end xl:pl-10">
            <div className="bg-white rounded-3xl p-10 shadow-[0_12px_40px_rgb(0,0,0,0.06)] border border-slate-200 w-full max-w-lg">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-slate-100 overflow-hidden flex-shrink-0 mb-6 ring-4 ring-slate-50 shadow-sm">
                  <Image
                    src="/profile.png"
                    alt="Fatih Akdeniz - CEO AGENTEQ"
                    width={160}
                    height={160}
                    priority
                    className="w-full h-full object-cover object-[center_15%]"
                  />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-2xl">Fatih Akdeniz</h3>
                  <p className="text-emerald-600 text-lg font-medium mt-1">CEO & Gründer, AGENTEQ</p>
                </div>
              </div>

              <p className="text-slate-600 text-xl font-medium italic mt-8 text-center leading-relaxed">
                &quot;Ich zeige Ihnen in 30 Minuten, wie unsere KI Ihre Telefonzentrale auf Enterprise-Niveau skaliert und manuelle Prozesse nachhaltig automatisiert.&quot;
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
