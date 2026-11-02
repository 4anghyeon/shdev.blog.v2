import { createHash } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { getRequestIP, setResponseHeader } from "@tanstack/react-start/server";
import { allPosts } from "content-collections";
import { z } from "zod";
import { getRedis } from "#/shared/lib/redis";

const VIEWS_KEY = "views";
const DEDUPE_TTL_SECONDS = 60 * 60 * 24;
const VIEWS_CACHE_SECONDS = 60;
const POPULAR_POSTS_LIMIT = 3;

const hashIp = (ip: string) => {
  return createHash("sha256")
    .update(`${ip}${process.env.VIEW_HASH_SALT ?? ""}`)
    .digest("hex");
};

const slugInput = z.object({ slug: z.string().min(1) });

/** 같은 IP가 24시간 안에 처음 본 글이면 조회수를 1 올리고 올라간 조회수를 반환한다. 올리지 않았으면 `null`. */
export const incrementView = createServerFn({ method: "POST" })
  .validator(slugInput)
  .handler(async ({ data: { slug } }) => {
    const redis = getRedis();
    if (!redis) return null;

    // 조회수는 production에서만 증가시킨다
    const ip = getRequestIP({ xForwardedFor: true });
    if (process.env.VERCEL_ENV !== "production" || !ip) return null;

    const isFirstView = await redis.set(`view:${hashIp(ip)}:${slug}`, 1, {
      nx: true,
      ex: DEDUPE_TTL_SECONDS,
    });
    if (!isFirstView) return null;

    return redis.zincrby(VIEWS_KEY, 1, slug);
  });

/** 글의 현재 조회수를 반환한다. Redis가 없으면 `null`. */
export const getViews = createServerFn({ method: "GET" })
  .validator(slugInput)
  .handler(async ({ data: { slug } }) => {
    const redis = getRedis();
    if (!redis) return null;

    setResponseHeader(
      "Cache-Control",
      `public, s-maxage=${VIEWS_CACHE_SECONDS}, stale-while-revalidate=${VIEWS_CACHE_SECONDS}`,
    );

    return (await redis.zscore(VIEWS_KEY, slug)) ?? 0;
  });

/** 조회수가 많은 순으로 글의 slug, 제목, 설명을 반환한다. 삭제된 글은 건너뛴다. Redis가 없으면 빈 배열. */
export const getPopularPosts = createServerFn({ method: "GET" }).handler(
  async () => {
    const redis = getRedis();
    if (!redis) return [];

    setResponseHeader(
      "Cache-Control",
      `public, s-maxage=${VIEWS_CACHE_SECONDS}, stale-while-revalidate=${VIEWS_CACHE_SECONDS}`,
    );

    const slugs = await redis.zrange<string[]>(
      VIEWS_KEY,
      0,
      POPULAR_POSTS_LIMIT * 2 - 1,
      { rev: true },
    );

    return slugs
      .flatMap((slug) => {
        const post = allPosts.find((p) => p.slug === slug);
        return post
          ? [
              {
                slug: post.slug,
                title: post.title,
                description: post.description,
              },
            ]
          : [];
      })
      .slice(0, POPULAR_POSTS_LIMIT);
  },
);
