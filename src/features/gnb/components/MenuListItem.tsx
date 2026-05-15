import { isEmpty } from "es-toolkit/compat";
import { AnimatePresence, motion } from "motion/react";
import type { ReactNode, Ref } from "react";
import { useActiveNavigation } from "#/features/gnb/hooks/use-active-navigation";
import { usePostStore } from "#/features/post-detail/post-store";
import { Link, type LinkProps } from "#/shared/components/Link";
import { cn } from "#/shared/lib/tailwind";
import { TitleTicker } from "./TitleTicker";

interface MenuListItemProps extends Omit<LinkProps, "ref"> {
  index: number;
  isActive: boolean;
  ref?: Ref<HTMLLIElement>;
  children?: ReactNode;
}

export function MenuListItem({
  to,
  children,
  index,
  isActive,
  ref,
}: MenuListItemProps) {
  const title = usePostStore((state) => state.title);
  const { activeIndex } = useActiveNavigation();
  const showTicker = activeIndex === index && !isEmpty(title);

  return (
    <>
      <li
        ref={ref}
        className={cn("glass-item px-2 py-1", {
          "text-shadow-sm text-sky-600 dark:text-gray-300 dark:shadow-gray-100":
            isActive,
        })}
        data-index={index}
      >
        <Link to={to}>{children}</Link>
      </li>
      <AnimatePresence>
        {showTicker && (
          <motion.li
            key="title-sep"
            className="flex items-center text-gray-400 dark:text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            ›
          </motion.li>
        )}
        {showTicker && <TitleTicker key="title-ticker" title={title} />}
      </AnimatePresence>
    </>
  );
}
