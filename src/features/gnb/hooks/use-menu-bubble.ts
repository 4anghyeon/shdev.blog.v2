import { isEmpty } from "es-toolkit/compat";
import type { AnimationOptions, DOMKeyframesDefinition } from "motion";
import {
  animate,
  useAnimate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { NACRE_ACTIVE_SELECTOR } from "#/features/glass-effect/helper/nacre-scene";
import {
  type BubbleRect,
  measureItem,
} from "#/features/gnb/helper/bubble-geometry";
import {
  bubbleHeadSpring,
  bubbleTailSpring,
  TICKER_EXIT_DELAY_MS,
} from "#/features/gnb/helper/gnb-animation";
import { useActiveNavigation } from "#/features/gnb/hooks/use-active-navigation";
import { usePostStore } from "#/features/post-detail/post-store";

const BUBBLE_SQUISH_KEYFRAMES: DOMKeyframesDefinition = {
  scaleX: [1, 0.55, 1],
  scaleY: [1, 0.7, 1],
};
const BUBBLE_SQUISH_OPTIONS: AnimationOptions = {
  duration: 0.35,
  times: [0, 0.45, 1],
  ease: "easeInOut",
};

/** 활성 메뉴를 따라가는 버블(head)과 늦게 따라오는 꼬리(tail)의 motion value를 관리한다. */
export const useMenuBubble = () => {
  const [isReady, setIsReady] = useState(false);
  const [isBubbleMoving, setIsBubbleMoving] = useState(false);
  const { activeIndex } = useActiveNavigation();
  const title = usePostStore((state) => state.title);
  const shouldReduceMotion = useReducedMotion();
  const [bubbleRef, animateBubble] = useAnimate<HTMLDivElement>();

  const headX = useMotionValue(0);
  const headY = useMotionValue(0);
  const headWidth = useMotionValue(0);
  const headHeight = useMotionValue(0);
  const springTailX = useSpring(headX, bubbleTailSpring);
  const springTailWidth = useSpring(headWidth, bubbleTailSpring);

  const titleRef = useRef(title);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const isPlacedRef = useRef(false);

  const squish = () => {
    if (!bubbleRef.current) return;
    // WebGL 호리병 버블이 그려지는 중이면 DOM 버블 찌그러짐은 생략한다
    if (bubbleRef.current.closest(NACRE_ACTIVE_SELECTOR)) return;
    animateBubble(
      bubbleRef.current,
      BUBBLE_SQUISH_KEYFRAMES,
      BUBBLE_SQUISH_OPTIONS,
    );
  };

  const setBubbleSize = (rect: BubbleRect) => {
    headY.set(rect.y);
    headHeight.set(rect.height);
    headWidth.set(rect.width);
  };

  const placeBubble = (rect: BubbleRect, isInstant: boolean) => {
    const isAlreadyPlaced =
      headX.get() === rect.x && headWidth.get() === rect.width;
    setBubbleSize(rect);

    if (isInstant) {
      headX.jump(rect.x);
      springTailX.jump(rect.x);
      springTailWidth.jump(rect.width);
      return;
    }
    if (isAlreadyPlaced && !headX.isAnimating()) {
      setIsBubbleMoving(false);
      return;
    }

    setIsBubbleMoving(true);
    animate(headX, rect.x, bubbleHeadSpring).then(() =>
      setIsBubbleMoving(false),
    );
    squish();
  };

  /** 끄는 동안 버블을 포인터 위치에 바로 붙인다. 꼬리는 스프링으로 뒤따른다. */
  const dragBubble = (rect: BubbleRect) => {
    setIsBubbleMoving(true);
    setBubbleSize(rect);
    headX.stop();
    headX.set(rect.x);
  };

  /** 끌기를 놓은 뒤 버블을 해당 항목 자리로 돌려보낸다. */
  const settleBubble = (index: number) => {
    const el = itemRefs.current[index];
    if (el) placeBubble(measureItem(el), false);
  };

  useLayoutEffect(() => {
    titleRef.current = title;
  }, [title]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <activeIndex only>
  useLayoutEffect(() => {
    const recalculate = () => {
      const el = itemRefs.current[activeIndex];
      if (!el) return;
      placeBubble(measureItem(el), !isPlacedRef.current);
      isPlacedRef.current = true;
      setIsReady(true);
    };

    if (!isEmpty(titleRef.current)) {
      const id = setTimeout(recalculate, TICKER_EXIT_DELAY_MS);
      return () => clearTimeout(id);
    }

    recalculate();
  }, [activeIndex]);

  return {
    itemRefs,
    activeIndex,
    isReady,
    isBubbleMoving,
    bubbleRef,
    dragBubble,
    settleBubble,
    headStyle: { x: headX, y: headY, width: headWidth, height: headHeight },
    tailStyle: {
      x: shouldReduceMotion ? headX : springTailX,
      y: headY,
      width: shouldReduceMotion ? headWidth : springTailWidth,
      height: headHeight,
    },
  };
};
