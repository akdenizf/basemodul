"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

// ============================================================================
// Types
// ============================================================================
export type VisualizerState = "idle" | "listening" | "speaking" | "thinking";

interface BarVisualizerProps {
  state: VisualizerState;
  barCount?: number;
  className?: string;
}

// ============================================================================
// Bar animation config per state
// ============================================================================
const STATE_CONFIG: Record<
  VisualizerState,
  { minH: number; maxH: number; speed: number; stagger: number }
> = {
  idle:      { minH: 4,  maxH: 8,   speed: 2.5, stagger: 0 },
  thinking:  { minH: 8,  maxH: 30,  speed: 1.8, stagger: 0.12 },
  listening: { minH: 6,  maxH: 45,  speed: 0.9, stagger: 0.06 },
  speaking:  { minH: 20, maxH: 90,  speed: 0.45, stagger: 0.04 },
};

// Deterministic pseudo-random height spread so bars have a natural
// amplitude profile (tallest in the centre, shorter at the edges).
function getBellCurveWeight(index: number, total: number): number {
  const centre = (total - 1) / 2;
  const dist = Math.abs(index - centre) / centre; // 0 → centre, 1 → edge
  return 1 - dist * 0.6; // range: 0.4 (edge) → 1.0 (centre)
}

export function BarVisualizer({
  state,
  barCount = 28,
  className = "",
}: BarVisualizerProps) {
  const cfg = STATE_CONFIG[state];

  const bars = useMemo(
    () =>
      Array.from({ length: barCount }, (_, i) => ({
        id: i,
        weight: getBellCurveWeight(i, barCount),
        // Seed a natural phase offset so no two bars animate in lockstep
        phaseOffset: ((i * 137.508) % 100) / 100, // golden-angle spacing
      })),
    [barCount]
  );

  return (
    <div
      className={`flex items-end justify-center gap-[3px] ${className}`}
      aria-hidden="true"
    >
      {bars.map((bar) => {
        const minH = cfg.minH * bar.weight;
        const maxH = cfg.maxH * bar.weight;
        const delay = bar.phaseOffset * cfg.stagger * barCount;

        return (
          <motion.div
            key={bar.id}
            className="rounded-full"
            style={{
              width: "3px",
              backgroundColor: "#19E66F",
              minHeight: `${minH}%`,
            }}
            animate={{
              height: [
                `${minH}%`,
                `${maxH}%`,
                `${minH + (maxH - minH) * 0.4}%`,
                `${maxH * 0.75}%`,
                `${minH}%`,
              ],
              opacity: state === "idle" ? 0.3 : 1,
            }}
            transition={{
              duration: cfg.speed,
              repeat: Infinity,
              ease: "easeInOut",
              delay,
              repeatType: "loop",
            }}
          />
        );
      })}
    </div>
  );
}
