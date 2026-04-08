import type { ReactNode } from "react";
import CodeCopyButton from "#/features/markdown/components/CodeCopyButton.tsx";
import { getLangExtension } from "#/features/markdown/utils/langauge-extension.ts";
import { cn } from "#/shared/lib/tailwind.ts";

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
        "group relative rounded-lg border border-gray-200 bg-background p-1 dark:border-gray-700",
        className,
      )}
    >
      <span className="absolute -top-2 right-4 cursor-default bg-background px-2 text-gray-400 text-xs transition-none group-hover:opacity-0">
        {language}
      </span>
      {filename && (
        <div className="flex cursor-default items-center justify-between px-1 pb-1">
          <span className="rounded-sm border border-blue-200 bg-blue-100/50 px-1 py-0.5 font-mono text-[10px] text-gray-700 dark:border-slate-900/80 dark:bg-slate-900 dark:text-gray-200">
            {filename}
          </span>
        </div>
      )}
      <CodeCopyButton code={code} />
      <div
        className={cn(
          "text-sm [&>pre]:m-0 [&>pre]:overflow-x-auto [&>pre]:rounded-xl [&>pre]:bg-transparent [&>pre]:p-4",
          {
            "[&>pre]:border [&>pre]:border-gray-100 dark:[&>pre]:border-gray-800":
              filename,
          },
        )}
      >
        {children}
      </div>
    </div>
  );
}
