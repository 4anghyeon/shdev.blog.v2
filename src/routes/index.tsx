import { createFileRoute } from "@tanstack/react-router";
import { allPosts } from "content-collections";
import { groupBy } from "es-toolkit/array";
import { PageContainer } from "#/composites/layout/PageContainer";
import { PostListItem } from "#/features/post-list/components/PostListItem";
import { YearNavigation } from "#/features/post-list/components/YearNavigation";
import { Badge } from "#/shared/components/Badge";
import { BlogMeta } from "#/shared/constant/metadata";
import { headHelper } from "#/shared/helper/head";

export const Route = createFileRoute("/")({
  head: () => ({
    links: [
      { rel: "canonical", href: BlogMeta.baseUrl },
      { rel: "alternate", hrefLang: "x-default", href: BlogMeta.baseUrl },
    ],
    scripts: [
      headHelper.jsonLd({
        "@type": "WebSite",
        name: BlogMeta.siteName,
        url: BlogMeta.baseUrl,
        description: BlogMeta.description,
        inLanguage: "ko-KR",
        author: headHelper.person(),
      }),
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
      <div
        style={{
          timelineScope: years.map((year) => `--year-${year}`).join(", "),
        }}
      >
        <YearNavigation years={years} />
        <div className="flex flex-col gap-y-12">
          {years.map((year) => (
            <section
              key={year}
              id={`year-${year}`}
              style={{ viewTimelineName: `--year-${year}` }}
              className="flex scroll-mt-(--year-line) flex-col gap-y-4 [--year-line:--spacing(28)] [view-timeline-inset:var(--year-line)_calc(100%-var(--year-line)-1px)] lg:[--year-line:--spacing(42)]"
            >
              <div className="flex items-center gap-x-2 pb-2">
                <h2 className="font-bold font-dokdo text-5xl text-ink-strong">
                  {year}
                </h2>
                <Badge>{postsByYear[year].length}개의 게시글</Badge>
              </div>
              <ul className="flex flex-col gap-y-4">
                {postsByYear[year].map((post, index) => (
                  <PostListItem
                    key={post.slug}
                    index={index}
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
      </div>
    </PageContainer>
  );
}
