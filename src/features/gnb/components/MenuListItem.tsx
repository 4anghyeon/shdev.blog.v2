import { useRouterState } from "@tanstack/react-router";
import { isEmpty } from "es-toolkit/compat";
import { AnimatePresence, motion } from "motion/react";
import type * as React from "react";
import { usePostStore } from "#/features/post-detail/post-store";
import { Link, type LinkProps } from "#/shared/components/Link";
import { cn } from "#/shared/lib/tailwind";
import { TitleTicker } from "./TitleTicker";

interface MenuListItemProps extends Omit<LinkProps, "ref"> {
  index: number;
  isActive: boolean;
  subPath?: string;
  ref?: React.Ref<HTMLLIElement>;
  children?: React.ReactNode;
}

export function MenuListItem({
  to,
  children,
  index,
  isActive,
  subPath,
  ref,
}: MenuListItemProps) {
  const title = usePostStore((state) => state.title);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const showTicker =
    !!subPath && pathname.startsWith(subPath) && !isEmpty(title);

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
