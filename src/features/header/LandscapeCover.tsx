import { cva, type VariantProps } from "class-variance-authority";
import { LandscapeFrame } from "#/features/header/LandscapeFrame";
import { LandscapeImages } from "#/features/header/LandscapeImages";
import { cn } from "#/shared/lib/tailwind";

// 그라데이션 자체는 전환되지 않으므로, 시작·끝 지점을 @property로 등록한 변수(styles.css)로 두고 그 값을 전환한다.
// 페이지를 오갈 때 흰 그라데이션이 서서히 걷히거나 덮인다. 전환 시간은 바뀐 뒤 상태(variant)의 duration을 따른다.
export const landscapeRevealVariants = cva(
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

interface LandscapeCoverProps {
  reveal: NonNullable<VariantProps<typeof landscapeRevealVariants>["reveal"]>;
  className?: string;
}

/**
 * 고정 풍경 배경과 똑같이 보이면서, 그 아래로 스크롤되는 콘텐츠를 가리는 화면 상단 띠.
 */
export function LandscapeCover({ reveal, className }: LandscapeCoverProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "mask-[linear-gradient(to_bottom,black_calc(100%-16px),transparent)] fixed inset-x-0 top-0 overflow-hidden bg-background",
        className,
      )}
    >
      <LandscapeFrame className={landscapeRevealVariants({ reveal })}>
        <LandscapeImages />
      </LandscapeFrame>
    </div>
  );
}
