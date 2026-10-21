import { useEffect, useState } from "react";
import { getViews, incrementView } from "#/features/post-views/server";

/** 마운트 시 글의 조회수를 올리고 현재 조회수를 반환한다. 불러오기 전이거나 실패하면 `null`. */
export function usePostViews(slug: string) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    let ignore = false;
    setViews(null);

    incrementView({ data: { slug } })
      .then((count) => count ?? getViews({ data: { slug } }))
      .then((count) => {
        if (!ignore) setViews(count);
      })
      .catch(() => {});

    return () => {
      ignore = true;
    };
  }, [slug]);

  return views;
}
