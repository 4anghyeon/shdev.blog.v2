import type { Transition } from "motion";

export const TICKER_SPEED_PX_PER_S = 20;
export const TICKER_MAX_WIDTH_PX = 200;
export const TICKER_DURATION_S = 0.2;
export const TICKER_EXIT_DELAY_MS = TICKER_DURATION_S * 1000 + 20;

export const tickerTransition = {
  duration: TICKER_DURATION_S,
  ease: "easeInOut",
} as const;

export const bubblePositionTransition: Transition = {
  x: { type: "spring", stiffness: 380, damping: 30, mass: 0.7 },
  y: { duration: 0 },
  width: { duration: 0 },
  height: { duration: 0 },
};

const bubbleTailSpring = {
  type: "spring",
  stiffness: 45,
  damping: 11,
  mass: 1,
} as const;

export const bubbleTailTransition: Transition = {
  x: bubbleTailSpring,
  width: bubbleTailSpring,
  y: { duration: 0 },
  height: { duration: 0 },
};
