import { createFileRoute } from "@tanstack/react-router";
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

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 pt-4 pb-8 lg:pt-14">
      <ul className="flex flex-col gap-y-4">
        {sortedPosts.map((post) => (
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
    </main>
  );
}
