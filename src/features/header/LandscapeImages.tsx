import { LandscapeBirds } from "#/features/header/LandscapeBirds";
import { cn } from "#/shared/lib/tailwind";

interface LandscapeSceneProps {
  background: string;
  tree: string;
  className: string;
}

/**
 * 한 테마의 풍경. 소나무를 지운 배경, 새, 흔들리는 소나무 레이어를 차례로 겹친다.
 */
function LandscapeScene({ background, tree, className }: LandscapeSceneProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 transition-opacity duration-700",
        className,
      )}
    >
      <img
        src={background}
        alt=""
        width={1500}
        height={336}
        className="absolute inset-0 size-full"
      />
      <LandscapeBirds />
      {/* 소나무 레이어(708x240)는 배경(1500x336)의 왼쪽 위 696x228 영역에 위·왼쪽으로 12px씩 덧댄 것이라 그만큼 밖으로 빼서 놓는다.
          회전축은 줄기가 화면 왼쪽으로 빠져나가는 지점(배경 기준 0, 185)이다. */}
      <img
        src={tree}
        alt=""
        width={708}
        height={240}
        className="absolute top-[-3.571%] left-[-0.8%] w-[47.2%] origin-[1.695%_82.083%] motion-safe:animate-pine-sway"
      />
    </div>
  );
}

// 테마는 페인트 전에 <html>.dark로 결정되므로 isDark 상태 대신 dark: 클래스로 전환해야
// SSR 첫 화면에서 잘못된 이미지가 깜빡이지 않는다. 두 풍경을 겹쳐 두고 opacity로 교차 전환한다.
export function LandscapeImages() {
  return (
    <>
      <LandscapeScene
        background="/images/about-landscape-hero.webp"
        tree="/images/about-landscape-tree.webp"
        className="text-[#a2a19b] dark:opacity-0"
      />
      <LandscapeScene
        background="/images/about-landscape-hero-dark.webp"
        tree="/images/about-landscape-tree-dark.webp"
        className="text-[#162448] opacity-0 dark:opacity-100"
      />
    </>
  );
}
