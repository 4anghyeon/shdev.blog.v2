import { isNil } from "es-toolkit";
import { motion } from "motion/react";
import { GlassWrapper } from "#/features/glass-effect/components/GlassWrapper";
import glass from "#/features/glass-effect/glass-effect.module.css";
import { NavigationListItem } from "#/features/gnb/components/NavigationListItem";
import { useMenuBubble } from "#/features/gnb/hooks/use-menu-bubble";
import { MENU_ITEMS } from "#/shared/constant/menu-items";
import { cn } from "#/shared/lib/tailwind";

export function NavigationList() {
  const {
    bubbleMotionProps,
    bubbleTailMotionProps,
    itemRefs,
    activeIndex,
    isBubbleMoving,
  } = useMenuBubble();

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
          "relative flex gap-x-1 px-2 py-1.5 font-dokdo text-ink-strong text-xl leading-5 [text-shadow:0_0_3px_var(--background),0_0_8px_var(--background)]",
          {
            [glass.hoverDisabled]: isBubbleMoving,
          },
        )}
      >
        {bubbleMotionProps && (
          <motion.div
            className="pointer-events-none absolute z-0 rounded-xl bg-wash in-data-nacre-active:opacity-0 shadow-[inset_0_0_8px_var(--color-wash-edge)]"
            data-glass-highlight="head"
            initial={false}
            {...bubbleMotionProps}
          />
        )}
        {bubbleTailMotionProps && (
          <motion.div
            className="pointer-events-none invisible absolute"
            data-glass-highlight="tail"
            initial={false}
            {...bubbleTailMotionProps}
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
