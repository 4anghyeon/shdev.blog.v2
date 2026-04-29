import { motion } from "motion/react";
import { GlassWrapper } from "#/features/glass-effect/components/GlassWrapper.tsx";
import { MenuListItem } from "#/features/gnb/components/MenuListItem.tsx";
import { MENU_ITEMS } from "#/shared/constant/menu-items.ts";
import { useMenuBubble } from "../hooks/use-menu-bubble.ts";

export function MenuList() {
  const { bubbleMotionProps, itemRefs, activeIndex } = useMenuBubble();

  return (
    <GlassWrapper className="max-md:fixed max-md:bottom-6 max-md:left-1/2 max-md:-translate-x-1/2">
      <ul className="relative flex gap-x-1 px-2 py-1.5 font-semibold text-sm">
        {bubbleMotionProps && (
          <motion.div
            className="pointer-events-none absolute z-0 rounded-xl bg-white/30 shadow-[inset_1px_1px_0_rgba(255,255,255,0.75),inset_0_0_8px_rgba(255,255,255,0.4)]"
            initial={false}
            {...bubbleMotionProps}
          />
        )}
        {MENU_ITEMS.map((item) => (
          <MenuListItem
            key={item.index}
            index={item.index}
            isActive={activeIndex === item.index}
            to={item.to}
            ref={(el) => {
              itemRefs.current[item.index] = el;
            }}
          >
            {item.label}
          </MenuListItem>
        ))}
      </ul>
    </GlassWrapper>
  );
}
