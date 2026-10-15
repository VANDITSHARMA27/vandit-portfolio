"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { BadgeCheck, GraduationCap, ExternalLink } from "lucide-react";
import { certifications } from "@/content/certifications";
import { education } from "@/content/education";
import { TextScramble } from "@/components/ui/text-scramble";
import { GlslHills } from "@/components/ui/glsl-hills";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

export function CredentialsScene() {
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Animated terrain — desktop only (heavy WebGL); fades toward the top. */}
      {desktop && (
        <>
          <GlslHills className="opacity-60" />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-background via-background/40 to-background/80" />
        </>
      )}

      <div
        data-scene-scroll
        className="relative z-10 h-full w-full overflow-y-auto px-6 pt-24 pb-28 md:px-8"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <span className="eyebrow flex items-center gap-3">
              <span className="inline-block h-px w-8 bg-foreground/50" />
              Education &amp; Credentials
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              <TextScramble as="span">Where the foundation was set.</TextScramble>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-[0.85fr_1.15fr] md:items-stretch">
            {/* Education panel */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-grid-ellipsis relative flex h-full flex-col overflow-hidden rounded-2xl border border-line"
            >
              <div className="flex h-full flex-col bg-linear-to-tr from-background/95 via-background/70 to-background/40 p-6 md:p-7">
                <span className="eyebrow">Education</span>
                <div className="mt-5 flex flex-1 flex-col gap-4">
                  {education.map((e) => (
                    <div key={e.degree}>
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-white/[0.04] text-foreground">
                        <GraduationCap size={20} />
                      </span>
                      <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">
                        {e.degree}
                      </h3>
                      <p className="mt-1 text-sm text-foreground/80">
                        {e.institution}
                      </p>
                      {e.detail && (
                        <p className="mt-3 text-sm leading-relaxed text-muted">
                          {e.detail}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Certifications & Courses — readable grid */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="bg-grid-ellipsis relative flex h-full flex-col overflow-hidden rounded-2xl border border-line"
            >
              <div className="flex h-full flex-col bg-linear-to-tr from-background/95 via-background/70 to-background/40 p-6 md:p-7">
                <span className="eyebrow">Certifications &amp; Courses</span>
                <div className="mt-5 grid flex-1 gap-3 sm:grid-cols-2">
                  {certifications.map((c, i) => (
                    <motion.div
                      key={c.name}
                      className="h-full"
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.45,
                        delay: 0.12 + i * 0.06,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <HoverBorderGradient
                        as="div"
                        duration={1.4}
                        containerClassName="h-full w-full rounded-xl"
                        className="group relative flex h-full w-full flex-col justify-between rounded-xl p-4"
                      >
                        {c.verifyUrl && (
                          <a
                            href={c.verifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Verify ${c.name}`}
                            className="absolute inset-0 z-20 rounded-xl"
                          />
                        )}
                        <div className="flex items-start gap-2.5">
                          <span className="mt-0.5 inline-flex shrink-0 items-center justify-center rounded-full bg-foreground p-1.5 text-background">
                            <BadgeCheck className="size-3.5" />
                          </span>
                          <p className="text-sm font-medium leading-snug text-foreground">
                            {c.name}
                          </p>
                          {c.verifyUrl && (
                            <ExternalLink
                              size={13}
                              className="ml-auto shrink-0 text-faint transition-colors group-hover:text-foreground"
                            />
                          )}
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs text-muted">{c.issuer}</span>
                          {c.year && (
                            <span className="font-mono text-xs uppercase tracking-wider text-faint">
                              {c.year}
                            </span>
                          )}
                        </div>
                      </HoverBorderGradient>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
