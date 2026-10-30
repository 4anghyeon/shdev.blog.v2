import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { z } from "zod";
import { EMBEDDING, PATHS } from "../config.ts";
import type { PostSource } from "../post/load-posts.ts";
import { buildMetaText } from "../post/post-text.ts";
import { writeTextFile } from "../utils/file.ts";

const embeddingCacheSchema = z.object({
  model: z.string(),
  posts: z.record(
    z.string(),
    z.object({ hash: z.string(), vector: z.array(z.number()) }),
  ),
});

export type EmbeddingCache = z.infer<typeof embeddingCacheSchema>;

export const loadCache = async (): Promise<EmbeddingCache> => {
  if (!existsSync(PATHS.cache)) return { model: EMBEDDING.model, posts: {} };
  return embeddingCacheSchema.parse(
    JSON.parse(await readFile(PATHS.cache, "utf8")),
  );
};

// 글 하나가 한 줄이 되도록 직렬화해 새 글 추가 시 diff를 한 줄로 유지한다.
const serializeCache = (cache: EmbeddingCache): string => {
  const entries = Object.entries(cache.posts).map(
    ([key, entry]) => `    ${JSON.stringify(key)}: ${JSON.stringify(entry)}`,
  );
  return `{\n  "model": ${JSON.stringify(cache.model)},\n  "posts": {\n${entries.join(",\n")}\n  }\n}\n`;
};

export const saveCache = async (cache: EmbeddingCache) => {
  await writeTextFile(PATHS.cache, serializeCache(cache));
};

// 임베딩 결과에 영향을 주는 입력과 설정으로 해시를 만들어 내용 변경을 감지한다.
export const hashPost = (post: PostSource): string => {
  return createHash("sha256")
    .update(
      JSON.stringify([
        EMBEDDING.model,
        EMBEDDING.maxChunkChars,
        EMBEDDING.metaWeight,
      ]),
    )
    .update(buildMetaText(post))
    .update(post.body)
    .digest("hex");
};
