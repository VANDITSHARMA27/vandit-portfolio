"use client";

import { motion } from "motion/react";
import {
  Compass,
  Sparkles,
  Terminal,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
import { skills } from "@/content/skills";
import { TextScramble } from "@/components/ui/text-scramble";
import { IsoWave } from "@/components/ui/iso-wave";
import { cn } from "@/lib/utils";

const icons: Record<string, LucideIcon> = { Compass, Sparkles, Terminal, BarChart3 };

// Bento spans (6-col grid): Product is the headline card, then a balanced row.
const spans = [
  "lg:col-span-4",
  "lg:col-span-2",
  "lg:col-span-3",
  "lg:col-span-3",
];

export function SkillsScene() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Flowing line-grid drifting behind the cards. */}
      <IsoWave className="opacity-60" />

      <div
        data-scene-scroll
        className="relative z-10 h-full w-full overflow-y-auto px-6 pt-24 pb-28 md:px-8"
      >
        <div className="mx-auto max-w-5xl">
          <div className="mb-7">
            <span className="eyebrow flex items-center gap-3">
              <span className="inline-block h-px w-8 bg-foreground/50" />
              Capabilities
            </span>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight md:text-3xl">
              <TextScramble as="span">Skills, grouped by use.</TextScramble>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-6">
            {skills.map((group, i) => {
              const Icon = icons[group.icon] ?? Compass;
              return (
                <motion.div
                  key={group.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.07,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border border-line bg-surface/80 p-4 backdrop-blur-md transition-all duration-300 hover:border-line-strong hover:bg-surface hover:shadow-[0_0_28px_-8px_rgba(255,255,255,0.28)] md:p-5",
                    spans[i] ?? "lg:col-span-3"
                  )}
                >
                  {/* faint corner index */}
                  <span className="pointer-events-none absolute right-3 top-2 font-mono text-4xl font-semibold text-white/[0.03] transition-colors group-hover:text-white/[0.06]">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-white/[0.04] text-foreground">
                      <Icon size={16} />
                    </span>
                    <h3 className="font-display text-base font-semibold tracking-tight">
                      {group.name}
                    </h3>
                  </div>

                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-md border border-line bg-white/[0.02] px-2.5 py-1 text-xs text-foreground/85 transition-colors hover:border-line-strong hover:text-foreground"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
