import { cva, type VariantProps } from "class-variance-authority";
import type { ElementType, HTMLAttributes } from "react";
import { cn } from "#/shared/lib/tailwind";

const brushBorderVariants = cva(
  "after:mask-brush-stroke relative after:pointer-events-none after:absolute after:inset-x-0 after:h-2.5 after:bg-line-subtle",
  {
    variants: {
      side: {
        top: "after:top-0 after:-translate-y-1/2",
        bottom: "after:bottom-0 after:translate-y-1/2",
      },
    },
    defaultVariants: {
      side: "bottom",
    },
  },
);

interface BrushBorderProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof brushBorderVariants> {
  as?: ElementType;
}

export function BrushBorder({
  as: Component = "div",
  side,
  className,
  ...props
}: BrushBorderProps) {
  return (
    <Component
      className={cn(brushBorderVariants({ side }), className)}
      {...props}
    />
  );
}
