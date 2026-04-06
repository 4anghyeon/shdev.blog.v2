import { createFileRoute, notFound } from "@tanstack/react-router";
import { Markdown } from "#/features/markdown/components/Markdown.tsx";
import { Description } from "#/features/post-detail/components/Description.tsx";
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
  component: BlogPost,
});

function BlogPost() {
  const { post, markup, slug } = Route.useLoaderData();

  return (
    <article className="relative my-5 mr-auto ml-auto w-full max-w-[calc(100%-48px)] lg:max-w-[calc(100%-280px)]">
      <header className="mb-4 flex flex-col gap-y-4 border-gray-200 border-b pb-10 lg:mb-12">
        <h1 className="scroll-m-20 font-bold text-3xl tracking-tight lg:text-4xl">
          {post.title}
        </h1>
        <Description>{post.description}</Description>
      </header>
      <Markdown markup={markup} slug={slug} className="prose" />
    </article>
  );
}
