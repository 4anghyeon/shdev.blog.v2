import { BlogMeta } from "#/shared/constant/metadata";

interface PageHeadOptions {
  path: string;
  title: string;
  description: string;
}

/** 정적 페이지의 title, description, og, canonical 태그를 만든다. */
const page = ({ path, title, description }: PageHeadOptions) => {
  const url = `${BlogMeta.baseUrl}${path}`;
  const fullTitle = `${title} | ${BlogMeta.siteName}`;

  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
    ],
    links: [
      { rel: "canonical", href: url },
      { rel: "alternate", hrefLang: "x-default", href: url },
    ],
  };
};

/** schema.org 객체를 JSON-LD script 태그로 만든다. */
const jsonLd = (data: Record<string, unknown>) => ({
  type: "application/ld+json",
  children: JSON.stringify({ "@context": "https://schema.org", ...data }),
});

/** 블로그 작성자를 schema.org Person 객체로 만든다. */
const person = () => ({ "@type": "Person", ...BlogMeta.author });

export const headHelper = {
  page,
  jsonLd,
  person,
} as const;
