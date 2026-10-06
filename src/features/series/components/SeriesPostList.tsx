import { Link } from "#/shared/components/Link";
import { DEFAULT_LANG } from "#/shared/constant/lang";
import { cn } from "#/shared/lib/tailwind";
import type { BlogPost } from "#/shared/schema/blog-post";

interface SeriesPostListProps {
  posts: Pick<BlogPost, "slug" | "title" | "published">[];
  currentSlug?: string;
  className?: string;
}

export function SeriesPostList({
  posts,
  currentSlug,
  className,
}: SeriesPostListProps) {
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(a.published).getTime() - new Date(b.published).getTime(),
  );

  return (
    <div className={cn("flex flex-col gap-y-3", className)}>
      {sortedPosts.map((post, index) => (
        <Link
          to="/$lang/post/$slug"
          params={{ lang: DEFAULT_LANG, slug: post.slug }}
          search={{
            from: "series",
          }}
          key={post.slug}
          className="group/item flex items-center justify-between gap-x-4 text-ink text-sm transition-colors hover:text-ink-strong aria-[current=page]:text-seal"
          aria-current={post.slug === currentSlug ? "page" : undefined}
        >
          <div className="flex min-w-0 items-center gap-x-3">
            <span className="font-semibold text-ink-faint tabular-nums group-aria-[current=page]/item:text-seal">
              {(index + 1).toString().padStart(2, "0")}
            </span>
            <span className="truncate">{post.title}</span>
          </div>
          <span className="w-20 shrink-0 text-ink-faint text-xs tabular-nums">
            {post.published}
          </span>
        </Link>
      ))}
    </div>
  );
}
