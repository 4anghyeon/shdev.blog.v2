import { useLocation } from "@tanstack/react-router";
import { useLayoutEffect, useRef, useState } from "react";
import { MENU_ITEMS } from "#/shared/constant/menu-items.ts";

export type BubbleRect = { x: number; y: number; width: number; height: number };

function getActiveIndex(pathname: string): number {
  return MENU_ITEMS.findIndex((item) => {
    if ("subPath" in item && pathname.startsWith(item.subPath)) return true;
    return item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
  });
}

export function useMenuBubble() {
  const { pathname } = useLocation();
  const activeIndex = getActiveIndex(pathname);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [bubble, setBubble] = useState<BubbleRect | null>(null);

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

  return { bubble, itemRefs, activeIndex };
}
