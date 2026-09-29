import {
  type MotionStyle,
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import { LandscapeFrame } from "#/features/header/LandscapeFrame";
import { LandscapeImages } from "#/features/header/LandscapeImages";
import { SunAnchoredLayer } from "#/features/header/SunAnchoredLayer";
import { ThemeToggleButton } from "#/features/theme/components/ThemeToggleButton";

/**
 * 내비게이션 바의 배경으로 쓰는 풍경 띠와, 그 위의 해/달 테마 버튼.
 * 스크롤해도 내비게이션과 함께 고정되어 어디서든 테마를 바꿀 수 있다.
 *
 * 띠는 맨 위에서 내비게이션 높이(64px)로 시작해 스크롤한 만큼 늘어나 100px에서 멈춘다.
 * 처음부터 100px이면 맨 위에서 본문 첫 부분을 가리기 때문이다.
 */
export function LandscapeStrip() {
  const { scrollY } = useScroll();
  const scrollOffset = useTransform(scrollY, (y) => `${Math.max(y, 0)}px`);

  return (
    <motion.div
      className="contents"
      // MotionStyle 타입에는 CSS 변수 키가 없어 단언이 필요하다 (motion은 CSS 변수에도 MotionValue를 바인딩한다)
      style={{ "--scroll-y": scrollOffset } as MotionStyle}
    >
      <div
        aria-hidden
        className="mask-[linear-gradient(to_bottom,black_75%,transparent)] pointer-events-none absolute inset-x-0 top-0 -z-10 h-[clamp(64px,calc(64px+var(--scroll-y)),100px)] overflow-hidden"
      >
        <SunAnchoredLayer>
          <LandscapeFrame>
            <LandscapeImages />
          </LandscapeFrame>
        </SunAnchoredLayer>
      </div>
      {/* 버튼은 띠 밖으로 빛이 번지거나 맨 위에서 띠 아래로 걸칠 수 있으므로 잘리지 않는 별도 레이어에 둔다 */}
      <SunAnchoredLayer className="pointer-events-none absolute inset-x-0 top-0 z-30">
        <LandscapeFrame>
          <ThemeToggleButton className="pointer-events-auto absolute top-[calc(var(--sun-y)*100%)] left-(--sun-x)" />
        </LandscapeFrame>
      </SunAnchoredLayer>
    </motion.div>
  );
}
