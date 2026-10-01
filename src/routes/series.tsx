import { createFileRoute } from "@tanstack/react-router";
import { PageContainer } from "#/composites/layout/PageContainer";
import { SeriesListItem } from "#/features/series/components/SeriesListItem";
import { getPostsBySeries } from "#/features/series/helper";
import { BrushBorder } from "#/shared/components/BrushBorder";
import { SERIES_ITEMS } from "#/shared/constant/series-itmes";

export const Route = createFileRoute("/series")({
  component: RouteComponent,
});

function RouteComponent() {
  const postsBySeries = getPostsBySeries();

  return (
    <PageContainer width="wide">
      <BrushBorder side="bottom" className="mb-10 flex flex-col gap-y-4 pb-5">
        <h1 className="font-bold font-dokdo text-5xl text-ink-strong">
          시리즈
        </h1>
        <p className="text-ink">
          지금까지의 경험과 탐구의 과정들이 자연스럽게 이어질 수 있도록 구성한
          기록 모음입니다.
        </p>
      </BrushBorder>
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
    </PageContainer>
  );
}
