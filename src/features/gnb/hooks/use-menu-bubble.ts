import { isEmpty } from "es-toolkit/compat";
import type { AnimationOptions, DOMKeyframesDefinition } from "motion";
import { useAnimate, useReducedMotion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { NACRE_ACTIVE_SELECTOR } from "#/features/glass-effect/helper/nacre-scene";
import {
  bubblePositionTransition,
  bubbleTailTransition,
  TICKER_EXIT_DELAY_MS,
} from "#/features/gnb/helper/gnb-animation";
import { useActiveNavigation } from "#/features/gnb/hooks/use-active-navigation";
import { usePostStore } from "#/features/post-detail/post-store";

type BubbleRect = { x: number; y: number; width: number; height: number };

const BUBBLE_SQUISH_KEYFRAMES: DOMKeyframesDefinition = {
  scaleX: [1, 0.55, 1],
  scaleY: [1, 0.7, 1],
};
const BUBBLE_SQUISH_OPTIONS: AnimationOptions = {
  duration: 0.35,
  times: [0, 0.45, 1],
  ease: "easeInOut",
};

export function useMenuBubble() {
  const { activeIndex } = useActiveNavigation();
  const title = usePostStore((state) => state.title);
  const titleRef = useRef(title);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [bubble, setBubble] = useState<BubbleRect | null>(null);
  const [isBubbleMoving, setIsBubbleMoving] = useState(false);
  const [bubbleRef, animateBubble] = useAnimate<HTMLDivElement>();
  const isMountedRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    titleRef.current = title;
  }, [title]);

  useLayoutEffect(() => {
    const recalculate = () => {
      const el = itemRefs.current[activeIndex];
      if (!el) return;
      setBubble({
        x: el.offsetLeft,
        y: el.offsetTop,
        width: el.offsetWidth,
        height: el.offsetHeight,
      });
    };

    if (!isEmpty(titleRef.current)) {
      const id = setTimeout(recalculate, TICKER_EXIT_DELAY_MS);
      return () => clearTimeout(id);
    }

    recalculate();
  }, [activeIndex]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <bubble only>
  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }
    if (!bubbleRef.current) return;
    // WebGL 호리병 버블이 그려지는 중이면 DOM 버블 찌그러짐은 생략한다
    if (bubbleRef.current.closest(NACRE_ACTIVE_SELECTOR)) return;
    animateBubble(
      bubbleRef.current,
      BUBBLE_SQUISH_KEYFRAMES,
      BUBBLE_SQUISH_OPTIONS,
    );
  }, [bubble]);

  const bubbleAnimate = bubble && {
    x: bubble.x,
    y: bubble.y,
    width: bubble.width,
    height: bubble.height,
  };

  return {
    itemRefs,
    activeIndex,
    isBubbleMoving,
    bubbleMotionProps: bubbleAnimate
      ? {
          ref: bubbleRef,
          style: { top: 0, left: 0 },
          animate: bubbleAnimate,
          transition: bubblePositionTransition,
          onAnimationStart: () => setIsBubbleMoving(true),
          onAnimationComplete: () => setIsBubbleMoving(false),
        }
      : null,
    bubbleTailMotionProps: bubbleAnimate
      ? {
          style: { top: 0, left: 0 },
          animate: bubbleAnimate,
          transition: shouldReduceMotion
            ? bubblePositionTransition
            : bubbleTailTransition,
        }
      : null,
  };
}
