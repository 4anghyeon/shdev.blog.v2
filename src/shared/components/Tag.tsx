import type { ReactNode } from "react";

interface TagProps {
  children: ReactNode;
}

export function Tag({ children }: TagProps) {
  return (
    <span className="cursor-default rounded-xs border border-line-subtle px-2 py-0.5 text-ink-muted text-xs tracking-wide">
      #{children}
    </span>
  );
}
