import { useEffect, useState } from "react";
import { getViews, incrementView } from "#/features/post-views/server";

const VIEWED_AT_KEY_PREFIX = "post-views:";
const DEDUPE_WINDOW_MS = 1000 * 60 * 60 * 24;

const hasViewedRecently = (slug: string) => {
  try {
    const viewedAt = Number(
      localStorage.getItem(`${VIEWED_AT_KEY_PREFIX}${slug}`),
    );
    return Date.now() - viewedAt < DEDUPE_WINDOW_MS;
  } catch {
    return false;
  }
};

const markViewed = (slug: string) => {
  try {
    localStorage.setItem(`${VIEWED_AT_KEY_PREFIX}${slug}`, String(Date.now()));
  } catch {}
};

const fetchViews = async (slug: string) => {
  if (hasViewedRecently(slug)) {
    return getViews({ data: { slug } });
  }

  const count = await incrementView({ data: { slug } });
  markViewed(slug);
  return count ?? getViews({ data: { slug } });
};

/**
 * 마운트 시 글의 조회수를 올리고 현재 조회수를 반환한다. 불러오기 전이면 `null`, 조회수가 없거나 실패하면 `0`.
 * 이 브라우저에서 24시간 안에 본 글이면 증가 요청 없이 조회만 한다.
 */
export const usePostViews = (slug: string) => {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    let ignore = false;
    setViews(null);

    fetchViews(slug)
      .catch(() => null)
      .then((count) => {
        if (!ignore) setViews(count ?? 0);
      });

    return () => {
      ignore = true;
    };
  }, [slug]);

  return views;
};
