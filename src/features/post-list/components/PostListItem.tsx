import { Link } from "#/shared/components/Link.tsx";
import { Tag } from "#/shared/components/Tag.tsx";
import { dateHelper } from "#/shared/helper/date.ts";

interface PostListItemProps {
  slug: string;
  title: string;
  description: string;
  published: string;
  tags: string[];
}

export function PostListItem({
  slug,
  title,
  description,
  published,
  tags,
}: PostListItemProps) {
  return (
    <li className="group scale-out">
      <Link
        to="/ko/post/$slug"
        params={{ slug }}
        viewTransition
        className="dark:hover:stone-900 flex flex-col gap-y-2 rounded-lg px-3 py-5 no-underline transition-all duration-100 ease-in-out hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-sm focus-visible:-translate-y-0.5 focus-visible:bg-gray-50 focus-visible:shadow-sm focus-visible:outline-none active:translate-y-0 active:scale-[0.97] active:shadow-none dark:border-stone-600 dark:shadow-stone-600 dark:focus-visible:bg-stone-800 dark:hover:bg-stone-800"
      >
        <h2
          className="font-semibold text-gray-900 text-lg leading-snug dark:text-gray-100"
          style={{ viewTransitionName: `post-title-${slug}` }}
        >
          {title}
        </h2>
        <p className="line-clamp-2 text-gray-500 text-sm dark:text-gray-200">
          {description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
          <time
            dateTime={published}
            className="shrink-0 text-gray-400 text-xs dark:text-gray-400"
          >
            {dateHelper.format(published, "LOCAL")}
          </time>
        </div>
      </Link>
    </li>
  );
}
