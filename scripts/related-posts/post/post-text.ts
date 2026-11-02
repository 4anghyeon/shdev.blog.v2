import { EMBEDDING } from "../config.ts";
import type { PostSource } from "./load-posts.ts";

export const buildMetaText = (post: PostSource): string => {
  return [post.title, post.description, post.tags.join(", ")].join("\n");
};

// 마크다운 문법을 걷어내고 임베딩에 쓸 평문만 남긴다.
const toPlainText = (markdown: string): string => {
  return markdown
    .replace(/^import\s.+$/gm, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^>\s?(\[!\w+\])?/gm, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

// 문단 단위로 묶되 최대 길이를 넘는 문단은 강제로 나눈다.
const splitByLength = (text: string, maxChars: number): Array<string> => {
  const chunks: Array<string> = [];
  let current = "";

  for (const paragraph of text.split(/\n{2,}/)) {
    const trimmed = paragraph.trim();
    if (!trimmed) continue;

    if (current && current.length + trimmed.length + 2 > maxChars) {
      chunks.push(current);
      current = "";
    }

    if (trimmed.length > maxChars) {
      for (let i = 0; i < trimmed.length; i += maxChars) {
        chunks.push(trimmed.slice(i, i + maxChars));
      }
      continue;
    }

    current = current ? `${current}\n\n${trimmed}` : trimmed;
  }

  if (current) chunks.push(current);
  return chunks;
};

// 본문을 헤딩 기준 섹션으로 나누고, 섹션을 다시 임베딩 입력 크기로 자른다.
export const chunkPost = (
  title: string,
  body: string,
  maxChars: number = EMBEDDING.maxChunkChars,
): Array<string> => {
  const withoutCode = body.replace(/```[\s\S]*?```/g, " ");
  const sections = withoutCode.split(/^(?=#{1,6}\s)/m);

  return sections.flatMap((section) => {
    const headingMatch = section.match(/^#{1,6}\s+(.+)$/m);
    const heading = headingMatch?.[1].trim();
    const content = toPlainText(
      headingMatch ? section.replace(headingMatch[0], "") : section,
    );
    const prefix = heading ? `${title} / ${heading}` : title;

    return splitByLength(content, maxChars).map(
      (chunk) => `${prefix}\n${chunk}`,
    );
  });
};
