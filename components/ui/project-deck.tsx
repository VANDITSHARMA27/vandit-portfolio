"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowUpRight } from "lucide-react";
import { projects } from "@/content/projects";
import type { Project } from "@/types/content";
import { cn } from "@/lib/utils";

export function ProjectDeck() {
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Deck */}
      <div className="grid w-full max-w-5xl gap-4 sm:grid-cols-2">
        {projects.map((p, i) => (
          <motion.button
            key={p.slug}
            type="button"
            layoutId={`card-${p.slug}`}
            onClick={() => setSelected(p)}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
            className="group cursor-pointer rounded-2xl border border-line bg-surface/70 p-6 text-left backdrop-blur-sm transition-colors hover:border-line-strong"
          >
            <motion.div layoutId={`card-head-${p.slug}`} className="flex items-center justify-between">
              <span
                className={cn(
                  "rounded-full border px-2.5 py-0.5 font-mono text-[0.68rem] uppercase tracking-wider",
                  p.kind === "build"
                    ? "border-line-strong text-foreground"
                    : "border-line text-muted"
                )}
              >
                {p.kind === "build" ? "Build" : "Case Study"}
              </span>
              <ArrowUpRight
                size={18}
                className="text-faint transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
              />
            </motion.div>
            <motion.h3
              layoutId={`card-title-${p.slug}`}
              className="mt-5 font-display text-xl font-semibold tracking-tight md:text-2xl"
            >
              {p.title}
            </motion.h3>
            {p.company && <p className="mt-1 text-sm text-muted">{p.company}{p.year ? ` · ${p.year}` : ""}</p>}
            <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-foreground/75">
              {p.oneLiner}
            </p>
          </motion.button>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            />
            <motion.div
              layoutId={`card-${selected.slug}`}
              className="relative z-10 max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-line bg-surface p-7 md:p-9"
              data-scene-scroll
            >
              <motion.div layoutId={`card-head-${selected.slug}`} className="flex items-center justify-between">
                <span
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 font-mono text-[0.68rem] uppercase tracking-wider",
                    selected.kind === "build"
                      ? "border-line-strong text-foreground"
                      : "border-line text-muted"
                  )}
                >
                  {selected.kind === "build" ? "Build" : "Case Study"}
                </span>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setSelected(null)}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-line text-muted transition-colors hover:text-foreground"
                >
                  <X size={17} />
                </button>
              </motion.div>

              <motion.h3
                layoutId={`card-title-${selected.slug}`}
                className="mt-5 font-display text-2xl font-semibold tracking-tight md:text-3xl"
              >
                {selected.title}
              </motion.h3>
              {selected.company && (
                <p className="mt-1 text-sm text-muted">
                  {selected.company}
                  {selected.year ? ` · ${selected.year}` : ""}
                </p>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.15 } }}
              >
                {selected.impact.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4 rounded-2xl border border-line bg-white/[0.02] p-5">
                    {selected.impact.map((m, i) => (
                      <div key={i}>
                        <span className="text-gradient font-display text-2xl font-semibold">
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
                )}

                <Block title="Problem">
                  <p className="text-sm leading-relaxed text-foreground/85">
                    {selected.problem}
                  </p>
                </Block>
                <Block title="Approach">
                  <ul className="space-y-2.5">
                    {selected.approach.map((a, i) => (
                      <li key={i} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </Block>
                {selected.body && selected.body.length > 0 && (
                  <Block title="In depth">
                    <div className="space-y-3">
                      {selected.body.map((b, i) => (
                        <p key={i} className="text-sm leading-relaxed text-foreground/85">
                          {b}
                        </p>
                      ))}
                    </div>
                  </Block>
                )}

                <div className="mt-6 flex flex-wrap gap-2">
                  {selected.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-line px-2 py-1 font-mono text-xs text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {selected.links && selected.links.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    {selected.links.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-hover inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm"
                      >
                        {l.label} <ArrowUpRight size={15} />
                      </a>
                    ))}
                  </div>
                )}

                <div className="mt-7 border-t border-line pt-5">
                  <Link
                    href={`/work/${selected.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm text-foreground transition-opacity hover:opacity-70"
                  >
                    Open full case study <ArrowUpRight size={15} />
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-7">
      <h4 className="eyebrow mb-3">{title}</h4>
      {children}
    </div>
  );
}
