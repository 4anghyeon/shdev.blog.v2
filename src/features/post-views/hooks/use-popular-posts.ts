import { useEffect, useState } from "react";
import { getPopularPosts } from "#/features/post-views/server";

export type PopularPost = Awaited<ReturnType<typeof getPopularPosts>>[number];

/** 마운트 시 조회수 상위 글 목록을 불러온다. 불러오기 전이거나 실패하면 빈 배열. */
export const usePopularPosts = () => {
  const [posts, setPosts] = useState<PopularPost[]>([]);

  useEffect(() => {
    let ignore = false;

    getPopularPosts()
      .catch(() => [])
      .then((popularPosts) => {
        if (!ignore) setPosts(popularPosts);
      });

    return () => {
      ignore = true;
    };
  }, []);

  return posts;
};
