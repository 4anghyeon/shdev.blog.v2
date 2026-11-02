import { describe, expect, it } from "vitest";
import { cosineSimilarity, normalize } from "../utils/vector.ts";
import { centerPosts } from "./center-posts.ts";
import type { EmbeddedPost } from "./rank-related.ts";

const createPost = (
  slug: string,
  vector: Array<number>,
  locale = "ko",
): EmbeddedPost => ({
  key: `${locale}/${slug}`,
  locale,
  slug,
  tags: [],
  vector: normalize(vector),
});

describe("centerPosts", () => {
  it("removes the shared component so unrelated posts are no longer similar", () => {
    const [a, b] = centerPosts([
      createPost("a", [1, 1, 0]),
      createPost("b", [1, 0, 1]),
    ]);

    expect(cosineSimilarity(a.vector, b.vector)).toBeCloseTo(-1);
    expect(Math.hypot(...a.vector)).toBeCloseTo(1);
  });

  it("centers each locale with its own mean", () => {
    const ko = [createPost("ko-a", [1, 0]), createPost("ko-b", [0.6, 0.8])];
    const en = [
      createPost("en-a", [0, 1], "en"),
      createPost("en-b", [0.2, 1], "en"),
    ];

    expect(centerPosts([...ko, ...en]).slice(0, 2)).toEqual(centerPosts(ko));
  });
});
