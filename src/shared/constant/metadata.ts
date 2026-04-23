export const BlogMeta = {
  baseUrl: import.meta.env.VITE_BASE_URL ?? "https://shdev.blog/",
  siteName: "shdev.blog",
  title: "shdev.blog",
  description:
    "개발하며 마주친 문제들과 그 해결 과정을 기록하는 개인 기술 블로그입니다. 학습한 내용과 경험을 꾸준히 아카이빙합니다.",
} as const;
