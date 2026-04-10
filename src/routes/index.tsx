import { createFileRoute } from "@tanstack/react-router";
import { groupBy } from "es-toolkit/array";
import { PostListItem } from "#/features/post-list/components/PostListItem.tsx";
import { BASE_URL } from "#/shared/constant/base.ts";
import { allPosts } from "../../.content-collections/generated";

export const Route = createFileRoute("/")({
  head: () => ({
    links: [
      { rel: "canonical", href: BASE_URL },
      { rel: "alternate", hrefLang: "x-default", href: BASE_URL },
    ],
  }),
  component: App,
});

function App() {
  const sortedPosts = allPosts.sort(
    (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime(),
  );

  const postsByYear = groupBy(sortedPosts, (post) =>
    new Date(post.published).getFullYear(),
  );

  const years = Object.keys(postsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 pt-4 pb-8 lg:pt-14">
      <div className="flex flex-col gap-y-12">
        {years.map((year) => (
          <section key={year} className="flex flex-col gap-y-4">
            <div className="flex items-center gap-x-2 pb-2">
              <h2 className="font-bold text-4xl text-gray-900 dark:text-gray-100">
                {year}
              </h2>
              <span className="rounded-md border border-gray-200 bg-gray-100 px-1 text-[12px] text-text-default dark:border-gray-600 dark:bg-gray-700/50">
                {postsByYear[year].length}개의 게시글
              </span>
            </div>
            <ul className="flex flex-col gap-y-4">
              {postsByYear[year].map((post) => (
                <PostListItem
                  key={post.slug}
                  slug={post.slug}
                  title={post.title}
                  description={post.description}
                  published={post.published}
                  tags={post.tags}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
