import { createFileRoute } from "@tanstack/react-router";
import { BASE_URL } from "#/shared/constant/base.ts";
import { allPosts } from "../../.content-collections/generated";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const baseUrl = BASE_URL.endsWith("/")
          ? BASE_URL.slice(0, -1)
          : BASE_URL;

        const staticUrls = [
          {
            loc: `${baseUrl}/`,
            lastmod: new Date().toISOString().split("T")[0],
          },
        ];

        const postUrls = allPosts.map((post) => ({
          loc: `${baseUrl}/ko/post/${post.slug}`,
          lastmod: (post.updated ?? post.published).split("T")[0],
        }));

        const urls = [...staticUrls, ...postUrls];

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>\n    <loc>${url.loc}</loc>\n    <lastmod>${url.lastmod}</lastmod>\n  </url>`).join("\n")}
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
