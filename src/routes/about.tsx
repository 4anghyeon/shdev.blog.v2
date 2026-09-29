import { createFileRoute } from "@tanstack/react-router";
import { AboutIntro } from "#/features/about/components/AboutIntro";
import { LandscapeFrame } from "#/features/header/LandscapeFrame";

export const Route = createFileRoute("/about")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="flex w-full flex-1 flex-col">
      {/* 헤더 풍경 이미지가 온전히 보이도록 같은 크기의 빈 공간을 둔다 (-mt-16: 내비게이션 높이만큼) */}
      <LandscapeFrame aria-hidden className="-mt-16" />
      <section className="mx-auto w-full max-w-3xl px-6 py-8 md:py-5">
        <AboutIntro />
      </section>
    </main>
  );
}
