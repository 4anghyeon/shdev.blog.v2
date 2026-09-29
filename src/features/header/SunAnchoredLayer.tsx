import type { PropsWithChildren } from "react";
import { cn } from "#/shared/lib/tailwind";

/**
 * 풍경 프레임을 스크롤에 맞춰 위로 올리다가, 해/달이 100px 띠의 세로 가운데(50px)에 오면 멈춘다.
 *
 * - 맨 위(scrollY = 0)에서는 이동하지 않으므로 페이지 위의 큰 풍경(LandscapeHeader)과 픽셀이 정확히 겹친다.
 * - 멈추는 지점 = 해/달 y좌표 - 50px. 해/달 y좌표는 프레임 높이(= 프레임 너비 * 336 / 1500) * --sun-y 이고,
 *   프레임 너비는 LandscapeFrame과 같은 max(100cqw, 804px)이다. (cqw: 내비게이션을 @container로 둔 기준 너비)
 * - 해/달이 처음부터 50px보다 위에 있으면(좁은 화면) 아래로 내리지 않고 제자리에 둔다. (min(0px, …))
 * - --scroll-y는 LandscapeStrip, --sun-y는 내비게이션에서 정의한다.
 */
export function SunAnchoredLayer({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        "translate-y-[max(calc(var(--scroll-y)_*_-1),min(0px,calc(50px_-_var(--sun-y)_*_max(100cqw,804px)_*_0.224)))]",
        className,
      )}
    >
      {children}
    </div>
  );
}
