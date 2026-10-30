import { cosineSimilarity } from "../utils/vector.ts";
import type { EmbeddedPost } from "./rank-related.ts";

// 같은 locale 글 쌍의 코사인 유사도 분포를 구해 기준값 조정에 쓴다.
export const scoreDistribution = (posts: Array<EmbeddedPost>) => {
  const scores: Array<number> = [];
  for (let i = 0; i < posts.length; i++) {
    for (let j = i + 1; j < posts.length; j++) {
      if (posts[i].locale !== posts[j].locale) continue;
      scores.push(cosineSimilarity(posts[i].vector, posts[j].vector));
    }
  }
  if (scores.length === 0) return undefined;

  scores.sort((a, b) => a - b);
  const at = (ratio: number) =>
    scores[Math.min(scores.length - 1, Math.floor(scores.length * ratio))];

  return {
    pairs: scores.length,
    min: scores[0],
    p50: at(0.5),
    p90: at(0.9),
    max: scores[scores.length - 1],
  };
};
