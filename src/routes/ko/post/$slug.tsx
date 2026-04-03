import { createFileRoute, notFound } from "@tanstack/react-router";
import { Markdown } from "#/features/markdown/components/Markdown.tsx";
import { allPosts } from "../../../../.content-collections/generated";

export const Route = createFileRoute("/ko/post/$slug")({
  loader: ({ params }) => {
    const post = allPosts.find((p) => p.slug === params.slug);
    if (!post) {
      throw notFound();
    }
    return post;
  },
  component: BlogPost,
});

function BlogPost() {
  const post = Route.useLoaderData();

  return (
    <article>
      <header>
        <h1>{post.title}</h1>
      </header>
      <Markdown content={post.content} className="prose" />
    </article>
  );
}
