import { Journal } from "iconoir-react/regular";
import { Link } from "#/shared/components/Link";
import type { BlogPost } from "#/shared/schema/blog-post";

interface SeriesListItemProps {
  title: string;
  description: string;
  imageUrl: string;
  posts: BlogPost[];
}

export function SeriesListItem({
  title,
  description,
  imageUrl,
  posts,
}: SeriesListItemProps) {
  const postCount = posts.length;
  return (
    <div className="grid divide-gray-300 rounded-lg border border-gray-300 p-4 max-md:divide-y md:grid-cols-2 md:divide-x dark:divide-stone-500 dark:border-stone-500">
      <div className="flex items-center gap-x-5 max-md:pb-5 md:pr-5">
        <img
          className="size-24 shrink-0 rounded-full border border-gray-300 object-cover dark:border-stone-500"
          src={imageUrl}
          alt={`${title} cover`}
        />
        <div className="flex flex-col gap-y-2">
          <h2 className="font-semibold text-lg">{title}</h2>
          <p className="text-gray-600 text-sm dark:text-gray-300">
            {description}
          </p>
          <p className="mt-1 flex items-center gap-x-1 text-gray-600 text-sm dark:text-gray-300">
            <Journal className="size-4" />
            <span>{postCount}개의 글</span>
          </p>
        </div>
      </div>
      <div className="flex h-30 flex-col gap-y-4 overflow-y-auto max-md:pt-5 md:pl-5">
        {posts
          .sort(
            (a, b) =>
              new Date(a.published).getTime() - new Date(b.published).getTime(),
          )
          .map((post, index) => (
            <Link
              to="/$lang/post/$slug"
              params={{ lang: "ko", slug: post.slug }}
              search={{
                from: "series",
              }}
              key={post.title}
              className="flex items-center justify-between text-sm hover:font-bold hover:text-sky-400"
            >
              <div className="flex min-w-0 items-center gap-x-3 pr-4">
                <span className="font-semibold tabular-nums">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <span className="truncate">{post.title}</span>
              </div>
              <span className="w-20 shrink-0 text-gray-400 text-xs tabular-nums">
                {post.published}
              </span>
            </Link>
          ))}
      </div>
    </div>
  );
}
