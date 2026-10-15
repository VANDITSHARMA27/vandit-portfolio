"use client";

import { TextScramble } from "@/components/ui/text-scramble";
import { ProjectDeck } from "@/components/ui/project-deck";
import { ElegantShapes } from "@/components/ui/elegant-shapes";

export function WorkScene() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <ElegantShapes />
      {/* Scrollable on short/mobile viewports; centered when it fits. */}
      <div
        data-scene-scroll
        className="relative z-10 h-full w-full overflow-y-auto"
      >
        <div className="flex min-h-full w-full flex-col items-center justify-center px-6 pt-24 pb-28 md:px-8">
          <div className="mb-10 text-center">
            <span className="eyebrow flex items-center justify-center gap-3">
              <span className="inline-block h-px w-8 bg-foreground/50" />
              Selected work
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-5xl">
              <TextScramble as="span">How I think</TextScramble>,{" "}
              <span className="text-gradient">design &amp; ship.</span>
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-muted">
              Tap a card to open the project — problem, approach, impact.
            </p>
          </div>
          <div className="flex w-full justify-center">
            <ProjectDeck />
          </div>
        </div>
      </div>
    </div>
  );
}
