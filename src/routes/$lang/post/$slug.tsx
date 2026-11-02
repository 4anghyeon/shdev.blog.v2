import {
  ClientOnly,
  createFileRoute,
  notFound,
  redirect,
} from "@tanstack/react-router";
import { allPosts } from "content-collections";
import { EditPencil } from "iconoir-react/regular";
import { Suspense, useEffect } from "react";
import type { BlogPosting, BreadcrumbList } from "schema-dts";
import { z } from "zod";
import { PageContainer } from "#/composites/layout/PageContainer";
import { Markdown } from "#/features/markdown/components/Markdown";
import { AllListLink } from "#/features/post-detail/components/AllListLink";
import { Description } from "#/features/post-detail/components/Description";
import { GiscusComment } from "#/features/post-detail/components/GiscusComment";
import { PostEndSeal } from "#/features/post-detail/components/PostEndSeal";
import { PostNavigation } from "#/features/post-detail/components/PostNavigation";
import { References } from "#/features/post-detail/components/References";
import { RelatedPosts } from "#/features/post-detail/components/RelatedPosts";
import { SeriesListByPost } from "#/features/post-detail/components/SeriesListByPost";
import { TableOfContents } from "#/features/post-detail/components/TableOfContents";
import { usePostStore } from "#/features/post-detail/post-store";
import { ViewCount } from "#/features/post-views/components/ViewCount";
import { BrushBorder } from "#/shared/components/BrushBorder";
import { Tag } from "#/shared/components/Tag";
import { DEFAULT_LANG, isSupportedLang } from "#/shared/constant/lang";
import { BlogMeta } from "#/shared/constant/metadata";
import { dateHelper } from "#/shared/helper/date";
import { headHelper } from "#/shared/helper/head";

export const Route = createFileRoute("/$lang/post/$slug")({
  validateSearch: z.object({
    from: z.string().optional(),
  }),
  beforeLoad: ({ params, location }) => {
    if (!isSupportedLang(params.lang)) {
      throw redirect({
        href: location.pathname.replace(
          `/${params.lang}/`,
          `/${DEFAULT_LANG}/`,
        ),
        statusCode: 301,
      });
    }
  },
  loader: async ({ params }) => {
    const post = allPosts.find((p) => p.slug === params.slug);
    if (!post) {
      throw notFound();
    }

    const sortedPosts = allPosts.sort(
      (a, b) =>
        new Date(b.published).getTime() - new Date(a.published).getTime(),
    );
    const index = sortedPosts.findIndex((p) => p.slug === params.slug);

    const next =
      index > 0
        ? {
            slug: sortedPosts[index - 1].slug,
            title: sortedPosts[index - 1].title,
          }
        : null;

    const prev =
      index < sortedPosts.length - 1
        ? {
            slug: sortedPosts[index + 1].slug,
            title: sortedPosts[index + 1].title,
          }
        : null;

    const related = post.relatedSlugs.flatMap((relatedSlug) => {
      const relatedPost = allPosts.find((p) => p.slug === relatedSlug);
      return relatedPost
        ? [
            {
              slug: relatedPost.slug,
              title: relatedPost.title,
              description: relatedPost.description,
            },
          ]
        : [];
    });

    return {
      post,
      markup: post.markup,
      slug: post.slug,
      prev,
      next,
      related,
    };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData?.post) return {};

    const { post } = loaderData;

    const canonicalUrl = `${BlogMeta.baseUrl}${params.lang}/post/${post.slug}`;

    const author = headHelper.person();

    const blogPosting: BlogPosting = {
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      url: canonicalUrl,
      mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
      image: `${BlogMeta.baseUrl}images/main-og.webp`,
      inLanguage: "ko-KR",
      author,
      publisher: author,
      datePublished: post.published,
      dateModified: post.updated ?? post.published,
      keywords: post.tags?.join(","),
    };

    const breadcrumbList: BreadcrumbList = {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: BlogMeta.siteName,
          item: BlogMeta.baseUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: post.title,
          item: canonicalUrl,
        },
      ],
    };

    return {
      meta: [
        { title: post.title },
        { name: "description", content: post.description },
        { name: "author", content: BlogMeta.author.name },
        { name: "robots", content: "index, follow" },
        { property: "og:type", content: "article" },
        { property: "og:url", content: canonicalUrl },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.description },
        { property: "og:site_name", content: "shdev.blog" },
        { property: "og:locale", content: "ko_KR" },
        { property: "article:published_time", content: post.published },
        {
          property: "article:modified_time",
          content: post.updated ?? post.published,
        },
      ],
      links: [
        { rel: "canonical", href: canonicalUrl },
        { rel: "alternate", hrefLang: "x-default", href: canonicalUrl },
        { rel: "alternate", hrefLang: "ko-KR", href: canonicalUrl },
      ],
      scripts: [headHelper.jsonLd(blogPosting, breadcrumbList)],
    };
  },
  component: BlogPost,
});

function BlogPost() {
  const { post, markup, slug, prev, next, related } = Route.useLoaderData();
  const { lang } = Route.useParams();
  const setTitle = usePostStore((state) => state.setTitle);

  useEffect(() => {
    setTitle(post.title);

    return () => {
      setTitle("");
    };
  }, [post.title, setTitle]);

  return (
    <PageContainer width="article" className="lg:px-6">
      <article className="relative [anchor-name:--post]">
        <AllListLink className="mb-6" viewTransition />
        <BrushBorder
          as="header"
          side="bottom"
          className="mb-4 flex flex-col gap-y-4 pb-10 lg:mb-12"
        >
          <h1
            className="scroll-m-20 font-bold text-3xl leading-tight tracking-tight lg:text-4xl"
            style={{ viewTransitionName: `post-title-${slug}` }}
            data-pagefind-filter="lang[data-lang]"
            data-lang={lang}
          >
            {post.title}
          </h1>
          <Description>{post.description}</Description>
          <div
            className="flex flex-wrap items-center justify-between gap-2"
            data-pagefind-ignore="all"
          >
            <div className="flex gap-2">
              {post.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
            <div className="flex items-center gap-x-3">
              <ViewCount slug={slug} />
              <div className="flex items-center gap-x-1 text-ink-muted text-sm">
                <EditPencil aria-hidden className="size-4 shrink-0" />
                <span className="sr-only">마지막 수정일</span>
                <time dateTime={post.updated ? post.updated : post.published}>
                  {dateHelper.format(
                    post.updated ? post.updated : post.published,
                    "LOCAL",
                  )}
                </time>
              </div>
            </div>
          </div>
        </BrushBorder>
        <SeriesListByPost series={post.series} slug={post.slug} />
        <Markdown markup={markup} slug={slug} className="prose" />
        <References items={post.references} />
        <PostEndSeal key={slug} />
        <RelatedPosts posts={related} />
        <PostNavigation prev={prev} next={next} />
        <AllListLink className="mt-8" />
        <ClientOnly>
          <GiscusComment />
        </ClientOnly>
        <Suspense>
          <TableOfContents headings={post.headings} />
        </Suspense>
      </article>
    </PageContainer>
  );
}
