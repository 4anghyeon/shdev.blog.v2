import path from "node:path";
import { parseArgs } from "node:util";
import { mapValues } from "es-toolkit";
import { EMBEDDING, PATHS } from "./config.ts";
import { embedPost } from "./embedding/embed-post.ts";
import {
  type EmbeddingCache,
  hashPost,
  loadCache,
  saveCache,
} from "./embedding/embedding-cache.ts";
import { loadPosts, type PostSource } from "./post/load-posts.ts";
import { centerPosts } from "./ranking/center-posts.ts";
import { type EmbeddedPost, rankRelated } from "./ranking/rank-related.ts";
import { scoreDistribution } from "./ranking/score-distribution.ts";
import {
  buildSimilarityPairs,
  type SimilarityPair,
} from "./ranking/similarity-pairs.ts";
import { sortKeys, writeTextFile } from "./utils/file.ts";

interface Options {
  all: boolean;
  only: Array<string>;
}

// 옵션에 따라 이번 실행에서 임베딩할 글과, 바뀌었지만 건너뛸 글을 나눈다.
const selectTargets = (
  posts: Array<PostSource>,
  cache: EmbeddingCache,
  { all, only }: Options,
) => {
  const onlySlugs = new Set(only);
  const targets = posts.filter(
    (post) => all || !cache.posts[post.key] || onlySlugs.has(post.slug),
  );
  const targetKeys = new Set(targets.map((post) => post.key));
  const stale = posts.filter(
    (post) =>
      !targetKeys.has(post.key) &&
      cache.posts[post.key]?.hash !== hashPost(post),
  );
  return { targets, stale };
};

const embedTargets = async (
  targets: Array<PostSource>,
  cache: EmbeddingCache,
) => {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    throw new Error("NVIDIA_API_KEY가 없습니다. .env에 추가하세요.");
  }

  console.info(`임베딩 대상 ${targets.length}개`);
  for (const [i, post] of targets.entries()) {
    console.info(`  [${i + 1}/${targets.length}] ${post.key}`);
    cache.posts[post.key] = {
      hash: hashPost(post),
      vector: await embedPost(apiKey, post),
    };
    // 중간에 요청 제한으로 실패해도 앞서 받은 벡터는 다시 요청하지 않도록 바로 저장한다.
    await saveCache(cache);
  }
};

const printDistribution = (pairs: Array<SimilarityPair>) => {
  const distribution = scoreDistribution(pairs);
  if (!distribution) return;

  const format = (value: number) => value.toFixed(3);
  console.info(
    `글 쌍 코사인 유사도 분포 (${distribution.pairs}쌍): ` +
      `min ${format(distribution.min)} / p50 ${format(distribution.p50)} / ` +
      `p90 ${format(distribution.p90)} / max ${format(distribution.max)}`,
  );
};

const main = async () => {
  const { values } = parseArgs({
    options: {
      all: { type: "boolean", default: false },
      only: { type: "string", multiple: true, default: [] },
    },
  });

  const posts = await loadPosts();
  const cache = await loadCache();

  if (cache.model !== EMBEDDING.model && !values.all) {
    throw new Error(
      `캐시 모델(${cache.model})이 현재 모델(${EMBEDDING.model})과 다릅니다. --all로 다시 생성하세요.`,
    );
  }

  const postSlugs = new Set(posts.map((post) => post.slug));
  const unknownSlugs = values.only.filter((slug) => !postSlugs.has(slug));
  if (unknownSlugs.length > 0) {
    throw new Error(`존재하지 않는 글: ${unknownSlugs.join(", ")}`);
  }

  const { targets, stale } = selectTargets(posts, cache, values);
  if (targets.length > 0) {
    await embedTargets(targets, cache);
  } else {
    console.info("새로 임베딩할 글이 없습니다.");
  }

  const postKeys = new Set(posts.map((post) => post.key));
  cache.model = EMBEDDING.model;
  cache.posts = sortKeys(
    Object.fromEntries(
      Object.entries(cache.posts).filter(([key]) => postKeys.has(key)),
    ),
  );
  await saveCache(cache);

  const embedded: Array<EmbeddedPost> = posts.map((post) => ({
    key: post.key,
    locale: post.locale,
    slug: post.slug,
    tags: post.tags,
    vector: cache.posts[post.key].vector,
  }));
  const centered = centerPosts(embedded);
  const pairs = buildSimilarityPairs(centered);
  const related = sortKeys(mapValues(rankRelated(centered, pairs), sortKeys));
  await writeTextFile(PATHS.output, `${JSON.stringify(related, null, 2)}\n`);

  printDistribution(pairs);
  console.info(`연관글 결과 저장: ${path.relative(PATHS.root, PATHS.output)}`);

  if (stale.length > 0) {
    console.warn(
      `내용이 바뀐 글 ${stale.length}개 (갱신하려면 --only <slug>): ` +
        stale.map((post) => post.slug).join(", "),
    );
  }
};

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
