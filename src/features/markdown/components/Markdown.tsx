import { Link } from "@tanstack/react-router";
import parse, {
  type DOMNode,
  domToReact,
  Element,
  type HTMLReactParserOptions,
} from "html-react-parser";
import { ArrowUpRight } from "lucide-react";
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
        if (domNode.name === "h2") {
          return (
            <div className="mb- mt-14">
              <h2 className="scroll-m-20 font-bold text-2xl text-gray-800 tracking-tight first:mt-0">
                {domToReact(domNode.children as DOMNode[])}
              </h2>
            </div>
          );
        }
        if (domNode.name === "h3") {
          return (
            <div className="mt-14 mb-3">
              <h3 className="scroll-m-20 font-semibold text-gray-800 text-xl tracking-tight">
                {domToReact(domNode.children as DOMNode[])}
              </h3>
            </div>
          );
        }
        if (domNode.name === "p") {
          // p 안에 img가 있으면 p를 div로 교체
          const hasImage = domNode.children.some(
            (child) => child instanceof Element && child.name === "img",
          );

          if (hasImage) {
            return (
              <div className="my-3 text-gray-800 text-md leading-[1.6]">
                {domToReact(domNode.children as DOMNode[], options)}
              </div>
            );
          }

          return (
            <p className="my-3 text-gray-800 text-md leading-[1.6]">
              {domToReact(domNode.children as DOMNode[], options)}
            </p>
          );
        }

        if (domNode.name === "a") {
          const href = domNode.attribs.href;
          const isInternal = href?.startsWith("/") || href?.startsWith("#");
          return (
            <Link
              className="text-blue-500 text-md hover:underline"
              to={href}
              target={isInternal ? "_self" : "_blank"}
              rel={isInternal ? "" : "noopener noreferrer nofollow external"}
            >
              {domToReact(domNode.children as DOMNode[], options)}
              {!isInternal && (
                <span className="not-prose inline-flex">
                  <ArrowUpRight size={16} />
                </span>
              )}
            </Link>
          );
        }

        if (domNode.name === "strong") {
          return (
            <strong className="break-keep font-bold text-gray-800 text-md">
              {domToReact(domNode.children as DOMNode[], options)}
            </strong>
          );
        }

        if (domNode.name === "ul") {
          return (
            <ul className="mt-2 block list-disc break-all ps-5 text-md">
              {domToReact(domNode.children as DOMNode[], options)}
            </ul>
          );
        }

        if (domNode.name === "ol") {
          return (
            <ol className="mt-2 block list-decimal break-all ps-5 text-md">
              {domToReact(domNode.children as DOMNode[], options)}
            </ol>
          );
        }

        if (domNode.name === "li") {
          return (
            <li className="list-item text-gray-800 text-md leading-relaxed">
              {domToReact(domNode.children as DOMNode[], options)}
            </li>
          );
        }

        if (domNode.name === "hr") {
          return <hr className="my-15 border-gray-300/50" />;
        }

        if (domNode.name === "img") {
          const resolvedSrc = resolveImageSrc(domNode.attribs.src ?? "");
          return (
            <div className="my-3 flex w-full items-center justify-center rounded-xl bg-gray-50/80 p-2 lg:p-5">
              <img
                {...domNode.attribs}
                loading="lazy"
                className="rounded-md shadow-gray-400/50 shadow-lg"
                alt={domNode.attribs.alt}
                src={resolvedSrc}
              />
            </div>
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
              <div className="my-5">
                <CodeBlock code={code} language={lang} pathname={pathname}>
                  {domToReact([codeElement])}
                </CodeBlock>
              </div>
            );
          }
        }

        if (domNode.name === "code") {
          return (
            <code className="rounded-sm bg-muted px-[0.3rem] py-[0.2rem] font-ubuntu-mono text-orange-600 text-sm">
              {domToReact(domNode.children as DOMNode[])}
            </code>
          );
        }
      }
    },
  };

  return <div className={className}>{parse(markup, options)}</div>;
}
