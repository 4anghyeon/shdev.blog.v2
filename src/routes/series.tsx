import { createFileRoute } from "@tanstack/react-router";
import { allPosts } from "content-collections";
import { groupBy } from "es-toolkit/array";
import { SeriesListItem } from "#/features/series/components/SeriesListItem";

export const Route = createFileRoute("/series")({
  component: RouteComponent,
});

function RouteComponent() {
  const allPostWithSeries = allPosts.filter((post) => post.series);
  const postsBySeries = groupBy(allPostWithSeries, (post) => post.series ?? "");

  const series = [
    {
      id: "multiparadigm-programming",
      title: "멀티패러다임 프로그래밍",
      desc: "멀티패러다임 프로그래밍 (유인동 저)을 읽고 개인적으로 정리한 글들을 묶은 시리즈입니다.",
      image: "/images/series/multiparadigm-programming.webp",
      posts: postsBySeries["multiparadigm-programming"] ?? [],
    },
  ];

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
      {series.map((item) => (
        <SeriesListItem
          key={item.id}
          title={item.title}
          description={item.desc}
          imageUrl={item.image}
          posts={item.posts}
        />
      ))}
    </main>
  );
}
