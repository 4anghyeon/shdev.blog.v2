import { createServerFn } from "@tanstack/react-start";
import { getRedis } from "#/shared/lib/redis";

const CAUGHT_KEY = "bug-hunt:caught";

/** 방문자 전체가 잡은 날벌레 수를 1 올리고 올라간 값을 반환한다. 올리지 않았으면 `null`. */
export const recordBugCatch = createServerFn({ method: "POST" }).handler(
  async () => {
    const redis = getRedis();
    if (!redis || process.env.VERCEL_ENV !== "production") return null;

    return redis.incr(CAUGHT_KEY);
  },
);
