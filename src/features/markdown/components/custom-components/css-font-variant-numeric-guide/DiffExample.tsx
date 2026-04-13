import type { PropsWithChildren } from "react";
import { cn } from "#/shared/lib/tailwind.ts";

interface DiffExampleProps extends PropsWithChildren {
  className?: string;
  font?: string;
}

const sourceSans3Style = { fontFamily: '"Source Sans 3", sans-serif' };

export function DiffExample({ className, children, font }: DiffExampleProps) {
  return (
    <div className={cn("mb-6 grid grid-cols-1 gap-4 text-lg sm:grid-cols-2")} style={sourceSans3Style}>
      <div className="rounded-sm border border-zinc-200 bg-zinc-100 p-2">
        <span className="rounded-sm bg-zinc-300 p-1 text-xs">before</span>
        <div className={cn(font)}>{children}</div>
      </div>
      <div className="rounded-sm border border-blue-200 bg-blue-100 p-2">
        <span className="rounded-sm bg-blue-300 p-1 text-xs">after</span>
        <div className={cn(className, font)}>{children}</div>
      </div>
    </div>
  );
}
