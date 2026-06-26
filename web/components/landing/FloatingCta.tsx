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
          className="group fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-[10px] bg-leafbtn px-4 py-3 text-[13px] font-bold text-white transition-all duration-200 hover:bg-leafbtnhover hover:-translate-y-px"
          style={{ boxShadow: "0 8px 30px -8px rgba(21,128,61,0.5)" }}
        >
          <span>Demo anfragen</span>
          <ArrowUpRight
            size={16}
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
