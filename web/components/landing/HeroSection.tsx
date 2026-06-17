"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { PhoneCall, ArrowUpRight, Play } from "lucide-react";

const STEPS = [
  { icon: "call", label: "Anruf annehmen", detail: "München · Schwabing" },
  { icon: "psychology", label: "Dringlichkeit erkannt", detail: "Priorität: HOCH" },
  { icon: "sms", label: "Rückfrage gestellt", detail: "Objekt & Foto vom Kunden" },
  { icon: "assignment_turned_in", label: "Anfrage übergeben", detail: "#AQ-8421 · SANITÄR" },
];

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] } },
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 40, filter: "blur(8px)" },
  show: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1], delay: 0.25 } },
};

export function HeroSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setActiveStep((p) => (p + 1) % STEPS.length);
    }, 2200);
    const elapsedTimer = setInterval(() => {
      setElapsed((p) => p + 1);
    }, 1000);
    return () => {
      clearInterval(stepTimer);
      clearInterval(elapsedTimer);
    };
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <section className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden bg-[#F8FAFC] px-4 pb-24 pt-32 lg:px-8">
      {/* Soft Ambient Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[20%] top-[20%] h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0369A1]/15 blur-[120px]" />
        <div className="absolute right-[10%] top-[40%] h-[500px] w-[500px] rounded-full bg-blue-100/40 blur-[120px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl">
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 xl:gap-24">

          {/* ── LEFT: Editorial copy ────────────────────────────── */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-10"
          >
            {/* Live badge */}
            <motion.div variants={fadeUp}>
              <div className="inline-flex items-center gap-3 rounded-full border border-slate-200/60 bg-white/60 px-4 py-2 shadow-sm backdrop-blur-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0369A1] opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#0369A1]" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-600">
                  Live · Anfrage-Assistent
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="font-display text-[48px] font-bold leading-[1.05] tracking-[-0.02em] text-[#0F172A] sm:text-[72px] lg:text-[84px] xl:text-[96px]"
            >
              Kein Anruf geht
              <br />
              <span className="text-[#0369A1]"> mehr verloren.</span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              variants={fadeUp}
              className="max-w-[520px] text-[18px] font-medium leading-[1.7] text-slate-500"
            >
              AGENTEQ nimmt Anrufe und Nachrichten entgegen, fragt fehlende
              Infos ab, erkennt Dringlichkeit und legt alles sauber für
              Rückruf, Termin oder Angebot bereit.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} className="mt-4 flex flex-wrap items-center gap-6">
              <a
                href="#cta"
                className="group relative inline-flex items-center gap-2 rounded-full bg-[#0369A1] py-2 pl-8 pr-2 text-[15px] font-bold text-[#FFFFFF] shadow-[0_8px_30px_rgba(3, 105, 161,0.25)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[0.98] hover:shadow-[0_12px_40px_rgba(3, 105, 161,0.35)]"
              >
                <span>Pilotplatz anfragen</span>
                <div className="ml-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/30 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 group-hover:translate-x-1">
                  <ArrowUpRight size={18} />
                </div>
              </a>

              <a
                href="#livedemo"
                className="group relative inline-flex items-center gap-2 rounded-full bg-[#0F172A] py-2 pl-8 pr-2 text-[15px] font-bold text-white shadow-[0_8px_30px_rgba(15,23,20,0.2)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[0.98] hover:shadow-[0_12px_40px_rgba(15,23,20,0.3)]"
              >
                <span>Demo ansehen</span>
                <div className="ml-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 group-hover:translate-x-1">
                  <Play size={16} />
                </div>
              </a>
            </motion.div>

            {/* Stats strip */}
            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-wrap items-center gap-10 border-t border-slate-200 pt-10"
            >
              {[
                { value: "24/7", label: "Erreichbar" },
                { value: "<1s", label: "Latenz" },
                { value: "100%", label: "DSGVO" },
              ].map((stat) => (
                <div key={stat.value} className="flex flex-col gap-1">
                  <p className="font-display text-3xl font-bold tracking-tight text-[#0F172A]">
                    {stat.value}
                  </p>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Live call simulation (Double Bezel) ─────────── */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            animate="show"
            className="relative mx-auto w-full max-w-[420px] lg:max-w-none"
          >
            {/* Double Bezel Architecture */}
            <div className="relative rounded-[2.5rem] border border-slate-200/60 bg-slate-100/50 p-2 shadow-[0_0_0_1px_rgba(0,0,0,0.02)] backdrop-blur-xl sm:p-3">
              <div className="relative overflow-hidden rounded-[calc(2.5rem-0.75rem)] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1)]">
                
                {/* Header */}
                <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#0369A1]/20 bg-[#0369A1]/10 shadow-sm">
                        <PhoneCall size={18} className="text-[#0369A1]" />
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-slate-900">Eingehender Anruf</p>
                        <p className="text-[12px] font-medium text-slate-500">München · Schwabing</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[13px] font-bold text-slate-700">{formatTime(elapsed)}</p>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0369A1]">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#0369A1]"></span>
                        Aktiv
                      </span>
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div className="flex flex-col gap-1 bg-white p-4 sm:p-6">
                  {STEPS.map((step, i) => {
                    const isActive = i === activeStep;
                    const isDone = i < activeStep;
                    return (
                      <motion.div
                        key={step.label}
                        animate={{
                          opacity: isDone || isActive ? 1 : 0.4,
                          scale: isActive ? 1.02 : 1,
                          backgroundColor: isActive ? "rgba(248, 250, 252, 1)" : "rgba(255, 255, 255, 0)",
                        }}
                        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                        className={`flex items-center gap-4 rounded-2xl p-4 transition-all ${
                          isActive ? "border border-slate-100 shadow-sm" : "border border-transparent"
                        }`}
                      >
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] transition-all duration-500 ${
                            isActive
                              ? "bg-[#0369A1] text-white shadow-[0_8px_20px_rgba(3, 105, 161,0.3)]"
                              : isDone
                              ? "bg-slate-100 text-[#0369A1]"
                              : "border border-slate-100 bg-slate-50 text-slate-400"
                          }`}
                        >
                          {isDone ? (
                            <span className="material-symbols-outlined text-[18px]">check</span>
                          ) : (
                            <span className="material-symbols-outlined text-[18px]">
                              {step.icon}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-[14px] font-bold ${isActive ? "text-slate-900" : isDone ? "text-slate-700" : "text-slate-400"}`}>
                            {step.label}
                          </p>
                          <p className={`truncate text-[12px] font-medium ${isActive ? "text-slate-500" : "text-slate-400"}`}>
                            {step.detail}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-4">
                  <span className="font-mono text-[11px] font-medium text-slate-400">agenteq.de/engine</span>
                  <span className="rounded-full border border-[#0369A1]/20 bg-[#0369A1]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#0369A1]">
                    In Bearbeitung
                  </span>
                </div>
              </div>
            </div>
            
            {/* Floating Trust Badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-8 bottom-12 z-20 hidden rounded-[1.25rem] border border-white bg-white/80 p-1.5 shadow-[0_20px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl lg:block"
            >
              <div className="flex items-center gap-3 rounded-[1rem] border border-slate-100 bg-white px-5 py-3 shadow-sm">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0369A1]/15 text-[#0369A1]">
                  <span className="material-symbols-outlined text-[16px]">verified_user</span>
                </span>
                <div>
                  <p className="text-[12px] font-bold text-slate-900">100% DSGVO</p>
                  <p className="text-[10px] font-medium text-slate-500">Frankfurt a.M.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
