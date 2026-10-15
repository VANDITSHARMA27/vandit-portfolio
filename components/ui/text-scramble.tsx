"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#%&";

type TextScrambleProps = {
  children: string;
  as?: React.ElementType;
  className?: string;
  duration?: number;
  speed?: number;
  characterSet?: string;
  trigger?: boolean;
  delay?: number;
  onComplete?: () => void;
};

export function TextScramble({
  children,
  as: Component = "span",
  className,
  duration = 0.9,
  speed = 0.035,
  characterSet = DEFAULT_CHARS,
  trigger = true,
  delay = 0,
  onComplete,
}: TextScrambleProps) {
  const [display, setDisplay] = useState(children);
  const animating = useRef(false);

  useEffect(() => {
    if (!trigger) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setDisplay(children);
      onComplete?.();
      return;
    }

    let interval: ReturnType<typeof setInterval>;
    const startTimer = setTimeout(() => {
      if (animating.current) return;
      animating.current = true;
      const steps = duration / speed;
      let step = 0;
      interval = setInterval(() => {
        const progress = step / steps;
        let out = "";
        for (let i = 0; i < children.length; i++) {
          if (children[i] === " " || children[i] === "\n") {
            out += children[i];
          } else if (progress * children.length > i) {
            out += children[i];
          } else {
            out += characterSet[Math.floor(Math.random() * characterSet.length)];
          }
        }
        setDisplay(out);
        step++;
        if (step > steps) {
          clearInterval(interval);
          setDisplay(children);
          animating.current = false;
          onComplete?.();
        }
      }, speed * 1000);
    }, delay * 1000);

    return () => {
      clearTimeout(startTimer);
      clearInterval(interval);
      animating.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, children]);

  return <Component className={className}>{display}</Component>;
}
