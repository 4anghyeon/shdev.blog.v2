import type {
  AnimationOptions,
  DOMKeyframesDefinition,
  Transition,
} from "motion";

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

export const BUBBLE_SQUISH_KEYFRAMES: DOMKeyframesDefinition = {
  scaleX: [1, 0.55, 1],
  scaleY: [1, 0.7, 1],
};
export const BUBBLE_SQUISH_OPTIONS: AnimationOptions = {
  duration: 0.35,
  times: [0, 0.45, 1],
  ease: "easeInOut",
};
