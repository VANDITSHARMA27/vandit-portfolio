"use client";

import { motion, type Variants } from "motion/react";
import { fadeUp, inViewOnce } from "@/lib/motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variants?: Variants;
};

/** Fade + rise once when scrolled into view. Reduced-motion safe via globals. */
export function Reveal({ children, className, delay = 0, variants = fadeUp }: RevealProps) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={inViewOnce}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </motion.div>
  );
}
