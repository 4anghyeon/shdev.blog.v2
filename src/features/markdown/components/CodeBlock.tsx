import type { ReactNode } from "react";
import CodeCopyButton from "#/features/markdown/components/CodeCopyButton.tsx";
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
  const filename = pathname ? `${pathname}.${language}` : undefined;
  return (
    <div
      className={cn(
        "group relative rounded-lg border border-gray-200 p-1 dark:border-gray-700",
        className,
      )}
    >
      <span className="absolute -top-2 right-4 cursor-default bg-white px-2 text-gray-400 text-xs transition-all duration-500 group-hover:opacity-0">
        {language}
      </span>
      {filename && (
        <pre className="flex cursor-default items-center justify-between px-2 py-1">
          <span className="rounded-sm border border-blue-200 bg-blue-100/50 px-1 py-0.5 font-mono text-[10px] text-gray-700">
            {filename}
          </span>
        </pre>
      )}
      <CodeCopyButton code={code} />
      <div className="text-sm [&>pre]:m-0 [&>pre]:overflow-x-auto [&>pre]:rounded-xl [&>pre]:border [&>pre]:border-gray-100 [&>pre]:bg-transparent [&>pre]:p-4">
        {children}
      </div>
    </div>
  );
}
