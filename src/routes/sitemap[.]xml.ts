import { createFileRoute } from "@tanstack/react-router";
import { allPosts } from "content-collections";
import { DEFAULT_LANG } from "#/shared/constant/lang";
import { BlogMeta } from "#/shared/constant/metadata";

interface SitemapUrl {
  loc: string;
  lastmod?: string;
}

const toUrlEntry = ({ loc, lastmod }: SitemapUrl) => {
  const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : "";
  return `  <url>\n    <loc>${loc}</loc>${lastmodTag}\n  </url>`;
};

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const baseUrl = BlogMeta.baseUrl.endsWith("/")
          ? BlogMeta.baseUrl.slice(0, -1)
          : BlogMeta.baseUrl;

        const getLastmod = (post: (typeof allPosts)[number]) =>
          (post.updated ?? post.published).split("T")[0];

        const getLatestLastmod = (posts: typeof allPosts) =>
          posts.map(getLastmod).sort().at(-1);

        // 책장·소개는 글과 무관하게 바뀌어 정확한 수정일을 알 수 없으므로 lastmod를 생략한다
        const staticUrls: SitemapUrl[] = [
          { loc: `${baseUrl}/`, lastmod: getLatestLastmod(allPosts) },
          {
            loc: `${baseUrl}/series`,
            lastmod: getLatestLastmod(allPosts.filter((post) => post.series)),
          },
          { loc: `${baseUrl}/books` },
          { loc: `${baseUrl}/about` },
        ];

        const postUrls: SitemapUrl[] = allPosts.map((post) => ({
          loc: `${baseUrl}/${DEFAULT_LANG}/post/${post.slug}`,
          lastmod: getLastmod(post),
        }));

        const urls = [...staticUrls, ...postUrls];

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(toUrlEntry).join("\n")}
</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
          },
        });
      },
    },
  },
});
