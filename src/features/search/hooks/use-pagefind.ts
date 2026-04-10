import { use, useMemo } from "react";

export const usePagefind = () => {
  const pagefindPromise = useMemo(async () => {
    if (typeof window === "undefined") return Promise.resolve(null);

    try {
      const pagefindPath = `${window.location.origin}/pagefind/pagefind.js`;
      return await import(/* @vite-ignore */ pagefindPath);
    } catch (error) {
      console.error("Pagefind 초기화 실패:", error);
      return null;
    }
  }, []);

  return use(pagefindPromise);
};
