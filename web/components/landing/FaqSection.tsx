"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { homepageFaqs } from "@/app/homepage-seo";

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 24 } },
};

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="relative bg-paper py-20">
      <div className="relative mx-auto max-w-[1200px] px-6 lg:px-12">
        <div className="mb-12 text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">FAQ</span>
          <h2 className="mt-3.5 text-[clamp(32px,4vw,52px)] font-bold leading-[1.08] tracking-[-0.025em] text-ink">
            Was Betriebe vor dem Start wissen wollen.
          </h2>
        </div>

        <div className="mx-auto grid max-w-[980px] grid-cols-1 gap-4 md:grid-cols-2">
          {homepageFaqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                variants={item}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                className="glass-surface h-fit overflow-hidden rounded-lg"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`homepage-faq-answer-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left text-[16px] font-semibold text-ink"
                >
                  {faq.question}
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-leafbright transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  id={`homepage-faq-answer-${i}`}
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-[14.5px] leading-[1.6] text-inksoft">{faq.answer}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
