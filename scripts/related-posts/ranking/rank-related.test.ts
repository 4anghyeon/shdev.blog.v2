import { describe, expect, it } from "vitest";
import { normalize } from "../utils/vector.ts";
import { type EmbeddedPost, rankRelated, tagJaccard } from "./rank-related.ts";

const createPost = (
  slug: string,
  vector: Array<number>,
  tags: Array<string> = [],
  locale = "ko",
): EmbeddedPost => ({
  key: `${locale}/${slug}`,
  locale,
  slug,
  tags,
  vector: normalize(vector),
});

describe("tagJaccard", () => {
  it("computes shared tag ratio", () => {
    expect(tagJaccard(["a", "b"], ["b", "c"])).toBeCloseTo(1 / 3);
    expect(tagJaccard([], [])).toBe(0);
  });
});

describe("rankRelated", () => {
  it("excludes self and other locales, sorts by score", () => {
    const result = rankRelated(
      [
        createPost("a", [1, 0]),
        createPost("b", [0.9, 0.1]),
        createPost("c", [0.5, 0.5]),
        createPost("en-a", [1, 0], [], "en"),
      ],
      { topK: 2, minScore: 0 },
    );

    expect(result.ko.a.map(({ slug }) => slug)).toEqual(["b", "c"]);
    expect(result.en["en-a"]).toEqual([]);
  });

  it("filters out scores below threshold", () => {
    const result = rankRelated(
      [createPost("a", [1, 0]), createPost("b", [0, 1])],
      { minScore: 0.3 },
    );

    expect(result.ko.a).toEqual([]);
  });

  it("breaks ties with shared tags", () => {
    const result = rankRelated(
      [
        createPost("a", [1, 1], ["react"]),
        createPost("b", [1, 0]),
        createPost("c", [0, 1], ["react"]),
      ],
      { minScore: 0 },
    );

    expect(result.ko.a[0].slug).toBe("c");
  });
});
