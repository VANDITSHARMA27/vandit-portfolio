"use client";

import { Contact } from "@/components/sections/Contact";
import { EtherealShadow } from "@/components/ui/etheral-shadow";

export function ContactScene() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Slow, monochrome drifting fog behind the form. */}
      <EtherealShadow
        className="pointer-events-none opacity-60"
        style={{ position: "absolute", inset: 0 }}
        color="rgba(150, 150, 158, 1)"
        animation={{ scale: 55, speed: 55 }}
        noise={{ opacity: 0.25, scale: 1.1 }}
        sizing="fill"
      />
      <div
        data-scene-scroll
        className="relative z-10 h-full w-full overflow-y-auto pt-10 pb-12"
      >
        <Contact />
      </div>
    </div>
  );
}
