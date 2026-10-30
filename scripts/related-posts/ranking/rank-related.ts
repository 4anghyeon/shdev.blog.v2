import { intersection, orderBy, union } from "es-toolkit";
import { RANKING } from "../config.ts";
import { cosineSimilarity, type Vector } from "../utils/vector.ts";

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

// 같은 locale 안에서 점수가 높은 글을 글마다 topK개까지 고른다.
export const rankRelated = (
  posts: Array<EmbeddedPost>,
  {
    topK = RANKING.topK,
    minScore = RANKING.minScore,
  }: { topK?: number; minScore?: number } = {},
): RelatedPostsByLocale => {
  const result: RelatedPostsByLocale = {};

  for (const post of posts) {
    const candidates = posts
      .filter((other) => other.key !== post.key && other.locale === post.locale)
      .map((other) => ({
        slug: other.slug,
        score:
          cosineSimilarity(post.vector, other.vector) +
          tagJaccard(post.tags, other.tags) * RANKING.tagWeight,
      }))
      .filter(({ score }) => score >= minScore);

    result[post.locale] ??= {};
    result[post.locale][post.slug] = orderBy(candidates, ["score"], ["desc"])
      .slice(0, topK)
      .map(({ slug, score }) => ({ slug, score: Number(score.toFixed(4)) }));
  }

  return result;
};
