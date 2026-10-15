"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TextMarqueeProps {
  children: React.ReactNode[];
  speed?: number;
  className?: string;
  prefix?: React.ReactNode;
  height?: number;
}

/** Vertical infinite text marquee (cycles a list of words). */
export function TextMarquee({
  children,
  speed = 1,
  className,
  prefix,
  height = 200,
}: TextMarqueeProps) {
  const count = React.Children.count(children);

  return (
    <>
      <style>{`
        @keyframes slide-vertical { to { translate: 0 var(--destination); } }
      `}</style>
      <div className={cn("flex relative", className)}>
        <div className="relative flex w-min flex-row items-center gap-2 overflow-hidden">
          {prefix && <div className="relative size-auto whitespace-pre">{prefix}</div>}
          <div
            className="relative w-auto overflow-hidden"
            style={{
              height: `${height}px`,
              maskImage:
                "linear-gradient(rgba(0,0,0,0) 0%, rgb(0,0,0) 44%, rgba(0,0,0,0) 100%)",
              WebkitMaskImage:
                "linear-gradient(rgba(0,0,0,0) 0%, rgb(0,0,0) 44%, rgba(0,0,0,0) 100%)",
            }}
          >
            <div
              className="relative h-full"
              style={
                { "--count": count, "--speed": speed } as React.CSSProperties
              }
            >
              {React.Children.map(children, (child, index) => (
                <div
                  key={index}
                  className="flex h-[1.4em] items-center justify-center"
                  style={
                    {
                      "--index": index,
                      "--origin": `calc((var(--count) - var(--index)) * 100%)`,
                      "--destination": `calc((var(--index) + 1) * -100%)`,
                      "--duration": `calc(var(--speed) * ${count}s)`,
                      "--delay":
                        "calc((var(--duration) / var(--count)) * var(--index) - var(--duration))",
                      translate: "0 var(--origin)",
                      animation:
                        "slide-vertical var(--duration) var(--delay) infinite linear",
                    } as React.CSSProperties
                  }
                >
                  {child}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
