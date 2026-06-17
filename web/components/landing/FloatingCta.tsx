"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export function FloatingCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="#cta"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="group fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#0369A1] py-1.5 pl-5 pr-1.5 text-sm font-bold text-white shadow-[0_8px_30px_rgba(3, 105, 161,0.35)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[0.98] hover:bg-[#075985]"
        >
          <span>Demo buchen</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/30 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5">
            <ArrowUpRight size={16} />
          </div>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
