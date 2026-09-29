import { NavArrowLeft, NavArrowRight } from "iconoir-react";
import { Link } from "#/shared/components/Link";
import { cn } from "#/shared/lib/tailwind";

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
      data-pagefind-ignore="all"
      className={cn(
        "mt-16 flex flex-col gap-4 border-line-subtle border-t pt-8 lg:flex-row",
        className,
      )}
    >
      {prev && <PostNavigationLink direction="prev" post={prev} />}
      {next && <PostNavigationLink direction="next" post={next} />}
    </nav>
  );
}

interface PostNavigationLinkProps {
  direction: "prev" | "next";
  post: PostNavigationItem;
}

function PostNavigationLink({ direction, post }: PostNavigationLinkProps) {
  const isNext = direction === "next";

  return (
    <Link
      to="/$lang/post/$slug"
      params={{ lang: "ko", slug: post.slug }}
      viewTransition
      className={cn(
        "group flex flex-col gap-1 rounded-xs border border-line-subtle p-4 text-sm transition-colors hover:border-line hover:bg-paper lg:w-1/2",
        { "items-end text-right lg:ml-auto": isNext },
      )}
    >
      <span className="flex items-center gap-1 text-ink-muted text-xs">
        {isNext ? (
          <>
            다음 글
            <NavArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </>
        ) : (
          <>
            <NavArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            이전 글
          </>
        )}
      </span>
      <span className="line-clamp-2 font-medium text-ink transition-colors group-hover:text-ink-strong">
        {post.title}
      </span>
    </Link>
  );
}
