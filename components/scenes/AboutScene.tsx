"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { TextScramble } from "@/components/ui/text-scramble";
import { TextMarquee } from "@/components/ui/text-marquee";
import { Reveal } from "@/components/motion/Reveal";
import { impact } from "@/content/impact";
import { asset } from "@/lib/base-path";

const SplineScene = dynamic(
  () => import("@/components/ui/spline-scene").then((m) => m.SplineScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="size-6 animate-spin text-faint" />
      </div>
    ),
  }
);

// Self-hosted from /public so the robot doesn't depend on prod.spline.design.
const ROBOT_SCENE = asset("/robot.splinecode");

const paragraphs = [
  "I'm a Computer Science graduate from BIT Mesra who loves working with data. I've spent my internships analysing data with Python and SQL, building ML prototypes, and testing real government platforms.",
  "I'm not applying as a seasoned expert — I'm a dedicated learner who works hard, collaborates well, and tries to absorb something new every day to become a genuinely resourceful member of the team.",
];

const principles = [
  "Learn something every day",
  "Test everything",
  "Automate the boring parts",
  "Collaborate openly",
];

const marqueeWords = ["Pipelines", "Dashboards", "Models", "Tests", "Automation"];

export function AboutScene() {
  const rootRef = useRef<HTMLDivElement>(null);

  // Make the robot follow the cursor across the *whole* About scene, not just
  // its own box. Spline only listens on its canvas, so we re-broadcast pointer
  // moves (with the real client coords) onto the canvas. bubbles:false avoids
  // re-triggering this handler.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    // No viewport guard: on mobile the robot canvas isn't shown, so the
    // canvas lookup below simply finds nothing and forwarding no-ops.

    let canvas: HTMLCanvasElement | null = null;
    let raf = 0;
    let lastX = 0;
    let lastY = 0;

    const forward = () => {
      raf = 0;
      if (!canvas) canvas = root.querySelector("canvas");
      if (!canvas) return;
      canvas.dispatchEvent(
        new PointerEvent("pointermove", {
          clientX: lastX,
          clientY: lastY,
          bubbles: false,
          pointerType: "mouse",
        })
      );
    };

    const onMove = (e: PointerEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (!raf) raf = requestAnimationFrame(forward);
    };

    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="flex h-full w-full items-center justify-center px-6 pt-20 pb-10 md:px-8"
    >
      <div
        data-scene-scroll
        className="grid max-h-full w-full max-w-6xl gap-8 overflow-y-auto md:grid-cols-2 md:items-center md:gap-14 md:overflow-visible"
      >
        {/* Left — heading, marquee, robot */}
        <div className="flex flex-col">
          <span className="eyebrow flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-foreground/50" />
            About
          </span>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight md:text-[2.6rem]">
            <TextScramble as="span">A data enthusiast who can</TextScramble>{" "}
            <span className="text-gradient">learn it and build it.</span>
          </h2>

          <div className="mt-6 flex items-center gap-3 font-display text-2xl font-medium text-muted md:text-3xl">
            <span>I build</span>
            <TextMarquee height={44} speed={1.1} className="text-foreground">
              {marqueeWords.map((w) => (
                <span key={w}>{w}</span>
              ))}
            </TextMarquee>
          </div>

          {/* Interactive robot — fills the space below "I ship" (desktop only) */}
          <div className="relative mt-4 hidden h-[clamp(220px,40vh,420px)] w-full overflow-hidden md:block">
            <SplineScene
              scene={ROBOT_SCENE}
              className="!absolute !inset-0 !h-full !w-full [filter:grayscale(1)_contrast(1.05)]"
            />
            {/* mask the Spline watermark in the corner */}
            <div className="pointer-events-none absolute bottom-0 right-0 h-10 w-36 bg-background" />
          </div>
        </div>

        {/* Right — narrative, stats, principles (fits, no scroll) */}
        <div className="min-h-0">
          <div className="space-y-4">
            {paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className="text-sm leading-relaxed text-muted md:text-base">
                  {p}
                </p>
              </Reveal>
            ))}
          </div>

          {/* de-emphasised impact stats */}
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-5">
            {impact.map((m, i) => (
              <div key={i}>
                <span className="font-display text-xl font-semibold text-foreground md:text-2xl">
                  {m.prefix ?? ""}
                  {m.decimals ? m.value.toFixed(m.decimals) : m.value}
                  {m.suffix ?? ""}
                </span>
                <p className="mt-0.5 max-w-[11rem] text-xs leading-tight text-faint">
                  {m.label}
                </p>
              </div>
            ))}
          </div>

          <ul className="mt-6 flex flex-wrap gap-2.5">
            {principles.map((p) => (
              <li
                key={p}
                className="glass rounded-full px-4 py-2 text-sm text-foreground/90"
              >
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
