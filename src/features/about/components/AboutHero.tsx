import { cn } from "#/shared/lib/tailwind";

const imageClassName =
  "mask-[linear-gradient(to_bottom,black_70%,transparent)] aspect-1500/336 max-h-[40svh] w-full object-cover [@media(max-height:820px)]:max-h-[28svh]";

// 테마가 .dark 클래스로 전환되므로 <picture>의 prefers-color-scheme 대신 두 이미지를 토글한다.
// loading="lazy"라서 display:none인 쪽 이미지는 내려받지 않는다.
export function AboutHero() {
  return (
    <div className="w-full overflow-hidden">
      <img
        src="/images/about-landscape-hero.webp"
        alt=""
        width={1500}
        height={336}
        loading="lazy"
        className={cn(imageClassName, "bg-stone-100 dark:hidden")}
      />
      <img
        src="/images/about-landscape-hero-dark.webp"
        alt=""
        width={1500}
        height={336}
        loading="lazy"
        className={cn(imageClassName, "hidden bg-stone-900 dark:block")}
      />
    </div>
  );
}
