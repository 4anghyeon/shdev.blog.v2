import { cva, type VariantProps } from "class-variance-authority";
import type { PropsWithChildren } from "react";
import { cn } from "#/shared/lib/tailwind";

/**
 * 페이지 본문의 공통 틀. 너비와 좌우·하단 여백을 맞춘다.
 * 상단 여백은 두지 않는다. 헤더(Navbar) 높이가 본문 시작 위치를 정한다.
 */
const pageContainerVariants = cva("mx-auto w-full flex-1 px-4 pb-8", {
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
