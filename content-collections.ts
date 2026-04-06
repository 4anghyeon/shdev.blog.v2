import { defineCollection, defineConfig } from "@content-collections/core";
import matter from "gray-matter";
import { z } from "zod";
import { renderMarkdown } from "#/features/markdown/utils/render-markdown.ts";
import { localeHelper } from "#/shared/helper/locale.ts";

function extractFrontMatter(content: string) {
  const { data, content: body, excerpt } = matter(content, { excerpt: true });
  return { data, body, excerpt: excerpt || "" };
}

const posts = defineCollection({
  name: "posts",
  directory: "./posts", // Directory containing your .md files
  include: "**/*.mdx",
  schema: z.object({
    title: z.string(),
    published: z.string().date(),
    description: z.string().optional(),
  }),
  transform: async ({ content, ...post }) => {
    const frontMatter = extractFrontMatter(content);
    const headerImageMatch = content.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    const headerImage = headerImageMatch ? headerImageMatch[2] : undefined;
    const slug = localeHelper.removeLocaleFromPath(post._meta.path);
    const { markup, headings } = await renderMarkdown(frontMatter.body);

    return {
      ...post,
      slug,
      excerpt: frontMatter.excerpt,
      description: frontMatter.data.description,
      headerImage,
      content: frontMatter.body,
      markup,
      headings,
    };
  },
});

export default defineConfig({
  content: [posts],
});
