"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types/content";
import { cn } from "@/lib/utils";

export function ProjectCard({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  // pointer-driven tilt + glow
  const rx = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glow = useMotionTemplate`radial-gradient(20rem 20rem at ${gx}% ${gy}%, rgba(139,92,246,0.14), transparent 60%)`;

  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 8);
    rx.set((0.5 - py) * 8);
    gx.set(px * 100);
    gy.set(py * 100);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  const kindLabel = project.kind === "build" ? "Build" : "Case Study";

  return (
    <motion.div
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      className={cn("[transform-style:preserve-3d]", className)}
    >
      <Link
        ref={ref}
        href={`/work/${project.slug}`}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface/60 p-6 transition-colors duration-300 hover:border-line-strong md:p-8"
      >
        <motion.span
          aria-hidden
          style={{ background: glow }}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        <div className="relative flex items-center justify-between">
          <span
            className={cn(
              "rounded-full border px-2.5 py-0.5 font-mono text-[0.68rem] uppercase tracking-wider",
              project.kind === "build"
                ? "border-accent-2/30 bg-accent-2/10 text-accent-2"
                : "border-accent/30 bg-accent/10 text-accent"
            )}
          >
            {kindLabel}
          </span>
          <ArrowUpRight
            size={18}
            className="text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
          />
        </div>

        <div className="relative mt-5">
          <h3 className="font-display text-xl font-semibold tracking-tight md:text-2xl">
            {project.title}
          </h3>
          {project.company ? (
            <p className="mt-1 text-sm text-muted">
              {project.company}
              {project.year ? ` · ${project.year}` : ""}
            </p>
          ) : (
            project.year && <p className="mt-1 text-sm text-muted">{project.year}</p>
          )}
        </div>

        <p className="relative mt-4 text-sm leading-relaxed text-foreground/80">
          {project.oneLiner}
        </p>

        {project.impact.length > 0 && (
          <div className="relative mt-6 flex flex-wrap gap-x-6 gap-y-3">
            {project.impact.slice(0, 3).map((m, i) => (
              <div key={i}>
                <span className="text-gradient font-display text-2xl font-semibold">
                  {m.prefix ?? ""}
                  {m.decimals ? m.value.toFixed(m.decimals) : m.value}
                  {m.suffix ?? ""}
                </span>
                <p className="mt-0.5 max-w-[10rem] text-xs leading-tight text-muted">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="relative mt-auto flex flex-wrap gap-1.5 pt-6">
          {project.tags.slice(0, 4).map((t) => (
            <span
              key={t}
              className="rounded-md border border-line px-2 py-0.5 font-mono text-[0.7rem] text-faint"
            >
              {t}
            </span>
          ))}
        </div>
      </Link>
    </motion.div>
  );
}
