import { BookStack } from "iconoir-react/regular";
import { SERIES_ITEMS } from "#/shared/constant/series-itmes";

interface SeriesLabelProps {
  series: string;
}

export function SeriesLabel({ series }: SeriesLabelProps) {
  return (
    <span className="flex cursor-default items-center gap-x-1 rounded-lg bg-linear-to-tr from-blue-200 to-cyan-200 px-2.5 py-0.5 text-xs dark:bg-linear-to-br dark:from-slate-500 dark:to-slate-800">
      <BookStack className="size-4" />
      {SERIES_ITEMS.find((item) => item.id === series)?.title}
    </span>
  );
}
