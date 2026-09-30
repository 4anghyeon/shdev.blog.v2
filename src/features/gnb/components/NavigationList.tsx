import { isNil } from "es-toolkit";
import { motion } from "motion/react";
import { GlassWrapper } from "#/features/glass-effect/components/GlassWrapper";
import { NavigationListItem } from "#/features/gnb/components/NavigationListItem";
import { useMenuBubble } from "#/features/gnb/hooks/use-menu-bubble";
import { MENU_ITEMS } from "#/shared/constant/menu-items";
import { cn } from "#/shared/lib/tailwind";

export function NavigationList() {
  const { bubbleMotionProps, itemRefs, activeIndex, isBubbleMoving } =
    useMenuBubble();

  return (
    <GlassWrapper
      variant="nacre"
      className={cn(
        "z-40 max-md:fixed max-md:bottom-6 max-md:left-1/2 max-md:-translate-x-1/2",
        {
          invisible: isNil(bubbleMotionProps),
        },
      )}
    >
      <ul
        className={cn(
          "relative flex gap-x-1 px-2 py-1.5 font-dokdo text-ink text-xl leading-5",
          {
            "glass-hover-disabled": isBubbleMoving,
          },
        )}
      >
        {bubbleMotionProps && (
          <motion.div
            className="pointer-events-none absolute z-0 rounded-xl bg-wash shadow-[inset_0_0_8px_var(--color-wash-edge)]"
            initial={false}
            {...bubbleMotionProps}
          />
        )}
        {MENU_ITEMS.map((item, index) => (
          <NavigationListItem
            key={item.label}
            index={index}
            isActive={activeIndex === index}
            to={item.to}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
          >
            {item.label}
          </NavigationListItem>
        ))}
      </ul>
    </GlassWrapper>
  );
}
