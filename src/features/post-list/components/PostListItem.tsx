import { BookStack } from "iconoir-react/regular";
import { Badge } from "#/shared/components/Badge";
import { Link } from "#/shared/components/Link";
import { Tag } from "#/shared/components/Tag";
import { DEFAULT_LANG } from "#/shared/constant/lang";
import { SERIES_ITEMS } from "#/shared/constant/series-itmes";
import { dateHelper } from "#/shared/helper/date";
import type { BlogPost } from "#/shared/schema/blog-post";

// brush.css의 --ink-blot-0 ~ 5와 개수를 맞춘다
const INK_BLOT_VARIANT_COUNT = 6;

interface PostListItemProps
  extends Pick<
    BlogPost,
    "slug" | "title" | "description" | "published" | "tags" | "series"
  > {
  index: number;
}

export function PostListItem({
  index,
  slug,
  title,
  description,
  published,
  tags,
  series,
}: PostListItemProps) {
  const seriesTitle = SERIES_ITEMS.find((item) => item.id === series)?.title;
  return (
    <li className="group scale-out">
      <Link
        to="/$lang/post/$slug"
        params={{ lang: DEFAULT_LANG, slug }}
        viewTransition
        data-ink-blot={index % INK_BLOT_VARIANT_COUNT}
        className="before:mask-ink-blot relative isolate flex flex-col gap-y-2 px-3 py-5 transition-transform duration-100 ease-in-out before:absolute before:-inset-x-4 before:-inset-y-4 before:-z-1 before:scale-[0.97] before:bg-paper-hover before:opacity-0 before:transition-[opacity,scale] before:duration-300 before:ease-out focus-visible:outline-none focus-visible:before:scale-100 focus-visible:before:opacity-70 active:scale-[0.97] group-hover:before:scale-100 group-hover:before:opacity-70 lg:before:-inset-x-8"
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
