import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import { cn } from "#/shared/lib/tailwind";

const badgeVariants = cva(
  "inline-flex cursor-default items-center gap-x-1 rounded-xs border px-2 py-0.5 text-xs tracking-wide [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-line bg-paper text-ink",
        series: "border-seal-line bg-seal-surface text-seal",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  className?: string;
  children: ReactNode;
}

export function Badge({ variant, className, children }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)}>
      {children}
    </span>
  );
}
