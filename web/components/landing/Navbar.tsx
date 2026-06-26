"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Module", href: "#modules" },
  { label: "Ablauf", href: "#workflow" },
  { label: "Demo", href: "#livedemo" },
  { label: "Integrationen", href: "#integrationen" },
  { label: "Pilot", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>("");

  // Ein gemeinsamer rAF-gedrosselter Scroll-Handler für beides:
  // (1) Navbar-Hintergrund/Border ab erstem Scroll, (2) Scroll-Spy für den aktiven Link.
  // Re-Query pro Frame ist robust gegenüber der lazy geladenen Demo-Sektion.
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
        const line = window.innerHeight * 0.35;
        let current = ids[0];
        for (const id of ids) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= line) current = id;
        }
        setActiveId(current);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 h-[60px] border-b transition-colors duration-300 ${
          scrolled
            ? "border-linesoft bg-paper/85 backdrop-blur-[12px]"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[60px] max-w-[1400px] items-center justify-between px-6 lg:px-12">
          {/* Logo */}
          <Link href="/" className="flex items-baseline">
            <span className="text-[16px] font-bold tracking-[0.08em] text-ink">
              BASEMODUL
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-[30px] lg:flex">
            {NAV_LINKS.map((link) => {
              const active = activeId === link.href.slice(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "true" : undefined}
                  className={`relative text-[14px] font-medium transition-colors ${
                    active ? "text-ink" : "text-label hover:text-ink"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute -bottom-1 left-0 right-0 mx-auto h-0.5 w-4 rounded-full bg-leafbright" />
                  )}
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-3.5">
            <a
              href="#cta"
              className="hidden rounded-md bg-leafbtn px-[18px] py-2 text-[14px] font-semibold text-white transition-colors hover:bg-leafbtnhover sm:inline-flex"
            >
              Demo anfragen
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-md text-ink transition-colors hover:bg-white/[0.04] lg:hidden"
              aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex flex-col bg-paper px-8 pt-[84px] lg:hidden"
          >
            <div className="flex flex-col">
              {NAV_LINKS.map((link, i) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-baseline gap-3.5 border-b border-linesoft py-4"
                >
                  <span className="font-mono text-[13px] font-semibold text-leaf">0{i + 1}</span>
                  <span className="text-2xl font-bold text-ink">{link.label}</span>
                </a>
              ))}
              <a
                href="#cta"
                onClick={() => setMobileOpen(false)}
                className="mt-7 flex w-full items-center justify-center rounded-lg bg-leafbtn py-4 text-lg font-bold text-white"
              >
                Demo anfragen
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
