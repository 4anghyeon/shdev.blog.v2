import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { GlassWrapper } from "#/features/glass-effect/components/GlassWrapper";
import glass from "#/features/glass-effect/glass-effect.module.css";
import { NavigationListItem } from "#/features/gnb/components/NavigationListItem";
import { useBubbleDrag } from "#/features/gnb/hooks/use-bubble-drag";
import { useMenuBubble } from "#/features/gnb/hooks/use-menu-bubble";
import { MENU_ITEMS } from "#/shared/constant/menu-items";
import { cn } from "#/shared/lib/tailwind";

export function NavigationList() {
  const {
    itemRefs,
    activeIndex,
    isReady,
    isBubbleMoving,
    bubbleRef,
    dragBubble,
    settleBubble,
    headStyle,
    tailStyle,
  } = useMenuBubble();
  const navigate = useNavigate();
  const dragHandlers = useBubbleDrag({
    itemRefs,
    onDrag: dragBubble,
    onRelease: (index) => {
      settleBubble(index);
      const item = MENU_ITEMS[index];
      if (item && index !== activeIndex) navigate({ to: item.to });
    },
  });

  return (
    <GlassWrapper
      variant="nacre"
      className={cn(
        "z-40 max-md:fixed max-md:bottom-6 max-md:left-1/2 max-md:w-max max-md:-translate-x-1/2",
        {
          invisible: !isReady,
        },
      )}
    >
      <ul
        {...dragHandlers}
        className={cn(
          "relative flex touch-none select-none gap-x-1 px-2 py-1.5 font-dokdo text-ink text-xl leading-5 [-webkit-touch-callout:none] [text-shadow:0_0_3px_var(--background),0_0_8px_var(--background)]",
          {
            [glass.hoverDisabled]: isBubbleMoving,
          },
        )}
      >
        <motion.div
          ref={bubbleRef}
          className="pointer-events-none absolute top-0 left-0 z-0 rounded-xl bg-wash in-data-nacre-active:opacity-0 shadow-[inset_0_0_8px_var(--color-wash-edge)]"
          data-glass-highlight="head"
          style={headStyle}
        />
        <motion.div
          className="pointer-events-none invisible absolute top-0 left-0"
          data-glass-highlight="tail"
          style={tailStyle}
        />
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
