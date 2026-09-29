import { isNil } from "es-toolkit";
import { SeriesPostList } from "#/features/series/components/SeriesPostList";
import { getPostsBySeries } from "#/features/series/helper";
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
    <div className="hanji mb-14 grid gap-y-4 rounded-xs border border-line bg-paper p-4">
      <div className="flex items-center gap-x-4 border-line-subtle border-b pb-4">
        <img
          className="size-16 shrink-0 rounded-full border border-line object-cover"
          src={imageUrl}
          alt={`${title} cover`}
        />
        <div className="flex flex-col gap-y-1">
          <h2 className="font-semibold text-ink-strong text-lg">{title}</h2>
          <p className="text-ink-muted text-sm">{description}</p>
        </div>
      </div>
      <SeriesPostList posts={seriesPosts} currentSlug={slug} />
    </div>
  );
}
