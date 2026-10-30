import { intersection, orderBy, union } from "es-toolkit";
import { RANKING } from "../config.ts";
import type { Vector } from "../utils/vector.ts";
import type { SimilarityPair } from "./similarity-pairs.ts";

export interface EmbeddedPost {
  key: string;
  locale: string;
  slug: string;
  tags: Array<string>;
  vector: Vector;
}

export interface RelatedPost {
  slug: string;
  score: number;
}

export type RelatedPostsByLocale = Record<
  string,
  Record<string, Array<RelatedPost>>
>;

export const tagJaccard = (a: Array<string>, b: Array<string>): number => {
  const all = union(a, b);
  if (all.length === 0) return 0;
  return intersection(a, b).length / all.length;
};

// 쌍마다 한 번 계산한 점수를 양쪽 글의 후보에 넣고, 글마다 topK개까지 고른다.
export const rankRelated = (
  posts: Array<EmbeddedPost>,
  pairs: Array<SimilarityPair>,
  {
    topK = RANKING.topK,
    minScore = RANKING.minScore,
  }: { topK?: number; minScore?: number } = {},
): RelatedPostsByLocale => {
  const candidates = new Map<string, Array<RelatedPost>>(
    posts.map((post) => [post.key, []]),
  );

  for (const { a, b, similarity } of pairs) {
    const score = similarity + tagJaccard(a.tags, b.tags) * RANKING.tagWeight;
    if (score < minScore) continue;
    candidates.get(a.key)?.push({ slug: b.slug, score });
    candidates.get(b.key)?.push({ slug: a.slug, score });
  }

  const result: RelatedPostsByLocale = {};
  for (const post of posts) {
    result[post.locale] ??= {};
    result[post.locale][post.slug] = orderBy(
      candidates.get(post.key) ?? [],
      ["score"],
      ["desc"],
    )
      .slice(0, topK)
      .map(({ slug, score }) => ({ slug, score: Number(score.toFixed(4)) }));
  }

  return result;
};
