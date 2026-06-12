import { isEmpty } from "es-toolkit/compat";
import { useAnimate } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  BUBBLE_SQUISH_KEYFRAMES,
  BUBBLE_SQUISH_OPTIONS,
  bubblePositionTransition,
  TICKER_EXIT_DELAY_MS,
} from "#/features/gnb/gnb-animation";
import { useActiveNavigation } from "#/features/gnb/hooks/use-active-navigation";
import { usePostStore } from "#/features/post-detail/post-store";

type BubbleRect = { x: number; y: number; width: number; height: number };

export function useMenuBubble() {
  const { activeIndex } = useActiveNavigation();
  const title = usePostStore((state) => state.title);
  const titleRef = useRef(title);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [bubble, setBubble] = useState<BubbleRect | null>(null);
  const [isBubbleMoving, setIsBubbleMoving] = useState(false);
  const [bubbleRef, animateBubble] = useAnimate<HTMLDivElement>();
  const isMountedRef = useRef(false);

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
    animateBubble(
      bubbleRef.current,
      BUBBLE_SQUISH_KEYFRAMES,
      BUBBLE_SQUISH_OPTIONS,
    );
  }, [bubble]);

  return {
    itemRefs,
    activeIndex,
    isBubbleMoving,
    bubbleMotionProps: bubble
      ? {
          ref: bubbleRef,
          style: { top: 0, left: 0 },
          animate: {
            x: bubble.x,
            y: bubble.y,
            width: bubble.width,
            height: bubble.height,
          },
          transition: bubblePositionTransition,
          onAnimationStart: () => setIsBubbleMoving(true),
          onAnimationComplete: () => setIsBubbleMoving(false),
        }
      : null,
  };
}
