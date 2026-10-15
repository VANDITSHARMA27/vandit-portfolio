"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -120, rotate: rotate - 12 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{
        duration: 2.2,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.1 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{ y: [0, 14, 0] }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ width, height }}
        className="relative"
      >
        {/* Monochrome glass pill — shades of grey, no colour. */}
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-linear-to-r from-white/[0.07] to-transparent",
            "border border-white/[0.1] backdrop-blur-[2px]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.05)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.12),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

/**
 * Drifting, monochrome glass shapes. Used as a calm background layer behind
 * scene content (e.g. the Work deck). Pointer-transparent and aria-hidden.
 */
export function ElegantShapes({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <ElegantShape
        delay={0.3}
        width={600}
        height={140}
        rotate={12}
        className="left-[-10%] top-[14%] md:left-[-5%]"
      />
      <ElegantShape
        delay={0.5}
        width={480}
        height={120}
        rotate={-15}
        className="right-[-6%] top-[72%] md:right-[0%]"
      />
      <ElegantShape
        delay={0.4}
        width={300}
        height={80}
        rotate={-8}
        className="bottom-[6%] left-[4%] md:left-[10%]"
      />
      <ElegantShape
        delay={0.6}
        width={200}
        height={60}
        rotate={20}
        className="right-[16%] top-[8%] md:right-[20%]"
      />
    </div>
  );
}
