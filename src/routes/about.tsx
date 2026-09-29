import { createFileRoute } from "@tanstack/react-router";
import { AboutIntro } from "#/features/about/components/AboutIntro";
import { LandscapeFrame } from "#/features/header/LandscapeFrame";

export const Route = createFileRoute("/about")({
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
