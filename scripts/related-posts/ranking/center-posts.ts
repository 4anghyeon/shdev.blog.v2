import { groupBy, mapValues } from "es-toolkit";
import { meanVector, normalize, subtract } from "../utils/vector.ts";
import type { EmbeddedPost } from "./rank-related.ts";

// 모든 글이 공유하는 성분(평균 벡터)이 남아 있으면 평균에 가까운 글이 누구와도 가까워져
// 여기저기 추천되므로, locale마다 평균 벡터를 빼고 다시 정규화한다.
export const centerPosts = (
  posts: Array<EmbeddedPost>,
): Array<EmbeddedPost> => {
  const means = mapValues(
    groupBy(posts, (post) => post.locale),
    (group) => meanVector(group.map((post) => post.vector)),
  );

  return posts.map((post) => ({
    ...post,
    vector: normalize(subtract(post.vector, means[post.locale])),
  }));
};
