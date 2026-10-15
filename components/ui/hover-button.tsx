"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface HoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

type Circle = {
  id: number;
  x: number;
  y: number;
  fadeState: "in" | "out" | null;
};

/**
 * Pill button that leaves a soft white light-trail under the cursor on hover.
 * Monochrome, matches the site's outline CTA style. Falls back gracefully —
 * under reduced motion no trail is emitted.
 */
const HoverButton = React.forwardRef<HTMLButtonElement, HoverButtonProps>(
  ({ className, children, ...props }, ref) => {
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const [isListening, setIsListening] = React.useState(false);
    const [circles, setCircles] = React.useState<Circle[]>([]);
    const lastAddedRef = React.useRef(0);
    const reduced = React.useRef(false);

    React.useEffect(() => {
      reduced.current = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
    }, []);

    const createCircle = React.useCallback((x: number, y: number) => {
      setCircles((prev) => [...prev, { id: Date.now(), x, y, fadeState: null }]);
    }, []);

    const handlePointerMove = React.useCallback(
      (event: React.PointerEvent<HTMLButtonElement>) => {
        if (!isListening || reduced.current) return;
        const now = Date.now();
        if (now - lastAddedRef.current > 90) {
          lastAddedRef.current = now;
          const rect = event.currentTarget.getBoundingClientRect();
          createCircle(event.clientX - rect.left, event.clientY - rect.top);
        }
      },
      [isListening, createCircle]
    );

    React.useEffect(() => {
      circles.forEach((circle) => {
        if (!circle.fadeState) {
          setTimeout(() => {
            setCircles((prev) =>
              prev.map((c) =>
                c.id === circle.id ? { ...c, fadeState: "in" } : c
              )
            );
          }, 0);
          setTimeout(() => {
            setCircles((prev) =>
              prev.map((c) =>
                c.id === circle.id ? { ...c, fadeState: "out" } : c
              )
            );
          }, 900);
          setTimeout(() => {
            setCircles((prev) => prev.filter((c) => c.id !== circle.id));
          }, 2000);
        }
      });
    }, [circles]);

    return (
      <button
        ref={(node) => {
          buttonRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(
          "glass-hover relative isolate inline-flex h-12 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full border border-line px-7 text-[0.95rem] font-medium text-foreground transition-colors hover:text-white",
          className
        )}
        onPointerMove={handlePointerMove}
        onPointerEnter={() => setIsListening(true)}
        onPointerLeave={() => setIsListening(false)}
        {...props}
      >
        {circles.map(({ id, x, y, fadeState }) => (
          <span
            key={id}
            aria-hidden
            className={cn(
              "pointer-events-none absolute z-[-1] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white blur-lg transition-opacity duration-300",
              fadeState === "in" && "opacity-70",
              fadeState === "out" && "opacity-0 duration-[1.1s]",
              !fadeState && "opacity-0"
            )}
            style={{ left: x, top: y }}
          />
        ))}
        {children}
      </button>
    );
  }
);

HoverButton.displayName = "HoverButton";

export { HoverButton };
