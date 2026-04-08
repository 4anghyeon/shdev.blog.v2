import { createFileRoute, notFound } from "@tanstack/react-router";
import { Suspense } from "react";
import { Markdown } from "#/features/markdown/components/Markdown.tsx";
import { AllListLink } from "#/features/post-detail/components/AllListLink.tsx";
import { Description } from "#/features/post-detail/components/Description.tsx";
import { TableOfContents } from "#/features/post-detail/components/TableOfContents.tsx";
import { Tag } from "#/shared/components/Tag.tsx";
import { BASE_URL } from "#/shared/constant/base.ts";
import { dateHelper } from "#/shared/helper/date.ts";
import { allPosts } from "../../../../.content-collections/generated";

export const Route = createFileRoute("/ko/post/$slug")({
  loader: async ({ params }) => {
    const post = allPosts.find((p) => p.slug === params.slug);
    if (!post) {
      throw notFound();
    }
    return {
      post,
      markup: post.markup,
      slug: post.slug,
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.post) return {};

    const { post } = loaderData;

    const canonicalUrl = `${BASE_URL}ko/post/${post.slug}`;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      author: { "@type": "Person", name: "Lee SangHyeon" },
      datePublished: post.published,
      dateModified: post.updated ?? post.published,
      keywords: post.tags?.join(","),
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonicalUrl,
      },
    };

    return {
      meta: [
        { title: post.title },
        { name: "description", content: post.description },
        { name: "author", content: "sanghyeon" },
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
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(jsonLd),
        },
      ],
    };
  },
  component: BlogPost,
});

function BlogPost() {
  const { post, markup, slug } = Route.useLoaderData();

  return (
    <article className="relative mr-auto ml-auto w-full px-6 py-4 lg:my-5 lg:max-w-185">
      <AllListLink className="mb-6" viewTransition />
      <header className="mb-4 flex flex-col gap-y-4 border-gray-200 border-b pb-10 lg:mb-12">
        <h1
          className="scroll-m-20 font-bold text-3xl leading-tight tracking-tight lg:text-4xl"
          style={{ viewTransitionName: `post-title-${slug}` }}
        >
          {post.title}
        </h1>
        <Description>{post.description}</Description>
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex gap-2">
            {post.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
          <div className="flex items-center gap-x-1 text-gray-600 text-sm dark:text-gray-400">
            <span>마지막 수정일:</span>
            <time dateTime={post.updated ? post.updated : post.published}>
              {dateHelper.format(
                post.updated ? post.updated : post.published,
                "LOCAL",
              )}
            </time>
          </div>
        </div>
      </header>
      <Markdown markup={markup} slug={slug} className="prose" />
      <AllListLink className="mt-16" />
      <Suspense>
        <TableOfContents headings={post.headings} />
      </Suspense>
    </article>
  );
}
