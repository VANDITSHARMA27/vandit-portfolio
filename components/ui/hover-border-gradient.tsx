"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

const movingMap: Record<Direction, string> = {
  TOP: "radial-gradient(20.7% 50% at 50% 0%, hsl(0,0%,100%) 0%, rgba(255,255,255,0) 100%)",
  LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, hsl(0,0%,100%) 0%, rgba(255,255,255,0) 100%)",
  BOTTOM: "radial-gradient(20.7% 50% at 50% 100%, hsl(0,0%,100%) 0%, rgba(255,255,255,0) 100%)",
  RIGHT: "radial-gradient(16.2% 41.2% at 100% 50%, hsl(0,0%,100%) 0%, rgba(255,255,255,0) 100%)",
};

// Pure white highlight (no colour) for the hover state.
const highlight =
  "radial-gradient(75% 181% at 50% 50%, #ffffff 0%, rgba(255,255,255,0) 100%)";

/**
 * Wraps content with an animated, rotating gradient border that brightens to a
 * white highlight on hover. Monochrome; radius is controlled by the caller
 * (pass matching rounded-* on both containerClassName and className).
 */
export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Element = "button",
  duration = 1,
  clockwise = true,
  ...props
}: React.PropsWithChildren<
  {
    as?: React.ElementType;
    containerClassName?: string;
    className?: string;
    duration?: number;
    clockwise?: boolean;
  } & React.HTMLAttributes<HTMLElement>
>) {
  const [hovered, setHovered] = useState(false);
  const [direction, setDirection] = useState<Direction>("BOTTOM");

  const rotateDirection = (cur: Direction): Direction => {
    const dirs: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
    const i = dirs.indexOf(cur);
    const next = clockwise ? (i - 1 + dirs.length) % dirs.length : (i + 1) % dirs.length;
    return dirs[next];
  };

  useEffect(() => {
    if (!hovered) {
      const interval = setInterval(
        () => setDirection((p) => rotateDirection(p)),
        duration * 1000
      );
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hovered]);

  return (
    <Element
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex w-fit content-center items-center justify-center overflow-visible border border-line bg-white/10 p-px backdrop-blur-sm transition duration-500",
        containerClassName
      )}
      {...props}
    >
      <div className={cn("z-10 rounded-[inherit] bg-background", className)}>
        {children}
      </div>
      <motion.div
        className="absolute inset-0 z-0 flex-none overflow-hidden rounded-[inherit]"
        style={{ filter: "blur(2px)", width: "100%", height: "100%" }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered ? [movingMap[direction], highlight] : movingMap[direction],
        }}
        transition={{ ease: "linear", duration }}
      />
      <div className="absolute inset-[1px] z-[1] flex-none rounded-[inherit] bg-background" />
    </Element>
  );
}
