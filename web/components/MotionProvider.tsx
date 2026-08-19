"use client";

import { MotionConfig } from "framer-motion";

// framer-motion ignoriert prefers-reduced-motion standardmäßig ("never").
// children bleiben Server-Komponenten, da sie als Prop durchgereicht werden.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
