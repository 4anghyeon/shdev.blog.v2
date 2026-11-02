import { createFileRoute } from "@tanstack/react-router";
import { allPosts } from "content-collections";
import { DEFAULT_LANG } from "#/shared/constant/lang";
import { BlogMeta } from "#/shared/constant/metadata";
import { xmlHelper } from "#/shared/helper/xml";

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
            const link = xmlHelper.escape(
              `${baseUrl}/${DEFAULT_LANG}/post/${post.slug}`,
            );
            const pubDate = new Date(post.published).toUTCString();
            const description = post.description || post.excerpt || "";

            return `  <item>
    <title>${xmlHelper.escape(post.title)}</title>
    <link>${link}</link>
    <guid isPermaLink="true">${link}</guid>
    <pubDate>${pubDate}</pubDate>
    <description>${xmlHelper.escape(description)}</description>
  </item>`;
          })
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
                      <rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
                      <channel>
                        <title>${xmlHelper.escape(BlogMeta.title)}</title>
                        <link>${xmlHelper.escape(baseUrl)}</link>
                        <description>${xmlHelper.escape(BlogMeta.description)}</description>
                        <language>ko</language>
                        <lastBuildDate>${lastBuildDate}</lastBuildDate>
                        <atom:link href="${xmlHelper.escape(`${baseUrl}/rss.xml`)}" rel="self" type="application/rss+xml"/>
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
