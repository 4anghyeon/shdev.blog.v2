import { isNil } from "es-toolkit";
import { getPostsBySeries } from "#/features/series/helper";
import { Link } from "#/shared/components/Link";
import { SERIES_ITEMS, type SeriesKey } from "#/shared/constant/series-itmes";

interface SeriesListProps {
  slug: string;
  series?: SeriesKey;
}

export function SeriesListByPost({ slug, series }: SeriesListProps) {
  if (isNil(series)) {
    return null;
  }

  const postsBySeries = getPostsBySeries();
  const seriesPosts = postsBySeries[series];

  if (isNil(seriesPosts)) {
    return null;
  }

  const seriesMeta = SERIES_ITEMS.find((item) => item.id === series);
  const imageUrl = seriesMeta?.image;
  const title = seriesMeta?.title;
  const description = seriesMeta?.desc;

  return (
    <div className="mb-14 grid gap-y-4 divide-gray-300 rounded-lg border border-gray-300 p-4 dark:border-stone-500">
      <div className="flex items-center gap-x-4">
        <img
          className="size-16 shrink-0 rounded-full border border-gray-300 object-cover dark:border-stone-500"
          src={imageUrl}
          alt={`${title} cover`}
        />
        <div className="flex flex-col">
          <h2 className="font-semibold text-lg">{title}</h2>
          <p className="text-gray-600 text-sm dark:text-gray-300">
            {description}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-y-4 overflow-y-auto">
        {seriesPosts
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
              className="flex items-center justify-between text-sm hover:font-bold hover:text-sky-400 data-selected:font-bold data-selected:text-sky-400"
              data-selected={post.slug === slug ? true : null}
            >
              <div className="flex min-w-0 items-center gap-x-3">
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
