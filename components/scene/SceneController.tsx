"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
// Pro-only: custom events (`track`) require a Vercel Pro plan, so this is
// disabled on the free Hobby tier. Re-enable with the `scene_view` effect below.
// import { track } from "@vercel/analytics";
import {
  SCENES,
  SceneCtx,
  type Direction,
  type SceneId,
} from "./SceneContext";
import { SceneNav } from "./SceneNav";
import { HeroScene } from "@/components/scenes/HeroScene";
import { AboutScene } from "@/components/scenes/AboutScene";
import { ExperienceScene } from "@/components/scenes/ExperienceScene";
import { WorkScene } from "@/components/scenes/WorkScene";
import { CredentialsScene } from "@/components/scenes/CredentialsScene";
import { SkillsScene } from "@/components/scenes/SkillsScene";
import { ContactScene } from "@/components/scenes/ContactScene";

const SCENE_COMPONENTS: Record<SceneId, React.ComponentType> = {
  hero: HeroScene,
  about: AboutScene,
  experience: ExperienceScene,
  work: WorkScene,
  credentials: CredentialsScene,
  skills: SkillsScene,
  contact: ContactScene,
};

const DURATION = 1; // seconds, keep in sync with transition below
const COOLDOWN = 1100; // ms lock between navigations

function originFor(dir: Direction) {
  if (dir === "next") return "50% 100%";
  if (dir === "prev") return "50% 0%";
  return "50% 50%";
}

export function SceneController() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<Direction>("next");
  const [transitioning, setTransitioning] = useState(false);
  const lock = useRef(false);
  const wheelAccum = useRef(0);
  const touchStart = useRef(0);
  const reduce = useReducedMotion();

  const navigate = useCallback(
    (to: SceneId | number, direction?: Direction) => {
      if (lock.current) return;
      const target =
        typeof to === "number" ? to : SCENES.findIndex((s) => s.id === to);
      if (target < 0 || target >= SCENES.length) return;
      setIndex((cur) => {
        if (target === cur) return cur;
        setDir(direction ?? (target > cur ? "next" : "prev"));
        lock.current = true;
        setTransitioning(true);
        window.setTimeout(() => {
          lock.current = false;
          setTransitioning(false);
        }, COOLDOWN);
        return target;
      });
    },
    []
  );

  const next = useCallback(() => navigate(index + 1, "next"), [index, navigate]);
  const prev = useCallback(() => navigate(index - 1, "prev"), [index, navigate]);

  const go = useCallback(
    (to: SceneId | number) => {
      const target =
        typeof to === "number" ? to : SCENES.findIndex((s) => s.id === to);
      navigate(target, "jump");
    },
    [navigate]
  );

  // Wheel navigation
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const scroller = (e.target as HTMLElement)?.closest("[data-scene-scroll]");
      if (scroller) {
        const el = scroller as HTMLElement;
        const atTop = el.scrollTop <= 0;
        const atBottom =
          el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
        if (!((atBottom && e.deltaY > 0) || (atTop && e.deltaY < 0))) return;
      }
      e.preventDefault();
      if (lock.current) return;
      wheelAccum.current += e.deltaY;
      if (wheelAccum.current > 60) {
        wheelAccum.current = 0;
        next();
      } else if (wheelAccum.current < -60) {
        wheelAccum.current = 0;
        prev();
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [next, prev]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown"].includes(e.key)) {
        e.preventDefault();
        next();
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        prev();
      } else if (e.key === "Home") {
        e.preventDefault();
        go("hero");
      } else if (e.key === "End") {
        e.preventDefault();
        go("contact");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, go]);

  // Touch navigation
  useEffect(() => {
    const onStart = (e: TouchEvent) => (touchStart.current = e.touches[0].clientY);
    const onEnd = (e: TouchEvent) => {
      const delta = touchStart.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 60) return;
      const scroller = (e.target as HTMLElement)?.closest("[data-scene-scroll]");
      if (scroller) {
        const el = scroller as HTMLElement;
        const atTop = el.scrollTop <= 0;
        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
        if (!((atBottom && delta > 0) || (atTop && delta < 0))) return;
      }
      if (delta > 0) next();
      else prev();
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [next, prev]);

  // Deep-link: land on the scene named in the URL hash (e.g. /#work)
  useEffect(() => {
    const h = window.location.hash.replace("#", "");
    const idx = SCENES.findIndex((s) => s.id === h);
    if (idx > 0) setIndex(idx);
  }, []);

  // Reflect the current scene in the URL hash
  useEffect(() => {
    const id = SCENES[index].id;
    const url = id === "hero" ? window.location.pathname : `#${id}`;
    window.history.replaceState(null, "", url);
  }, [index]);

  // Per-scene analytics (Pro-only, currently DISABLED): the home page is one
  // path (`/`) with hash-based scenes, which Vercel Analytics can't distinguish
  // on its own. A custom event per scene change would surface views per scene —
  // but custom events require a Vercel Pro plan, so they're silently dropped on
  // the free Hobby tier. To re-enable on Pro: uncomment the `track` import above
  // and the effect below (it renders nothing — pure beacon, no UI impact).
  // useEffect(() => {
  //   track("scene_view", { scene: SCENES[index].id });
  // }, [index]);

  const current = SCENES[index];
  const SceneComp = SCENE_COMPONENTS[current.id];
  const origin = originFor(dir);

  return (
    <SceneCtx.Provider
      value={{ index, id: current.id, transitioning, go, next, prev }}
    >
      <div className="fixed inset-0 overflow-hidden bg-background">
        <AnimatePresence initial={false} custom={{ dir, origin }}>
          <motion.div
            key={current.id}
            custom={{ dir, origin }}
            className="absolute inset-0"
            style={{ willChange: "clip-path, transform, opacity" }}
            initial={
              reduce
                ? { opacity: 0 }
                : { clipPath: `circle(0% at ${origin})` }
            }
            animate={
              reduce
                ? { opacity: 1, transition: { duration: 0.4 } }
                : {
                    clipPath: `circle(150% at ${origin})`,
                    transition: { duration: DURATION, ease: [0.83, 0, 0.17, 1] },
                  }
            }
            exit={
              reduce
                ? { opacity: 0, transition: { duration: 0.3 } }
                : {
                    scale: 0.86,
                    opacity: 0,
                    filter: "blur(10px)",
                    transition: { duration: DURATION * 0.85, ease: [0.83, 0, 0.17, 1] },
                  }
            }
          >
            {/* golf-hole rim flash */}
            {!reduce && (
              <motion.span
                aria-hidden
                className="pointer-events-none absolute z-20 rounded-full border border-white/70"
                style={{
                  left: origin.split(" ")[0],
                  top: origin.split(" ")[1],
                  width: "40vmax",
                  height: "40vmax",
                  x: "-50%",
                  y: "-50%",
                }}
                initial={{ scale: 0, opacity: 0.85 }}
                animate={{ scale: 4, opacity: 0 }}
                transition={{ duration: DURATION, ease: [0.83, 0, 0.17, 1] }}
              />
            )}
            <SceneComp />
          </motion.div>
        </AnimatePresence>

        <SceneNav />
      </div>
    </SceneCtx.Provider>
  );
}
