import { BookStack } from "iconoir-react/regular";
import { Badge } from "#/shared/components/Badge";
import { Link } from "#/shared/components/Link";
import { Tag } from "#/shared/components/Tag";
import { SERIES_ITEMS } from "#/shared/constant/series-itmes";
import { dateHelper } from "#/shared/helper/date";
import type { BlogPost } from "#/shared/schema/blog-post";

export function PostListItem({
  slug,
  title,
  description,
  published,
  tags,
  series,
}: Pick<
  BlogPost,
  "slug" | "title" | "description" | "published" | "tags" | "series"
>) {
  const seriesTitle = SERIES_ITEMS.find((item) => item.id === series)?.title;
  return (
    <li className="group scale-out">
      <Link
        to="/$lang/post/$slug"
        params={{ lang: "ko", slug }}
        viewTransition
        className="flex flex-col gap-y-2 rounded-xs border border-transparent px-[calc(--spacing(3)-1px)] py-5 transition-[translate,scale,background-color,border-color] duration-100 ease-in-out focus-visible:-translate-y-0.5 focus-visible:border-line focus-visible:bg-paper focus-visible:outline-none active:translate-y-0 active:scale-[0.97] group-hover:-translate-y-0.5 group-hover:border-line-subtle group-hover:bg-paper"
      >
        <h2
          className="font-semibold text-ink-strong text-lg leading-6"
          style={{ viewTransitionName: `post-title-${slug}` }}
        >
          {title}
        </h2>
        <p className="line-clamp-2 text-ink-muted text-sm">{description}</p>
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex flex-wrap gap-1.5">
            {/* 시리즈 이름과 같은 태그가 있는 경우 표시 X */}
            {tags
              .filter((tag) => tag !== seriesTitle)
              .map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            {seriesTitle && (
              <Badge variant="series">
                <BookStack />
                {seriesTitle}
              </Badge>
            )}
          </div>
          <time
            dateTime={published}
            className="shrink-0 text-ink-faint text-xs tabular-nums"
          >
            {dateHelper.format(published, "LOCAL")}
          </time>
        </div>
      </Link>
    </li>
  );
}
