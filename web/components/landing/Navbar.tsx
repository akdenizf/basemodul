"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";

const NAV_LINKS = [
  { label: "Live-Demo", href: "#livedemo" },
  { label: "Branchen", href: "#branchen" },
  { label: "So funktioniert's", href: "#how-it-works" },
  { label: "Integrationen", href: "#integrationen" },
  { label: "Preise", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 20);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          scrolled ? "py-3" : "py-6"
        }`}
      >
        <div 
          className={`mx-auto flex max-w-7xl items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            scrolled 
              ? "rounded-full border border-slate-200/60 bg-white/80 px-6 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-2xl" 
              : "px-6 lg:px-8"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <span
              className="font-display text-xl font-bold tracking-tight text-[#0369A1]"
            >
              AGENTEQ
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-10 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[14px] font-bold text-slate-500 transition-colors duration-300 hover:text-slate-900"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <a
              href="#cta"
              className="group hidden sm:flex items-center gap-2 rounded-full bg-[#0369A1] pl-5 pr-1.5 py-1.5 text-[14px] font-bold text-white shadow-sm transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[0.98] hover:bg-[#075985]"
            >
              <span>Pilotplatz anfragen</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/30 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5">
                <ArrowUpRight size={16} />
              </div>
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-slate-900"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Modal Expansion */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-white/95 px-6 backdrop-blur-3xl lg:hidden"
          >
            <div className="flex flex-col gap-6">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.32, 0.72, 0, 1] }}
                  onClick={() => setMobileOpen(false)}
                  className="font-display text-4xl font-bold tracking-tight text-slate-900"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.5, delay: NAV_LINKS.length * 0.1, ease: [0.32, 0.72, 0, 1] }}
                className="mt-8 border-t border-slate-200 pt-8"
              >
                <a
                  href="#cta"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0369A1] py-4 text-lg font-bold text-white"
                >
                  Pilotplatz anfragen
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
