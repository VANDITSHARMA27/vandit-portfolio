"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SCENES, useScene } from "./SceneContext";

export function SceneNav() {
  const { index, go, next } = useScene();
  const [open, setOpen] = useState(false);
  const navScenes = SCENES.slice(1); // skip hero in the link list
  const isLast = index === SCENES.length - 1;

  return (
    <>
      {/* Mobile-only top scrim: fades scrolling scene content out before it
          reaches the logo / menu button, so nothing visually collides with
          the fixed nav. Hidden on desktop (where scenes don't long-scroll). */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-30 h-24 bg-gradient-to-b from-background via-background/85 to-transparent md:hidden"
      />

      {/* top bar */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
        <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 md:px-8">
          <button
            type="button"
            onClick={() => go("hero")}
            className="pointer-events-auto cursor-pointer font-display text-base font-semibold tracking-tight text-foreground"
          >
            Vandit<span className="text-faint">.</span>
          </button>

          <ul className="pointer-events-auto hidden h-16 items-center gap-2 md:flex">
            {navScenes.map((s) => {
              const active = SCENES[index].id === s.id;
              return (
                <li key={s.id} className="flex h-full items-center">
                  <button
                    type="button"
                    onClick={() => go(s.id)}
                    className={cn(
                      "relative flex h-full cursor-pointer items-center px-4 text-sm transition-colors duration-200",
                      active ? "text-foreground" : "text-muted hover:text-foreground"
                    )}
                  >
                    {active && (
                      <motion.span
                        aria-hidden
                        layoutId="nav-limelight"
                        className="pointer-events-none absolute inset-x-0 top-0 -z-10"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      >
                        {/* the bright source line */}
                        <span className="absolute left-1/2 top-0 h-[3px] w-10 -translate-x-1/2 rounded-full bg-foreground shadow-[0_0_14px_3px_rgba(255,255,255,0.7)]" />
                        {/* the cone of light flaring down over the label */}
                        <span className="absolute left-1/2 top-0 h-14 w-20 -translate-x-1/2 bg-linear-to-b from-white/20 to-transparent [clip-path:polygon(30%_0,70%_0,100%_100%,0_100%)]" />
                      </motion.span>
                    )}
                    {s.label}
                  </button>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="pointer-events-auto flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-foreground md:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {/* mobile sheet */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="pointer-events-auto mx-4 overflow-hidden rounded-2xl border border-line bg-surface/95 backdrop-blur-xl md:hidden"
            >
              <ul className="flex flex-col gap-1 p-3">
                {SCENES.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        go(s.id);
                      }}
                      className={cn(
                        "w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-sm",
                        SCENES[index].id === s.id
                          ? "bg-foreground text-background"
                          : "text-muted hover:bg-white/[0.04] hover:text-foreground"
                      )}
                    >
                      {s.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* side progress dots */}
      <div className="pointer-events-none fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex">
        {SCENES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Go to ${s.label}`}
            onClick={() => go(i)}
            className="pointer-events-auto cursor-pointer p-1"
          >
            <span
              className={cn(
                "block rounded-full transition-all duration-300",
                i === index
                  ? "h-5 w-1.5 bg-foreground"
                  : "h-1.5 w-1.5 bg-white/30 hover:bg-white/60"
              )}
            />
          </button>
        ))}
      </div>

      {/* scroll / next cue */}
      <AnimatePresence>
        {!isLast && (
          <motion.button
            type="button"
            onClick={next}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-auto fixed bottom-7 left-1/2 z-40 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-1 text-faint transition-colors hover:text-foreground"
          >
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em]">
              Scroll
            </span>
            <motion.span
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown size={18} />
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
