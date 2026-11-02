import { useLocation } from "@tanstack/react-router";
import {
  LandscapeCover,
  landscapeRevealVariants,
} from "#/features/header/LandscapeCover";
import { LandscapeFrame } from "#/features/header/LandscapeFrame";
import { LandscapeImages } from "#/features/header/LandscapeImages";
import { ThemeToggleButton } from "#/features/theme/components/ThemeToggleButton";

/**
 * 화면 뒤에 고정되는 풍경 배경과 해/달 테마 버튼.
 */
export function LandscapeHeader() {
  const isAbout = useLocation({ select: (loc) => loc.pathname === "/about" });
  const reveal = isAbout ? "full" : "partial";

  return (
    <>
      <LandscapeFrame
        aria-hidden
        className={landscapeRevealVariants({
          reveal,
          className: "pointer-events-none fixed inset-x-0 top-0 -z-10",
        })}
      >
        <LandscapeImages />
      </LandscapeFrame>
      <LandscapeCover reveal={reveal} className="z-4 h-16 lg:h-30" />
      <LandscapeFrame className="pointer-events-none fixed inset-x-0 top-0 z-30">
        {/* 이미지 속 해/달 중심 좌표 (라이트/다크 이미지 모두 71.5%, 20.83%) */}
        <ThemeToggleButton className="pointer-events-auto absolute top-[20.83%] left-[71.5%]" />
      </LandscapeFrame>
    </>
  );
}
