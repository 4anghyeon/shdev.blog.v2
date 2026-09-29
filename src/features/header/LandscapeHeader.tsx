import { useLocation } from "@tanstack/react-router";
import { LandscapeFrame } from "#/features/header/LandscapeFrame";
import { LandscapeImages } from "#/features/header/LandscapeImages";
import { ThemeToggleButton } from "#/features/theme/components/ThemeToggleButton";
import { cn } from "#/shared/lib/tailwind";

/**
 * 화면 뒤에 고정되는 풍경 배경과 해/달 테마 버튼.
 * 본문은 이 배경 위로 스크롤되며, 이미지가 고정되어 있으므로 해/달 버튼도 항상 같은 자리에 있다.
 */
export function LandscapeHeader() {
  const isAbout = useLocation({ select: (loc) => loc.pathname === "/about" });

  return (
    <>
      <LandscapeFrame
        aria-hidden
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 -z-10",
          // about에서는 이미지를 온전히 보여주고, 그 외 페이지는 글의 가독성을 위해 아래를 배경색으로 흐리게 덮는다
          isAbout
            ? "mask-[linear-gradient(to_bottom,black_70%,transparent)]"
            : "mask-[linear-gradient(to_bottom,black_25%,transparent_70%)]",
        )}
      >
        <LandscapeImages />
      </LandscapeFrame>
      <LandscapeFrame className="pointer-events-none fixed inset-x-0 top-0 z-30">
        {/* 이미지 속 해/달 중심 좌표 (라이트/다크 이미지 모두 71.5%, 20.83%) */}
        <ThemeToggleButton className="pointer-events-auto absolute top-[20.83%] left-[71.5%]" />
      </LandscapeFrame>
    </>
  );
}
