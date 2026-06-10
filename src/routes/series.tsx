import { createFileRoute } from "@tanstack/react-router";
import { SeriesListItem } from "#/features/series/components/SeriesListItem";
import { getPostsBySeries } from "#/features/series/helper";
import { SERIES_ITEMS } from "#/shared/constant/series-itmes";

export const Route = createFileRoute("/series")({
  component: RouteComponent,
});

function RouteComponent() {
  const postsBySeries = getPostsBySeries();

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 pt-0 pb-8 lg:pt-14">
      <div className="mb-10 flex flex-col gap-y-4 border-gray-200 border-b pb-5 dark:border-stone-500">
        <h1 className="font-bold text-4xl text-gray-900 dark:text-gray-100">
          시리즈
        </h1>
        <p className="text-gray-700 dark:text-gray-300">
          지금까지의 경험과 탐구의 과정들이 자연스럽게 이어질 수 있도록 구성한
          기록 모음입니다.
        </p>
      </div>
      <div className="flex flex-col gap-y-8">
        {SERIES_ITEMS.map((item) => (
          <SeriesListItem
            key={item.id}
            title={item.title}
            description={item.desc}
            imageUrl={item.image}
            posts={postsBySeries[item.id] ?? []}
          />
        ))}
      </div>
    </main>
  );
}
