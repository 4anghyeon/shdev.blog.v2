import { chunk } from "es-toolkit";
import { EMBEDDING } from "../config.ts";
import type { PostSource } from "../post/load-posts.ts";
import { buildMetaText, chunkPost } from "../post/post-text.ts";
import {
  normalize,
  roundVector,
  type Vector,
  weightedSum,
} from "../utils/vector.ts";
import { requestEmbeddings } from "./request-embeddings.ts";

// 청크 벡터를 길이 가중 평균한 본문 벡터와 메타 벡터를 섞어 글 대표 벡터를 만든다.
export const combineVectors = (
  metaVector: Vector,
  chunks: Array<{ vector: Vector; weight: number }>,
): Vector => {
  const meta = normalize(metaVector);
  if (chunks.length === 0) return meta;

  const body = normalize(weightedSum(chunks));
  return normalize(
    weightedSum([
      { vector: body, weight: 1 - EMBEDDING.metaWeight },
      { vector: meta, weight: EMBEDDING.metaWeight },
    ]),
  );
};

// 메타 텍스트와 본문 청크를 임베딩해 글 하나의 대표 벡터를 돌려준다.
export const embedPost = async (
  apiKey: string,
  post: PostSource,
): Promise<Vector> => {
  const chunks = chunkPost(post.title, post.body);
  const inputs = [buildMetaText(post), ...chunks];
  const vectors: Array<Vector> = [];

  for (const batch of chunk(inputs, EMBEDDING.batchSize)) {
    vectors.push(...(await requestEmbeddings(apiKey, batch)));
  }

  const [metaVector, ...chunkVectors] = vectors;
  const vector = combineVectors(
    metaVector,
    chunkVectors.map((chunkVector, i) => ({
      vector: chunkVector,
      weight: chunks[i].length,
    })),
  );

  return roundVector(vector, EMBEDDING.vectorPrecision);
};
