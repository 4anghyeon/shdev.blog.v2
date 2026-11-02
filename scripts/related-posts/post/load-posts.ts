import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { PATHS } from "../config.ts";

export interface PostSource {
  key: string;
  locale: string;
  slug: string;
  title: string;
  description: string;
  tags: Array<string>;
  body: string;
}

// posts/{locale}/{slug}.mdx를 모두 읽어 frontmatter와 본문으로 나눈다.
export const loadPosts = async (): Promise<Array<PostSource>> => {
  const locales = await readdir(PATHS.posts);
  const posts: Array<PostSource> = [];

  for (const locale of locales) {
    const files = (await readdir(path.join(PATHS.posts, locale))).filter(
      (file) => file.endsWith(".mdx"),
    );

    for (const file of files) {
      const raw = await readFile(path.join(PATHS.posts, locale, file), "utf8");
      const { data, content } = matter(raw);
      const slug = file.replace(/\.mdx$/, "");

      posts.push({
        key: `${locale}/${slug}`,
        locale,
        slug,
        title: String(data.title ?? slug),
        description: String(data.description ?? ""),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        body: content,
      });
    }
  }

  return posts.sort((a, b) => a.key.localeCompare(b.key));
};
