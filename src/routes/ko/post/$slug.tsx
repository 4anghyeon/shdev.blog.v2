import { createFileRoute, notFound, useParams } from "@tanstack/react-router";
import { Markdown } from "#/features/markdown/components/Markdown.tsx";
import { renderMarkdown } from "#/features/markdown/utils/render-markdown.ts";
import { allPosts } from "../../../../.content-collections/generated";

export const Route = createFileRoute("/ko/post/$slug")({
  loader: async ({ params }) => {
    const post = allPosts.find((p) => p.slug === params.slug);
    if (!post) {
      throw notFound();
    }
    const result = await renderMarkdown(post.content);
    return {
      post,
      markup: result.markup,
    };
  },
  component: BlogPost,
});

function BlogPost() {
  const { slug } = useParams({ from: "/ko/post/$slug" });
  const { post, markup } = Route.useLoaderData();

  return (
    <article>
      <header>
        <h1>{post.title}</h1>
      </header>
      <Markdown markup={markup} slug={slug} className="prose" />
    </article>
  );
}
