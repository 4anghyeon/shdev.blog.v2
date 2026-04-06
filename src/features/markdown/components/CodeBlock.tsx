import type { ReactNode } from "react";
import CodeCopyButton from "#/features/markdown/components/CodeCopyButton.tsx";

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
  return (
    <div
      className={`group relative rounded-lg border border-gray-200 dark:border-gray-700 ${className ?? ""}`}
    >
      <span className="absolute -top-2 right-4 cursor-default bg-white px-2 text-gray-400 text-xs transition-all duration-500 group-hover:opacity-0">
        {language}
      </span>
      {pathname && (
        <pre className="flex cursor-default items-center justify-between border-gray-200 border-b px-2 py-1">
          <span className="rounded-sm border border-blue-200 bg-blue-100/50 px-1 py-0.5 font-mono text-[10px] text-gray-700">{`${pathname}.${language}`}</span>
        </pre>
      )}
      <CodeCopyButton code={code} />
      <pre className="overflow-x-auto p-4 text-sm">{children}</pre>
    </div>
  );
}
