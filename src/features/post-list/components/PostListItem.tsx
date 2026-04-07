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
    <li className="group">
      <Link
        to="/ko/post/$slug"
        params={{ slug }}
        viewTransition
        className="flex flex-col gap-y-2 rounded-lg border border-gray-100 px-3 py-5 no-underline transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-900"
      >
        <h2
          className="font-semibold text-gray-900 text-lg leading-snug group-hover:text-blue-500 dark:text-gray-100 dark:group-hover:text-blue-400"
          style={{ viewTransitionName: `post-title-${slug}` }}
        >
          {title}
        </h2>
        <p className="line-clamp-2 text-gray-500 text-sm dark:text-gray-400">
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
            className="shrink-0 text-gray-400 text-xs dark:text-gray-500"
          >
            {dateHelper.format(published, "LOCAL")}
          </time>
        </div>
      </Link>
    </li>
  );
}
