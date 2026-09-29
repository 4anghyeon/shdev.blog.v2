import { cn } from "#/shared/lib/tailwind";

interface BrushDividerProps {
  className?: string;
}

export function BrushDivider({ className }: BrushDividerProps) {
  return (
    <hr
      className={cn(
        "mask-brush-stroke h-2.5 border-0 bg-line-subtle",
        className,
      )}
    />
  );
}
