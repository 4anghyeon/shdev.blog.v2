import { useLocation } from "@tanstack/react-router";
import { LandscapeFrame } from "#/features/header/LandscapeFrame";
import { LandscapeImages } from "#/features/header/LandscapeImages";
import { cn } from "#/shared/lib/tailwind";

// 페이지 맨 위에 깔리는 큰 풍경. 스크롤하면 함께 올라가고, 이후에는 내비게이션의 LandscapeStrip이 이어받는다.
export function LandscapeHeader() {
  const isAbout = useLocation({ select: (loc) => loc.pathname === "/about" });

  return (
    <LandscapeFrame
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 -z-10",
        // about에서는 이미지를 온전히 보여주고, 그 외 페이지는 본문을 가리지 않도록 아래를 흐리게 덮는다
        isAbout
          ? "mask-[linear-gradient(to_bottom,black_70%,transparent)]"
          : "mask-[linear-gradient(to_bottom,black_25%,transparent_70%)]",
      )}
    >
      <LandscapeImages />
    </LandscapeFrame>
  );
}
