import { createHash } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";
import { getRedis } from "#/shared/lib/redis";

const VIEWS_KEY = "views";
const DEDUPE_TTL_SECONDS = 60 * 60 * 24;

function hashIp(ip: string) {
  return createHash("sha256")
    .update(`${ip}${process.env.VIEW_HASH_SALT ?? ""}`)
    .digest("hex");
}

/** 같은 IP가 24시간 안에 처음 본 글이면 조회수를 1 올리고, 현재 조회수를 반환한다. Redis가 없으면 `null`. */
export const incrementView = createServerFn({ method: "POST" })
  .validator(z.object({ slug: z.string().min(1) }))
  .handler(async ({ data: { slug } }) => {
    const redis = getRedis();
    if (!redis) return null;

    // 조회수는 production에서만 증가시킨다
    const ip = getRequestIP({ xForwardedFor: true });
    if (process.env.VERCEL_ENV === "production" && ip) {
      const isFirstView = await redis.set(`view:${hashIp(ip)}:${slug}`, 1, {
        nx: true,
        ex: DEDUPE_TTL_SECONDS,
      });
      if (isFirstView) {
        return redis.zincrby(VIEWS_KEY, 1, slug);
      }
    }

    return (await redis.zscore(VIEWS_KEY, slug)) ?? 0;
  });
