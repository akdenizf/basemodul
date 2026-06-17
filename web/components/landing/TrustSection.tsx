"use client";

import { motion } from "framer-motion";

const BADGES = [
  { icon: "verified_user", label: "DSGVO-konform" },
  { icon: "dns", label: "Server in Frankfurt" },
  { icon: "flag", label: "Made in Germany" },
  { icon: "bolt", label: "Ø 241ms Antwortzeit" },
  { icon: "lock", label: "Ende-zu-Ende verschlüsselt" },
  { icon: "support_agent", label: "24/7 Erreichbarkeit" },
];

export function TrustSection() {
  return (
    <section className="relative overflow-hidden border-y border-slate-200/80 bg-white py-5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {BADGES.map((b, i) => (
            <motion.div
              key={b.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px] text-[#0369A1]">{b.icon}</span>
              <span className="text-[13px] font-medium text-slate-500">{b.label}</span>
              {i < BADGES.length - 1 && (
                <span className="ml-10 hidden h-3.5 w-px bg-slate-200 sm:block" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
