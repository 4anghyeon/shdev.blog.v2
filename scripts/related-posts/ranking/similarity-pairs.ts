import { cosineSimilarity } from "../utils/vector.ts";
import type { EmbeddedPost } from "./rank-related.ts";

export interface SimilarityPair {
  a: EmbeddedPost;
  b: EmbeddedPost;
  similarity: number;
}

// 유사도는 대칭이므로 같은 locale 글 쌍마다 한 번씩만 계산한다.
export const buildSimilarityPairs = (
  posts: Array<EmbeddedPost>,
): Array<SimilarityPair> => {
  const pairs: Array<SimilarityPair> = [];

  for (let i = 0; i < posts.length; i++) {
    for (let j = i + 1; j < posts.length; j++) {
      const a = posts[i];
      const b = posts[j];
      if (a.locale !== b.locale) continue;
      pairs.push({ a, b, similarity: cosineSimilarity(a.vector, b.vector) });
    }
  }

  return pairs;
};
