import type { ReactNode } from "react";

interface TagProps {
  children: ReactNode;
}

export function Tag({ children }: TagProps) {
  return (
    <span className="cursor-default rounded-lg bg-gray-100 px-2.5 py-0.5 text-xs">
      #{children}
    </span>
  );
}
