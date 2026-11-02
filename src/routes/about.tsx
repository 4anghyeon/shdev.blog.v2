import { createFileRoute } from "@tanstack/react-router";
import { AboutIntro } from "#/features/about/components/AboutIntro";
import { LandscapeFrame } from "#/features/header/LandscapeFrame";
import { BlogMeta } from "#/shared/constant/metadata";
import { headHelper } from "#/shared/helper/head";

export const Route = createFileRoute("/about")({
  head: () => ({
    ...headHelper.page({
      path: "about",
      title: "소개",
      description:
        "프론트엔드 개발자 이상현입니다. 만들어가는 과정에서 배운 것들과 쉬어가며 느낀 소소한 일상을 기록합니다.",
    }),
    scripts: [
      headHelper.jsonLd({
        ...headHelper.person(),
        jobTitle: "Frontend Developer",
        image: `${BlogMeta.baseUrl}images/profile.webp`,
      }),
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="flex w-full flex-1 flex-col">
      <LandscapeFrame aria-hidden className="-mt-16 lg:-mt-30" />
      <section className="mx-auto w-full max-w-3xl px-6 py-8 md:py-5">
        <AboutIntro />
      </section>
    </main>
  );
}
