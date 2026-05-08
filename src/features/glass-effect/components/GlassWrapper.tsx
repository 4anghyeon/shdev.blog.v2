import type * as React from "react";
import { GlassEffect } from "#/features/glass-effect/components/GlassEffect.tsx";
import { cn } from "#/shared/lib/tailwind.ts";
import "#/features/glass-effect/styles/glass-item.css";

interface GlassWrapperProps {
  children: React.ReactNode;
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
