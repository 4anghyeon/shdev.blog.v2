import { Link, useLocation } from "@tanstack/react-router";
import parse, {
  type DOMNode,
  domToReact,
  Element,
  type HTMLReactParserOptions,
} from "html-react-parser";
import { useEffect, useState } from "react";
import { CodeBlock } from "#/features/markdown/components/CodeBlock.tsx";
import {
  type MarkdownResult,
  renderMarkdown,
} from "#/features/markdown/utils/render-markdown.ts";
import { localeHelper } from "#/shared/helper/locale.ts";

type MarkdownProps = {
  content: string;
  className?: string;
};

export function Markdown({ content, className }: MarkdownProps) {
  const [result, setResult] = useState<MarkdownResult | null>(null);
  const { pathname } = useLocation();

  const resolveImageSrc = (src: string) => {
    if (src.startsWith("/") || src.startsWith("http")) return src;

    const withoutLocale = localeHelper.removeLocaleFromPath(pathname);
    const slug = withoutLocale.replace(/^\//, "").split("/").pop();
    const filename = src.split("/").pop() ?? src;

    return `/images/posts/${slug}/${filename}`;
  };

  useEffect(() => {
    renderMarkdown(content).then(setResult);
  }, [content]);

  if (!result) {
    return <div className={className}>Loading...</div>;
  }

  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element) {
        // Customize rendering of specific elements
        if (domNode.name === "a") {
          // Handle links
          const href = domNode.attribs.href;
          if (href?.startsWith("/")) {
            // Internal link - use your router's Link component
            return (
              <Link to={href}>
                {domToReact(domNode.children as DOMNode[], options)}
              </Link>
            );
          }
        }

        if (domNode.name === "img") {
          // Add lazy loading to images
          const resolvedSrc = resolveImageSrc(domNode.attribs.src ?? "");

          console.log(domNode.attribs);
          // const imageSrc = `../posts/${domNode.attribs.src}`;
          return (
            <img
              {...domNode.attribs}
              loading="lazy"
              className="rounded-lg shadow-md"
              alt={domNode.attribs.alt}
              // src={imageSrc}
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
            const className = codeElement.attribs?.class ?? "";
            const language = className.replace("language-", "") || "text";
            const meta = codeElement.attribs?.["data-meta"] ?? "";
            const pathnameMatch = meta.match(/pathname="([^"]+)"/);
            const pathname = pathnameMatch?.[1];

            const code = codeElement.children
              .map((c: any) => ("data" in c ? c.data : ""))
              .join("");

            return (
              <CodeBlock code={code} language={language} filename={pathname} />
            );
          }
        }
      }
    },
  };

  return <div className={className}>{parse(result.markup, options)}</div>;
}
