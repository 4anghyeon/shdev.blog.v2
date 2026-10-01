import { useLocation } from "@tanstack/react-router";
import { cva } from "class-variance-authority";
import { LandscapeFrame } from "#/features/header/LandscapeFrame";
import { LandscapeImages } from "#/features/header/LandscapeImages";
import { ThemeToggleButton } from "#/features/theme/components/ThemeToggleButton";

// 그라데이션 자체는 전환되지 않으므로, 시작·끝 지점을 @property로 등록한 변수(styles.css)로 두고 그 값을 전환한다.
// 페이지를 오갈 때 흰 그라데이션이 서서히 걷히거나 덮인다. 전환 시간은 바뀐 뒤 상태(variant)의 duration을 따른다.
const landscapeRevealVariants = cva(
  "mask-[linear-gradient(to_bottom,black_var(--landscape-solid),transparent_var(--landscape-fade))] transition-[--landscape-solid,--landscape-fade] ease-out",
  {
    variants: {
      reveal: {
        // 글이 있는 페이지: 가독성을 위해 이미지 아래를 배경색으로 흐리게 덮는다 (다시 덮일 때는 빠르게)
        partial: "duration-500 [--landscape-fade:70%] [--landscape-solid:25%]",
        // about: 이미지를 온전히 보여준다 (서서히 드러나게)
        full: "duration-1000 [--landscape-fade:100%] [--landscape-solid:70%]",
      },
    },
  },
);

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
      <div
        aria-hidden
        className="mask-[linear-gradient(to_bottom,black_calc(100%-16px),transparent)] fixed inset-x-0 top-0 z-4 h-16 overflow-hidden bg-background lg:h-30"
      >
        <LandscapeFrame className={landscapeRevealVariants({ reveal })}>
          <LandscapeImages />
        </LandscapeFrame>
      </div>
      <LandscapeFrame className="pointer-events-none fixed inset-x-0 top-0 z-30">
        {/* 이미지 속 해/달 중심 좌표 (라이트/다크 이미지 모두 71.5%, 20.83%) */}
        <ThemeToggleButton className="pointer-events-auto absolute top-[20.83%] left-[71.5%]" />
      </LandscapeFrame>
    </>
  );
}
