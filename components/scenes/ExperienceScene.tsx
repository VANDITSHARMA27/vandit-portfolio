"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, ArrowUp, ArrowDown } from "lucide-react";
import { experience } from "@/content/experience";
import { TextScramble } from "@/components/ui/text-scramble";
import { DottedSurface } from "@/components/ui/dotted-surface";

export function ExperienceScene() {
  const [active, setActive] = useState(0);
  const [compact, setCompact] = useState(false);
  const activeRef = useRef(0);
  const total = experience.length;

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  // Smaller, calmer layout on phones (the diagonal fan overflows narrow screens).
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Step through the experience cards before letting the page move on to the
  // next scene. We listen in the capture phase so we run *before* the scene
  // controller's window listeners and can stop them when we consume the scroll.
  // On mobile we skip this entirely — cards are shown as a plain scroll column.
  useEffect(() => {
    if (compact) return;
    let accum = 0;
    let stepLock = false;
    const lockFor = (ms: number) => {
      stepLock = true;
      window.setTimeout(() => (stepLock = false), ms);
    };
    const step = (down: boolean) => {
      if (stepLock) return;
      setActive((a) => {
        const nextA = down ? a + 1 : a - 1;
        if (nextA < 0 || nextA >= total) return a;
        lockFor(900); // hold longer so one gesture = one card
        return nextA;
      });
    };
    const atBoundary = (down: boolean) => {
      const a = activeRef.current;
      return (down && a >= total - 1) || (!down && a <= 0);
    };

    const onWheel = (e: WheelEvent) => {
      const down = e.deltaY > 0;
      if (atBoundary(down)) return; // let the scene controller advance scenes
      e.preventDefault();
      e.stopPropagation();
      if (stepLock) {
        accum = 0;
        return;
      }
      accum += e.deltaY;
      if (accum > 130) {
        accum = 0;
        step(true);
      } else if (accum < -130) {
        accum = 0;
        step(false);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      const downKeys = ["ArrowDown", "PageDown"];
      const upKeys = ["ArrowUp", "PageUp"];
      const isDown = downKeys.includes(e.key);
      if (!isDown && !upKeys.includes(e.key)) return;
      if (atBoundary(isDown)) return;
      e.preventDefault();
      e.stopPropagation();
      step(isDown);
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const delta = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 50) return;
      const down = delta > 0;
      if (atBoundary(down)) return;
      e.stopPropagation();
      step(down);
    };

    window.addEventListener("wheel", onWheel, { capture: true, passive: false });
    window.addEventListener("keydown", onKey, true);
    window.addEventListener("touchstart", onTouchStart, true);
    window.addEventListener("touchend", onTouchEnd, true);
    return () => {
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("touchstart", onTouchStart, true);
      window.removeEventListener("touchend", onTouchEnd, true);
    };
  }, [total, compact]);

  const cardTarget = (i: number) => {
    const d = i - active;
    const side = i % 2 === 0 ? -1 : 1; // alternate → zig-zag
    if (d === 0) {
      return { x: 0, y: 0, z: 0, scale: 1, rotateZ: 0, opacity: 1, blur: 0, zi: 40 };
    }
    if (d > 0) {
      // Tighter fan on mobile so cards don't spill past the heading/edges.
      const xBase = compact ? 26 : 70;
      const xStep = compact ? 14 : 36;
      const yBase = compact ? 30 : 56;
      const yStep = compact ? 22 : 46;
      // On mobile only hint at the next card, hide deeper ones.
      const opacity = compact
        ? d === 1
          ? 0.32
          : 0
        : Math.max(0.12, 0.5 - 0.13 * d);
      return {
        x: side * (xBase + xStep * d),
        y: -(yBase + yStep * d),
        z: -120 * d,
        scale: Math.max(0.7, 1 - (compact ? 0.08 : 0.1) * d),
        rotateZ: side * 3,
        opacity,
        blur: 1.5 * d,
        zi: 40 - d,
      };
    }
    // past
    return {
      x: side * 50,
      y: compact ? 110 : 150,
      z: -40,
      scale: 0.9,
      rotateZ: side * -2,
      opacity: 0,
      blur: 3,
      zi: 10 + d,
    };
  };

  // Mobile: a plain, readable scroll column (no 3D fan, no step-locking).
  if (compact) {
    return (
      <div className="relative h-full w-full overflow-hidden">
        <DottedSurface className="opacity-50" />
        <div
          data-scene-scroll
          className="relative z-10 h-full w-full overflow-y-auto px-6 pt-24 pb-24"
        >
          <div className="mb-6">
            <span className="eyebrow flex items-center gap-3">
              <span className="inline-block h-px w-8 bg-foreground/50" />
              Career
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
              <TextScramble as="span">Experience</TextScramble>
            </h2>
          </div>
          <div className="space-y-4">
            {experience.map((job) => (
              <div
                key={job.id}
                className="rounded-2xl border border-line bg-surface/85 p-6 text-left backdrop-blur-md"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <span className="font-mono text-xs uppercase tracking-wider text-muted">
                    {job.period}
                  </span>
                  {job.current && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-0.5 text-xs text-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                      Current
                    </span>
                  )}
                </div>
                <h3 className="mt-2 font-display text-xl font-semibold tracking-tight">
                  {job.role}
                </h3>
                <p className="mt-0.5 text-sm text-foreground/80">
                  {job.company}
                  {job.team ? <span className="text-muted"> · {job.team}</span> : null}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {job.summary}
                </p>
                <ul className="mt-4 space-y-2">
                  {job.highlights.map((h, k) => (
                    <li
                      key={k}
                      className="flex gap-2.5 text-sm leading-relaxed text-foreground/85"
                    >
                      <ArrowUpRight size={15} className="mt-1 shrink-0 text-foreground" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
                {job.stack && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {job.stack.map((s) => (
                      <span
                        key={s}
                        className="rounded-md border border-line px-2 py-1 font-mono text-xs text-muted"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-6 pt-32 pb-24 md:pt-20">
      <DottedSurface className="opacity-60" />

      <div className="absolute left-6 top-20 z-20 md:left-8 md:top-24">
        <span className="eyebrow flex items-center gap-3">
          <span className="inline-block h-px w-8 bg-foreground/50" />
          Career
        </span>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
          <TextScramble as="span">Experience</TextScramble>
        </h2>
      </div>

      {/* 3D stage */}
      <div
        className="relative z-10 flex h-[26rem] w-full max-w-2xl items-center justify-center md:h-[28rem]"
        style={{ perspective: 1400 }}
      >
        {experience.map((job, i) => {
          const t = cardTarget(i);
          const isFront = i === active;
          return (
            <motion.button
              key={job.id}
              type="button"
              onClick={() => !isFront && setActive(i)}
              animate={{
                x: t.x,
                y: t.y,
                z: t.z,
                scale: t.scale,
                rotateZ: t.rotateZ,
                opacity: t.opacity,
                filter: `blur(${t.blur}px)`,
              }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              style={{
                zIndex: t.zi,
                transformStyle: "preserve-3d",
                pointerEvents: t.opacity <= 0.12 ? "none" : "auto",
              }}
              className={`absolute left-0 right-0 mx-auto w-full max-w-2xl cursor-${
                isFront ? "default" : "pointer"
              } rounded-2xl border border-line bg-surface/85 p-6 text-left backdrop-blur-md md:p-8`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <span className="font-mono text-xs uppercase tracking-wider text-muted">
                  {job.period}
                </span>
                {job.current && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-0.5 text-xs text-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                    Current
                  </span>
                )}
              </div>
              <h3 className="mt-2 font-display text-xl font-semibold tracking-tight md:text-2xl">
                {job.role}
              </h3>
              <p className="mt-0.5 text-sm text-foreground/80">
                {job.company}
                {job.team ? <span className="text-muted"> · {job.team}</span> : null}
              </p>

              {isFront && (
                <>
                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    {job.summary}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {job.highlights.map((h, k) => (
                      <li
                        key={k}
                        className="flex gap-2.5 text-sm leading-relaxed text-foreground/85"
                      >
                        <ArrowUpRight size={15} className="mt-1 shrink-0 text-foreground" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                  {job.stack && (
                    <div className="mt-5 hidden flex-wrap gap-2 sm:flex">
                      {job.stack.map((s) => (
                        <span
                          key={s}
                          className="rounded-md border border-line px-2 py-1 font-mono text-xs text-muted"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* controls */}
      <div className="z-20 mt-8 flex items-center gap-5">
        <button
          type="button"
          aria-label="Previous experience"
          disabled={active === 0}
          onClick={() => setActive((a) => Math.max(0, a - 1))}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-line text-foreground transition-colors hover:bg-white/[0.06] disabled:opacity-30"
        >
          <ArrowUp size={17} />
        </button>
        <span className="font-mono text-sm text-muted">
          {String(active + 1).padStart(2, "0")}
          <span className="text-faint"> / {String(total).padStart(2, "0")}</span>
        </span>
        <button
          type="button"
          aria-label="Next experience"
          disabled={active === total - 1}
          onClick={() => setActive((a) => Math.min(total - 1, a + 1))}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-line text-foreground transition-colors hover:bg-white/[0.06] disabled:opacity-30"
        >
          <ArrowDown size={17} />
        </button>
      </div>
    </div>
  );
}
