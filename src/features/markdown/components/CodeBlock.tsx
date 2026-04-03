import { useLayoutEffect, useState } from "react";
import CodeCopyButton from "#/features/markdown/components/CodeCopyButton.tsx";
import { highlightCode } from "#/features/markdown/utils/highlight-code.ts";

type CodeBlockProps = {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
};

export function CodeBlock({
  code,
  language = "text",
  filename,
  className,
}: CodeBlockProps) {
  const [html, setHtml] = useState<string | null>(null);

  useLayoutEffect(() => {
    highlightCode(code.trim(), language).then(setHtml);
  }, [code, language]);

  return (
    <div
      className={`group relative rounded-lg border border-gray-200 dark:border-gray-700 ${className ?? ""}`}
    >
      <span className="absolute -top-2 right-4 cursor-default bg-white px-2 text-gray-400 text-xs transition-all duration-500 group-hover:opacity-0">
        {language}
      </span>
      {filename && (
        <div className="flex cursor-default items-center justify-between border-gray-200 border-b px-3 py-2">
          <span className="rounded-sm border border-blue-200 bg-blue-100/50 px-1 py-1 font-mono text-[10px] text-gray-700">{`${filename}.${language}`}</span>
        </div>
      )}
      <CodeCopyButton code={code} />

      {/* 코드 영역 */}
      {html && (
        <div
          className="text-sm [&>pre]:m-0 [&>pre]:overflow-x-auto [&>pre]:p-4"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </div>
  );
}
