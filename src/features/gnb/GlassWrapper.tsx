import type * as React from "react";
import { GlassEffect } from "#/features/gnb/GlassEffect.tsx";
import { cn } from "#/shared/lib/tailwind.ts";

interface GlassWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassWrapper({ children, className }: GlassWrapperProps) {
  return (
    <div className={cn("glass-container z-10", className)}>
      <GlassEffect />
      <div className="glass-content">{children}</div>
    </div>
  );
}
