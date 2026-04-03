import { createFileRoute, Link } from "@tanstack/react-router";
import { allPosts } from "../../.content-collections/generated";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const sortedPosts = allPosts.sort(
    (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime(),
  );

  return (
    <main className="px-4 pt-14 pb-8">
      <div>
        <h1>Blog</h1>
        <ul>
          {sortedPosts.map((post) => (
            <li key={post.slug}>
              <Link to="/ko/post/$slug" params={{ slug: post.slug }}>
                <h2>{post.title}</h2>
                <span>{post.published}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
