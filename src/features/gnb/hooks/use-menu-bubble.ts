import type { Transition } from "motion";
import { useAnimate } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useActiveNavigation } from "#/features/gnb/hooks/use-active-navigation";

type BubbleRect = { x: number; y: number; width: number; height: number };

const positionTransition: Transition = {
  x: { type: "spring", stiffness: 380, damping: 30, mass: 0.7 },
  y: { duration: 0 },
  width: { duration: 0 },
  height: { duration: 0 },
};

export function useMenuBubble() {
  const { activeIndex } = useActiveNavigation();
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [bubble, setBubble] = useState<BubbleRect | null>(null);
  const [bubbleRef, animateBubble] = useAnimate<HTMLDivElement>();
  const isMountedRef = useRef(false);

  useLayoutEffect(() => {
    const el = itemRefs.current[activeIndex];
    if (!el) return;
    setBubble({
      x: el.offsetLeft,
      y: el.offsetTop,
      width: el.offsetWidth,
      height: el.offsetHeight,
    });
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
      { scaleX: [1, 0.55, 1], scaleY: [1, 0.7, 1] },
      {
        duration: 0.35,
        times: [0, 0.45, 1],
        ease: "easeInOut",
      },
    );
  }, [bubble]);

  return {
    itemRefs,
    activeIndex,
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
          transition: positionTransition,
        }
      : null,
  };
}
