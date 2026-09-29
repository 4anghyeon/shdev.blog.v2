import type { ComponentProps } from "react";
import { cn } from "#/shared/lib/tailwind";

/**
 * 헤더 풍경 이미지(1500x336)와 같은 크기의 영역을 만든다.
 *
 * - 가로를 채우되 좁은 화면에서는 최소 높이 180px을 유지하려고 너비를 804px(= 180 * 1500 / 336) 이상으로 두고 좌우를 잘라낸다.
 * - 잘라낼 때는 해/달(가로 약 71.5% 지점)이 화면 가운데 오도록 left를 clamp로 계산해,
 *   좁은 화면에서도 테마 버튼이 오른쪽 검색 버튼과 겹치지 않게 한다. (넓은 화면에서는 left = 0)
 * - 세로가 짧은 화면에서는 아래쪽을 잘라 본문 공간을 확보한다.
 *
 * 이미지, 해/달 버튼, about 페이지의 여백이 모두 이 프레임을 공유하므로 크기와 위치가 항상 일치한다.
 * children은 프레임 기준 %로 배치하면 된다.
 */
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
      <div className="relative left-[clamp(calc(100%_-_max(100%,804px)),calc(50%_-_0.715_*_max(100%,804px)),0px)] aspect-1500/336 w-[max(100%,804px)]">
        {children}
      </div>
    </div>
  );
}
