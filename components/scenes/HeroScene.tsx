"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { ArrowRight, FileText } from "lucide-react";
import { site } from "@/content/site";
import { HoverButton } from "@/components/ui/hover-button";
import { TextScramble } from "@/components/ui/text-scramble";
import { useScene } from "@/components/scene/SceneContext";
import { easeOutExpo } from "@/lib/motion";

const ParticleField = dynamic(
  () => import("@/components/ui/particle-field").then((m) => m.ParticleField),
  { ssr: false }
);

const lines = site.headline.split("\n");

export function HeroScene() {
  const { go } = useScene();

  const requestResume = () => {
    try {
      sessionStorage.setItem("prefill-resume", "1");
    } catch {}
    window.dispatchEvent(new CustomEvent("request-resume"));
    go("contact");
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(60rem_40rem_at_50%_35%,rgba(255,255,255,0.06),transparent_60%)]"
      />
      <ParticleField className="absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,transparent_30%,rgba(0,0,0,0.55)_75%,rgba(0,0,0,0.95)_100%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 text-center">
        {/* Soft dark scrim behind the copy — lifts text contrast over the
            particles without altering the animation itself. */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0.62)_0%,rgba(0,0,0,0.32)_45%,transparent_72%)] blur-2xl"
        />
        <h1 className="font-display text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-foreground [text-shadow:0_2px_24px_rgba(0,0,0,0.55)] sm:text-6xl md:text-7xl">
          <TextScramble as="span" className="block" delay={0.4} speed={0.03}>
            {lines[0]}
          </TextScramble>
          <TextScramble
            as="span"
            className="text-gradient block"
            delay={0.7}
            speed={0.03}
          >
            {lines[1] ?? ""}
          </TextScramble>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8, ease: easeOutExpo }}
          className="mx-auto mt-7 max-w-2xl text-lg font-medium leading-relaxed text-foreground [text-shadow:0_1px_18px_rgba(0,0,0,0.85)] md:text-xl"
        >
          {site.subhead}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8, ease: easeOutExpo }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <HoverButton onClick={() => go("about")}>
            View work <ArrowRight size={17} />
          </HoverButton>
          <HoverButton onClick={() => go("contact")}>Get in touch</HoverButton>
          <HoverButton onClick={requestResume}>
            <FileText size={16} /> Request résumé
          </HoverButton>
        </motion.div>
      </div>
    </div>
  );
}
