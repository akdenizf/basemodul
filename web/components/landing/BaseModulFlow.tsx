"use client";

import { motion } from "framer-motion";
import { Check, MessageSquare, Paperclip, PhoneIncoming, Users } from "lucide-react";

type BaseModulFlowProps = {
  size?: "full" | "compact";
  orientation?: "horizontal" | "vertical";
  animated?: boolean;
  /** Reserved for future hover/scroll-driven "snap-in" staging (Modules section). Not wired up yet. */
  activeStep?: number;
  className?: string;
};

const INPUTS = [
  { Icon: PhoneIncoming, label: "Telefon" },
  { Icon: MessageSquare, label: "WhatsApp" },
  { Icon: Paperclip, label: "Foto" },
];

const CHECKLIST = ["Kontakt", "Standort", "Anliegen", "Priorität"];

export function BaseModulFlow({
  size = "full",
  orientation = "horizontal",
  animated = true,
  className = "",
}: BaseModulFlowProps) {
  const compact = size === "compact";
  const vertical = orientation === "vertical";

  const dash = animated
    ? {
        strokeDasharray: "4 5",
        animate: { strokeDashoffset: [0, -18] },
        transition: { duration: 1.4, ease: "linear" as const, repeat: Infinity },
      }
    : { strokeDasharray: "4 5" };

  return (
    <div
      className={`flex items-center ${vertical ? "flex-col gap-3" : "flex-row gap-2"} ${className}`}
      aria-hidden="true"
    >
      {/* Inputs */}
      <div className={`flex ${vertical ? "flex-row gap-3" : "flex-col gap-3"}`}>
        {INPUTS.map(({ Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-1.5">
            <span
              className={`flex items-center justify-center rounded-[7px] border border-line bg-paper2 text-ink ${
                compact ? "h-9 w-9" : "h-12 w-12"
              }`}
            >
              <Icon size={compact ? 17 : 22} strokeWidth={1.8} />
            </span>
            {!compact && (
              <span className="text-[12px] font-semibold text-ink">{label}</span>
            )}
          </div>
        ))}
      </div>

      {/* Connector: inputs → hub */}
      <svg
        className={vertical ? "h-8 w-14 rotate-90" : "h-16 w-10 shrink-0"}
        viewBox="0 0 40 64"
        fill="none"
      >
        <motion.path
          d="M2 8 C 22 8, 18 32, 38 32"
          stroke="#4CA66B"
          strokeWidth="1.6"
          strokeLinecap="round"
          {...dash}
        />
        <motion.path
          d="M2 32 L 38 32"
          stroke="#4CA66B"
          strokeWidth="1.6"
          strokeLinecap="round"
          {...dash}
        />
        <motion.path
          d="M2 56 C 22 56, 18 32, 38 32"
          stroke="#4CA66B"
          strokeWidth="1.6"
          strokeLinecap="round"
          {...dash}
        />
      </svg>

      {/* Hub */}
      <div className="flex flex-col items-center gap-2">
        <div
          className={`flex flex-col items-center justify-center rounded-[8px] bg-forestdeep text-white shadow-[0_10px_24px_-14px_rgba(22,56,43,0.6)] ${
            compact ? "h-14 w-16 px-2" : "h-[84px] w-[104px] px-3"
          }`}
        >
          <span className={`font-bold leading-tight ${compact ? "text-[11px]" : "text-[15px]"}`}>Base</span>
          <span className={`font-bold leading-tight ${compact ? "text-[11px]" : "text-[15px]"}`}>Modul</span>
        </div>
        {!compact && (
          <div className="flex flex-col gap-1">
            {CHECKLIST.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-leaf"
              >
                <Check size={13} strokeWidth={2.8} />
                {item}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Connector: hub → team */}
      <svg className={vertical ? "h-8 w-10 rotate-90" : "h-8 w-10 shrink-0"} viewBox="0 0 40 32" fill="none">
        <motion.path d="M2 16 L 38 16" stroke="#2E6246" strokeWidth="1.6" strokeLinecap="round" {...dash} />
      </svg>

      {/* Output */}
      <div className="flex flex-col items-center gap-1.5">
        <span
          className={`flex items-center justify-center rounded-[7px] border border-leafdimline bg-leafdim text-leaf ${
            compact ? "h-9 w-9" : "h-12 w-12"
          }`}
        >
          <Users size={compact ? 17 : 22} strokeWidth={1.8} />
        </span>
        {!compact && <span className="text-[12px] font-semibold text-ink">Team</span>}
      </div>
    </div>
  );
}
