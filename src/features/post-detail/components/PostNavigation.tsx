import { NavArrowLeft, NavArrowRight } from "iconoir-react";
import { Link } from "#/shared/components/Link.tsx";
import { cn } from "#/shared/lib/tailwind.ts";

interface PostNavigationItem {
  slug: string;
  title: string;
}

interface PostNavigationProps {
  prev: PostNavigationItem | null;
  next: PostNavigationItem | null;
  className?: string;
}

export function PostNavigation({ prev, next, className }: PostNavigationProps) {
  if (!prev && !next) return null;

  return (
    <nav
      className={cn(
        "mt-16 flex items-stretch justify-between gap-4 border-gray-200 border-t pt-8",
        className,
      )}
    >
      {prev ? (
        <Link
          to="/ko/post/$slug"
          params={{ slug: prev.slug }}
          viewTransition
          className="group flex w-1/2 flex-col gap-1 rounded-lg border border-gray-200 p-4 text-sm transition-colors hover:border-gray-400 dark:border-stone-700 dark:hover:border-stone-500"
        >
          <span className="flex items-center gap-1 text-gray-500 text-xs dark:text-gray-400">
            <NavArrowLeft className="size-3.5" />
            이전 글
          </span>
          <span className="line-clamp-2 font-medium text-gray-800 group-hover:text-gray-900 dark:text-gray-200 dark:group-hover:text-white">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          to="/ko/post/$slug"
          params={{ slug: next.slug }}
          viewTransition
          className="group ml-auto flex w-1/2 flex-col items-end gap-1 rounded-lg border border-gray-200 p-4 text-sm transition-colors hover:border-stone-400 dark:border-stone-700 dark:hover:border-stone-500"
        >
          <span className="flex items-center gap-1 text-gray-500 text-xs dark:text-gray-400">
            다음 글
            <NavArrowRight className="size-3.5" />
          </span>
          <span className="line-clamp-2 text-right font-medium text-gray-800 group-hover:text-gray-900 dark:text-gray-200 dark:group-hover:text-white">
            {next.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
