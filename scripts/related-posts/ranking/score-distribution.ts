import type { SimilarityPair } from "./similarity-pairs.ts";

// 글 쌍의 코사인 유사도 분포를 구해 기준값 조정에 쓴다.
export const scoreDistribution = (pairs: Array<SimilarityPair>) => {
  if (pairs.length === 0) return undefined;

  const scores = pairs
    .map(({ similarity }) => similarity)
    .sort((a, b) => a - b);
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
