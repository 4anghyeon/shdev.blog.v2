import { Fragment } from "react";
import { BrushBorder } from "#/shared/components/BrushBorder";
import { Link } from "#/shared/components/Link";
import { DEFAULT_LANG } from "#/shared/constant/lang";
import type { BlogPost } from "#/shared/schema/blog-post";

type RelatedPostItem = Pick<BlogPost, "slug" | "title" | "description">;

interface RelatedPostsProps {
  posts: Array<RelatedPostItem>;
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16" data-pagefind-ignore="all" aria-label="연관 글">
      <h2 className="mb-3 font-semibold text-ink-strong text-lg">
        이 글이 흥미로웠다면?
      </h2>
      <p className="text-ink-muted text-sm leading-8">
        {posts.map((post, index) => (
          <Fragment key={post.slug}>
            {index > 0 && ", "}
            {index > 0 && index === posts.length - 1 && "그리고 "}
            <RelatedPostLink post={post} />
          </Fragment>
        ))}
        도 읽어보세요.
      </p>
    </section>
  );
}

interface RelatedPostLinkProps {
  post: RelatedPostItem;
}

function RelatedPostLink({ post }: RelatedPostLinkProps) {
  return (
    <BrushBorder
      as="span"
      className="inline-block leading-snug after:bg-seal-line after:transition-colors hover:after:bg-seal"
    >
      <Link
        to="/$lang/post/$slug"
        params={{ lang: DEFAULT_LANG, slug: post.slug }}
        viewTransition
        title={post.description}
        className="text-ink transition-colors hover:text-ink-strong"
      >
        “{post.title}”
      </Link>
    </BrushBorder>
  );
}
