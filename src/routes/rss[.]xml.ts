import { createFileRoute } from "@tanstack/react-router";
import { allPosts } from "content-collections";
import { BlogMeta } from "#/shared/constant/metadata.ts";

export const Route = createFileRoute("/rss.xml")({
  server: {
    handlers: {
      GET: () => {
        const baseUrl = BlogMeta.baseUrl.endsWith("/")
          ? BlogMeta.baseUrl.slice(0, -1)
          : BlogMeta.baseUrl;

        const sortedPosts = [...allPosts].sort(
          (a, b) =>
            new Date(b.published).getTime() - new Date(a.published).getTime(),
        );

        const lastBuildDate = new Date().toUTCString();

        const items = sortedPosts
          .map((post) => {
            const link = `${baseUrl}/ko/post/${post.slug}`;
            const pubDate = new Date(post.published).toUTCString();
            const description = post.description || post.excerpt || "";

            return `  <item>
    <title>${post.title}</title>
    <link>${link}</link>
    <guid isPermaLink="true">${link}</guid>
    <pubDate>${pubDate}</pubDate>
    <description>${description}</description>
  </item>`;
          })
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
                      <rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
                      <channel>
                        <title>${BlogMeta.title}</title>
                        <link>${baseUrl}</link>
                        <description>${BlogMeta.description}</description>
                        <language>ko</language>
                        <lastBuildDate>${lastBuildDate}</lastBuildDate>
                        <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
                      ${items}
                      </channel>
                      </rss>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
          },
        });
      },
    },
  },
});
