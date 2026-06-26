"use client";

import { motion, useReducedMotion } from "framer-motion";

// Sanfter Übergang zwischen zwei Story-Sektionen:
// eine dünne, glühende Verbindungslinie mit Knotenpunkt + weicher grüner Glow,
// der die Grenze überstrahlt — keine harte schwarze Leerfläche, ein durchgehender Fluss.
export function StorySeam() {
  const reduce = useReducedMotion();

  return (
    <div className="relative z-10 -my-5 flex justify-center" aria-hidden>
      {/* weicher Glow, mittig auf der Naht — grün blutet über die Grenze */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-44 w-[560px] max-w-[92vw] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(34,197,94,0.06), transparent 70%)",
        }}
      />
      <div className="relative flex flex-col items-center">
        <span className="h-16 w-px bg-gradient-to-b from-transparent via-white/10 to-leafbright/45" />
        <motion.span
          className="my-[3px] h-[7px] w-[7px] rounded-full bg-leafbright shadow-[0_0_14px_3px_rgba(74,222,128,0.3)]"
          animate={reduce ? undefined : { opacity: [0.55, 1, 0.55] }}
          transition={
            reduce ? undefined : { duration: 3.4, repeat: Infinity, ease: "easeInOut" }
          }
        />
        <span className="h-16 w-px bg-gradient-to-b from-leafbright/45 via-white/10 to-transparent" />
      </div>
    </div>
  );
}
