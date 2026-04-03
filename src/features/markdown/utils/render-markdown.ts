import type { Element } from "hast";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";

export type MarkdownHeading = {
  id: string;
  text: string;
  level: number;
};

export type MarkdownResult = {
  markup: string;
  headings: Array<MarkdownHeading>;
};

export async function renderMarkdown(content: string): Promise<MarkdownResult> {
  const headings: Array<MarkdownHeading> = [];

  const result = await unified()
    .use(remarkParse) // Parse markdown
    .use(remarkGfm) // Support GitHub Flavored Markdown
    .use(remarkCodeMeta)
    .use(remarkRehype, {
      allowDangerousHtml: true,
    }) // Convert to HTML AST
    .use(rehypeRaw) // Process raw HTML in markdown
    .use(rehypeCodeMeta) // ← 여기 추가
    .use(rehypeSlug) // Add IDs to headings
    .use(rehypeAutolinkHeadings, {
      behavior: "wrap",
      properties: { className: ["anchor"] },
    })
    .use(() => (tree) => {
      visit(tree, "element", (node: Element) => {
        if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(node.tagName)) {
          headings.push({
            id: String(node.properties?.id || ""),
            text: toString(),
            level: parseInt(node.tagName.charAt(1), 10),
          });
        }
      });
    })
    .use(rehypeStringify) // Serialize to HTML string
    .process(content);

  return {
    markup: String(result),
    headings,
  };
}

/**
 * 마크다운 코드에 메타데이터를 심고, 가져오기 위한 custom plugin
 */
function rehypeCodeMeta() {
  return (tree: any) => {
    visit(tree, "element", (node) => {
      if (node.tagName === "code" && node.data?.meta) {
        node.properties["data-meta"] = node.data.meta;
      }
    });
  };
}

function remarkCodeMeta() {
  return (tree: any) => {
    visit(tree, "code", (node: any) => {
      if (node.meta) {
        node.data = node.data ?? {};
        node.data.hProperties = node.data.hProperties ?? {};
        node.data.hProperties["data-meta"] = node.meta;
      }
    });
  };
}
