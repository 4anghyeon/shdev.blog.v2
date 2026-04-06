import { Link } from "@tanstack/react-router";
import parse, {
  type DOMNode,
  domToReact,
  Element,
  type HTMLReactParserOptions,
} from "html-react-parser";
import { CodeBlock } from "#/features/markdown/components/CodeBlock.tsx";

type MarkdownProps = {
  markup: string;
  slug: string;
  className?: string;
};

export function Markdown({ markup, slug, className }: MarkdownProps) {
  const resolveImageSrc = (src: string) => {
    if (src.startsWith("/") || src.startsWith("http")) return src;

    const filename = src.split("/").pop() ?? src;

    return `/images/posts/${slug}/${filename}`;
  };

  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element) {
        if (domNode.name === "a") {
          const href = domNode.attribs.href;
          if (href?.startsWith("/")) {
            return (
              <Link to={href}>
                {domToReact(domNode.children as DOMNode[], options)}
              </Link>
            );
          }
        }

        if (domNode.name === "img") {
          const resolvedSrc = resolveImageSrc(domNode.attribs.src ?? "");
          return (
            <img
              {...domNode.attribs}
              loading="lazy"
              className="rounded-lg shadow-md"
              alt={domNode.attribs.alt}
              src={resolvedSrc}
            />
          );
        }

        if (domNode.name === "pre") {
          const codeElement = domNode.children.find(
            (child): child is Element =>
              child instanceof Element && child.name === "code",
          );

          if (codeElement) {
            const meta = codeElement.attribs?.["data-meta"] ?? "";
            const lang = codeElement.attribs?.["data-lang"] ?? "";
            const pathnameMatch = meta.match(/pathname="([^"]+)"/);
            const pathname = pathnameMatch?.[1];

            const code = codeElement.children
              .map((c: any) => ("data" in c ? c.data : ""))
              .join("");

            return (
              <CodeBlock code={code} language={lang} pathname={pathname}>
                {domToReact([codeElement])}
              </CodeBlock>
            );
          }
        }
      }
    },
  };

  return <div className={className}>{parse(markup, options)}</div>;
}
