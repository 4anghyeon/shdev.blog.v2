import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

export const PATHS = {
  root: ROOT_DIR,
  posts: path.join(ROOT_DIR, "posts"),
  cache: path.join(ROOT_DIR, ".cache/related-posts/embeddings.json"),
  output: path.join(ROOT_DIR, ".cache/related-posts/related-posts.gen.json"),
} as const;

export const EMBEDDING = {
  apiUrl: "https://integrate.api.nvidia.com/v1/embeddings",
  model: "nvidia/nemotron-3.5-embed-1b",
  // 긴 입력을 벡터 하나로 압축하면 주제가 흐려지므로 섹션보다 작은 단위로 잘라 임베딩한다.
  maxChunkChars: 500,
  batchSize: 32,
  // 무료 티어의 분당 요청 제한을 넘지 않도록 요청 사이에 간격을 둔다.
  requestIntervalMs: 1_600,
  maxRetries: 3,
  metaWeight: 0.25,
  vectorPrecision: 6,
} as const;

export const RANKING = {
  tagWeight: 0.05,
  minScore: 0.3,
  topK: 3,
} as const;
