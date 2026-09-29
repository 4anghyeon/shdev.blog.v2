import type { ReactNode } from "react";
import { CodeCopyButton } from "#/features/markdown/components/CodeCopyButton";
import { getLangExtension } from "#/features/markdown/utils/langauge-extension";
import { cn } from "#/shared/lib/tailwind";

interface CodeBlockProps {
  code: string;
  language?: string;
  pathname?: string;
  className?: string;
  children?: ReactNode;
}

export function CodeBlock({
  code,
  language = "text",
  pathname,
  className,
  children,
}: CodeBlockProps) {
  const filename = pathname
    ? `${pathname}.${getLangExtension(language)}`
    : undefined;
  return (
    <div
      className={cn(
        "group relative rounded-xs border border-line-subtle bg-background",
        className,
      )}
    >
      {filename ? (
        <div className="hanji cursor-default border-line-subtle border-b bg-paper px-4 py-1.5 font-mono text-ink-muted text-xs">
          {filename}
        </div>
      ) : (
        <span className="absolute -top-2 right-4 z-1 cursor-default bg-background px-2 font-mono text-ink-faint text-xs group-hover:opacity-0">
          {getLangExtension(language)}
        </span>
      )}
      <div className="relative text-sm [&>pre]:m-0 [&>pre]:max-h-120 [&>pre]:overflow-x-auto [&>pre]:p-4">
        <CodeCopyButton code={code} />
        {children}
      </div>
    </div>
  );
}
