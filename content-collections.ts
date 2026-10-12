import { defineCollection, defineConfig } from "@content-collections/core";
import matter from "gray-matter";
import { fetchOpenGraph } from "#/features/markdown/utils/open-graph";
import { renderMarkdown } from "#/features/markdown/utils/render-markdown";
import { localeHelper } from "#/shared/helper/locale";
import { blogPostSchema } from "#/shared/schema/blog-post";

function extractFrontMatter(content: string) {
  const { data, content: body, excerpt } = matter(content, { excerpt: true });
  return { data, body, excerpt: excerpt || "" };
}

const posts = defineCollection({
  name: "posts",
  directory: "./posts",
  include: "**/*.mdx",
  schema: blogPostSchema,
  transform: async ({ content, ...post }) => {
    const frontMatter = extractFrontMatter(content);
    const headerImageMatch = content.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    const headerImage = headerImageMatch ? headerImageMatch[2] : undefined;
    const slug = localeHelper.removeLocaleFromPath(post._meta.path);
    const {
      markup,
      headings,
      references: extractedReferences,
    } = await renderMarkdown(frontMatter.body);
    const references = await Promise.all(
      extractedReferences.map(async (reference) => {
        if (!reference.url) return reference;
        const openGraph = await fetchOpenGraph(reference.url);
        return {
          ...reference,
          ...(openGraph
            ? {
                ogTitle: openGraph.title,
                ogDescription: openGraph.description,
                ogImage: openGraph.image,
              }
            : {}),
        };
      }),
    );

    return {
      ...post,
      slug,
      excerpt: frontMatter.excerpt,
      headerImage,
      content: frontMatter.body,
      markup,
      headings,
      references,
    };
  },
});

export default defineConfig({
  content: [posts],
});
