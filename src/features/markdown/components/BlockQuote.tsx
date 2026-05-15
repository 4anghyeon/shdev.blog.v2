import { Quote } from "iconoir-react/solid";
import type { ReactNode } from "react";
import { cn } from "#/shared/lib/tailwind";

interface BlockquoteProps {
  children: ReactNode;
  attribs?: Record<string, string>;
}

export function Blockquote({ children, attribs }: BlockquoteProps) {
  const cite = attribs?.["data-cite"];

  return (
    <blockquote
      className={cn(
        "relative my-6 overflow-hidden rounded-r-sm border-stone-400 border-l-[3px] bg-stone-100 py-4 pr-5 pl-3 dark:border-stone-500 dark:bg-stone-700",
      )}
      {...attribs}
    >
      <Quote className="rotate-180 text-stone-400 dark:text-stone-500" />
      <div className="pl-6 italic leading-7 [&>p]:m-0">{children}</div>
      {cite && <p className={cn("mt-3 pl-6 text-sm not-italic")}>- {cite}</p>}
    </blockquote>
  );
}
