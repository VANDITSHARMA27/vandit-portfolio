import type { Variants, Transition } from "motion/react";

/** Shared easing — expressive but controlled. */
export const easeOutExpo: Transition["ease"] = [0.16, 1, 0.3, 1];

/** Fade + rise, used for scroll-triggered reveals. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOutExpo },
  },
};

/** Container that staggers children on enter. */
export const staggerContainer = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

/** Child item for staggered lists. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOutExpo } },
};

/** Viewport config so reveals fire once, slightly before fully in view. */
export const inViewOnce = { once: true, margin: "0px 0px -12% 0px" } as const;
