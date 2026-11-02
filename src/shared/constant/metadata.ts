const baseUrl = import.meta.env.VITE_BASE_URL ?? "https://shdev.blog/";

const social = {
  github: "https://github.com/4anghyeon",
  linkedin: "https://linkedin.com/in/4anghyeon",
  email: "uphyeon@kakao.com",
} as const;

export const BlogMeta = {
  baseUrl,
  social,
  siteName: "shdev.blog",
  title: "shdev.blog",
  description:
    "개발하며 마주친 문제들과 그 해결 과정을 기록하는 개인 기술 블로그입니다. 학습한 내용과 경험을 꾸준히 아카이빙합니다.",
  author: {
    name: "Lee SangHyeon",
    url: `${baseUrl}about`,
    sameAs: [social.github, social.linkedin],
  },
} as const;
