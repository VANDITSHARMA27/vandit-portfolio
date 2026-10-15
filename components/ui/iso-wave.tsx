"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface IsoWaveProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Line colour as "r, g, b". Defaults to a soft light grey. */
  color?: string;
  speed?: number;
  density?: number;
}

/**
 * A flowing, topographic line-grid that ripples and lifts toward the cursor.
 * Monochrome and pointer-transparent — meant to sit faintly behind content
 * (e.g. the Skills cards). Reduced-motion-aware (renders a single still frame).
 */
export function IsoWave({
  className,
  color = "140, 140, 150",
  speed = 1,
  density = 46,
  ...props
}: IsoWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = container.offsetWidth;
    let height = container.offsetHeight;
    let raf = 0;

    const gridGap = density;
    let rows = Math.ceil(height / gridGap) + 5;
    let cols = Math.ceil(width / gridGap) + 5;

    const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };
    let time = 0;

    const resize = () => {
      width = container.offsetWidth;
      height = container.offsetHeight;
      canvas.width = width;
      canvas.height = height;
      rows = Math.ceil(height / gridGap) + 5;
      cols = Math.ceil(width / gridGap) + 5;
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    const mix = (a: number, b: number, t: number) => a + (b - a) * t;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      mouse.x = mix(mouse.x, mouse.targetX, 0.1);
      mouse.y = mix(mouse.y, mouse.targetY, 0.1);
      time += 0.01 * speed;

      ctx.beginPath();
      for (let y = 0; y <= rows; y++) {
        let first = true;
        for (let x = 0; x <= cols; x++) {
          const baseX = x * gridGap - gridGap * 2;
          const baseY = y * gridGap - gridGap * 2;
          const wave =
            Math.sin(x * 0.2 + time) * Math.cos(y * 0.2 + time) * 14;
          const dx = baseX - mouse.x;
          const dy = baseY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const force = Math.max(0, (300 - dist) / 300);
          const interactionY = -(force * force) * 70;
          const fx = baseX;
          const fy = baseY + wave + interactionY;
          if (first) {
            ctx.moveTo(fx, fy);
            first = false;
          } else {
            ctx.lineTo(fx, fy);
          }
        }
      }

      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, `rgba(${color}, 0)`);
      gradient.addColorStop(0.5, `rgba(${color}, 0.3)`);
      gradient.addColorStop(1, `rgba(${color}, 0)`);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1;
      ctx.stroke();

      if (!reduce) raf = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    if (!reduce) window.addEventListener("mousemove", onMouseMove);
    resize();
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(raf);
    };
  }, [color, speed, density]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      {...props}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
