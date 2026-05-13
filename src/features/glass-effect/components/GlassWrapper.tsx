import { GlassEffect } from "#/features/glass-effect/components/GlassEffect";
import { cn } from "#/shared/lib/tailwind";
import "#/features/glass-effect/styles/glass-item.css";
import type { ReactNode } from "react";

interface GlassWrapperProps {
  children: ReactNode;
  className?: string;
}

export function GlassWrapper({ children, className }: GlassWrapperProps) {
  return (
    <div className={cn("glass-container", className)}>
      <GlassEffect />
      <div className="glass-content">{children}</div>
    </div>
  );
}
