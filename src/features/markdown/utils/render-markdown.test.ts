import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { describe, expect, it } from "vitest";
import {
  type MarkdownReference,
  rehypeReferences,
} from "#/features/markdown/utils/rehype-references";

async function renderReferences(content: string) {
  const references: Array<MarkdownReference> = [];
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeReferences, { references })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);

  return { markup: String(result), references };
}

describe("renderMarkdown references", () => {
  it.each([
    "\n\n",
    "\n",
  ])("extracts references with separator %j", async (gap) => {
    const { markup, references } = await renderReferences(
      `본문\n\n---\n\n**참고**${gap}- [https://vercel.com/docs/functions](https://vercel.com/docs/functions)`,
    );

    expect(references).toEqual([
      {
        title: "vercel.com/docs/functions",
        url: "https://vercel.com/docs/functions",
        hostname: "vercel.com",
      },
    ]);
    expect(markup).not.toContain("참고");
    expect(markup).not.toContain("<hr");
  });

  it("extracts an unlinked book title", async () => {
    const { references } = await renderReferences(
      "**참고**\n\n- 우아한 타입스크립트",
    );
    expect(references).toEqual([{ title: "우아한 타입스크립트" }]);
  });

  it("leaves markup unchanged when no reference section exists", async () => {
    const content = "본문\n\n---\n\n**다른 제목**\n\n- 항목";
    const { markup, references } = await renderReferences(content);
    expect(references).toEqual([]);
    expect(markup).toContain("다른 제목");
    expect(markup).toContain("<hr");
  });
});
