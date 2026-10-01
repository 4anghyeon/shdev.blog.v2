import type { ReactNode } from "react";
import { GlassEffect } from "#/features/glass-effect/components/GlassEffect";
import glass from "#/features/glass-effect/glass-effect.module.css";
import { cn } from "#/shared/lib/tailwind";

interface GlassWrapperProps {
  children: ReactNode;
  className?: string;
  variant?: "plain" | "nacre";
}

export function GlassWrapper({
  children,
  className,
  variant,
}: GlassWrapperProps) {
  return (
    <div className={cn(glass.container, className)}>
      <GlassEffect variant={variant} />
      <div className={glass.content}>{children}</div>
    </div>
  );
}
