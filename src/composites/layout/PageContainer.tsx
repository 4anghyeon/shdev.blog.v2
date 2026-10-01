import { cva, type VariantProps } from "class-variance-authority";
import type { PropsWithChildren } from "react";
import { cn } from "#/shared/lib/tailwind";

const pageContainerVariants = cva("mx-auto w-full flex-1 px-5 pb-8 md:px-4", {
  variants: {
    width: {
      list: "max-w-2xl",
      wide: "max-w-4xl",
      article: "max-w-185",
    },
  },
});

interface PageContainerProps {
  width: NonNullable<VariantProps<typeof pageContainerVariants>["width"]>;
  className?: string;
}

export function PageContainer({
  width,
  className,
  children,
}: PropsWithChildren<PageContainerProps>) {
  return (
    <main className={cn(pageContainerVariants({ width }), className)}>
      {children}
    </main>
  );
}
