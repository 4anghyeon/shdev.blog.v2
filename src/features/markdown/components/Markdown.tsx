import { cva } from "class-variance-authority";
import parse, {
  type DOMNode,
  domToReact,
  Element,
  type HTMLReactParserOptions,
} from "html-react-parser";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { AnchorCopyButton } from "#/features/markdown/components/AnchorCopyButton";
import { Blockquote } from "#/features/markdown/components/BlockQuote";
import { CodeBlock } from "#/features/markdown/components/CodeBlock";
import { ExampleComponents } from "#/features/markdown/components/custom-components";
import { ZoomableImage } from "#/features/markdown/components/ZoomableImage";
import { Link } from "#/shared/components/Link";
import { cn } from "#/shared/lib/tailwind";

// GitHub 스타일 알림(> [!NOTE] 등). rehype-github-alerts가 붙인 클래스로 종류를 판별한다
const ALERT_TYPES = ["note", "tip", "important", "warning", "caution"] as const;

const alertVariants = cva(
  "my-4 rounded-xs px-4 py-3 [&>p]:first:mt-0 [&>p]:first:flex [&>p]:first:items-center [&>p]:first:gap-1.5 [&>p]:first:font-bold",
  {
    variants: {
      type: {
        note: "hanji border-ink-faint border-l-2 bg-paper [&>p>svg]:fill-ink-strong [&>p]:first:text-ink-strong",
        tip: "hanji border-pigment-celadon border-l-2 bg-paper [&>p>svg]:fill-pigment-celadon [&>p]:first:text-pigment-celadon",
        important:
          "hanji border-pigment-indigo border-l-2 bg-paper [&>p>svg]:fill-pigment-indigo [&>p]:first:text-pigment-indigo",
        warning:
          "hanji border-pigment-ochre border-l-2 bg-paper [&>p>svg]:fill-pigment-ochre [&>p]:first:text-pigment-ochre",
        caution:
          "hanji border-seal border-l-2 bg-paper [&>p>svg]:fill-seal [&>p]:first:text-seal",
      },
    },
  },
);

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
                className="group flex scroll-m-20 items-center gap-1.5 font-bold text-2xl tracking-tight"
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
            (child) => child instanceof Element && child.type === "tag",
          );

          if (hasImage || hasTag) {
            return (
              <div className="my-3 leading-[1.6]">
                {domToReact(domNode.children as DOMNode[], options)}
              </div>
            );
          }

          return (
            <p className="mt-5 mb-3 leading-[1.6]">
              {domToReact(domNode.children as DOMNode[], options)}
            </p>
          );
        }

        if (domName === "a") {
          const href = domNode.attribs.href;
          const isInternal = href?.startsWith("/") || href?.startsWith("#");
          return (
            <Link
              className="text-ink-strong underline decoration-seal/40 underline-offset-4 transition-colors hover:text-seal hover:decoration-seal"
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
            <strong className="break-keep font-bold">
              {domToReact(domNode.children as DOMNode[], options)}
            </strong>
          );
        }

        if (domName === "ul") {
          const parent = domNode.parent;
          const isParentNull = !parent;
          return (
            <ul
              className={cn("wrap-break-word mt-2 list-disc ps-5", {
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
              className={cn("wrap-break-word mt-2 list-decimal ps-5", {
                "[&>li]:mb-2": isParentNull,
              })}
            >
              {domToReact(domNode.children as DOMNode[], options)}
            </ol>
          );
        }

        if (domName === "li") {
          return (
            <li className="leading-relaxed">
              {domToReact(domNode.children as DOMNode[], options)}
            </li>
          );
        }

        if (domName === "hr") {
          return <hr className="my-15 border-line-subtle" />;
        }

        if (domName === "img") {
          const resolvedSrc = resolveImageSrc(domNode.attribs.src ?? "");
          return (
            <div className="hanji my-3 flex w-full items-center justify-center rounded-xs bg-paper p-2 lg:p-5">
              <ZoomableImage
                {...domNode.attribs}
                loading="lazy"
                className="max-h-100 rounded-xs bg-stone-50 shadow-lg shadow-stone-400/50 dark:bg-stone-100 dark:shadow-stone-950/50"
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
              className={alertVariants({
                type: ALERT_TYPES.find((type) => domClass?.includes(type)),
              })}
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
            <code className="rounded-xs bg-paper-hover px-[0.3rem] py-[0.2rem] font-ubuntu-mono text-seal text-sm">
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
            <details className="group my-5 rounded-xs border border-line-subtle open:border-line">
              {summaryNode && domToReact([summaryNode] as DOMNode[], options)}
              <div className="px-4 pb-2">
                {domToReact(contentNodes as DOMNode[], options)}
              </div>
            </details>
          );
        }

        if (domName === "summary") {
          return (
            <summary className="flex cursor-pointer select-none list-none items-center gap-2 rounded-xs px-4 py-3 font-semibold text-ink-strong hover:bg-paper-hover [&::-webkit-details-marker]:hidden">
              <span className="transition-transform duration-200 group-open:rotate-90">
                <ChevronRight className="size-4" />
              </span>
              {domToReact(domNode.children as DOMNode[], options)}
            </summary>
          );
        }

        if (domName === "table") {
          return (
            <div className="my-5 overflow-x-auto rounded-xs border border-line-subtle">
              <table className="w-full border-separate border-spacing-0">
                {domToReact(domNode.children as DOMNode[], options)}
              </table>
            </div>
          );
        }

        if (domName === "th") {
          return (
            <th className="hanji border-line-subtle border-b bg-paper px-3 py-2 text-left font-semibold text-ink-strong text-sm">
              {domToReact(domNode.children as DOMNode[], options)}
            </th>
          );
        }

        if (domName === "td") {
          return (
            <td className="text-nowrap border-line-subtle border-b px-3 py-2 text-ink text-sm">
              {domToReact(domNode.children as DOMNode[], options)}
            </td>
          );
        }

        if (domName === "blockquote") {
          const attribs = domNode.attribs;
          return (
            <Blockquote attribs={attribs}>
              {domToReact(domNode.children as DOMNode[], options)}
            </Blockquote>
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
