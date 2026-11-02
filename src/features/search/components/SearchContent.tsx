import type { RefObject } from "react";
import type { PopularPost } from "#/features/post-views/hooks/use-popular-posts";
import { SearchItemLink } from "#/features/search/components/SearchItemLink";
import type { PagefindResult } from "#/features/search/hooks/use-pagefind";
import { DEFAULT_LANG } from "#/shared/constant/lang";

interface SearchContentProps {
  search: string;
  results: PagefindResult[];
  popularPosts: PopularPost[];
  resultsRef: RefObject<HTMLDivElement | null>;
  onSelect: () => void;
  onResultKeyDown: (e: React.KeyboardEvent, index: number) => void;
}

/** 검색 결과를 보여주고, 결과가 없으면 안내 문구와 인기글을 보여준다. */
export function SearchContent({
  search,
  results,
  popularPosts,
  resultsRef,
  onSelect,
  onResultKeyDown,
}: SearchContentProps) {
  if (results.length > 0) {
    return (
      <div ref={resultsRef} className="space-y-1">
        {results.map((result, index) => (
          <SearchItemLink
            key={result.url}
            to={result.url}
            title={result.meta.title}
            onSelect={onSelect}
            onKeyDown={(e) => onResultKeyDown(e, index)}
          >
            <p
              className="mt-1 line-clamp-2 text-ink-muted text-sm [&_mark]:rounded-xs [&_mark]:bg-seal-highlight [&_mark]:px-0.5 [&_mark]:text-seal-highlight-foreground"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: <>
              dangerouslySetInnerHTML={{ __html: result.excerpt }}
            />
          </SearchItemLink>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="py-12 text-center text-ink-muted">
        {search === ""
          ? "검색어를 입력하세요..."
          : `"${search}"에 대한 결과가 없습니다`}
      </div>
      {popularPosts.length > 0 && (
        <section
          aria-labelledby="popular-posts-heading"
          className="border-line-subtle border-t pt-2"
        >
          <h2
            id="popular-posts-heading"
            className="px-3 pt-2 pb-1 font-semibold text-ink-faint text-xs tracking-wide"
          >
            많이 읽은 글
          </h2>
          <div ref={resultsRef} className="space-y-1">
            {popularPosts.map((post, index) => (
              <SearchItemLink
                key={post.slug}
                to={`/${DEFAULT_LANG}/post/${post.slug}`}
                title={post.title}
                size="compact"
                onSelect={onSelect}
                onKeyDown={(e) => onResultKeyDown(e, index)}
              >
                <p className="line-clamp-2 text-ink-muted text-sm">
                  {post.description}
                </p>
              </SearchItemLink>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
