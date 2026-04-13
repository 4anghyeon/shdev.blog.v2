import { ElementType } from "domelementtype";
import parse, {
  type DOMNode,
  domToReact,
  Element,
  type HTMLReactParserOptions,
} from "html-react-parser";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { AnchorCopyButton } from "#/features/markdown/components/AnchorCopyButton.tsx";
import { CodeBlock } from "#/features/markdown/components/CodeBlock.tsx";
import { ExampleComponents } from "#/features/markdown/components/custom-components/index.ts";
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
        const domName = domNode.name;

        if (domName === "h2") {
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
        if (domName === "h3") {
          return (
            <div className="mt-10 mb-3">
              <h3
                id={domNode.attribs.id}
                className="group flex scroll-m-20 items-center gap-1.5 font-semibold text-xl tracking-tight"
              >
                {domToReact(domNode.children as DOMNode[])}
                <AnchorCopyButton anchor={`#${domNode.attribs.id}`} />
              </h3>
            </div>
          );
        }

        if (domName === "h4") {
          return (
            <div className="mt-10 mb-3">
              <h4
                id={domNode.attribs.id}
                className="group flex scroll-m-20 items-center gap-1.5 font-semibold text-lg tracking-tight"
              >
                {domToReact(domNode.children as DOMNode[])}
                <AnchorCopyButton anchor={`#${domNode.attribs.id}`} />
              </h4>
            </div>
          );
        }

        if (domName === "p") {
          // p 안에 img가 있으면 p를 div로 교체
          const hasImage = domNode.children.some(
            (child) => child instanceof Element && child.name === "img",
          );

          const hasTag = domNode.children.every(
            (child) =>
              child instanceof Element && child.type === ElementType.Tag,
          );

          if (hasImage || hasTag) {
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

        if (domName === "a") {
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

        if (domName === "strong") {
          return (
            <strong className="break-keep font-bold text-md">
              {domToReact(domNode.children as DOMNode[], options)}
            </strong>
          );
        }

        if (domName === "ul") {
          const parent = domNode.parent;
          const isParentNull = !parent;
          return (
            <ul
              className={cn("mt-2 block list-disc break-all ps-5 text-md", {
                "[&>li]:mb-2": isParentNull,
              })}
            >
              {domToReact(domNode.children as DOMNode[], options)}
            </ul>
          );
        }

        if (domName === "ol") {
          const parent = domNode.parent;
          const isParentNull = !parent;
          return (
            <ol
              className={cn("mt-2 block list-decimal break-all ps-5 text-md", {
                "[&>li]:mb-2": isParentNull,
              })}
            >
              {domToReact(domNode.children as DOMNode[], options)}
            </ol>
          );
        }

        if (domName === "li") {
          return (
            <li className="list-item text-md leading-relaxed">
              {domToReact(domNode.children as DOMNode[], options)}
            </li>
          );
        }

        if (domName === "hr") {
          return (
            <hr className="my-15 border-gray-300/50 dark:border-stone-600" />
          );
        }

        if (domName === "img") {
          const resolvedSrc = resolveImageSrc(domNode.attribs.src ?? "");
          return (
            <div className="my-3 flex w-full items-center justify-center rounded-lg bg-gray-50/80 p-2 lg:p-5 dark:bg-stone-700/30">
              <img
                {...domNode.attribs}
                loading="lazy"
                className="rounded-md bg-gray-50 shadow-gray-400/50 shadow-lg dark:bg-stone-100 dark:shadow-gray-900/50"
                alt={domNode.attribs.alt}
                src={resolvedSrc}
              />
            </div>
          );
        }

        if (domName === "div") {
          const domClass = domNode.attribs.class;
          return (
            <div
              className={cn(
                "my-4 rounded-md px-4 py-3 [&>p]:first:mt-0 [&>p]:first:flex [&>p]:first:items-center [&>p]:first:gap-1.5 [&>p]:first:font-bold",
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
                  "border border-amber-200 bg-amber-400/10 dark:border-amber-500 dark:bg-amber-500/10 [&>p>svg]:fill-amber-500 [&>p]:first:text-amber-500":
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

        if (domName === "pre") {
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
              .map((c) => ("data" in c ? c.data : ""))
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

        if (domName === "code") {
          return (
            <code className="rounded-sm bg-gray-100 px-[0.3rem] py-[0.2rem] font-ubuntu-mono text-orange-600 text-sm dark:bg-stone-700 dark:text-orange-400">
              {domToReact(domNode.children as DOMNode[])}
            </code>
          );
        }

        if (domName === "details") {
          const summaryNode = domNode.children.find(
            (child): child is Element =>
              child instanceof Element && child.name === "summary",
          );
          const contentNodes = domNode.children.filter(
            (child) => !(child instanceof Element && child.name === "summary"),
          );
          return (
            <details className="group my-5 rounded-md border border-gray-200 open:border-gray-300 dark:border-gray-700 dark:open:border-gray-600">
              {summaryNode && domToReact([summaryNode] as DOMNode[], options)}
              <div className="px-4 pb-2">
                {domToReact(contentNodes as DOMNode[], options)}
              </div>
            </details>
          );
        }

        if (domName === "summary") {
          return (
            <summary className="flex cursor-pointer select-none list-none items-center gap-2 rounded-md px-4 py-3 font-semibold text-gray-700 text-md hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800/50 [&::-webkit-details-marker]:hidden">
              <span className="transition-transform duration-200 group-open:rotate-90">
                <ChevronRight className="size-4" />
              </span>
              {domToReact(domNode.children as DOMNode[], options)}
            </summary>
          );
        }

        if (domName === "table") {
          return (
            <div className="my-5 overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
              <table className="w-full border-separate border-spacing-0">
                {domToReact(domNode.children as DOMNode[], options)}
              </table>
            </div>
          );
        }

        if (domName === "th") {
          return (
            <th className="border-gray-200 border-b bg-gray-100 px-3 py-2 text-left font-semibold text-gray-700 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
              {domToReact(domNode.children as DOMNode[], options)}
            </th>
          );
        }

        if (domName === "td") {
          return (
            <td className="text-nowrap border-gray-100 border-b px-3 py-2 text-gray-700 text-sm dark:border-gray-700/60 dark:text-gray-300">
              {domToReact(domNode.children as DOMNode[], options)}
            </td>
          );
        }

        if (domName === "blockquote") {
          return (
            <blockquote className="my-4 border-gray-300 border-l-4 pl-4 dark:border-stone-700">
              {domToReact(domNode.children as DOMNode[], options)}
            </blockquote>
          );
        }

        const componentName = Object.keys(ExampleComponents).find(
          (key) => key.toLowerCase() === domName,
        );

        if (componentName) {
          const Component =
            ExampleComponents[componentName as keyof typeof ExampleComponents];
          return (
            <div className="not-prose my-5">
              {/*@ts-ignore*/}
              <Component {...domNode.attribs} className={domNode.attribs.class}>
                {domToReact(domNode.children as DOMNode[], options)}
              </Component>
            </div>
          );
        }
      }
    },
  };

  return <div className={className}>{parse(markup, options)}</div>;
}
