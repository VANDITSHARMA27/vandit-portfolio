"use client";

import React, { useRef, useId, useEffect, type CSSProperties } from "react";
import { asset } from "@/lib/base-path";
import { animate, useMotionValue, type AnimationPlaybackControls } from "motion/react";

interface AnimationConfig {
  scale: number;
  speed: number;
}
interface NoiseConfig {
  opacity: number;
  scale: number;
}
interface EtherealShadowProps {
  sizing?: "fill" | "stretch";
  color?: string;
  animation?: AnimationConfig;
  noise?: NoiseConfig;
  style?: CSSProperties;
  className?: string;
}

function mapRange(v: number, a: number, b: number, c: number, d: number) {
  if (a === b) return c;
  return c + ((v - a) / (b - a)) * (d - c);
}

const useInstanceId = () => {
  const id = useId();
  return `shadowoverlay-${id.replace(/:/g, "")}`;
};

/**
 * Slowly-undulating, displaced "fog" rendered from a masked grey fill. Pure
 * monochrome and self-hosted (assets in /public). Meant as a calm background
 * layer (e.g. behind the contact form). Reduced-motion → still shape, no churn.
 * Adapted from a framer-motion reference onto motion/react.
 */
export function EtherealShadow({
  sizing = "fill",
  color = "rgba(128, 128, 128, 1)",
  animation,
  noise,
  style,
  className,
}: EtherealShadowProps) {
  const id = useInstanceId();
  const feColorMatrixRef = useRef<SVGFEColorMatrixElement>(null);
  const hueRotate = useMotionValue(180);
  const anim = useRef<AnimationPlaybackControls | null>(null);

  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const animationEnabled = !!animation && animation.scale > 0 && !reduce;
  const displacementScale = animation ? mapRange(animation.scale, 1, 100, 20, 100) : 0;
  const animationDuration = animation ? mapRange(animation.speed, 1, 100, 1000, 50) : 1;

  useEffect(() => {
    if (feColorMatrixRef.current && animationEnabled) {
      anim.current?.stop();
      hueRotate.set(0);
      anim.current = animate(hueRotate, 360, {
        duration: animationDuration / 25,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        onUpdate: (value: number) => {
          feColorMatrixRef.current?.setAttribute("values", String(value));
        },
      });
      return () => anim.current?.stop();
    }
  }, [animationEnabled, animationDuration, hueRotate]);

  return (
    <div
      className={className}
      style={{ overflow: "hidden", position: "relative", width: "100%", height: "100%", ...style }}
    >
      <div
        style={{
          position: "absolute",
          inset: -displacementScale,
          filter: animationEnabled ? `url(#${id}) blur(4px)` : "none",
        }}
      >
        {animationEnabled && (
          <svg style={{ position: "absolute" }}>
            <defs>
              <filter id={id}>
                <feTurbulence
                  result="undulation"
                  numOctaves="2"
                  baseFrequency={`${mapRange(animation!.scale, 0, 100, 0.001, 0.0005)},${mapRange(
                    animation!.scale,
                    0,
                    100,
                    0.004,
                    0.002
                  )}`}
                  seed="0"
                  type="turbulence"
                />
                <feColorMatrix ref={feColorMatrixRef} in="undulation" type="hueRotate" values="180" />
                <feColorMatrix
                  in="dist"
                  result="circulation"
                  type="matrix"
                  values="4 0 0 0 1  4 0 0 0 1  4 0 0 0 1  1 0 0 0 0"
                />
                <feDisplacementMap in="SourceGraphic" in2="circulation" scale={displacementScale} result="dist" />
                <feDisplacementMap in="dist" in2="undulation" scale={displacementScale} result="output" />
              </filter>
            </defs>
          </svg>
        )}
        <div
          style={{
            backgroundColor: color,
            maskImage: `url('${asset("/etheral-mask.png")}')`,
            WebkitMaskImage: `url('${asset("/etheral-mask.png")}')`,
            maskSize: sizing === "stretch" ? "100% 100%" : "cover",
            WebkitMaskSize: sizing === "stretch" ? "100% 100%" : "cover",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
            width: "100%",
            height: "100%",
          }}
        />
      </div>

      {noise && noise.opacity > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url("${asset("/etheral-noise.png")}")`,
            backgroundSize: noise.scale * 200,
            backgroundRepeat: "repeat",
            opacity: noise.opacity / 2,
          }}
        />
      )}
    </div>
  );
}
