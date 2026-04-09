import parse, {
  type DOMNode,
  domToReact,
  Element,
  type HTMLReactParserOptions,
} from "html-react-parser";

import { ArrowUpRight } from "lucide-react";
import { AnchorCopyButton } from "#/features/markdown/components/AnchorCopyButton.tsx";
import { CodeBlock } from "#/features/markdown/components/CodeBlock.tsx";
import { Link } from "#/shared/components/Link.tsx";
import { cn } from "#/shared/lib/tailwind.ts";

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
            <div className="mt-14 mb-3">
              <h2
                id={domNode.attribs.id}
                className="group flex scroll-m-20 items-center gap-1.5 font-bold text-2xl tracking-tight first:mt-0"
              >
                {domToReact(domNode.children as DOMNode[])}
                <AnchorCopyButton anchor={`#${domNode.attribs.id}`} />
              </h2>
            </div>
          );
        }
        if (domNode.name === "h3") {
          return (
            <div className="mt-14 mb-3">
              <h3
                id={domNode.attribs.id}
                className="scroll-m-20 font-semibold text-xl tracking-tight"
              >
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
              <div className="my-3 text-md leading-[1.6]">
                {domToReact(domNode.children as DOMNode[], options)}
              </div>
            );
          }

          return (
            <p className="mt-5 mb-3 text-md leading-[1.6]">
              {domToReact(domNode.children as DOMNode[], options)}
            </p>
          );
        }

        if (domNode.name === "a") {
          const href = domNode.attribs.href;
          const isInternal = href?.startsWith("/") || href?.startsWith("#");
          return (
            <Link
              className="text-blue-500 text-md hover:underline dark:text-blue-400"
              to={href}
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
            <strong className="break-keep font-bold text-md">
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
            <li className="list-item text-md leading-relaxed">
              {domToReact(domNode.children as DOMNode[], options)}
            </li>
          );
        }

        if (domNode.name === "hr") {
          return (
            <hr className="my-15 border-gray-300/50 dark:border-gray-600" />
          );
        }

        if (domNode.name === "img") {
          const resolvedSrc = resolveImageSrc(domNode.attribs.src ?? "");
          return (
            <div className="my-3 flex w-full items-center justify-center rounded-xl bg-gray-50/80 p-2 lg:p-5 dark:bg-gray-700/80">
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

        if (domNode.name === "div") {
          const domClass = domNode.attribs.class;
          return (
            <div
              className={cn(
                "my-4 rounded-md px-4 py-0.5 [&>p]:first:flex [&>p]:first:items-center [&>p]:first:gap-1.5 [&>p]:first:font-bold",
                {
                  "border border-blue-200 bg-blue-100/20 dark:border-blue-900 dark:bg-blue-900/20 [&>p>svg]:fill-blue-400 [&>p]:first:text-blue-400":
                    domClass?.includes("note"),
                },
                {
                  "border border-green-200 bg-green-100/20 [&>p>svg]:fill-green-400 [&>p]:first:text-green-400":
                    domClass?.includes("tip"),
                },
                {
                  "border border-purple-200 bg-purple-100/20 [&>p>svg]:fill-purple-400 [&>p]:first:text-purple-400":
                    domClass?.includes("important"),
                },
                {
                  "border border-amber-200 bg-yellow-100/20 [&>p>svg]:fill-amber-400 [&>p]:first:text-amber-400":
                    domClass?.includes("warning"),
                },
                {
                  "border border-red-200 bg-red-100/20 [&>p>svg]:fill-red-400 [&>p]:first:text-red-400":
                    domClass?.includes("caution"),
                },
              )}
            >
              {domToReact(domNode.children as DOMNode[], options)}
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
                  {domToReact([domNode])}
                </CodeBlock>
              </div>
            );
          }
        }

        if (domNode.name === "code") {
          return (
            <code className="rounded-sm bg-gray-100 px-[0.3rem] py-[0.2rem] font-ubuntu-mono text-orange-600 text-sm dark:bg-gray-600 dark:text-orange-400">
              {domToReact(domNode.children as DOMNode[])}
            </code>
          );
        }

        if (domNode.name === "table") {
          return (
            <div className="my-5 overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
              <table className="w-full border-separate border-spacing-0">
                {domToReact(domNode.children as DOMNode[], options)}
              </table>
            </div>
          );
        }

        if (domNode.name === "th") {
          return (
            <th className="border-gray-200 border-b bg-gray-100 px-3 py-2 text-left font-semibold text-gray-700 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
              {domToReact(domNode.children as DOMNode[], options)}
            </th>
          );
        }

        if (domNode.name === "td") {
          return (
            <td className="text-nowrap border-gray-100 border-b px-3 py-2 text-gray-700 text-sm dark:border-gray-700/60 dark:text-gray-300">
              {domToReact(domNode.children as DOMNode[], options)}
            </td>
          );
        }
      }
    },
  };

  return <div className={className}>{parse(markup, options)}</div>;
}
