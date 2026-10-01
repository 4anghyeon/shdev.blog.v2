import type { ComponentProps } from "react";
import { cn } from "#/shared/lib/tailwind";

export function LandscapeFrame({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn(
        "max-h-[40svh] overflow-hidden [@media(max-height:820px)]:max-h-[28svh]",
        className,
      )}
    >
      <div className="relative left-[clamp(calc(100%-max(100%,804px)),calc(50%-0.715*max(100%,804px)),0px)] aspect-1500/336 w-[max(100%,804px)]">
        {children}
      </div>
    </div>
  );
}
