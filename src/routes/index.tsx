import { createFileRoute } from "@tanstack/react-router";
import { allPosts } from "content-collections";
import { groupBy } from "es-toolkit/array";
import { PageContainer } from "#/composites/layout/PageContainer";
import { PostListItem } from "#/features/post-list/components/PostListItem";
import { Badge } from "#/shared/components/Badge";
import { BlogMeta } from "#/shared/constant/metadata";

export const Route = createFileRoute("/")({
  head: () => ({
    links: [
      { rel: "canonical", href: BlogMeta.baseUrl },
      { rel: "alternate", hrefLang: "x-default", href: BlogMeta.baseUrl },
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
    <PageContainer width="list">
      <div className="flex flex-col gap-y-12">
        {years.map((year) => (
          <section key={year} className="flex flex-col gap-y-4">
            <div className="flex items-center gap-x-2 px-3 pb-2">
              <h2 className="font-bold font-dokdo text-5xl text-ink-strong">
                {year}
              </h2>
              <Badge>{postsByYear[year].length}개의 게시글</Badge>
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
                  series={post.series}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </PageContainer>
  );
}
