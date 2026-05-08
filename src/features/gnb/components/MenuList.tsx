import { isNil } from "es-toolkit";
import { motion } from "motion/react";
import { GlassWrapper } from "#/features/glass-effect/components/GlassWrapper.tsx";
import { MenuListItem } from "#/features/gnb/components/MenuListItem.tsx";
import { MENU_ITEMS } from "#/shared/constant/menu-items.ts";
import { cn } from "#/shared/lib/tailwind.ts";
import { useMenuBubble } from "../hooks/use-menu-bubble.ts";

export function MenuList() {
  const { bubbleMotionProps, itemRefs, activeIndex } = useMenuBubble();

  return (
    <GlassWrapper
      className={cn(
        "max-md:fixed max-md:bottom-6 max-md:left-1/2 max-md:-translate-x-1/2",
        {
          invisible: isNil(bubbleMotionProps),
        },
      )}
    >
      <ul className="relative flex gap-x-1 px-2 py-1.5 font-semibold text-sm">
        {bubbleMotionProps && (
          <motion.div
            className="pointer-events-none absolute z-0 rounded-xl bg-gray-100/20 shadow-[inset_1px_1px_0_rgba(255,255,255,0.6),inset_0_0_8px_rgba(156,163,175,0.3)] dark:bg-white/25 dark:shadow-[inset_1px_1px_0_rgba(255,255,255,0.75),inset_0_0_8px_rgba(255,255,255,0.4)]"
            initial={false}
            {...bubbleMotionProps}
          />
        )}
        {MENU_ITEMS.map((item, index) => (
          <MenuListItem
            key={item.label}
            index={index}
            isActive={activeIndex === index}
            to={item.to}
            subPath={"subPath" in item ? item.subPath : undefined}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
          >
            {item.label}
          </MenuListItem>
        ))}
      </ul>
    </GlassWrapper>
  );
}
