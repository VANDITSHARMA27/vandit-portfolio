"use client";

import { MotionConfig } from "motion/react";

/** Honors the user's reduced-motion preference for all JS-driven motion. */
export function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
