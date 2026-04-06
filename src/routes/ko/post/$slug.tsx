import { createFileRoute, notFound } from "@tanstack/react-router";
import { Markdown } from "#/features/markdown/components/Markdown.tsx";
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
    <article>
      <header>
        <h1>{post.title}</h1>
      </header>
      <Markdown markup={markup} slug={slug} className="prose" />
    </article>
  );
}
